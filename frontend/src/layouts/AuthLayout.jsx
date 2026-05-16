import { Link } from 'react-router-dom'

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-mist">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-2">
        <div className="hidden flex-col justify-between rounded-3xl bg-gradient-to-br from-midnight via-midnight to-iris p-10 text-white shadow-soft lg:flex">
          <div>
            <Link to="/" className="text-lg font-semibold text-white/90">
              TaskFlow
            </Link>
            <h1 className="mt-6 text-3xl font-semibold leading-tight">
              Organize your work in a calm, focused space.
            </h1>
            <p className="mt-4 text-sm text-white/80">
              Track tasks, collaborate with your team, and keep projects moving with
              clarity.
            </p>
          </div>
          <div className="text-xs text-white/70">Secure by default · Built for teams</div>
        </div>

        <div className="flex items-center">
          <div className="w-full rounded-3xl border border-pebble bg-white/80 p-8 shadow-soft backdrop-blur">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-midnight">{title}</h2>
              {subtitle && <p className="mt-2 text-sm text-slate">{subtitle}</p>}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
