'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ALL_SERVICES from '@/data/services';
import Image from 'next/image';
import { Ship, Plane, Truck, Warehouse, Package, Shield, Anchor, Globe, FileCheck, HardHat, HeartPulse, Wind, Waves, Building2, Home, UtensilsCrossed, Heart, GitMerge, ArrowRight, CheckCircle2 } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Ship, Plane, Truck, Warehouse, Package, Shield, Anchor, Globe, FileCheck,
  HardHat, HeartPulse, Wind, Waves, Building2, Home, UtensilsCrossed, Heart, GitMerge
};

export default function ServicesGrid() {
  const oceanService = ALL_SERVICES?.find((s) => s.slug === 'ocean-freight');
  const airService = ALL_SERVICES?.find((s) => s.slug === 'air-freight');
  const otherServices = ALL_SERVICES?.filter((s) => s.slug !== 'ocean-freight' && s.slug !== 'air-freight').slice(0, 6) || [];

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-[#8B0000]/10 text-[#8B0000] font-semibold text-sm rounded-full mb-3 uppercase tracking-wider">
            World-Class Freight & Port Logistics
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Comprehensive Logistics Solutions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From Dubai to the rest of the world, we provide end-to-end freight forwarding, NVOCC operations, and specialized logistics tailored to your exact cargo requirements.
          </p>
        </div>

        {/* Featured Flagship Services with User Images */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Ocean Freight Card */}
          {oceanService && (
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link href={`/services/${oceanService.slug}`} className="block group h-full">
                <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200/80 flex flex-col h-full">
                  <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                    <Image
                      src="/images/service-ocean.jpg"
                      alt="Ocean & Sea Freight Ports Shipping LLC"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4 bg-[#8B0000] text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-md">
                      <Ship size={14} className="text-[#C9A84C]" />
                      <span>FLAGSHIP NVOCC</span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-[#C9A84C] font-semibold text-xs tracking-wider uppercase">Maritime & Container Solutions</span>
                      <h3 className="text-2xl font-bold text-white group-hover:text-[#C9A84C] transition-colors">
                        {oceanService.title}
                      </h3>
                    </div>
                  </div>
                  <div className="p-6 sm:p-8 flex flex-col flex-grow justify-between bg-white">
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {oceanService.shortDescription}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs font-medium text-gray-700 mb-6 border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-1.5 text-gray-800">
                        <CheckCircle2 size={15} className="text-[#8B0000] flex-shrink-0" />
                        <span>FCL & LCL Services</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-800">
                        <CheckCircle2 size={15} className="text-[#8B0000] flex-shrink-0" />
                        <span>145+ Global Ports</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-800">
                        <CheckCircle2 size={15} className="text-[#8B0000] flex-shrink-0" />
                        <span>Break Bulk & Ro-Ro</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-800">
                        <CheckCircle2 size={15} className="text-[#8B0000] flex-shrink-0" />
                        <span>Jebel Ali Free Zone</span>
                      </div>
                    </div>
                    <div className="text-[#8B0000] group-hover:text-[#C9A84C] font-bold flex items-center justify-between transition-colors pt-2">
                      <span className="flex items-center gap-2">
                        Explore Ocean Freight <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                      </span>
                      <span className="text-xs text-gray-400 font-normal">Weekly Scheduled Sailings</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Air Freight Card */}
          {airService && (
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <Link href={`/services/${airService.slug}`} className="block group h-full">
                <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200/80 flex flex-col h-full">
                  <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                    <Image
                      src="/images/service-air.jpg"
                      alt="Air Freight & Chartering Ports Shipping LLC"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4 bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-md border border-[#C9A84C]/50">
                      <Plane size={14} className="text-[#C9A84C]" />
                      <span>IATA CERTIFIED</span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-[#C9A84C] font-semibold text-xs tracking-wider uppercase">Aviation & Rapid Cargo</span>
                      <h3 className="text-2xl font-bold text-white group-hover:text-[#C9A84C] transition-colors">
                        {airService.title}
                      </h3>
                    </div>
                  </div>
                  <div className="p-6 sm:p-8 flex flex-col flex-grow justify-between bg-white">
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {airService.shortDescription}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs font-medium text-gray-700 mb-6 border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-1.5 text-gray-800">
                        <CheckCircle2 size={15} className="text-[#8B0000] flex-shrink-0" />
                        <span>DXB T3 & FG5 Access</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-800">
                        <CheckCircle2 size={15} className="text-[#8B0000] flex-shrink-0" />
                        <span>EK SkyCargo Partner</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-800">
                        <CheckCircle2 size={15} className="text-[#8B0000] flex-shrink-0" />
                        <span>GCAA Approved DG Agent</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-800">
                        <CheckCircle2 size={15} className="text-[#8B0000] flex-shrink-0" />
                        <span>Full Aircraft Charters</span>
                      </div>
                    </div>
                    <div className="text-[#8B0000] group-hover:text-[#C9A84C] font-bold flex items-center justify-between transition-colors pt-2">
                      <span className="flex items-center gap-2">
                        Explore Air Freight <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                      </span>
                      <span className="text-xs text-gray-400 font-normal">Express Global Hubs</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}
        </div>

        {/* Additional Specialized Logistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherServices.map((service, idx) => {
            const Icon = iconMap[service.icon] || Package;
            return (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Link href={`/services/${service.slug}`} className="block group h-full">
                  <div className="bg-white p-8 rounded-xl border-t-4 border-[#8B0000] shadow-sm hover:shadow-xl transition-all duration-300 hover:bg-[#8B0000] hover:-translate-y-1 h-full flex flex-col justify-between">
                    <div>
                      <Icon className="w-12 h-12 text-[#8B0000] group-hover:text-[#C9A84C] mb-6 transition-colors" />
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-white mb-3 transition-colors">{service.title}</h3>
                      <p className="text-gray-600 group-hover:text-gray-200 mb-6 transition-colors line-clamp-3">{service.shortDescription}</p>
                    </div>
                    <span className="text-[#8B0000] group-hover:text-[#C9A84C] font-semibold flex items-center transition-colors pt-4 border-t border-gray-100 group-hover:border-white/20">
                      Learn More <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Link href="/services" className="inline-flex items-center px-8 py-4 bg-[#8B0000] text-white font-bold rounded-md hover:bg-[#6b0000] transition-colors shadow-md hover:shadow-lg">
            View All 18 Logistics Services →
          </Link>
        </div>
      </div>
    </section>
  );
}
