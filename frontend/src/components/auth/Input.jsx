import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

function Input({ icon: Icon, type = 'text', ...props }) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const resolvedType = isPassword && showPassword ? 'text' : type

  return (
    <div className="mb-4 flex items-center rounded-xl border border-pebble bg-white/80 px-3 py-2 text-sm text-midnight shadow-soft backdrop-blur">
      {Icon && <Icon className="mr-2 h-5 w-5 text-slate" />}
      <input
        className={`w-full bg-transparent text-sm text-midnight placeholder:text-slate focus:outline-none ${
          isPassword ? 'pr-2' : ''
        }`}
        type={resolvedType}
        {...props}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(value => !value)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="ml-2 text-slate transition hover:text-midnight"
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      )}
    </div>
  )
}

export default Input
