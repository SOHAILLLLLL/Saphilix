const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Cart = require('../models/usercart'); // Your Mongoose Cart model
const Product = require('../models/products'); // Your Mongoose Product model
const mongoose = require('mongoose'); // Needed for mongoose.Types.ObjectId


async function getOrCreateCart(req, res, next) {
    let cartId = req.cookies.cart_id;
    let cart;

    try {
        if (req.user) { // Assuming req.user is populated after authentication
            cart = await Cart.findOne({ userId: req.user._id });
            if (!cart && cartId) {
                const anonymousCart = await Cart.findOne({ cartId: cartId });
                if (anonymousCart) {
                    anonymousCart.userId = req.user._id;
                    anonymousCart.cartId = undefined; // Clear anonymous ID
                    await anonymousCart.save();
                    cart = anonymousCart;
                    res.clearCookie('cart_id', { path: '/' }); // Clear client-side cookie
                }
            }
            if (!cart) {
                cart = new Cart({ userId: req.user._id });
                await cart.save();
            }
        } else { // Anonymous user
            if (cartId) {
                cart = await Cart.findOne({ cartId: cartId });
            }
            if (!cart) {
                cartId = uuidv4(); // Generate new ID for anonymous user
                cart = new Cart({ cartId: cartId });
                await cart.save();
            }
            // Always set/update the cart_id cookie for anonymous users
            res.cookie('cart_id', cartId, {
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Use secure in production
                sameSite: 'Lax',
                path: '/'
            });
        }
        req.cart = cart; // Attach the cart document to the request object
        next(); // Proceed to the next middleware/route handler
    } catch (error) {
        console.error('Error in getOrCreateCart middleware:', error);
        res.status(500).json({ error: 'Failed to retrieve or create cart.' });
    }
}

// --- New API Endpoint: Validate Cart and Get Summary ---
router.post('/validate', getOrCreateCart, async (req, res) => {
    console.log('Validating cart and generating summary newst...');
    const cart = req.cart; // Get the cart from the middleware
    const validatedCart = [];
    let subtotal = 0;
    let discountAmount = 0;
    const warnings = [];

    // Define a simple tax rate for demonstration (e.g., 5%)
    // In a real scenario, this would be dynamic based on location/product
    const TAX_RATE = 0.05;
    let taxAmount = 0;
    const shippingCost = 0.00; // Placeholder: Shipping is calculated later in checkout

    try {
        if (!cart || cart.items.length === 0) {
            return res.status(200).json({
                message: "Cart is empty.",
                validatedCart: [],
                billingSummary: {
                    subtotal: 0,
                    discountAmount: 0,
                    taxRate: TAX_RATE,
                    taxAmount: 0,
                    shippingCost: 0,
                    totalAmount: 0
                },
                warnings: []
            });
        }

        // Iterate through each item in the cart for validation and calculation
        for (const item of cart.items) {
            const product = await Product.findById(item.productId).lean();

            if (!product) {
                warnings.push(`Product "${item.name}" (ID: ${item.productId}) no longer exists and has been removed from your cart.`);
                // Optionally remove the item from the cart in DB here if you want to persist this change
                // await cart.removeItem(item.productId); // Uncomment if you want to auto-remove
                continue; // Skip this item
            }

            let validatedQuantity = item.quantity;
            let validatedPrice = item.price; // Start with price from cart item
            let itemDiscount = 0;

            // 1. Validate Quantity (Stock Check)
            // if (product.stock < item.quantity) {
            //     validatedQuantity = product.stock; // Adjust quantity to available stock
            //     warnings.push(`Quantity for "${product.name}" adjusted to ${validatedQuantity} due to low stock.`);
            //     if (validatedQuantity === 0) {
            //         warnings.push(`"${product.name}" is out of stock and will be removed from your cart.`);
            //         // If out of stock, effectively skip this item for calculation
            //         // await cart.removeItem(item.productId); // Uncomment to auto-remove from DB
            //         continue;
            //     }
            // }

            // 2. Validate Price (Compare with current product price)
            if (product.price !== item.price) {
                validatedPrice = product.price; // Use the current price from the product database
                warnings.push(`Price for "${product.name}" changed from $${item.price.toFixed(2)} to $${product.price.toFixed(2)}.`);
                item.price = validatedPrice;
            }

            // 3. Apply Product-Level Discount (if any)
            // Assuming product.discount is a number representing a fixed discount amount per item
            // or a percentage. Adjust logic based on your discount model.
            if (product.discount && product.discount > 0) {
                // Example: Fixed discount per item
                itemDiscount = product.discount;
                // Example: Percentage discount
                // itemDiscount = validatedPrice * (product.discount / 100);
                discountAmount += itemDiscount * validatedQuantity; // Accumulate total discount
            }

            cart.subtotal += validatedPrice * validatedQuantity
            // Add to validated cart array
            validatedCart.push({
                id: product._id, // Consistent with frontend's expectation of 'id'
                productId: product._id,
                name: product.name,
                price: validatedPrice,
                quantity: validatedQuantity,
                photo: product.photo || product.imageUrl || '/images/placeholder.jpg', // Use photo or imageUrl
                totalPrice: validatedPrice * validatedQuantity,
                originalPrice: product.originalPrice || validatedPrice, // Keep original if available
                discount: itemDiscount // Discount applied to this specific item
            });

            // Accumulate subtotal (before tax and shipping)
            subtotal += (validatedPrice * validatedQuantity);
        }

        // Recalculate subtotal after applying product-level discounts
        // This assumes discounts are applied to the item price before summing to subtotal
        // If discountAmount is a separate cart-level discount, adjust logic accordingly.
        const subtotalAfterDiscounts = subtotal - discountAmount;

        // Calculate Tax
        taxAmount = subtotalAfterDiscounts * TAX_RATE;

        // Calculate Final Total
        const totalAmount = subtotalAfterDiscounts + taxAmount + shippingCost;
        console.log({
            message: "Cart validated and summary generated successfully.",
            validatedCart: validatedCart,
            billingSummary: {
                subtotal: parseFloat(subtotal.toFixed(2)),
                discountAmount: parseFloat(discountAmount.toFixed(2)),
                taxRate: TAX_RATE,
                taxAmount: parseFloat(taxAmount.toFixed(2)),
                shippingCost: parseFloat(shippingCost.toFixed(2)),
                totalAmount: parseFloat(totalAmount.toFixed(2))
            },
            warnings: warnings
        })
        console.log("taiyaar ahaia pada")
        // cart.session = 
        await cart.save();
        console.log(cart)
        console.log("cart saved successfully")
        // Respond with validated cart and billing summary
        // ... (inside an Express route, for example)
        res.status(200).json({ message: "Cart updated successfully", cart: cart });

    } catch (error) {
        console.error('Error validating cart:', error);
        res.status(500).json({ error: 'Failed to validate cart and generate summary.' });
    }
});
// In your Express server.js or a dedicated authRoutes.js
// Make sure to import express, router, and use express.json() and cookie-parser()

// Dummy Auth Endpoints
router.post('/auth/send-otp', (req, res) => {
    const { phoneNumber } = req.body;
    if (phoneNumber) {
        console.log(`Dummy OTP sent to: ${phoneNumber}`);
        res.status(200).json({ message: 'OTP sent successfully (dummy).' });
    } else {
        res.status(400).json({ message: 'Phone number required.' });
    }
});

router.post('/auth/verify-otp', (req, res) => {
    const { phoneNumber, otp } = req.body;
    if (phoneNumber && otp === '123456') { // Hardcoded OTP for testing
        console.log(`Dummy OTP verified for: ${phoneNumber}`);
        // In a real app, you'd authenticate the user here
        // For now, we simulate a successful verification
        res.status(200).json({ message: 'OTP verified successfully (dummy).' });
    } else {
        res.status(400).json({ message: 'Invalid OTP or phone number.' });
    }
});

// Dummy /checkout/initiate endpoint (from previous discussion)
router.post('/checkout/initiate', async (req, res) => {
    // This is a simplified version. In real app, it fetches/validates cart.
    // For now, just return a dummy session ID.
    const dummyCheckoutSessionId = 'sess_' + Date.now() + Math.random().toString(36).substring(2, 9);
    console.log('Dummy checkout initiated:', dummyCheckoutSessionId);
    res.status(200).json({ checkoutSessionId: dummyCheckoutSessionId });
});

// Dummy /checkout/status endpoint
router.get('/checkout/status', async (req, res) => {
    const { sessionId } = req.query;
    // In a real app, fetch from CheckoutSession model
    console.log('Fetching dummy checkout session status for:', sessionId);
    // Simulate a checkout session with some items and calculated totals
    const dummySession = {
        _id: sessionId,
        items: [
            { productId: 'prod1', name: 'Wireless Headphones', price: 99.99, quantity: 1, imageUrl: 'https://placehold.co/80x80/E0E7FF/3B82F6?text=Headphones' },
            { productId: 'prod2', name: 'Smartwatch', price: 199.50, quantity: 2, imageUrl: 'https://placehold.co/80x80/E0E7FF/3B82F6?text=Smartwatch' },
        ],
        subtotal: 99.99 + (199.50 * 2), // 498.99
        shippingAddress: req.session.dummyShippingAddress || {}, // Persist dummy address in session
        shippingMethod: req.session.dummyShippingMethod || 'standard',
        shippingCost: req.session.dummyShippingCost || 0,
        taxAmount: req.session.dummyTaxAmount || 0,
        totalAmount: (req.session.dummySubtotal || 498.99) + (req.session.dummyShippingCost || 0) + (req.session.dummyTaxAmount || 0),
        status: 'initiated',
    };
    res.status(200).json({ checkoutSession: dummySession });
});

// Dummy /checkout/shipping endpoint
router.patch('/checkout/shipping', async (req, res) => {
    const { sessionId } = req.query;
    const { addressData, shippingMethod, shippingCost } = req.body;
    console.log(`Updating dummy shipping for ${sessionId}:`, addressData, shippingMethod, shippingCost);

    // Store dummy data in session for persistence across dummy calls
    req.session.dummyShippingAddress = addressData;
    req.session.dummyShippingMethod = shippingMethod;
    req.session.dummyShippingCost = shippingCost;
    req.session.dummySubtotal = 498.99; // Keep consistent for demo

    // Recalculate dummy total
    const dummyTax = req.session.dummyTaxAmount || 0;
    const dummyTotal = req.session.dummySubtotal + shippingCost + dummyTax;

    const updatedSession = {
        _id: sessionId,
        items: [
            { productId: 'prod1', name: 'Wireless Headphones', price: 99.99, quantity: 1, imageUrl: 'https://placehold.co/80x80/E0E7FF/3B82F6?text=Headphones' },
            { productId: 'prod2', name: 'Smartwatch', price: 199.50, quantity: 2, imageUrl: 'https://placehold.co/80x80/E0E7FF/3B82F6?text=Smartwatch' },
        ],
        subtotal: req.session.dummySubtotal,
        shippingAddress: addressData,
        shippingMethod: shippingMethod,
        shippingCost: shippingCost,
        taxAmount: dummyTax,
        totalAmount: dummyTotal,
        status: 'shipping_added',
    };
    res.status(200).json({ message: 'Shipping updated (dummy).', checkoutSession: updatedSession });
});

// Dummy /checkout/process-payment endpoint
router.post('/checkout/process-payment', async (req, res) => {
    const { sessionId } = req.query;
    const { paymentMethod, cardDetails } = req.body;
    console.log(`Processing dummy payment for ${sessionId} via ${paymentMethod}`);

    // Simulate success/failure
    if (cardDetails.cardNumber.startsWith('4')) { // Dummy success for cards starting with 4
        const orderId = 'order_' + Date.now() + Math.random().toString(36).substring(2, 9);
        const orderNumber = 'ORD-' + Math.floor(Math.random() * 100000);
        console.log(`Dummy payment successful. Order ID: ${orderId}`);
        // Clear dummy session data after successful order
        req.session.dummyShippingAddress = undefined;
        req.session.dummyShippingMethod = undefined;
        req.session.dummyShippingCost = undefined;
        req.session.dummySubtotal = undefined;
        req.session.dummyTaxAmount = undefined;

        res.status(200).json({
            message: 'Payment successful (dummy).',
            orderId: orderId,
            orderNumber: orderNumber,
            redirectUrl: `/order-confirmation?orderId=${orderId}`
        });
    } else {
        console.log('Dummy payment failed.');
        res.status(402).json({ message: 'Dummy payment failed. Try a card starting with 4.' });
    }
});

// Dummy Order Confirmation page route (for redirect)
router.get('/order-confirmation', (req, res) => {
    const { orderId } = req.query;
    res.send(`
        <div style="font-family: sans-serif; text-align: center; padding: 50px; background-color: #f0f4f8; min-height: 100vh;">
            <h1 style="color: #22c55e;">Order Confirmed!</h1>
            <p style="font-size: 1.2em; color: #334155;">Thank you for your purchase.</p>
            <p style="font-size: 1.1em; color: #475569;">Your Order ID: <strong style="color: #1e40af;">${orderId || 'N/A'}</strong></p>
            <p style="margin-top: 30px;"><a href="/" style="background-color: #3b82f6; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold;">Continue Shopping</a></p>
        </div>
    `);
});
module.exports = router;