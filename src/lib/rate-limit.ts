/**
 * Simple in-memory rate limiting for authentication endpoints
 * In production, consider using Redis or a more robust solution
 */

interface RateLimitResult {
  success: boolean
  retryAfter?: number
}

// In-memory store for rate limiting
const store = new Map<string, { count: number; resetTime: number }>()

// Different limits for different endpoints
const RATE_LIMITS = {
  '/auth/login': { requests: 5, window: 15 * 60 * 1000 }, // 5 requests per 15 minutes
  '/auth/register': { requests: 3, window: 60 * 60 * 1000 }, // 3 requests per hour
  '/auth/reset-password': { requests: 3, window: 60 * 60 * 1000 }, // 3 requests per hour
  '/api/auth': { requests: 10, window: 15 * 60 * 1000 }, // 10 requests per 15 minutes (general API)
  default: { requests: 20, window: 15 * 60 * 1000 } // Default: 20 requests per 15 minutes
}

export async function rateLimit(
  identifier: string,
  endpoint: string
): Promise<RateLimitResult> {
  const now = Date.now()
  const key = `${identifier}:${endpoint}`
  
  // Determine rate limit based on endpoint
  let limit = RATE_LIMITS.default
  for (const [pattern, config] of Object.entries(RATE_LIMITS)) {
    if (pattern !== 'default' && endpoint.includes(pattern)) {
      limit = config
      break
    }
  }
  
  // Clean up expired entries
  cleanupExpiredEntries(now)
  
  const record = store.get(key)
  
  if (!record) {
    // First request
    store.set(key, { count: 1, resetTime: now + limit.window })
    return { success: true }
  }
  
  if (now > record.resetTime) {
    // Window has reset
    store.set(key, { count: 1, resetTime: now + limit.window })
    return { success: true }
  }
  
  if (record.count >= limit.requests) {
    // Rate limit exceeded
    const retryAfter = Math.ceil((record.resetTime - now) / 1000)
    return { success: false, retryAfter }
  }
  
  // Increment counter
  record.count++
  return { success: true }
}

function cleanupExpiredEntries(now: number) {
  for (const [key, record] of store.entries()) {
    if (now > record.resetTime) {
      store.delete(key)
    }
  }
}

// Cleanup expired entries every 5 minutes
setInterval(() => cleanupExpiredEntries(Date.now()), 5 * 60 * 1000)