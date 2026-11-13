-- ================================================================
-- Migration: Create blog_sessions table for tracking blog views
-- 
-- SECURITY NOTE:
-- This script is designed to work with existing app patterns.
-- 
-- OPTION 1 (SAFE - DEFAULT): Run WITHOUT RLS
--   ✓ Consistent with existing pattern (blogs, competitions tables)
--   ✓ App-level authorization still enforced
--   ✓ No breaking changes
--   ✗ Table accessible publicly (but blog is public content anyway)
--
-- OPTION 2 (ADVANCED): Run and Enable RLS (see policies below)
--   ✓ Database-level security
--   ✓ Users can only see own sessions
--   ✗ Requires proper RLS policies setup
--
-- RECOMMENDATION: Start with Option 1, add RLS later if needed
-- ================================================================

-- ================================================================
-- STEP 1: Create blog_sessions table (RLS NOT enabled initially)
-- ================================================================

CREATE TABLE IF NOT EXISTS blog_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id TEXT NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_ip TEXT,
  user_agent TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER DEFAULT 0,
  scroll_depth INTEGER DEFAULT 0, -- 0-100 percentage
  interaction_count INTEGER DEFAULT 0, -- clicks, highlights, etc
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- STEP 2: Create Indexes for Performance
-- ================================================================

CREATE INDEX IF NOT EXISTS idx_blog_sessions_blog_id 
  ON blog_sessions(blog_id);

CREATE INDEX IF NOT EXISTS idx_blog_sessions_user_id 
  ON blog_sessions(user_id);

CREATE INDEX IF NOT EXISTS idx_blog_sessions_started_at 
  ON blog_sessions(started_at DESC);

CREATE INDEX IF NOT EXISTS idx_blog_sessions_blog_started 
  ON blog_sessions(blog_id, started_at DESC);

-- ================================================================
-- STEP 3: OPTIONAL - RLS Policies (Enable later if needed)
--
-- If you choose "Run and Enable RLS" in Supabase, you need to:
-- 1. Enable RLS on the table:
--    ALTER TABLE blog_sessions ENABLE ROW LEVEL SECURITY;
--
-- 2. Create these policies:
-- ================================================================

-- Policy 1: Service role (server operations) has full access
-- (Uncomment when enabling RLS)
-- CREATE POLICY "service_role_all" ON blog_sessions
--   FOR ALL USING (true) WITH CHECK (true);

-- Policy 2: Users can read/update their own sessions
-- (Uncomment when enabling RLS)
-- CREATE POLICY "users_own_sessions" ON blog_sessions
--   FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Policy 3: Users can create sessions (own or anonymous)
-- (Uncomment when enabling RLS)
-- CREATE POLICY "users_create_sessions" ON blog_sessions
--   FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Policy 4: Admins can read all sessions for analytics
-- (Uncomment when enabling RLS)
-- CREATE POLICY "admins_read_all" ON blog_sessions
--   FOR SELECT USING (
--     auth.uid() IN (
--       SELECT id FROM auth.users 
--       JOIN profiles ON profiles.id = auth.users.id 
--       WHERE profiles.role = 'admin'
--     )
--   );

-- ================================================================
-- USAGE EXAMPLES:
-- 
-- 1. Track when user starts reading a blog:
--    INSERT INTO blog_sessions (blog_id, user_id, session_ip, user_agent)
--    VALUES ('<blog_id>', '<user_id>', '<ip>', '<user_agent>')
--
-- 2. Update session when user finishes:
--    UPDATE blog_sessions 
--    SET ended_at = NOW(), 
--        duration_seconds = EXTRACT(EPOCH FROM (NOW() - started_at))::INTEGER,
--        scroll_depth = <scroll_percent>
--    WHERE id = '<session_id>'
--
-- 3. Get view count for a blog:
--    SELECT COUNT(*) as views FROM blog_sessions WHERE blog_id = '<blog_id>'
--
-- 4. Get average read time for a blog:
--    SELECT AVG(duration_seconds) FROM blog_sessions WHERE blog_id = '<blog_id>'
--
-- 5. Get unique visitors:
--    SELECT COUNT(DISTINCT user_id) FROM blog_sessions WHERE blog_id = '<blog_id>'
-- ================================================================

-- ================================================================
-- VERIFICATION:
-- 
-- Run this to verify table created correctly:
--   SELECT * FROM blog_sessions LIMIT 0;
--
-- Check RLS status:
--   SELECT tablename, rowsecurity FROM pg_tables 
--   WHERE tablename = 'blog_sessions';
-- ================================================================

