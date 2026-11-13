-- Migration to add school_name to competition_participants
ALTER TABLE competition_participants ADD COLUMN IF NOT EXISTS school_name TEXT;

-- Update existing records to have a placeholder or null
-- UPDATE competition_participants SET school_name = 'Unknown' WHERE school_name IS NULL;
