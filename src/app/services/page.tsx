import React from 'react';
import Link from 'next/link';
import ALL_SERVICES from '@/data/services';
import { Ship, Plane, Truck, Warehouse, Package, Shield, Anchor, Globe, FileCheck, HardHat, HeartPulse, Wind, Waves, Building2, Home, UtensilsCrossed, Heart, GitMerge } from 'lucide-react';

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
        const Icon = iconMap[service.iconName] || Package;
        return (
          <Link key={service.slug} href={`/services/${service.slug}`} className="group">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#8B0000] transition-all h-full flex flex-col">
              <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-[#8B0000] transition-colors mb-6">
                <Icon className="w-8 h-8 text-[#8B0000] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-6 flex-grow">{service.shortDescription}</p>
              <div className="text-[#8B0000] font-bold flex items-center group-hover:text-[#C9A84C]">
                Learn More <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
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
