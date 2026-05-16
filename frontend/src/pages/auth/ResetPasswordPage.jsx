import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Lock } from 'lucide-react'
import AuthLayout from '../../layouts/AuthLayout'
import Input from '../../components/auth/Input'
import LoadingSpinner from '../../components/auth/LoadingSpinner'
import { useAuthStore } from '../../store/authStore'

function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formError, setFormError] = useState(null)
  const { token } = useParams()
  const { resetPassword, isLoading, error, message } = useAuthStore()

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (password !== confirmPassword) {
      setFormError('Passwords do not match')
      return
    }
    setFormError(null)
    try {
      await resetPassword(token, password)
    } catch (_error) {
      // Error handled in store
    }
  }

  return (
    <AuthLayout
      title="Create a new password"
      subtitle="Choose a strong password to protect your account."
    >
      {(formError || error || message) && (
        <div
          className={`mb-4 rounded-xl border px-3 py-2 text-xs ${
            formError || error
              ? 'border-coral/20 bg-coral/10 text-coral'
              : 'border-iris/20 bg-iris/10 text-iris'
          }`}
        >
          {formError || error || message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label className="mb-1 block text-xs font-medium text-slate">Password</label>
        <Input
          icon={Lock}
          type="password"
          placeholder="New password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          required
        />

        <label className="mb-1 block text-xs font-medium text-slate">
          Confirm password
        </label>
        <Input
          icon={Lock}
          type="password"
          placeholder="Re-enter password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          autoComplete="new-password"
          required
        />

        <button
          type="submit"
          disabled={isLoading || !token}
          className="mt-2 flex w-full items-center justify-center rounded-xl bg-iris px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-iris/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? <LoadingSpinner /> : 'Update password'}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-slate">
        Ready to sign in?{' '}
        <Link to="/login" className="font-semibold text-iris hover:text-iris/80">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}

export default ResetPasswordPage
