import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, User, Info } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function ClaseCard({ clase, session, onReservaRealizada }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleReserva = async () => {
    if (!session) {
      alert("Debes iniciar sesión para hacer una reserva")
      return
    }

    try {
      const response = await fetch('/api/reservas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ claseId: clase.id }),
      })

      const data = await response.json()

      if (response.ok) {
        onReservaRealizada({
          ...clase,
          reservas: [...clase.reservas, data.reserva]
        })
      } else {
        alert(data.error || "Error al realizar la reserva")
      }
    } catch (error) {
      console.error('Error:', error)
      alert("Error al procesar la reserva")
    }
  }

  const formatearFecha = (fecha) => {
    // Asumimos que la fecha viene como string. La convertimos a objeto Date
    const fechaObj = new Date(fecha)
    // Forzamos el mes a diciembre (11 porque los meses en JavaScript van de 0 a 11)
    fechaObj.setMonth(11)
    return fechaObj.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatearHora = (fecha) => {
    return new Date(fecha).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const generarDescripcion = () => {
    const descripciones = [
      "Una clase energética que combina ejercicios cardiovasculares y de fuerza.",
      "Perfecta para principiantes, esta clase se enfoca en técnicas básicas y respiración.",
      "Desafía tus límites con esta intensa sesión de entrenamiento funcional.",
      "Mejora tu flexibilidad y equilibrio con esta clase de bajo impacto.",
      "Una experiencia de fitness completa que trabaja todo el cuerpo."
    ]
    return descripciones[Math.floor(Math.random() * descripciones.length)]
  }

  const generarDetalles = () => {
    return {
      nivelDificultad: ['Principiante', 'Intermedio', 'Avanzado'][Math.floor(Math.random() * 3)],
      equipoNecesario: ['Ninguno', 'Esterilla', 'Pesas ligeras', 'Bandas elásticas'][Math.floor(Math.random() * 4)],
      beneficios: ['Mejora cardiovascular', 'Tonificación muscular', 'Aumento de flexibilidad', 'Reducción de estrés'][Math.floor(Math.random() * 4)]
    }
  }

  const detalles = generarDetalles()

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="bg-primary/5">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl mb-2">{clase.nombre}</CardTitle>
            <CardDescription>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {clase.instructor}
              </div>
            </CardDescription>
          </div>
          <Badge variant={clase.reservas.length >= clase.capacidad ? "destructive" : "secondary"}>
            {clase.reservas.length >= clase.capacidad ? 'Completa' : 'Disponible'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            {formatearFecha(clase.horario)}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            {formatearHora(clase.horario)}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            {clase.reservas.length} / {clase.capacidad} plazas ocupadas
          </div>
          <div className="flex justify-between items-center pt-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Info className="h-4 w-4 mr-2" />
                  Detalles
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{clase.nombre}</DialogTitle>
                  <DialogDescription>
                    {generarDescripcion()}
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4 space-y-2">
                  <p><strong>Instructor:</strong> {clase.instructor}</p>
                  <p><strong>Fecha:</strong> {formatearFecha(clase.horario)}</p>
                  <p><strong>Hora:</strong> {formatearHora(clase.horario)}</p>
                  <p><strong>Nivel de dificultad:</strong> {detalles.nivelDificultad}</p>
                  <p><strong>Equipo necesario:</strong> {detalles.equipoNecesario}</p>
                  <p><strong>Beneficios principales:</strong> {detalles.beneficios}</p>
                </div>
              </DialogContent>
            </Dialog>
            <Button 
              onClick={handleReserva}
              disabled={clase.reservas.length >= clase.capacidad}
              className="w-auto"
              variant={clase.reservas.length >= clase.capacidad ? "secondary" : "default"}
            >
              {clase.reservas.length >= clase.capacidad ? 'Clase Completa' : 'Reservar Plaza'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}