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
  
  const [errors, setErrors] = useState({})
  const { signup, isLoading, error: authError } = useAuthStore()
  const navigate = useNavigate()

  const isAdmin = role === 'admin'

  const validateField = (field, value) => {
    let error = ''
    if (field === 'name') {
      if (!value.trim()) error = 'Full name is required'
    }
    if (field === 'email') {
      if (!value) error = 'Email is required'
      else if (!/\S+@\S+\.\S+/.test(value)) error = 'Please enter a valid email address'
    }
    if (field === 'password') {
      if (!value) error = 'Password is required'
      else if (value.length < 6) error = 'Password must be at least 6 characters'
    }
    if (field === 'confirmPassword') {
      if (value !== password) error = 'Passwords do not match'
    }
    
    setErrors(prev => ({ ...prev, [field]: error }))
    return !error
  }

  const handleBlur = (field, value) => validateField(field, value)

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    const isNameValid = validateField('name', name)
    const isEmailValid = validateField('email', email)
    const isPasswordValid = validateField('password', password)
    const isConfirmValid = validateField('confirmPassword', confirmPassword)
    
    if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmValid) {
      return
    }

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
      {authError && (
        <div className="mb-4 rounded-xl border border-coral/20 bg-coral/10 px-3 py-2 text-xs text-coral">
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label className="mb-1 block text-xs font-medium text-slate">Full name</label>
          <Input
            icon={User}
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              if (errors.name) validateField('name', event.target.value)
            }}
            onBlur={(e) => handleBlur('name', e.target.value)}
            autoComplete="name"
          />
          {errors.name && <p className="mt-1 text-xs text-coral">{errors.name}</p>}
        </div>

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
            placeholder="Create a password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              if (errors.password) validateField('password', event.target.value)
              if (confirmPassword && event.target.value !== confirmPassword) {
                setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }))
              } else if (confirmPassword && event.target.value === confirmPassword) {
                setErrors(prev => ({ ...prev, confirmPassword: '' }))
              }
            }}
            onBlur={(e) => handleBlur('password', e.target.value)}
            autoComplete="new-password"
          />
          {errors.password && <p className="mt-1 text-xs text-coral">{errors.password}</p>}
        </div>

        <PasswordStrengthMeter password={password} />

        <div className="mb-4 mt-2">
          <label className="mb-1 block text-xs font-medium text-slate">
            Confirm password
          </label>
          <Input
            icon={Lock}
            type="password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value)
              if (errors.confirmPassword) validateField('confirmPassword', event.target.value)
            }}
            onBlur={(e) => handleBlur('confirmPassword', e.target.value)}
            autoComplete="new-password"
          />
          {errors.confirmPassword && <p className="mt-1 text-xs text-coral">{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 flex w-full items-center justify-center rounded-xl bg-iris px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-iris/90 disabled:cursor-not-allowed disabled:opacity-70"
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
