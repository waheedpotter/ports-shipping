'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Ship, Plane, Truck, Warehouse, PackageOpen, Info, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface QuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuoteModal({ open, onOpenChange }: QuoteModalProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    shipmentType: '',
    origin: '',
    destination: '',
    commodity: '',
    weight: '',
    volume: '',
    fullName: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleNext = () => setStep(s => Math.min(4, s + 1));
  const handlePrev = () => setStep(s => Math.max(1, s - 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {['Type', 'Route', 'Cargo', 'Details'].map((label, i) => (
          <div key={label} className={`text-xs font-semibold ${step >= i + 1 ? 'text-crimson-800' : 'text-gray-400'}`}>
            {label}
          </div>
        ))}
      </div>
      <div className="h-2 w-full bg-gray-200 rounded-full flex">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            className={`h-full flex-1 first:rounded-l-full last:rounded-r-full ${
              step >= i ? 'bg-crimson-800' : 'bg-transparent'
            } transition-all duration-300 border-r border-white/20 last:border-0`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-[101] w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] bg-white rounded-xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
          
          <Dialog.Close className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </Dialog.Close>

          {isSuccess ? (
            <div className="text-center py-12 space-y-6">
              <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
              <h2 className="text-3xl font-bold text-gray-900">Quote Request Sent!</h2>
              <p className="text-gray-500 max-w-md mx-auto">
                Thank you for your interest. One of our logistics experts will review your details and contact you shortly.
              </p>
              <Button onClick={() => { setIsSuccess(false); setStep(1); onOpenChange(false); }} className="mt-8 bg-crimson-800">
                Done
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <Dialog.Title className="text-2xl font-bold text-gray-900 mb-2">Request a Quote</Dialog.Title>
                <Dialog.Description className="text-gray-500">
                  Fill in the details below and we'll get back to you with our best rates.
                </Dialog.Description>
              </div>

              {renderProgressBar()}

              <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
                {/* Step 1: Type */}
                {step === 1 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4">
                    {[
                      { id: 'fcl', label: 'Ocean FCL', icon: Ship },
                      { id: 'lcl', label: 'Ocean LCL', icon: PackageOpen },
                      { id: 'air', label: 'Air Freight', icon: Plane },
                      { id: 'land', label: 'Land Transport', icon: Truck },
                      { id: 'warehousing', label: 'Warehousing', icon: Warehouse },
                      { id: 'other', label: 'Other/Multimodal', icon: Info },
                    ].map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => { setFormData({...formData, shipmentType: id}); handleNext(); }}
                        className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all ${
                          formData.shipmentType === id ? 'border-crimson-800 bg-crimson-50 text-crimson-900' : 'border-gray-200 hover:border-gold-500 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-10 h-10 mb-3" />
                        <span className="font-medium text-sm text-center">{label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 2: Route */}
                {step === 2 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Origin City/Country *</label>
                      <Input required value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})} placeholder="e.g. Shanghai, China" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Destination City/Country *</label>
                      <Input required value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} placeholder="e.g. Dubai, UAE" />
                    </div>
                  </div>
                )}

                {/* Step 3: Cargo */}
                {step === 3 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Commodity Type *</label>
                      <Input required value={formData.commodity} onChange={e => setFormData({...formData, commodity: e.target.value})} placeholder="e.g. Electronics, Auto Parts" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Weight (KG)</label>
                        <Input type="number" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} placeholder="0.00" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Volume (CBM)</label>
                        <Input type="number" value={formData.volume} onChange={e => setFormData({...formData, volume: e.target.value})} placeholder="0.00" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Contact */}
                {step === 4 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                        <Input required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} placeholder="John Doe" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                        <Input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+1 234 567 890" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                      <Input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@company.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Additional Message</label>
                      <textarea 
                        className="w-full min-h-[100px] p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-crimson-800 resize-none text-sm"
                        placeholder="Any special instructions or requirements..."
                        value={formData.message}
                        onChange={e => setFormData({...formData, message: e.target.value})}
                      />
                    </div>
                  </div>
                )}

                <div className="mt-8 flex justify-between pt-4 border-t border-gray-100">
                  <Button type="button" variant="ghost" onClick={handlePrev} disabled={step === 1}>
                    Back
                  </Button>
                  {step < 4 ? (
                    <Button type="submit" className="bg-crimson-800 hover:bg-crimson-900">
                      Continue
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isSubmitting} className="bg-gold-500 hover:bg-gold-600 text-gray-900 font-bold min-w-[120px]">
                      {isSubmitting ? 'Sending...' : 'Submit Request'}
                    </Button>
                  )}
                </div>
              </form>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
