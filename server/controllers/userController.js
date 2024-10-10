const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken');
const userModel = require('../models/userModel');

const registerController = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Check for missing fields
        if (!name || !email || !phone || !password) {
            return res.status(400).send({ success: false, message: 'Please provide all the details' });
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email: email });
        if (existingUser) {
            return res.status(409).send({ success: false, message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Create new user
        const newUser = new userModel({ name, email, phone, password: hashedPassword });
        await newUser.save();

        return res.status(201).send({ success: true, message: 'User created. Please login.' });
    } catch (error) {
        console.error('Error during user registration:', error.message); // More descriptive error logging
        return res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
};


const loginController=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).send({success:true,message:'Please provide email and password'})
        }
        const user=await userModel.findOne({email:email});
        if(!user){
            return res.status(400).send({success:true,message:'User does not exist'});
        }
        const isMatch=bcryptjs.compare(password,user?.password);
        if(!isMatch){
            return res.status(400).send({success:true,message:'Email Id or Password invalid'});
        }

        const token=jwt.sign({id:user?._id},process.env.JWT_SECRET_KEY,{expiresIn:'1d',});
        return res.status(200).send({success:true,message:'Logged In',user,token});

    }catch(error){
        console.log(error.message);
        return res.status(500).send({success:false,message:'Internal Server Error'})
    }

}

module.exports={registerController,loginController};