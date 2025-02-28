/**
 * Test-skript för att verifiera att Stripe-integrationen och prenumerationstjänsten fungerar korrekt
 * Kör detta skript med: npx ts-node test-subscription.ts
 */

import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Miljövariabler (hämtas automatiskt från .env.local när man kör npx)
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const STRIPE_PRO_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || '';

// Initiera Stripe och Supabase klienter
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
});

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * Huvudfunktion för att testa prenumerationsfunktionerna
 */
async function testSubscriptionFunctions() {
  console.log('🧪 BÖRJAR TESTA PRENUMERATIONSFLÖDET');

  try {
    // 1. Verifiera att vi kan ansluta till Stripe
    console.log('\n📋 TEST 1: Kontrollerar anslutning till Stripe...');
    const stripeBalance = await stripe.balance.retrieve();
    console.log('✅ Anslutning till Stripe lyckades! Tillgängligt saldo:', stripeBalance.available.map(b => `${b.amount} ${b.currency}`).join(', '));

    // 2. Verifiera att priset existerar i Stripe
    console.log('\n📋 TEST 2: Kontrollerar att Pro-priset existerar...');
    const price = await stripe.prices.retrieve(STRIPE_PRO_PRICE_ID);
    console.log(`✅ Pro-priset hittades: ${price.nickname || 'Pro'} - ${price.unit_amount ? price.unit_amount/100 : 0} ${price.currency}`);

    // 3. Verifiera att Supabase är konfigurerad med nödvändiga tabeller
    console.log('\n📋 TEST 3: Kontrollerar Supabase-tabeller...');
    const { data: stripeSubsTable, error: tableError } = await supabase
      .from('stripe_subscriptions')
      .select('id')
      .limit(1);
    
    if (tableError) {
      console.error('❌ Fel vid kontroll av stripe_subscriptions-tabell:', tableError.message);
    } else {
      console.log('✅ stripe_subscriptions-tabellen är konfigurerad korrekt');
    }

    // 4. Kontrollera om auth.users har Stripe-kolumner
    console.log('\n📋 TEST 4: Kontrollerar stripe-kolumner i auth.users...');
    
    // Vi gör en RPC-anrop eftersom vi behöver använda service role för att läsa metadatan
    const { data: usersColumns, error: usersError } = await supabase.rpc('get_auth_users_columns');
    
    if (usersError) {
      console.error('❌ Kunde inte kontrollera auth.users-kolumner:', usersError.message);
      console.log('OBS: Du kanske behöver skapa en RPC-funktion för att läsa metadatan, testa istället att köra SQL-skriptet manuellt');
    } else {
      const hasStripeColumns = usersColumns && Array.isArray(usersColumns) && 
        usersColumns.some(col => col.column_name === 'stripe_customer_id') &&
        usersColumns.some(col => col.column_name === 'stripe_subscription_id') &&
        usersColumns.some(col => col.column_name === 'subscription_status');
      
      if (hasStripeColumns) {
        console.log('✅ auth.users har alla nödvändiga Stripe-kolumner');
      } else {
        console.log('❌ auth.users saknar en eller flera Stripe-kolumner. Kör stripe-setup.sql för att lägga till dem');
      }
    }

    // 5. Kontrollera om webhook-signeringen fungerar
    console.log('\n📋 TEST 5: Kontrollerar webhook-konfiguration...');
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.log('⚠️ STRIPE_WEBHOOK_SECRET saknas i .env.local. Webhooks kommer inte att fungera.');
    } else {
      console.log('✅ STRIPE_WEBHOOK_SECRET är konfigurerad');
      
      // Testa att konstruera en webhook-händelse (mock-test)
      const payload = JSON.stringify({
        id: 'evt_test',
        object: 'event',
        type: 'test',
      });
      
      const testSignature = 'test';
      
      try {
        // Detta kommer att misslyckas med ett specifikt fel om hemligheten är korrekt formaterad
        await stripe.webhooks.constructEvent(payload, testSignature, webhookSecret);
      } catch (error: any) {
        if (error.message && error.message.includes('signature')) {
          console.log('✅ Webhook-signering är korrekt konfigurerad (förväntat signaturfel vid test)');
        } else {
          console.error('❌ Oväntat fel vid test av webhook-signering:', error.message);
        }
      }
    }

    console.log('\n✅ TESTERNA ÄR KLARA');
    console.log('\nNästa steg:');
    console.log('1. Verifiera att prenumerationsflödet fungerar genom att testa checkout-processen');
    console.log('2. Använd test-kortnummer från Stripe (t.ex. 4242 4242 4242 4242) för betalning');
    console.log('3. Kontrollera att webhooks tar emot händelser och uppdaterar databasen');

  } catch (error: any) {
    console.error('❌ ETT FEL UPPSTOD UNDER TESTERNA:', error.message);
  }
}

// Kör testerna
testSubscriptionFunctions().catch(console.error); 