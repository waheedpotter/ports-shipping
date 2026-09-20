export interface MilestoneEntry {
  stage: string;
  timestamp: string;
  note?: string;
  completed: boolean;
}

export interface Shipment {
  id: string;
  blNumber: string;
  containerNumber?: string | null;
  shipper: string;
  consignee: string;
  commodity?: string | null;
  originPort: string;
  destinationPort: string;
  vesselName?: string | null;
  voyageNumber?: string | null;
  etd?: Date | null;
  eta?: Date | null;
  currentStatus: string;
  milestones: MilestoneEntry[];
  notes?: string | null;
  weight?: string | null;
  volume?: string | null;
  packages?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SeoMeta {
  id: string;
  route: string;
  title: string;
  description: string;
  keywords: string;
  canonical?: string | null;
  ogImage?: string | null;
  robots: string;
}

export interface Lead {
  id: string;
  type: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  origin?: string | null;
  dest?: string | null;
  cargo?: string | null;
  shipType?: string | null;
  weight?: string | null;
  message?: string | null;
  status: string;
  createdAt: Date;
}

export interface AdminSession {
  id: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface TrackingResult {
  shipment: Shipment;
}

export interface QuoteFormData {
  shipType?: string;
  origin?: string;
  dest?: string;
  cargo?: string;
  weight?: string;
  volume?: string;
  packages?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}

export interface ServicePage {
  slug: string;
  title: string;
  shortDescription: string;
  icon: string;
  category: string;
  heroTitle: string;
  content: string;
  features: string[];
  keywords: string[];
}

export interface NavItem {
  label: string;
  href: string;
  hasMega?: boolean;
  children?: NavItem[];
}

export interface MegaMenuSection {
  title: string;
  items: {
    label: string;
    href: string;
    description: string;
    icon: string;
  }[];
}
