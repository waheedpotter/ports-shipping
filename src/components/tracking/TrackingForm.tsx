'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  initialValue?: string;
  onSearch?: (query: string) => void;
  isLoading?: boolean;
}

export default function TrackingForm({ initialValue = '', onSearch, isLoading = false }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(initialValue);
  const [type, setType] = useState<'bl'|'container'>('bl');

  useEffect(() => {
    if (initialValue) setQuery(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
        router.push(`/track?q=${encodeURIComponent(query.trim())}`, { scroll: false });
      } else {
        router.push(`/track?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 max-w-3xl mx-auto">
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setType('bl')}
          className={`pb-2 font-medium border-b-2 transition-colors ${type === 'bl' ? 'border-[#8B0000] text-[#8B0000]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          BL Number
        </button>
        <button 
          onClick={() => setType('container')}
          className={`pb-2 font-medium border-b-2 transition-colors ${type === 'container' ? 'border-[#8B0000] text-[#8B0000]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Container Number
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={type === 'bl' ? "Enter BL number (e.g. PSDUBAI1001)" : "Enter Container number"}
            className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-[#8B0000] focus:ring-0 outline-none text-lg pr-12"
            required
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-[#8B0000] text-white font-bold rounded-xl hover:bg-[#6b0000] transition-colors disabled:opacity-70"
        >
          {isLoading ? 'Tracking...' : 'Track Shipment'}
        </button>
      </form>
    </div>
  );
}
