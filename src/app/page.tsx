'use client';

import React, { useState } from 'react';
import Hero from '@/components/home/Hero';
import StatsSection from '@/components/home/StatsSection';
import ServicesGrid from '@/components/home/ServicesGrid';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import Testimonials from '@/components/home/Testimonials';
import TrackSection from '@/components/home/TrackSection';
import ServicesCTA from '@/components/home/ServicesCTA';

export default function Home() {
  // Navigation handlers placeholder
  const handleQuoteClick = () => {
    window.location.href = '/contact';
  };
  
  const handleTrackClick = () => {
    const el = document.getElementById('tracking');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/track';
    }
  };

  return (
    <main>
      <Hero onQuoteClick={handleQuoteClick} onTrackClick={handleTrackClick} />
      <StatsSection />
      <ServicesGrid />
      <WhyChooseUs />
      <TrackSection />
      <Testimonials />
      <ServicesCTA />
      
      {/* JSON-LD Schema for LocalBusiness */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LogisticsService",
            "name": "Ports Shipping LLC",
            "image": "https://ports-shipping.com/logo.png",
            "@id": "https://ports-shipping.com",
            "url": "https://ports-shipping.com",
            "telephone": "+97143447867",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Office 204-1, Zabeel Business Centre (Smark 9), Umm Hurair Road Behind GPO",
              "addressLocality": "Dubai",
              "postalCode": "47081",
              "addressCountry": "AE"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 25.2427,
              "longitude": 55.3056
            },
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday"
              ],
              "opens": "08:00",
              "closes": "18:00"
            }
          })
        }}
      />
    </main>
  );
}
