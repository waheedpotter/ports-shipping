'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from './LogoutButton';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  // Do NOT show sidebar/dashboard navigation on the login page
  if (isLoginPage) {
    return <>{children}</>;
  }

  const navItems = [
    { href: '/admin', label: '📊 Dashboard', exact: true },
    { href: '/admin/shipments', label: '📦 Shipments' },
    { href: '/admin/leads', label: '📋 Leads' },
    { href: '/admin/seo', label: '🔍 SEO Settings' },
  ];

  const bookingNavItems = [
    { href: '/admin/bookings', label: '📋 Slot Bookings' },
    { href: '/admin/booking-tokens', label: '🏷️ Booking Tokens' },
    { href: '/admin/voyage-refs', label: '🚢 Voyage References' },
    { href: '/admin/ports', label: '🏗️ Ports' },
  ];

  const isLinkActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-[#C9A84C]">Ports Shipping</h2>
          <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isLinkActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? 'bg-[#8B0000] text-white shadow-sm font-semibold'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {/* ── Booking System Section ── */}
          <div className="pt-3 pb-1">
            <div className="border-t border-gray-700 pt-3">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Booking System
              </p>
            </div>
          </div>

          {bookingNavItems.map((item) => {
            const active = isLinkActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? 'bg-[#8B0000] text-white shadow-sm font-semibold'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
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
