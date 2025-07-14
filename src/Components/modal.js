import React, { useState } from "react";
import { X, Plus, Minus, ShoppingCart, Check } from "lucide-react";

const AddToCartModal = ({ isOpen, onClose, product = {}, setCartItems }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const increaseQuantity = () => setQuantity(q => q + 1);
  const decreaseQuantity = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  const handleAddToCart = async () => {
    if (!product._id) return;

    setIsAdding(true);
    //MAIN
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:8000"}/storedata/add-to-cart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ productId: product._id, quantity }),
        }
      );

      if (!response.ok) throw new Error("Failed to add to cart");

      const data = await response.json();
      console.log("Cart updated:", data.cart);

      setCartItems(prev => {
        const existingIndex = prev.findIndex(item => item._id === product._id);
        console.log("Existing index:");
        if (existingIndex !== -1) {
          const updated = [...prev];
          const item = { ...updated[existingIndex] }; // deep clone the item
          item.quantity += quantity;
          item.totalPrice = item.price * item.quantity;
          updated[existingIndex] = item;
          return updated;
        }

        return [
          ...prev,
          {
            ...product,
            quantity,
            totalPrice: product.price * quantity,
          },
        ];
      });

      setIsAdded(true);
    } catch (error) {
      console.error("Error adding to cart:", error.message);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Add to Cart</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Product Image */}
          <div className="flex justify-center">
            <img
              src={product.image || "/placeholder.jpg"}
              alt={product.name}
              className="w-32 h-32 object-cover rounded-xl shadow-lg"
            />
          </div>

          {/* Product Info */}
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <div className="flex justify-center gap-2 items-center">
              <span className="text-2xl font-bold text-pink-600">₹{product.price?.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-500 line-through">₹{product.originalPrice}</span>
              )}
            </div>
            <p className="text-sm text-gray-600">{product.size}</p>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-4">
            <div className="text-center">
              <label className="text-sm font-medium text-gray-700 block mb-3">Select Quantity</label>
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${quantity <= 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-pink-100 text-pink-600 hover:bg-pink-200 active:scale-95"
                    }`}
                >
                  <Minus size={16} />
                </button>
                <div className="bg-gray-50 px-6 py-3 rounded-xl min-w-[80px] text-center">
                  <span className="text-xl font-semibold">{quantity}</span>
                </div>
                <button
                  onClick={increaseQuantity}
                  className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 flex items-center justify-center transition-all active:scale-95"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Total Price */}
            <div className="bg-gray-50 rounded-xl p-4 flex justify-between">
              <span className="text-gray-700">Total:</span>
              <span className="text-xl font-bold text-pink-600">
                ₹{(product.price * quantity).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding || isAdded}
            className={`w-full py-4 px-6 rounded-xl font-semibold transition-all ${isAdded
                ? "bg-green-500 text-white"
                : isAdding
                  ? "bg-pink-300 text-white cursor-not-allowed"
                  : "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white hover:shadow-lg active:scale-98"
              }`}
          >
            <div className="flex items-center justify-center gap-2">
              {isAdded ? (
                <>
                  <Check size={20} />
                  Added to Cart!
                </>
              ) : isAdding ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCart size={20} />
                  Add to Cart
                </>
              )}
            </div>
          </button>

          {/* Continue Shopping */}
          <div className="text-center">
            <button
              onClick={onClose}
              className="text-sm text-gray-600 hover:text-pink-600 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;
