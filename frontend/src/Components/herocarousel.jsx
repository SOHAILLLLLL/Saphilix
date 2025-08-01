// src/components/HeroCarousel.jsx

import React, { useState, useEffect, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react' // Assuming you use lucide-react for icons

// The base CSS for Embla is required. You can add this to your global.css
/*
.embla { overflow: hidden; }
.embla__container { display: flex; }
.embla__slide { flex: 0 0 100%; min-width: 0; }
*/


const DotButton = ({ selected, onClick }) => (
  <button
    className={`h-1 w-6 rounded-full mx-1 ${selected ? 'bg-white' : 'bg-white/40'}`}
    type="button"
    onClick={onClick}
  />
);

const PrevButton = ({ enabled, onClick }) => (
  <button
    className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/60 hover:bg-white p-2 rounded-full shadow-md transition-all duration-300 disabled:opacity-0"
    onClick={onClick}
    disabled={!enabled}
    aria-label="Previous slide"
  >
    <ChevronLeft className="h-3 w-3 text-gray-800" />
  </button>
);

const NextButton = ({ enabled, onClick }) => (
  <button
    className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/60 hover:bg-white p-2 rounded-full shadow-md transition-all duration-300 disabled:opacity-0"
    onClick={onClick}
    disabled={!enabled}
    aria-label="Next slide"
  >
    <ChevronRight className="h-3 w-3 text-gray-800" />
  </button>
);


export const HeroCarousel = ({ images }) => {
  // Initialize Autoplay plugin
  const autoplay = Autoplay({ delay: 4000, stopOnInteraction: false });
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay]);
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="embla relative" ref={emblaRef}>
      <div className="embla__container">
        {images.map((src, index) => (
          <div className="embla__slide" key={index}>
            <img
              src={src}
              alt={`Promotional slide ${index + 1}`}
              className="w-full h-48 sm:h-64 object-cover" // You can adjust height here
            />
          </div>
        ))}
      </div>
      
      {/* Navigation Buttons */}
      <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
      <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />

      {/* Pagination Dots */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center">
        {images.map((_, index) => (
          <DotButton
            key={index}
            selected={index === selectedIndex}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
};