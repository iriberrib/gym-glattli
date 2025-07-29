import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { Dumbbell, Calendar, Users, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <Image
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920&h=600"
          alt="Gimnasio"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            Bienvenido a <span className="text-yellow-500">GymApp</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light">
            Tu destino para un estilo de vida saludable y activo
          </p>
          <Link href="/registro">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105">
              Comienza Ahora
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
            Nuestros Servicios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: Dumbbell, title: "Área de Pesas", description: "Equipo de última generación para tu entrenamiento de fuerza." },
              { icon: Users, title: "Clases Grupales", description: "Participa en nuestras clases de yoga, pilates, spinning y más." },
              { icon: Calendar, title: "Entrenamiento Personal", description: "Alcanza tus objetivos con la guía de nuestros entrenadores expertos." }
            ].map((feature, index) => (
              <Card key={index} className="transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <feature.icon className="w-12 h-12 text-yellow-500 mb-4" />
                  <CardTitle className="text-2xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Próximas Clases Destacadas</CardTitle>
            <CardDescription>No te pierdas nuestras clases más populares</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[
                { name: "Yoga Flow", time: "Lunes, 18:00", instructor: "Ana García" },
                { name: "CrossFit", time: "Martes, 19:30", instructor: "Carlos Ruiz" },
                { name: "Zumba", time: "Miércoles, 20:00", instructor: "Laura Sánchez" },
              ].map((clase, index) => (
                <li key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{clase.name}</p>
                    <p className="text-sm text-muted-foreground">{clase.time} - {clase.instructor}</p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/clases">
                      Reservar
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900">
              <Link href="/clases">Ver Todas las Clases</Link>
            </Button>
          </CardFooter>
        </Card>
      </section>

          {/* CTA Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            ¿Listo para comenzar tu viaje?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Únete a nuestra comunidad y transforma tu vida hoy mismo. Descubre todo lo que GymApp tiene para ofrecerte.
          </p>
          <Link href="/login">
            <Button size="lg" variant="secondary" className="font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105">
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}