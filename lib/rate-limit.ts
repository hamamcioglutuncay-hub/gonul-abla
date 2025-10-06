type Bucket = { tokens: number; updatedAt: number }

const WINDOW_MS = 60_000
const LIMIT = 10

const memoryBuckets = new Map<string, Bucket>()

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

export async function rateLimit(ip: string): Promise<{ allowed: boolean; remaining?: number }>{
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    // Token bucket on Redis using simple key with TTL window
    const key = `rl:${ip}`
    try {
      // Decrement a counter with TTL reset each minute
      const res = await fetch(`${UPSTASH_URL}/pipeline`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${UPSTASH_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          commands: [
            ['INCR', key],
            ['EXPIRE', key, `${WINDOW_MS / 1000}`]
          ]
        })
      })
      const data = await res.json()
      const current = Number(data?.result?.[0]) || 0
      return { allowed: current <= LIMIT, remaining: Math.max(0, LIMIT - current) }
    } catch {
      // fallback to memory
    }
  }

  const now = Date.now()
  const bucket = memoryBuckets.get(ip) || { tokens: LIMIT, updatedAt: now }
  const elapsed = now - bucket.updatedAt
  const refill = Math.floor(elapsed / WINDOW_MS) * LIMIT
  const tokens = Math.min(LIMIT, bucket.tokens + (refill > 0 ? refill : 0))
  const newTokens = tokens > 0 ? tokens - 1 : 0
  memoryBuckets.set(ip, { tokens: newTokens, updatedAt: refill > 0 ? now : bucket.updatedAt })
  return { allowed: newTokens >= 0, remaining: newTokens }
}
