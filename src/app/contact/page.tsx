'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setTimeout(() => setStatus('success'), 1500);
  };

  return (
    <main className="pb-24">
      <section className="pt-32 pb-20 bg-[#8B0000] text-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">Get In Touch</h1>
          <p className="text-xl text-gray-200">Our logistics experts are ready to assist you 24/7.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6 max-w-7xl grid lg:grid-cols-2 gap-16">
          {/* Form */}
          <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Send a Message</h2>
            {status === 'success' ? (
              <div className="p-6 bg-green-50 text-green-800 rounded-lg border border-green-200">
                <h3 className="font-bold text-lg mb-2">Message Sent!</h3>
                <p>Thank you for reaching out. Our team will contact you shortly.</p>
                <button onClick={() => setStatus('idle')} className="mt-4 text-green-700 underline font-medium">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input type="text" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-none" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input type="tel" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input type="text" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea rows={5} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-none"></textarea>
                </div>
                <button type="submit" disabled={status === 'submitting'} className="w-full py-4 bg-[#8B0000] text-white font-bold rounded-lg hover:bg-[#6b0000] transition-colors flex justify-center items-center gap-2">
                  {status === 'submitting' ? 'Sending...' : <><Send size={20} /> Send Message</>}
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Contact Information</h2>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[#8B0000]/10 rounded-full flex items-center justify-center flex-shrink-0 text-[#8B0000]"><MapPin /></div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">Dubai Headquarters</h4>
                <p className="text-gray-600 mt-1">Office 204-1, Zabeel Business Centre (Smark 9),<br/>Umm Hurair Road Behind GPO, PO Box 47081<br/>Al Karama, Dubai, UAE</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[#8B0000]/10 rounded-full flex items-center justify-center flex-shrink-0 text-[#8B0000]"><Phone /></div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">Phone</h4>
                <p className="text-gray-600 mt-1">+971 4 344 7867</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[#8B0000]/10 rounded-full flex items-center justify-center flex-shrink-0 text-[#8B0000]"><Mail /></div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">Email</h4>
                <p className="text-gray-600 mt-1">info@ports-shipping.com<br/>dubaiports@ports-shipping.com</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[#8B0000]/10 rounded-full flex items-center justify-center flex-shrink-0 text-[#8B0000]"><Clock /></div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">Working Hours</h4>
                <p className="text-gray-600 mt-1">Mon - Fri: 8:00 AM - 6:00 PM<br/>Sat: 8:00 AM - 2:00 PM</p>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-200">
              <h4 className="font-bold text-gray-900 text-lg mb-4">Global Offices</h4>
              <p className="text-gray-600 leading-relaxed font-medium">UAE • Oman • Kuwait • India • Kenya • Somalia • Singapore • UK</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
