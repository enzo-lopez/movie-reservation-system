'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {useAppContext} from '../contexts/AppContext'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {login} = useAppContext()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({username, email, password}),
        }
      )
      if (!response.ok) {
        const data = await response.json()
        setError(data?.message || 'Error al registrarse')
        return
      }
      // Opcional: puedes hacer login automático tras registrarse
      let userData = await response.json()
      userData = userData.usuario
      console.log('User data:', userData)
      login({
        id: userData.id || userData._id,
        username: userData.username,
        email: userData.email,
        role: userData.role || 'USER',
      })
      router.push('/')
    } catch (err) {
      setError('Error al registrarse')
    }
  }

  return (
    <div className='max-w-md mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>Registrarse</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <Label htmlFor='username'>Nombre de usuario</Label>
          <Input
            id='username'
            type='text'
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
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
        {error && <div className='text-red-500 text-sm'>{error}</div>}
        <Button type='submit'>Registrarse</Button>
      </form>
    </div>
  )
}
