import { useEffect, useState } from 'react'
import axiosInstance from '../api/axios'
import ItineraryCard from '../components/ItineraryCard'
import toast from 'react-hot-toast'

const History = () => {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        const res = await axiosInstance.get('/itinerary')
        setItems(res.data?.itineraries || res.data?.itinerary || res.data || [])
      } catch (e) {
        const msg = e?.response?.data?.message || 'Failed to load history'
        setError(msg)
        toast.error(msg)
      }
    })()
  }, [])

  if (error) return <div className="mx-auto w-full max-w-6xl px-4 py-8 text-sm text-red-600">{error}</div>

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900">History</h2>
      {items.length === 0 ? <p className="mt-4 text-sm text-gray-600">No itineraries yet.</p> : null}
      {items.length ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <ItineraryCard
              key={it._id || it.id}
              itinerary={it}
              onDelete={async () => {
                // delete handled by page to keep card dumb
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default History


