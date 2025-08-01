// UseCase.js
import React from 'react';

export default function UseCase() {
  return (
    <section className="w-full py-10 px-4 bg-pink-50 font-sans">
      <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-xl bg-white flex flex-col md:flex-row transition-all duration-500">
        
        {/* Description + Image */}
        <div className="relative md:w-1/2 w-full p-6 bg-gradient-to-r from-[#E6B7F9] via-pink-50 to-transparent flex flex-col justify-center items-center text-center md:text-left">
          <img 
            src="shampoo.png" 
            alt="Product"  height="300"
            className="h-48 mb-4"
          />
          <h2 className="text-2xl md:text-3xl font-bold text-[#D3B7DF] mb-2">
            Revitalize Your Glow
          </h2>
          <p className="text-black text-sm md:text-base max-w-md">
            Our all-new collagen boost cream uses a blend of botanical oils and modern peptides
            to restore elasticity, glow, and hydration in just 7 days.
          </p>
        </div>

        {/* Video */}
        <div className="md:w-1/2 w-full">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            src="https://www.w3schools.com/html/mov_bbb.mp4"
          />
        </div>
      </div>
    </section>
  );
}
