import { Redis } from '@upstash/redis'
import * as dotenv from 'dotenv'

// Ladda miljövariabler från .env.local
dotenv.config({ path: '.env.local' })

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('Redis-konfiguration saknas i .env.local')
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

async function simpleTest() {
  console.log('🧪 Testar Redis-anslutning...\n')

  try {
    await redis.set('test-key', 'det fungerar!')
    const value = await redis.get('test-key')
    console.log('✅ Redis-anslutning: OK')
    console.log('Testvärde:', value)
  } catch (error) {
    console.error('❌ Redis-anslutning misslyckades:', error)
    console.error('Felmeddelande:', error instanceof Error ? error.message : String(error))
  }
}

simpleTest().catch(console.error) 