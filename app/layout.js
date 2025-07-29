import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]/route'
import SessionProvider from '@/components/SessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'GymApp',
  description: 'Aplicación de reservas para gimnasio',
}

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="es">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <Navbar />
          <main className="container mx-auto mt-8 px-4">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  )
}