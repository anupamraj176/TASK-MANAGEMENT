import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail, User } from 'lucide-react'
import AuthLayout from '../../layouts/AuthLayout'
import Input from '../../components/auth/Input'
import LoadingSpinner from '../../components/auth/LoadingSpinner'
import PasswordStrengthMeter from '../../components/auth/PasswordStrengthMeter'
import { useAuthStore } from '../../store/authStore'

function SignUpPage({ role = 'user' }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formError, setFormError] = useState(null)
  const { signup, isLoading, error } = useAuthStore()
  const navigate = useNavigate()

  const isAdmin = role === 'admin'

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (password !== confirmPassword) {
      setFormError('Passwords do not match')
      return
    }
    setFormError(null)
    try {
      await signup(email, password, name, role)
      navigate('/verify-email')
    } catch (_error) {
      // Error handled in store
    }
  }

  return (
    <AuthLayout
      title={isAdmin ? 'Create admin account' : 'Create your account'}
      subtitle={
        isAdmin
          ? 'Get set up to manage teams and oversee progress.'
          : 'Start organizing work with your team today.'
      }
    >
      {(formError || error) && (
        <div className="mb-4 rounded-xl border border-coral/20 bg-coral/10 px-3 py-2 text-xs text-coral">
          {formError || error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label className="mb-1 block text-xs font-medium text-slate">Full name</label>
        <Input
          icon={User}
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          required
        />

        <label className="mb-1 block text-xs font-medium text-slate">Email</label>
        <Input
          icon={Mail}
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />

        <label className="mb-1 block text-xs font-medium text-slate">Password</label>
        <Input
          icon={Lock}
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          required
        />

        <PasswordStrengthMeter password={password} />

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
          disabled={isLoading}
          className="mt-2 flex w-full items-center justify-center rounded-xl bg-iris px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-iris/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? <LoadingSpinner /> : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-slate">
        Already have an account?{' '}
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

export default SignUpPage
