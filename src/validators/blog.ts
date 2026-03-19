import { z } from 'zod';

export const createBlogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  slug: z.string().min(1, 'Slug is required').max(255).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers and hyphens only'),
  excerpt: z.string().max(500).optional(),
  description: z.string().optional(),
  read_time: z.number().int().positive().optional(),
  is_active: z.boolean().optional().default(true),
});

export const updateBlogSchema = createBlogSchema.partial();

export const createTagSchema = z.object({
  name: z.string().min(1, 'Tag name is required').max(100),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
export type CreateTagInput = z.infer<typeof createTagSchema>;
