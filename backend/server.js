const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Product = require('./models/products');
const User = require('./models/user');
const Order = require('./models/orders');
const Comment = require('./models/comments');
const CartItem = require('./models/usercart'); // Uncomment if you need cart functionality 
const session = require('express-session');

const app = express();
app.use(cors(
    {origin: "http://localhost:3000",  // your React frontend
    credentials: true   // allow session cookies from frontend
    }
));
app.use(express.json());

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true, // creates session even if not modified
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// MongoDB Atlas Connection
mongoose.connect('mongodb+srv://memonsohilsalim:memonsohil78dd.@cluster0.zsxf4fb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('✅ MongoDB Atlas connected');
  await Product.init();
  await User.init();
  await Order.init();
  await Comment.init();
  await CartItem.init();
})
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
console.log('📂 Setting up routes...');
app.use('/data', require('./routes/getdata'));
app.use('/storedata', require('./routes/storedata'));
// app.use('/product', require('./routes/product'));
// app.use('/nodata', require('./routes/getdata'));
// Listen on one port only
app.listen(8000, () => {
  console.log('🚀 Server running on http://localhost:8000');
});
