"use client"

import { useState } from 'react'

export default function Page() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, text: 'Merhaba! Ben Gönül Abla. Nasılsın canım?', isUser: false }
  ])

  const sendMessage = async () => {
    if (!message.trim()) return

    const userMessage = { id: Date.now(), text: message, isUser: true }
    setMessages(prev => [...prev, userMessage])
    setMessage('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: message }] })
      })
      
      const data = await response.json()
      
      if (data.content) {
        const botMessage = { id: Date.now() + 1, text: data.content, isUser: false }
        setMessages(prev => [...prev, botMessage])
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage = { id: Date.now() + 1, text: 'Üzgünüm, bir hata oluştu. Lütfen tekrar dene.', isUser: false }
      setMessages(prev => [...prev, errorMessage])
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center gap-3 max-w-3xl mx-auto">
          <div className="text-2xl">🤖</div>
          <h1 className="text-2xl font-bold text-gray-900">Gönül Abla</h1>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 max-w-3xl mx-auto w-full p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${
              msg.isUser 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-900 shadow-sm'
            }`}>
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4">
        <div className="max-w-3xl mx-auto flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Mesajını yaz..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            disabled={!message.trim()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Gönder
          </button>
        </div>
      </div>
    </div>
  )
}