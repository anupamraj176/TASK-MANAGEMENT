import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import AuthLayout from '../../layouts/AuthLayout'
import Input from '../../components/auth/Input'
import LoadingSpinner from '../../components/auth/LoadingSpinner'
import { useAuthStore } from '../../store/authStore'

function ForgotPasswordPage({ role = 'user' }) {
  const [email, setEmail] = useState('')
  const { forgotPassword, isLoading, error, message } = useAuthStore()

  const isAdmin = role === 'admin'

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await forgotPassword(email)
    } catch (_error) {
      // Error handled in store
    }
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We’ll email a reset link if the account exists."
    >
      {(error || message) && (
        <div
          className={`mb-4 rounded-xl border px-3 py-2 text-xs ${
            error
              ? 'border-coral/20 bg-coral/10 text-coral'
              : 'border-iris/20 bg-iris/10 text-iris'
          }`}
        >
          {error || message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label className="mb-1 block text-xs font-medium text-slate">Email</label>
        <Input
          icon={Mail}
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 flex w-full items-center justify-center rounded-xl bg-iris px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-iris/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? <LoadingSpinner /> : 'Send reset link'}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-slate">
        Remembered your password?{' '}
        <Link
          to={isAdmin ? '/login/admin' : '/login'}
          className="font-semibold text-iris hover:text-iris/80"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}

export default ForgotPasswordPage
