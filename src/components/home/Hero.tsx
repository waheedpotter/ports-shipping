'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HeroProps {
  onQuoteClick: () => void;
  onTrackClick: () => void;
}

export default function Hero({ onQuoteClick, onTrackClick }: HeroProps) {
  const router = useRouter();
  const [trackQuery, setTrackQuery] = useState('');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackQuery.trim()) {
      router.push(`/track?q=${encodeURIComponent(trackQuery.trim())}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#8B0000] to-[#5a0000] hero-gradient">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
      
      <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-white pt-24 pb-12 lg:py-24"
        >
          <motion.div variants={itemVariants} className="inline-block px-4 py-2 bg-black/30 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/10">
            Award-Winning UAE Logistics Since 2012
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Your Global Freight <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#e6d08c]">Partner</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg text-gray-200 mb-8 max-w-xl">
            End-to-End Freight Forwarding & Logistics from Dubai to the World. Ocean, Air, Land & Specialized Cargo.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-12">
            <button 
              onClick={onQuoteClick}
              className="px-8 py-4 bg-gradient-to-r from-[#C9A84C] to-[#b39543] text-white font-bold rounded-md hover:shadow-lg hover:shadow-[#C9A84C]/20 transition-all"
            >
              Get a Free Quote
            </button>
            <button 
              onClick={onTrackClick}
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-md hover:bg-white/10 transition-all"
            >
              Track Shipment
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/20">
            <div>
              <div className="text-3xl font-bold text-[#C9A84C]">12+</div>
              <div className="text-sm text-gray-300">Years</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#C9A84C]">145+</div>
              <div className="text-sm text-gray-300">Destinations</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#C9A84C]">350+</div>
              <div className="text-sm text-gray-300">Global Agents</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#C9A84C]">15k+</div>
              <div className="text-sm text-gray-300">sqft Warehouse</div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative lg:h-full flex items-center justify-center"
        >
          <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-2xl relative z-10">
            <h3 className="text-2xl font-bold text-white mb-6">Track Your Shipment</h3>
            <form onSubmit={handleTrackSubmit} className="space-y-4">
              <div>
                <label className="sr-only" htmlFor="tracking">BL Number or Container Number</label>
                <div className="relative">
                  <input
                    id="tracking"
                    type="text"
                    value={trackQuery}
                    onChange={(e) => setTrackQuery(e.target.value)}
                    placeholder="Enter BL or Container No."
                    className="w-full px-5 py-4 rounded-md bg-white text-gray-900 pr-12 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                    required
                  />
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
                <p className="text-sm text-gray-300 mt-2">e.g. PSDUBAI1001</p>
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-[#8B0000] text-white font-bold rounded-md hover:bg-[#6b0000] transition-colors"
              >
                Track Now
              </button>
            </form>
          </div>
          
          {/* Floating badges omitted for brevity, could add with framer motion animate */}
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/50 animate-bounce cursor-pointer"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <ArrowDown size={32} />
      </motion.div>
    </section>
  );
}
