const STATUS_CONFIG = {
  todo: {
    label: 'To Do',
    className: 'bg-[#EEF0FB] text-[#5C6AC4]',
    dot: 'bg-[#5C6AC4]',
  },
  'in-progress': {
    label: 'In Progress',
    className: 'bg-amber-50 text-[#F59E0B]',
    dot: 'bg-[#F59E0B]',
  },
  done: {
    label: 'Done',
    className: 'bg-green-50 text-[#22C55E]',
    dot: 'bg-[#22C55E]',
  },
};

export default function TaskStatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.todo;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
