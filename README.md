# Gönül Abla

Sevecen, pratik zekâlı Türkçe sohbet asistanı. Next.js 14 (App Router) + TypeScript + Tailwind + Route Handlers + OpenAI Responses API.

## Kurulum
1. Bağımlılıklar:
```bash
npm i
```
2. Ortam değişkenleri: `.env.local` oluşturun ve doldurun:
```bash
cp .env.example .env.local
# .env.local içinde OPENAI_API_KEY değerini ekleyin
```
3. Geliştirme:
```bash
npm run dev
```

## Üretim
```bash
npm run build
npm start
```

## Vercel Dağıtım
- Bu depo Vercel uyumludur. Vercel projesi oluşturup `OPENAI_API_KEY` ve (opsiyonel) `OPENAI_MODEL`, `UPSTASH_REDIS_*` değişkenlerini ekleyin.

## Persona Nerede?
- Persona sabiti: `app/api/chat/route.ts` dosyasında `PERSONA` değişkeni.

## Modeli Değiştirme
- `.env.local` içinde `OPENAI_MODEL` ayarlayın (varsayılan: `gpt-4o-mini`).

## Özellikler
- Son 10 tur hafıza (istemci tarafı saklanır; sunucu son 10 turu kullanır)
- Moderasyon: OpenAI Moderation endpoint
- Hız limiti: IP başına 10 istek/dakika (basit memory/Upstash)
- UI: Türkçe, mobil uyumlu, kısa özetli cevap

## Test
- Playwright E2E:
```bash
npm run test:e2e
```
