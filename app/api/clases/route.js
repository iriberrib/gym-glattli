import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const fecha = searchParams.get('fecha')

    let whereClause = {}
    if (fecha) {
      const fechaInicio = new Date(fecha)
      fechaInicio.setHours(0, 0, 0, 0)
      const fechaFin = new Date(fechaInicio)
      fechaFin.setDate(fechaFin.getDate() + 1)

      whereClause = {
        horario: {
          gte: fechaInicio,
          lt: fechaFin,
        },
      }
    }

    const clases = await prisma.clase.findMany({
      where: whereClause,
      include: {
        reservas: true,
      },
      orderBy: {
        horario: 'asc',
      },
    })

    // Si no hay clases, crear algunas de ejemplo
    if (clases.length === 0 && !fecha) {
      const clasesEjemplo = [
        {
          nombre: 'Yoga',
          instructor: 'Ana García',
          horario: new Date(Date.now() + 24 * 60 * 60 * 1000),
          capacidad: 15,
        },
        {
          nombre: 'Spinning',
          instructor: 'Carlos Ruiz',
          horario: new Date(Date.now() + 48 * 60 * 60 * 1000),
          capacidad: 20,
        },
        {
          nombre: 'Pilates',
          instructor: 'María López',
          horario: new Date(Date.now() + 72 * 60 * 60 * 1000),
          capacidad: 12,
        },
        {
          nombre: 'Zumba',
          instructor: 'David Martínez',
          horario: new Date(Date.now() + 96 * 60 * 60 * 1000),
          capacidad: 25,
        },
        {
          nombre: 'CrossFit',
          instructor: 'Laura Sánchez',
          horario: new Date(Date.now() + 120 * 60 * 60 * 1000),
          capacidad: 15,
        }
      ]

      await prisma.clase.createMany({
        data: clasesEjemplo,
      })

      const clasesCreadas = await prisma.clase.findMany({
        include: {
          reservas: true,
        },
        orderBy: {
          horario: 'asc',
        },
      })

      return NextResponse.json(clasesCreadas)
    }

    return NextResponse.json(clases)
  } catch (error) {
    console.error('Error al obtener las clases:', error)
    return NextResponse.json(
      { error: 'Error al obtener las clases' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    const { nombre, instructor, horario, capacidad } = data

    const nuevaClase = await prisma.clase.create({
      data: {
        nombre,
        instructor,
        horario: new Date(horario),
        capacidad: parseInt(capacidad),
      },
      include: {
        reservas: true,
      },
    })

    return NextResponse.json(nuevaClase, { status: 201 })
  } catch (error) {
    console.error('Error al crear la clase:', error)
    return NextResponse.json(
      { error: 'Error al crear la clase' },
      { status: 500 }
    )
  }
}