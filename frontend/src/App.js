import './App.css';
import Navbar from './Components/navbar';
import Home from './Components/home';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'; // Import useLocation
import Products from './Components/productspage';
import ProductPage from './Components/product';
import ShoppingCart from './Components/cart';
import { useState } from 'react';
import Checkout from './Components/checkingOut';

function App() {
  const [cartItems, setCartItems] = useState([]);

  // Create a component that uses useLocation to conditionally render Navbar
  const AppContent = () => {
    const location = useLocation(); // Get the current location object

    // Check if the current path is NOT '/checkout'
    const shouldShowNavbar = location.pathname !== '/checkout';

    return (
      <>
        {shouldShowNavbar && <Navbar />} {/* Conditionally render Navbar */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products cartItems={cartItems} setCartItems={setCartItems} />} />
          <Route path="/product/:name" element={<ProductPage cartItems={cartItems} setCartItems={setCartItems} />} />
          <Route path="/mycart" element={<ShoppingCart cartItems={cartItems} setCartItems={setCartItems} />} />
          <Route path="/checkout" element={<Checkout />} />
          {/* <Route path="/addto" element={<Modal />} /> */}
        </Routes>
      </>
    );
  };

  return (
    <BrowserRouter>
      {/* Render the AppContent component which contains the conditional Navbar */}
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
