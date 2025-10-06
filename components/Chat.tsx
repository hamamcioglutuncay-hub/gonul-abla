"use client"

import { useEffect, useMemo, useRef, useState } from 'react'
import MessageBubble from './MessageBubble'
import TypingDots from './TypingDots'
import { useChatStore, getLast10Turns } from '@/store/useChatStore'

function uid() { return Math.random().toString(36).slice(2) }

export default function Chat() {
  const { messages, addMessage, setMessages } = useChatStore()
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string|undefined>()
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    // hydrate persistence
    const unsub = require('@/store/useChatStore').useChatPersistence?.()
    return () => { if (typeof unsub === 'function') unsub() }
  }, [])

  const canSend = input.trim().length > 0 && !loading

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim()
    if (!content) return
    setError(undefined)
    setLoading(true)

    const userMsg = { id: uid(), role: 'user' as const, content, ts: Date.now() }
    addMessage(userMsg)

    try {
      const payload = { messages: [...getLast10Turns(messages), { role: 'user', content }] }
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Sunucu hatası')

      const assistantMsg = { id: uid(), role: 'assistant' as const, content: String(data.content || ''), ts: Date.now() }
      addMessage(assistantMsg)
      setInput('')
    } catch (e: any) {
      setError(e?.message || 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  async function fetchTip() {
    try {
      const res = await fetch('/api/tip')
      const data = await res.json()
      if (data?.content) {
        const assistantMsg = { id: uid(), role: 'assistant' as const, content: String(data.content), ts: Date.now() }
        addMessage(assistantMsg)
      }
    } catch {}
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (canSend) sendMessage()
    }
  }

  const charCount = input.length
  const safeCount = useMemo(() => Math.max(0, 4000 - charCount), [charCount])

  return (
    <div className="flex-1 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <button onClick={fetchTip} className="inline-flex items-center gap-2 text-sm text-brand-700 hover:text-brand-800">
          <span role="img" aria-label="bell">🔔</span>
          Günün Tavsiyesi
        </button>
        {error && <div className="text-sm text-red-600">{error}</div>}
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-3">
        {messages.map(m => <MessageBubble key={m.id} message={m as any} />)}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl px-4 py-2 shadow-soft">
              <div className="text-xs text-brand-700 mb-1">Gönül Abla</div>
              <TypingDots />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="sticky bottom-0 bg-gray-50 pt-2">
        <div className="rounded-2xl bg-white shadow-soft p-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            className="w-full resize-none outline-none max-h-40 min-h-[44px] p-2"
            placeholder="Mesajını yaz... (Enter: gönder, Shift+Enter: yeni satır)"
          />
          <div className="flex items-center justify-between px-1 pb-1">
            <div className="text-xs text-gray-500">Kalan ~{safeCount} karakter</div>
            <button
              onClick={() => sendMessage()}
              disabled={!canSend}
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${canSend ? 'bg-brand-600 text-white hover:bg-brand-700' : 'bg-gray-200 text-gray-500'}`}
            >Gönder</button>
          </div>
        </div>
      </div>
    </div>
  )
}
