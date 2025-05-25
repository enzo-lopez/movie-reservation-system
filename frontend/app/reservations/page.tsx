'use client'

import {useEffect, useState} from 'react'
import {useAppContext} from '../contexts/AppContext'
import {useRouter} from 'next/navigation'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'

interface Reservation {
  id: string
  movieTitle: string
  date: string
  time: string
  seats: string[]
}

export default function ReservationsPage() {
  const {user} = useAppContext()
  const router = useRouter()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    const fetchReservations = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reservation`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Token JWT
          },
        })

        if (!response.ok) {
          throw new Error('Error al obtener las reservas')
        }

        const data = await response.json()
        setReservations(
          data.reservations.map((reservation: any) => ({
            id: reservation.reservationId,
            movieTitle: reservation.movieName,
            date: reservation.date,
            time: reservation.time,
            seats: reservation.seats.map(
              (seat: {row: string; numberSeat: number}) =>
                `${seat.row}${seat.numberSeat}`
            ),
          }))
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchReservations()
  }, [user, router])

  if (!user) {
    return null // Redirige al login si no hay usuario
  }

  if (loading) {
    return <div>Cargando reservas...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6'>Mis Reservas</h1>
      {reservations.length === 0 ? (
        <p>No tienes reservas.</p>
      ) : (
        <div className='grid gap-4'>
          {reservations.map(reservation => (
            <Card key={reservation.id}>
              <CardHeader>
                <CardTitle>{reservation.movieTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid gap-2'>
                  <p>Fecha: {reservation.date}</p>
                  <p>Hora: {reservation.time}</p>
                  <p>Asientos: {reservation.seats.join(', ')}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
