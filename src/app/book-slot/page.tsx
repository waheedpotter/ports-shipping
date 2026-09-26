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
  RotateCcw,
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
  { label: 'Booking Details', icon: Package },
  { label: 'Review & Confirmed', icon: CalendarCheck },
];

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function isValidEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

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
      <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1 mt-0.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
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
      className={`w-full px-3.5 py-2.5 text-sm rounded-lg border ${
        error ? 'border-red-400 bg-red-50 text-red-900' : 'border-gray-300 bg-white text-gray-900'
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
      className={`w-full px-3.5 py-2.5 text-sm rounded-lg border ${
        error ? 'border-red-400 bg-red-50 text-red-900' : 'border-gray-300 bg-white text-gray-900'
      } focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent transition`}
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
      <div className="flex items-center justify-center min-w-max mx-auto px-4">
        {STEPS.map((step, idx) => {
          const done = idx < current;
          const active = idx === current;
          const Icon = step.icon;
          return (
            <div key={step.label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    done
                      ? 'bg-green-600 border-green-600 text-white shadow'
                      : active
                        ? 'bg-[#8B0000] border-[#8B0000] text-white shadow-lg scale-110'
                        : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {done ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={`mt-1.5 text-xs font-semibold whitespace-nowrap ${
                    done ? 'text-green-700' : active ? 'text-[#8B0000]' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={`h-0.5 w-16 sm:w-28 mx-2 transition-all duration-500 ${
                    idx < current ? 'bg-green-500' : 'bg-gray-200'
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
          410: 'This booking token has expired (tokens are valid for 3 hours only). Please contact Ports Shipping.',
          409: 'This booking token has already been used.',
          429: 'Too many attempts. Please try again later.',
        };
        setError(msg[res.status] || data.message || 'Invalid booking token. Please check the reference number.');
        return;
      }
      setSuccess(`✓ Token ${t} verified successfully`);
      setTimeout(() => onVerified(data.tokenId, t), 700);
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
          <h2 className="text-xl font-bold text-gray-900">Enter Booking Token</h2>
          <p className="text-sm text-gray-500 mt-1 text-center">
            Enter the one-time reference token provided by Ports Shipping LLC
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
                className={`w-full px-4 py-3 text-base rounded-lg border font-mono tracking-widest ${
                  error ? 'border-red-400 bg-red-50' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition`}
              />
              <p className="mt-1.5 text-[11px] text-gray-400">
                Tokens are single-use and valid for 3 hours from issuance.
              </p>
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
              className="w-full py-3 bg-[#8B0000] text-white font-bold rounded-lg hover:bg-[#7a0000] transition flex items-center justify-center gap-2 disabled:opacity-70 shadow"
            >
              {loading ? <><Spinner /> Verifying…</> : 'VERIFY & CONTINUE'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Container Card
───────────────────────────────────────────── */
function ContainerCard({
  idx,
  container,
  ports,
  onChange,
  onRemove,
  canRemove,
}: {
  idx: number;
  container: Container;
  ports: Port[];
  onChange: (idx: number, key: keyof Container, val: string) => void;
  onRemove: (idx: number) => void;
  canRemove: boolean;
}) {
  const portOptions = ports.map(p => ({
    value: p.portCode,
    label: p.portName ? `${p.portCode} — ${p.portName}` : p.portCode,
  }));

  const upd = (k: keyof Container, v: string) => {
    onChange(idx, k, v);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6 mb-4">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#8B0000] text-white flex items-center justify-center text-xs font-bold">
            {idx + 1}
          </div>
          <h3 className="font-bold text-gray-800 text-sm">Container #{idx + 1}</h3>
        </div>
        <button
          type="button"
          onClick={() => onRemove(idx)}
          disabled={!canRemove}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition ${
            canRemove
              ? 'text-red-600 hover:bg-red-50 border border-red-200'
              : 'text-gray-300 border border-gray-200 cursor-not-allowed'
          }`}
        >
          <X className="w-3.5 h-3.5" /> Remove
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Field label="POL (Port of Loading)" required>
          <Select
            value={container.pol}
            onChange={v => upd('pol', v)}
            options={portOptions}
            placeholder="— Select POL —"
          />
        </Field>
        <Field label="POD (Port of Discharge)" required>
          <Select
            value={container.pod}
            onChange={v => upd('pod', v)}
            options={portOptions}
            placeholder="— Select POD —"
          />
        </Field>
        <Field label="Container Number" required>
          <Input
            value={container.containerNumber}
            onChange={v => upd('containerNumber', v.toUpperCase())}
            placeholder="e.g. ABCD1234567"
          />
        </Field>
        <Field label="ISO Type" required>
          <Select
            value={container.iso}
            onChange={v => upd('iso', v)}
            options={ISO_OPTIONS.map(o => ({ value: o, label: o }))}
            placeholder="— ISO Type —"
          />
        </Field>
        <Field label="Code Shipping Line">
          <Input value={container.line} onChange={v => upd('line', v)} placeholder="e.g. Ports Shipping" />
        </Field>
        <Field label="CHK (Check Digit)">
          <Input value={container.chk} onChange={v => upd('chk', v)} placeholder="e.g. 5" />
        </Field>
        <Field label="POD Agent Name">
          <Input value={container.podAgentName} onChange={v => upd('podAgentName', v)} placeholder="Agent name" />
        </Field>
        <Field label="Agent Email">
          <Input type="email" value={container.email} onChange={v => upd('email', v)} placeholder="agent@example.com" />
        </Field>
        <Field label="MOB No.">
          <Input value={container.mub} onChange={v => upd('mub', v)} placeholder="MOB No." />
        </Field>
        <Field label="IMCO Class">
          <Input value={container.imco} onChange={v => upd('imco', v)} placeholder="e.g. 3.1" />
        </Field>
        <Field label="UN Number">
          <Input value={container.unMo} onChange={v => upd('unMo', v)} placeholder="e.g. 1993" />
        </Field>
        <Field label="Temperature">
          <Input value={container.temperature} onChange={v => upd('temperature', v)} placeholder="e.g. -18°C" />
        </Field>
        <Field label="VGM Weight">
          <Input
            type="number"
            step="0.01"
            value={container.vgmWeight}
            onChange={v => upd('vgmWeight', v)}
            placeholder="0.00"
          />
        </Field>
        <Field label="UOM (Unit)">
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
   Step 2 — Unified Booking Details:
   Voyage Info + Containers + Booking Party (All in SAME Page)
───────────────────────────────────────────── */
function StepBookingDetails({
  form,
  onChange,
  onContainersChange,
  onNext,
  onBackToToken,
}: {
  form: BookingFormData;
  onChange: (k: string, v: string) => void;
  onContainersChange: (c: Container[]) => void;
  onNext: () => void;
  onBackToToken: () => void;
}) {
  const [voyageRefs, setVoyageRefs] = useState<VoyageRef[]>([]);
  const [loadingRefs, setLoadingRefs] = useState(true);
  const [rotationNumbers, setRotationNumbers] = useState<{ id: string; rotationNumber: string }[]>([]);
  const [loadingRotations, setLoadingRotations] = useState(true);
  const [ports, setPorts] = useState<Port[]>([]);
  const [loadingPorts, setLoadingPorts] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState('');

  useEffect(() => {
    fetch('/api/booking/voyage-refs', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => setVoyageRefs(Array.isArray(d) ? d : []))
      .catch(() => setVoyageRefs([]))
      .finally(() => setLoadingRefs(false));

    fetch('/api/booking/rotation-numbers', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => setRotationNumbers(Array.isArray(d) ? d : []))
      .catch(() => setRotationNumbers([]))
      .finally(() => setLoadingRotations(false));

    fetch('/api/booking/ports', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => setPorts(Array.isArray(d) ? d : []))
      .catch(() => setPorts([]))
      .finally(() => setLoadingPorts(false));
  }, []);

  const handleVoyageChange = (id: string) => {
    const ref = voyageRefs.find(v => v.id === id);
    onChange('voyageReferenceId', id);
    onChange('voyageRef', ref?.voyageRef || '');
    if (errors.voyageReferenceId) setErrors(prev => ({ ...prev, voyageReferenceId: '' }));
  };

  const updateContainer = (idx: number, key: keyof Container, val: string) => {
    const updated = form.containers.map((c, i) => i === idx ? { ...c, [key]: val } : c);
    onContainersChange(updated);
  };

  const addContainer = () => {
    onContainersChange([...form.containers, { ...EMPTY_CONTAINER }]);
  };

  const removeContainer = (idx: number) => {
    if (form.containers.length <= 1) return;
    onContainersChange(form.containers.filter((_, i) => i !== idx));
  };

  const validateAndProceed = () => {
    const e: Record<string, string> = {};
    setGlobalError('');

    // 1. Voyage Info Validation
    if (!form.voyageReferenceId) {
      e.voyageReferenceId = 'Please select a Voyage Reference.';
    }
    if (!form.rotationNumber || !form.rotationNumber.trim()) {
      e.rotationNumber = 'Please select a Rotation Number.';
    }

    // 2. Booking Party Validation
    if (!form.bookingParty.trim()) {
      e.bookingParty = 'Booking Party (Company / Individual Name) is required.';
    }
    if (!form.bookingPartyEmail.trim()) {
      e.bookingPartyEmail = 'Email address is required.';
    } else if (!isValidEmail(form.bookingPartyEmail)) {
      e.bookingPartyEmail = 'Please enter a valid email address.';
    }

    // 3. Containers Validation
    if (!form.containers || form.containers.length === 0) {
      setGlobalError('Please add at least one container.');
      setErrors(e);
      return;
    }

    for (let i = 0; i < form.containers.length; i++) {
      const c = form.containers[i];
      if (!c.pol) {
        setGlobalError(`Container #${i + 1}: POL (Port of Loading) is required.`);
        setErrors(e);
        return;
      }
      if (!c.pod) {
        setGlobalError(`Container #${i + 1}: POD (Port of Discharge) is required.`);
        setErrors(e);
        return;
      }
      if (!c.containerNumber.trim()) {
        setGlobalError(`Container #${i + 1}: Container Number is required.`);
        setErrors(e);
        return;
      }
      if (!c.iso) {
        setGlobalError(`Container #${i + 1}: ISO Type is required.`);
        setErrors(e);
        return;
      }
    }

    setErrors(e);
    if (Object.keys(e).length > 0) {
      setGlobalError('Please complete all required fields highlighted in red.');
      return;
    }

    onNext();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Verified Token Active Banner */}
      <div className="bg-amber-50 border border-[#C9A84C]/50 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
            ✓
          </div>
          <div>
            <span className="text-xs text-gray-500 uppercase font-semibold block">Active Verified Token</span>
            <span className="font-mono font-bold text-[#8B0000] text-base">{form.verifiedToken}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onBackToToken}
          className="text-xs text-[#8B0000] hover:underline font-semibold flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Change Token
        </button>
      </div>

      {/* ── SECTION 1: Voyage Information ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-7">
        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
          <div className="w-10 h-10 rounded-lg bg-[#8B0000]/10 flex items-center justify-center">
            <Ship className="w-5 h-5 text-[#8B0000]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">1. Voyage Information</h2>
            <p className="text-xs text-gray-500">Select the vessel voyage reference and enter the rotation number</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Voyage Reference" required error={errors.voyageReferenceId}>
            {loadingRefs ? (
              <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
                <Spinner className="w-4 h-4" /> Loading voyage references…
              </div>
            ) : (
              <Select
                value={form.voyageReferenceId}
                onChange={handleVoyageChange}
                options={voyageRefs.map(v => ({ value: v.id, label: v.voyageRef }))}
                placeholder="— Select voyage reference —"
                error={!!errors.voyageReferenceId}
              />
            )}
          </Field>

          <Field label="Rotation Number" required error={errors.rotationNumber}>
            {loadingRotations ? (
              <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
                <Spinner className="w-4 h-4" /> Loading rotation numbers…
              </div>
            ) : (
              <Select
                value={form.rotationNumber}
                onChange={v => {
                  onChange('rotationNumber', v);
                  if (errors.rotationNumber) setErrors(prev => ({ ...prev, rotationNumber: '' }));
                }}
                options={rotationNumbers.map(r => ({ value: r.rotationNumber, label: r.rotationNumber }))}
                placeholder="— Select rotation number —"
                error={!!errors.rotationNumber}
              />
            )}
          </Field>
        </div>
      </div>

      {/* ── SECTION 2: Booking Party Details ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-7">
        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
          <div className="w-10 h-10 rounded-lg bg-[#8B0000]/10 flex items-center justify-center">
            <User className="w-5 h-5 text-[#8B0000]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">2. Booking Party (Client Details)</h2>
            <p className="text-xs text-gray-500">The registered company or person booking the slot</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Booking Done Party (Company / Individual Name)" required error={errors.bookingParty}>
            <Input
              value={form.bookingParty}
              onChange={v => {
                onChange('bookingParty', v);
                if (errors.bookingParty) setErrors(prev => ({ ...prev, bookingParty: '' }));
              }}
              placeholder="e.g. Al Etihad Logistics LLC"
              error={!!errors.bookingParty}
            />
          </Field>

          <Field label="Email Address (For Booking Confirmation)" required error={errors.bookingPartyEmail}>
            <Input
              type="email"
              value={form.bookingPartyEmail}
              onChange={v => {
                onChange('bookingPartyEmail', v);
                if (errors.bookingPartyEmail) setErrors(prev => ({ ...prev, bookingPartyEmail: '' }));
              }}
              placeholder="operations@company.com"
              error={!!errors.bookingPartyEmail}
            />
          </Field>
        </div>
      </div>

      {/* ── SECTION 3: Container Details ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-7">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#8B0000]/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-[#8B0000]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Booking Details</h2>
              <p className="text-xs text-gray-500">
                {form.containers.length} container{form.containers.length !== 1 ? 's' : ''} added
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={addContainer}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-[#8B0000] border border-[#C9A84C]/50 rounded-lg text-xs font-bold transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> ADD ANOTHER CONTAINER
          </button>
        </div>

        {loadingPorts ? (
          <div className="flex items-center gap-3 py-10 justify-center text-gray-500">
            <Spinner /> Loading ports directory…
          </div>
        ) : (
          <div className="space-y-4">
            {form.containers.map((c, idx) => (
              <ContainerCard
                key={idx}
                idx={idx}
                container={c}
                ports={ports}
                onChange={updateContainer}
                onRemove={removeContainer}
                canRemove={form.containers.length > 1}
              />
            ))}

            <button
              type="button"
              onClick={addContainer}
              className="flex items-center gap-2 px-5 py-3 border-2 border-dashed border-[#C9A84C] text-[#8B0000] rounded-xl font-bold hover:bg-amber-50/50 transition text-sm w-full justify-center"
            >
              <Plus className="w-4 h-4" /> ADD ANOTHER CONTAINER
            </button>
          </div>
        )}
      </div>

      {/* Global Validation Alert */}
      {globalError && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{globalError}</span>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBackToToken}
          className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition text-sm"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Token
        </button>

        <button
          type="button"
          onClick={validateAndProceed}
          className="flex items-center gap-2 px-7 py-3 bg-[#8B0000] text-white rounded-xl font-bold hover:bg-[#7a0000] transition text-sm shadow-md"
        >
          CONTINUE TO REVIEW <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Step 3 — Unified Review & Confirmed (SAME PAGE)
───────────────────────────────────────────── */
function StepReviewAndConfirmed({
  data,
  confirmation,
  onBack,
  onSubmit,
  onReset,
}: {
  data: BookingFormData;
  confirmation: ConfirmationResult | null;
  onBack: () => void;
  onSubmit: () => Promise<void>;
  onReset: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

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

  const handlePrint = () => {
    window.print();
  };

  const isConfirmed = !!confirmation;

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

      <div className="w-full max-w-3xl mx-auto space-y-6">
        {/* If Confirmed: Show Top Celebration Banner */}
        {isConfirmed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="text-center mb-4 no-print"
          >
            <div className="inline-flex w-20 h-20 rounded-full bg-green-100 items-center justify-center mb-3">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">BOOKING CONFIRMED</h2>
            <p className="text-gray-500 mt-1 text-sm">
              Your container slot has been successfully registered with Ports Shipping LLC
            </p>
          </motion.div>
        )}

        {/* Unified Card (Review & Confirmed) */}
        <div ref={printRef} className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 sm:p-8 print-area">
          {/* Print Header */}
          <div className="hidden print:block mb-6 pb-4 border-b border-gray-200">
            <h1 className="text-2xl font-extrabold text-gray-900">Ports Shipping LLC</h1>
            <p className="text-sm text-gray-500">Official Booking Slot Confirmation</p>
          </div>

          {/* Golden Confirmation Banner (when Confirmed) */}
          {isConfirmed ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 px-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-[#C9A84C]/50 mb-6 text-center">
              <div className="border-b sm:border-b-0 sm:border-r border-[#C9A84C]/30 pb-3 sm:pb-0 sm:pr-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                  Booking Confirmation No.
                </p>
                <p className="text-2xl sm:text-3xl font-black text-[#8B0000] tracking-wider">
                  {confirmation.confirmationNumber}
                </p>
              </div>
              <div className="pt-2 sm:pt-0 sm:pl-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                  Booking Token Reference
                </p>
                <p className="text-xl sm:text-2xl font-black text-[#C9A84C] font-mono tracking-wider">
                  {data.verifiedToken || '—'}
                </p>
              </div>
            </div>
          ) : (
            /* Review Header */
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-[#8B0000]/10 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-[#8B0000]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Review Booking Details</h2>
                <p className="text-xs text-gray-500">
                  Please verify all information below before submitting your booking
                </p>
              </div>
            </div>
          )}

          {/* Token Banner */}
          {!isConfirmed && (
            <div className="bg-amber-50 border border-[#C9A84C]/50 rounded-lg p-3.5 flex items-center gap-3 mb-6">
              <CheckCircle2 className="w-5 h-5 text-[#8B0000] flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Booking Token</p>
                <p className="font-mono font-bold text-[#8B0000] text-sm">{data.verifiedToken}</p>
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Voyage Information</p>
              <div className="space-y-1.5 text-sm">
                <p><span className="text-gray-500 text-xs">Voyage Ref:</span> <strong className="text-gray-900">{data.voyageRef || '—'}</strong></p>
                <p><span className="text-gray-500 text-xs">Rotation No:</span> <strong className="text-gray-900">{data.rotationNumber || '—'}</strong></p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Booking Party (Client)</p>
              <div className="space-y-1.5 text-sm">
                <p><span className="text-gray-500 text-xs">Company/Name:</span> <strong className="text-gray-900">{data.bookingParty || '—'}</strong></p>
                <p><span className="text-gray-500 text-xs">Email:</span> <strong className="text-gray-900 break-all">{data.bookingPartyEmail || '—'}</strong></p>
              </div>
            </div>
          </div>

          {/* Containers Section */}
          <div className="rounded-xl border border-gray-200 overflow-hidden mb-6">
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Containers ({data.containers.length})
              </span>
              <span className="text-xs text-gray-500 font-medium">Click to inspect container specs</span>
            </div>

            <div className="divide-y divide-gray-100">
              {data.containers.map((c, i) => (
                <div key={i} className="text-sm">
                  <button
                    type="button"
                    onClick={() => setExpanded(expanded === i ? null : i)}
                    className="w-full flex items-center justify-between p-3.5 hover:bg-gray-50 transition text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#8B0000] text-white flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </span>
                      <span className="font-semibold text-gray-900 font-mono">
                        {c.containerNumber || 'Container ' + (i + 1)}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-gray-200 text-gray-700 font-medium">
                        {c.iso || '—'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {c.pol} → {c.pod}
                      </span>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 text-gray-400 transition-transform ${expanded === i ? 'rotate-90' : ''}`}
                    />
                  </button>

                  {(expanded === i || isConfirmed) && (
                    <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div><span className="text-gray-400">POL: </span><span className="font-medium text-gray-800">{c.pol}</span></div>
                      <div><span className="text-gray-400">POD: </span><span className="font-medium text-gray-800">{c.pod}</span></div>
                      <div><span className="text-gray-400">Code Shipping Line: </span><span className="font-medium text-gray-800">{c.line || '—'}</span></div>
                      <div><span className="text-gray-400">CHK: </span><span className="font-medium text-gray-800">{c.chk || '—'}</span></div>
                      <div><span className="text-gray-400">POD Agent: </span><span className="font-medium text-gray-800">{c.podAgentName || '—'}</span></div>
                      <div><span className="text-gray-400">Agent Email: </span><span className="font-medium text-gray-800">{c.email || '—'}</span></div>
                      <div><span className="text-gray-400">MOB No.: </span><span className="font-medium text-gray-800">{c.mub || '—'}</span></div>
                      <div><span className="text-gray-400">IMCO: </span><span className="font-medium text-gray-800">{c.imco || '—'}</span></div>
                      <div><span className="text-gray-400">VGM WT: </span><span className="font-medium text-gray-800">{c.vgmWeight ? `${c.vgmWeight} ${c.uom}` : '—'}</span></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submission Error Banner */}
          {submitError && (
            <div className="flex items-center gap-2 p-3.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-5 font-medium">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Post-confirmation message */}
          {isConfirmed ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-900">
                <p>
                  A confirmation email with your booking confirmation number and token reference has been dispatched to{' '}
                  <strong>{data.bookingPartyEmail}</strong>.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2 no-print">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition text-sm"
                >
                  <Printer className="w-4 h-4" /> PRINT CONFIRMATION
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-[#C9A84C] text-white rounded-xl font-bold hover:bg-[#b8942e] transition text-sm shadow"
                >
                  <Download className="w-4 h-4" /> DOWNLOAD PDF
                </button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs no-print">
                <button
                  type="button"
                  onClick={onReset}
                  className="text-[#8B0000] hover:underline font-bold"
                >
                  + Book Another Slot
                </button>
                <a href="/" className="text-gray-500 hover:text-gray-800 font-medium">
                  ← Return to Home
                </a>
              </div>
            </div>
          ) : (
            /* Action Buttons before submission */
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={onBack}
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition text-sm disabled:opacity-60"
              >
                <ChevronLeft className="w-4 h-4" /> EDIT DETAILS
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-7 py-3 bg-[#8B0000] text-white rounded-xl font-bold hover:bg-[#7a0000] transition text-sm disabled:opacity-70 shadow-md"
              >
                {submitting ? (
                  <><Spinner className="w-4 h-4" /> SUBMITTING BOOKING…</>
                ) : (
                  <>CONFIRM &amp; SUBMIT BOOKING <ChevronRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   Main Booking Page Component
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
  const [step, setStep] = useState(0); // 0: Verify Token, 1: Booking Details (Voyage + Containers + Party), 2: Review & Confirmed
  const [direction, setDirection] = useState(1);
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

  const handleReset = useCallback(() => {
    setForm(INITIAL_FORM);
    setConfirmation(null);
    setDirection(-1);
    setStep(0);
  }, []);

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
      throw new Error(err.message || err.error || `Submission failed (${res.status}). Please try again.`);
    }

    const data = await res.json();
    setConfirmation({
      confirmationNumber: data.confirmationNumber,
      bookingId: data.bookingId,
      submittedAt: data.createdAt || new Date().toISOString(),
    });
  }, [form]);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -50 : 50, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Hero header */}
      <div className="bg-gradient-to-r from-[#8B0000] via-[#6b0000] to-[#4a0000] text-white py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-2.5">
            <CalendarCheck className="w-8 h-8 text-[#C9A84C]" />
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Book a Slot</h1>
          </div>
          <p className="text-red-200 text-sm sm:text-base">
            Ports Shipping LLC — Secure container slot management system
          </p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="bg-white border-b border-gray-100 shadow-sm py-4 px-4 mb-8">
        <div className="max-w-3xl mx-auto">
          <StepIndicator current={step} />
        </div>
      </div>

      {/* Main Form Content */}
      <div className="max-w-4xl mx-auto px-4">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {step === 0 && (
              <StepVerifyToken onVerified={handleTokenVerified} />
            )}

            {step === 1 && (
              <StepBookingDetails
                form={form}
                onChange={updateField}
                onContainersChange={c => setForm(prev => ({ ...prev, containers: c }))}
                onNext={goNext}
                onBackToToken={() => {
                  setDirection(-1);
                  setStep(0);
                }}
              />
            )}

            {step === 2 && (
              <StepReviewAndConfirmed
                data={form}
                confirmation={confirmation}
                onBack={goBack}
                onSubmit={handleSubmit}
                onReset={handleReset}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
