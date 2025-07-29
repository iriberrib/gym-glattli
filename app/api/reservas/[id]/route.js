import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function DELETE(request, { params }) {
  const { id } = params

  try {
    await prisma.reserva.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json({ message: 'Reserva cancelada con éxito' })
  } catch (error) {
    console.error('Error al cancelar la reserva:', error)
    return NextResponse.json({ error: 'Error al cancelar la reserva: ' + error.message }, { status: 500 })
  }
}