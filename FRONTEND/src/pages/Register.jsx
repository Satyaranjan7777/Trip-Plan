import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axios'

const Register = () => {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const canSubmit = password && confirmPassword && password === confirmPassword

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!canSubmit) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await axiosInstance.post('/auth/register', { name, email, password })
      navigate('/login')
    } catch (err) {
      setError(err?.response?.data?.message || 'Register failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gradient-to-b from-indigo-50 via-white to-white">
      <div className="mx-auto flex w-full max-w-6xl items-center px-4 py-10">
        <div className="hidden w-1/2 lg:block">
          <div className="rounded-3xl bg-white p-8 text-gray-900 shadow-lg ring-1 ring-gray-200">
            <div className="text-sm font-semibold text-indigo-700">Get started</div>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight">Create your Trrip-AI account.</h1>
            <p className="mt-4 text-gray-600">
              It takes less than a minute to sign up and start generating shareable itineraries.
            </p>

            <div className="mt-7 grid gap-3">
              <div className="rounded-2xl bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
                <span className="font-semibold">✓</span> Upload booking confirmations
              </div>
              <div className="rounded-2xl bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
                <span className="font-semibold">✓</span> Smart extracted details
              </div>
              <div className="rounded-2xl bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
                <span className="font-semibold">✓</span> Share links with friends
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Register</h2>
              <p className="mt-1 text-sm text-gray-600">Create an account to access your dashboard.</p>
            </div>

            {error ? (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <form onSubmit={onSubmit} className="mt-5 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-gray-800">Name</span>
                <input
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </label>

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
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  autoComplete="new-password"
                  required
                />
                <span className="text-xs text-gray-500">
                  Use at least 8 characters (recommended).
                </span>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-gray-800">Confirm password</span>
                <input
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  autoComplete="new-password"
                  required
                />
                {confirmPassword.length > 0 ? (
                  <span className={canSubmit ? 'text-xs text-green-600' : 'text-xs text-red-600'}>
                    {canSubmit ? 'Passwords match' : 'Passwords do not match'}
                  </span>
                ) : (
                  <span className="text-xs text-gray-500"> </span>
                )}
              </label>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex h-11 items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-white" />
                    Creating...
                  </span>
                ) : (
                  'Create account'
                )}
              </button>

              <div className="flex items-center justify-between pt-1 text-sm">
                <span className="text-gray-500">Already have an account?</span>
                <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
                  Login
                </Link>
              </div>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-gray-500">Your data stays private in this demo app.</p>
        </div>
      </div>
    </div>
  )
}

export default Register

