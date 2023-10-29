const express = require('express');
const Group = require('../models/Group');
const Transaction = require('../models/Transaction');

const verifygroup=async(req,res,next)=>{
      const bill=await Transaction.findById(req.params.billId);
      if(bill==null)res.status(400).send('Bill no more available')
      if(bill.group_id!=req.params.groupId){
        res.status(400).send('U are not in that group')
      }
      else{
        next()
      }
}

module.exports=verifygroup