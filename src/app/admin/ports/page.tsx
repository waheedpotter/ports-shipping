'use client';

import { useEffect, useState, useCallback } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Port {
  id: string;
  portCode: string;
  portName: string | null;
  status: 'Active' | 'Inactive';
  createdAt: string;
  _count?: { bookingsAsPol?: number; bookingsAsPod?: number };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PortsPage() {
  const [ports, setPorts] = useState<Port[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Add form
  const [portCode, setPortCode] = useState('');
  const [portName, setPortName] = useState('');
  const [adding, setAdding] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  function showToast(type: 'success' | 'error', msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }

  // ── Fetch ──
  const fetchPorts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/ports');
      if (!res.ok) throw new Error('Failed to fetch ports');
      const json = await res.json();
      setPorts(json.data ?? json ?? []);
    } catch (e: unknown) {
      showToast('error', e instanceof Error ? e.message : 'Fetch failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPorts(); }, [fetchPorts]);

  // ── Add ──
  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!portCode.trim()) return;
    setAdding(true);
    try {
      const body: Record<string, string> = { portCode: portCode.trim().toUpperCase() };
      if (portName.trim()) body.portName = portName.trim();
      const res = await fetch('/api/admin/ports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? 'Add failed');
      }
      showToast('success', `Port "${portCode.trim().toUpperCase()}" added`);
      setPortCode('');
      setPortName('');
      fetchPorts();
    } catch (e: unknown) {
      showToast('error', e instanceof Error ? e.message : 'Add failed');
    } finally {
      setAdding(false);
    }
  }

  // ── Toggle ──
  async function handleToggle(p: Port) {
    const newStatus = p.status === 'Active' ? 'Inactive' : 'Active';
    try {
      const res = await fetch(`/api/admin/ports/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Update failed');
      showToast('success', `Port ${newStatus === 'Active' ? 'activated' : 'deactivated'}`);
      fetchPorts();
    } catch (e: unknown) {
      showToast('error', e instanceof Error ? e.message : 'Update failed');
    }
  }

  // ── Delete ──
  async function handleDelete(p: Port) {
    const polCount = p._count?.bookingsAsPol ?? 0;
    const podCount = p._count?.bookingsAsPod ?? 0;
    if (polCount + podCount > 0) {
      alert(`Cannot delete: port "${p.portCode}" is linked to ${polCount + podCount} booking(s).`);
      return;
    }
    if (!confirm(`Delete port "${p.portCode}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/ports/${p.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      showToast('success', 'Port deleted');
      fetchPorts();
    } catch (e: unknown) {
      showToast('error', e instanceof Error ? e.message : 'Delete failed');
    }
  }

  const filtered = ports.filter(
    (p) =>
      p.portCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.portName ?? '').toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
        <h1 className="text-3xl font-bold text-gray-900">Ports</h1>
        <p className="text-gray-500 text-sm mt-1">Manage ports of loading and discharge used in bookings</p>
      </div>

      {/* Add Form */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Add New Port</h2>
        <form onSubmit={handleAdd} className="flex items-end gap-3 flex-wrap">
          <div className="w-36">
            <label className="block text-xs font-medium text-gray-600 mb-1">Port Code <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={portCode}
              onChange={(e) => setPortCode(e.target.value)}
              placeholder="e.g. AEJEA"
              maxLength={10}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000] uppercase font-mono"
              required
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-600 mb-1">Port Name (optional)</label>
            <input
              type="text"
              value={portName}
              onChange={(e) => setPortName(e.target.value)}
              placeholder="e.g. Jebel Ali, Dubai"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
            />
          </div>
          <button
            type="submit"
            disabled={adding || !portCode.trim()}
            className="px-6 py-2.5 bg-[#8B0000] text-white rounded-lg text-sm font-semibold hover:bg-red-900 disabled:opacity-50 transition whitespace-nowrap"
          >
            {adding ? 'Adding…' : '🏗️ ADD PORT'}
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-3">
          Note: Initial ports are seeded from the backend. Only add ports that are not already listed below.
        </p>
      </div>

      {/* Search + Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-3">
          <h2 className="text-sm font-semibold text-gray-700 whitespace-nowrap">All Ports</h2>
          <input
            type="text"
            placeholder="Search port code or name…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 max-w-sm border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
          />
          <span className="ml-auto text-xs text-gray-400 whitespace-nowrap">{filtered.length} port{filtered.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Port Code</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Port Name</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {Array.from({ length: 5 }).map((__, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    {searchTerm ? 'No ports match your search.' : 'No ports yet. Add one above.'}
                  </td>
                </tr>
              ) : (
                filtered.map((p, i) => (
                  <tr key={p.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-amber-50 transition-colors`}>
                    <td className="px-4 py-3 font-mono font-bold text-[#8B0000]">{p.portCode}</td>
                    <td className="px-4 py-3 text-gray-700">{p.portName ?? <span className="text-gray-400 italic text-xs">—</span>}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        p.status === 'Active'
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleToggle(p)}
                          className={`px-3 py-1 rounded text-xs font-semibold transition ${
                            p.status === 'Active'
                              ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                              : 'bg-green-50 text-green-700 hover:bg-green-100'
                          }`}
                        >
                          {p.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          disabled={((p._count?.bookingsAsPol ?? 0) + (p._count?.bookingsAsPod ?? 0)) > 0}
                          title={
                            ((p._count?.bookingsAsPol ?? 0) + (p._count?.bookingsAsPod ?? 0)) > 0
                              ? 'Cannot delete: has linked bookings'
                              : 'Delete port'
                          }
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
