'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
  { value: '12+', label: 'Years of Excellence' },
  { value: '145+', label: 'Global Destinations' },
  { value: '350+', label: 'Partner Agents' },
  { value: '15,000+', label: 'sq. ft Warehouse' },
];

const certifications = ['ISO 9001', 'IATA', 'GCAA', 'Jebel Ali Free Zone', 'EK SkyCargo Partner'];

export default function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 bg-white border-t-4 border-[#8B0000]" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="text-center"
            >
              <h3 className="text-5xl font-bold text-[#C9A84C] mb-2">{stat.value}</h3>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-12">
          <p className="text-center text-gray-400 text-sm mb-6 uppercase tracking-wider">Certified & Trusted By</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center">
            {certifications.map((cert, idx) => (
              <div key={idx} className="text-gray-400 font-bold text-lg md:text-xl grayscale hover:grayscale-0 hover:text-[#8B0000] transition-all">
                {cert}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
