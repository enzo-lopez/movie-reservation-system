'use client'
import 'dotenv/config'

import {useEffect, useState} from 'react'
import Link from 'next/link'
import {Card, CardContent, CardHeader} from '@/components/ui/card'
import {Badge} from '@/components/ui/badge'
import { Clock, Calendar } from "lucide-react"

const getGenreColor = (genre: string) => {
  const colors = {
    Crime: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    Drama: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    Adventure: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    Fantasy: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    Action: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    "Sci-Fi": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
    Horror: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  }
  return colors[genre as keyof typeof colors] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
}

type Movie = {
  _id: string
  title: string
  description: string
  poster: string
  genre: string[]
  duration: string
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/movie`)
        if (!response.ok) {
          throw new Error('Error al obtener las películas')
        }
        const data = await response.json()
        setMovies(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  if (loading) {
    return (
      <p>Cargando películas... </p>
      <p className="text-gray-600 dark:text-gray-300">
      Al iniciar por primera vez, el fetch de peliculas demorará aproximadamente 15 segundos</p>
    )
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Películas en Cartelera</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Descubre las mejores películas disponibles en nuestros cines.
            Reserva tus entradas y disfruta la mejor
            experiencia cinematográfica.
          </p>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <Link href={`/movie/${movie._id}`} key={movie._id} className="group">
              <Card className="h-full overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10 transition-all duration-300 group-hover:scale-[1.02] group-hover:border-blue-300 dark:group-hover:border-blue-600">
                <div className="relative overflow-hidden">
                  <img
                    src={movie.poster || "/placeholder.svg?height=400&width=300"}
                    alt={movie.title}
                    className="w-full h-64 sm:h-72 object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=400&width=300"
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <CardHeader className="pb-3">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {movie.title}
                  </h2>
                </CardHeader>

                <CardContent className="pt-0 space-y-4">
                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                    {movie.description}
                  </p>

                  {/* Genres */}
                  <div className="flex flex-wrap gap-1">
                    {movie.genre.slice(0, 2).map((genre) => (
                      <Badge key={genre} className={`text-xs font-medium ${getGenreColor(genre)}`}>
                        {genre}
                      </Badge>
                    ))}
                    {movie.genre.length > 2 && (
                      <Badge className="text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                        +{movie.genre.length - 2}
                      </Badge>
                    )}
                  </div>

                  {/* Duration */}
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{movie.duration}</span>
                  </div>

                  {/* Call to Action */}
                  <div className="pt-2">
                    <div className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-center text-sm font-medium transition-colors group-hover:bg-blue-700 flex items-center justify-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Ver Horarios</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Footer Section */}
        <div className="text-center mt-16 py-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-gray-600 dark:text-gray-400">
            ¿No encuentras la película que buscas?{" "}
            <span className="text-blue-600 dark:text-blue-400 font-medium">Próximamente más estrenos</span>
          </p>
        </div>
      </div>
    </div>
  )
}
