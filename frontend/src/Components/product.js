import React, { useState, useEffect } from "react";
import { Star, Heart, Share2, ShoppingCart, Truck, Shield, Award, ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CartProvider from "./modal";

// Dummy data for comments, can be removed if comments come from API
const dii = {
  comments: [
    { user: "Priya Sharma", text: "Amazing sunscreen! Light texture and no white cast. Perfect for daily use.", rating: 5, verified: true },
    { user: "Arjun Patel", text: "Great protection and my skin looks brighter after using it for a month.", rating: 4, verified: true },
    { user: "Sneha Roy", text: "Love the vitamin C benefits. Doesn't make my skin oily at all!", rating: 5, verified: false }
  ]
};

export default function ProductPage(props) {
  // --- State Hooks ---
  const [comments, setComments] = useState(dii.comments || []);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  const [product, setProduct] = useState({
    name: "Loading Product...",
    rating: 0,
    reviews: 0,
    price: 0,
    originalPrice: 0,
    discount: 0,
    photos: ["data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"], // Placeholder 1x1 transparent gif
    description: "Loading description...",
    keyFeatures: [],
    ingredients: [],
    size: "",
    expiry: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { name } = useParams();

  // --- Data Fetching Effect ---
  useEffect(() => {
    // Reset state for new product loading
    setLoading(true);
    setError(null);

    // Using the correct IP address for mobile access
    axios.get(`http://10.98.119.194:8000/data/pro/name/${encodeURIComponent(name)}`)
      .then(res => {
        // Ensure photos array is not empty
        // if (res.data && res.data.photos && res.data.photos.length > 0) {
        //   setProduct(res.data);
        // } else {
        //   // Fallback if photos array is missing or empty
        //   setProduct({ ...res.data, photos: ["https://images.unsplash.com/photo-1580852300654-229824941437?w=500&h=500&fit=crop"] });
        // }
        if(res.data){
          setProduct(res.data)
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('API error:', err);
        setError("Could not load product details. Please try again later.");
        setLoading(false);
      });

    // -- LOGIC FIX 1: Removed the second, redundant useEffect hook that used localhost --

  }, [name]);


  // --- Render Functions & Handlers ---
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-violet-50 text-purple-800">Loading Product Details...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-700">{error}</div>;
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, { user: "You", text: newComment, rating: newRating, verified: false }]);
      setNewComment("");
      setNewRating(5);
    }
  };

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % product.photos.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + product.photos.length) % product.photos.length);

  const renderStars = (rating, size = 16) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={size} className={i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"} />
    ));
  };

  return (
    // -- THEME CHANGE: Replaced pink/rose with a new lavender/purple theme --
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 text-gray-800">
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-gray-600">
            <span>Beauty</span><span className="mx-2">›</span>
            <span>Skincare</span><span className="mx-2">›</span>
            <span className="text-purple-600 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Images */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden group">
              <div className="aspect-square relative">
                {/* -- LOGIC FIX 2: Using product.photos for main image -- */}
                <img
                  src={product.photos[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"><ChevronLeft size={20} className="text-gray-700" /></button>
                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"><ChevronRight size={20} className="text-gray-700" /></button>
                <button onClick={() => setIsWishlisted(!isWishlisted)} className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-300"><Heart size={20} className={isWishlisted ? "text-red-500 fill-red-500" : "text-gray-600"} /></button>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              {product.photos.map((photo, index) => (
                <button key={index} onClick={() => setCurrentImageIndex(index)} className={`relative rounded-lg overflow-hidden transition-all duration-300 ${index === currentImageIndex ? 'ring-2 ring-purple-500 ring-offset-2 scale-105' : 'hover:scale-105'}`}>
                  <img src={photo} alt={`Product view ${index + 1}`} className="w-16 h-16 md:w-20 md:h-20 object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-2">{product.name}</h1>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">{renderStars(product.rating, 18)}</div>
                <span className="text-lg font-semibold text-gray-700">{product.rating.toFixed(1)}</span>
                <span className="text-gray-500">({product.reviews.toLocaleString()} reviews)</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-purple-600">₹{product.price}</span>
                <span className="text-lg text-gray-500 line-through">₹{product.originalPrice}</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-semibold">{product.discount}% OFF</span>
              </div>
              <p className="text-sm text-gray-600">Inclusive of all taxes</p>
            </div>

            {product.keyFeatures.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Benefits</h3>
                <ul className="space-y-2">
                  {product.keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-gray-700 font-medium">Quantity:</label>
                <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
                  {[1, 2, 3, 4, 5].map(num => <option key={num} value={num}>{num}</option>)}
                </select>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => setIsCartModalOpen(true)} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]">Add to Cart</button>
                <button className="flex-1 bg-violet-500 hover:bg-violet-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]">Buy Now</button>
              </div>
            </div>
          </div>
        </div>

        {/* Description & Reviews */}
        <div className="mt-12 space-y-8">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Description</h2>
            <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
            {product.ingredients.length > 0 && (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Ingredients</h3>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ingredient, index) => (
                    <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">{ingredient}</span>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
            <div className="bg-gray-50 rounded-xl p-6 mb-8 border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-1">{/* Rating Stars */}</div>
                {/* -- RESPONSIVE FIX: Review form now stacks on mobile -- */}
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <input type="text" placeholder="Share your experience..." value={newComment} onChange={(e) => setNewComment(e.target.value)} className="w-full flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  <button onClick={handleAddComment} className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">Post Review</button>
                </div>
              </div>
            </div>
            <div className="space-y-6">{/* Reviews List */}</div>
          </div>
        </div>
      </div>
      <CartProvider
        isOpen={isCartModalOpen}
        onClose={setIsCartModalOpen}
        product={product}
        setCartItems={props.setCartItems}
      />
    </div>
  );
}