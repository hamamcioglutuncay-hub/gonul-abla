import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const LIMIT = 10
const WINDOW_MS = 60_000
const buckets = new Map<string, { count: number; resetAt: number }>()

export function middleware(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const now = Date.now()
  const b = buckets.get(ip) || { count: 0, resetAt: now + WINDOW_MS }
  if (now > b.resetAt) {
    b.count = 0
    b.resetAt = now + WINDOW_MS
  }
  b.count += 1
  buckets.set(ip, b)
  if (b.count > LIMIT) {
    return NextResponse.json({ error: 'Sınırı aştın canım. Lütfen bir dakika sonra tekrar dene.' }, { status: 429 })
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*']
}
