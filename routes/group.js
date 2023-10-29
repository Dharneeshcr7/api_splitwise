const express = require('express');
const Group = require('../models/Group');
const User = require('../models/User');
const router = express.Router();

var fetchuser = require('../middleware/fetchUser');
var inGroup=require('../middleware/inGroup')


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

router.post('/',fetchuser,async(req,res)=>{
    try{
      
      const new_group=await Group.create({
         g_name:req.body.group_name,
         user_ids:[req.user.id],
      })
      res.json(new_group)
    }
    catch(error){
        res.status(500).json(error.message)

    }
})

router.post('/adduser/:groupId',fetchuser,inGroup,async(req,res)=>{
  try{
    const add_ids=await getUserIdsForEmails(req.body.emails)
    const group = await Group.findById(req.params.groupId);

    if (group) {
      
      group.user_ids = [...group.user_ids, ...add_ids];

      const updatedGroup = await group.save();
      res.json(updatedGroup)
    } else {
      res.status(400).send('Group not found');
      
    }
  }
  catch(error){
    res.status(500).json(error.message)
  }

})

router.get('/getDeal/:groupId',fetchuser,inGroup,async(req,res)=>{
  try{
    const group = await Group.findById(req.params.groupId);

    if (!group) {
      res.status(400).send('group not found')
    }

    // Return the optimized transactions from the group document
    //console.log(group)
    res.json(group.optimal_transactions);

  }
  catch(error){
    res.status(500).json(error.message)
  }
})

router.delete('/deleteuser/:groupId',fetchuser,inGroup,async(req,res)=>{
  try{
    const del_ids2=(await getUserIdsForEmails(req.body.emails))
    const del_ids=del_ids2.map(userid=>userid.toHexString())
    const group = await Group.findById(req.params.groupId);
    console.log(del_ids,group.user_ids)
    if (group) {
      
      group.user_ids = group.user_ids.filter(userId => !del_ids.includes(userId.toHexString()));
      console.log(group.user_ids)
      const updatedGroup = await group.save();
      res.json(updatedGroup)
    } else {
      res.status(400).send('Group not found');
      
    }

  }
  catch(error){
    res.status(500).send(error.message)
  }

})

router.get('/',fetchuser,async(req,res)=>{
  try{
    const groups = await Group.find({ user_ids: req.user.id });
    res.json(groups)

  }
  catch(error){
    res.status(500).send(error.message)
  }
  
})

router.get('/getusers/:groupId',fetchuser,inGroup,async(req,res)=>{
  try{
    const users=await Group.findById(req.params.groupId)
    if (!users) {
      
      res.status(400).send('Group not found')
    }
    const userIDs = users.user_ids;

    
    const groupMembersInfo = await User.find({ _id: { $in: userIDs } }, 'name email');
    res.json(groupMembersInfo)
  }
  catch(error){
    res.status(500).send(error.message)
  }
  
})
module.exports=router