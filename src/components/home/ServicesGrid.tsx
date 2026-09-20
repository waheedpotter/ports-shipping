'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ALL_SERVICES from '@/data/services';
import { Ship, Plane, Truck, Warehouse, Package, Shield, Anchor, Globe, FileCheck, HardHat, HeartPulse, Wind, Waves, Building2, Home, UtensilsCrossed, Heart, GitMerge } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Ship, Plane, Truck, Warehouse, Package, Shield, Anchor, Globe, FileCheck,
  HardHat, HeartPulse, Wind, Waves, Building2, Home, UtensilsCrossed, Heart, GitMerge
};

export default function ServicesGrid() {
  const displayServices = ALL_SERVICES?.slice(0, 8) || [];

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Comprehensive Logistics Solutions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">From Dubai to the rest of the world, we provide end-to-end freight forwarding and logistics services tailored to your needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayServices.map((service, idx) => {
            const Icon = iconMap[service.icon] || Package;
            return (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Link href={`/services/${service.slug}`} className="block group">
                  <div className="bg-white p-8 rounded-xl border-t-4 border-[#8B0000] shadow-sm hover:shadow-xl transition-all duration-300 hover:bg-[#8B0000] hover:-translate-y-1 h-full">
                    <Icon className="w-12 h-12 text-[#8B0000] group-hover:text-[#C9A84C] mb-6 transition-colors" />
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-white mb-3 transition-colors">{service.title}</h3>
                    <p className="text-gray-600 group-hover:text-gray-200 mb-6 transition-colors line-clamp-3">{service.shortDescription}</p>
                    <span className="text-[#8B0000] group-hover:text-[#C9A84C] font-semibold flex items-center transition-colors">
                      Learn More <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Link href="/services" className="inline-flex items-center px-8 py-4 bg-[#8B0000] text-white font-bold rounded-md hover:bg-[#6b0000] transition-colors">
            View All Services →
          </Link>
        </div>
      </div>
    </section>
  );
}
