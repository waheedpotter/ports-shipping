'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// ─── Types ───────────────────────────────────────────────────────────────────
interface BookingStats {
  totalBookings: number;
  todayBookings: number;
  totalContainers: number;
  activeVoyageRefs: number;
}

interface TokenStats {
  unusedTokens: number;
  usedTokens: number;
  expiredTokens: number;
}

interface ShipmentCard {
  title: string;
  value: string | number;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon,
  color,
  href,
}: {
  label: string;
  value: number | string;
  icon: string;
  color: string;
  href?: string;
}) {
  const inner = (
    <div className={`${color} p-5 rounded-xl shadow-sm text-white flex items-start justify-between group`}>
      <div>
        <p className="text-xs font-medium opacity-75">{label}</p>
        <p className="text-3xl font-bold mt-1">{value ?? '—'}</p>
      </div>
      <span className="text-3xl opacity-70">{icon}</span>
    </div>
  );
  if (href) return <Link href={href} className="block hover:scale-[1.02] transition-transform">{inner}</Link>;
  return <div>{inner}</div>;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [bookingStats, setBookingStats] = useState<BookingStats | null>(null);
  const [tokenStats, setTokenStats] = useState<TokenStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Shipment placeholders (existing)
  const shipmentCards: ShipmentCard[] = [
    { title: 'Total Shipments', value: '—' },
    { title: 'Active Shipments', value: '—' },
    { title: 'New Leads Today', value: '—' },
    { title: 'Total Leads', value: '—' },
  ];

  useEffect(() => {
    async function loadStats() {
      setStatsLoading(true);
      try {
        const [bRes, tRes] = await Promise.all([
          fetch('/api/admin/bookings?stats=1'),
          fetch('/api/admin/booking-tokens'),
        ]);

        if (bRes.ok) {
          const bData = await bRes.json();
          setBookingStats({
            totalBookings: bData.total ?? bData.totalBookings ?? 0,
            todayBookings: bData.todayBookings ?? 0,
            totalContainers: bData.totalContainers ?? 0,
            activeVoyageRefs: bData.activeVoyageRefs ?? 0,
          });
        }

        if (tRes.ok) {
          const tData = await tRes.json();
          const tokens: { status: string }[] = tData.data ?? tData ?? [];
          setTokenStats({
            unusedTokens: tokens.filter((t) => t.status === 'Unused').length,
            usedTokens: tokens.filter((t) => t.status === 'Used').length,
            expiredTokens: tokens.filter((t) => t.status === 'Expired').length,
          });
        }
      } catch {
        // silently ignore errors — placeholders will show
      } finally {
        setStatsLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1 text-gray-800">Dashboard</h1>
      <p className="text-gray-500 mb-8 text-sm">
        Welcome back. Today is {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.
      </p>

      {/* ── Booking System Stats ── */}
      <div className="mb-3 flex items-center gap-3">
        <h2 className="text-base font-bold text-gray-700">📋 Booking System</h2>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />
          ))
        ) : (
          <>
            <StatCard
              label="Total Bookings"
              value={bookingStats?.totalBookings ?? 0}
              icon="📋"
              color="bg-[#8B0000]"
              href="/admin/bookings"
            />
            <StatCard
              label="Total Containers"
              value={bookingStats?.totalContainers ?? 0}
              icon="📦"
              color="bg-[#C9A84C]"
              href="/admin/bookings"
            />
            <StatCard
              label="Unused Tokens"
              value={tokenStats?.unusedTokens ?? 0}
              icon="🏷️"
              color="bg-emerald-700"
              href="/admin/booking-tokens"
            />
            <StatCard
              label="Active Voyage Refs"
              value={bookingStats?.activeVoyageRefs ?? 0}
              icon="🚢"
              color="bg-slate-700"
              href="/admin/voyage-refs"
            />
          </>
        )}
      </div>

      {/* ── Quick Links ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {[
          { label: 'View All Bookings', href: '/admin/bookings', color: 'border-[#8B0000] text-[#8B0000]' },
          { label: 'Manage Tokens', href: '/admin/booking-tokens', color: 'border-[#C9A84C] text-[#C9A84C]' },
          { label: 'Voyage References', href: '/admin/voyage-refs', color: 'border-slate-600 text-slate-600' },
          { label: 'Ports', href: '/admin/ports', color: 'border-emerald-700 text-emerald-700' },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`border-2 ${l.color} rounded-xl px-4 py-2.5 text-center text-sm font-semibold hover:bg-gray-50 transition`}
          >
            {l.label} →
          </Link>
        ))}
      </div>

      {/* ── Existing Shipment Stats ── */}
      <div className="mb-3 flex items-center gap-3">
        <h2 className="text-base font-bold text-gray-700">📦 Shipments &amp; Leads</h2>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {shipmentCards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-[#C9A84C]">
            <h3 className="text-gray-500 text-sm font-medium">{card.title}</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Recent Shipments</h2>
          <p className="text-gray-500 text-sm">Loading…</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Recent Leads</h2>
          <p className="text-gray-500 text-sm">Loading…</p>
        </div>
      </div>
    </div>
  );
}
