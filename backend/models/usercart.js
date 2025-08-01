const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the CartItem Schema
// This sub-schema will be embedded within the Cart schema
const cartItemSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product', // Reference to your Product model
        required: true
    },
    name: {
        type: String,
        required: true // Store product name to avoid extra lookup for display
    },
    price: {
        type: Number,
        required: true, // Store price at the time of addition (important for price changes)
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    imageUrl: {
        type: String // Optional: store image URL for display
    }
}, { _id: false }); // _id: false because these are sub-documents and don't need their own _id

// Define the Cart Schema
const cartSchema = new Schema({
    // This is the ID that would typically be stored in a cookie for anonymous users
    // You could also use the default _id field if you always associate with a user
    cartId: {
        type: String,
        unique: true, // Ensure each cart has a unique identifier
        index: true,  // For faster lookups
        required: function() { return !this.userId; } // Required if no userId is present
    },
    // Reference to the User model if the cart belongs to a logged-in user
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to your User model
        unique: true, // A user should generally only have one active cart
        sparse: true // Allows multiple documents to have a null userId
    },
    items: [cartItemSchema], // An array of cartItemSchema documents
    totalQuantity: {
        type: Number,
        default: 0,
        min: 0
    },
    subtotal: {
        type: Number,
        default: 0,
        min: 0
    },
    // Optional: To track the state of the cart (e.g., 'active', 'abandoned', 'converted_to_order')
    status: {
        type: String,
        enum: ['active', 'abandoned', 'converted'],
        default: 'active'
    }
}, {
    timestamps: true // Adds `createdAt` and `updatedAt` fields automatically
});

// --- Instance Methods or Static Methods (Optional but very useful) ---

// Method to add an item to the cart
cartSchema.methods.addItem = function(product, quantity) {
    const existingItemIndex = this.items.findIndex(item => item.productId.equals(product._id));

    if (existingItemIndex > -1) {
        // Item already exists, update quantity
        this.items[existingItemIndex].quantity += quantity;
    } else {
        // Add new item
        this.items.push({
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            imageUrl: ""// Assuming product has an imageUrl field
        });
    }
    this.updateTotals(); // Recalculate totals
    return this.save();
};

// Method to remove an item from the cart
cartSchema.methods.removeItem = function(productId) {
    const initialLength = this.items.length;
    this.items = this.items.filter(item => !item.productId.equals(productId));
    if (this.items.length < initialLength) {
        this.updateTotals(); // Recalculate totals only if an item was removed
        return this.save();
    }
    return Promise.resolve(this); // No change, return resolved promise
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = function(productId, newQuantity) {
    const item = this.items.find(item => item.productId.equals(productId));
    if (item && newQuantity >= 1) {
        item.quantity = newQuantity;
        this.updateTotals();
        return this.save();
    } else if (item && newQuantity === 0) {
        // If quantity is 0, remove the item
        return this.removeItem(productId);
    }
    return Promise.reject(new Error('Item not found or invalid quantity.'));
};

// Method to clear the cart
cartSchema.methods.clearCart = function() {
    this.items = [];
    this.totalQuantity = 0;
    this.subtotal = 0;
    return this.save();
};

// Method to calculate and update total quantity and subtotal
cartSchema.methods.updateTotals = function() {
    this.totalQuantity = this.items.reduce((acc, item) => acc + item.quantity, 0);
    this.subtotal = this.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
};


// Create the Cart Model
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;