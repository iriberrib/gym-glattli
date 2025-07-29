import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'

// Initialize PrismaClient
let prisma

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    if (!prisma.user) {
      throw new Error('El modelo "User" no está definido en Prisma')
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        name: true,
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
      { error: 'Error al obtener el usuario: ' + error.message }, 
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    if (!prisma.user) {
      throw new Error('El modelo "User" no está definido en Prisma')
    }

    const data = await request.json()
    const { name, direccion } = data

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        direccion,
      },
      select: {
        name: true,
        email: true,
        direccion: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error al actualizar el usuario:', error)
    return NextResponse.json(
      { error: 'Error al actualizar el usuario: ' + error.message }, 
      { status: 500 }
    )
  }
}