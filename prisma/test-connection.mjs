import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Intenta crear un usuario de prueba
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
      },
    })
    console.log('Conexión exitosa:', user)
  } catch (error) {
    console.error('Error de conexión:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()