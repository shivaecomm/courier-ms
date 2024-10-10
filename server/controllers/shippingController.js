const admin = require('firebase-admin'); // Import Firebase Admin SDK
const { getDownloadURL, ref, uploadBytesResumable,getStorage } = require('firebase/storage');
const firebase = require('../helpers/firebase');
const serviceAccount = require('../courier_ms');
const shippingModel = require('../models/shippingDetailsModel');

const sharp = require('sharp'); // For image compression
const { PDFDocument } = require('pdf-lib'); // For PDF compression
const crypto = require('crypto'); // For generating file hashes
const zlib = require('zlib'); // For gzipping other files

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://courier-ms.appspot.com',
  });


// Utility function to generate SHA-256 hash for file deduplication
const getFileHash = (buffer) => {
    return crypto.createHash('sha256').update(buffer).digest('hex');
};

// Utility function for compressing PDFs
const compressPDF = async (buffer) => {
    const pdfDoc = await PDFDocument.load(buffer);
    return pdfDoc.save({ useObjectStreams: false }); // Optimize PDF without object streams
};

// Utility function for gzipping other file types
const gzip = (buffer) => {
    return new Promise((resolve, reject) => {
        zlib.gzip(buffer, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};


const createShippingController = async (req, res) => {
    try {
        const formData = req.body;
        const downloadURLs = []; // Array to hold download URLs for files
        const files = req.files; // This will contain all uploaded files
        
        // Log the form data for verification
        console.log('Form Data:', formData);

        // Parse the dimensions from string to object
        let dimensions;
        if (formData.dimensions) {
            dimensions = JSON.parse(formData.dimensions);
        } else {
            dimensions = { length: null, breadth: null, height: null }; // Fallback if dimensions are not provided
        }

        // Object to hold the URLs for documents
        const documents = {};

        // Combine all the different file fields into a single array
        let allFiles = [];
        if (files.invoiceCopy) allFiles = allFiles.concat(files.invoiceCopy);
        if (files.courierSlip) allFiles = allFiles.concat(files.courierSlip);
        if (files.cargoPhoto) allFiles = allFiles.concat(files.cargoPhoto);
        if (files.boa) allFiles = allFiles.concat(files.boa);
        if (files.shippingBill) allFiles = allFiles.concat(files.shippingBill);
        if (files.courierBill) allFiles = allFiles.concat(files.courierBill);
        if (files.otherDocuments) allFiles = allFiles.concat(files.otherDocuments);

        // Create a placeholder for storing hashes and downloadURLs after processing
        const fileProcessingPromises = allFiles.map(async (item) => {
            const fileHash = getFileHash(item.buffer); // Generate file hash for deduplication

            // Check if the file already exists in the database (deduplication)
            const existingFile = await shippingModel.findOne({ fileHash });
            if (existingFile) {
                console.log('Duplicate file detected. Skipping upload for:', item.originalname);
                return { url: existingFile.fileUrl, fieldname: item.fieldname }; // Skip further processing if the file already exists
            }

            const storage = getStorage(firebase);
            const storageRef = ref(storage, `files/${item.originalname}`);

            let compressedBuffer;

            // Check the file type and compress accordingly
            if (item.mimetype.startsWith('image/')) {
                // Compress image using sharp
                compressedBuffer = await sharp(item.buffer)
                    .resize({ width: 1000 }) // Resize image to 1000px width (maintaining aspect ratio)
                    .jpeg({ quality: 80 }) // Compress JPEG to 80% quality
                    .toBuffer();
            } else if (item.mimetype === 'application/pdf') {
                // Compress PDF using pdf-lib
                compressedBuffer = await compressPDF(item.buffer);
            } else {
                // For other files, gzip them
                compressedBuffer = await gzip(item.buffer);
            }

            // Upload the compressed file to Firebase Storage
            const uploadTask = uploadBytesResumable(storageRef, compressedBuffer);

            // Wait for the upload to complete
            return new Promise((resolve, reject) => {
                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log(`Upload is ${progress.toFixed(2)}% done`);
                    },
                    (error) => {
                        console.error('Upload error:', error);
                        reject(error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref)
                            .then((downloadURL) => {
                                console.log('File available at', downloadURL);

                                // Return the file hash and download URL to process later
                                resolve({
                                    downloadURL,
                                    fieldname: item.fieldname,
                                    fileHash,
                                });
                            })
                            .catch(reject);
                    }
                );
            });
        });

        // Wait for all files to finish uploading and processing
        const uploadedFiles = await Promise.all(fileProcessingPromises);

        // Populate the documents object and update the downloadURLs array
        uploadedFiles.forEach(({ downloadURL, fieldname, fileHash }) => {
            downloadURLs.push({ url: downloadURL, fieldname });

            // Map the download URL to the appropriate field in documents
            if (fieldname === 'invoiceCopy') {
                documents.invoiceCopy = downloadURL;
            } else if (fieldname === 'courierSlip') {
                documents.courierSlip = downloadURL;
            } else if (fieldname === 'cargoPhoto') {
                documents.cargoPhoto = downloadURL;
            } else if (fieldname === 'boa') {
                documents.BOA = downloadURL;
            } else if (fieldname === 'shippingBill') {
                documents.shippingBill = downloadURL;
            } else if (fieldname === 'courierBill') {
                documents.courierBill = downloadURL;
            } else if (fieldname === 'otherDocuments') {
                if (!documents.otherDocuments) documents.otherDocuments = [];
                documents.otherDocuments.push(downloadURL);
            }
        });

        // Create new shipping document with populated documents object
        const newShipping = new shippingModel({
            ...formData,
            dimensions: dimensions, // Use the parsed dimensions object
            documents: documents, // Populate the documents with URLs
        });

        // Save the new shipping document to the database
        await newShipping.save();

        // Return a success response with the download URLs
        return res.status(200).send({
            success: true,
            message: 'Shipping created successfully',
            downloadURLs, // Send the download URLs in the response
            newShipping,
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

  



const getAllShippingDetailsController = async (req, res) => {
    try {
        const shippings = await shippingModel.find();

        if (!shippings || shippings.length === 0) {
            return res.status(404).send({ message: 'No shipments found', success: false });
        }

        // Initialize the array to hold shipment details with pending status
        const pendingShipment = [];

        for (let item of shippings) {
            const documents = item?.documents || {};
            const hasPendingDocuments = 
                !documents.invoiceCopy || 
                !documents.shippingBill || 
                !documents.cargoPhoto || 
                !documents.courierSlip || 
                !documents.BOA;

            pendingShipment.push({ item, pending: hasPendingDocuments });
        }

        return res.status(200).send({
            success: true,
            message: 'Fetched',
            shippings: pendingShipment // Return the array with the pending status
        });
    } catch (error) {
        console.log('Error fetching shipping details:', error.message);
        return res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
};

const getAllPendingDocumentsShippingController = async (req, res) => {
    try {
        const shippings = await shippingModel.find();

        if (!shippings || shippings.length === 0) {
            return res.status(404).send({ message: 'No shipments found', success: false });
        }

        // Use filter to create an array of pending shipments
        const pendingShipment = shippings.filter(item => {
            const documents = item?.documents || {};
            return !documents?.invoiceCopy || 
                   !documents?.shippingBill || 
                   !documents?.cargoPhoto || 
                   !documents?.courierSlip || 
                   !documents?.BOA; // Check if any of these documents are missing
        });

        return res.status(200).send({ message: 'Fetched', success: true, pendingShipment });
        
    } catch (error) {
        console.log('Error fetching pending shipments:', error.message);
        return res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
};

module.exports = { createShippingController ,getAllShippingDetailsController,getAllPendingDocumentsShippingController};
