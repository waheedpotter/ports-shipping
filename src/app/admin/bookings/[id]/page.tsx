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
        {(() => {
          const confNo = (booking as any).confirmationNumber || booking.confirmationNo;
          const tokenObj = (booking as any).token || booking.bookingToken;
          const voyage = (booking as any).voyageReference?.voyageRef || booking.voyageRef?.voyageRef;
          const rotNo = (booking as any).rotationNumber || booking.rotationNo;
          const clientEmail = (booking as any).bookingPartyEmail || booking.email;
          const containers = booking.containers || [];

          return (
            <>
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-3xl font-bold text-gray-900 font-mono">{confNo}</h1>
                    <StatusBadge status={booking.status} />
                    {tokenObj?.token && (
                      <span className="font-mono font-bold text-sm bg-amber-50 text-[#8B0000] border border-[#C9A84C]/60 px-3 py-1 rounded-lg">
                        Token: {tokenObj.token}
                      </span>
                    )}
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

              {/* ── Token Information Banner ── */}
              {tokenObj && (
                <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border border-[#C9A84C]/50 rounded-xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#8B0000] text-[#C9A84C] flex items-center justify-center font-bold text-lg">
                      🔑
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Booking Token Reference</p>
                      <p className="text-xl font-mono font-black text-[#8B0000]">{tokenObj.token}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap text-sm">
                    <div>
                      <span className="text-xs text-gray-400 block font-semibold uppercase">Token Status</span>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${tokenStatusColor[tokenObj.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {tokenObj.status}
                      </span>
                    </div>
                    {tokenObj.createdAt && (
                      <div>
                        <span className="text-xs text-gray-400 block font-semibold uppercase">Generated</span>
                        <span className="text-gray-700 font-medium">{new Date(tokenObj.createdAt).toLocaleDateString()}</span>
                      </div>
                    )}
                    {tokenObj.usedAt && (
                      <div>
                        <span className="text-xs text-gray-400 block font-semibold uppercase">Used At</span>
                        <span className="text-gray-700 font-medium">{new Date(tokenObj.usedAt).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Voyage Information ── */}
              <SectionCard title="Voyage Information">
                <dl className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  <InfoField label="Voyage Reference" value={voyage} />
                  <InfoField label="Rotation Number" value={rotNo} />
                </dl>
              </SectionCard>

              {/* ── Booking Party ── */}
              <SectionCard title="Booking Party (Client)">
                <dl className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  <InfoField label="Company / Client Name" value={booking.bookingParty} />
                  <InfoField label="Client Email Address" value={clientEmail} />
                  <InfoField label="Assigned Token" value={tokenObj?.token} />
                </dl>
              </SectionCard>

              {/* ── Container Details ── */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  Container Details
                  <span className="bg-[#C9A84C]/20 text-[#8B0000] text-sm font-semibold px-2 py-0.5 rounded-full">
                    {containers.length}
                  </span>
                </h2>
                {containers.length === 0 ? (
                  <p className="text-gray-400 italic text-sm">No containers listed.</p>
                ) : (
                  containers
                    .sort((a, b) => (a.seq ?? (a as any).sortOrder ?? 0) - (b.seq ?? (a as any).sortOrder ?? 0))
                    .map((c, idx) => {
                      const cNo = c.containerNo || (c as any).containerNumber;
                      const pAgent = c.podAgent || (c as any).podAgentName;
                      const pAgentEmail = c.podAgentEmail || (c as any).email;
                      const weight = c.vgmWt || (c as any).vgmWeight;

                      return (
                        <div key={c.id || idx} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                          <div className="px-5 py-3 bg-[#8B0000] flex items-center gap-2">
                            <span className="text-white font-bold text-sm">Container #{idx + 1}</span>
                            {cNo && (
                              <span className="text-[#C9A84C] font-mono text-sm font-semibold ml-2">{cNo}</span>
                            )}
                          </div>
                          <div className="p-5">
                            <dl className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                              <InfoField label="POL" value={c.pol} />
                              <InfoField label="POD" value={c.pod} />
                              <InfoField label="Line" value={c.line} />
                              <InfoField label="Container No" value={cNo} />
                              <InfoField label="CHK" value={c.chk} />
                              <InfoField label="ISO" value={c.iso} />
                              <InfoField label="POD Agent" value={pAgent} />
                              <InfoField label="Agent Email" value={pAgentEmail} />
                              <InfoField label="MOB No." value={c.mub} />
                              <InfoField label="IMCO" value={c.imco} />
                              <InfoField label="UN MO" value={c.unMo} />
                              <InfoField label="Temp" value={c.temp || (c as any).temperature} />
                              <InfoField label="VGM WT" value={weight != null ? String(weight) : undefined} />
                              <InfoField label="UOM" value={c.uom} />
                            </dl>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </>
          );
        })()}

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
