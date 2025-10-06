import Chat from '@/components/Chat'

export default function Page() {
  return (
    <main className="flex-1 flex flex-col">
      <div className="flex items-center gap-2 py-2">
        <img src="/icon.svg" alt="Gönül Abla" className="h-7 w-7" />
        <h1 className="text-xl font-semibold">Gönül Abla</h1>
      </div>
      <Chat />
    </main>
  )
}
