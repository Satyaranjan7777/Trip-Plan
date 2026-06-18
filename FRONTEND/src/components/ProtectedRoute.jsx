import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext)

  // While auth state is loading (e.g., page refresh), don't redirect.
  if (loading) return null

  if (!user) return <Navigate to="/login" replace />
  return children
}


export default ProtectedRoute

