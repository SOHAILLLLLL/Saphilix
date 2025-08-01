// models/CheckoutSession.js (example)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const checkoutSessionItemSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    imageUrl: { type: String },
}, { _id: false });

const checkoutSessionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false }, // Only if logged in
    cartId: { type: String, required: false }, // Original anonymous cart ID
    items: [checkoutSessionItemSchema], // Snapshot of the cart items
    subtotal: { type: Number, default: 0, min: 0 },
    totalQuantity: { type: Number, default: 0, min: 0 },
    shippingAddress: { type: Object, default: {} }, // Will be filled later
    billingAddress: { type: Object, default: {} },   // Will be filled later
    shippingMethod: { type: String, default: '' },
    shippingCost: { type: Number, default: 0, min: 0 },
    taxAmount: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, default: 0, min: 0 }, // Subtotal + shipping + tax
    status: {
        type: String,
        enum: ['initiated', 'shipping_added', 'billing_added', 'payment_pending', 'payment_failed', 'completed', 'abandoned'],
        default: 'initiated'
    },
    paymentIntentId: { type: String }, // For Stripe, etc.
    expiresAt: { type: Date, required: true }, // For cleanup of abandoned sessions
    // You might add a reference to the actual order once it's created
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: false }
}, {
    timestamps: true
});

module.exports = mongoose.model('CheckoutSession', checkoutSessionSchema);