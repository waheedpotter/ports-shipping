'use client';

import { useEffect, useState, useCallback } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface VoyageRef {
  id: string;
  voyageRef: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  _count?: { bookings: number };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function VoyageRefsPage() {
  const [voyageRefs, setVoyageRefs] = useState<VoyageRef[]>([]);
  const [loading, setLoading] = useState(true);

  // Add form
  const [newRef, setNewRef] = useState('');
  const [adding, setAdding] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  function showToast(type: 'success' | 'error', msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }

  // ── Fetch ──
  const fetchVoyageRefs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/voyage-refs');
      if (!res.ok) throw new Error('Failed to fetch voyage references');
      const json = await res.json();
      setVoyageRefs(json.data ?? json ?? []);
    } catch (e: unknown) {
      showToast('error', e instanceof Error ? e.message : 'Fetch failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchVoyageRefs(); }, [fetchVoyageRefs]);

  // ── Add ──
  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newRef.trim()) return;
    setAdding(true);
    try {
      const res = await fetch('/api/admin/voyage-refs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voyageRef: newRef.trim() }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? 'Add failed');
      }
      showToast('success', `Voyage ref "${newRef.trim()}" added`);
      setNewRef('');
      fetchVoyageRefs();
    } catch (e: unknown) {
      showToast('error', e instanceof Error ? e.message : 'Add failed');
    } finally {
      setAdding(false);
    }
  }

  // ── Toggle status ──
  async function handleToggle(v: VoyageRef) {
    const newStatus = v.status === 'Active' ? 'Inactive' : 'Active';
    try {
      const res = await fetch(`/api/admin/voyage-refs/${v.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Update failed');
      showToast('success', `Voyage ref ${newStatus === 'Active' ? 'activated' : 'deactivated'}`);
      fetchVoyageRefs();
    } catch (e: unknown) {
      showToast('error', e instanceof Error ? e.message : 'Update failed');
    }
  }

  // ── Delete ──
  async function handleDelete(v: VoyageRef) {
    const bookingCount = v._count?.bookings ?? 0;
    if (bookingCount > 0) {
      alert(`Cannot delete: this voyage ref has ${bookingCount} booking(s) linked to it.`);
      return;
    }
    if (!confirm(`Delete voyage ref "${v.voyageRef}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/voyage-refs/${v.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      showToast('success', 'Voyage ref deleted');
      fetchVoyageRefs();
    } catch (e: unknown) {
      showToast('error', e instanceof Error ? e.message : 'Delete failed');
    }
  }

  return (
    <div className="min-h-screen">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Voyage References</h1>
        <p className="text-gray-500 text-sm mt-1">Manage vessel voyage references used in bookings</p>
      </div>

      {/* Add Form */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Add New Voyage Reference</h2>
        <form onSubmit={handleAdd} className="flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">Voyage Ref</label>
            <input
              type="text"
              value={newRef}
              onChange={(e) => setNewRef(e.target.value)}
              placeholder="e.g. SLNW2401, MV-001A…"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000] uppercase"
              required
            />
          </div>
          <button
            type="submit"
            disabled={adding || !newRef.trim()}
            className="px-6 py-2.5 bg-[#8B0000] text-white rounded-lg text-sm font-semibold hover:bg-red-900 disabled:opacity-50 transition whitespace-nowrap"
          >
            {adding ? 'Adding…' : '+ ADD'}
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">All Voyage References</h2>
          <span className="text-xs text-gray-400">{voyageRefs.length} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Voyage Ref</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Bookings</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {Array.from({ length: 5 }).map((__, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : voyageRefs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    No voyage references yet. Add one above.
                  </td>
                </tr>
              ) : (
                voyageRefs.map((v, i) => (
                  <tr key={v.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-amber-50 transition-colors`}>
                    <td className="px-4 py-3 font-mono font-semibold text-gray-900">{v.voyageRef}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        v.status === 'Active'
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-semibold ${(v._count?.bookings ?? 0) > 0 ? 'text-[#8B0000]' : 'text-gray-400'}`}>
                        {v._count?.bookings ?? 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(v.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleToggle(v)}
                          className={`px-3 py-1 rounded text-xs font-semibold transition ${
                            v.status === 'Active'
                              ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                              : 'bg-green-50 text-green-700 hover:bg-green-100'
                          }`}
                        >
                          {v.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(v)}
                          disabled={(v._count?.bookings ?? 0) > 0}
                          title={(v._count?.bookings ?? 0) > 0 ? 'Cannot delete: has linked bookings' : 'Delete'}
                          className="px-3 py-1 bg-red-50 text-red-700 rounded text-xs font-semibold hover:bg-red-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
