import React, { useState, useEffect, useRef } from 'react';

const Cosmetic3DCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const products = [
    {
      id: 1,
      name: "Velvet Matte Lipstick",
      description: "Long-lasting formula with rich pigmentation",
      originalPrice: 49,
      salePrice: 22,
      discount: "55% OFF",
      emoji: "💄",
      gradient: "from-rose-200 via-pink-200 to-rose-300",
      stripGradient: "from-red-500 to-red-600",
      buttonGradient: "from-rose-500 to-pink-500",
      hoverGradient: "from-rose-600 to-pink-600",
      textColor: "text-rose-600",
      border: "border-rose-100"
    },
    {
      id: 2,
      name: "Glowing Foundation",
      description: "Buildable coverage with luminous finish",
      originalPrice: 52,
      salePrice: 31,
      discount: "40% OFF",
      emoji: "✨",
      gradient: "from-purple-200 via-violet-200 to-purple-300",
      stripGradient: "from-purple-500 to-purple-600",
      buttonGradient: "from-purple-500 to-indigo-500",
      hoverGradient: "from-purple-600 to-indigo-600",
      textColor: "text-purple-600",
      border: "border-purple-100"
    },
    {
      id: 3,
      name: "Golden Highlighter",
      description: "Luxurious glow for radiant skin",
      originalPrice: 45,
      salePrice: 18,
      discount: "60% OFF",
      emoji: "🌟",
      gradient: "from-amber-200 via-yellow-200 to-orange-200",
      stripGradient: "from-amber-500 to-orange-500",
      buttonGradient: "from-amber-500 to-orange-500",
      hoverGradient: "from-amber-600 to-orange-600",
      textColor: "text-amber-600",
      border: "border-amber-100"
    },
    {
      id: 4,
      name: "Hydrating Serum",
      description: "Deep moisturizing with vitamin C",
      originalPrice: 49,
      salePrice: 27,
      discount: "45% OFF",
      emoji: "🧴",
      gradient: "from-teal-200 via-emerald-200 to-cyan-200",
      stripGradient: "from-teal-500 to-emerald-500",
      buttonGradient: "from-teal-500 to-emerald-500",
      hoverGradient: "from-teal-600 to-emerald-600",
      textColor: "text-teal-600",
      border: "border-teal-100"
    },
    {
      id: 5,
      name: "Rose Blush Palette",
      description: "4 shades for the perfect flush",
      originalPrice: 38,
      salePrice: 19,
      discount: "50% OFF",
      emoji: "🌹",
      gradient: "from-pink-200 via-rose-200 to-pink-300",
      stripGradient: "from-pink-500 to-rose-500",
      buttonGradient: "from-pink-500 to-rose-500",
      hoverGradient: "from-pink-600 to-rose-600",
      textColor: "text-pink-600",
      border: "border-pink-100"
    }
  ];

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [products.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const getSide = (index) => {
    const diff = index - currentIndex;
    if (diff === 1 || (diff === -(products.length - 1))) {
      return 'right';
    } else if (diff === -1 || (diff === products.length - 1)) {
      return 'left';
    }
    return 'hidden';
  };

  const getCardStyle = (index) => {
    const isCenter = index === currentIndex;
    const isVisible = Math.abs(index - currentIndex) <= 1 || 
                     (currentIndex === 0 && index === products.length - 1) ||
                     (currentIndex === products.length - 1 && index === 0);

    if (isCenter) {
      return {
        transform: isMobile 
          ? 'translateX(-50%) translateZ(0px) scale(1)' 
          : 'translateX(-50%) translateZ(0px) scale(1.1)',
        opacity: 1,
        zIndex: 3
      };
    } else if (isVisible) {
      const side = getSide(index);
      const offsetX = side === 'left' ? (isMobile ? -120 : -350) : (isMobile ? 120 : 350);
      const rotateY = side === 'left' ? 25 : -25;
      const scale = isMobile ? 0.75 : 0.8;
      
      return {
        transform: `translateX(calc(-50% + ${offsetX}px)) rotateY(${rotateY}deg) scale(${scale})`,
        opacity: 0.7,
        zIndex: 1
      };
    } else {
      return {
        transform: 'translateX(-50%) scale(0.5)',
        opacity: 0,
        zIndex: 0
      };
    }
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D3B7DF]  to-purple-50 flex items-center justify-center p-4 md:p-8">
      <div className="relative w-full max-w-6xl">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">
            Beauty Sale Collection
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Discover amazing deals on premium cosmetics
          </p>
        </div>

        {/* 3D Carousel Container */}
        <div 
          className={`carousel-container relative ${isMobile ? 'h-80' : 'h-96'}`}
          style={{ perspective: '1000px' }}
        >
          <div 
            ref={carouselRef}
            className="carousel-track w-full h-full relative"
            style={{ transformStyle: 'preserve-3d' }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {products.map((product, index) => (
              <div
                key={product.id}
                className={`sale-card absolute ${isMobile ? 'w-60 h-76' : 'w-72 h-88'} transition-all duration-700 ease-out`}
                style={{
                  ...getCardStyle(index),
                  left: '50%',
                  top: '50%',
                  marginTop: isMobile ? '-144px' : '-160px',
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className={`sale-card-inner relative w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden ${product.border} transition-all duration-300 hover:shadow-3xl hover:-translate-y-2`}>
                  {/* Sale Strip */}
                  <div 
                    className={`sale-strip absolute ${isMobile ? 'top-3 -right-6' : 'top-4 -right-8'} bg-gradient-to-r ${product.stripGradient} text-white ${isMobile ? 'px-6 py-1.5' : 'px-8 py-2'} transform rotate-45 shadow-lg z-10`}
                  >
                    <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-bold`}>
                      {product.discount}
                    </span>
                  </div>
                  
                  {/* Sale Image */}
                  <div className={`sale-image ${isMobile ? 'h-36' : 'h-48'} bg-gradient-to-br ${product.gradient} flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
                    <span className={`${isMobile ? 'text-4xl' : 'text-6xl'} filter drop-shadow-lg`}>
                      {product.emoji}
                    </span>
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
                  </div>
                  
                  {/* Sale Content */}
                  <div className={`${isMobile ? 'p-4' : 'p-6'}`}>
                    <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-800 mb-2`}>
                      {product.name}
                    </h3>
                    <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 mb-4 line-clamp-2`}>
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold ${product.textColor}`}>
                          ${product.salePrice}
                        </span>
                        <span className={`${isMobile ? 'text-sm' : 'text-lg'} text-gray-400 line-through`}>
                          ${product.originalPrice}
                        </span>
                      </div>
                      <button className={`bg-gradient-to-r ${product.buttonGradient} hover:bg-gradient-to-r hover:${product.hoverGradient} text-white ${isMobile ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'} rounded-full transition-all shadow-lg transform hover:scale-105`}>
                        {isMobile ? 'Add' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 mt-6 md:mt-8">
          <button 
            onClick={prevSlide}
            className="bg-white/80 backdrop-blur-md border border-rose-200 text-rose-600 p-2 md:p-3 rounded-full shadow-lg hover:bg-rose-50 hover:border-rose-300 transition-all transform hover:scale-110"
          >
            <svg className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <button 
            onClick={nextSlide}
            className="bg-white/80 backdrop-blur-md border border-rose-200 text-rose-600 p-2 md:p-3 rounded-full shadow-lg hover:bg-rose-50 hover:border-rose-300 transition-all transform hover:scale-110"
          >
            <svg className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`${isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'} rounded-full transition-all duration-300 cursor-pointer ${
                index === currentIndex
                  ? 'bg-rose-500 border-2 border-rose-500 scale-125'
                  : 'bg-rose-200 border-2 border-rose-300 hover:bg-rose-300'
              }`}
            />
          ))}
        </div>

        {/* Mobile Swipe Hint */}
        {isMobile && (
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">← Swipe to navigate →</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .sale-strip::before {
          content: '';
          position: absolute;
          top: 100%;
          right: 0;
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid rgba(0, 0, 0, 0.2);
          border-top: 8px solid transparent;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @media (max-width: 767px) {
          .sale-strip::before {
            border-left: 6px solid transparent;
            border-right: 6px solid rgba(0, 0, 0, 0.2);
            border-top: 6px solid transparent;
          }
        }
      `}</style>
    </div>
  );
};

export default Cosmetic3DCarousel;