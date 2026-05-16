import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail } from 'lucide-react'
import AuthLayout from '../../layouts/AuthLayout'
import Input from '../../components/auth/Input'
import LoadingSpinner from '../../components/auth/LoadingSpinner'
import { useAuthStore } from '../../store/authStore'

function LoginPage({ role = 'user' }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const { login, isLoading, error: authError } = useAuthStore()
  const navigate = useNavigate()

  const isAdmin = role === 'admin'

  const validateField = (field, value) => {
    let error = ''
    if (field === 'email') {
      if (!value) error = 'Email is required'
      else if (!/\S+@\S+\.\S+/.test(value)) error = 'Please enter a valid email address'
    }
    if (field === 'password') {
      if (!value) error = 'Password is required'
    }
    setErrors(prev => ({ ...prev, [field]: error }))
    return !error
  }

  const handleBlur = (field, value) => {
    validateField(field, value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    const isEmailValid = validateField('email', email)
    const isPasswordValid = validateField('password', password)
    
    if (!isEmailValid || !isPasswordValid) return

    try {
      await login(email, password, role)
      navigate(isAdmin ? '/admin/dashboard' : '/dashboard')
    } catch (_error) {
      // Error handled in store
    }
  }

  return (
    <AuthLayout
      title={isAdmin ? 'Admin login' : 'Welcome back'}
      subtitle={
        isAdmin
          ? 'Access your admin workspace to keep things running smoothly.'
          : 'Log in to keep your tasks moving forward.'
      }
    >
      {authError && (
        <div className="mb-4 rounded-xl border border-coral/20 bg-coral/10 px-3 py-2 text-xs text-coral">
          {authError}
        </div>
      )}
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label className="mb-1 block text-xs font-medium text-slate">Email</label>
          <Input
            icon={Mail}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              if (errors.email) validateField('email', event.target.value)
            }}
            onBlur={(e) => handleBlur('email', e.target.value)}
            autoComplete="email"
          />
          {errors.email && <p className="mt-1 text-xs text-coral">{errors.email}</p>}
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-xs font-medium text-slate">Password</label>
          <Input
            icon={Lock}
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              if (errors.password) validateField('password', event.target.value)
            }}
            onBlur={(e) => handleBlur('password', e.target.value)}
            autoComplete="current-password"
          />
          {errors.password && <p className="mt-1 text-xs text-coral">{errors.password}</p>}
        </div>

        <div className="mb-6 flex items-center justify-between text-xs text-slate">
          <span>Use your registered credentials.</span>
          <Link
            to={isAdmin ? '/forgot/admin' : '/forgot'}
            className="font-medium text-iris hover:text-iris/80"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center rounded-xl bg-iris px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-iris/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? <LoadingSpinner /> : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-slate">
        Don&apos;t have an account?{' '}
        <Link
          to={isAdmin ? '/signup/admin' : '/signup'}
          className="font-semibold text-iris hover:text-iris/80"
        >
          Sign up
        </Link>
      </p>
    </AuthLayout>
  )
}

export default LoginPage
