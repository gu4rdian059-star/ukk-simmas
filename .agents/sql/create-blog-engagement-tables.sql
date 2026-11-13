-- ================================================================
-- Migration: Create blog_likes and blog_views tables
-- ================================================================

-- 1. Create blog_likes table
CREATE TABLE IF NOT EXISTS blog_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id TEXT NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES blog_sessions(id) ON DELETE SET NULL,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Prevent same user from liking multiple times (if logged in)
  UNIQUE(blog_id, user_id)
);

-- 2. Create blog_views table (Simplified tracking)
-- Note: blog_sessions is more detailed, but blog_views is for quick counting
CREATE TABLE IF NOT EXISTS blog_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id TEXT NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id UUID REFERENCES blog_sessions(id) ON DELETE SET NULL,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_likes_blog_id ON blog_likes(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_views_blog_id ON blog_views(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_views_created_at ON blog_views(created_at DESC);

-- 4. RLS Policies
ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_views ENABLE ROW LEVEL SECURITY;

-- Policies for blog_likes
CREATE POLICY "Allow public to insert likes" ON blog_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all to read likes" ON blog_likes FOR SELECT USING (true);
CREATE POLICY "Allow users to delete their own likes" ON blog_likes FOR DELETE USING (auth.uid() = user_id);

-- Policies for blog_views
CREATE POLICY "Allow public to insert views" ON blog_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all to read views" ON blog_views FOR SELECT USING (true);
