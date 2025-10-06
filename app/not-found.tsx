import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-xl text-gray-600 mb-4">Sayfa bulunamadı</h2>
      <p className="text-gray-500 mb-8">Aradığın sayfa mevcut değil.</p>
      <Link 
        href="/" 
        className="bg-brand-500 text-white px-6 py-3 rounded-lg hover:bg-brand-600 transition-colors"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  )
}
