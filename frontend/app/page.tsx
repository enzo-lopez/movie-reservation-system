'use client'
import 'dotenv/config'

import {useEffect, useState} from 'react'
import Link from 'next/link'
import {Card, CardContent} from '@/components/ui/card'

export default function Home() {
  const [movies, setMovies] = useState([])
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
    return <p>Cargando películas...</p>
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  return (
    <div>
      <h1 className='text-3xl font-bold mb-6'>Películas en Cartelera</h1>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {movies.map((movie: any) => (
          <Link href={`/movie/${movie._id}`} key={movie._id}>
            <Card className='hover:shadow-lg transition-shadow'>
              <CardContent className='p-4'>
                <img
                  src={movie.poster || '/placeholder.svg'}
                  alt={movie.title}
                  className='w-full h-auto mb-2'
                />
                <h2 className='text-lg font-semibold'>{movie.title}</h2>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
