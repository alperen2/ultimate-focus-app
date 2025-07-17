import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from './lib/rate-limit'

export async function middleware(request: NextRequest) {
  // Rate limiting for authentication endpoints
  if (request.nextUrl.pathname.startsWith('/api/auth') || 
      request.nextUrl.pathname.startsWith('/auth/')) {
    
    const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'anonymous'
    const limit = await rateLimit(ip, request.nextUrl.pathname)
    
    if (!limit.success) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests' }),
        { 
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(limit.retryAfter || 60)
          }
        }
      )
    }
  }

  // Security headers
  const response = NextResponse.next()
  
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  return response
}

export const config = {
  matcher: [
    '/api/:path*',
    '/auth/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}