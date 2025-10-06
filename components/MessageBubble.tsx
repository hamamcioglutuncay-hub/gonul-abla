import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/tr'

dayjs.extend(relativeTime)

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  ts: number
}

export default function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'
  const time = dayjs(message.ts).locale('tr').fromNow()
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] rounded-2xl px-4 py-2 shadow-soft ${isUser ? 'bg-brand-500 text-white' : 'bg-white text-gray-900'}`}>
        {!isUser && (
          <div className="text-xs text-brand-700 mb-1">Gönül Abla</div>
        )}
        <div className="whitespace-pre-wrap break-words">{message.content}</div>
        <div className={`text-[11px] mt-1 ${isUser ? 'text-white/80' : 'text-gray-500'}`}>{time}</div>
      </div>
    </div>
  )
}
