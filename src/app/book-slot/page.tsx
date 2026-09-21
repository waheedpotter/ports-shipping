'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Plus,
  X,
  Loader2,
  CalendarCheck,
  Ship,
  Package,
  User,
  ClipboardList,
  BadgeCheck,
  Printer,
  Download,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface Container {
  pol: string;
  pod: string;
  line: string;
  containerNumber: string;
  chk: string;
  iso: string;
  podAgentName: string;
  email: string;
  mub: string;
  imco: string;
  unMo: string;
  temperature: string;
  vgmWeight: string;
  uom: string;
}

interface BookingFormData {
  tokenId: string;
  verifiedToken: string;
  voyageReferenceId: string;
  voyageRef: string;
  rotationNumber: string;
  containers: Container[];
  bookingParty: string;
  bookingPartyEmail: string;
}

interface VoyageRef {
  id: string;
  voyageRef: string;
  status?: string;
}

interface Port {
  id: string;
  portCode: string;
  portName?: string;
}

interface ConfirmationResult {
  confirmationNumber: string;
  bookingId: string;
  submittedAt: string;
}

/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────── */
const ISO_OPTIONS = [
  '20GP', '40HC', '40ST', '40RH', '20RH',
  '40FR', '20FR', '20OT', '40OT', '45FR', '45OT',
];

const UOM_OPTIONS = ['KG', 'MT'];

const EMPTY_CONTAINER: Container = {
  pol: '', pod: '', line: '', containerNumber: '',
  chk: '', iso: '', podAgentName: '', email: '',
  mub: '', imco: '', unMo: '', temperature: '',
  vgmWeight: '', uom: 'KG',
};

const STEPS = [
  { label: 'Verify Token', icon: BadgeCheck },
  { label: 'Voyage Info', icon: Ship },
  { label: 'Containers', icon: Package },
  { label: 'Booking Party', icon: User },
  { label: 'Review', icon: ClipboardList },
  { label: 'Confirmed', icon: CalendarCheck },
];

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function isValidEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

/** Spinner */
function Spinner({ className = 'w-5 h-5' }: { className?: string }) {
  return <Loader2 className={`${className} animate-spin`} />;
}

/** Field wrapper */
function Field({
  label, required, error, children,
}: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 flex-shrink-0" /> {error}
        </p>
      )}
    </div>
  );
}

/** Input */
function Input({
  value, onChange, placeholder, type = 'text', step, className = '', error,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string;
  type?: string; step?: string; className?: string; error?: boolean;
}) {
  return (
    <input
      type={type}
      step={step}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-3 py-2 text-sm rounded-md border ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'
        } focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent transition ${className}`}
    />
  );
}

/** Select */
function Select({
  value, onChange, options, placeholder = 'Select…', error,
}: {
  value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string; error?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`w-full px-3 py-2 text-sm rounded-md border ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'
        } focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent transition bg-white`}
    >
      <option value="">{placeholder}</option>
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

/* ─────────────────────────────────────────────
   Step Indicator
───────────────────────────────────────────── */
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-center min-w-max mx-auto px-4">
        {STEPS.map((step, idx) => {
          const done = idx < current;
          const active = idx === current;
          const Icon = step.icon;
          return (
            <div key={step.label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${done
                    ? 'bg-green-500 border-green-500 text-white'
                    : active
                      ? 'bg-[#C9A84C] border-[#C9A84C] text-white shadow-lg scale-110'
                      : 'bg-white border-gray-300 text-gray-400'
                    }`}
                >
                  {done ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <span
                  className={`mt-1 text-[10px] font-semibold whitespace-nowrap ${done ? 'text-green-600' : active ? 'text-[#C9A84C]' : 'text-gray-400'
                    }`}
                >
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={`h-0.5 w-10 sm:w-16 mx-1 transition-all duration-500 ${idx < current ? 'bg-green-400' : 'bg-gray-200'
                    }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Step 1 — Token Verification
───────────────────────────────────────────── */
function StepVerifyToken({
  onVerified,
}: {
  onVerified: (tokenId: string, token: string) => void;
}) {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleVerify = async () => {
    const t = token.trim();
    if (!t) { setError('Please enter your booking token.'); return; }
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('/api/booking/validate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: t }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        const msg: Record<number, string> = {
          400: 'Invalid booking token. Please check the reference number.',
          410: 'This booking token has expired. Please contact Ports Shipping.',
          409: 'This booking token has already been used.',
          429: 'Too many attempts. Please try again later.',
        };
        setError(msg[res.status] || data.message || 'Invalid booking token. Please check the reference number.');
        return;
      }
      setSuccess(`✓ Token ${t} verified successfully`);
      setTimeout(() => onVerified(data.tokenId, t), 800);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[55vh] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#8B0000]/10 flex items-center justify-center mb-4">
            <BadgeCheck className="w-8 h-8 text-[#8B0000]" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Verify Booking Token</h2>
          <p className="text-sm text-gray-500 mt-1 text-center">
            Enter the booking token reference provided by Ports Shipping LLC
          </p>
        </div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 font-medium text-sm"
          >
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            {success}
          </motion.div>
        ) : (
          <>
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1">
                Booking Token / Reference No.
              </label>
              <input
                type="text"
                value={token}
                onChange={e => { setToken(e.target.value.toUpperCase()); setError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleVerify()}
                placeholder="PS-BK-XXXXXX"
                className={`w-full px-4 py-3 text-base rounded-lg border font-mono tracking-widest ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition`}
              />
              {error && (
                <p className="mt-2 text-sm text-red-600 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {error}
                </p>
              )}
            </div>
            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full py-3 bg-[#8B0000] text-white font-bold rounded-lg hover:bg-[#7a0000] transition flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <><Spinner /> Verifying…</> : 'VERIFY TOKEN'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Step 2 — Voyage Information
───────────────────────────────────────────── */
function StepVoyageInfo({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: Pick<BookingFormData, 'voyageReferenceId' | 'voyageRef' | 'rotationNumber'>;
  onChange: (k: string, v: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [voyageRefs, setVoyageRefs] = useState<VoyageRef[]>([]);
  const [loadingRefs, setLoadingRefs] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/booking/voyage-refs')
      .then(r => r.json())
      .then(d => setVoyageRefs(Array.isArray(d) ? d : []))
      .catch(() => setVoyageRefs([]))
      .finally(() => setLoadingRefs(false));
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!data.voyageReferenceId) e.voyageReferenceId = 'Please select a voyage reference.';
    if (!data.rotationNumber.trim()) e.rotationNumber = 'Rotation number is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleVoyageChange = (id: string) => {
    const ref = voyageRefs.find(v => v.id === id);
    onChange('voyageReferenceId', id);
    onChange('voyageRef', ref?.voyageRef || '');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-[#8B0000]/10 flex items-center justify-center">
            <Ship className="w-5 h-5 text-[#8B0000]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Voyage Information</h2>
            <p className="text-sm text-gray-500">Select the voyage and rotation details</p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <Field label="Voyage Reference" required error={errors.voyageReferenceId}>
            {loadingRefs ? (
              <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
                <Spinner className="w-4 h-4" /> Loading voyage references…
              </div>
            ) : (
              <Select
                value={data.voyageReferenceId}
                onChange={handleVoyageChange}
                options={voyageRefs.map(v => ({ value: v.id, label: v.voyageRef }))}
                placeholder="— Select voyage reference —"
                error={!!errors.voyageReferenceId}
              />
            )}
          </Field>

          <Field label="Rotation Number" required error={errors.rotationNumber}>
            <Input
              value={data.rotationNumber}
              onChange={v => onChange('rotationNumber', v)}
              placeholder="e.g. ROT-2026-001"
              error={!!errors.rotationNumber}
            />
          </Field>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition text-sm"
          >
            <ChevronLeft className="w-4 h-4" /> BACK
          </button>
          <button
            onClick={() => validate() && onNext()}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#8B0000] text-white rounded-lg font-bold hover:bg-[#7a0000] transition text-sm"
          >
            NEXT <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Container Card
───────────────────────────────────────────── */
function ContainerCard({
  idx, container, ports, onChange, onRemove, canRemove,
}: {
  idx: number;
  container: Container;
  ports: Port[];
  onChange: (idx: number, key: keyof Container, val: string) => void;
  onRemove: (idx: number) => void;
  canRemove: boolean;
}) {
  const [errors, setErrors] = useState<Partial<Record<keyof Container, string>>>({});
  const portOptions = ports.map(p => ({
    value: p.portCode,
    label: p.portName ? `${p.portCode} — ${p.portName}` : p.portCode,
  }));

  // expose validation upward via ref — handled by parent calling validate on each
  const upd = (k: keyof Container, v: string) => {
    onChange(idx, k, v);
    if (errors[k]) setErrors(prev => ({ ...prev, [k]: '' }));
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 sm:p-6 mb-4">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#8B0000] text-white flex items-center justify-center text-xs font-bold">
            {idx + 1}
          </div>
          <h3 className="font-bold text-gray-800 text-sm">Container #{idx + 1}</h3>
        </div>
        <button
          onClick={() => onRemove(idx)}
          disabled={!canRemove}
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition ${canRemove
            ? 'text-red-600 hover:bg-red-50 border border-red-200'
            : 'text-gray-300 border border-gray-200 cursor-not-allowed'
            }`}
        >
          <X className="w-3.5 h-3.5" /> Remove
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="POL" required error={errors.pol}>
          <Select
            value={container.pol}
            onChange={v => upd('pol', v)}
            options={portOptions}
            placeholder="— Port of Loading —"
            error={!!errors.pol}
          />
        </Field>
        <Field label="POD" required error={errors.pod}>
          <Select
            value={container.pod}
            onChange={v => upd('pod', v)}
            options={portOptions}
            placeholder="— Port of Discharge —"
            error={!!errors.pod}
          />
        </Field>
        <Field label="Line">
          <Input value={container.line} onChange={v => upd('line', v)} placeholder="Shipping line" />
        </Field>
        <Field label="Container Number" required error={errors.containerNumber}>
          <Input
            value={container.containerNumber}
            onChange={v => upd('containerNumber', v.toUpperCase())}
            placeholder="e.g. ABCD1234567"
            error={!!errors.containerNumber}
          />
        </Field>
        <Field label="CHK">
          <Input value={container.chk} onChange={v => upd('chk', v)} placeholder="Check digit" />
        </Field>
        <Field label="ISO" required error={errors.iso}>
          <Select
            value={container.iso}
            onChange={v => upd('iso', v)}
            options={ISO_OPTIONS.map(o => ({ value: o, label: o }))}
            placeholder="— ISO Type —"
            error={!!errors.iso}
          />
        </Field>
        <Field label="POD Agent Name">
          <Input value={container.podAgentName} onChange={v => upd('podAgentName', v)} placeholder="Agent name" />
        </Field>
        <Field label="Email">
          <Input type="email" value={container.email} onChange={v => upd('email', v)} placeholder="agent@example.com" />
        </Field>
        <Field label="MUB">
          <Input value={container.mub} onChange={v => upd('mub', v)} placeholder="MUB" />
        </Field>
        <Field label="IMCO">
          <Input value={container.imco} onChange={v => upd('imco', v)} placeholder="IMCO class" />
        </Field>
        <Field label="UN MO">
          <Input value={container.unMo} onChange={v => upd('unMo', v)} placeholder="UN number" />
        </Field>
        <Field label="Temp">
          <Input value={container.temperature} onChange={v => upd('temperature', v)} placeholder="e.g. -18°C" />
        </Field>
        <Field label="VGM WT">
          <Input
            type="number"
            step="0.01"
            value={container.vgmWeight}
            onChange={v => upd('vgmWeight', v)}
            placeholder="0.00"
          />
        </Field>
        <Field label="UOM">
          <Select
            value={container.uom}
            onChange={v => upd('uom', v)}
            options={UOM_OPTIONS.map(o => ({ value: o, label: o }))}
          />
        </Field>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Step 3 — Container Details
───────────────────────────────────────────── */
function StepContainerDetails({
  containers,
  onContainersChange,
  onNext,
  onBack,
}: {
  containers: Container[];
  onContainersChange: (c: Container[]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [ports, setPorts] = useState<Port[]>([]);
  const [loadingPorts, setLoadingPorts] = useState(true);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    fetch('/api/booking/ports')
      .then(r => r.json())
      .then(d => setPorts(Array.isArray(d) ? d : []))
      .catch(() => setPorts([]))
      .finally(() => setLoadingPorts(false));
  }, []);

  const updateContainer = (idx: number, key: keyof Container, val: string) => {
    const updated = containers.map((c, i) => i === idx ? { ...c, [key]: val } : c);
    onContainersChange(updated);
  };

  const addContainer = () => {
    onContainersChange([...containers, { ...EMPTY_CONTAINER }]);
  };

  const removeContainer = (idx: number) => {
    if (containers.length <= 1) return;
    onContainersChange(containers.filter((_, i) => i !== idx));
  };

  const validate = () => {
    for (let i = 0; i < containers.length; i++) {
      const c = containers[i];
      if (!c.pol) { setValidationError(`Container #${i + 1}: POL is required.`); return false; }
      if (!c.pod) { setValidationError(`Container #${i + 1}: POD is required.`); return false; }
      if (!c.containerNumber.trim()) { setValidationError(`Container #${i + 1}: Container Number is required.`); return false; }
      if (!c.iso) { setValidationError(`Container #${i + 1}: ISO type is required.`); return false; }
    }
    setValidationError('');
    return true;
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[#8B0000]/10 flex items-center justify-center">
          <Package className="w-5 h-5 text-[#8B0000]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Container Details</h2>
          <p className="text-sm text-gray-500">{containers.length} container{containers.length !== 1 ? 's' : ''} added</p>
        </div>
      </div>

      {loadingPorts ? (
        <div className="flex items-center gap-3 py-12 justify-center text-gray-500">
          <Spinner /> Loading port list…
        </div>
      ) : (
        <>
          {containers.map((c, idx) => (
            <ContainerCard
              key={idx}
              idx={idx}
              container={c}
              ports={ports}
              onChange={updateContainer}
              onRemove={removeContainer}
              canRemove={containers.length > 1}
            />
          ))}

          <button
            onClick={addContainer}
            className="flex items-center gap-2 px-5 py-2.5 border-2 border-dashed border-[#C9A84C] text-[#C9A84C] rounded-xl font-semibold hover:bg-amber-50 transition text-sm w-full justify-center mb-6"
          >
            <Plus className="w-4 h-4" /> ADD CONTAINER
          </button>
        </>
      )}

      {validationError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {validationError}
        </div>
      )}

      <div className="flex justify-between mt-2">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition text-sm"
        >
          <ChevronLeft className="w-4 h-4" /> BACK
        </button>
        <button
          onClick={() => validate() && onNext()}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#8B0000] text-white rounded-lg font-bold hover:bg-[#7a0000] transition text-sm"
        >
          NEXT <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Step 4 — Booking Party
───────────────────────────────────────────── */
function StepBookingParty({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: Pick<BookingFormData, 'bookingParty' | 'bookingPartyEmail'>;
  onChange: (k: string, v: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!data.bookingParty.trim()) e.bookingParty = 'Booking party name is required.';
    if (!data.bookingPartyEmail.trim()) e.bookingPartyEmail = 'Email address is required.';
    else if (!isValidEmail(data.bookingPartyEmail)) e.bookingPartyEmail = 'Please enter a valid email address.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-[#8B0000]/10 flex items-center justify-center">
            <User className="w-5 h-5 text-[#8B0000]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Booking Party Details</h2>
            <p className="text-sm text-gray-500">Contact information for this booking</p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <Field label="Booking Done Party" required error={errors.bookingParty}>
            <Input
              value={data.bookingParty}
              onChange={v => { onChange('bookingParty', v); if (errors.bookingParty) setErrors(p => ({ ...p, bookingParty: '' })); }}
              placeholder="Company or individual name"
              error={!!errors.bookingParty}
            />
          </Field>

          <Field label="Email" required error={errors.bookingPartyEmail}>
            <Input
              type="email"
              value={data.bookingPartyEmail}
              onChange={v => { onChange('bookingPartyEmail', v); if (errors.bookingPartyEmail) setErrors(p => ({ ...p, bookingPartyEmail: '' })); }}
              placeholder="booking@company.com"
              error={!!errors.bookingPartyEmail}
            />
          </Field>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition text-sm"
          >
            <ChevronLeft className="w-4 h-4" /> BACK
          </button>
          <button
            onClick={() => validate() && onNext()}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#8B0000] text-white rounded-lg font-bold hover:bg-[#7a0000] transition text-sm"
          >
            NEXT <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Step 5 — Review & Confirm
───────────────────────────────────────────── */
function StepReview({
  data,
  onBack,
  onSubmit,
}: {
  data: BookingFormData;
  onBack: () => void;
  onSubmit: () => Promise<void>;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      await onSubmit();
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-[#8B0000]/10 flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-[#8B0000]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Review & Confirm</h2>
            <p className="text-sm text-gray-500">Please verify all details before submitting</p>
          </div>
        </div>

        {/* Token */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-3 mb-5">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="text-xs text-green-600 font-semibold uppercase tracking-wide">Verified Token</p>
            <p className="font-mono font-bold text-green-800">{data.verifiedToken}</p>
          </div>
        </div>

        {/* Voyage */}
        <div className="rounded-lg border border-gray-200 p-4 mb-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Voyage Information</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500 text-xs">Voyage Reference</p>
              <p className="font-semibold text-gray-900">{data.voyageRef || '—'}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Rotation Number</p>
              <p className="font-semibold text-gray-900">{data.rotationNumber || '—'}</p>
            </div>
          </div>
        </div>

        {/* Booking Party */}
        <div className="rounded-lg border border-gray-200 p-4 mb-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Booking Party</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500 text-xs">Name</p>
              <p className="font-semibold text-gray-900">{data.bookingParty || '—'}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Email</p>
              <p className="font-semibold text-gray-900 break-all">{data.bookingPartyEmail || '—'}</p>
            </div>
          </div>
        </div>

        {/* Containers */}
        <div className="rounded-lg border border-gray-200 p-4 mb-6">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Containers ({data.containers.length})
          </h3>
          <div className="space-y-2">
            {data.containers.map((c, i) => (
              <div key={i} className="text-sm">
                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  className="w-full flex items-center justify-between p-2 rounded hover:bg-gray-50 transition text-left"
                >
                  <span className="font-medium text-gray-800">
                    {i + 1}. {c.containerNumber || 'Container ' + (i + 1)} — {c.iso || '?'} — {c.pol} → {c.pod}
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 text-gray-400 transition-transform ${expanded === i ? 'rotate-90' : ''}`}
                  />
                </button>
                {expanded === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-gray-50 rounded p-3 mt-1 grid grid-cols-2 gap-2 text-xs"
                  >
                    {[
                      ['POL', c.pol], ['POD', c.pod], ['Line', c.line],
                      ['Container No.', c.containerNumber], ['CHK', c.chk], ['ISO', c.iso],
                      ['POD Agent', c.podAgentName], ['Email', c.email],
                      ['MUB', c.mub], ['IMCO', c.imco], ['UN MO', c.unMo],
                      ['Temp', c.temperature], ['VGM WT', c.vgmWeight ? `${c.vgmWeight} ${c.uom}` : ''],
                    ].map(([k, v]) => v ? (
                      <div key={k}>
                        <span className="text-gray-400">{k}: </span>
                        <span className="font-medium text-gray-700">{v}</span>
                      </div>
                    ) : null)}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>

        {submitError && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {submitError}
          </div>
        )}

        <div className="flex justify-between">
          <button
            onClick={onBack}
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition text-sm disabled:opacity-60"
          >
            <ChevronLeft className="w-4 h-4" /> EDIT DETAILS
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#8B0000] text-white rounded-lg font-bold hover:bg-[#7a0000] transition text-sm disabled:opacity-70"
          >
            {submitting ? (
              <><Spinner className="w-4 h-4" /> Submitting…</>
            ) : (
              <>CONFIRM & SUBMIT <ChevronRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Step 6 — Confirmed
───────────────────────────────────────────── */
function StepConfirmed({
  data,
  confirmation,
}: {
  data: BookingFormData;
  confirmation: ConfirmationResult;
}) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <>
      {/* Print stylesheet */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .print-area { box-shadow: none !important; border: 1px solid #ddd !important; }
        }
      `}</style>

      <div className="w-full max-w-2xl mx-auto">
        {/* Success animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          className="text-center mb-6 no-print"
        >
          <div className="inline-flex w-20 h-20 rounded-full bg-green-100 items-center justify-center mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 250 }}
            >
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </motion.div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">BOOKING CONFIRMED</h2>
          <p className="text-gray-500 mt-2 text-sm">Your slot has been successfully booked with Ports Shipping LLC</p>
        </motion.div>

        {/* Confirmation card */}
        <div ref={printRef} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 print-area">

          {/* Print-only header */}
          <div className="hidden print:block mb-6 pb-4 border-b border-gray-200">
            <h1 className="text-2xl font-extrabold text-gray-900">Ports Shipping LLC</h1>
            <p className="text-sm text-gray-500">Booking Confirmation</p>
          </div>

          {/* Confirmation Number & Token Number Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 px-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-[#C9A84C]/40 mb-6 text-center">
            <div className="border-b sm:border-b-0 sm:border-r border-[#C9A84C]/30 pb-3 sm:pb-0 sm:pr-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Booking Confirmation No.</p>
              <p className="text-2xl sm:text-3xl font-black text-[#8B0000] tracking-wider">{confirmation.confirmationNumber}</p>
            </div>
            <div className="pt-2 sm:pt-0 sm:pl-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Booking Token / Ref</p>
              <p className="text-xl sm:text-2xl font-black text-[#C9A84C] font-mono tracking-wider">{data.verifiedToken || '—'}</p>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="col-span-2 sm:col-span-1">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Voyage Reference</p>
              <p className="font-bold text-gray-800 mt-0.5">{data.voyageRef}</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Rotation Number</p>
              <p className="font-bold text-gray-800 mt-0.5">{data.rotationNumber}</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Booking Party (Client)</p>
              <p className="font-bold text-gray-800 mt-0.5">{data.bookingParty}</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Booking Token</p>
              <p className="font-bold text-[#C9A84C] font-mono mt-0.5">{data.verifiedToken}</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Client Email</p>
              <p className="font-bold text-gray-800 mt-0.5">{data.bookingPartyEmail}</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Containers</p>
              <p className="font-bold text-gray-800 mt-0.5">{data.containers.length} container{data.containers.length !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {/* Container summary table */}
          <div className="mb-6 overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-2 border border-gray-200 font-semibold text-gray-600">#</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold text-gray-600">Container No.</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold text-gray-600">ISO</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold text-gray-600">POL</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold text-gray-600">POD</th>
                </tr>
              </thead>
              <tbody>
                {data.containers.map((c, i) => (
                  <tr key={i} className={i % 2 === 0 ? '' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200">{i + 1}</td>
                    <td className="p-2 border border-gray-200 font-mono">{c.containerNumber}</td>
                    <td className="p-2 border border-gray-200">{c.iso}</td>
                    <td className="p-2 border border-gray-200">{c.pol}</td>
                    <td className="p-2 border border-gray-200">{c.pod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer message */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800 mb-2">
            <p>
              Your booking has been successfully submitted to Ports Shipping LLC.
              A confirmation has been sent to <strong>{data.bookingPartyEmail}</strong>.
            </p>
          </div>
          <p className="text-xs text-gray-400 text-right">
            Submitted: {new Date(confirmation.submittedAt).toLocaleString()}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6 no-print">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
          >
            <Printer className="w-5 h-5" /> PRINT CONFIRMATION
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-[#C9A84C] text-white rounded-xl font-bold hover:bg-[#b8942e] transition"
          >
            <Download className="w-5 h-5" /> DOWNLOAD PDF
          </button>
        </div>

        <div className="text-center mt-4 no-print">
          <a href="/" className="text-sm text-[#8B0000] hover:underline font-medium">← Return to Home</a>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
const INITIAL_FORM: BookingFormData = {
  tokenId: '',
  verifiedToken: '',
  voyageReferenceId: '',
  voyageRef: '',
  rotationNumber: '',
  containers: [{ ...EMPTY_CONTAINER }],
  bookingParty: '',
  bookingPartyEmail: '',
};

export default function BookSlotPage() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const [form, setForm] = useState<BookingFormData>(INITIAL_FORM);
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);

  const updateField = useCallback((key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  }, []);

  const goNext = useCallback(() => {
    setDirection(1);
    setStep(s => s + 1);
  }, []);

  const goBack = useCallback(() => {
    setDirection(-1);
    setStep(s => s - 1);
  }, []);

  const handleTokenVerified = useCallback((tokenId: string, token: string) => {
    setForm(prev => ({ ...prev, tokenId, verifiedToken: token }));
    goNext();
  }, [goNext]);

  const handleSubmit = useCallback(async () => {
    const payload = {
      tokenId: form.tokenId,
      voyageReferenceId: form.voyageReferenceId,
      rotationNumber: form.rotationNumber,
      bookingParty: form.bookingParty,
      bookingPartyEmail: form.bookingPartyEmail,
      containers: form.containers,
    };

    const res = await fetch('/api/booking/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Submission failed (${res.status}). Please try again.`);
    }

    const data = await res.json();
    setConfirmation({
      confirmationNumber: data.confirmationNumber,
      bookingId: data.bookingId,
      submittedAt: data.submittedAt || new Date().toISOString(),
    });
    setDirection(1);
    setStep(5);
  }, [form]);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero header */}
      <div className="bg-gradient-to-r from-[#8B0000] via-[#6b0000] to-[#4a0000] text-white py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <CalendarCheck className="w-8 h-8 text-[#C9A84C]" />
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Book a Slot</h1>
          </div>
          <p className="text-red-200 text-sm sm:text-base">
            Ports Shipping LLC — Secure your container slot in minutes
          </p>
        </div>
      </div>

      {/* Step indicator */}
      {step < 6 && (
        <div className="bg-white border-b border-gray-100 shadow-sm py-4 px-4">
          <div className="max-w-4xl mx-auto">
            <StepIndicator current={step} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: 'easeInOut' }}
          >
            {step === 0 && (
              <StepVerifyToken onVerified={handleTokenVerified} />
            )}
            {step === 1 && (
              <StepVoyageInfo
                data={{
                  voyageReferenceId: form.voyageReferenceId,
                  voyageRef: form.voyageRef,
                  rotationNumber: form.rotationNumber,
                }}
                onChange={updateField}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {step === 2 && (
              <StepContainerDetails
                containers={form.containers}
                onContainersChange={c => setForm(prev => ({ ...prev, containers: c }))}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {step === 3 && (
              <StepBookingParty
                data={{ bookingParty: form.bookingParty, bookingPartyEmail: form.bookingPartyEmail }}
                onChange={updateField}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {step === 4 && (
              <StepReview
                data={form}
                onBack={goBack}
                onSubmit={handleSubmit}
              />
            )}
            {step === 5 && confirmation && (
              <StepConfirmed data={form} confirmation={confirmation} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
