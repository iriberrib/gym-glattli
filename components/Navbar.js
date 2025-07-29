'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Menu, User, Calendar, BookOpen, LogOut } from 'lucide-react'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">
            GymApp
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="hover:text-gray-300">
              Inicio
            </Link>
            <Link href="/clases" className="hover:text-gray-300">
              Clases
            </Link>
            <Link href="/calendario" className="hover:text-gray-300">
              Calendario
            </Link>
            {session ? (
              <>
                <Link href="/mis-reservas" className="hover:text-gray-300">
                  Mis Reservas
                </Link>
                <Link href="/perfil" className="flex items-center space-x-1">
                  <User size={24} />
                  <span className="sr-only">Perfil</span>
                </Link>
                <Button
                  variant="ghost"
                  className="hover:text-gray-300"
                  onClick={() => signOut()}
                >
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="secondary">Iniciar Sesión</Button>
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/">
                    <BookOpen className="mr-2 h-4 w-4" /> Inicio
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/clases">
                    <Calendar className="mr-2 h-4 w-4" /> Clases
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/calendario">
                    <Calendar className="mr-2 h-4 w-4" /> Calendario
                  </Link>
                </DropdownMenuItem>
                {session ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/mis-reservas">
                        <BookOpen className="mr-2 h-4 w-4" /> Mis Reservas
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/perfil" className="flex items-center space-x-1">
                        <User size={24} />
                        <span className="sr-only">Perfil</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link href="/login">
                      <User className="mr-2 h-4 w-4" /> Iniciar Sesión
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}