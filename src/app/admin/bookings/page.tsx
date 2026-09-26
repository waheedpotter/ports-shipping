'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Container {
  id: string;
  containerNo: string;
  pol: string;
  pod: string;
}

interface BookingToken {
  id: string;
  token: string;
  status: string;
}

interface VoyageRef {
  id: string;
  voyageRef: string;
}

interface Booking {
  id: string;
  confirmationNo: string;
  createdAt: string;
  voyageRef: VoyageRef | null;
  rotationNo: string | null;
  bookingParty: string;
  email: string;
  containers: Container[];
  bookingToken: BookingToken | null;
  status: string;
}

interface Stats {
  totalBookings: number;
  todayBookings: number;
  totalContainers: number;
  activeVoyageRefs: number;
  unusedTokens: number;
  usedTokens: number;
}

interface PaginatedResponse {
  data: Booking[];
  total: number;
  skip: number;
  take: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    confirmed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[status?.toLowerCase()] ?? 'bg-gray-100 text-gray-700'}`}>
      {status ?? 'Unknown'}
    </span>
  );
}

function StatCard({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div className={`${color} p-5 rounded-xl shadow-sm text-white`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="text-3xl font-bold mt-1">{value === undefined ? '—' : value}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BookingsPage() {
  // Stats
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Filter state
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [voyageRefFilter, setVoyageRefFilter] = useState('');
  const [voyageRefs, setVoyageRefs] = useState<VoyageRef[]>([]);

  // Table state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const take = 20;
  const [loading, setLoading] = useState(true);

  // UI state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteConfirmNo, setDeleteConfirmNo] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // ── Fetch stats ──
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const [bRes, tRes] = await Promise.all([
        fetch('/api/admin/bookings?stats=1'),
        fetch('/api/admin/booking-tokens'),
      ]);
      const bData = bRes.ok ? await bRes.json() : {};
      const tData = tRes.ok ? await tRes.json() : {};
      const tokens: BookingToken[] = tData.data ?? tData ?? [];
      setStats({
        totalBookings: bData.total ?? bData.totalBookings ?? 0,
        todayBookings: bData.todayBookings ?? 0,
        totalContainers: bData.totalContainers ?? 0,
        activeVoyageRefs: bData.activeVoyageRefs ?? 0,
        unusedTokens: tokens.filter((t) => t.status === 'Unused').length,
        usedTokens: tokens.filter((t) => t.status === 'Used').length,
      });
    } catch {
      // silently ignore stats errors
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // ── Fetch voyage refs for dropdown ──
  useEffect(() => {
    fetch('/api/admin/voyage-refs')
      .then((r) => r.json())
      .then((d) => setVoyageRefs(d.data ?? d ?? []))
      .catch(() => {});
  }, []);

  // ── Fetch bookings ──
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);
      if (voyageRefFilter) params.set('voyageRef', voyageRefFilter);
      params.set('skip', String(skip));
      params.set('take', String(take));

      const res = await fetch(`/api/admin/bookings?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const json: PaginatedResponse = await res.json();
      setBookings(json.data ?? []);
      setTotal(json.total ?? 0);
    } catch (e: unknown) {
      showToast('error', e instanceof Error ? e.message : 'Error fetching bookings');
    } finally {
      setLoading(false);
    }
  }, [search, dateFrom, dateTo, voyageRefFilter, skip, take]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  // ── Toast helper ──
  function showToast(type: 'success' | 'error', msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }

  // ── Delete ──
  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/bookings/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      showToast('success', 'Booking deleted successfully');
      setDeleteId(null);
      setDeleteConfirmNo('');
      fetchBookings();
      fetchStats();
    } catch (e: unknown) {
      showToast('error', e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setDeleting(false);
    }
  }

  // ── Clear filters ──
  function clearFilters() {
    setSearch('');
    setDateFrom('');
    setDateTo('');
    setVoyageRefFilter('');
    setSkip(0);
  }

  const totalPages = Math.ceil(total / take);
  const currentPage = Math.floor(skip / take) + 1;

  return (
    <div className="min-h-screen">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.msg}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Deletion</h3>
            <p className="text-gray-600 text-sm mb-4">
              Type <span className="font-mono font-bold text-[#8B0000]">{deleteConfirmNo}</span> to confirm deletion. This action cannot be undone.
            </p>
            <input
              type="text"
              placeholder="Type confirmation number..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
              onChange={(e) => setDeleteConfirmNo(e.target.value)}
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setDeleteId(null); setDeleteConfirmNo(''); }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-[#8B0000] text-white rounded-lg text-sm font-semibold hover:bg-red-900 disabled:opacity-50 transition"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Slot Bookings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all booking submissions</p>
        </div>
        <button
          onClick={() => window.open('/api/admin/bookings/export', '_blank')}
          className="px-4 py-2 bg-[#C9A84C] text-white rounded-lg text-sm font-semibold hover:bg-yellow-600 transition"
        >
          ⬇ Export All Excel
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statsLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-xl animate-pulse" />
          ))
        ) : (
          <>
            <StatCard label="Total Bookings" value={stats?.totalBookings ?? 0} color="bg-[#8B0000]" />
            <StatCard label="Today's Bookings" value={stats?.todayBookings ?? 0} color="bg-rose-700" />
            <StatCard label="Total Containers" value={stats?.totalContainers ?? 0} color="bg-[#C9A84C]" />
            <StatCard label="Active Voyage Refs" value={stats?.activeVoyageRefs ?? 0} color="bg-slate-700" />
            <StatCard label="Unused Tokens" value={stats?.unusedTokens ?? 0} color="bg-emerald-700" />
            <StatCard label="Used Tokens" value={stats?.usedTokens ?? 0} color="bg-sky-700" />
          </>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <input
            type="text"
            placeholder="Search confirmation, voyage, party, email, container…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setSkip(0); }}
            className="lg:col-span-2 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
          />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setSkip(0); }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
            title="Date from"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setSkip(0); }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
            title="Date to"
          />
          <div className="flex gap-2">
            <select
              value={voyageRefFilter}
              onChange={(e) => { setVoyageRefFilter(e.target.value); setSkip(0); }}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
            >
              <option value="">All Voyages</option>
              {voyageRefs.map((v) => (
                <option key={v.id} value={v.voyageRef}>{v.voyageRef}</option>
              ))}
            </select>
            <button
              onClick={clearFilters}
              className="px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition whitespace-nowrap"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#8B0000] text-white">
                <th className="px-4 py-3 text-left font-semibold">Booking No.</th>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-left font-semibold">Voyage Ref</th>
                <th className="px-4 py-3 text-left font-semibold">Rotation No</th>
                <th className="px-4 py-3 text-left font-semibold">Booking Party</th>
                <th className="px-4 py-3 text-left font-semibold">Email</th>
                <th className="px-4 py-3 text-center font-semibold">Containers</th>
                <th className="px-4 py-3 text-left font-semibold">Token</th>
                <th className="px-4 py-3 text-center font-semibold">Status</th>
                <th className="px-4 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {Array.from({ length: 10 }).map((__, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-gray-400">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                bookings.map((b, i) => (
                  <tr
                    key={b.id}
                    className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-amber-50 transition-colors`}
                  >
                    <td className="px-4 py-3 font-mono text-[#8B0000] font-semibold whitespace-nowrap">
                      {(b as any).confirmationNumber || b.confirmationNo}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600 text-xs">
                      <div>{new Date(b.createdAt).toLocaleDateString()}</div>
                      <div className="text-gray-400">{new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {(b as any).voyageReference?.voyageRef ?? b.voyageRef?.voyageRef ?? <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                      {(b as any).rotationNumber ?? b.rotationNo ?? <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3 font-medium">{b.bookingParty}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">{(b as any).bookingPartyEmail || b.email}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="bg-[#C9A84C]/20 text-[#8B0000] font-semibold px-2 py-0.5 rounded-full text-xs">
                        {(b as any)._count?.containers ?? b.containers?.length ?? 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {((b as any).token?.token || b.bookingToken?.token) ? (
                        <span className="font-mono font-bold text-xs bg-amber-50 text-[#8B0000] border border-[#C9A84C]/50 px-2 py-1 rounded">
                          {(b as any).token?.token || b.bookingToken?.token}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/bookings/${b.id}`}
                          className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium hover:bg-slate-200 transition"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => {
                            setDeleteId(b.id);
                            setDeleteConfirmNo(b.confirmationNo);
                          }}
                          className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-medium hover:bg-red-100 transition"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => window.open(`/api/admin/bookings/export?id=${b.id}`, '_blank')}
                          className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-medium hover:bg-emerald-100 transition"
                        >
                          Excel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > take && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500">
              Showing {skip + 1}–{Math.min(skip + take, total)} of {total} bookings
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setSkip(Math.max(0, skip - take))}
                disabled={skip === 0}
                className="px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition"
              >
                ← Prev
              </button>
              <span className="px-3 py-1.5 text-xs text-gray-600 font-medium">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setSkip(skip + take)}
                disabled={skip + take >= total}
                className="px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
