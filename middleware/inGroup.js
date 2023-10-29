const express = require('express');
const Group = require('../models/Group');

const ingroup=async(req,res,next)=>{
      const my_users=(await Group.findOne({_id:req.params.groupId})).user_ids;
      //const g_user=new ObjectId(req.user.id)

      //console.log(my_users,req.user.id)
      if (my_users.indexOf(req.user.id) === -1){
          res.status(400).send('U are not in the group')
      }
      else{
          next();
      }
}
module.exports=ingroup;