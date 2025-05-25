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

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)

  const login = (userData: User) => {
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
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
