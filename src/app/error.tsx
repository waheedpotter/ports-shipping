'use client';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h2 className="text-3xl font-bold text-[#8B0000] mb-4">Something went wrong!</h2>
      <p className="text-gray-600 mb-8 max-w-md text-center">We encountered an unexpected error. Please try again.</p>
      <button onClick={() => reset()} className="px-6 py-3 bg-[#8B0000] text-white rounded hover:bg-red-900 font-medium transition">
        Try again
      </button>
    </div>
  );
}
