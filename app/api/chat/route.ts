import { NextRequest, NextResponse } from 'next/server'
import { getResponseFromOpenAI, moderateInput } from '@/lib/openai'
import { rateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'

const PERSONA = `Sen 'Gönül Abla'sın: sevecen, pratik zekâlı, yargılamadan yönlendiren. Konuşma tarzını soruya göre ayarla - ciddi konularda danışman gibi, eğlenceli konularda arkadaş gibi, öğretici konularda öğretmen gibi, komik konularda mizahi ol. Hitap şeklini az kullan ve çeşitlendir: 'Canım', 'Tatlım', 'Yavrum', 'Güzelim' gibi hitapları sadece önemli yerlerde kullan. Cevap uzunluğunu duruma göre ayarla: basit sorulara kısa, karmaşık konularda uzun, görüşmenin gidişatına göre uygun uzunlukta cevap ver. Sadece uzun cevaplarda (3+ cümle) mesajın sonunda tek cümlelik özet ver. Mizah seviyesini duruma göre ayarla: eğlenceli konularda komik ve şakacı ol, ciddi konularda ciddi ve profesyonel ol. Yardım etme tarzını duruma göre ayarla: acil durumlarda direkt çözüm öner, öğrenme konularında adım adım açıkla, kişisel konularda sorular sorarak danışmanlık yap, deneyim paylaşımında arkadaşça yaklaş, genel olarak yargılamadan yönlendir. Tıbbi/hukuki teşhis/tedavi önerme; hassas konularda nazikçe uzman desteğine yönlendir. Politik tartışmalara girme.`

function buildInput(history: { role: 'user'|'assistant'; content: string }[], latestUser: string) {
  const lines: string[] = []
  lines.push('[SİSTEM]')
  lines.push(PERSONA)
  lines.push('')
  lines.push('[GEÇMİŞ - son 10 tur, sırayla]')
  history.forEach(m => {
    const role = m.role === 'user' ? 'user' : 'assistant'
    lines.push(`${role}: ${m.content}`)
  })
  lines.push('')
  lines.push('[KULLANICI]')
  lines.push(latestUser)
  return lines.join('\n')
}

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'Sunucu yapılandırma hatası: OPENAI_API_KEY yok.' }, { status: 500 })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.ip || 'unknown'
  const rl = await rateLimit(ip)
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Sınırı aştın canım. Lütfen bir dakika sonra tekrar dene.' }, { status: 429 })
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Geçersiz JSON gövdesi' }, { status: 400 })
  }

  const messages = Array.isArray(body?.messages) ? body.messages : []
  if (!messages.length) {
    return NextResponse.json({ error: 'messages alanı gerekli' }, { status: 400 })
  }

  const last = messages[messages.length - 1]
  if (last?.role !== 'user' || typeof last?.content !== 'string') {
    return NextResponse.json({ error: 'Son mesaj kullanıcıdan ve metin olmalı' }, { status: 400 })
  }

  // Moderation on latest user content
  const mod = await moderateInput(last.content)
  if (mod.flagged) {
    const safe = 'Canım, bu konu hassas olabilir. Güvenli ve doğru yönlendirme için bir uzmana danışmanı öneririm. İstersen sana kaynak da önerebilirim. (Kısa özet: Uzman desteği iyi bir başlangıç.)'
    return NextResponse.json({ content: safe })
  }

  // Keep only last 10 turns (user+assistant messages). Ensure order preserved.
  const sliced = messages.slice(-20).map((m: any) => ({ role: m.role, content: String(m.content || '') }))
  const input = buildInput(sliced, last.content)

  try {
    const content = await getResponseFromOpenAI(input, 0.7)
    return NextResponse.json({ content })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Sunucu hatası' }, { status: 500 })
  }
}
