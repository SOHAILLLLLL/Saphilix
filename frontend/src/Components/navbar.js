import React, { useState, useEffect } from 'react';
import { Search, Heart, User, ShoppingCart, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
// import logo from '..'
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
      ? 'bg-white/98 backdrop-blur-md shadow-lg shadow-pink-500/10'
      : 'bg-white/95 backdrop-blur-lg'
      } border-b border-pink-500/10`}>
      <div className="flex-shrink-0">
        <a href="#" className="flex items-center space-x-3 group">
          {/* Logo Image */}

        </a>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo and Company Name Images */}
          <Link to="/">
            <div className="flex-shrink-0">
              <a href="#" className="flex items-center space-x-3 group">
                {/* Logo Image */}
                {/* sm:w-14 sm:h-14 md:w-18 md:h-18 lg:w-18 lg:h-18 */}
                <div className="w-18 h-18  flex-shrink-0">
                  <img
                    src='/images/logop.png'
                    alt="Sanelis Logo"
                    className="w-full h-full object-contain transition-transform group-hover:scale-105"
                  />
                </div>

                {/* Company Name Image */}
                <div className="h-18 pt-4 flex-shrink-0 relative">
                  <img
                    src='/images/logorext.png'
                    alt="Sanelis"
                    className="h-full object-contain transition-transform group-hover:scale-105"
                  />
                  {/* <span className="absolute -top-1 -right-4 sm:-right-6 text-sm sm:text-base animate-pulse">✨</span> */}
                </div>
              </a>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to='/' className='nav-link'>Home</Link>
              {/* <a href="#" className="nav-link">Home</a> */}

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



              <a href="#" className="nav-link">About</a>
              <a href="#" className="nav-link">Contact</a>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">



            {/* Icon Buttons */}
            {/* <button className="icon-btn">
              <Heart size={20} />
            </button> */}

            {/* <button className="icon-btn">
              <User size={20} />
            </button> */}
            <Link to="/mycart">
              <button className="icon-btn relative ">
                <ShoppingCart size={40} />

              </button>
            </Link>
            {/* CTA Button */}
            <a href="#" className="hidden sm:inline-flex items-center px-6 py-2 bg-gradient-to-r from-[#9550B2] to-[#893BAA] text-white font-semibold rounded-full hover:from-pink-700 hover:to-pink-500 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-pink-500/30">
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
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen
          ? 'max-h-96 opacity-100 pb-6'
          : 'max-h-0 opacity-0 overflow-hidden'
          }`}>
          <div className="px-4 pt-4 pb-4 bg-white/95 backdrop-blur-sm rounded-2xl mt-2 border border-pink-100 flex flex-col space-y-3">
            <a href="#" className="mobile-nav-item">Home</a>
            <Link to="/products">
              <div className="mobile-nav-item">
                <span className="font-medium text-gray-700">Products</span>
              </div>
            </Link>



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