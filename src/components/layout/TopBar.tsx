'use client';

import { Phone, Mail, MapPin, Linkedin, Facebook, Instagram, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TopBar() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="hidden md:flex justify-between items-center w-full bg-crimson-900 text-white px-6 py-2 text-xs"
    >
      <div className="flex items-center space-x-6">
        <a href="tel:+97143447867" className="flex items-center hover:text-gold-500 transition-colors">
          <Phone className="w-3 h-3 mr-2" />
          +971 4 344 7867
        </a>
        <a href="mailto:info@ports-shipping.com" className="flex items-center hover:text-gold-500 transition-colors">
          <Mail className="w-3 h-3 mr-2" />
          info@ports-shipping.com
        </a>
        <div className="flex items-center text-gray-300">
          <MapPin className="w-3 h-3 mr-2" />
          Dubai, UAE (Al Karama / Umm Hurair 1)
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <div className="font-semibold text-gold-500 tracking-wider">
          ISO 9001 CERTIFIED
        </div>
        <div className="flex items-center space-x-4">
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold-500 transition-colors">
            <Linkedin className="w-3 h-3" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold-500 transition-colors">
            <Facebook className="w-3 h-3" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold-500 transition-colors">
            <Instagram className="w-3 h-3" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold-500 transition-colors">
            <Twitter className="w-3 h-3" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
