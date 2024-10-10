
const express=require('express');
const { addStaffController, deleteSpecificeStaffController, getAllStaffController, getSpecificStaffController, changeActiveStatusController } = require('../controllers/staffController');

const router=express.Router();

router.post('/add-staff',addStaffController);

router.post('/delete-staff',deleteSpecificeStaffController)

router.post('/get-all-staff',getAllStaffController);

router.post('/get-staff',getSpecificStaffController);

router.post('/change-status',changeActiveStatusController)

module.exports=router