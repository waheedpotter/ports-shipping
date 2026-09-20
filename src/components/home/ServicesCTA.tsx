import React from 'react';
import Link from 'next/link';

export default function ServicesCTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-[#8B0000] to-gray-900 text-white text-center">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Ship?</h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
          Experience seamless end-to-end logistics tailored to your business requirements. Partner with Ports Shipping today.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/contact" className="px-8 py-4 bg-[#C9A84C] text-white font-bold rounded-md hover:bg-[#b39543] transition-colors shadow-lg shadow-[#C9A84C]/20">
            Get Free Quote
          </Link>
          <a href="tel:+97143447867" className="px-8 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-md hover:bg-white/20 transition-colors backdrop-blur-sm">
            Call Us Now: +971 4 344 7867
          </a>
        </div>
      </div>
    </section>
  );
}
