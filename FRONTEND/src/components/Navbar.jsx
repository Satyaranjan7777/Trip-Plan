import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useContext } from 'react'

import { AuthContext } from '../context/AuthContext'
import toast from 'react-hot-toast'



const Navbar = () => {
  const { user, setUser } = useContext(AuthContext)
  const location = useLocation()
  const navigate = useNavigate()


  const onLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    toast.success('Logged out')
    navigate('/login')
  }

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-lg font-bold text-indigo-600">
            Trrip-AI
          </Link>
          <div className="hidden items-center gap-4 md:flex">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? 'font-semibold text-indigo-700'
                  : 'text-gray-700 hover:text-indigo-600'
              }
              end
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                isActive
                  ? 'font-semibold text-indigo-700'
                  : 'text-gray-700 hover:text-indigo-600'
              }
            >
              History
            </NavLink>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* If user is already logged in, hide Logout button on auth public pages */}
          {user && !['/login', '/register'].includes(location.pathname) ? (
            <button
              onClick={onLogout}
              className="rounded-lg bg-gray-900 px-3 py-1.5 text-sm text-white hover:bg-gray-800"
            >
              Logout
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700"
              >
                Register
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  )
}

export default Navbar

