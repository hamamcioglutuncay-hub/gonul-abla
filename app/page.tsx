export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🤖</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Gönül Abla</h1>
        <p className="text-xl text-gray-600 mb-8">Sevecen, pratik zekâlı Türkçe sohbet asistanı</p>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Test Mesajı</h2>
          <p className="text-gray-600 mb-4">Merhaba! Ben Gönül Abla. Nasılsın canım?</p>
          <div className="text-sm text-gray-500">
            💬 Chat özelliği aktif edilecek...
          </div>
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          ✅ Vercel deployment çalışıyor<br>
          🔧 OpenAI API hazır<br>
          🚀 Next.js 14 App Router aktif
        </div>
      </div>
    </div>
  )
}