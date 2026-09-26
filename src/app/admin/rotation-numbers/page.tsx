'use client';

import { useEffect, useState, useCallback } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface RotationNum {
  id: string;
  rotationNumber: string;
  active: boolean;
  createdAt: string;
  _count?: { bookings: number };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function RotationNumbersPage() {
  const [rotations, setRotations] = useState<RotationNum[]>([]);
  const [loading, setLoading] = useState(true);

  // Add form
  const [newRot, setNewRot] = useState('');
  const [adding, setAdding] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  function showToast(type: 'success' | 'error', msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }

  // ── Fetch ──
  const fetchRotations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/rotation-numbers', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch rotation numbers');
      const json = await res.json();
      setRotations(Array.isArray(json) ? json : json.data ?? []);
    } catch (e: unknown) {
      showToast('error', e instanceof Error ? e.message : 'Fetch failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRotations(); }, [fetchRotations]);

  // ── Add ──
  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newRot.trim()) return;
    setAdding(true);
    try {
      const res = await fetch('/api/admin/rotation-numbers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rotationNumber: newRot.trim().toUpperCase() }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? 'Add failed');
      }
      const created: RotationNum = await res.json();
      setRotations((prev) => [created, ...prev]);
      showToast('success', `Rotation number "${created.rotationNumber}" added`);
      setNewRot('');
    } catch (e: unknown) {
      showToast('error', e instanceof Error ? e.message : 'Add failed');
    } finally {
      setAdding(false);
    }
  }

  // ── Toggle status ──
  async function handleToggle(r: RotationNum) {
    const newActive = !r.active;
    try {
      const res = await fetch(`/api/admin/rotation-numbers/${r.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: newActive }),
      });
      if (!res.ok) throw new Error('Update failed');
      setRotations((prev) =>
        prev.map((item) => (item.id === r.id ? { ...item, active: newActive } : item))
      );
      showToast('success', `Rotation "${r.rotationNumber}" ${newActive ? 'activated' : 'deactivated'}`);
    } catch (e: unknown) {
      showToast('error', e instanceof Error ? e.message : 'Update failed');
    }
  }

  // ── Delete ──
  async function handleDelete(r: RotationNum) {
    const bookingCount = r._count?.bookings ?? 0;
    if (bookingCount > 0) {
      alert(`Cannot delete: this rotation number has ${bookingCount} booking(s) linked to it.`);
      return;
    }
    if (!confirm(`Delete rotation number "${r.rotationNumber}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/rotation-numbers/${r.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setRotations((prev) => prev.filter((item) => item.id !== r.id));
      showToast('success', 'Rotation number deleted');
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
        <h1 className="text-3xl font-bold text-gray-900">Rotation Numbers</h1>
        <p className="text-gray-500 text-sm mt-1">Manage port/terminal rotation numbers used in client bookings</p>
      </div>

      {/* Add Form */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Add New Rotation Number</h2>
        <form onSubmit={handleAdd} className="flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">Rotation Number</label>
            <input
              type="text"
              value={newRot}
              onChange={(e) => setNewRot(e.target.value)}
              placeholder="e.g. ROT-2026-001, RN-1024…"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000] uppercase font-mono"
              required
            />
          </div>
          <button
            type="submit"
            disabled={adding || !newRot.trim()}
            className="px-6 py-2.5 bg-[#8B0000] text-white rounded-lg text-sm font-semibold hover:bg-red-900 disabled:opacity-50 transition whitespace-nowrap"
          >
            {adding ? 'Adding…' : '+ ADD ROTATION'}
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">All Rotation Numbers</h2>
          <span className="text-xs text-gray-400">{rotations.length} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rotation Number</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Bookings</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {Array.from({ length: 5 }).map((__, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : rotations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    No rotation numbers yet. Add one above.
                  </td>
                </tr>
              ) : (
                rotations.map((r, i) => (
                  <tr key={r.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-amber-50 transition-colors`}>
                    <td className="px-4 py-3 font-mono font-semibold text-gray-900">{r.rotationNumber}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        r.active
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {r.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-semibold ${(r._count?.bookings ?? 0) > 0 ? 'text-[#8B0000]' : 'text-gray-400'}`}>
                        {r._count?.bookings ?? 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      <div>{new Date(r.createdAt).toLocaleDateString()}</div>
                      <div className="text-gray-400 font-mono text-[11px]">
                        {new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleToggle(r)}
                          className={`px-3 py-1 rounded text-xs font-semibold transition ${
                            r.active
                              ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                              : 'bg-green-50 text-green-700 hover:bg-green-100'
                          }`}
                        >
                          {r.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(r)}
                          disabled={(r._count?.bookings ?? 0) > 0}
                          title={(r._count?.bookings ?? 0) > 0 ? 'Cannot delete: has linked bookings' : 'Delete'}
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
