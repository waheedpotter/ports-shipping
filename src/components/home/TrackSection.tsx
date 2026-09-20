'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function TrackSection() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [trackType, setTrackType] = useState<'bl' | 'container'>('bl');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/track?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section id="tracking" className="py-24 bg-[#8B0000] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]"></div>
      <div className="container mx-auto px-6 relative z-10 text-center">
        <h2 className="text-4xl font-bold text-white mb-8">Track Your Shipment</h2>
        
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center mb-6 gap-4">
            <button 
              onClick={() => setTrackType('bl')}
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${trackType === 'bl' ? 'bg-white text-[#8B0000]' : 'bg-white/20 text-white hover:bg-white/30'}`}
            >
              Track by BL Number
            </button>
            <button 
              onClick={() => setTrackType('container')}
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${trackType === 'container' ? 'bg-white text-[#8B0000]' : 'bg-white/20 text-white hover:bg-white/30'}`}
            >
              Track by Container
            </button>
          </div>

          <form onSubmit={handleSubmit} className="relative mb-12">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={trackType === 'bl' ? "Enter BL Number (e.g. PSDUBAI1001)" : "Enter Container Number (e.g. TCNU1234567)"}
              className="w-full px-8 py-5 rounded-xl text-lg shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#C9A84C]/50 pr-32"
              required
            />
            <button 
              type="submit"
              className="absolute right-2 top-2 bottom-2 px-8 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Search size={20} /> <span className="hidden md:inline">Track</span>
            </button>
          </form>

          <div className="text-white/80">
            <p className="mb-4 text-sm font-medium uppercase tracking-wider">Try Demo Statuses:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['PSDUBAI1001', 'PSDUBAI1002', 'PSDUBAI1003', 'PSDUBAI1004'].map(demo => (
                <button
                  key={demo}
                  onClick={() => router.push(`/track?q=${demo}`)}
                  className="px-4 py-2 border border-white/30 rounded-md text-sm hover:bg-white/10 transition-colors"
                >
                  {demo}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
