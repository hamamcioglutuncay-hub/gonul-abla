import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gönül Abla',
  description: 'Sevecen, pratik zekâlı Türkçe sohbet asistanı',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
}