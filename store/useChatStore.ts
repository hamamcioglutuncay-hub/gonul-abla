import { create } from 'zustand'

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  ts: number
}

type ChatState = {
  messages: ChatMessage[]
  addMessage: (m: ChatMessage) => void
  setMessages: (m: ChatMessage[]) => void
  clear: () => void
}

const STORAGE_KEY = 'gonul-abla:messages'

function loadInitial(): ChatMessage[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const arr = JSON.parse(raw) as ChatMessage[]
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  addMessage: (m) => set({ messages: [...get().messages, m] }),
  setMessages: (m) => set({ messages: m }),
  clear: () => set({ messages: [] })
}))

// Persistence effect (called in client component)
export function useChatPersistence() {
  if (typeof window === 'undefined') return
  const saved = loadInitial()
  if (saved.length) {
    // hydrate once
    try {
      // import inside to avoid SSR issues
      const { useChatStore } = require('./useChatStore') as typeof import('./useChatStore')
      const current = useChatStore.getState().messages
      if (current.length === 0) useChatStore.getState().setMessages(saved)
    } catch {}
  }

  const unsub = useChatStore.subscribe((state) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.messages))
    } catch {}
  })
  return unsub
}

export function getLast10Turns(messages: ChatMessage[]) {
  // turn = user+assistant pair => last 10 turns ~ last 20 messages
  return messages.slice(-20).map(m => ({ role: m.role, content: m.content }))
}
