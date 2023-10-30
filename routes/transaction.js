const express = require('express');
const Group = require('../models/Group');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const router = express.Router();

var fetchuser = require('../middleware/fetchUser');
var inGroup=require('../middleware/inGroup')
var verifygroup=require('../middleware/verifyGroup')
async function getTrans(groupId) {
    try {
     
      const transactions = await Transaction.find({ group_id: groupId });
  
      return transactions;
    } catch (error) {
      
      throw error; 
    }
  }
  async function getUserIdsForEmails(emails) {
    const userIds = [];
    for (const email of emails) {
      const user = await User.findOne({ email });
      if (user) {
        userIds.push(user._id);
      }
    }
    return userIds;
  }

  async function getOptimised(netBalances){
        
    const transactions = [];

    
    const sortedUsers = Array.from(netBalances.keys()).sort((a, b) => netBalances.get(a) - netBalances.get(b));

    
    let oweIndex = 0;
    let owedIndex = sortedUsers.length - 1;

    while (oweIndex < owedIndex) {
        const oweUser = sortedUsers[oweIndex];
        const owedUser = sortedUsers[owedIndex];

        const oweAmount = -netBalances.get(oweUser);
        const owedAmount = netBalances.get(owedUser);

        const amountToTransfer = Math.min(oweAmount, owedAmount);

        if (amountToTransfer > 0) {
            transactions.push({
            from: oweUser,
            to: owedUser,
            amount: amountToTransfer,
            });

            netBalances.set(oweUser, -(oweAmount - amountToTransfer));
            netBalances.set(owedUser, owedAmount - amountToTransfer);
        }

        if (netBalances.get(oweUser) === 0) {
            oweIndex++;
        }
        if (netBalances.get(owedUser) === 0) {
            owedIndex--;
        }
    }

    
    return transactions


  }

  async function getEmailByUserId(userId) {
    try {
      
      const user = await User.findById(userId);
  
      if (!user) {
        
        return null;
      }
  
     
      const email = user.email;
  
      return email;
    } catch (error) {
      
      
      throw error; 
    }
  }

  async function mainAlgo(groupId){
       var bills=await getTrans(groupId)
       var members=await Group.findById(groupId)
       var memberIds=members.user_ids
       var idbal=new Map()
    
       for(var i=0;i<memberIds.length;i++){
        var temp=memberIds[i].toHexString()
        idbal.set(temp,Number(0))
       }

       
       
       for(var i=0;i<bills.length;i++){
           var bill=bills[i]
           idbal.set(bill.from.toHexString(),idbal.get(bill.from.toHexString())+Number(bill.total_amount))
           
           for(var j=0;j<bill.to.length;j++){
             idbal.set(bill.to[j].toHexString(),idbal.get(bill.to[j].toHexString())-Number(bill.split_details[j]))
           }
       }
       console.log(idbal)
       
       var final_ti=await getOptimised(idbal)
       var final_t=final_ti

       for(var i=0;i<final_t.length;i++){
        final_t[i].from=await getEmailByUserId(final_t[i].from)
        final_t[i].to=await getEmailByUserId(final_t[i].to)
       }
       Group.findByIdAndUpdate(groupId,{optimal_transactions:final_t},{new:true},(err,data)=>{
           if(err)return err;
       })
       
  
  }

router.get('/:groupId',fetchuser,inGroup,async(req,res)=>{
    try{
        const all_trans=await getTrans(req.params.groupId)
        
        res.json(all_trans)

    }
    catch(error){
        res.status(500).send(error.message)
    }
     
})

router.post('/:groupId',fetchuser,inGroup,async(req,res)=>{
    try{
        user_from=await getUserIdsForEmails([req.body.from])
        user_to=await getUserIdsForEmails(req.body.to)
        const new_split=req.body.split.map(inp=>{return Number(inp)})
        
        

        const new_bill=await Transaction.create({
            from:user_from[0],
            to:user_to,
            total_amount:req.body.total,
            group_id:req.params.groupId,
            split_details:new_split,
        })
        const res2=await mainAlgo(req.params.groupId)
        
        res.json(new_bill)
    }
    catch(error){
        res.status(500).send(error.message)
    }

})


router.delete('/:groupId/:billId',fetchuser,inGroup,verifygroup,async(req,res)=>{
      try{
        const del_bill=await Transaction.findByIdAndDelete(req.params.billId)
        const res2=await mainAlgo(req.params.groupId)

        res.json(del_bill)


      }
      catch(error){
        res.status(500).send(error.message)
      }
})

router.post('/settle/:groupId',fetchuser,inGroup,async(req,res)=>{
    try{
        const new_settle=await Transaction.create({
            from:req.body.from,
            to:req.body.to,
            split_details:req.body.split,
            settled:true,
            group_id:req.params.groupId,
        })
        const res2=await mainAlgo(req.params.groupId)
        res.json(new_settle)

    }
    catch(err){
        res.status(500).send(err.message)
    }
})

module.exports=router
