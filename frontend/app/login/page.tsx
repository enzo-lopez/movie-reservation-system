'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {useAppContext} from '../contexts/AppContext'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const {login} = useAppContext()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({email: username, password}),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al iniciar sesión')
      }

      const data = await response.json()

      login({
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role,
      })
      localStorage.setItem('token', data.token)
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    }
  }

  // Función para login rápido como admin
  const handleAdminLogin = async () => {
    setError(null)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({email: 'admin@admin.com', password: 'admin'}),
        }
      )
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al iniciar sesión como admin')
      }
      const data = await response.json()
      login({
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role,
      })
      localStorage.setItem('token', data.token)
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    }
  }

  // Función para login rápido como invitado
  const handleGuestLogin = async () => {
    setError(null)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({email: 'invitado@invitado.com', password: 'invitado'}),
        }
      )
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.error || 'Error al iniciar sesión como invitado'
        )
      }
      const data = await response.json()
      login({
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role,
      })
      localStorage.setItem('token', data.token)
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    }
  }

  return (
    <div className='max-w-md mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>Iniciar sesión</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        {error && <p className='text-red-500'>{error}</p>}
        <div>
          <Label htmlFor='username'>Usuario</Label>
          <Input
            id='username'
            type='text'
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor='password'>Contraseña</Label>
          <Input
            id='password'
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type='submit' className='w-full'>
          Iniciar sesión
        </Button>
      </form>
      <div className='flex flex-col gap-2 mt-6'>
        <Button variant='outline' onClick={() => router.push('/register')}>
          ¿No tienes cuenta? Regístrate
        </Button>
        <Button variant='secondary' onClick={handleAdminLogin}>
          Iniciar sesión como admin
        </Button>
        <Button variant='secondary' onClick={handleGuestLogin}>
          Iniciar sesión como invitado
        </Button>
      </div>
    </div>
  )
}
