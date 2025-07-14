const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  price: Number,
  originalPrice: Number,
  rating: Number,
  reviews: Number,
  discount: Number,
  image: String,
  description: String,
  badge: String,
  keyFeatures: [String],
  ingredients: [String],
  size: String,
  expiry: String,
  isNew: Boolean,
  isCombo: Boolean,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
