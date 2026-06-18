import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const ItineraryCard = ({ itinerary, onClick }) => {
  const navigate = useNavigate()
  if (!itinerary) return null

  const id = itinerary._id || itinerary.id
  const shareToken = itinerary.shareToken

  const tripTitle = itinerary.itinerary?.tripTitle || itinerary.tripTitle || itinerary.title || 'Itinerary'
  const destination = itinerary.itinerary?.destination || itinerary.destination || itinerary.location || '—'

  const startDate = itinerary.startDate || itinerary.itinerary?.startDate
  const endDate = itinerary.endDate || itinerary.itinerary?.endDate

  const createdAt = itinerary.createdAt || itinerary.created_date || itinerary.createdDate

  const daysCount = itinerary.days?.length || itinerary.itinerary?.days?.length

  const handleClick = () => {
    if (onClick) return onClick()
    if (id) navigate(`/itinerary/${id}`)
  }

  const copyShareLink = async (e) => {
    e.stopPropagation()
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

  const formatDate = (d) => {
    try {
      if (!d) return ''
      const date = typeof d === 'string' || typeof d === 'number' ? new Date(d) : null
      if (!date || Number.isNaN(date.getTime())) return ''
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
    } catch {
      return ''
    }
  }

  const startLabel = startDate ? formatDate(startDate) : ''
  const endLabel = endDate ? formatDate(endDate) : ''
  const createdLabel = createdAt ? formatDate(createdAt) : ''

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      className="cursor-pointer rounded-2xl border border-white/70 bg-white/90 p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:border-indigo-200"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/10 to-cyan-400/10 text-indigo-700 ring-1 ring-indigo-100">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M22 12h-4l-3 9L7 3l-3 9H2" />
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-slate-900" title={tripTitle}>
            {tripTitle}
          </h3>
          <p className="mt-1 truncate text-sm text-slate-600" title={destination}>
            {destination}
          </p>

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-700">
            <div className="rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
              {startLabel || endLabel ? (
                <span>
                  <span className="font-semibold">Dates:</span> {startLabel}{endLabel ? ` - ${endLabel}` : ''}
                </span>
              ) : (
                <span className="font-semibold">Dates:</span>
              )}
            </div>
            <div className="rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
              <span className="font-semibold">{daysCount ? `${daysCount} day${daysCount === 1 ? '' : 's'}` : 'Duration'}:</span>{' '}
              {createdLabel ? `Created ${createdLabel}` : '—'}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            if (id) navigate(`/itinerary/${id}`)
          }}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-indigo-700"
        >
          View Details
        </button>

        <button
          type="button"
          onClick={copyShareLink}
          className="rounded-xl border border-indigo-100 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 transition-all duration-300 hover:bg-indigo-50"
        >
          Copy Share Link
        </button>
      </div>
    </div>
  )
}

export default ItineraryCard



