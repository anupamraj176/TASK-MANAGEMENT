import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout'
import Input from '../../components/auth/Input'
import LoadingSpinner from '../../components/auth/LoadingSpinner'
import { useAuthStore } from '../../store/authStore'

function EmailVerification() {
  const [code, setCode] = useState('')
  const [formError, setFormError] = useState(null)
  const { verifyEmail, isLoading, error } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmedCode = code.trim()
    if (!trimmedCode) {
      setFormError('Verification code is required')
      return
    }
    setFormError(null)
    try {
      const response = await verifyEmail(trimmedCode)
      const role = response?.user?.role
      navigate(role === 'admin' ? '/admin/dashboard' : '/dashboard')
    } catch (_error) {
      // Error handled in store
    }
  }

  return (
    <AuthLayout
      title="Verify your email"
      subtitle="Enter the 6-digit code we sent to your inbox."
    >
      {(formError || error) && (
        <div className="mb-4 rounded-xl border border-coral/20 bg-coral/10 px-3 py-2 text-xs text-coral">
          {formError || error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label className="mb-1 block text-xs font-medium text-slate">
          Verification code
        </label>
        <Input
          type="text"
          inputMode="numeric"
          placeholder="123456"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          maxLength={6}
          required
        />

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 flex w-full items-center justify-center rounded-xl bg-iris px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-iris/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? <LoadingSpinner /> : 'Verify email'}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-slate">
        Prefer to sign in?{' '}
        <Link to="/login" className="font-semibold text-iris hover:text-iris/80">
          Go to login
        </Link>
      </p>
    </AuthLayout>
  )
}

export default EmailVerification
