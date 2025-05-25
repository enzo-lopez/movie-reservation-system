'use client'

import {useState, useEffect} from 'react'
import {useParams, useRouter, useSearchParams} from 'next/navigation'
import {useAppContext} from '../../contexts/AppContext'
import {Button} from '@/components/ui/button'
import {format, addDays} from 'date-fns'

interface Seat {
  row: string
  numberSeat: number
  isAvaible: boolean
}

const rows = ['A', 'B', 'C', 'D', 'E'] // Define las filas
const seatsPerRow = 7 // Define el número de columnas por fila

const generateSeats = (): Seat[] => {
  const seats: Seat[] = []

  rows.forEach(row => {
    for (let numberSeat = 1; numberSeat <= seatsPerRow; numberSeat++) {
      seats.push({row, numberSeat, isAvaible: true})
    }
  })

  return seats
}

export default function Booking() {
  const params = useParams()
  const {movieId} = params
  const searchParams = useSearchParams()
  const movieName = searchParams.get('movie')
  const initialDate = searchParams.get('date')
  const initialTime = searchParams.get('time')

  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([])
  const [selectedDate, setSelectedDate] = useState<string>(initialDate || '') // Inicializa con el valor de los parámetros
  const [selectedTime, setSelectedTime] = useState<string>(initialTime || '') // Inicializa con el valor de los parámetros
  const [seats, setSeats] = useState<Seat[]>([])
  const {user} = useAppContext()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  useEffect(() => {
    const fetchSeats = async () => {
      if (!selectedDate || !selectedTime || !movieId) return
      try {
        const params = new URLSearchParams({
          date: selectedDate,
          time: selectedTime,
          movie: Array.isArray(movieId) ? movieId[0] : movieId,
        })
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/cinema-room/?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        if (response.ok) {
          const data = await response.json()
          setSeats(data.cinemaRoom.seats || [])
        } else {
          setSeats([]) // fallback
        }
      } catch (e) {
        setSeats([])
      }
    }

    fetchSeats()
  }, [selectedDate, selectedTime, movieId])

  const toggleSeat = (seat: Seat) => {
    if (
      selectedSeats.some(
        s => s.row === seat.row && s.numberSeat === seat.numberSeat
      )
    ) {
      setSelectedSeats(
        selectedSeats.filter(
          s => s.row !== seat.row || s.numberSeat !== seat.numberSeat
        )
      )
    } else {
      setSelectedSeats([...selectedSeats, {...seat, isAvaible: false}])
    }
  }

  const handleBooking = async () => {
    if (!user) {
      alert('Debes iniciar sesión para realizar una reserva.')
      router.push('/login')
      return
    }

    const reservationData = {
      user: user.id,
      movieId: movieId,
      movie: movieId,
      date: selectedDate,
      time: selectedTime,
      seats: selectedSeats,
    }

    try {
       const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reservation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Token JWT
        },
        body: JSON.stringify(reservationData),
      })

      if (response.ok) {
        const result = await response.json()
        router.push(
          `/reservation-success?${new URLSearchParams({
            movieName: result.movieName,
            date: format(addDays(new Date(result.date), 1), 'yyyy-MM-dd'),
            time: result.time,
            seats: JSON.stringify(result.seats), // Serializa el array de asientos como JSON
          }).toString()}`
        )
      } else {
        console.error('Error al crear la reserva: ', response.statusText)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div>
      <h1 className='text-3xl font-bold mb-6'>{movieName || 'Película'}</h1>{' '}
      {/* Muestra el nombre de la película */}
      <div className='flex items-center gap-4 mb-4'>
        {' '}
        {/* Muestra fecha y hora en la misma fila */}
        <div>
          <label className='block text-sm font-medium mb-1'>Fecha</label>
          <input
            type='date'
            className='border rounded p-2'
            value={selectedDate} // Asegúrate de que sea un valor válido
            onChange={e => setSelectedDate(e.target.value)}
            disabled
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-1'>Hora</label>
          <input
            type='time'
            className='border rounded p-2'
            value={selectedTime} // Asegúrate de que sea un valor válido
            onChange={e => setSelectedTime(e.target.value)}
            disabled
          />
        </div>
      </div>
      <div className='space-y-4 mb-6'>
        {rows.map(row => (
            <div key={row} className='flex justify-center gap-4'>
            {seats
              .filter(seat => seat.row === row)
              .map(seat => (
              <Button
                key={`${seat.row}${seat.numberSeat}`}
                disabled={!seat.isAvaible}
                variant={
                selectedSeats.some(
                  s =>
                  s.row === seat.row && s.numberSeat === seat.numberSeat
                )
                  ? 'default'
                  : 'outline'
                }
                onClick={() => toggleSeat(seat)}
                className={!seat.isAvaible ? 'text-red-600' : ''}
              >
                {seat.row}
                {seat.numberSeat}
              </Button>
              ))}
            </div>
        ))}
      </div>
      <div className='mb-4'>
        <h2 className='text-xl font-semibold'>Asientos seleccionados:</h2>
        <p>
          {selectedSeats
            .map(seat => `${seat.row}${seat.numberSeat}`)
            .join(', ') || 'Ninguno'}
        </p>
      </div>
      <Button onClick={handleBooking} disabled={selectedSeats.length === 0}>
        Reservar
      </Button>
    </div>
  )
}
