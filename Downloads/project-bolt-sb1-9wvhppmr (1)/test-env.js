/**
 * Enkelt test för att läsa .env.local-filen
 */
const fs = require('fs');
const path = require('path');

// Sökväg till .env.local
const envPath = path.resolve(process.cwd(), '.env.local');

console.log('Söker efter .env.local på:', envPath);

try {
  // Kontrollera om filen finns
  if (fs.existsSync(envPath)) {
    console.log('.env.local hittades!');
    
    // Läs filinnehållet
    const fileContent = fs.readFileSync(envPath, 'utf8');
    
    // Visa maskerat innehåll av säkerhetsskäl
    const lines = fileContent.split('\n');
    const maskedLines = lines.map(line => {
      // Hoppa över tomma rader och kommentarer
      if (!line.trim() || line.trim().startsWith('#')) {
        return line;
      }
      
      // Dela upp på '=' och maskera värdet om det finns
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        
        // Maskera värden för säkerhet
        if (value.length > 10) {
          return `${key}=${value.substring(0, 4)}...${value.substring(value.length - 4)}`;
        } else if (value.length > 0) {
          return `${key}=***`;
        }
      }
      
      return line;
    });
    
    console.log('\nInnehåll i .env.local (maskerat):');
    console.log('-----------------------------------');
    console.log(maskedLines.join('\n'));
    
    // Bekräfta nyckelvariabler
    console.log('\nKontrollerar nyckelvariabler:');
    console.log('-----------------------------------');
    const hasStripeKeys = lines.some(line => line.startsWith('STRIPE_SECRET_KEY='));
    const hasSupabaseKeys = lines.some(line => line.startsWith('NEXT_PUBLIC_SUPABASE_URL='));
    
    console.log('Stripe-nycklar:', hasStripeKeys ? '✅ Hittades' : '❌ Saknas');
    console.log('Supabase-nycklar:', hasSupabaseKeys ? '✅ Hittades' : '❌ Saknas');
    
  } else {
    console.log('❌ .env.local hittades inte!');
  }
} catch (error) {
  console.error('Ett fel uppstod:', error);
} 