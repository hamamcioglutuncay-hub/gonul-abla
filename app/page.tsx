"use client"

import { useState, useEffect } from 'react'

type Message = {
  id: number
  text: string
  isUser: boolean
  reactions?: string[]
}

type Theme = 'light' | 'dark' | 'pink'

export default function Page() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Merhaba! Ben Gönül Abla. Nasılsın canım?', isUser: false, reactions: [] }
  ])
  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState<Theme>('light')
  const [showReactionMenu, setShowReactionMenu] = useState<{messageId: number, x: number, y: number} | null>(null)

  // Theme persistence
  useEffect(() => {
    const savedTheme = localStorage.getItem('gonul-abla-theme') as Theme
    if (savedTheme) setTheme(savedTheme)
  }, [])

  useEffect(() => {
    localStorage.setItem('gonul-abla-theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const sendMessage = async () => {
    if (!message.trim()) return

    const userMessage: Message = { id: Date.now(), text: message, isUser: true, reactions: [] }
    setMessages(prev => [...prev, userMessage])
    setMessage('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: message }] })
      })
      
      const data = await response.json()
      
      if (data.content) {
        const botMessage: Message = { id: Date.now() + 1, text: data.content, isUser: false, reactions: [] }
        setMessages(prev => [...prev, botMessage])
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = { id: Date.now() + 1, text: 'Üzgünüm, bir hata oluştu. Lütfen tekrar dene.', isUser: false, reactions: [] }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const fetchTip = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/tip')
      const data = await response.json()
      
      if (data.content) {
        const tipMessage: Message = { id: Date.now(), text: data.content, isUser: false, reactions: [] }
        setMessages(prev => [...prev, tipMessage])
      }
    } catch (error) {
      console.error('Tip error:', error)
    } finally {
      setLoading(false)
    }
  }

  const addReaction = (messageId: number, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || []
        if (reactions.includes(emoji)) {
          return { ...msg, reactions: reactions.filter(r => r !== emoji) }
        } else {
          return { ...msg, reactions: [...reactions, emoji] }
        }
      }
      return msg
    }))
    setShowReactionMenu(null)
  }

  const handleMessageClick = (e: React.MouseEvent, messageId: number) => {
    if (e.detail === 2) { // Double click
      setShowReactionMenu({ messageId, x: e.clientX, y: e.clientY })
    }
  }

  const themes = [
    { id: 'light', name: 'Açık', icon: '☀️' },
    { id: 'dark', name: 'Koyu', icon: '🌙' },
    { id: 'pink', name: 'Pembe', icon: '🌸' }
  ] as const

  const reactions = ['❤️', '😂', '👍', '😮', '😢', '😡']

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 
      theme === 'pink' ? 'bg-pink-50 text-gray-900' : 
      'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <div className={`shadow-sm p-4 ${
        theme === 'dark' ? 'bg-gray-800' : 
        theme === 'pink' ? 'bg-pink-100' : 
        'bg-white'
      }`}>
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🤖</div>
            <h1 className="text-2xl font-bold">Gönül Abla</h1>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Theme Selector */}
            <div className="flex items-center gap-1 bg-gray-200 rounded-lg p-1">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`p-2 rounded-md transition-colors ${
                    theme === t.id 
                      ? 'bg-white shadow-sm' 
                      : 'hover:bg-gray-100'
                  }`}
                  title={t.name}
                >
                  {t.icon}
                </button>
              ))}
            </div>
            
            {/* Daily Tip Button */}
            <button
              onClick={fetchTip}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed ${
                theme === 'dark' ? 'bg-pink-600 text-white' : 
                theme === 'pink' ? 'bg-pink-500 text-white' : 
                'bg-pink-500 text-white'
              }`}
            >
              <span>🔔</span>
              <span>Günün Tavsiyesi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 max-w-3xl mx-auto w-full p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[80%] p-3 rounded-2xl cursor-pointer ${
                msg.isUser 
                  ? (theme === 'dark' ? 'bg-blue-600 text-white' : 
                     theme === 'pink' ? 'bg-pink-500 text-white' : 
                     'bg-blue-500 text-white')
                  : (theme === 'dark' ? 'bg-gray-700 text-white' : 
                     theme === 'pink' ? 'bg-white text-gray-900' : 
                     'bg-white text-gray-900 shadow-sm')
              }`}
              onDoubleClick={(e) => handleMessageClick(e, msg.id)}
              title="Çift tıklayarak emoji ekle"
            >
              <p className="text-sm mb-2">{msg.text}</p>
              
              {/* Reactions */}
              {msg.reactions && msg.reactions.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap mt-2">
                  {msg.reactions.map((reaction, idx) => (
                    <span key={idx} className="text-xs">{reaction}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className={`p-3 rounded-2xl ${
              theme === 'dark' ? 'bg-gray-700' : 
              theme === 'pink' ? 'bg-white' : 
              'bg-white shadow-sm'
            }`}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-bounce ${
                  theme === 'dark' ? 'bg-gray-400' : 'bg-gray-400'
                }`}></div>
                <div className={`w-2 h-2 rounded-full animate-bounce ${
                  theme === 'dark' ? 'bg-gray-400' : 'bg-gray-400'
                }`} style={{animationDelay: '0.1s'}}></div>
                <div className={`w-2 h-2 rounded-full animate-bounce ${
                  theme === 'dark' ? 'bg-gray-400' : 'bg-gray-400'
                }`} style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reaction Menu */}
      {showReactionMenu && (
        <div 
          className="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-2"
          style={{ 
            left: Math.min(showReactionMenu.x, window.innerWidth - 200),
            top: Math.min(showReactionMenu.y, window.innerHeight - 100)
          }}
        >
          <div className="flex gap-1">
            {reactions.map((emoji) => (
              <button
                key={emoji}
                onClick={() => addReaction(showReactionMenu.messageId, emoji)}
                className="p-2 hover:bg-gray-100 rounded text-lg"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Click outside to close reaction menu */}
      {showReactionMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowReactionMenu(null)}
        />
      )}

      {/* Input */}
      <div className={`border-t p-4 ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 
        theme === 'pink' ? 'bg-pink-100 border-pink-200' : 
        'bg-white border-gray-200'
      }`}>
        <div className="max-w-3xl mx-auto flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
            placeholder="Mesajını yaz..."
            disabled={loading}
            className={`flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 disabled:opacity-50 ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' 
                : theme === 'pink'
                ? 'bg-white border-pink-300 text-gray-900 focus:ring-pink-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          <button
            onClick={sendMessage}
            disabled={!message.trim() || loading}
            className={`px-6 py-3 rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed ${
              theme === 'dark' ? 'bg-blue-600 text-white' : 
              theme === 'pink' ? 'bg-pink-500 text-white' : 
              'bg-blue-500 text-white'
            }`}
          >
            Gönder
          </button>
        </div>
      </div>
    </div>
  )
}