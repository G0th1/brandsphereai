/*
  # Add platform authentication and connection tracking

  1. New Tables
    - platform_auth_sessions
      - Stores OAuth state and PKCE codes for secure platform authentication
      - Temporary storage for auth flow
      - Auto-cleanup after 1 hour

  2. Functions
    - Create helper functions for platform auth flows
*/

-- Platform Authentication Sessions
CREATE TABLE IF NOT EXISTS platform_auth_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('twitter', 'linkedin')),
  state TEXT NOT NULL,
  code_verifier TEXT,
  code_challenge TEXT,
  redirect_uri TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '1 hour')
);

-- Auto-cleanup expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_auth_sessions()
RETURNS trigger AS $$
BEGIN
  DELETE FROM platform_auth_sessions WHERE expires_at < now();
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cleanup_expired_auth_sessions_trigger
  AFTER INSERT ON platform_auth_sessions
  EXECUTE FUNCTION cleanup_expired_auth_sessions();