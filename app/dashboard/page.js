'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Activity, CalendarIcon, Users, Clock } from 'lucide-react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    proximasClases: [],
    totalReservas: 0,
    clasesDisponibles: 0
  })
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 11, 20)) // Diciembre 20, 2024
  const [isLoading, setIsLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/clases')
        if (response.ok) {
          const clases = await response.json()
          
          // Filtrar clases próximas (próximos 7 días)
          const ahora = new Date(2024, 11, 20) // Forzar a diciembre 20, 2024
          const proximasClases = clases.filter(clase => {
            const fechaClase = new Date(clase.horario)
            // Asegurarse que la fecha de la clase esté en diciembre
            fechaClase.setMonth(11)
            return fechaClase > ahora && fechaClase < new Date(ahora.getTime() + 7 * 24 * 60 * 60 * 1000)
          })

          // Calcular estadísticas
          const clasesDisponibles = clases.filter(clase => 
            clase.reservas.length < clase.capacidad
          ).length

          const totalReservas = clases.reduce((total, clase) => 
            total + clase.reservas.length, 0
          )

          setStats({
            proximasClases,
            totalReservas,
            clasesDisponibles
          })
        }
      } catch (error) {
        console.error('Error al obtener estadísticas:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const formatearFecha = (fecha) => {
    const fechaObj = new Date(fecha)
    fechaObj.setMonth(11) // Forzar a diciembre
    return format(fechaObj, "dd 'de' MMMM 'a las' HH:mm", { locale: es })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clases Disponibles</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.clasesDisponibles}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reservas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReservas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximas Clases</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.proximasClases.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Calendario</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              locale={es}
              defaultMonth={new Date(2024, 11)} // Diciembre 2024
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximas Clases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.proximasClases.length === 0 ? (
                <p className="text-muted-foreground">No hay clases próximas programadas</p>
              ) : (
                stats.proximasClases.map((clase) => (
                  <div
                    key={clase.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold">{clase.nombre}</h3>
                      <p className="text-sm text-muted-foreground">{clase.instructor}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatearFecha(clase.horario)}
                      </p>
                    </div>
                    <div className="text-sm">
                      {clase.reservas.length} / {clase.capacidad}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}