import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axios'
import { AuthContext } from '../context/AuthContext'

const Login = () => {
  const { setUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await axiosInstance.post('/auth/login', { email, password })
      const token = res.data?.token
      if (token) localStorage.setItem('token', token)
      if (res.data?.user) setUser(res.data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gradient-to-b from-indigo-50 via-white to-white">
      <div className="mx-auto flex w-full max-w-6xl items-center px-4 py-10">
        <div className="hidden w-1/2 lg:block">
          <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-900 p-8 text-white shadow-lg">
            <div className="text-sm font-semibold text-indigo-200">Trrip-AI</div>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight">Plan smarter trips from your booking text.</h1>
            <p className="mt-4 text-indigo-100">
              Upload confirmation, extract key details, and get an itinerary you can share.
            </p>

            <div className="mt-7 grid gap-3">
              <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm">
                <span className="font-semibold">✓</span> Day-by-day activities
              </div>
              <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm">
                <span className="font-semibold">✓</span> Smart travel tips
              </div>
              <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm">
                <span className="font-semibold">✓</span> Shareable link
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-gray-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Login</h2>
                <p className="mt-1 text-sm text-gray-600">Welcome back. Let’s plan your next trip.</p>
              </div>
              <div className="h-10 w-10 rounded-2xl bg-indigo-50 p-2 text-indigo-700 ring-1 ring-indigo-100">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            </div>

            {error ? (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <form onSubmit={onSubmit} className="mt-5 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-gray-800">Email</span>
                <input
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  autoComplete="email"
                  required
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-gray-800">Password</span>
                <input
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex h-11 items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-white" />
                    Logging in...
                  </span>
                ) : (
                  'Login'
                )}
              </button>

              <div className="flex items-center justify-between pt-1 text-sm">
                <span className="text-gray-500">New here?</span>
                <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
                  Create account
                </Link>
              </div>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-gray-500">
            By continuing, you agree to our demo app terms.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

