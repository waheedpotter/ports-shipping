'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Search, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface TrackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TrackModal({ open, onOpenChange }: TrackModalProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onOpenChange(false);
      router.push(`/track?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-[101] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg">
          <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
            <Dialog.Title className="text-xl font-bold leading-none tracking-tight flex items-center text-crimson-900">
              <Package className="w-6 h-6 mr-2 text-gold-500" />
              Track Your Shipment
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-500">
              Enter your BL Number, Booking Reference, or Container Number below to get real-time status.
            </Dialog.Description>
          </div>
          
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="e.g. PORT123456789"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 py-6 text-lg border-gray-300 focus-visible:ring-crimson-800"
                autoFocus
              />
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!query.trim()} className="bg-crimson-800 hover:bg-crimson-900 text-white px-8">
                Track Now
              </Button>
            </div>
          </form>

          <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-crimson-800 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 data-[state=open]:text-gray-500">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
