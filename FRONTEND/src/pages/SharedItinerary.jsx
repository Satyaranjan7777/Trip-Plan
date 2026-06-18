import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../api/axios'

const SharedItinerary = () => {
  const { shareToken } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        const res = await axiosInstance.get(`/itinerary/share/${shareToken}`)
        setData(res.data)
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load shared itinerary')
      }
    })()
  }, [shareToken])

  const itinerary = useMemo(() => data?.itinerary || {}, [data])

  if (error) return <div className="mx-auto w-full max-w-6xl px-4 py-8 text-sm text-red-600">{error}</div>
  if (!data) return <div className="mx-auto w-full max-w-6xl px-4 py-8">Loading...</div>

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900">{itinerary.tripTitle || 'Shared Itinerary'}</h2>
      <p className="mt-1 text-gray-600">
        {itinerary.destination} {itinerary.startDate && itinerary.endDate ? `• ${itinerary.startDate} - ${itinerary.endDate}` : ''}
      </p>

      <div className="mt-8 space-y-4">
        {(itinerary.days || []).map((day) => (
          <div key={day.day} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Day {day.day}</h3>
              {day.date ? <p className="text-sm text-gray-600">{day.date}</p> : null}
            </div>

            {(day.transport || day.accommodation) && (
              <div className="mt-2 text-sm text-gray-700">
                {day.accommodation ? <div>🏨 {day.accommodation}</div> : null}
                {day.transport ? <div>🚗 {day.transport}</div> : null}
              </div>
            )}

            <div className="mt-4">
              <div className="text-sm font-medium text-gray-800">Activities</div>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-700">
                {(day.activities || []).map((a, idx) => (
                  <li key={`${day.day}-${idx}`}>{a}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {(itinerary.tips || []).length ? (
        <div className="mt-10 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
          <h3 className="text-lg font-semibold text-indigo-900">Tips</h3>
          <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-indigo-900">
            {itinerary.tips.map((t, idx) => (
              <li key={idx}>{t}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

export default SharedItinerary


