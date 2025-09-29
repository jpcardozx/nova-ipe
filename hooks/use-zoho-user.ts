// hooks/use-zoho-user.ts
'use client'

import { useState, useEffect } from 'react'

interface ZohoUser {
  email: string
  name: string
  organization: string
  provider: string
}

export function useZohoUser() {
  const [user, setUser] = useState<ZohoUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Erro ao carregar usuário:', error)
      }
    }
    setLoading(false)
  }, [])

  const logout = () => {
    localStorage.removeItem('currentUser')
    setUser(null)
    window.location.href = '/login'
  }

  const isAuthenticated = !!user

  return {
    user,
    loading,
    logout,
    isAuthenticated
  }
}