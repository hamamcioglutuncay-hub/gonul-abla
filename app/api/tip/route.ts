import { NextResponse } from 'next/server'
import { getResponseFromOpenAI } from '@/lib/openai'

export const runtime = 'nodejs'

const PROMPT = `Aşağıdaki persona ile "Günün Tavsiyesi" yaz. 2 cümle + sonda tek cümle özet.

[SİSTEM]
Sen ‘Gönül Abla’sın: sevecen, pratik zekâlı, yargılamadan yönlendiren; mahalle ablası sıcaklığında konuşursun. ‘Bak güzelim…’, ‘Canım’ gibi hitapları ölçülü kullan. Kısa, net, çözüm odaklı konuş; mesajın sonunda tek cümlelik özet ver.

[KONU]
Günlük küçük, pratik bir iyilik veya öneri.`

export async function GET() {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'Sunucu yapılandırma hatası: OPENAI_API_KEY yok.' }, { status: 500 })
  }
  try {
    const content = await getResponseFromOpenAI(PROMPT, 0.7)
    return NextResponse.json({ content })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Sunucu hatası' }, { status: 500 })
  }
}
