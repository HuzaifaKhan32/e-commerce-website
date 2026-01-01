// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

// Simple rate limiting implementation
const rateLimitMap = new Map();

export function middleware(request: NextRequest) {
  // Get client IP
  const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || (request as any).ip || 'unknown';
  const key = `${clientIP}-${request.nextUrl.pathname}`;
  
  // Rate limit: max 100 requests per 15 minutes
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100;
  
  const record = rateLimitMap.get(key) || { count: 0, resetTime: now + windowMs };
  
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
  } else {
    record.count++;
  }
  
  rateLimitMap.set(key, record);
  
  if (record.count > maxRequests) {
    return new NextResponse('Rate limit exceeded', { status: 429 });
  }
  
  // Security headers
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};