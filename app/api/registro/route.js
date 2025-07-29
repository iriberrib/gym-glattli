import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const body = await request.json()
    console.log('Datos recibidos:', body)

    const { nombre, email, password } = body

    if (!nombre || !email || !password) {
      console.log('Campos faltantes:', { nombre, email, password })
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await prisma.user.findUnique({
      where: { email },
    })

    if (usuarioExistente) {
      return NextResponse.json({ error: 'El usuario ya existe' }, { status: 400 })
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear el nuevo usuario
    const nuevoUsuario = await prisma.user.create({
      data: {
        name: nombre,  // Usamos 'nombre' del body pero lo asignamos a 'name' en la base de datos
        email,
        password: hashedPassword,
      },
    })

    // Omitir la contraseña en la respuesta
    const { password: _, ...usuarioSinPassword } = nuevoUsuario

    return NextResponse.json({ message: 'Usuario registrado con éxito', usuario: usuarioSinPassword }, { status: 201 })
  } catch (error) {
    console.error('Error al registrar usuario:', error)
    return NextResponse.json({ error: 'Error al registrar usuario', details: error.message }, { status: 500 })
  }
}