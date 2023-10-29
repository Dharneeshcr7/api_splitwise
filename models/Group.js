const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Group schema
const groupSchema = new Schema({
    g_name: {
      type: String,
      required: true,
    },
    user_ids: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    optimal_transactions: [{
      from: {
        type: String,
        //ref: 'User',
      },
      to: {
        type: String,
        //ref: 'User',
      },
      amount: Number,
    }],
    
  });
  const Group = mongoose.model('group', groupSchema);
  module.exports = Group;