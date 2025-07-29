import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET(request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const reservas = await prisma.reserva.findMany({
      where: {
        usuarioId: session.user.id,
      },
      include: {
        clase: true,
      },
    })

    return NextResponse.json(reservas)
  } catch (error) {
    console.error('Error al obtener las reservas:', error)
    return NextResponse.json({ error: 'Error al obtener las reservas' }, { status: 500 })
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { claseId } = await request.json()

  try {
    const clase = await prisma.clase.findUnique({
      where: { id: claseId },
      include: { reservas: true },
    })

    if (!clase) {
      return NextResponse.json({ error: 'Clase no encontrada' }, { status: 404 })
    }

    if (clase.reservas.length >= clase.capacidadMaxima) {
      return NextResponse.json({ error: 'La clase está llena' }, { status: 400 })
    }

    const reserva = await prisma.reserva.create({
      data: {
        usuarioId: session.user.id,
        claseId: claseId,
        fecha: new Date(),
      },
    })

    return NextResponse.json(reserva)
  } catch (error) {
    console.error('Error al crear la reserva:', error)
    return NextResponse.json({ error: 'Error al crear la reserva' }, { status: 500 })
  }
}