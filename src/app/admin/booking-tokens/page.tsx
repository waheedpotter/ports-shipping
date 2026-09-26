'use client';

import { useEffect, useState, useCallback } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Token {
  id: string;
  token: string;
  status: 'Unused' | 'Used' | 'Expired' | 'Deactivated';
  createdAt: string;
  expiresAt: string | null;
  usedAt: string | null;
  notes: string | null;
  booking?: {
    id: string;
    confirmationNumber: string;
  } | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Unused: 'bg-green-100 text-green-800 border border-green-200',
    Used: 'bg-blue-100 text-blue-800 border border-blue-200',
    Expired: 'bg-red-100 text-red-800 border border-red-200',
    Deactivated: 'bg-gray-100 text-gray-700 border border-gray-200',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BookingTokensPage() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Generate form
  const [showForm, setShowForm] = useState(false);
  const [expiresAt, setExpiresAt] = useState('');
  const [notes, setNotes] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  function showToast(type: 'success' | 'error', msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }

  // ── Fetch ──
  const fetchTokens = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/admin/booking-tokens?${params.toString()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch tokens');
      const json = await res.json();
      setTokens(json.data ?? json ?? []);
    } catch (e: unknown) {
      showToast('error', e instanceof Error ? e.message : 'Failed to fetch tokens');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchTokens(); }, [fetchTokens]);

  // ── Generate ──
  async function handleGenerate() {
    setGenerating(true);
    setGeneratedToken(null);
    try {
      const body: Record<string, string> = {};
      if (expiresAt) body.expiresAt = new Date(expiresAt).toISOString();
      if (notes) body.notes = notes;
      const res = await fetch('/api/admin/booking-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Generation failed');
      const json = await res.json();
      const tokenStr = json.token ?? json.data?.token ?? json.data?.id;
      setGeneratedToken(tokenStr);
      // Optimistic update — prepend to list immediately
      setTokens((prev) => [json, ...prev]);
      showToast('success', 'Token generated successfully');
      setExpiresAt('');
      setNotes('');
    } catch (e: unknown) {
      showToast('error', e instanceof Error ? e.message : 'Generation failed');
    } finally {
      setGenerating(false);
    }
  }

  // ── Copy ──
  async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ── Deactivate ──
  async function handleDeactivate(id: string) {
    if (!confirm('Deactivate this token? It will no longer be usable.')) return;
    try {
      const res = await fetch(`/api/admin/booking-tokens/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Deactivated' }),
      });
      if (!res.ok) throw new Error('Deactivation failed');
      showToast('success', 'Token deactivated');
      fetchTokens();
    } catch (e: unknown) {
      showToast('error', e instanceof Error ? e.message : 'Deactivation failed');
    }
  }

  // ── Delete ──
  async function handleDelete(id: string, token: string) {
    if (!confirm(`Delete token ${token}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/booking-tokens/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      showToast('success', 'Token deleted');
      fetchTokens();
    } catch (e: unknown) {
      showToast('error', e instanceof Error ? e.message : 'Delete failed');
    }
  }

  const filtered = statusFilter
    ? tokens.filter((t) => t.status === statusFilter)
    : tokens;

  return (
    <div className="min-h-screen">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Tokens</h1>
          <p className="text-gray-500 text-sm mt-1">Generate and manage one-time booking tokens</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setGeneratedToken(null); }}
          className="px-5 py-2.5 bg-[#8B0000] text-white rounded-lg text-sm font-semibold hover:bg-red-900 transition"
        >
          {showForm ? '✕ Close' : '+ Generate Token'}
        </button>
      </div>

      {/* Generate Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Generate New Token</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Expiry Date (optional)</label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={1}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000] resize-none"
                placeholder="e.g. For ABC Shipping Co."
              />
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-6 py-2.5 bg-[#C9A84C] text-white rounded-lg text-sm font-semibold hover:bg-yellow-600 disabled:opacity-50 transition"
          >
            {generating ? 'Generating…' : '⚡ GENERATE TOKEN'}
          </button>

          {/* Generated token display */}
          {generatedToken && (
            <div className="mt-5 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <div className="flex-1">
                <p className="text-xs text-green-700 font-medium mb-1">Token Generated Successfully</p>
                <p className="font-mono text-lg font-bold text-[#8B0000] tracking-wider">{generatedToken}</p>
              </div>
              <button
                onClick={() => copyToClipboard(generatedToken)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition whitespace-nowrap"
              >
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 font-medium">Filter by status:</span>
          {['', 'Unused', 'Used', 'Expired', 'Deactivated'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === s
                  ? 'bg-[#8B0000] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {s === '' ? 'All' : s}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-400">{filtered.length} token{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#8B0000] text-white">
                <th className="px-4 py-3 text-left font-semibold">Token</th>
                <th className="px-4 py-3 text-center font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Created</th>
                <th className="px-4 py-3 text-left font-semibold">Expires</th>
                <th className="px-4 py-3 text-left font-semibold">Used Date</th>
                <th className="px-4 py-3 text-left font-semibold">Linked Booking</th>
                <th className="px-4 py-3 text-left font-semibold">Notes</th>
                <th className="px-4 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {Array.from({ length: 8 }).map((__, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">No tokens found.</td>
                </tr>
              ) : (
                filtered.map((t, i) => (
                  <tr key={t.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-amber-50 transition-colors`}>
                    <td className="px-4 py-3 font-mono text-[#8B0000] font-semibold text-xs whitespace-nowrap">
                      {t.token}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-xs">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-xs">
                      {t.expiresAt ? new Date(t.expiresAt).toLocaleDateString() : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-xs">
                      {t.usedAt ? new Date(t.usedAt).toLocaleDateString() : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {t.booking ? (
                        <a href={`/admin/bookings/${t.booking.id}`} className="text-[#8B0000] font-semibold hover:underline font-mono">
                          {t.booking.confirmationNumber}
                        </a>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs max-w-[140px] truncate">
                      {t.notes ?? <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => copyToClipboard(t.token)}
                          title="Copy token"
                          className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium hover:bg-slate-200 transition"
                        >
                          📋
                        </button>
                        {t.status === 'Unused' && (
                          <>
                            <button
                              onClick={() => handleDeactivate(t.id)}
                              className="px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs font-medium hover:bg-amber-100 transition"
                            >
                              Deactivate
                            </button>
                            <button
                              onClick={() => handleDelete(t.id, t.token)}
                              className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-medium hover:bg-red-100 transition"
                            >
                              Delete
                            </button>
                          </>
                        )}
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
