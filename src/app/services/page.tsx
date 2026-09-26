import React from 'react';
import Link from 'next/link';
import ALL_SERVICES from '@/data/services';
import { Ship, Plane, Truck, Warehouse, Package, Shield, Anchor, Globe, FileCheck, HardHat, HeartPulse, Wind, Waves, Building2, Home, UtensilsCrossed, Heart, GitMerge } from 'lucide-react';

import Image from 'next/image';

const iconMap: Record<string, React.ElementType> = {
  Ship, Plane, Truck, Warehouse, Package, Shield, Anchor, Globe, FileCheck,
  HardHat, HeartPulse, Wind, Waves, Building2, Home, UtensilsCrossed, Heart, GitMerge
};

export const metadata = {
  title: 'Our Services | Ports Shipping LLC',
  description: 'Comprehensive logistics solutions including Ocean & Air Freight, Land Transport, Warehousing, and Specialized Logistics.'
};

export default function ServicesPage() {
  const categories = [
    { title: "Ocean & Air Freight", filter: (s: any) => s.slug.includes('ocean') || s.slug.includes('air') || s.slug.includes('sea') },
    { title: "Land Transport & Customs", filter: (s: any) => s.slug.includes('land') || s.slug.includes('customs') },
    { title: "Warehousing & Storage", filter: (s: any) => s.slug.includes('warehouse') || s.slug.includes('storage') || s.slug.includes('3pl') },
    { title: "Specialized Logistics", filter: (s: any) => !s.slug.includes('ocean') && !s.slug.includes('air') && !s.slug.includes('land') && !s.slug.includes('warehouse') && !s.slug.includes('customs') }
  ];

  const renderGrid = (services: any[]) => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {services.map(service => {
        const Icon = iconMap[service.icon] || Package;
        return (
          <Link key={service.slug} href={`/services/${service.slug}`} className="group">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#8B0000] transition-all h-full flex flex-col overflow-hidden">
              {service.image ? (
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-4 text-white flex items-center gap-2">
                    <Icon className="w-5 h-5 text-[#C9A84C]" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-200">Featured Service</span>
                  </div>
                </div>
              ) : (
                <div className="p-8 pb-0">
                  <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-[#8B0000] transition-colors mb-2">
                    <Icon className="w-8 h-8 text-[#8B0000] group-hover:text-white transition-colors" />
                  </div>
                </div>
              )}
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#8B0000] transition-colors">{service.title}</h3>
                <p className="text-gray-600 mb-6 flex-grow line-clamp-3">{service.shortDescription}</p>
                <div className="text-[#8B0000] font-bold flex items-center group-hover:text-[#C9A84C]">
                  Learn More <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );

  return (
    <main className="pb-24">
      <section className="pt-32 pb-20 bg-[#8B0000] text-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">End-to-end logistics solutions designed to drive your business forward on a global scale.</p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        {categories.map((cat, idx) => {
          const categoryServices = (ALL_SERVICES || []).filter(cat.filter);
          if (categoryServices.length === 0) return null;
          
          return (
            <div key={idx} className="mb-20">
              <h2 className="text-3xl font-bold text-gray-900 mb-10 pb-4 border-b-2 border-gray-100 inline-block">{cat.title}</h2>
              {renderGrid(categoryServices)}
            </div>
          );
        })}
      </div>
    </main>
  );
}
