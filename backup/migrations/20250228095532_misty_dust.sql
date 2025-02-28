/*
  # Platform Integration Tables

  1. New Tables
    - `platform_connections`
      - Stores social media platform connection details
      - Includes access tokens and platform-specific user IDs
      - Tracks connection status
    
    - `user_preferences`
      - Stores user personalization settings
      - Content preferences
      - Posting schedule preferences
      - UI preferences

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Platform Connections Table
CREATE TABLE IF NOT EXISTS platform_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('twitter', 'linkedin')),
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  platform_user_id TEXT NOT NULL,
  platform_username TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, platform)
);

ALTER TABLE platform_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own platform connections"
  ON platform_connections
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own platform connections"
  ON platform_connections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own platform connections"
  ON platform_connections
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- User Preferences Table
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users,
  content_types TEXT[] DEFAULT ARRAY['text', 'image', 'link'],
  preferred_platforms TEXT[] DEFAULT ARRAY['twitter', 'linkedin'],
  posting_schedule JSONB DEFAULT '{"monday": true, "tuesday": true, "wednesday": true, "thursday": true, "friday": true, "saturday": false, "sunday": false}',
  best_times JSONB DEFAULT '{"twitter": ["9:00", "12:00", "15:00"], "linkedin": ["10:00", "14:00", "16:00"]}',
  theme TEXT DEFAULT 'light',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own preferences"
  ON user_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);