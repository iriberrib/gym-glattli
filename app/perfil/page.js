'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function PerfilPage() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    direccion: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { data: session, update } = useSession()
  const router = useRouter()

  useEffect(() => {
    const loadUserData = async () => {
      if (!session?.user?.email) {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch('/api/perfil')
        if (!response.ok) {
          throw new Error('Error al cargar los datos')
        }
        const data = await response.json()
        setUserData(data)
      } catch (err) {
        setError("No se pudieron cargar los datos del usuario")
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      loadUserData()
    } else {
      router.push('/login')
    }
  }, [session, router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/perfil', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          direccion: userData.direccion
        }),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar el perfil')
      }

      const result = await response.json()
      setSuccess("Perfil actualizado correctamente")
      
      if (result.name !== session.user.name) {
        await update({
          ...session,
          user: {
            ...session.user,
            name: result.name
          }
        })
      }
    } catch (err) {
      setError("No se pudo actualizar el perfil")
    } finally {
      setIsLoading(false)
    }
  }

  if (!session) return null

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Cargando perfil...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Mi Perfil ;)</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-md">
              {success}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                name="name"
                value={userData.name || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={userData.email || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                name="direccion"
                value={userData.direccion || ''}
                onChange={handleChange}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Actualizando...' : 'Actualizar Perfil'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}