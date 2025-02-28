/*
  # Add YouTube Integration Support

  1. Changes
    - Update platform_connections table to support YouTube
    - Add YouTube-specific metrics table
    - Add RLS policies for security

  2. Security
    - Enable RLS on new tables
    - Add policies for authenticated users
*/

-- Update platform enum in platform_connections
ALTER TABLE platform_connections
  DROP CONSTRAINT platform_connections_platform_check,
  ADD CONSTRAINT platform_connections_platform_check 
    CHECK (platform IN ('twitter', 'linkedin', 'youtube'));

-- YouTube Channel Metrics
CREATE TABLE IF NOT EXISTS youtube_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  channel_id TEXT NOT NULL,
  subscriber_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  video_count INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0,
  total_comments INTEGER DEFAULT 0,
  measured_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, channel_id, measured_at)
);

ALTER TABLE youtube_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own YouTube metrics"
  ON youtube_metrics
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own YouTube metrics"
  ON youtube_metrics
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- YouTube Video Performance
CREATE TABLE IF NOT EXISTS youtube_video_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  video_id TEXT NOT NULL,
  title TEXT NOT NULL,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ NOT NULL,
  measured_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, video_id, measured_at)
);

ALTER TABLE youtube_video_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own video metrics"
  ON youtube_video_metrics
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own video metrics"
  ON youtube_video_metrics
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS youtube_metrics_user_id_idx ON youtube_metrics(user_id);
CREATE INDEX IF NOT EXISTS youtube_metrics_measured_at_idx ON youtube_metrics(measured_at);
CREATE INDEX IF NOT EXISTS youtube_video_metrics_user_id_idx ON youtube_video_metrics(user_id);
CREATE INDEX IF NOT EXISTS youtube_video_metrics_published_at_idx ON youtube_video_metrics(published_at);