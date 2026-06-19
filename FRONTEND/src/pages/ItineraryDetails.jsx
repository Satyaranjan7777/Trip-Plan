import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../api/axios'
import toast from 'react-hot-toast'

const ItineraryDetails = () => {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        const res = await axiosInstance.get(`/itinerary/${id}`)
        setData(res.data)
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load itinerary')
      }
    })()
  }, [id])

  const itinerary = useMemo(() => data?.itinerary || {}, [data])

  const copyShareLink = async () => {
    const shareToken = data?.shareToken
    if (!shareToken) {
      toast.error('Share link not available')
      return
    }

    const link = `${window.location.origin}/share/${shareToken}`
    try {
      await navigator.clipboard.writeText(link)
      toast.success('Share link copied')
    } catch {
      toast.error('Failed to copy link')
    }
  }

  if (error) return <div className="mx-auto w-full max-w-6xl px-4 py-8 text-sm text-red-600">{error}</div>
  if (!data) return <div className="mx-auto w-full max-w-6xl px-4 py-8">Loading...</div>

  const days = itinerary.days || []
  const activityCount = days.reduce((acc, d) => acc + (d.activities || []).length, 0)

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{itinerary.tripTitle || 'Itinerary'}</h2>
          <p className="mt-1 text-gray-600">
            {itinerary.destination}{' '}
            {itinerary.startDate && itinerary.endDate ? `• ${itinerary.startDate} - ${itinerary.endDate}` : ''}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            onClick={copyShareLink}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Copy Share Link
          </button>

          <button
            type="button"
            onClick={async () => {
              if (!id) return
              const ok = window.confirm('Delete this itinerary?')
              if (!ok) return
              try {
                await axiosInstance.delete(`/itinerary/${id}`)
                toast.success('Itinerary deleted')
                window.location.href = '/history'
              } catch (e) {
                toast.error(e?.response?.data?.message || 'Failed to delete itinerary')
              }
            }}
            className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition-all duration-300 hover:bg-red-50"
          >
            Delete Itinerary
          </button>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-semibold text-indigo-900">Plan overview</div>
              <div className="mt-1 text-sm text-indigo-900/80">
                {days.length} day{days.length === 1 ? '' : 's'} • {activityCount} activities
              </div>
            </div>
            <div className="text-xs text-indigo-800/70">Tip: you can copy a share link anytime</div>
          </div>
        </div>

        <div className="space-y-4">
          {days.map((day) => (
            <div key={day.day} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Day {day.day}</h3>
                  {day.date ? <p className="text-sm text-gray-600">{day.date}</p> : null}
                </div>

                {day.transport || day.accommodation ? (
                  <div className="text-sm text-gray-700">
                    {day.accommodation ? <div>🏨 {day.accommodation}</div> : null}
                    {day.transport ? <div>🚗 {day.transport}</div> : null}
                  </div>
                ) : null}
              </div>

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
    </div>
  )
}

export default ItineraryDetails

