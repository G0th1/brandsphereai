import { Ratelimit } from '@upstash/ratelimit'
import { redis } from './redis-service'

// Olika rate limits för olika endpoints
const RATE_LIMITS = {
  DEFAULT: {
    requests: 100,
    duration: '1 m', // per minut
  },
  YOUTUBE_API: {
    requests: 50,
    duration: '1 m',
  },
  FACEBOOK_API: {
    requests: 50,
    duration: '1 m',
  },
  AUTH: {
    requests: 5,
    duration: '1 m',
  },
}

// Skapa rate limiters för olika endpoints
const rateLimiters = {
  default: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(RATE_LIMITS.DEFAULT.requests, RATE_LIMITS.DEFAULT.duration),
    analytics: true,
  }),
  youtubeApi: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(RATE_LIMITS.YOUTUBE_API.requests, RATE_LIMITS.YOUTUBE_API.duration),
    analytics: true,
    prefix: 'ratelimit:youtube',
  }),
  facebookApi: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(RATE_LIMITS.FACEBOOK_API.requests, RATE_LIMITS.FACEBOOK_API.duration),
    analytics: true,
    prefix: 'ratelimit:facebook',
  }),
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(RATE_LIMITS.AUTH.requests, RATE_LIMITS.AUTH.duration),
    analytics: true,
    prefix: 'ratelimit:auth',
  }),
}

export type RateLimitType = keyof typeof rateLimiters

export async function checkRateLimit(identifier: string, type: RateLimitType = 'default') {
  const limiter = rateLimiters[type]
  const result = await limiter.limit(identifier)
  
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  }
} 