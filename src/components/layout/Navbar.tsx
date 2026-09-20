'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, Menu, X, ChevronDown, CalendarCheck } from 'lucide-react';
import { NAV_LINKS, MEGA_MENU_DATA } from '@/data/navigation';
import MegaMenu from './MegaMenu';
import TrackModal from '../modals/TrackModal';
import QuoteModal from '../modals/QuoteModal';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setIsMegaMenuOpen(true);
  };

  const closeMega = () => {
    closeTimer.current = setTimeout(() => setIsMegaMenuOpen(false), 150);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 backdrop-blur-md bg-white/90 border-b border-gold-200 ${
          isScrolled ? 'py-2 shadow-lg' : 'py-4 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="sr-only">Ports Shipping LLC</span>
              <div className="relative h-14 w-48">
                <Image src="/logo.png" alt="Ports Shipping LLC" fill className="object-contain" priority />
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center space-x-8">
              {NAV_LINKS?.map((link) => (
                <div key={link.label} className="relative group"
                  onMouseEnter={() => link.hasMega && openMega()}
                  onMouseLeave={() => link.hasMega && closeMega()}
                >
                  <Link
                    href={link.href}
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-crimson-800 transition-colors py-2"
                  >
                    {link.label}
                    {link.hasMega && <ChevronDown className={`w-4 h-4 ml-1 transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180' : ''}`} />}
                  </Link>
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gold-500 transition-all duration-300 group-hover:w-full" />
                </div>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <button
                onClick={() => setIsTrackOpen(true)}
                className="flex items-center px-4 py-2 text-sm font-medium text-crimson-800 border-2 border-crimson-800 rounded-md hover:bg-crimson-50 transition-colors"
              >
                <Search className="w-4 h-4 mr-2" />
                Track Shipment
              </button>
              <Link
                href="/book-slot"
                className="flex items-center px-4 py-2 text-sm font-bold text-white bg-[#C9A84C] rounded-md hover:bg-[#b8942e] transition-colors shadow-md hover:shadow-lg border border-[#b8942e]"
              >
                <CalendarCheck className="w-4 h-4 mr-2" />
                Book Slot
              </Link>
              <button
                onClick={() => setIsQuoteOpen(true)}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-crimson-800 rounded-md hover:bg-crimson-900 transition-colors shadow-md hover:shadow-lg"
              >
                <FileText className="w-4 h-4 mr-2" />
                Get Quote
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-600 hover:text-crimson-800"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <MegaMenu isOpen={isMegaMenuOpen} onClose={closeMega} onMouseEnter={openMega} />
      </header>

      {/* Mobile Menu Sheet */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-white lg:hidden overflow-y-auto"
          >
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <span className="font-bold text-crimson-800">Menu</span>
              <button onClick={() => setIsMobileOpen(false)} className="p-2 text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="px-4 py-6 space-y-6">
              <div className="flex flex-col space-y-4">
                {NAV_LINKS?.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-lg font-medium text-gray-900 border-b border-gray-50 pb-2"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="flex flex-col space-y-3 pt-4">
                <button
                  onClick={() => { setIsMobileOpen(false); setIsTrackOpen(true); }}
                  className="flex justify-center items-center px-4 py-3 text-crimson-800 border-2 border-crimson-800 rounded-md font-medium"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Track Shipment
                </button>
                <Link
                  href="/book-slot"
                  onClick={() => setIsMobileOpen(false)}
                  className="flex justify-center items-center px-4 py-3 text-white bg-[#C9A84C] rounded-md font-bold border border-[#b8942e]"
                >
                  <CalendarCheck className="w-5 h-5 mr-2" />
                  Book Slot
                </Link>
                <button
                  onClick={() => { setIsMobileOpen(false); setIsQuoteOpen(true); }}
                  className="flex justify-center items-center px-4 py-3 text-white bg-crimson-800 rounded-md font-medium"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Get Quote
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <TrackModal open={isTrackOpen} onOpenChange={setIsTrackOpen} />
      <QuoteModal open={isQuoteOpen} onOpenChange={setIsQuoteOpen} />
    </>
  );
}
