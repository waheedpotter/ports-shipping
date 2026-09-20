'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Container {
  id: string;
  containerNo: string;
  pol: string;
  pod: string;
  line: string | null;
  chk: string | null;
  iso: string | null;
  podAgent: string | null;
  podAgentEmail: string | null;
  mub: string | null;
  imco: string | null;
  unMo: string | null;
  temp: string | null;
  vgmWt: string | null;
  uom: string | null;
  seq: number;
}

interface BookingToken {
  id: string;
  token: string;
  status: string;
  createdAt: string;
  usedAt: string | null;
}

interface VoyageRef {
  id: string;
  voyageRef: string;
}

interface Booking {
  id: string;
  confirmationNo: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  voyageRef: VoyageRef | null;
  rotationNo: string | null;
  bookingParty: string;
  email: string;
  containers: Container[];
  bookingToken: BookingToken | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    confirmed: 'bg-green-100 text-green-800 border border-green-300',
    pending: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    cancelled: 'bg-red-100 text-red-800 border border-red-300',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${map[status?.toLowerCase()] ?? 'bg-gray-100 text-gray-700 border border-gray-300'}`}>
      {status ?? 'Unknown'}
    </span>
  );
}

function InfoField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 font-medium">{value ?? <span className="text-gray-400 font-normal">—</span>}</dd>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) return;
    setLoading(true);
    fetch(`/api/admin/bookings/${bookingId}`)
      .then((r) => {
        if (!r.ok) throw new Error('Booking not found');
        return r.json();
      })
      .then((data) => {
        setBooking(data.data ?? data);
        setLoading(false);
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : 'Failed to load booking');
        setLoading(false);
      });
  }, [bookingId]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-12 bg-gray-200 rounded-xl w-1/3" />
        <div className="h-32 bg-gray-200 rounded-xl" />
        <div className="h-32 bg-gray-200 rounded-xl" />
        <div className="h-64 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="text-center py-24">
        <p className="text-red-600 font-semibold text-lg">{error ?? 'Booking not found'}</p>
        <button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-gray-200 transition">
          ← Go Back
        </button>
      </div>
    );
  }

  const tokenStatusColor: Record<string, string> = {
    Unused: 'bg-green-100 text-green-800 border border-green-200',
    Used: 'bg-blue-100 text-blue-800 border border-blue-200',
    Expired: 'bg-red-100 text-red-800 border border-red-200',
    Deactivated: 'bg-gray-100 text-gray-700 border border-gray-200',
  };

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          .print-full { max-width: 100% !important; }
        }
      `}</style>

      <div className="max-w-5xl mx-auto space-y-6 print-full">
        {/* ── Header ── */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold text-gray-900 font-mono">{booking.confirmationNo}</h1>
              <StatusBadge status={booking.status} />
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Submitted on {new Date(booking.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="flex gap-2 no-print flex-wrap">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              ← Back
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition"
            >
              🖨 Print
            </button>
            <button
              onClick={() => window.open(`/api/admin/bookings/export?id=${booking.id}`, '_blank')}
              className="px-4 py-2 bg-[#C9A84C] text-white rounded-lg text-sm font-semibold hover:bg-yellow-600 transition"
            >
              ⬇ Download Excel
            </button>
          </div>
        </div>

        {/* ── Voyage Information ── */}
        <SectionCard title="Voyage Information">
          <dl className="grid grid-cols-2 md:grid-cols-3 gap-5">
            <InfoField label="Voyage Reference" value={booking.voyageRef?.voyageRef} />
            <InfoField label="Rotation Number" value={booking.rotationNo} />
          </dl>
        </SectionCard>

        {/* ── Booking Party ── */}
        <SectionCard title="Booking Party">
          <dl className="grid grid-cols-2 md:grid-cols-3 gap-5">
            <InfoField label="Company / Name" value={booking.bookingParty} />
            <InfoField label="Email Address" value={booking.email} />
          </dl>
        </SectionCard>

        {/* ── Container Details ── */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            Container Details
            <span className="bg-[#C9A84C]/20 text-[#8B0000] text-sm font-semibold px-2 py-0.5 rounded-full">
              {booking.containers.length}
            </span>
          </h2>
          {booking.containers.length === 0 ? (
            <p className="text-gray-400 italic text-sm">No containers listed.</p>
          ) : (
            booking.containers
              .sort((a, b) => (a.seq ?? 0) - (b.seq ?? 0))
              .map((c, idx) => (
                <div key={c.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-5 py-3 bg-[#8B0000] flex items-center gap-2">
                    <span className="text-white font-bold text-sm">Container #{idx + 1}</span>
                    {c.containerNo && (
                      <span className="text-[#C9A84C] font-mono text-sm font-semibold ml-2">{c.containerNo}</span>
                    )}
                  </div>
                  <div className="p-5">
                    <dl className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      <InfoField label="POL" value={c.pol} />
                      <InfoField label="POD" value={c.pod} />
                      <InfoField label="Line" value={c.line} />
                      <InfoField label="Container No" value={c.containerNo} />
                      <InfoField label="CHK" value={c.chk} />
                      <InfoField label="ISO" value={c.iso} />
                      <InfoField label="POD Agent" value={c.podAgent} />
                      <InfoField label="Agent Email" value={c.podAgentEmail} />
                      <InfoField label="MUB" value={c.mub} />
                      <InfoField label="IMCO" value={c.imco} />
                      <InfoField label="UN MO" value={c.unMo} />
                      <InfoField label="Temp" value={c.temp} />
                      <InfoField label="VGM WT" value={c.vgmWt} />
                      <InfoField label="UOM" value={c.uom} />
                    </dl>
                  </div>
                </div>
              ))
          )}
        </div>

        {/* ── Token Information ── */}
        {booking.bookingToken && (
          <SectionCard title="Token Information">
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <div>
                <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Token Ref</dt>
                <dd className="mt-1 font-mono text-sm font-bold text-[#8B0000]">{booking.bookingToken.token}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</dt>
                <dd className="mt-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${tokenStatusColor[booking.bookingToken.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {booking.bookingToken.status}
                  </span>
                </dd>
              </div>
              <InfoField
                label="Token Created"
                value={new Date(booking.bookingToken.createdAt).toLocaleString()}
              />
              <InfoField
                label="Used Date"
                value={booking.bookingToken.usedAt ? new Date(booking.bookingToken.usedAt).toLocaleString() : undefined}
              />
            </dl>
          </SectionCard>
        )}

        {/* ── System Info ── */}
        <SectionCard title="System Information">
          <dl className="grid grid-cols-2 md:grid-cols-3 gap-5">
            <InfoField label="Booking ID" value={booking.id} />
            <InfoField label="Created At" value={new Date(booking.createdAt).toLocaleString()} />
            <InfoField label="Last Updated" value={new Date(booking.updatedAt).toLocaleString()} />
          </dl>
        </SectionCard>

        {/* ── Bottom action bar ── */}
        <div className="flex gap-2 pb-4 no-print">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
          >
            ← Back to Bookings
          </button>
        </div>
      </div>
    </>
  );
}
