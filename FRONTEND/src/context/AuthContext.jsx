import { createContext, useEffect, useMemo, useState } from 'react'
import axiosInstance from '../api/axios'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }

    ;(async () => {
      try {
        const res = await axiosInstance.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUser(res.data?.user || res.data)
      } catch (err) {
        // Only clear token on actual auth failures.
        const status = err?.response?.status
        if (status === 401 || status === 403) {
          localStorage.removeItem('token')
          setUser(null)
        }
      } finally {
        setLoading(false)
      }

    })()
  }, [])

  const value = useMemo(() => ({ user, setUser, loading }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

