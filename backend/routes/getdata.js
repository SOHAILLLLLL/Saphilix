const express = require('express');
const router = express.Router();
const Product = require('../models/products');
router.get('/products', async (req, res) => {
    console.log('Fetching products...');
  try {
    const product = await Product.find();
    console.log('Products fetched successfully');
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/name/:name',  (req, res) => {
  console.log(`Fetching product by name: ${productName}`);
  try {
    const productName = req.params.name;
    const product =  Product.findOne({
      name: { $regex: new RegExp(`^${productName}$`, 'i') },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/prod',  (req, res) => {
  res.json({ message: 'Welcome to the product API' });  
});
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

// router.get()
router.get('/get-cart', async (req, res) => {
  console.log('Fetching cart items...');
  try {
    if (!req.session.cart || req.session.cart.length === 0) {
      return res.status(200).json({ cart: [] });
    }

    const detailedCart = await Promise.all(
      req.session.cart.map(async (item) => {
        const product = await Product.findById(item.productId).lean();
        if (!product) return null;

        return {
          id: product._id,
          productId: item.productId,
          name: product.name,
          price: product.price,
          photo: product.photo,
          quantity: item.quantity,
          totalPrice: product.price * item.quantity,
          originalPrice: product.originalPrice || null,
          discount: product.discount || 0,
        };
      })
    );
console.log(detailedCart+"detaik bro")
    // Remove nulls if product was deleted from DB
    const filteredCart = detailedCart.filter(item => item !== null);

    res.status(200).json({ cart: filteredCart });

  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// router.get('', async (req, res) => {
//   console.log('Fetching product by name...');
// });
router.get('/',  (req, res) => {
  console.log('Fetching all products...');
  res.json({ message: 'Welcome to the product API' });
});
module.exports = router;