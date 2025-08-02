import React, { use } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
// import {  } from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL; // Use environment variable or default to localhost
const ShoppingCart = (props) => {
  const [cartItems, setCartItems] = useState([])
  const [d, setD] = useState(0);
  // In your frontend JavaScript (e.g., in a React component, or a plain JS file)
  async function proceedToCheckout() {
    try {
      const response = await fetch(API_URL + "/validateData/validate", {
        method: 'POST', // Use POST as it's performing an action (validation, calculation)
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include' // Important for sending the cart_id cookie
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to validate cart.');
      }
      // const { checkoutSessionId } = response.json();

      // if (!checkoutSessionId) {
      //   throw new Error("Checkout session ID not received from backend.");
      // }

      // console.log("Checkout initiated successfully. Session ID:", checkoutSessionId);

      // 3. Redirect the user to the first checkout step (Shipping Information)
      // Pass the checkoutSessionId as a URL query parameter

      const data = await response.json();
      console.log('Validated Cart Data:', data.cart);
      props.setCartItems(data.cart)
      window.location.href = `/checkout`;
      if (data.warnings && data.warnings.length > 0) {
        // Display warnings to the user (e.g., in a modal or alert)
        alert('Please review your cart:\n\n' + data.warnings.join('\n'));
      }

      // Store the validated cart and billing summary temporarily in frontend state
      // or pass it as query parameters/session storage if redirecting to a new page
      // For example, using React Context or Redux, or just local state.

      // Now, redirect the user to the first step of your checkout process
      // (e.g., shipping address page)
      // window.location.href = '/checkout/shipping'; // Or whatever your first checkout route is

    } catch (error) {
      console.error('Error during checkout initiation:', error.message);
      alert(`Could not proceed to checkout: ${error.message}. Please try again.`);
    }
  }

  // Attach this function to your "Proceed to Checkout" button
  // <button onclick="proceedToCheckout()">Proceed to Checkout</button>

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`${API_URL}/data/get-cart`, { withCredentials: true });
        setCartItems(response.data.cart);
        console.log(response.data.cart)
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    }
    fetchCartItems();
  }, [d]);


  const updateQuantity = async (id, q) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/storedata/update-quantity/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          // Pass the cartId in a custom header
          
        },
        body: JSON.stringify({ newQuantity: q }),
      });

      if (!response.ok) throw new Error('Failed to remove item');
      if (q <= 0) {
        removeItem(id);
        return;
      }
      const updatedItems = cartItems.map(item =>
        item.productId === id ? { ...item, quantity: q } : item
      );
      setCartItems(updatedItems);

    } catch (error) {
      console.error('Remove item error:', error);
      alert('Could not Add item. Please try again.');
    }

  };

  const removeItem = async (id) => {
    try {
      console.log(id + "bro is herre")
      const response = await fetch(`${process.env.REACT_APP_API_URL}/storedata/remove/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to remove item');
      // const data = await response.json();
      // setD(True);
      // setCartItems(["noo",]);
      setD(prev => prev + 1);
      // const updatedCart = await response.json();

      // setCartItems(updatedCart);
    } catch (error) {
      console.error('Remove item error:', error);
      alert('Could not remove item. Please try again.');
    }

  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalSavings = () => {
    return cartItems.reduce((total, item) => {
      const original = item.originalPrice || item.price;
      return total + ((original - item.price) * item.quantity);
    }, 0);
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 pt-24">
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <ShoppingBag className="mx-auto h-24 w-24 text-gray-300 mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some items to get started!</p>
          <Link to="/products">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 pt-24">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <ShoppingBag className="h-7 w-7 text-blue-600" />
                Shopping Cart ({getTotalItems()} items)
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {cartItems.map((item) => (
                <div key={item.productId} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex gap-4">
                    <div className="relative">
                      <img
                        src={item.photo || '/placeholder.jpg'}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-xl"
                      />
                      {item.discount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          -{item.discount}%
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-800 leading-tight">
                          {item.name}
                        </h3>
                        <button className="text-gray-400 hover:text-red-500 transition-colors p-1">
                          <Heart className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl font-bold text-gray-900">₹{item.price}</span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-lg text-gray-500 line-through">₹{item.originalPrice}</span>
                        )}
                        {item.originalPrice && (
                          <span className="text-sm text-green-600 font-medium">
                            Save ₹{((item.originalPrice - item.price) * item.quantity).toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                          >
                            <Minus className="h-4 w-4 text-gray-600" />
                          </button>
                          <span className="w-12 text-center font-medium text-gray-800">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                          >
                            <Plus className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            console.log(item.productId + "npothing");
                            removeItem(item.productId);
                          }}
                          className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm font-medium"
                        >
                          <Trash2 className="h-4 w-3" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({getTotalItems()} items)</span>
                <span>₹{getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Total Savings</span>
                <span>-₹{getTotalSavings().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>₹{(getTotalPrice() * 0.08).toFixed(2)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-xl font-bold text-gray-800">
                  <span>Total</span>
                  <span>₹{(getTotalPrice() * 1.08).toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Link to="/checkout">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 mb-4" onClick={() => proceedToCheckout()}>
                Proceed to Checkout
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>

            <Link to="/products">
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium">
                Continue Shopping
              </button>
            </Link>

            <div className="mt-6 p-4 bg-green-50 rounded-xl">
              <div className="flex items-center gap-2 text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Free shipping on orders over ₹1000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
