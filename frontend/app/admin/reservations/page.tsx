'use client'

import {useState, useEffect} from 'react'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {format} from 'date-fns'

interface Seat {
  row: string
  numberSeat: number
  isAvaible: boolean
  _id: string
}

interface Reservation {
  _id: string
  username: string
  movieName: string
  date: string
  time: string
  seats: Seat[]
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingReservation, setEditingReservation] =
    useState<Reservation | null>(null)
  const [formData, setFormData] = useState<Partial<Reservation>>({})

  const columns = [
    {key: 'username' as const, label: 'Username'},
    {key: 'movieName' as const, label: 'Movie'},
    {key: 'dateTime' as const, label: 'Date & Time'},
    {key: 'seats' as const, label: 'Seats'},
  ]

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/reservation/all`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        if (!response.ok) {
          throw new Error('Error fetching reservations')
        }
        const data = await response.json()
        setReservations(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
        alert('Error fetching reservations')
        setReservations([]) // Asegura que siempre sea un array
      }
    }
    fetchReservations()
  }, [])

  const handleEdit = (id: string, updatedReservation: Partial<Reservation>) => {
    setReservations(
      reservations.map(reservation =>
        reservation._id === id
          ? {
              ...reservation,
              date: updatedReservation.date || reservation.date,
              time: updatedReservation.time || reservation.time,
            }
          : reservation
      )
    )
  }

  const handleDelete = (id: string) => {
    const deleteReservation = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/reservation/${id}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        if (!response.ok) {
          throw new Error('Error deleting reservation')
        }
      } catch (err) {
        console.error(err)
        alert('Error deleting reservation')
      }
    }
    deleteReservation()
    setReservations(reservations.filter(reservation => reservation._id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingReservation) {
      handleEdit(editingReservation._id, formData)
    }
    setFormData({})
    setEditingReservation(null)
    setIsDialogOpen(false)
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold'>Reservations</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingReservation(null)
                setFormData({})
              }}
              disabled
            >
              Add New
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingReservation ? 'Edit' : 'Add'} Reservation
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Username
                </label>
                <Input value={formData.username || ''} disabled />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Movie Name
                </label>
                <Input value={formData.movieName || ''} disabled />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>Date</label>
                <Input
                  type='date'
                  value={formData.date ? formData.date.split('T')[0] : ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      date: new Date(e.target.value).toISOString(),
                    })
                  }
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>Time</label>
                <Input
                  type='time'
                  value={formData.time || ''}
                  onChange={e =>
                    setFormData({...formData, time: e.target.value})
                  }
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>Seats</label>
                <Input
                  value={formData.seats ? JSON.stringify(formData.seats) : ''}
                  disabled
                />
              </div>
              <Button type='submit'>
                {editingReservation ? 'Update' : 'Add'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className='border rounded-lg'>
        <table className='w-full'>
          <thead>
            <tr>
              {columns.map(column => (
                <th key={column.key} className='p-2 text-left'>
                  {column.label}
                </th>
              ))}
              <th className='p-2 text-left'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(reservation => (
              <tr key={reservation._id}>
                <td className='p-2'>{reservation.username}</td>
                <td className='p-2'>{reservation.movieName}</td>
                <td className='p-2'>
                  {format(new Date(reservation.date), 'yyyy-MM-dd')}{' '}
                  {reservation.time}
                </td>
                <td className='p-2'>
                  {reservation.seats
                    .map(seat => `${seat.row}${seat.numberSeat}`)
                    .join(', ')}
                </td>
                <td className='p-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      setEditingReservation(reservation)
                      setFormData(reservation)
                      setIsDialogOpen(true)
                    }}
                    className='mr-2'
                    disabled
                  >
                    Edit
                  </Button>
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={() => handleDelete(reservation._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
