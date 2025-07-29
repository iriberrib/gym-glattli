'use client'

import { useState, useEffect } from 'react'
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { es } from "date-fns/locale"
import { format } from "date-fns"
import { useRouter } from 'next/navigation'

const clases = [
  {
    id: 1,
    nombre: "Yoga",
    instructor: "Ana García",
    horario: new Date(2024, 11, 20, 22, 20),
    capacidad: 15,
    reservas: []
  },
  {
    id: 2,
    nombre: "Spinning",
    instructor: "Carlos Ruiz",
    horario: new Date(2024, 11, 21, 22, 20),
    capacidad: 20,
    reservas: []
  },
  {
    id: 3,
    nombre: "Pilates",
    instructor: "María López",
    horario: new Date(2024, 11, 22, 22, 20),
    capacidad: 12,
    reservas: []
  },
  {
    id: 4,
    nombre: "Zumba",
    instructor: "David Martínez",
    horario: new Date(2024, 11, 23, 22, 20),
    capacidad: 25,
    reservas: []
  },
  {
    id: 5,
    nombre: "CrossFit",
    instructor: "Laura Sánchez",
    horario: new Date(2024, 11, 24, 22, 20),
    capacidad: 15,
    reservas: []
  }
]

export default function CalendarioSemanal() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 11, 20))
  const [clasesDisponibles, setClasesDisponibles] = useState([])
  const [mensaje, setMensaje] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const clasesDelDia = clases.filter(clase => 
      clase.horario.toDateString() === selectedDate.toDateString()
    )
    setClasesDisponibles(clasesDelDia)
  }, [selectedDate])

  const handleReserva = async (claseId) => {
    try {
      setLoading(true)
      const response = await fetch('/api/reservas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ claseId }),
      })

      const data = await response.json()

      if (response.ok) {
        setMensaje('¡Reserva realizada con éxito!')
        // Refrescar la página de mis reservas
        router.refresh()
        // Redirigir a mis reservas después de 2 segundos
        setTimeout(() => {
          router.push('/mis-reservas')
        }, 2000)
      } else {
        setMensaje(data.error || 'Error al realizar la reserva')
      }
    } catch (error) {
      setMensaje('Error al realizar la reserva')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">Calendario de Clases</h1>
      
      {mensaje && (
        <div className={`mb-4 p-4 rounded-md ${
          mensaje.includes('éxito') 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {mensaje}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Seleccionar Fecha</h2>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={es}
            defaultMonth={new Date(2024, 11)}
            className="rounded-md border"
          />
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Clases Disponibles</h2>
          {clasesDisponibles.length === 0 ? (
            <p className="text-gray-600">No hay clases disponibles para esta fecha.</p>
          ) : (
            <div className="space-y-4">
              {clasesDisponibles.map((clase) => (
                <div key={clase.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{clase.nombre}</h3>
                    <p className="text-gray-600">{clase.instructor}</p>
                    <p className="text-gray-600">{format(clase.horario, 'HH:mm')}</p>
                  </div>
                  <Button 
                    onClick={() => handleReserva(clase.id)}
                    disabled={loading}
                  >
                    {loading ? 'Reservando...' : 'Reservar'}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

