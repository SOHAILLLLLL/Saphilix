import React, { useState , useEffect} from 'react';
import { Star, Heart, ShoppingCart, Filter, Grid, List, Search, ArrowUpDown } from 'lucide-react';
import ComboSection from './combosection';
import { Link } from 'react-router-dom';
// import { useParams } from 'react-router-dom';  
// const Product = require('./models/products');
import axios from 'axios';
import AddToCartModal from './modal'; // Assuming you have a Modal component for cart actions
const SaphilixProductsPage = (props) => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [searchTerm, setSearchTerm] = useState("");
 const [products, setProducts] = useState([]);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
const [modalProduct, setModalProduct] = useState(null);
  useEffect(() => {
    axios.get('http://localhost:8000/data/products')
      .then(res => {
        setProducts(res.data); // if your backend sends { products: [...] }
      })
      .catch(err => {
        console.error('API error:', err);
      });
  }, []);
  // var products;
//   axios.get('http://localhost:8000/data', {
//   headers: {
//     'Content-Type': 'application/json'
//   }
// })
// .then(res => {
// products= res.data
//   console.log(res.data);
// })
// .catch(err => {
//   console.error(err);
// });

  const categories = [
    { id: 'all', name: 'All Products', count: products.length },
    { id: 'skincare', name: 'Skincare', count: products.filter(p => p.category === 'skincare').length },
    { id: 'makeup', name: 'Makeup', count: products.filter(p => p.category === 'makeup').length }
  ];
  var combos = products.filter(product =>
    product.isCombo === true
  );
  var filteredProducts = products.filter(product =>
    selectedCategory === 'all' || product.category === selectedCategory
  );
  filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const ProductCard = ({ product, isListView = false }) => (
    <>
      <div className={`group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-pink-200 ${isListView ? 'flex' : ''
        }`}>
          <Link
    to={`/product/${product.name}`}
    key={product._id}
    className="block"
  >
        {/* Product Image */}
        
        <div className={`relative overflow-hidden ${isListView ? 'w-48 flex-shrink-0' : 'aspect-square'}`}>
          <img
            src={product.image ||product.photos[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                New
              </span>
            )}
            {product.badge && (
              <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                {product.badge}
              </span>
            )}
            {product.discount > 0 && (
              <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                -{product.discount}%
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors duration-200">
              <Heart size={16} className="text-gray-600 hover:text-pink-500" />
            </button>
          </div>

          {/* Quick Add Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button onClick={(e) => {

        // e.stopPropagation();  // Stop bubbling to the Link
        // e.preventDefault(); 
        setIsCartModalOpen(true)  // Prevent Link navigation
        console.log("Button clicked only!");
        // Add wishlist logic here
      }} className="bg-white text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200 transform translate-y-4 group-hover:translate-y-0">
              Quick Add
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className={`p-4 ${isListView ? 'flex-1' : ''}`}>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={`${i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                    }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">({product.reviews})</span>
          </div>

          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors duration-200">
            {product.name}
          </h3>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        </div>
              </Link>
        <div className={`p-4 ${isListView ? 'flex-1' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            <button onClick={(e) => {

        // e.stopPropagation();  // Stop bubbling to the Link
        // e.preventDefault(); 
        setIsCartModalOpen(true) 
        setModalProduct(product) // Prevent Link navigation
        console.log("Button clicked only!");
        // Add wishlist logic here
      }}
      className="bg-gray-900 hover:bg-pink-600 text-white px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 text-sm font-medium">
              <ShoppingCart size={16} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
     {modalProduct && (
  <AddToCartModal
    isOpen={isCartModalOpen}
    onClose={() => setIsCartModalOpen(false)}
    product={modalProduct}
    setCartItems={props.setCartItems}
  />
)}

</>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Products</h1>
          <p className="text-gray-600">Discover premium cosmetics crafted for your beauty journey</p>
        </div>

        {/* Filters & Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                onChange={(e) => setSearchTerm(e.target.value)}

                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${selectedCategory === category.id
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>

            {/* Sort & View Controls */}
            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>

              <div className="flex border border-gray-300 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-pink-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-pink-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
        {searchTerm === "" ? (
          <>
            <div className="flex items-center justify-center mb-10">
              <div className="w-full max-w-4xl relative">
                <hr className="border-pink-300" />
                <span className="absolute left-1/2 transform -translate-x-1/2 -top-3 bg-pink-50 px-4 text-pink-800 font-bold text-lg tracking-wide uppercase">
                  Combos
                </span>
              </div>
            </div>

            <div className={`${viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'flex flex-col gap-4'
              }`}>
              {combos.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isListView={viewMode === 'list'}
                />
              ))}
            </div>
            <div className="flex items-center justify-center mb-10">
              <div className="w-full max-w-4xl relative">
                <hr className="border-pink-300" />
                <span className="absolute left-1/2 transform -translate-x-1/2 -top-3 bg-pink-50 px-4 text-pink-800 font-bold text-lg tracking-wide uppercase">
                  Singles
                </span>
              </div>
            </div>
            <div className={`${viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'flex flex-col gap-4'
              }`}>
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isListView={viewMode === 'list'}
                />
              ))}
            </div>
          </>
        ) : (
          filteredProducts.length > 0 ? (
            <div className={`${viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'flex flex-col gap-4'
              }`}>
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isListView={viewMode === 'list'}
                />
              ))}
            </div>) : (
            <div className="text-center text-gray-500 mt-10">
              No products found matching your search.
            </div>
          )

        )}
        {/* <ComboSection/> */}
        {/* Products Grid/List */}


        {/* Load More */}
        <div className="text-center mt-12">
          <button className="bg-gray-900 hover:bg-pink-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
            Load More Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaphilixProductsPage;