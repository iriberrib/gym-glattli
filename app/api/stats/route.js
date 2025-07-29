// app/api/stats/route.js
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.rol !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const fecha = searchParams.get('fecha')

    const fechaInicio = new Date(fecha)
    fechaInicio.setHours(0, 0, 0, 0)
    const fechaFin = new Date(fechaInicio)
    fechaFin.setDate(fechaFin.getDate() + 1)

    const clases = await prisma.clase.findMany({
      where: {
        horario: {
          gte: fechaInicio,
          lt: fechaFin,
        },
      },
      include: {
        reservas: true,
      },
    })

    const totalClases = clases.length
    const totalReservas = clases.reduce((sum, clase) => sum + clase.reservas.length, 0)
    const promedioAsistencia = totalClases > 0 
      ? (totalReservas / (totalClases * clases[0]?.capacidad || 1)) * 100 
      : 0

    const clasesData = clases.map(clase => ({
      nombre: clase.nombre,
      reservas: clase.reservas.length,
      capacidad: clase.capacidad,
    }))

    return NextResponse.json({
      totalClases,
      totalReservas,
      promedioAsistencia,
      clasesData,
    })
  } catch (error) {
    console.error('Error al obtener las estadísticas:', error)
    return NextResponse.json(
      { error: 'Error al obtener las estadísticas' },
      { status: 500 }
    )
  }
}