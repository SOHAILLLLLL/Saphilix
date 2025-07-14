const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: String,
  item: String,
  quantity: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
