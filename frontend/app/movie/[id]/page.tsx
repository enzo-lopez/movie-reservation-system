'use client'

import {useEffect, useState} from 'react'
import {useParams, useRouter} from 'next/navigation'
import {useAppContext} from '../../contexts/AppContext'
import {Button} from '@/components/ui/button'
import {format, addDays} from 'date-fns'
import {es} from 'date-fns/locale'

export default function MovieDetails() {
  const {id} = useParams() // Obtén el parámetro dinámico `id` de la URL
  const router = useRouter()
  const {user} = useAppContext()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTime, setSelectedTime] = useState('')
  const [movie, setMovie] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/movie/${id}`
        )
        if (!response.ok) {
          throw new Error('Error al obtener los detalles de la película')
        }
        const data = await response.json()
        setMovie(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchMovie()
    }
  }, [id])

  const dates = Array.from({length: 5}, (_, i) => addDays(new Date(), i))

  const handleBooking = () => {
    if (user && movie) {
      const bookingData = {
        movie: movie.title, 
        date: format(selectedDate, 'yyyy-MM-dd'), 
        time: selectedTime, 
      }
      router.push(
        `/booking/${movie._id}?${new URLSearchParams(bookingData).toString()}`
      )
    } else {
      router.push('/login')
    }
  }

  if (loading) {
    return <div>Cargando película...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!movie) {
    return <div>No se encontró la película.</div>
  }

  return (
    <div className='flex flex-col md:flex-row gap-8'>
      <div className='w-full md:w-1/3'>
        <img
          src={movie.poster || '/placeholder.svg'}
          alt={movie.title}
          className='w-full h-auto rounded-lg shadow-md'
          onError={e => {
            e.currentTarget.src = `/placeholder.svg?height=346&width=300`
          }}
        />
      </div>
      <div className='w-full md:w-2/3'>
        <h1 className='text-3xl font-bold mb-4'>{movie.title}</h1>
        <div className='flex space-x-4 mb-4 text-sm text-gray-600 dark:text-gray-400'>
          <span>
            {Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}
          </span>
          <span>•</span>
          <span>{movie.duration}</span>
        </div>
        <p className='mb-6'>{movie.description}</p>
        <h2 className='text-2xl font-semibold mb-4'>Fechas y Horarios</h2>
        <div className='flex space-x-2 mb-4 overflow-x-auto'>
          {dates.map(date => (
            <Button
              key={date.toISOString()}
              variant={
                selectedDate.toDateString() === date.toDateString()
                  ? 'default'
                  : 'outline'
              }
              onClick={() => setSelectedDate(date)}
            >
              {format(date, 'd MMM', {locale: es})}
            </Button>
          ))}
        </div>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
          {(
            movie.showtimes || [
              {id: 1, time: '12:00'},
              {id: 2, time: '15:30'},
              {id: 3, time: '19:00'},
            ]
          ).map((showtime: any) => (
            <Button
              key={showtime.id}
              variant={selectedTime === showtime.time ? 'default' : 'outline'}
              onClick={() => setSelectedTime(showtime.time)}
            >
              {showtime.time}
            </Button>
          ))}
        </div>
        <Button
          className='mt-6'
          onClick={handleBooking}
          disabled={!selectedTime}
        >
          Reservar
        </Button>
      </div>
    </div>
  )
}
