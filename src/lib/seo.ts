import { prisma } from './db';
import { SeoMeta } from '../types';

export const defaultSeoData: Record<string, Partial<SeoMeta>> = {
  '/': { title: 'Ports Shipping LLC', description: 'Global logistics partner' },
};

export async function getSeoMeta(route: string): Promise<SeoMeta> {
  const meta = await prisma.seoMeta.findUnique({ where: { route } });
  if (meta) return meta as SeoMeta;
  
  return {
    id: 'default',
    route,
    title: defaultSeoData[route]?.title || 'Ports Shipping LLC',
    description: defaultSeoData[route]?.description || 'Shipping and Logistics',
    keywords: 'shipping, logistics',
    canonical: null,
    ogImage: null,
    robots: 'index, follow'
  };
}

export function buildMetadata(seo: SeoMeta, overrides?: Partial<SeoMeta>) {
  return {
    title: overrides?.title || seo.title,
    description: overrides?.description || seo.description,
    keywords: overrides?.keywords || seo.keywords,
  };
}

export function generateJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "LogisticsService"],
    name: "Ports Shipping LLC",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Office 204-1, Zabeel Business Centre, Umm Hurair 1, Behind GPO",
      postOfficeBoxNumber: "47081",
      addressLocality: "Al Karama, Dubai",
      addressCountry: "UAE"
    },
    phone: "+971 4 344 7867",
    email: "info@ports-shipping.com",
    url: "https://ports-shipping.com",
    foundingDate: "2012",
    geo: {
      "@type": "GeoCoordinates",
      latitude: "25.2425",
      longitude: "55.3152"
    },
    areaServed: ["UAE", "Oman", "Kuwait", "India", "Kenya", "Somalia", "Singapore", "United Kingdom"]
  };
}
