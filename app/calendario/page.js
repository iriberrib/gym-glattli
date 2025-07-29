// app/calendario/page.js
import CalendarioSemanal from '@/components/CalendarioSemanal'

export default function CalendarioPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Calendario de Clases</h1>
      <CalendarioSemanal />
    </div>
  )
}