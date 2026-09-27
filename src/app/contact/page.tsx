'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, ExternalLink } from 'lucide-react';

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
                <a
                  href="https://maps.app.goo.gl/igcxDqehLmwbPnPM9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8B0000] hover:text-[#C9A84C] mt-2 transition-colors"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink size={12} />
                </a>
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
              <h4 className="font-bold text-gray-900 text-lg mb-2">Headquarters & Global Reach</h4>
              <p className="text-gray-600 leading-relaxed font-medium">Based in Dubai, UAE, serving clients across the GCC and worldwide through our established global network.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Google Map Section */}
      <section className="pb-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-6 md:p-8 bg-gray-50 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#8B0000] uppercase tracking-wider">Office Location</span>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">Visit Ports Shipping LLC</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Office 204-1, Zabeel Business Centre (Smark 9), Umm Hurair Road Behind GPO, Al Karama, Dubai, UAE
                </p>
              </div>
              <a
                href="https://maps.app.goo.gl/igcxDqehLmwbPnPM9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#8B0000] text-white font-semibold rounded-lg hover:bg-[#6b0000] transition-colors shadow-md text-sm shrink-0"
              >
                <MapPin className="w-4 h-4 text-[#C9A84C]" />
                <span>Get Directions on Google Maps</span>
                <ExternalLink size={14} />
              </a>
            </div>
            <div className="relative w-full h-[450px]">
              <iframe
                title="Ports Shipping LLC Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.6293911571497!2d55.30711367538356!3d25.243764377682025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43509d7b0e57%3A0xac6384391589318b!2sPorts%20Shipping%20LLC!5e0!3m2!1sen!2sae!4v1711234567890!5m2!1sen!2sae"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
