import React, { useState, useEffect } from 'react';
import { Search, Heart, User, ShoppingCart, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
const SaphilixNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/98 backdrop-blur-md shadow-lg shadow-pink-500/10' 
        : 'bg-white/95 backdrop-blur-lg'
    } border-b border-pink-500/10`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#" className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-300 bg-clip-text text-transparent relative">
              Saphilix
              <span className="absolute -top-1 -right-6 text-base animate-pulse">✨</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#" className="nav-link">Home</a>
              
              <div className="relative group">
                <Link to="/products" className="nav-link">Products</Link>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl shadow-pink-500/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 border border-pink-100">
                  <div className="py-2">
                    <a href="#" className="dropdown-item">Face Care</a>
                    <a href="#" className="dropdown-item">Skin Care</a>
                    <a href="#" className="dropdown-item">Makeup</a>
                    <a href="#" className="dropdown-item">Hair Care</a>
                    <a href="#" className="dropdown-item">Fragrances</a>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <a href="#" className="nav-link">Collections</a>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl shadow-pink-500/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 border border-pink-100">
                  <div className="py-2">
                    <a href="#" className="dropdown-item">New Arrivals</a>
                    <a href="#" className="dropdown-item">Best Sellers</a>
                    <a href="#" className="dropdown-item">Limited Edition</a>
                    <a href="#" className="dropdown-item">Gift Sets</a>
                  </div>
                </div>
              </div>

              <a href="#" className="nav-link">About</a>
              <a href="#" className="nav-link">Contact</a>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className={`transition-all duration-300 ease-in-out bg-gray-50 border-2 border-transparent rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-pink-500 focus:bg-white ${
                  isSearchOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 md:w-48 md:opacity-100'
                }`}
              />
              <Search 
                size={18} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={toggleSearch}
              />
            </div>

            {/* Icon Buttons */}
            {/* <button className="icon-btn">
              <Heart size={20} />
            </button> */}

            {/* <button className="icon-btn">
              <User size={20} />
            </button> */}
            <Link to="/mycart">
            <button className="icon-btn relative ">
              <ShoppingCart size={50} />
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>
</Link>
            {/* CTA Button */}
            <a href="#" className="hidden sm:inline-flex items-center px-6 py-2 bg-gradient-to-r from-pink-600 to-pink-400 text-white font-semibold rounded-full hover:from-pink-700 hover:to-pink-500 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-pink-500/30">
              Shop Now
            </a>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg hover:bg-pink-50 transition-colors duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? 'max-h-96 opacity-100 pb-6' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="px-4 pt-4 pb-4 bg-white/95 backdrop-blur-sm rounded-2xl mt-2 border border-pink-100 flex flex-col space-y-3">
            <a href="#" className="mobile-nav-item">Home</a>
            
            <div className="mobile-nav-item">
              <span className="font-medium text-gray-700">Products</span>
              <div className="ml-4 mt-2 space-y-2">
                <a href="#" className="block text-sm text-gray-600 hover:text-pink-600">Face Care</a>
                <a href="#" className="block text-sm text-gray-600 hover:text-pink-600">Skin Care</a>
                <a href="#" className="block text-sm text-gray-600 hover:text-pink-600">Makeup</a>
                <a href="#" className="block text-sm text-gray-600 hover:text-pink-600">Hair Care</a>
              </div>
            </div>
            
            <div className="mobile-nav-item">
              <span className="font-medium text-gray-700">Collections</span>
              <div className="ml-4 mt-2 space-y-2">
                <a href="#" className="block text-sm text-gray-600 hover:text-pink-600">New Arrivals</a>
                <a href="#" className="block text-sm text-gray-600 hover:text-pink-600">Best Sellers</a>
                <a href="#" className="block text-sm text-gray-600 hover:text-pink-600">Limited Edition</a>
              </div>
            </div>
            
            <a href="#" className="mobile-nav-item">About</a>
            <a href="#" className="mobile-nav-item">Contact</a>
            
            <div className="pt-4 border-t border-pink-100">
              <a href="#" className="w-full flex justify-center items-center px-6 py-3 bg-gradient-to-r from-pink-600 to-pink-400 text-white font-semibold rounded-full hover:from-pink-700 hover:to-pink-500 transition-all duration-300">
                Shop Now
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .nav-link {
          @apply px-4 py-2 text-gray-700 font-medium rounded-full transition-all duration-300 relative overflow-hidden;
        }
        
        .nav-link:hover {
          @apply text-white transform -translate-y-0.5;
        }
        
        .nav-link::before {
          content: '';
          @apply absolute inset-0 bg-gradient-to-r from-pink-600 to-pink-400 -translate-x-full transition-transform duration-300 -z-10;
        }
        
        .nav-link:hover::before {
          @apply translate-x-0;
        }

        .dropdown-item {
          @apply block px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-pink-600 hover:to-pink-400 hover:text-white transition-all duration-200;
        }

        .dropdown-item:first-child {
          @apply rounded-t-xl;
        }

        .dropdown-item:last-child {
          @apply rounded-b-xl;
        }

        .icon-btn {
          @apply p-2 text-gray-700 hover:bg-gradient-to-r hover:from-pink-600 hover:to-pink-400 hover:text-white rounded-full transition-all duration-300 transform hover:-translate-y-0.5;
        }

        .mobile-nav-item {
          @apply block w-full px-4 py-3 text-left text-gray-700 font-medium hover:bg-pink-50 hover:text-pink-600 rounded-lg transition-colors duration-200;
        }
      `}</style>
    </nav>
  );
};

export default SaphilixNavbar;