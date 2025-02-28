/*
  # MVP Core Features Schema

  1. New Tables
    - `content_suggestions_mvp`
      - Basic AI-generated content suggestions
      - Limited to essential fields
    - `scheduled_posts_mvp`
      - Simple post scheduling
      - Core platform support (Twitter, LinkedIn)
    
  2. Security
    - Enable RLS on all tables
    - Basic user-based policies
*/

-- Content Suggestions MVP Table
CREATE TABLE IF NOT EXISTS content_suggestions_mvp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  platform TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE content_suggestions_mvp ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own content suggestions"
  ON content_suggestions_mvp
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own content suggestions"
  ON content_suggestions_mvp
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Scheduled Posts MVP Table
CREATE TABLE IF NOT EXISTS scheduled_posts_mvp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('twitter', 'linkedin')),
  scheduled_for TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'published', 'failed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE scheduled_posts_mvp ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own scheduled posts"
  ON scheduled_posts_mvp
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own scheduled posts"
  ON scheduled_posts_mvp
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scheduled posts"
  ON scheduled_posts_mvp
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own scheduled posts"
  ON scheduled_posts_mvp
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);