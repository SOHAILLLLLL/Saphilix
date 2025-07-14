import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Sparkles } from 'lucide-react';

const SaphilixHeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      text: 'Radiant Glow Collection',
      subtext: 'Illuminate your natural beauty with our premium skincare essentials'
    },
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2387&q=80',
      text: 'Luxury Lipstick Range',
      subtext: 'Bold colors that make a statement, crafted for the modern woman'
    },
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2326&q=80',
      text: 'Perfect Foundation Match',
      subtext: 'Flawless coverage that adapts to your unique skin tone'
    },
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      text: 'Eye-Catching Palettes',
      subtext: 'Create mesmerizing looks with our curated eyeshadow collections'
    },
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1588159343745-445ae0b16383?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      text: 'Signature Fragrances',
      subtext: 'Enchanting scents that leave a lasting impression'
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-pink-50 to-rose-100">
      
      {/* Background Images/Videos */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-110'
            }`}
          >
            <div className="absolute inset-0 bg-black/20 z-10"></div>
            <img
              src={slide.src}
              alt={slide.text}
              className="w-full h-full object-cover"
            />
            {slide.type === 'video' && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                <button className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-all duration-300">
                  <Play size={32} className="text-white ml-1" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Central Content */}
      <div className="relative z-30 flex flex-col items-center justify-center h-full text-center px-4">
        
        {/* Brand Name - Fixed */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tight leading-none">
            <span className="bg-gradient-to-r from-white via-pink-200 to-rose-300 bg-clip-text text-transparent drop-shadow-2xl">
              SAPHILIX
            </span>
          </h1>
          <div className="flex items-center justify-center mt-4 space-x-2">
            <Sparkles className="text-yellow-300 animate-pulse" size={24} />
            <span className="text-white/80 text-lg font-light tracking-widest">
              LUXURY COSMETICS
            </span>
            <Sparkles className="text-yellow-300 animate-pulse" size={24} />
          </div>
        </div>

        {/* Dynamic Text Content */}
        <div className="max-w-4xl mx-auto mb-12 transition-all duration-700 ease-in-out">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            <span 
              key={currentSlide}
              className="inline-block animate-fadeInUp"
            >
              {slides[currentSlide].text}
            </span>
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed">
            <span 
              key={`${currentSlide}-sub`}
              className="inline-block animate-fadeInUp animation-delay-300"
            >
              {slides[currentSlide].subtext}
            </span>
          </p>
        </div>

        {/* Shop Now Button */}
        <button className="group relative overflow-hidden bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 hover:from-pink-700 hover:via-rose-600 hover:to-pink-700 text-white font-bold py-4 px-12 rounded-full text-xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/50">
          <span className="relative z-10 flex items-center space-x-3">
            <span>Shop Now</span>
            <Sparkles size={20} className="animate-spin" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </button>

        {/* Slide Indicators */}
        <div className="flex space-x-3 mt-16">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white shadow-lg shadow-white/50 scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 transform -translate-y-1/2 z-40 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-full p-3 transition-all duration-300 hover:scale-110"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 transform -translate-y-1/2 z-40 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-full p-3 transition-all duration-300 hover:scale-110"
      >
        <ChevronRight size={24} />
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-40">
        <div 
          className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-100 ease-linear"
          style={{ 
            width: isAutoPlaying ? '100%' : '0%',
            animation: isAutoPlaying ? 'progress 4s linear infinite' : 'none'
          }}
        />
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        @media (max-width: 768px) {
          h1 {
            font-size: 3rem;
          }
          h2 {
            font-size: 1.5rem;
          }
          p {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SaphilixHeroCarousel;