'use client'

import {useState, useEffect} from 'react'
import {CrudTable} from '../components/crud-table'

interface User {
  id: string
  username: string
  email: string
  role: 'USER' | 'ADMIN'
  password: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error('Error al obtener los usuarios')
        }

        const data = await response.json()
        setUsers(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const columns = [
    {key: 'username' as const, label: 'Username'},
    {key: 'email' as const, label: 'Email'},
    {key: 'role' as const, label: 'Role'},
  ]

  const handleAdd = async (user: Partial<User>) => {
    try {
      console.log('Adding user:', user)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(user),
        }
      )

      if (!response.ok) {
        throw new Error('Error al agregar el usuario')
      }

      const newUser = await response.json()
      setUsers([...users, newUser.usuario])
    } catch (err) {
      console.error(err)
      alert('Error al agregar el usuario')
    }
  }

  const handleEdit = async (id: string, updatedUser: Partial<User>) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(updatedUser),
        }
      )

      if (!response.ok) {
        throw new Error('Error al editar el usuario')
      }

      const updatedUserData = await response.json()
      setUsers(users.map(user => (user.id === id ? updatedUserData : user)))
    } catch (err) {
      console.error(err)
      alert('Error al editar el usuario')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Error al eliminar el usuario')
      }

      setUsers(users.filter(user => user.id !== id))
    } catch (err) {
      console.error(err)
      alert('Error al eliminar el usuario')
    }
  }

  if (loading) {
    return <p>Cargando usuarios...</p>
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  return (
    <CrudTable
      title='Users'
      items={users}
      columns={columns}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  )
}
