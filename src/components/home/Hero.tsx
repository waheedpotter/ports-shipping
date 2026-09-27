'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface HeroProps {
  onQuoteClick: () => void;
  onTrackClick: () => void;
}

const HERO_SLIDES = [
  {
    badge: 'Award-Winning UAE Logistics Since 2012',
    title: 'Your Global Freight',
    highlight: 'Partner',
    description: 'End-to-End Freight Forwarding & Logistics from Dubai to the World. Ocean, Air, Land & Specialized Cargo.',
  },
  {
    badge: 'Regional Feeder & Container Line Services',
    title: 'Your Regional Feeder &',
    highlight: 'Global Container Line',
    description: 'Reliable Feeder Network & Liner Services Connecting the Middle East, Indian Subcontinent, Africa & Beyond.',
  },
];

export default function Hero({ onQuoteClick, onTrackClick }: HeroProps) {
  const router = useRouter();
  const [trackQuery, setTrackQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-950">
      {/* Background Hero Banner Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-banner.jpg"
          alt="Ports Shipping LLC - Global Freight & Port Logistics Dubai"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center lg:object-right"
          quality={95}
        />
        {/* Responsive Overlay to ensure text readability while letting port & ship shine */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#3a0000]/95 via-[#5C0000]/80 to-[#8B0000]/50 lg:from-[#2a0000]/95 lg:via-[#4a0000]/70 lg:to-transparent" />
        <div className="absolute inset-0 bg-black/20" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-white pt-24 pb-12 lg:py-24"
        >
          {/* Animated Slide Content with AnimatePresence */}
          <div className="min-h-[220px] sm:min-h-[240px] md:min-h-[260px] flex flex-col justify-start">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                <div className="inline-block px-4 py-2 bg-black/30 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/10">
                  {slide.badge}
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                  {slide.title}{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#e6d08c]">
                    {slide.highlight}
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-gray-200 mb-6 max-w-xl leading-relaxed">
                  {slide.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-2 mb-8">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? 'w-8 bg-[#C9A84C]' : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
          
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-12">
            <button 
              onClick={onQuoteClick}
              className="px-8 py-4 bg-gradient-to-r from-[#C9A84C] to-[#b39543] text-white font-bold rounded-md hover:shadow-lg hover:shadow-[#C9A84C]/20 transition-all"
            >
              Get Quote
            </button>
            <button 
              onClick={onTrackClick}
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-md hover:bg-white/10 transition-all"
            >
              Track Shipment
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-8 pt-8 border-t border-white/20">
            <div>
              <div className="text-3xl font-bold text-[#C9A84C]">12+</div>
              <div className="text-sm text-gray-300">Years Experience</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#C9A84C]">100%</div>
              <div className="text-sm text-gray-300">Shipment Visibility</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#C9A84C]">24/7</div>
              <div className="text-sm text-gray-300">Cargo Support</div>
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
