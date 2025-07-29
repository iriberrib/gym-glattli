import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const userId = params.id
    if (!userId) {
      return NextResponse.json({ error: 'ID de usuario no proporcionado' }, { status: 400 })
    }

    const user = await prisma.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nombre: true,
        email: true,
        direccion: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error al obtener el usuario:', error)
    return NextResponse.json(
      { error: 'Error al obtener el usuario' }, 
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const userId = params.id
    if (!userId) {
      return NextResponse.json({ error: 'ID de usuario no proporcionado' }, { status: 400 })
    }

    const data = await request.json()
    const { nombre, email, direccion } = data

    const updatedUser = await prisma.usuario.update({
      where: { id: userId },
      data: {
        nombre,
        email,
        direccion,
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        direccion: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error al actualizar el usuario:', error)
    return NextResponse.json(
      { error: 'Error al actualizar el usuario' }, 
      { status: 500 }
    )
  }
}