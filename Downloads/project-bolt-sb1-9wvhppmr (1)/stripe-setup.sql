-- STEG 1: Lägg till Stripe-kolumner i auth.users-tabellen
ALTER TABLE auth.users 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive';

-- STEG 2: Skapa en tabell för detaljerad prenumerationsinformation
CREATE TABLE IF NOT EXISTS public.stripe_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT NOT NULL,
  status TEXT NOT NULL,
  price_id TEXT,
  plan_name TEXT,
  amount INTEGER,
  currency TEXT,
  interval TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEG 3: Lägg till index för snabbare sökningar
CREATE INDEX IF NOT EXISTS idx_user_id ON public.stripe_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_customer_id ON public.stripe_subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_stripe_subscription_id ON public.stripe_subscriptions(stripe_subscription_id);

-- STEG 4: Lägg till en funktion för att uppdatera updated_at-tidsstämpeln
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- STEG 5: Lägg till en trigger på subscriptions-tabellen
DROP TRIGGER IF EXISTS update_stripe_subscriptions_updated_at ON public.stripe_subscriptions;
CREATE TRIGGER update_stripe_subscriptions_updated_at
BEFORE UPDATE ON public.stripe_subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- STEG 6: Lägg till Row Level Security (RLS)
ALTER TABLE public.stripe_subscriptions ENABLE ROW LEVEL SECURITY;

-- STEG 7: Skapa policy för att tillåta användare att se endast sina egna prenumerationer
CREATE POLICY "Users can view their own subscriptions"
ON public.stripe_subscriptions
FOR SELECT
USING (auth.uid() = user_id);

-- STEG 8: Skapa policy för att tillåta service role att hantera alla prenumerationer
CREATE POLICY "Service role can manage all subscriptions"
ON public.stripe_subscriptions
USING (auth.role() = 'service_role');

-- STEG 9: Skapa en funktion för att uppdatera användarens prenumerationsstatus
CREATE OR REPLACE FUNCTION update_user_subscription_status()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auth.users
  SET subscription_status = NEW.status
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- STEG 10: Skapa en trigger som uppdaterar användarens prenumerationsstatus
DROP TRIGGER IF EXISTS stripe_subscription_status_update ON public.stripe_subscriptions;
CREATE TRIGGER stripe_subscription_status_update
AFTER INSERT OR UPDATE OF status ON public.stripe_subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_user_subscription_status();

-- STEG 11: Exempel - Hämta alla användare med deras prenumerationsstatus (för admin)
-- SELECT au.id, au.email, au.subscription_status, ss.plan_name, ss.current_period_end
-- FROM auth.users au
-- LEFT JOIN public.stripe_subscriptions ss ON au.id = ss.user_id
-- WHERE ss.status = 'active' OR ss.status IS NULL; 