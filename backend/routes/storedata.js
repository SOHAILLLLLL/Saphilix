const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Cart = require('../models/usercart');
const Product = require('../models/products')
const { v4: uuidv4 } = require('uuid'); // npm install uuid
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
                    anonymousCart.cartId = undefined;
                    await anonymousCart.save();
                    cart = anonymousCart;
                    res.clearCookie('cart_id', { path: '/' });
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
                cartId = uuidv4();
                cart = new Cart({ cartId: cartId });
                await cart.save();
            }
            // Set/update the cart_id cookie for anonymous users
            if (!req.cookies.cart_id && cartId) {
                 res.cookie('cart_id', cartId, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'Lax',
                    path: '/'
                });
            }
        }
        req.cart = cart; // Attach the cart to the request object
        next(); // Proceed to the next middleware/route handler
    } catch (error) {
        console.error('Error in getOrCreateCart middleware:', error);
        res.status(500).json({ error: 'Failed to retrieve or create cart.' });
    }
}
router.post('/cart', async (req, res) => {
  const { productId, name, quantity, totalPrice } = req.body;
  const userId = req.user?._id || "guest"; // if you're using auth

  try {
    const cartItem = new CartItem({
      userId,
      _id,
      name,
      quantity,
      totalPrice
    });

    await cartItem.save();

    res.status(201).json({ message: "Item added to cart" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});

router.post('/remove-from-cart', (req, res) => {
  const { id } = req.body;

  if (!req.session.cart) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  req.session.cart = req.session.cart.filter(item => item.productId !== id);
  console.log('Item removed from cart:', id);
  console.log('Updated cart:', req.session.cart);
  res.json({ cart: req.session.cart });
});

router.delete('/remove/:productId', getOrCreateCart, async (req, res) => {
  console.log("Removing item from cart...");
  const { productId } = req.params;
  const cart = req.cart; // Cart retrieved by getOrCreateCart middleware

  if (!cart) {
    return res.status(404).json({ message: 'Cart not found.' }); // Should not happen with middleware
  }

  try {
    const productObjectId = new mongoose.Types.ObjectId(productId); // Ensure productId is ObjectId
    const itemInCart = cart.items.some(item => item.productId.equals(productObjectId));

    if (!itemInCart) {
      return res.status(404).json({ message: 'Product not found in cart.' });
    }

    await cart.removeItem(productObjectId); // Use the instance method

    // Fetch product details for the remaining items if needed for detailed response,
    // similar to your /get-cart logic. Or just send the raw cart object.
    const detailedCartItems = await Promise.all(
      cart.items.map(async (item) => {
        const productFromDb = await Product.findById(item.productId).select('photo originalPrice discount').lean();
        return productFromDb ? {
          id: item.productId,
          productId: item.productId,
          name: item.name,
          price: item.price,
          photo: productFromDb.photo,
          quantity: item.quantity,
          totalPrice: item.price * item.quantity,
          originalPrice: productFromDb.originalPrice || null,
          discount: productFromDb.discount || 0,
        } : null;
      })
    );
    const filteredCartItems = detailedCartItems.filter(item => item !== null);


    res.status(200).json({
      message: 'Product removed from cart successfully.',
      cart: {
        ...cart.toObject(), // Convert Mongoose document to plain JS object
        items: filteredCartItems // Replace with detailed items for response consistency
      }
    });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ error: 'Failed to remove item from cart.' });
  }
});

// 2. Update Quantity of Item in Cart
router.patch('/update-quantity/:productId', getOrCreateCart, async (req, res) => {
  const { productId } = req.params;
  const { newQuantity } = req.body;
  const cart = req.cart; // Cart retrieved by getOrCreateCart middleware

  if (!cart) {
    return res.status(404).json({ message: 'Cart not found.' }); // Should not happen
  }

  if (newQuantity === undefined || typeof newQuantity !== 'number' || newQuantity < 0) {
    return res.status(400).json({ message: 'Invalid or missing newQuantity.' });
  }

  try {
    const productObjectId = new mongoose.Types.ObjectId(productId); // Ensure productId is ObjectId
    const itemInCart = cart.items.some(item => item.productId.equals(productObjectId));

    if (!itemInCart) {
      return res.status(404).json({ message: 'Product not found in cart.' });
    }

    await cart.updateItemQuantity(productObjectId, newQuantity); // Use the instance method

    // Fetch product details for the remaining items if needed for detailed response
    const detailedCartItems = await Promise.all(
      cart.items.map(async (item) => {
        const productFromDb = await Product.findById(item.productId).select('photo originalPrice discount').lean();
        return productFromDb ? {
          id: item.productId,
          productId: item.productId,
          name: item.name,
          price: item.price,
          photo: productFromDb.photo,
          quantity: item.quantity,
          totalPrice: item.price * item.quantity,
          originalPrice: productFromDb.originalPrice || null,
          discount: productFromDb.discount || 0,
        } : null;
      })
    );
    const filteredCartItems = detailedCartItems.filter(item => item !== null);


    res.status(200).json({
      message: 'Product quantity updated successfully.',
      cart: {
        ...cart.toObject(), // Convert Mongoose document to plain JS object
        items: filteredCartItems // Replace with detailed items for response consistency
      }
    });
  } catch (error) {
    console.error('Error updating item quantity:', error);
    res.status(500).json({ error: 'Failed to update item quantity.' });
  }
});

router.post('/add-to-cart', async (req, res) => {
  const { productId, quantity } = req.body;
  let cartId = req.cookies.cart_id;
  let cart;

  if (!productId || !quantity || quantity < 1) {
    return res.status(400).json({ message: 'Product ID and valid quantity are required.' });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Find cart based on user (if logged in) or cookie
    if (req.user) {
      cart = await Cart.findOne({ userId: req.user._id });
    } else if (cartId) {
      cart = await Cart.findOne({ cartId: cartId });
    }

    if (!cart) {
      // If no cart found, create a new one
      if (req.user) {
        cart = new Cart({ userId: req.user._id });
      } else {
        cartId = uuidv4(); // Generate new ID for anonymous cart
        cart = new Cart({ cartId: cartId });
        res.cookie('cart_id', cartId, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Lax',
          path: '/'
        });
      }
      await cart.save();
    }

    await cart.addItem(product, quantity); // Use the instance method

    res.status(200).json(cart);

  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
