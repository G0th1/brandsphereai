/*
  # Add notification preferences to user preferences

  1. Changes
    - Add notification preferences to user_preferences table
    - Add default notification settings
*/

ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{
  "post_published": true,
  "engagement_updates": true,
  "ai_suggestions": true
}'::jsonb;