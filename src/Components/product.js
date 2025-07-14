import React, { useState, useEffect } from "react";
import { Star, Heart, Share2, ShoppingCart, Truck, Shield, Award, ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CartProvider from "./modal";

const dii = {
  comments: [
    { user: "Priya Sharma", text: "Amazing sunscreen! Light texture and no white cast. Perfect for daily use.", rating: 5, verified: true },
    { user: "Arjun Patel", text: "Great protection and my skin looks brighter after using it for a month.", rating: 4, verified: true },
    { user: "Sneha Roy", text: "Love the vitamin C benefits. Doesn't make my skin oily at all!", rating: 5, verified: false }]
}

export default function ProductPage(props) {
  const photos = ["https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=500&h=500&fit=crop"]
  const [comments, setComments] = useState(dii.comments || []);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    rating: 0,
    reviews: 0,
    price: 0,
    originalPrice: 0,
    discount: 0,
    photos: ["https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=500&h=500&fit=crop"],
    description: "",
    keyFeatures: [],
    ingredients: [],
    size: "",
    expiry: ""
  });
  const [loading, setLoading] = useState(true);
  const { name } = useParams();
  console.log("Product Name:", name);
  useEffect(() => {
    // /'+  encodeURIComponent(name)
    axios.get('http://localhost:8000/data/pro/name/' + encodeURIComponent(name))
      .then(res => {
        console.log("Product fetched successfully:", res.data);
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('API error:', err);
        setLoading(false);
      });
    // axios.get(`http://localhost:8000/product/name`).then(res => {console.log("done")}

  }, [name]);
  useEffect(() => {
    // /'+  encodeURIComponent(name)
    axios.get('http://localhost:8000/data/prod')
      .then(res => {
        console.log("Products fetched successfully");
      })
      .catch(err => {
        console.error('API error:', err);
        setLoading(false);
      });
    // axios.get(`http://localhost:8000/product/name`).then(res => {console.log("done")}

  }, [name]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, {
        user: "You",
        text: newComment,
        rating: newRating,
        verified: false
      }]);
      setNewComment("");
      setNewRating(5);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.photos.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.photos.length) % product.photos.length);
  };

  const renderStars = (rating, size = 16) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={size}
        className={
          i < Math.floor(rating)
            ? "fill-amber-400 text-amber-400"
            : i < rating
              ? "fill-amber-200 text-amber-400"
              : "text-gray-300"
        }
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-gray-600">
            <span>Beauty</span>
            <span className="mx-2">›</span>
            <span>Skincare</span>
            <span className="mx-2">›</span>
            <span>Sunscreen</span>
            <span className="mx-2">›</span>
            <span className="text-pink-600 font-medium">DOT & KEY</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden group">
              <div className="aspect-square relative">
                <img
                  src={photos[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Navigation arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <ChevronLeft size={20} className="text-gray-700" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <ChevronRight size={20} className="text-gray-700" />
                </button>

                {/* Wishlist button */}
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-300"
                >
                  <Heart
                    size={20}
                    className={isWishlisted ? "text-red-500 fill-red-500" : "text-gray-600"}
                  />
                </button>
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-3 justify-center">
              {product.photos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative rounded-lg overflow-hidden transition-all duration-300 ${index === currentImageIndex
                      ? 'ring-2 ring-pink-500 ring-offset-2 scale-105'
                      : 'hover:scale-105'
                    }`}
                >
                  <img
                    src={photo}
                    alt={`Product view ${index + 1}`}
                    className="w-16 h-16 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-6">
            {/* Product Title & Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating, 18)}
                </div>
                <span className="text-lg font-semibold text-gray-700">{product.rating}</span>
                <span className="text-gray-500">({product.reviews.toLocaleString()} reviews)</span>
              </div>
            </div>

            {/* Price Section */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-pink-600">₹{product.price}</span>
                <span className="text-lg text-gray-500 line-through">₹{product.originalPrice}</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-semibold">
                  {product.discount}% OFF
                </span>
              </div>
              <p className="text-sm text-gray-600">Inclusive of all taxes</p>
            </div>

            {/* Key Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Benefits</h3>
              <div className="grid grid-cols-1 gap-3">
                {product.keyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                <div className="text-sm text-gray-600 mb-1">Size</div>
                <div className="font-semibold text-gray-900">{product.size}</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                <div className="text-sm text-gray-600 mb-1">Expiry</div>
                <div className="font-semibold text-gray-900">{product.expiry}</div>
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-gray-700 font-medium">Quantity:</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setIsCartModalOpen(true)}

                  className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
                  Add to Cart
                </button>
                <button className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
                  Buy Now
                </button>
              </div>
            </div>
            <CartProvider
              isOpen={isCartModalOpen}
              onClose={() => setIsCartModalOpen(false)}
              product={product}
              setCartItems={props.setCartItems} 
            />
            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center p-3 bg-white rounded-xl shadow-lg border border-gray-100">
                <Truck className="text-green-600 mb-2" size={24} />
                <span className="text-xs text-gray-600">Free Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-white rounded-xl shadow-lg border border-gray-100">
                <Shield className="text-blue-600 mb-2" size={24} />
                <span className="text-xs text-gray-600">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-white rounded-xl shadow-lg border border-gray-100">
                <Award className="text-purple-600 mb-2" size={24} />
                <span className="text-xs text-gray-600">Top Brand</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Description</h2>
          <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Ingredients</h3>
          <div className="flex flex-wrap gap-2">
            {product.ingredients.map((ingredient, index) => (
              <span
                key={index}
                className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {ingredient}
              </span>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>

          {/* Add Review Form */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setNewRating(i + 1)}
                      className="transition-colors duration-200"
                    >
                      <Star
                        size={24}
                        className={
                          i < newRating
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300 hover:text-amber-300"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Share your experience with this product..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <button
                  onClick={handleAddComment}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Post Review
                </button>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {comments.map((comment, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{comment.user}</h4>
                      {comment.verified && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(comment.rating, 14)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}