import Link from 'next/link';
import LogoutButton from './LogoutButton';

// Auth is handled by src/middleware.ts — this layout only runs for authenticated admin pages
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-[#C9A84C]">Ports Shipping</h2>
          <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <Link href="/admin" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-[#8B0000] hover:text-white transition-colors">
            📊 Dashboard
          </Link>
          <Link href="/admin/shipments" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-[#8B0000] hover:text-white transition-colors">
            📦 Shipments
          </Link>
          <Link href="/admin/leads" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-[#8B0000] hover:text-white transition-colors">
            📋 Leads
          </Link>
          <Link href="/admin/seo" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-[#8B0000] hover:text-white transition-colors">
            🔍 SEO Settings
          </Link>

          {/* ── Booking System ── */}
          <div className="pt-3 pb-1">
            <div className="border-t border-gray-700 pt-3">
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Booking System
              </p>
            </div>
          </div>
          <Link href="/admin/bookings" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-[#8B0000] hover:text-white transition-colors">
            📋 Slot Bookings
          </Link>
          <Link href="/admin/booking-tokens" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-[#8B0000] hover:text-white transition-colors">
            🏷️ Booking Tokens
          </Link>
          <Link href="/admin/voyage-refs" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-[#8B0000] hover:text-white transition-colors">
            🚢 Voyage References
          </Link>
          <Link href="/admin/ports" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-[#8B0000] hover:text-white transition-colors">
            🏗️ Ports
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
