'use client'

import {useState, useEffect} from 'react'
import {CrudTable} from '../components/crud-table'

interface CinemaRoom {
  _id: string
  movie: {
    _id: string
    title: string
  }
  date: string
  time: string
  seats: {
    row: string
    numberSeat: number
    isAvaible: boolean
    _id: string
  }[]
  __v: number
}

export default function CinemaRoomsPage() {
  const [rooms, setRooms] = useState<CinemaRoom[]>([])

  const columns = [
    {key: 'movie' as const, label: 'Movie'},
    {key: 'date' as const, label: 'Date'},
    {key: 'time' as const, label: 'Time'},
  ]

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/cinema-room/all`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        if (!response.ok) {
          throw new Error('Error fetching cinema rooms')
        }
        const data = await response.json()
        setRooms(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
        setRooms([])
      }
    }
    fetchRooms()
  }, [])

  // Renderizado personalizado para las columnas
  const renderItem = (room: CinemaRoom, columnKey: keyof CinemaRoom) => {
    if (columnKey === 'movie') {
      return room.movie?.title || ''
    }
    if (columnKey === 'date') {
      return room.date.split('T')[0]
    }
    return (room as any)[columnKey]
  }

  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-bold'>Cinema Rooms</h2>
      <div className='border rounded-lg'>
        <table className='w-full'>
          <thead>
            <tr>
              {columns.map(column => (
                <th key={column.key} className='p-2 text-left'>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rooms.map(room => (
              <tr key={room._id}>
                {columns.map(column => (
                  <td key={column.key} className='p-2'>
                    {renderItem(room, column.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
