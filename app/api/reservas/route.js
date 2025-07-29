import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { claseId } = body

    if (!claseId) {
      return NextResponse.json({ error: 'Se requiere el ID de la clase' }, { status: 400 })
    }

    // Verificar si la clase existe y tiene capacidad
    const clase = await prisma.clase.findUnique({
      where: { id: Number(claseId) },
      include: { reservas: true },
    })

    if (!clase) {
      return NextResponse.json({ error: 'Clase no encontrada' }, { status: 404 })
    }

    if (clase.reservas.length >= clase.capacidad) {
      return NextResponse.json({ error: 'La clase está llena' }, { status: 400 })
    }

    // Verificar si el usuario ya tiene una reserva para esta clase
    const reservaExistente = await prisma.reserva.findFirst({
      where: {
        userId: session.user.id,
        claseId: Number(claseId),
      },
    })

    if (reservaExistente) {
      return NextResponse.json(
        { error: 'Ya tienes una reserva para esta clase' },
        { status: 400 }
      )
    }

    // Crear la reserva
    const nuevaReserva = await prisma.reserva.create({
      data: {
        userId: session.user.id,
        claseId: Number(claseId),
      },
      include: {
        clase: true,
        user: true,
      },
    })

    return NextResponse.json(
      { 
        message: 'Reserva creada con éxito',
        reserva: {
          id: nuevaReserva.id,
          claseId: nuevaReserva.claseId,
          userId: nuevaReserva.userId,
          createdAt: nuevaReserva.createdAt,
          clase: nuevaReserva.clase
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error al crear la reserva:', error)
    return NextResponse.json(
      { error: 'Error al crear la reserva' },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const reservas = await prisma.reserva.findMany({
      where: { userId: session.user.id },
      include: {
        clase: true,
      },
    })

    return NextResponse.json({ reservas })
  } catch (error) {
    console.error('Error al obtener las reservas:', error)
    return NextResponse.json(
      { error: 'Error al obtener las reservas' },
      { status: 500 }
    )
  }
}