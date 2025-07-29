'use client'

import { useState } from 'react'
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

const reservasIniciales = [
  {
    id: 1,
    clase: "Yoga",
    fecha: "2024-01-20",
    hora: "9:00",
    instructor: "Ana García",
    estado: "Confirmada"
  },
  {
    id: 2,
    clase: "Spinning",
    fecha: "2024-01-22",
    hora: "7:00",
    instructor: "Carlos Ruiz",
    estado: "Pendiente"
  },
  {
    id: 3,
    clase: "Pilates",
    fecha: "2024-01-24",
    hora: "18:00",
    instructor: "María López",
    estado: "Confirmada"
  }
]

export default function ReservaCard() {
  const [reservas, setReservas] = useState(reservasIniciales)

  const cancelarReserva = (id) => {
    setReservas(reservas.filter(reserva => reserva.id !== id))
  }

  return (
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
                <TableCell className="font-medium">{reserva.clase}</TableCell>
                <TableCell>{reserva.fecha}</TableCell>
                <TableCell>{reserva.hora}</TableCell>
                <TableCell>{reserva.instructor}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    reserva.estado === 'Confirmada' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {reserva.estado}
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
  )
}