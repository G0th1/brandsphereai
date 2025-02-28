import { EnhancedRedisService } from '../lib/services/enhanced-redis-service'
import * as dotenv from 'dotenv'

// Ladda miljövariabler
dotenv.config({ path: '.env.local' })

async function testRedisFeatures() {
  console.log('🧪 Testar förbättrade Redis-funktioner...\n')

  // Test 1: Grundläggande key-value operationer
  console.log('Test 1: Key-Value operationer')
  try {
    await EnhancedRedisService.set('test-key', { message: 'det fungerar!' })
    const value = await EnhancedRedisService.get('test-key')
    console.log('✅ SET/GET:', value)
  } catch (error) {
    console.error('❌ SET/GET misslyckades:', error)
  }

  // Test 2: Cache med TTL
  console.log('\nTest 2: Cache med TTL')
  try {
    await EnhancedRedisService.setCache('cache-test', { data: 'cachad data' }, 5)
    console.log('Data cachad med 5s TTL. Väntar 2 sekunder...')
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    const cached1 = await EnhancedRedisService.getCache('cache-test')
    console.log('Efter 2s:', cached1)
    
    console.log('Väntar 4 sekunder till...')
    await new Promise(resolve => setTimeout(resolve, 4000))
    const cached2 = await EnhancedRedisService.getCache('cache-test')
    console.log('Efter 6s:', cached2)
    
    if (cached1 && !cached2) {
      console.log('✅ TTL-caching fungerar')
    }
  } catch (error) {
    console.error('❌ Cache-test misslyckades:', error)
  }

  // Test 3: Rate limiting
  console.log('\nTest 3: Rate limiting')
  try {
    const testId = 'test-user-123'
    for (let i = 1; i <= 6; i++) {
      const result = await EnhancedRedisService.checkRateLimit(testId, 5, 60)
      console.log(`Försök ${i}:`, {
        Lyckades: result.success,
        'Återstående försök': result.remaining,
        'Återställs om': `${Math.ceil((result.reset - Date.now()) / 1000)}s`,
      })
    }
  } catch (error) {
    console.error('❌ Rate limiting test misslyckades:', error)
  }

  // Test 4: Köhantering
  console.log('\nTest 4: Köhantering')
  try {
    // Lägg till testmeddelanden i kön
    const queueName = 'test-queue'
    await EnhancedRedisService.clearQueue(queueName) // Rensa kön först
    
    console.log('Lägger till meddelanden i kön...')
    for (let i = 1; i <= 3; i++) {
      await EnhancedRedisService.enqueue(queueName, { task: `Task ${i}` })
    }
    
    const stats = await EnhancedRedisService.getQueueStats(queueName)
    console.log('Köstatistik:', stats)

    // Testa bearbetning av kön
    console.log('Bearbetar kön...')
    let processedCount = 0
    const processor = async (data: any) => {
      processedCount++
      console.log('Bearbetar:', data)
      if (processedCount === 3) {
        process.exit(0)
      }
    }

    await EnhancedRedisService.processQueue(queueName, processor, {
      batchSize: 1,
      pollInterval: 100
    })
  } catch (error) {
    console.error('❌ Köhanteringstest misslyckades:', error)
  }
}

testRedisFeatures() 