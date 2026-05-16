function Input({ icon: Icon, ...props }) {
  return (
    <div className="mb-4 flex items-center rounded-xl border border-pebble bg-white/80 px-3 py-2 text-sm text-midnight shadow-soft backdrop-blur">
      {Icon && <Icon className="mr-2 h-5 w-5 text-slate" />}
      <input
        className="w-full bg-transparent text-sm text-midnight placeholder:text-slate focus:outline-none"
        {...props}
      />
    </div>
  )
}

export default Input
