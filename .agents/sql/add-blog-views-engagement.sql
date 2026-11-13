-- ================================================================
-- Migration: Add views & likes columns to blogs table
-- Run this in Supabase SQL Editor
-- ================================================================

-- 1. Add 'views' column to track how many times a blog was read
ALTER TABLE blogs
  ADD COLUMN IF NOT EXISTS views INTEGER NOT NULL DEFAULT 0;

-- 2. Add 'likes' column to track engagement (likes/reactions)
ALTER TABLE blogs
  ADD COLUMN IF NOT EXISTS likes INTEGER NOT NULL DEFAULT 0;

-- 3. (Optional) Index for sorting by most viewed
CREATE INDEX IF NOT EXISTS idx_blogs_views ON blogs(views DESC);

-- ================================================================
-- How views will be incremented (from user-facing app):
--   UPDATE blogs SET views = views + 1 WHERE id = '<blog_id>'
-- ================================================================
