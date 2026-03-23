// ─── Admin ────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  password: string;
  role: 'admin' | 'super_admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  description: string | null; // HTML from TipTap
  img_original_name: string | null;
  base_url: string | null;    // Cloudinary secure_url
  img_name: string | null;    // Cloudinary public_id
  img_type: string | null;
  read_time: number | null;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  created_by: string | null;
  updated_at: string;
  updated_by: string | null;
}

export interface BlogTag {
  id: string;
  blog_id: string;
  name: string;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  created_by: string | null;
  updated_at: string;
  updated_by: string | null;
}

export interface BlogWithTags extends Blog {
  tags?: BlogTag[];
}

// ─── Workshop ─────────────────────────────────────────────────────────────────

export interface Workshop {
  id: string;
  slug: string;
  crm_workshop_name: string;
  title: string;
  tagline: string | null;
  description: string | null; // HTML from TipTap
  short_description: string | null;
  event_date: string | null;
  event_time: string | null;
  duration: string | null;
  mode: string; // 'online' | 'offline'
  platform: string | null;
  instructor_name: string | null;
  instructor_bio: string | null;
  topics: string[]; // JSONB array
  price: string;
  is_free: boolean;
  seats_available: number | null;
  img_original_name: string | null;
  base_url: string | null;
  img_name: string | null;
  img_type: string | null;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface WorkshopRegistration {
  id: string;
  workshop_id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
}

export interface WorkshopWithRegistrations extends Workshop {
  registrations?: WorkshopRegistration[];
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiSuccess<T = unknown> {
  success: true;
  message: string;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
}
