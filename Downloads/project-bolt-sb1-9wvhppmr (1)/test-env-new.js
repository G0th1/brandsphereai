/**
 * Enkelt test för att läsa .env.local.new-filen
 */
require('dotenv').config({ path: '.env.local.new' });

console.log('🧪 TEST AV MILJÖVARIABLER FRÅN .env.local.new:');
console.log('------------------------------------------');

// Kontrollera Stripe-nycklar (visa bara första och sista 4 tecknen för säkerhet)
const maskKey = (key) => {
  if (!key) return 'SAKNAS';
  if (key.length < 10) return 'FELAKTIGT FORMAT';
  return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
};

console.log('STRIPE_SECRET_KEY:', maskKey(process.env.STRIPE_SECRET_KEY));
console.log('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:', maskKey(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY));
console.log('NEXT_PUBLIC_STRIPE_PRO_PRICE_ID:', process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'SAKNAS');
console.log('STRIPE_WEBHOOK_SECRET:', maskKey(process.env.STRIPE_WEBHOOK_SECRET));

// Kontrollera Supabase-nycklar
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL || 'SAKNAS');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', maskKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));
console.log('SUPABASE_SERVICE_ROLE_KEY:', maskKey(process.env.SUPABASE_SERVICE_ROLE_KEY));

console.log('\n🧪 TEST RESULTAT:');
console.log('------------------------------------------');

// Kontrollera Stripe-konfiguration
const stripeConfigOK = 
  process.env.STRIPE_SECRET_KEY && 
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && 
  process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID && 
  process.env.STRIPE_WEBHOOK_SECRET;

console.log('Stripe-konfiguration:', stripeConfigOK ? '✅ OK' : '❌ SAKNAS NYCKLAR');

// Kontrollera Supabase-konfiguration
const supabaseConfigOK = 
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && 
  process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Supabase-konfiguration:', supabaseConfigOK ? '✅ OK' : '❌ SAKNAS NYCKLAR'); 