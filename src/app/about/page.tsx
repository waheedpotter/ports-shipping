import React from 'react';
import Image from 'next/image';
import { Target, Lightbulb, ShieldCheck, MapPin } from 'lucide-react';

export const metadata = {
  title: 'About Ports Shipping LLC | Award-Winning Logistics in Dubai',
  description: 'Learn about Ports Shipping LLC. End-to-end logistics and freight forwarding since 2012 from Dubai to global destinations.',
};

export default function AboutPage() {
  return (
    <main className="pb-24">
      {/* Hero */}
      <section className="pt-32 pb-20 bg-[#8B0000] text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-block px-4 py-1 bg-white/20 rounded-full mb-4 font-medium backdrop-blur-sm">Est. 2012</div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About Ports Shipping LLC</h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">Connecting global markets through seamless, innovative, and reliable logistics solutions.</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-[#8B0000] uppercase tracking-wider">Established in Dubai</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-6">Our Story &amp; Legacy</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Incorporated in 2012 in Dubai, UAE, Ports Shipping provides the complete gamut of forwarding and logistics solutions from and to anywhere in the world. We offer comprehensive solutions from simple Air and Sea freight forwarding up to full end-to-end multi-modal 3PL and 4PL solutions.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Operating from our strategic headquarters in Dubai, we bridge global trade corridors with dedicated sea freight, air freight chartering, overland trucking across the GCC, customs clearance, and container freight station operations.
              </p>
              <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                <div>
                  <div className="text-3xl font-bold text-[#C9A84C]">2012</div>
                  <div className="text-xs text-gray-500 font-semibold uppercase mt-1">Year Founded</div>
                </div>
                <div className="h-10 w-[1px] bg-gray-200" />
                <div>
                  <div className="text-3xl font-bold text-[#8B0000]">ISO 9001</div>
                  <div className="text-xs text-gray-500 font-semibold uppercase mt-1">Certified Quality</div>
                </div>
                <div className="h-10 w-[1px] bg-gray-200" />
                <div>
                  <div className="text-3xl font-bold text-[#C9A84C]">24/7</div>
                  <div className="text-xs text-gray-500 font-semibold uppercase mt-1">Support</div>
                </div>
              </div>
            </div>
            <div className="relative h-[480px] w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
              <Image
                src="/images/about-flagship.jpg"
                alt="Ports Shipping LLC - Flagship Marine & Overland Operations"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain bg-neutral-900"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 max-w-5xl">
          <div className="bg-white p-10 rounded-2xl shadow-lg border-t-4 border-[#8B0000]">
            <Target className="w-12 h-12 text-[#8B0000] mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-700">To provide efficient, reliable and cost-effective end-to-end logistics solutions, empowering our clients' businesses to thrive globally through operational excellence and dedicated partnerships.</p>
          </div>
          <div className="bg-white p-10 rounded-2xl shadow-lg border-t-4 border-[#C9A84C]">
            <Lightbulb className="w-12 h-12 text-[#C9A84C] mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
            <p className="text-gray-700">To be the preferred global logistics partner, recognized for our innovative solutions, expansive network, and unwavering commitment to customer success and industry leadership.</p>
          </div>
        </div>
      </section>

      {/* Core Competencies */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Core Competencies</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              "Ocean Freight Forwarding", "Air Freight Forwarding", "Land Transport & Distribution",
              "Customs Brokerage", "Warehousing & Supply Chain", "Project Cargo & Heavy Lift",
              "Defense & Aerospace Logistics", "Pharma & Cold Chain Logistics"
            ].map((comp, idx) => (
              <div key={idx} className="p-6 bg-gray-50 rounded-xl flex items-center gap-4">
                <ShieldCheck className="w-6 h-6 text-[#8B0000] flex-shrink-0" />
                <span className="font-semibold text-gray-800">{comp}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Reach */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Global Reach & Local Expertise</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-12">
            Headquartered in Dubai, UAE, our logistics operations connect major commercial hubs and trade corridors worldwide through dedicated partnerships and comprehensive multi-modal infrastructure.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { title: "Dubai HQ", subtitle: "Strategic UAE Hub" },
              { title: "GCC Network", subtitle: "Overland Trucking" },
              { title: "Ocean Freight", subtitle: "Global Liners & NVOCC" },
              { title: "Air Freight", subtitle: "Worldwide Connections" },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-[#C9A84C]" />
                </div>
                <span className="font-bold text-lg mb-1">{item.title}</span>
                <span className="text-sm text-gray-400">{item.subtitle}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-10">Certified & Trusted</h2>
          <div className="flex flex-wrap justify-center gap-12 items-center text-xl font-bold text-gray-400">
            <span className="hover:text-[#8B0000] transition-colors">ISO 9001 Certified</span>
          </div>
        </div>
      </section>
    </main>
  );
}
