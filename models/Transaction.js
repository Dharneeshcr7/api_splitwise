const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionSchema = new Schema({
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    to: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    total_amount: Number,
    split_details: [{
      // user: {
      //   type: mongoose.Schema.Types.ObjectId,
      //   ref: 'User',
      // },
      type: Number,
    }],
    group_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
    },
    settled:{
      type:Boolean,
      default:false,
    },
  });
  const Transactions = mongoose.model('transactions', transactionSchema);
  module.exports = Transactions;