import type { Metadata, Viewport } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css';
import TopBar from '@/components/layout/TopBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#8B0000',
};

export const metadata: Metadata = {
  title: {
    default: 'Ports Shipping LLC | Global Freight Forwarding & Logistics Dubai',
    template: '%s | Ports Shipping LLC',
  },
  description: 'Award-winning UAE freight forwarding & end-to-end logistics company since 2012. Ocean, Air, Land & Specialized Cargo. ISO 9001 Certified. +971 4 344 7867.',
  keywords: ['logistics Dubai', 'freight forwarding UAE', 'ocean freight Dubai', 'air freight UAE', 'shipping company Dubai', 'Ports Shipping LLC'],
  authors: [{ name: 'Ports Shipping LLC' }],
  creator: 'Ports Shipping LLC',
  publisher: 'Ports Shipping LLC',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ports-shipping.com'),
  openGraph: {
    type: 'website',
    locale: 'en_AE',
    url: 'https://ports-shipping.com',
    siteName: 'Ports Shipping LLC',
    title: 'Ports Shipping LLC | Global Freight Forwarding & Logistics Dubai',
    description: 'Award-winning UAE freight forwarding & end-to-end logistics since 2012. Ocean, Air, Land & Specialized Cargo.',
    images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'Ports Shipping LLC' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ports Shipping LLC | Global Logistics Dubai',
    description: 'Award-winning UAE freight forwarding since 2012.',
    images: ['/logo.png'],
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://ports-shipping.com/#organization',
        name: 'Ports Shipping LLC',
        url: 'https://ports-shipping.com',
        logo: { '@type': 'ImageObject', url: 'https://ports-shipping.com/logo.png' },
        foundingDate: '2012',
        telephone: '+971-4-344-7867',
        email: 'info@ports-shipping.com',
        sameAs: [
          'https://www.linkedin.com/company/ports-shipping',
          'https://www.facebook.com/portsshipping',
        ],
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Office 204-1, Zabeel Business Centre (Smark 9), Umm Hurair Road Behind GPO',
          addressLocality: 'Al Karama, Dubai',
          postalCode: '47081',
          addressCountry: 'AE',
        },
        geo: { '@type': 'GeoCoordinates', latitude: 25.2427, longitude: 55.3056 },
        areaServed: ['UAE', 'Oman', 'Kuwait', 'India', 'Kenya', 'Somalia', 'Singapore', 'United Kingdom'],
        hasCredential: ['ISO 9001 Certified', 'GCAA Approved DG Agent', 'IATA Partner'],
      },
      {
        '@type': 'LocalBusiness',
        '@id': 'https://ports-shipping.com/#localbusiness',
        name: 'Ports Shipping LLC',
        image: 'https://ports-shipping.com/logo.png',
        telephone: '+971-4-344-7867',
        priceRange: '$$',
        openingHours: ['Mo-Fr 08:00-18:00', 'Sa 08:00-14:00'],
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Office 204-1, Zabeel Business Centre',
          addressLocality: 'Dubai',
          postalCode: '47081',
          addressCountry: 'AE',
        },
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${montserrat.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
        <TopBar />
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

