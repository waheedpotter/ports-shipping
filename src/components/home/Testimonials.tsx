'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    quote: "Ports Shipping has consistently delivered aerospace parts on time and in perfect condition. Their AOG response time is unmatched.",
    name: "Operations Manager",
    title: "Emirates Group",
    company: "Emirates Group"
  },
  {
    quote: "Our FF&E imports for major real estate projects require immense coordination. Ports Shipping handles everything from origin to site flawlessly.",
    name: "Supply Chain Director",
    title: "Arabian Ranches",
    company: "Arabian Ranches"
  },
  {
    quote: "Pharmaceutical cold chain logistics is highly sensitive. The temperature-controlled solutions provided by Ports Shipping give us complete peace of mind.",
    name: "Logistics Head",
    title: "NMC Healthcare",
    company: "NMC Healthcare"
  },
  {
    quote: "A reliable partner for our public sector procurement needs. Their compliance and documentation accuracy is excellent.",
    name: "Procurement Manager",
    title: "Dubai Municipality",
    company: "Dubai Municipality"
  },
  {
    quote: "Project cargo moves require deep expertise. Ports Shipping's team successfully navigated complex out-of-gauge shipments for us.",
    name: "COO",
    title: "Tanmiyat Group",
    company: "Tanmiyat Group"
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900">Trusted by Industry Leaders</h2>
          <div className="w-24 h-1 bg-[#8B0000] mx-auto mt-6"></div>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-50 rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 relative"
            >
              <div className="text-[#C9A84C] text-6xl font-serif absolute top-4 left-6 opacity-30">"</div>
              <div className="flex text-[#C9A84C] mb-6 justify-center">
                {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" size={24} />)}
              </div>
              <p className="text-xl md:text-2xl text-gray-700 text-center italic mb-8 relative z-10">
                "{testimonials[currentIndex].quote}"
              </p>
              <div className="text-center">
                <div className="font-bold text-gray-900 text-lg">{testimonials[currentIndex].name}</div>
                <div className="text-[#8B0000] font-medium">{testimonials[currentIndex].title}</div>
                <div className="text-gray-500 text-sm mt-1">{testimonials[currentIndex].company}</div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center mt-8 gap-4">
            <button onClick={prev} className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-[#8B0000] hover:text-white transition-colors">
              <ChevronLeft size={24} />
            </button>
            <button onClick={next} className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-[#8B0000] hover:text-white transition-colors">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
