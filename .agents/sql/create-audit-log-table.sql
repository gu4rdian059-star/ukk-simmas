-- ================================================================
-- Migration: Create admin_audit_logs table
-- Run this in Supabase SQL Editor
-- ================================================================

CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id     TEXT,                          -- profile ID admin yang melakukan aksi
  admin_email  TEXT,                          -- email admin (untuk display)
  action       TEXT        NOT NULL,          -- e.g. 'DELETE_USER', 'APPROVE_QUIZ'
  entity_type  TEXT        NOT NULL,          -- e.g. 'user', 'quiz', 'report', 'blog'
  entity_id    TEXT,                          -- ID entitas yang diubah
  entity_label TEXT,                          -- nama/judul entitas untuk display
  old_value    JSONB,                         -- snapshot sebelum perubahan
  new_value    JSONB,                         -- snapshot sesudah perubahan
  ip_address   TEXT,                          -- IP address (opsional)
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk sorting & filtering cepat
CREATE INDEX IF NOT EXISTS idx_audit_logs_created    ON admin_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_id   ON admin_audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action     ON admin_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity     ON admin_audit_logs(entity_type, entity_id);

-- Aktifkan RLS tapi izinkan service_role menulis (server actions pakai service role)
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Admin bisa baca semua log melalui dashboard (menggunakan service role key)
CREATE POLICY "service_role_all" ON admin_audit_logs
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ================================================================
-- Contoh aksi yang akan dicatat (action values):
--   DELETE_USER, UPDATE_USER, RESTORE_USER, PERMANENT_DELETE_USER
--   APPROVE_QUIZ, REJECT_QUIZ, RESTORE_QUIZ, PERMANENT_DELETE_QUIZ
--   UPDATE_REPORT, DELETE_REPORT
--   DELETE_BLOG, CREATE_BLOG, UPDATE_BLOG
--   RESTORE_GROUP, PERMANENT_DELETE_GROUP
--   START_COMPETITION_ROUND
-- ================================================================
