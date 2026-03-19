-- ─── CodingSharks Database Schema ────────────────────────────────────────────
-- Run this SQL in your Supabase SQL Editor
-- Go to: Supabase Dashboard → SQL Editor → New Query → paste and run

-- ─── Admin Users ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name   TEXT NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,             -- bcryptjs hash (12 rounds)
  role        TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- ─── Blog ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title               TEXT NOT NULL,
  slug                TEXT UNIQUE NOT NULL,
  excerpt             TEXT,
  description         TEXT,              -- HTML content from TipTap editor
  img_original_name   TEXT,
  base_url            TEXT,              -- Cloudinary secure_url
  img_name            TEXT,              -- Cloudinary public_id (for transforms)
  img_type            TEXT,
  read_time           INTEGER,           -- Estimated read time in minutes
  is_active           BOOLEAN NOT NULL DEFAULT true,
  is_deleted          BOOLEAN NOT NULL DEFAULT false,
  created_at          TIMESTAMPTZ DEFAULT now(),
  created_by          UUID REFERENCES admin_users(id),
  updated_at          TIMESTAMPTZ DEFAULT now(),
  updated_by          UUID REFERENCES admin_users(id)
);

-- ─── Blog Tags ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_tag (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id     UUID NOT NULL REFERENCES blog(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  is_deleted  BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now(),
  created_by  UUID REFERENCES admin_users(id),
  updated_at  TIMESTAMPTZ DEFAULT now(),
  updated_by  UUID REFERENCES admin_users(id)
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog(slug);
CREATE INDEX IF NOT EXISTS idx_blog_is_active ON blog(is_active, is_deleted);
CREATE INDEX IF NOT EXISTS idx_blog_tag_blog_id ON blog_tag(blog_id);

-- ─── Create first admin user ──────────────────────────────────────────────────
-- IMPORTANT: Replace the password hash below with a real bcryptjs hash.
-- To generate one, run this in Node.js:
--   const bcrypt = require('bcryptjs'); bcrypt.hash('yourPassword', 12).then(console.log)
--
-- INSERT INTO admin_users (full_name, email, password, role)
-- VALUES ('Admin Name', 'admin@codingsharks.com', '$2a$12$...hash...', 'super_admin');
