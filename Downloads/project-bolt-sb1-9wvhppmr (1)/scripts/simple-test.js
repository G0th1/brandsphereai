const { Redis } = require('@upstash/redis');
const { Ratelimit } = require('@upstash/ratelimit');
require('dotenv').config({ path: '.env.local' });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || ''
});

async function simpleTest() {
  try {
    // Test 1: SET och GET
    console.log('Test 1: SET och GET');
    await redis.set('test-key', 'test-value');
    const value = await redis.get('test-key');
    console.log('Värde hämtat:', value);
    console.log('Test 1 lyckades!\n');

    // Test 2: TTL
    console.log('Test 2: TTL');
    await redis.setex('ttl-test', 5, 'försvinner snart');
    console.log('Väntar 2 sekunder...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    const ttlValue1 = await redis.get('ttl-test');
    console.log('Värde efter 2s:', ttlValue1);
    console.log('Väntar 4 sekunder till...');
    await new Promise(resolve => setTimeout(resolve, 4000));
    const ttlValue2 = await redis.get('ttl-test');
    console.log('Värde efter 6s:', ttlValue2);
    console.log('Test 2 lyckades!\n');

    // Test 3: Rate Limiting
    console.log('Test 3: Rate Limiting');
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '10 s'),
    });

    for (let i = 0; i < 7; i++) {
      const result = await ratelimit.limit('test-limit');
      console.log(`Försök ${i + 1}: ${result.success ? 'Godkänd' : 'Nekad'}`);
    }
    console.log('Test 3 lyckades!');

  } catch (error) {
    console.error('Ett fel uppstod:', error);
  }
}

simpleTest(); 