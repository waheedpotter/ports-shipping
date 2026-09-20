'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Award, Globe, Clock, Thermometer } from 'lucide-react';
import Link from 'next/link';

export default function WhyChooseUs() {
  const reasons = [
    "IATA Certified & GCAA Approved DG Agent",
    "350+ Global Agent Network across 145 Countries",
    "24/7 Operations & Real-Time Shipment Tracking",
    "Temperature-Controlled Storage (-20°C to +25°C)",
    "Specialized in Defense, Pharma & Project Cargo",
    "Offices in 8 Countries: UAE, Oman, Kuwait, India, Kenya, Somalia, Singapore, UK"
  ];

  return (
    <section className="py-24 bg-gray-100">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1 bg-gray-200 text-[#8B0000] font-bold rounded-full text-sm mb-6 uppercase tracking-wide">Why Choose Ports Shipping</span>
            <h2 className="text-4xl font-bold text-gray-900 mb-8">14 Years of Trust. Global Reach. Local Expertise.</h2>
            
            <ul className="space-y-4 mb-10">
              {reasons.map((reason, idx) => (
                <li key={idx} className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-[#C9A84C] mr-4 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-lg">{reason}</span>
                </li>
              ))}
            </ul>

            <Link href="/about" className="inline-block px-8 py-4 bg-gray-900 text-white font-bold rounded-md hover:bg-gray-800 transition-colors">
              Learn About Us
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-6"
          >
            {[
              { icon: Award, title: "IATA Certified", desc: "Top safety & standards" },
              { icon: Globe, title: "Global Reach", desc: "145+ Countries covered" },
              { icon: Clock, title: "24/7 Support", desc: "Always here for you" },
              { icon: Thermometer, title: "Cold Chain", desc: "-20°C to +25°C storage" }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#8B0000]/10 rounded-full flex items-center justify-center mb-4 text-[#8B0000]">
                  <item.icon size={32} />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
