'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Calendar, Clock, User, Download } from 'lucide-react'
import { saveAs } from 'file-saver'

export default function MisReservasPage() {
  const [reservas, setReservas] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' })
  const { data: session } = useSession()

  useEffect(() => {
    const fetchReservas = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch('/api/reservas')
          if (response.ok) {
            const data = await response.json()
            // Modificar las fechas para que sean en diciembre
            const reservasConFechasDiciembre = data.reservas.map(reserva => ({
              ...reserva,
              clase: {
                ...reserva.clase,
                horario: new Date(new Date(reserva.clase.horario).setMonth(11))
              }
            }))
            setReservas(reservasConFechasDiciembre)
          } else {
            setMensaje({ texto: 'Error al obtener las reservas', tipo: 'error' })
          }
        } catch (error) {
          console.error('Error:', error)
          setMensaje({ texto: 'Error al conectar con el servidor', tipo: 'error' })
        } finally {
          setIsLoading(false)
        }
      }
    }

    if (session) {
      fetchReservas()
    } else {
      setIsLoading(false)
    }
  }, [session])

  const cancelarReserva = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      return
    }

    try {
      const response = await fetch(`/api/reservas/${id}`, { 
        method: 'DELETE',
      })

      if (response.ok) {
        setReservas(reservas.filter(reserva => reserva.id !== id))
        setMensaje({ texto: 'Reserva cancelada con éxito', tipo: 'success' })
      } else {
        setMensaje({ texto: 'Error al cancelar la reserva', tipo: 'error' })
      }
    } catch (error) {
      console.error('Error:', error)
      setMensaje({ texto: 'Error al procesar la cancelación', tipo: 'error' })
    }
  }

  const exportarCSV = () => {
    const csvContent = [
      ['Clase', 'Fecha', 'Hora', 'Instructor', 'Estado'],
      ...reservas.map(reserva => [
        reserva.clase.nombre,
        new Date(reserva.clase.horario).toLocaleDateString(),
        new Date(reserva.clase.horario).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reserva.clase.instructor,
        'Confirmada'
      ])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "mis_reservas.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  )

  if (!session) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <h2 className="text-xl font-semibold mb-2">Acceso Restringido</h2>
            <p className="text-gray-600">Debes iniciar sesión para ver tus reservas</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Mis Reservas</h1>
        {reservas.length > 0 && (
          <Button onClick={exportarCSV} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        )}
      </div>
      <p className="text-gray-600 mb-8">Gestiona tus reservas de clases</p>

      {mensaje.texto && (
        <div className={`mb-4 p-4 rounded-md ${
          mensaje.tipo === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {mensaje.texto}
        </div>
      )}

      {reservas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <h2 className="text-xl font-semibold mb-2">No tienes reservas activas</h2>
            <p className="text-gray-600">Explora nuestras clases disponibles y haz tu primera reserva</p>
            <Button className="mt-4" variant="outline" onClick={() => window.location.href = '/clases'}>
              Ver Clases Disponibles
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Reservas Actuales</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Clase</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservas.map((reserva) => (
                  <TableRow key={reserva.id}>
                    <TableCell className="font-medium">{reserva.clase.nombre}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(reserva.clase.horario).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {new Date(reserva.clase.horario).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {reserva.clase.instructor}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-sm bg-green-100 text-green-800">
                        Confirmada
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => cancelarReserva(reserva.id)}
                      >
                        Cancelar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

