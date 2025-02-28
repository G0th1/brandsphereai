/*
  # Create content suggestions table

  1. New Tables
    - `content_suggestions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles.id)
      - `title` (text)
      - `description` (text)
      - `type` (text)
      - `platform` (text)
      - `engagement` (text)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
  2. Security
    - Enable RLS on `content_suggestions` table
    - Add policy for authenticated users to read their own content suggestions
*/

CREATE TABLE IF NOT EXISTS content_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT,
  platform TEXT,
  engagement TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE content_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own content suggestions"
  ON content_suggestions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);