'use client'

import type React from 'react'
import {createContext, useContext, useState, useEffect} from 'react'
import {useRouter} from 'next/navigation'

type User = {
  id: string
  username: string
  role: 'USER' | 'ADMIN'
  email: string
} | null

type AppContextType = {
  isDarkMode: boolean
  toggleDarkMode: () => void
  user: User
  login: (user: User) => void
  logout: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({children}: {children: React.ReactNode}) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [user, setUser] = useState<User>(null)
  const [mounted, setMounted] = useState(false)

  // Efecto para marcar el componente como montado
  useEffect(() => {
    setMounted(true)
  }, [])

  // Efecto para cargar el tema guardado SOLO en cliente
  useEffect(() => {
    if (!mounted) return
    try {
      const savedTheme =
        typeof window !== 'undefined' ? localStorage.getItem('theme') : null
      const systemPrefersDark =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      const shouldBeDark =
        savedTheme === 'dark' || (!savedTheme && systemPrefersDark)
      setIsDarkMode(shouldBeDark)
      if (shouldBeDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } catch (e) {
      // Si hay error, por ejemplo en SSR, no hacer nada
    }
    // Solo debe correr una vez después de montar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted])

  // Efecto para actualizar el tema cuando cambia isDarkMode
  useEffect(() => {
    if (!mounted) return
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
    } catch (e) {
      // Si hay error, por ejemplo en SSR, no hacer nada
    }
  }, [isDarkMode, mounted])

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev)
  }

  const login = (userData: User) => {
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <AppContext.Provider
      value={{isDarkMode, toggleDarkMode, user, login, logout}}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
