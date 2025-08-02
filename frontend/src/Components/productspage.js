import React, { useState, useEffect } from 'react';
import { Star, Heart, ShoppingCart, Filter, Grid, List, Search, ArrowUpDown } from 'lucide-react';
import ComboSection from './combosection';
import { Link } from 'react-router-dom';
// import { useParams } from 'react-router-dom';  
// const Product = require('./models/products');
// import { Link } from 'react-router-dom';
import clsx from 'clsx';
// import { Heart, ShoppingCart } from 'lucide-react'; // Assuming lucide-react for icons
import { RatingStars } from './RatingStars';
import { ProductBadges } from './ProductBadges';
import { HeroCarousel } from './herocarousel'; // Adjust the import path

import axios from 'axios';
import AddToCartModal from './modal'; // Assuming you have a Modal component for cart actions
const carouselImages = [
  'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1589128793352-a5e25075b2de?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1627483262268-9c2b5b2834b5?q=80&w=2070&auto=format&fit=crop',
];
const productslist = [
  {
    "id": 9,
    "name": "Matte Finish Sunscreen SPF 50",
    "rating": 4.5,
    "reviews": 2760,
    "price": 399,
    "originalPrice": 499,
    "discount": 20,
    "photos": [
      "https://images.unsplash.com/photo-1620916566431-7cc71db9e80e?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1590611936763-d1cfa6f1b67b?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1590611853253-cdf1a3efcddb?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1590611860231-dccfb438f0c9?w=500&h=500&fit=crop"
    ],
    "description": "Oil-free sunscreen with a matte finish for all-day protection.",
    "keyFeatures": ["SPF 50 PA++++", "Water-resistant", "Non-greasy", "Matte formula"],
    "ingredients": ["Titanium Dioxide", "Avobenzone", "Niacinamide"],
    "size": "60g",
    "expiry": "01 Oct 2026",
    "comments": [
      {
        "user": "Roshni Mehta",
        "text": "No white cast, perfect under makeup.",
        "rating": 5,
        "verified": true
      }
    ]
  },
  {
    "id": 10,
    "name": "Vitamin C Face Serum 20%",
    "rating": 4.7,
    "reviews": 4320,
    "price": 549,
    "originalPrice": 699,
    "discount": 21,
    "photos": [
      "https://images.unsplash.com/photo-1600185365312-0c3d3e2aa3c0?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1600185311732-eae16d441be9?w=500&h=500&fit=crop"
    ],
    "description": "Brightens skin and reduces dark spots with potent Vitamin C.",
    "keyFeatures": ["20% Vitamin C", "Anti-aging", "Paraben-free", "Dermatologist Tested"],
    "ingredients": ["Vitamin C", "Hyaluronic Acid", "Ferulic Acid"],
    "size": "30ml",
    "expiry": "01 Mar 2026",
    "comments": [
      {
        "user": "Amit Shah",
        "text": "Skin looks brighter in 2 weeks!",
        "rating": 5,
        "verified": true
      }
    ]
  },
  {
    "id": 11,
    "name": "Hydrating Gel Moisturizer",
    "rating": 4.3,
    "reviews": 1890,
    "price": 299,
    "originalPrice": 399,
    "discount": 25,
    "photos": [
      "https://images.unsplash.com/photo-1625851376887-e28b5319e127?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1613470209966-4b7e6ff98b92?w=500&h=500&fit=crop"
    ],
    "description": "Lightweight moisturizer that hydrates without greasiness.",
    "keyFeatures": ["Non-comedogenic", "Fast absorbing", "No fragrance", "Dermatologist-approved"],
    "ingredients": ["Glycerin", "Aloe Vera", "Panthenol"],
    "size": "50g",
    "expiry": "01 Jan 2027",
    "comments": [
      {
        "user": "Sneha Patel",
        "text": "Perfect for my oily skin type.",
        "rating": 4,
        "verified": true
      }
    ]
  },
  {
    "id": 12,
    "name": "Charcoal Peel-off Mask",
    "rating": 4.1,
    "reviews": 3260,
    "price": 249,
    "originalPrice": 349,
    "discount": 29,
    "photos": [
      "https://images.unsplash.com/photo-1598515213899-dc3c9a6fd3b2?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1598515213585-8b1013fa2ac5?w=500&h=500&fit=crop"
    ],
    "description": "Deep cleans pores and removes blackheads effectively.",
    "keyFeatures": ["Activated Charcoal", "Detoxifies", "Peel-off formula", "Oil control"],
    "ingredients": ["Charcoal", "Tea Tree Oil", "Aloe Vera"],
    "size": "100ml",
    "expiry": "01 Jun 2026",
    "comments": [
      {
        "user": "Rahul Verma",
        "text": "Works like magic! Clearer nose in 2 uses.",
        "rating": 5,
        "verified": true
      }
    ]
  },
  {
    "id": 13,
    "name": "Aloe Vera Soothing Gel",
    "rating": 4.6,
    "reviews": 1520,
    "price": 199,
    "originalPrice": 249,
    "discount": 20,
    "photos": [
      "https://images.unsplash.com/photo-1628157588550-536bb3fc497c?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1628157588549-7c9824e3ae4a?w=500&h=500&fit=crop"
    ],
    "description": "Multi-purpose aloe vera gel for face, hair, and skin soothing.",
    "keyFeatures": ["99% Pure Aloe", "No parabens", "Cooling effect", "Multipurpose use"],
    "ingredients": ["Aloe Barbadensis Leaf Juice", "Vitamin E"],
    "size": "150ml",
    "expiry": "01 Dec 2026",
    "comments": [
      {
        "user": "Kritika Bansal",
        "text": "So calming on sunburnt skin!",
        "rating": 4,
        "verified": true
      }
    ]
  },
  {
    "id": 14,
    "name": "Niacinamide 10% Serum",
    "rating": 4.8,
    "reviews": 3480,
    "price": 499,
    "originalPrice": 599,
    "discount": 17,
    "photos": [
      "https://images.unsplash.com/photo-1620916566433-bb75f9d321a2?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1620916566435-cac1da5c59c0?w=500&h=500&fit=crop"
    ],
    "description": "Regulates oil and improves skin texture with 10% niacinamide.",
    "keyFeatures": ["Reduces acne marks", "Oil control", "Fragrance-free", "Suitable for all skin types"],
    "ingredients": ["Niacinamide", "Zinc PCA", "Glycerin"],
    "size": "30ml",
    "expiry": "01 Nov 2026",
    "comments": [
      {
        "user": "Tanvi Sharma",
        "text": "My pores look smaller after regular use.",
        "rating": 5,
        "verified": true
      }
    ]
  }
]

const SaphilixProductsPage = (props) => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);
  //checjed
  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL+'/data/products')
      .then(res => {
        setProducts(res.data); // if your backend sends { products: [...] }
      })
      .catch(err => {
        console.error('API error:', err);
      });
  }, []);
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

              src={product.image || product.photos[0]}

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



                // e.stopPropagation();  // Stop bubbling to the Link

                // e.preventDefault();

                setIsCartModalOpen(true)  // Prevent Link navigation

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



              // e.stopPropagation();  // Stop bubbling to the Link

              // e.preventDefault();

              setIsCartModalOpen(true)

              setModalProduct(product) // Prevent Link navigation

              // console.log("Button clicked only!");

              // Add wishlist logic here

            }}

              className="bg-gray-900 hover:bg-pink-600 text-white px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 text-sm font-medium">

              <ShoppingCart size={16} />

              Add to Cart

            </button>

          </div>

        </div>

      </div>





    </>

  );

  return (
    <>
      {modalProduct && (
        <AddToCartModal
          isOpen={isCartModalOpen}
          onClose={() => setIsCartModalOpen(false)}
          product={modalProduct}
          setCartItems={props.setCartItems}
        />
      )}
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Header */}
          <div className="w-full max-w-screen-lg mx-auto p-4"> {/* Container with padding */}
            <div className="rounded-xl overflow-hidden shadow-lg"> {/* Rounded borders */}
              <HeroCarousel images={carouselImages} />
            </div>
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


              </div>
            </div>
          </div>
          {searchTerm === "" ? (
            <>



              <section className="my-16 rounded-3xl bg-gradient-to-br from-[#9F66B6] to-[#D395B4] py-6 shadow-2xl">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <h2 className="text-center font-serif text-4xl font-bold text-white drop-shadow-md sm:text-5xl">
                    Deals Crafted For You
                  </h2>
                  <p className="mt-4 text-center text-lg text-white/80">
                    Discover our exclusive combos and save more!
                  </p>
                </div>

                {/* --- Horizontally Scrolling Product Container --- */}
                <div className="scrollbar-hide mt-10 flex gap-6 overflow-x-auto px-4 pb-6 sm:px-6 lg:px-8">
                  {/* Your product mapping goes here */}
                  {combos.map(product => (
                    /* --- THIS LINE IS UPDATED for a smaller card size --- */
                    <div key={product.id} className="w-64 flex-shrink-0 md:w-72">
                      <ProductCard
                        product={product}
                      />
                    </div>
                  ))}

                  {/* This is a fallback example card to show the styling if your 'combos' array is empty */}
                  {combos.length === 0 && (
                    <div className="w-64 flex-shrink-0 md:w-72">
                      <div className="flex h-[450px] items-center justify-center rounded-2xl bg-white/50 text-gray-800">
                        Example Product Card
                      </div>
                    </div>
                  )}
                </div>
              </section>


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
    </>
  );
};

export default SaphilixProductsPage;