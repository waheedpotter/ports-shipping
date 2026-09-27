'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, CheckCircle2, FileText, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface QuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SERVICE_OPTIONS = [
  'Ocean Freight (FCL / LCL)',
  'Flagship Feeder Operator / Container Liner',
  'Air Freight & Cargo Charter',
  'GCC Land Transport & Overland Trucking',
  'Customs Clearance & Port Handling',
  'Contract Warehousing & Temperature-Controlled Storage',
  'Container Freight Station (CFS)',
  'Multi-Modal Operations (Sea/Air/Land)',
  'Projects, OOG & Heavy Cargo',
  'Pharmaceuticals & Cold Chain Logistics',
  'Defense, Diplomatic & Humanitarian Aid',
  'Yacht & Marine Logistics',
  'Helicopter & Aircraft Shifting',
  'General Cargo / Other Services',
];

export default function QuoteModal({ open, onOpenChange }: QuoteModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    service: 'Ocean Freight (FCL / LCL)',
    origin: '',
    destination: '',
    fullName: '',
    email: '',
    phone: '',
    company: '',
    weight: '',
    volume: '',
    packages: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipType: formData.service,
          origin: formData.origin,
          dest: formData.destination,
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          weight: formData.weight,
          volume: formData.volume,
          packages: formData.packages,
          message: formData.message,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to submit quote request.');
      }

      setIsSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('An unexpected error occurred. Please call +971 4 344 7867.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setErrorMsg('');
    setFormData({
      service: 'Ocean Freight (FCL / LCL)',
      origin: '',
      destination: '',
      fullName: '',
      email: '',
      phone: '',
      company: '',
      weight: '',
      volume: '',
      packages: '',
      message: '',
    });
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-[101] w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
          
          <Dialog.Close className="absolute right-4 top-4 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <X className="h-5 w-5" />
          </Dialog.Close>

          {isSuccess ? (
            <div className="text-center py-10 space-y-6">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Quote Request Received!</h2>
              <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-gray-900">{formData.fullName}</strong>. Our logistics specialists for <span className="text-[#8B0000] font-semibold">{formData.service}</span> will review your details and send you a competitive quote within 24 hours.
              </p>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 max-w-sm mx-auto text-sm text-gray-600">
                For urgent inquiries, call our direct operations line at{' '}
                <a href="tel:+97143447867" className="text-[#8B0000] font-bold hover:underline">
                  +971 4 344 7867
                </a>
              </div>
              <Button onClick={handleReset} className="mt-6 bg-[#8B0000] hover:bg-[#6b0000] text-white px-8 py-3">
                Done
              </Button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-6 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-2 bg-[#8B0000]/10 rounded-lg text-[#8B0000]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <Dialog.Title className="text-2xl font-bold text-gray-900">Get Quote</Dialog.Title>
                </div>
                <Dialog.Description className="text-sm text-gray-500">
                  Select your desired service and provide your shipment details for an immediate customized freight rate.
                </Dialog.Description>
              </div>

              {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                  {errorMsg}
                </div>
              )}

              {/* Single Step Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 1. Services Dropdown */}
                <div>
                  <label htmlFor="service-select" className="block text-sm font-semibold text-gray-800 mb-1.5">
                    Select Service <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="service-select"
                      required
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 font-medium focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000] transition-colors text-sm"
                    >
                      {SERVICE_OPTIONS.map((svc) => (
                        <option key={svc} value={svc}>
                          {svc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 2. Route Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                      Origin Port / City
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Shanghai / Jebel Ali"
                      value={formData.origin}
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                      Destination Port / City
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dubai / Riyadh / London"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000]"
                    />
                  </div>
                </div>

                {/* 3. Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Your full name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                      Phone / WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="+971 50 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      placeholder="Company / Enterprise"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000]"
                    />
                  </div>
                </div>

                {/* 4. Cargo Metrics (Weight, Volume, Packages) */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-600 mb-1">
                      Weight (KG)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2,500"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-600 mb-1">
                      Volume (CBM)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 15.5"
                      value={formData.volume}
                      onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-600 mb-1">
                      Packages / Units
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 40 pallets"
                      value={formData.packages}
                      onChange={(e) => setFormData({ ...formData, packages: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000]"
                    />
                  </div>
                </div>

                {/* 5. Additional Message / Cargo Description */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                    Cargo Details & Requirements
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Commodity type, container size (20ft/40ft), dangerous goods, temperature control, or target transit dates..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000] resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => onOpenChange(false)}
                    className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-[#8B0000] hover:bg-[#6b0000] text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Get Quote</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
