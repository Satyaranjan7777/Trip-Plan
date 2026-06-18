import { useContext, useEffect, useMemo, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import axiosInstance from '../api/axios'
import UploadBox from '../components/UploadBox'
import ItineraryCard from '../components/ItineraryCard'
import toast from 'react-hot-toast'


const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [items, setItems] = useState([])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await axiosInstance.get('/itinerary')
        setItems(res.data?.itineraries || res.data?.itinerary || res.data || [])
      } catch {
        // ignore initial load errors (token may not be present yet)
      }
    })()
  }, [])

  const onUpload = async (file) => {
    setLoading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await axiosInstance.post('/upload', fd)

      const created = res.data
      setItems((prev) => [created, ...prev])
      toast.success('Itinerary generated')
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to generate itinerary'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const stats = useMemo(() => {
    const total = items?.length || 0
    const shared = (items || []).filter((it) => it?.shareToken).length
    const latest = items?.[0]
    return {
      total,
      filesUploaded: total,
      shared,
      latestTrip: latest?.itinerary?.tripTitle || latest?.tripTitle || latest?.title || latest?.destination || '—',
    }
  }, [items])

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        {/* Header / Hero */}
        <div className="rounded-2xl border border-white/70 bg-white/70 backdrop-blur shadow-sm">
          <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                AI Travel Planner
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Plan your next trip with AI
              </h1>
              <p className="mt-2 text-slate-700">
                Upload your booking confirmation and generate a smart day-by-day itinerary.
              </p>

              <div className="mt-4 text-sm text-slate-600">
                {user ? (
                  <span>
                    Welcome,{' '}
                    <span className="font-semibold text-slate-900">
                      {user.name || user.email || 'traveler'}
                    </span>
                    .
                  </span>
                ) : null}
              </div>
            </div>

            {/* Stats side card */}
            <div className="w-full md:max-w-sm">
              <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-white/70">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold text-slate-500">Latest trip</div>
                    <div className="mt-1 truncate text-sm font-semibold text-slate-900">{stats.latestTrip}</div>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <path d="M3 12h18" />
                      <path d="M12 3v18" />
                    </svg>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
                    <div className="text-xs text-slate-500">Itineraries</div>
                    <div className="mt-1 text-lg font-bold text-slate-900">{stats.total}</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
                    <div className="text-xs text-slate-500">Shared</div>
                    <div className="mt-1 text-lg font-bold text-slate-900">{stats.shared}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="group rounded-2xl bg-white/80 p-5 shadow-sm ring-1 ring-white/70 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-700">Total Itineraries</div>
                <div className="mt-1 text-2xl font-bold text-slate-900">{stats.total}</div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M4 6h16" />
                  <path d="M4 10h16" />
                  <path d="M4 14h16" />
                  <path d="M4 18h16" />
                </svg>
              </div>
            </div>
          </div>

          <div className="group rounded-2xl bg-white/80 p-5 shadow-sm ring-1 ring-white/70 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-700">Files Uploaded</div>
                <div className="mt-1 text-2xl font-bold text-slate-900">{stats.filesUploaded}</div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-800 ring-1 ring-cyan-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <path d="M7 10l5-5 5 5" />
                  <path d="M12 5v14" />
                </svg>
              </div>
            </div>
          </div>

          <div className="group rounded-2xl bg-white/80 p-5 shadow-sm ring-1 ring-white/70 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-700">Shared Trips</div>
                <div className="mt-1 text-2xl font-bold text-slate-900">{stats.shared}</div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
                  <path d="M16 6l-4-4-4 4" />
                  <path d="M12 2v14" />
                </svg>
              </div>
            </div>
          </div>

          <div className="group rounded-2xl bg-white/80 p-5 shadow-sm ring-1 ring-white/70 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-700">Latest Trip</div>
                <div className="mt-1 truncate text-ellipsis whitespace-nowrap text-2xl font-bold text-slate-900">
                  {stats.latestTrip}
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M21 12a9 9 0 1 1-18 0" />
                  <path d="M12 7v5l3 3" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main layout: Upload + History */}
        <div className="mt-6 grid gap-6 lg:grid-cols-5">
          {/* Upload column */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-white/70 bg-white/60 p-4 shadow-sm backdrop-blur">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-800">Upload your booking</div>
                  <div className="text-xs text-slate-600">We’ll extract details and generate an itinerary.</div>
                </div>
                <div className="rounded-xl bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100">
                  Fast
                </div>
              </div>

              <UploadBox onUpload={onUpload} loading={loading} />

              {error ? <div className="mt-4 text-sm text-red-600">{error}</div> : null}
            </div>
          </div>

          {/* Right column: Quick tips + History preview */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-white/70 bg-white/60 p-5 shadow-sm backdrop-blur">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Recent itinerary</h3>
                  <p className="mt-1 text-sm text-slate-600">Your newest AI-generated trip cards appear here.</p>
                </div>
                <div className="text-xs text-slate-500">Tip: share from any card</div>
              </div>

              {items?.length ? (
                <div className="mt-4 space-y-3">
                  {items.slice(0, 3).map((it) => (
                    <ItineraryCard key={it._id || it.id} itinerary={it} />
                  ))}
                </div>
              ) : (
                <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-white/60 p-8 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/10 to-cyan-400/10 text-indigo-700 ring-1 ring-indigo-100">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                      <path d="M3 12h18" />
                      <path d="M12 3v18" />
                    </svg>
                  </div>
                  <h4 className="mt-4 text-lg font-semibold text-slate-900">No trips generated yet</h4>
                  <p className="mt-1 text-sm text-slate-600">Upload your first booking file to create an AI itinerary.</p>
                </div>
              )}

              <div className="mt-6 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-100">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M12 2v20" />
                    <path d="M17 5l-5-3-5 3" />
                    <path d="M17 19l-5 3-5-3" />
                  </svg>
                  Quick tips
                </div>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Use clear booking confirmations for best extraction.</li>
                  <li>Copy share links to send itineraries to friends or family.</li>
                  <li>Keep multiple trips in your history for easy access.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Full history section */}
        <div className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Itinerary history</h3>
              <p className="mt-1 text-sm text-slate-600">View, share, and plan your next adventure.</p>
            </div>
            <div className="hidden text-sm text-slate-500 sm:block">Total: {items?.length || 0}</div>
          </div>

          {items?.length ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((it) => (
                <ItineraryCard key={it._id || it.id} itinerary={it} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-white/60 p-8">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500/10 to-cyan-400/10 text-indigo-700 ring-1 ring-indigo-100">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
                    <path d="M21 12a9 9 0 1 1-18 0" />
                    <path d="M12 7v5l3 3" />
                  </svg>
                </div>
                <h4 className="mt-4 text-lg font-semibold text-slate-900">No trips generated yet</h4>
                <p className="mt-1 max-w-md text-sm text-slate-600">Upload your first booking file to create an AI itinerary.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard



