'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Clock, Linkedin, Facebook, Instagram, Twitter } from 'lucide-react';
import ALL_SERVICES from '@/data/services';

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-gray-300">
      {/* Top Gold Bar */}
      <div className="h-1 w-full bg-gold-500" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Section 1: Brand & Info */}
          <div className="space-y-6">
            <div className="flex items-center text-white text-2xl font-bold">
              <span className="text-crimson-500 mr-2">PORTS</span> SHIPPING
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Leading the way in global logistics and supply chain solutions since 2012. Your trusted partner for seamless cargo movement worldwide.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 text-xs font-semibold bg-gray-800 border border-gray-700 rounded text-gold-500">ISO 9001</span>
              <span className="px-2 py-1 text-xs font-semibold bg-gray-800 border border-gray-700 rounded text-gold-500">GCAA Approved DG</span>
              <span className="px-2 py-1 text-xs font-semibold bg-gray-800 border border-gray-700 rounded text-gold-500">IATA Partner</span>
            </div>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-gold-500 transition-colors"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-gold-500 transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-gold-500 transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-gold-500 transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Section 2: Services */}
          <div className="lg:col-span-2">
            <h3 className="text-white text-lg font-semibold mb-6 border-b border-gray-800 pb-2">Our Services</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
              {ALL_SERVICES.slice(0, 18).map((service, idx) => (
                <li key={idx}>
                  <Link href={`/services/${service.slug}`} className="text-sm hover:text-gold-500 transition-colors flex items-center">
                    <span className="w-1.5 h-1.5 bg-crimson-800 rounded-full mr-2"></span>
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4: Contact */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6 border-b border-gray-800 pb-2">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-crimson-600 mt-1 mr-3 shrink-0" />
                <span className="text-sm">Office 204-1, Zabeel Business Centre, Umm Hurair 1, Behind GPO, P.O. Box 47081, Al Karama, Dubai, UAE</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-crimson-600 mr-3 shrink-0" />
                <a href="tel:+97143447867" className="text-sm hover:text-gold-500 transition-colors">+971 4 344 7867</a>
              </li>
              <li className="flex flex-col space-y-2">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-crimson-600 mr-3 shrink-0" />
                  <a href="mailto:info@ports-shipping.com" className="text-sm hover:text-gold-500 transition-colors">info@ports-shipping.com</a>
                </div>
                <div className="flex items-center pl-8">
                  <a href="mailto:dubaiports@ports-shipping.com" className="text-sm hover:text-gold-500 transition-colors">dubaiports@ports-shipping.com</a>
                </div>
              </li>
              <li className="flex items-start">
                <Clock className="w-5 h-5 text-crimson-600 mt-0.5 mr-3 shrink-0" />
                <div className="text-sm">
                  <p>Mon-Fri: 8:00 AM - 6:00 PM</p>
                  <p>Sat: 8:00 AM - 2:00 PM</p>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Global Presence */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-500 mb-4">Our Global Presence</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400 font-medium">
            <span>UAE</span> <span className="text-gray-700">|</span>
            <span>Oman</span> <span className="text-gray-700">|</span>
            <span>Kuwait</span> <span className="text-gray-700">|</span>
            <span>India</span> <span className="text-gray-700">|</span>
            <span>Kenya</span> <span className="text-gray-700">|</span>
            <span>Somalia</span> <span className="text-gray-700">|</span>
            <span>Singapore</span> <span className="text-gray-700">|</span>
            <span>UK</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Ports Shipping LLC. All Rights Reserved.</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <Link href="/privacy-policy" className="hover:text-gold-500 transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-gold-500 transition-colors">Terms of Service</Link>
            <Link href="/admin" className="hover:text-gold-500 transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
