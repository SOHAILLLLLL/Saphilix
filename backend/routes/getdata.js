const express = require('express');
const router = express.Router();
const Product = require('../models/products');
const Cart = require('../models/usercart')
// checjed
//
router.get('/products', async (req, res) => {
  console.log('Fetching products...');
  try {
    const product = await Product.find();
    console.log('Products fetched successfully');
    res.json(product);
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
});
//prodcuts name complete 
//get name from url 
// find one matching exactly name 
// if name altered "message could not fetch that product just it!"
//
router.get('/pro/name/:name', async (req, res) => {
  const productName = req.params.name;
  console.log("Requested product name:", productName);

  try {
    const product = await Product.findOne({ name: productName });

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
async function findProductById(productId) {
  try {
    await client.connect();
    const database = client.db('yourDatabaseName'); // Replace with your database name
    const collection = database.collection('products'); // Replace with your collection name

    const product = await collection.findOne({ _id: new ObjectId(productId) });
    console.log(product);
  } catch (error) {
    console.error('Error finding product:', error);
  } finally {
    await client.close();
  }
}
// main thing 
//lets not see req.user if coondition for now

router.get('/get-cart', async (req, res) => {
  console.log('Fetching cart items...');
  let cartId = req.cookies.cart_id; // Get cartId from cookie
  let cart; // This will hold our  Cart documentfrom database

  try {
    // 1. Find the cart based on user (if logged in) or cookie
    if (req.user) { // Assuming req.user is populated after authentication (e.g., via Passport.js)
      // Try to find cart by userId first
      cart = await Cart.findOne({ userId: req.user._id });

      if (!cart && cartId) {
        // If user logged in but no cart associated, check if an anonymous cart exists
        const anonymousCart = await Cart.findOne({ cartId: cartId });
        if (anonymousCart) {
          // Adopt the anonymous cart: assign it to the logged-in user
          anonymousCart.userId = req.user._id;
          anonymousCart.cartId = undefined; // Clear the anonymous ID as it's now tied to a user
          await anonymousCart.save();
          cart = anonymousCart;
          // Important: Clear the cart_id cookie after adoption for this user
          res.clearCookie('cart_id', { path: '/' });
        }
      }
    }
    else { // Anonymous user
      if (cartId) {
        cart = await Cart.findOne({ cartId: cartId }); //populate the cart !
      }
    }
    if (!req.user && !req.cookies.cart_id) { // Only set if not logged in AND cookie wasn't there before
      return res.status(200).json({ cart: [] });

    }


    // 4. Transform cart items for the response format (similar to your old code)
    // We'll use Promise.all to fetch product details if they're not fully stored in the cart item sub-document.
    // However, our CartItem schema already stores name, price, and imageUrl.
    // We only need to fetch `photo` and `originalPrice`/`discount` from the Product model
    // if they are NOT stored in your CartItem schema, or if you want the very latest product data.

    const detailedCartItems = await Promise.all(
      cart.items.map(async (item) => {
        // Re-fetch some product details to ensure latest or specific fields like 'photo'
        // If 'photo' and 'originalPrice' are not in your CartItem schema,
        // you'll need to fetch them from the Product model.
        // If they ARE in your CartItem, you can skip this findById for these specific fields.
        const productFromDb = await Product.findById(item.productId).select('name price originalPrice discount').lean();

        // If product was deleted from DB, return null
        if (!productFromDb) {
          console.warn(`Product with ID ${item.productId} not found for cart item.`);
          return null;
        }

        return {
          productId: item._id,
          name: productFromDb.name,        // From CartItem
          price: productFromDb.price,      // From CartItem
          photo: productFromDb.photo, // From Product model (assuming it's not in CartItem)
          quantity: item.quantity,    // From CartItem
          totalPrice: item.price * item.quantity, // Calculate from CartItem price
          originalPrice: productFromDb.originalPrice || null, // From Product model
          discount: productFromDb.discount || 0, // From Product model
        };
      })
    );

    // Remove nulls if product was deleted from DB (and we returned null for it)
    const filteredCart = detailedCartItems.filter(item => item !== null);

    console.log("Detailed Cart:", filteredCart); // For debugging

    res.status(200).json({ cart: filteredCart });

  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});
// router.post('/validate', async(req,res) => )


router.get('/cart', async (req, res) => {
  let cartId = req.cookies.cart_id;
  let cart;

  try {
    if (req.user) { // Assuming req.user is populated after authentication
      // Try to find cart by userId
      cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
      if (!cart) {
        // If user logged in but no cart, check if an anonymous cart exists
        if (cartId) {
          const anonymousCart = await Cart.findOne({ cartId: cartId });
          if (anonymousCart) {
            // Adopt the anonymous cart by linking it to the user
            anonymousCart.userId = req.user._id;
            anonymousCart.cartId = undefined; // Clear anonymous ID
            await anonymousCart.save();
            cart = anonymousCart;
          }
        }
        if (!cart) {
          // Create a new cart for the logged-in user
          cart = new Cart({ userId: req.user._id });
          await cart.save();
        }
      }
    } else { // Anonymous user
      if (cartId) {
        cart = await Cart.findOne({ cartId: cartId }).populate('items.productId');
      }
      if (!cart) {
        // Generate a new cartId for anonymous user
        cartId = uuidv4();
        cart = new Cart({ cartId: cartId });
        await cart.save();
      }
    }

    // Set the cart_id cookie if it's new or updated for anonymous users
    if (!req.user && cartId) {
      res.cookie('cart_id', cartId, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure in production
        sameSite: 'Lax',
        path: '/'
      });
    }

    res.status(200).json(cart);

  } catch (error) {
    console.error('Error fetching/creating cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// router.get('', async (req, res) => {
//   console.log('Fetching product by name...');
// });
router.get('/', (req, res) => {
  console.log('Fetching all products...');
  res.json({ message: 'Welcome to the product API' });
});
module.exports = router;