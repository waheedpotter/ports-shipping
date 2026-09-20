import { z } from 'zod';

export const quoteSchema = z.object({
  shipType: z.string().optional(),
  origin: z.string().optional(),
  dest: z.string().optional(),
  cargo: z.string().optional(),
  weight: z.string().optional(),
  volume: z.string().optional(),
  packages: z.string().optional(),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(10),
});

export const trackingSchema = z.object({
  query: z.string().min(6),
});

export const adminLoginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export const shipmentCreateSchema = z.object({
  blNumber: z.string().min(3),
  containerNumber: z.string().optional(),
  shipper: z.string().min(2),
  consignee: z.string().min(2),
  commodity: z.string().optional(),
  originPort: z.string().min(2),
  destinationPort: z.string().min(2),
  vesselName: z.string().optional(),
  voyageNumber: z.string().optional(),
  etd: z.string().optional(),
  eta: z.string().optional(),
  currentStatus: z.string().default('Booking Confirmed'),
  milestones: z.array(z.object({
    stage: z.string(),
    timestamp: z.string(),
    note: z.string().optional(),
    completed: z.boolean(),
  })).optional(),
  notes: z.string().optional(),
  weight: z.string().optional(),
  volume: z.string().optional(),
  packages: z.number().optional(),
});

export const seoMetaSchema = z.object({
  route: z.string(),
  title: z.string(),
  description: z.string(),
  keywords: z.string(),
});

export type QuoteFormData = z.infer<typeof quoteSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type TrackingData = z.infer<typeof trackingSchema>;
export type AdminLoginData = z.infer<typeof adminLoginSchema>;
export type ShipmentCreateData = z.infer<typeof shipmentCreateSchema>;
export type SeoMetaData = z.infer<typeof seoMetaSchema>;
