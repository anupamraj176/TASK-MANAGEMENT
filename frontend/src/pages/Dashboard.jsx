import { Link } from 'react-router-dom'

function Dashboard() {
  return (
    <div className="min-h-screen bg-mist">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-3xl border border-pebble bg-white/80 p-8 shadow-soft backdrop-blur">
          <h1 className="text-3xl font-semibold text-midnight">Welcome User</h1>
          <p className="mt-2 text-sm text-slate">
            Your dashboard is coming soon. Start by creating your first task.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-pebble px-4 py-2 text-sm font-medium text-midnight hover:bg-cloud"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
