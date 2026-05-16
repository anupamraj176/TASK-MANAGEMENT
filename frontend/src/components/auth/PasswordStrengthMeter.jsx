const getStrength = (password) => {
  let strength = 0
  if (password.length >= 8) strength += 1
  if (/[A-Z]/.test(password)) strength += 1
  if (/[0-9]/.test(password)) strength += 1
  if (/[^A-Za-z0-9]/.test(password)) strength += 1
  return strength
}

const strengthText = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong']

function PasswordStrengthMeter({ password = '' }) {
  const strength = getStrength(password)

  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center justify-between text-xs text-slate">
        <span>Password strength</span>
        <span className="font-medium text-midnight">{strengthText[strength]}</span>
      </div>
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`h-2 w-full rounded-full ${
              strength > index ? 'bg-iris' : 'bg-cloud'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default PasswordStrengthMeter
