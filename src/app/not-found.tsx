import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-9xl font-bold text-[#8B0000]">404</h1>
      <h2 className="text-3xl font-semibold text-gray-800 mt-4">Page Not Found</h2>
      <p className="text-gray-600 mt-2 mb-8 text-center max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div className="flex space-x-4">
        <Link href="/" className="px-6 py-3 bg-[#8B0000] text-white rounded hover:bg-red-900 font-medium transition">
          Go Home
        </Link>
        <Link href="/contact" className="px-6 py-3 border border-[#8B0000] text-[#8B0000] rounded hover:bg-red-50 font-medium transition">
          Contact Us
        </Link>
      </div>
    </div>
  );
}
