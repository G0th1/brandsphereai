import { redis } from '../lib/services/redis-service'
import { checkRateLimit } from '../lib/services/rate-limit-service'

async function testRedis() {
  console.log('🧪 Testar Redis-anslutning och funktionalitet...\n')

  // Test 1: Grundläggande anslutning
  try {
    await redis.set('test-key', 'det fungerar!')
    const value = await redis.get('test-key')
    console.log('✅ Redis-anslutning: OK')
    console.log('Testvärde:', value)
  } catch (error) {
    console.error('❌ Redis-anslutning misslyckades:', error)
  }

  // Test 2: Rate limiting
  console.log('\n🔍 Testar rate limiting...')
  const testId = 'test-user-123'
  
  try {
    for (let i = 1; i <= 6; i++) {
      const result = await checkRateLimit(testId, 'auth')
      console.log(`Försök ${i}:`, {
        Lyckades: result.success,
        'Återstående försök': result.remaining,
        'Återställs om': `${Math.ceil((result.reset - Date.now()) / 1000)}s`,
      })

      if (!result.success) {
        console.log('✅ Rate limiting fungerar som förväntat (blockerar efter 5 försök)')
        break
      }
    }
  } catch (error) {
    console.error('❌ Rate limiting test misslyckades:', error)
  }

  // Test 3: Caching med TTL
  console.log('\n🔍 Testar caching med TTL...')
  try {
    await redis.set('cache-test', 'cachad data', { ex: 5 }) // 5 sekunders TTL
    console.log('Data cachad. Väntar 2 sekunder...')
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    const cached1 = await redis.get('cache-test')
    console.log('Efter 2s:', cached1)
    
    console.log('Väntar 4 sekunder till...')
    await new Promise(resolve => setTimeout(resolve, 4000))
    const cached2 = await redis.get('cache-test')
    console.log('Efter 6s:', cached2)
    
    if (cached1 && !cached2) {
      console.log('✅ TTL-caching fungerar som förväntat')
    }
  } catch (error) {
    console.error('❌ Caching test misslyckades:', error)
  }

  process.exit(0)
}

testRedis() 