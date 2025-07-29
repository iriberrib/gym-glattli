'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import ClaseCard from '@/components/ClaseCard'
import { Search } from 'lucide-react'

export default function ClasesPage() {
  const [clases, setClases] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const { data: session } = useSession()

  useEffect(() => {
    const fetchClases = async () => {
      try {
        const response = await fetch('/api/clases')
        if (response.ok) {
          const data = await response.json()
          console.log('Clases obtenidas:', data)
          setClases(data)
        } else {
          console.error('Error al obtener las clases')
          setMensaje({ texto: 'Error al cargar las clases', tipo: 'error' })
        }
      } catch (error) {
        console.error('Error:', error)
        setMensaje({ texto: 'Error al conectar con el servidor', tipo: 'error' })
      } finally {
        setIsLoading(false)
      }
    }

    fetchClases()
  }, [])

  const handleReservaRealizada = (claseActualizada) => {
    setClases(clases.map(clase => 
      clase.id === claseActualizada.id ? claseActualizada : clase
    ))
    setMensaje({ texto: 'Reserva realizada con éxito', tipo: 'success' })
  }

  const filteredClases = clases.filter(clase =>
    clase.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clase.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  )

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-2">Nuestras Clases</h1>
      <p className="text-gray-600 mb-8">Explora y reserva nuestras clases disponibles</p>

      {mensaje.texto && (
        <div className={`mb-4 p-4 rounded-md ${
          mensaje.tipo === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {mensaje.texto}
        </div>
      )}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Buscar Clases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Search className="text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nombre de clase o instructor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
          </div>
        </CardContent>
      </Card>

      {filteredClases.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <h2 className="text-xl font-semibold mb-2">No hay clases disponibles</h2>
            <p className="text-gray-600">Vuelve más tarde para ver las nuevas clases</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClases.map((clase) => (
            <ClaseCard 
              key={clase.id}
              clase={clase}
              session={session}
              onReservaRealizada={handleReservaRealizada}
            />
          ))}
        </div>
      )}
    </div>
  )
}