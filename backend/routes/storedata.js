const express = require('express');
const router = express.Router();
const CartItem = require('../models/usercart');
router.post('/cart', async (req, res) => {
  const { productId, name, quantity, totalPrice } = req.body;
  const userId = req.user?._id || "guest"; // if you're using auth

  try {
    const cartItem = new CartItem({
      userId,
      productId,
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
router.post('/add-to-cart', (req, res) => {
  const { productId, quantity } = req.body;

  if (!req.session.cart) {
    req.session.cart = [];
  }

  const existing = req.session.cart.find(item => item.productId === productId);
  if (existing) {
    console.log('Item already in cart, updating quantity');
    existing.quantity += quantity;
  } else {
    req.session.cart.push({ productId, quantity });
  }
  console.log('Cart updated:', req.session.cart);
  res.json({ cart: req.session.cart });
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
// POST /storedata/update-cart
router.post('/storedata/update-cart', (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = req.session.cart;
    const index = cart.findIndex(item => item.productId === productId);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      cart.splice(index, 1);
    } else {
      // Update quantity and total price
      cart[index].quantity = quantity;
      cart[index].totalPrice = cart[index].price * quantity;
    }

    req.session.cart = cart;

    res.status(200).json(cart);
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// router.get('/get-cart')

module.exports = router;
