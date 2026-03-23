import { z } from 'zod';

export const createWorkshopSchema = z.object({
  slug: z.string().min(1, 'Slug is required').max(255).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers and hyphens only'),
  crm_workshop_name: z.string().min(1, 'CRM workshop name is required').max(255),
  title: z.string().min(1, 'Title is required').max(255),
  tagline: z.string().max(500).optional(),
  description: z.string().optional(),
  short_description: z.string().max(1000).optional(),
  event_date: z.string().optional(),
  event_time: z.string().max(100).optional(),
  duration: z.string().max(100).optional(),
  mode: z.enum(['online', 'offline']).default('online'),
  platform: z.string().max(100).optional(),
  instructor_name: z.string().max(255).optional(),
  instructor_bio: z.string().optional(),
  topics: z.array(z.string()).optional().default([]),
  price: z.string().max(100).default('Free'),
  is_free: z.boolean().optional().default(true),
  seats_available: z.number().int().positive().optional(),
  is_active: z.boolean().optional().default(true),
});

export const updateWorkshopSchema = createWorkshopSchema.partial();

export const workshopRegistrationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Invalid email'),
  phone: z.string().min(7).max(20),
});

export type CreateWorkshopInput = z.infer<typeof createWorkshopSchema>;
export type UpdateWorkshopInput = z.infer<typeof updateWorkshopSchema>;
export type WorkshopRegistrationInput = z.infer<typeof workshopRegistrationSchema>;
