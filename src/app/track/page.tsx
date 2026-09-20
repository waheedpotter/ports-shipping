'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import TrackingForm from '@/components/tracking/TrackingForm';
import TrackingTimeline from '@/components/tracking/TrackingTimeline';
import ShipmentDashboard from '@/components/tracking/ShipmentDashboard';

function TrackContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (query) {
      handleSearch(query);
    }
  }, [query]);

  const handleSearch = async (q: string) => {
    setIsLoading(true);
    setError('');
    setResult(null);
    
    try {
      const res = await fetch(`/api/track?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || 'Shipment not found. Please check your BL or Container number and try again.');
        setResult(null);
      } else {
        setResult(data.data);
      }
    } catch (err) {
      setError('Unable to connect to tracking service. Please try again or contact us at +971 4 344 7867');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="pb-24 pt-32 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Cargo</h1>
          <p className="text-gray-600">Enter your Bill of Lading (BL) or Container Number for real-time updates.</p>
        </div>

        <TrackingForm initialValue={query || ''} onSearch={handleSearch} isLoading={isLoading} />

        {isLoading && (
          <div className="mt-16 text-center">
            <div className="w-12 h-12 border-4 border-[#8B0000]/20 border-t-[#8B0000] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Retrieving shipment details...</p>
          </div>
        )}

        {error && (
          <div className="mt-12 bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center">
            <p className="font-bold">{error}</p>
          </div>
        )}

        {result && !isLoading && (
          <div className="mt-16 space-y-12">
            <ShipmentDashboard shipment={result} />
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 border-b pb-4">Tracking History</h3>
              <TrackingTimeline milestones={result.milestones} currentStatus={result.status} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center">Loading tracker...</div>}>
      <TrackContent />
    </Suspense>
  );
}
