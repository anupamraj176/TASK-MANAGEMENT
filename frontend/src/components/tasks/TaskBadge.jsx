const STATUS_STYLES = {
  todo: 'bg-cloud text-slate',
  'in-progress': 'bg-amber/15 text-amber',
  done: 'bg-leaf/15 text-leaf',
}

const PRIORITY_STYLES = {
  low: 'bg-cloud text-slate',
  medium: 'bg-iris/15 text-iris',
  high: 'bg-coral/15 text-coral',
}

const formatLabel = (value) =>
  value
    ?.split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

function TaskBadge({ type, value }) {
  const styles = type === 'priority' ? PRIORITY_STYLES : STATUS_STYLES
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        styles[value] || 'bg-cloud text-slate'
      }`}
    >
      {formatLabel(value) || 'Unknown'}
    </span>
  )
}

export default TaskBadge
