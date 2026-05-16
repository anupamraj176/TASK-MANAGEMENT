const PRIORITY_CONFIG = {
  low: {
    label: 'Low',
    className: 'bg-[#F5F6FA] text-[#8B8FA8]',
  },
  medium: {
    label: 'Medium',
    className: 'bg-amber-50 text-[#F59E0B]',
  },
  high: {
    label: 'High',
    className: 'bg-red-50 text-[#EF4444]',
  },
};

export default function TaskPriorityBadge({ priority }) {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.low;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
