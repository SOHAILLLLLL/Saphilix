import './App.css';
import Navbar from  './Components/navbar'
import Home from  './Components/home'
// import Products from './Components/product'
// import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Products from './Components/productspage';
import ProductPage from './Components/product';
// import Modal from './Components/modal';
import ShoppingCart from './Components/cart';
// import { CartProvider } from './Components/cartcontext';
import { useState } from 'react';
// import CartContext from './Components/cartcontext';
function App() {
    const [cartItems, setCartItems] = useState([]);
  
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products cartItems={cartItems} setCartItems={setCartItems}/>} />
        <Route path="/product/:name" element={<ProductPage cartItems={cartItems} setCartItems={setCartItems}/>} />
        <Route path="/mycart" element={<ShoppingCart cartItems={cartItems} setCartItems={setCartItems}/>
        } />
        {/* <Route path="/addto" element={<Modal />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
