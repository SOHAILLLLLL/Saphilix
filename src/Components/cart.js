// import React from 'react';
// import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Heart } from 'lucide-react';
// import { Link } from 'react-router-dom';



// const ShoppingCart = ({ cartItems, setCartItems }) => {
//   const updateQuantity = async (productId, newQuantity) => {
//     try {
//       const response = await fetch(`${API_URL}/storedata/update-cart`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify({ productId, quantity: newQuantity }),
//       });

//       if (!response.ok) throw new Error('Failed to update cart');

//       const updatedCart = await response.json();

//       setCartItems(updatedCart); // assuming backend returns updated cart
//     } catch (error) {
//       console.error('Update quantity error:', error);
//       alert('Could not update item quantity. Please try again.');
//     }
//   };

//   const removeItem = async (productId) => {
//     try {
//       const response = await fetch(`${API_URL}/storedata/remove-from-cart`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify({ productId }),
//       });

//       if (!response.ok) throw new Error('Failed to remove item');

//       const updatedCart = await response.json();

//       setCartItems(updatedCart);
//     } catch (error) {
//       console.error('Remove item error:', error);
//       alert('Could not remove item. Please try again.');
//     }
//   };

//   const getTotalPrice = () =>{
//     if (!Array.isArray(cartItems)) return 0;
//     return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);}

//   const getTotalItems = () =>{
//     if (!Array.isArray(cartItems)) return 0;
//     return cartItems.reduce((total, item) => total + item.quantity, 0);}

//   const getTotalSavings = () =>{
//     if (!Array.isArray(cartItems)) return 0;

//     return cartItems.reduce((total, item) => {
//       const original = item.originalPrice || item.price;
//       return total + (original - item.price) * item.quantity;
//     }, 0);}

//   if (!cartItems || cartItems.length === 0) {
//     return (
//       <div className="max-w-4xl mx-auto p-6 pt-24">
//         <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
//           <ShoppingBag className="mx-auto h-24 w-24 text-gray-300 mb-6" />
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
//           <p className="text-gray-600 mb-8">Add some items to get started!</p>
//           <Link to="/products">
//             <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors">
//               Continue Shopping
//             </button>
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-6 pt-24">
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Cart Items */}
//         <div className="lg:col-span-2">
//           <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//             <div className="p-6 border-b border-gray-100">
//               <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
//                 <ShoppingBag className="h-7 w-7 text-blue-600" />
//                 Shopping Cart ({getTotalItems()} items)
//               </h2>
//             </div>
//             <div className="divide-y divide-gray-100">
//               {cartItems.map((item) => (
//                 <div key={item.productId} className="p-6 hover:bg-gray-50 transition-colors">
//                   <div className="flex gap-4">
//                     <div className="relative">
//                       <img
//                         src={item.photo || '/placeholder.jpg'}
//                         alt={item.name}
//                         className="w-24 h-24 object-cover rounded-xl"
//                       />
//                       {item.discount > 0 && (
//                         <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
//                           -{item.discount}%
//                         </span>
//                       )}
//                     </div>
//                     <div className="flex-1">
//                       <div className="flex justify-between items-start mb-2">
//                         <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
//                         <button className="text-gray-400 hover:text-red-500 p-1">
//                           <Heart className="h-5 w-5" />
//                         </button>
//                       </div>
//                       <div className="flex items-center gap-2 mb-4">
//                         <span className="text-2xl font-bold text-gray-900">₹{item.price}</span>
//                         {item.originalPrice && item.originalPrice > item.price && (
//                           <>
//                             <span className="text-lg text-gray-500 line-through">₹{item.originalPrice}</span>
//                             <span className="text-sm text-green-600 font-medium">
//                               Save ₹{((item.originalPrice - item.price) * item.quantity).toFixed(2)}
//                             </span>
//                           </>
//                         )}
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                           <button
//                             onClick={() => updateQuantity(item.productId, item.quantity - 1)}
//                             className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
//                           >
//                             <Minus className="h-4 w-4 text-gray-600" />
//                           </button>
//                           <span className="w-12 text-center font-medium text-gray-800">{item.quantity}</span>
//                           <button
//                             onClick={() => updateQuantity(item.productId, item.quantity + 1)}
//                             className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
//                           >
//                             <Plus className="h-4 w-4 text-gray-600" />
//                           </button>
//                         </div>
//                         <button
//                           onClick={() => removeItem(item._id)}
//                           className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm font-medium"
//                         >
//                           <Trash2 className="h-4 w-4" /> Remove
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Order Summary */}
//         <div className="lg:col-span-1">
//           <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
//             <h3 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h3>
//             <div className="space-y-4 mb-6">
//               <div className="flex justify-between text-gray-600">
//                 <span>Subtotal ({getTotalItems()} items)</span>
//                 <span>₹{getTotalPrice().toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-green-600">
//                 <span>Total Savings</span>
//                 <span>-₹{getTotalSavings().toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-gray-600">
//                 <span>Shipping</span>
//                 <span className="text-green-600">FREE</span>
//               </div>
//               <div className="flex justify-between text-gray-600">
//                 <span>Tax</span>
//                 <span>₹{(getTotalPrice() * 0.08).toFixed(2)}</span>
//               </div>
//               <div className="border-t pt-4">
//                 <div className="flex justify-between text-xl font-bold text-gray-800">
//                   <span>Total</span>
//                   <span>₹{(getTotalPrice() * 1.08).toFixed(2)}</span>
//                 </div>
//               </div>
//             </div>

//             <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 mb-4">
//               Proceed to Checkout
//               <ArrowRight className="h-5 w-5" />
//             </button>

//             <Link to="/products">
//               <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium">
//                 Continue Shopping
//               </button>
//             </Link>

//             <div className="mt-6 p-4 bg-green-50 rounded-xl">
//               <div className="flex items-center gap-2 text-green-700">
//                 <div className="w-2 h-2 bg-green-500 rounded-full" />
//                 <span className="text-sm font-medium">Free shipping on orders over ₹1000</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShoppingCart;
// make this code also products ready and bug free like a professional developer
// This code is a React component for a shopping cart page. 
// It allows users to view, update, and remove items in their cart, as well as proceed to checkout.
// in update quatity and remove item make api request to update cart in session.

import React, { use } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
// import {  } from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const ShoppingCart = ({ }) => {
  const [cartItems, setCartItems] = useState([])
  const [d, setD] = useState(0);
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`${API_URL}/data/get-cart`, { withCredentials: true });
        setCartItems(response.data.cart);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    }
    fetchCartItems();
  }, [d]);
  // useEffect(() => {
  //   axios.get('http://localhost:8000/data/get-cart')
  //     .then(res => {
  //       setCartItems(res.data.cart);
  //     })
  //     .catch(err => {
  //       console.error('API error:', err);
  //     });
  // },[]);
  const updateQuantity = async (id, newQuantity) => {
    try {
      const response = await fetch(`${API_URL}/storedata/update-cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ id, newQuantity }),
      });

      if (!response.ok) throw new Error('Failed to remove item');
      if (newQuantity <= 0) {
        removeItem(id);
        return;
      }
      const updatedItems = cartItems.map(item =>
        item.productId === id ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedItems);

    } catch (error) {
      console.error('Remove item error:', error);
      alert('Could not Add item. Please try again.');
    }

  };

  const removeItem = async (id) => {
    try {
      const response = await fetch(`${API_URL}/storedata/remove-from-cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error('Failed to remove item');
      // const data = await response.json();
      // setD(True);
      // setCartItems(["noo",]);
      setD(prev => prev+1);
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
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                          >
                            <Plus className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm font-medium"
                        >
                          <Trash2 className="h-4 w-4" /> Remove
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

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 mb-4">
              Proceed to Checkout
              <ArrowRight className="h-5 w-5" />
            </button>

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
