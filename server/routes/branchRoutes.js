const express=require('express');
const { createBranchController, getAllBranchController } = require('../controllers/branchController');

const router=express.Router();

router.post('/create-branch',createBranchController);

router.post('/get-all-branch',getAllBranchController);

module.exports=router;
