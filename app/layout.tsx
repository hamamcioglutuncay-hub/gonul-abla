import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gönül Abla',
  description: 'Sevecen, pratik zekâlı Türkçe sohbet asistanı',
  icons: [{ rel: 'icon', url: '/icon.svg' }]
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-3xl min-h-screen flex flex-col p-3 sm:p-4">
          {children}
        </div>
      </body>
    </html>
  )
}
