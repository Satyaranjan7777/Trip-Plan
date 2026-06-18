import { Link } from 'react-router-dom'

const Landing = () => {
  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-2 md:items-center">
      <div>
        <h1 className="text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl">
          Turn your booking text into a complete trip itinerary.
        </h1>
        <p className="mt-4 text-gray-600">
          Upload your PDF/JPG/PNG booking confirmation. We’ll extract the text, generate a day-by-day plan with
          Gemini, and give you a shareable link.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/register"
            className="rounded-xl bg-indigo-600 px-5 py-3 text-center text-white hover:bg-indigo-700"
          >
            Get started
          </Link>
          <Link to="/login" className="rounded-xl border border-indigo-600 px-5 py-3 text-center text-indigo-600">
            Login
          </Link>
        </div>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-white p-6 shadow-sm ring-1 ring-indigo-100">
        <div className="rounded-xl bg-white p-5 ring-1 ring-gray-100">
          <div className="text-sm font-semibold text-indigo-700">What you get</div>
          <ul className="mt-3 space-y-2 text-gray-700">
            <li>• Trip title, destination, and date range</li>
            <li>• Day-by-day activities, accommodation, transport</li>
            <li>• Smart travel tips</li>
            <li>• Shareable public itinerary link</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

export default Landing

