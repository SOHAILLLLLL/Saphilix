const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Or ObjectId if linked to User
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  quantity: Number,
  totalPrice: Number,
  addedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CartItem', cartItemSchema);
