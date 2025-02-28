/*
  # Add YouTube Settings

  1. New Tables
    - `youtube_settings`
      - User-specific YouTube settings and preferences
      - Stores upload schedule, default video settings, etc.

  2. Changes
    - Add YouTube-specific fields to user_preferences
    - Add YouTube platform auth settings

  3. Security
    - Enable RLS on new tables
    - Add policies for authenticated users
*/

-- YouTube Settings
CREATE TABLE IF NOT EXISTS youtube_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  default_privacy_status TEXT DEFAULT 'private' CHECK (default_privacy_status IN ('private', 'unlisted', 'public')),
  default_category_id TEXT,
  default_tags TEXT[],
  auto_publish BOOLEAN DEFAULT false,
  upload_schedule JSONB DEFAULT '{
    "monday": ["10:00", "15:00"],
    "wednesday": ["11:00", "16:00"],
    "friday": ["12:00", "17:00"]
  }'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE youtube_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own YouTube settings"
  ON youtube_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own YouTube settings"
  ON youtube_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own YouTube settings"
  ON youtube_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Add YouTube preferences to user_preferences
ALTER TABLE user_preferences
ADD COLUMN IF NOT EXISTS youtube_preferences JSONB DEFAULT '{
  "auto_schedule": true,
  "auto_tags": true,
  "thumbnail_generation": true,
  "engagement_notifications": true,
  "analytics_reports": "weekly"
}'::jsonb;