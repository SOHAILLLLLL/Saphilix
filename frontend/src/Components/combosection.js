// ComboSection.js
import React from 'react';

const products = [
  {
    id: 1,
    name: "Glow Combo Pack",
    image: "/assets/combo1.png",
    price: "₹899",
  },
  {
    id: 2,
    name: "Hydra Boost Kit",
    image: "/assets/combo2.png",
    price: "₹1,199",
  },
  {
    id: 3,
    name: "Brightening Duo",
    image: "/assets/combo3.png",
    price: "₹999",
  },
];

export default function ComboSection() {
  return (
    <section className="py-10 px-4 font-sans">
      
      {/* Heading with hr line */}
      <div className="flex items-center justify-center mb-10">
        <div className="w-full max-w-4xl relative">
          <hr className="border-pink-300" />
          <span className="absolute left-1/2 transform -translate-x-1/2 -top-3 bg-pink-50 px-4 text-pink-800 font-bold text-lg tracking-wide uppercase">
            Combo
          </span>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 text-center">
              <h3 className="text-pink-800 font-semibold text-lg">{product.name}</h3>
              <p className="text-pink-600 mt-1">{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
