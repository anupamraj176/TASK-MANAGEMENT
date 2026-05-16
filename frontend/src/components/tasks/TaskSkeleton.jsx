function TaskListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array.from({ length: 5 })].map((_, index) => (
        <div
          key={`task-skeleton-${index}`}
          className="animate-pulse rounded-2xl border border-pebble bg-white/80 p-4 shadow-soft"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="h-4 w-1/3 rounded-full bg-cloud" />
            <div className="h-4 w-20 rounded-full bg-cloud" />
          </div>
          <div className="mt-3 flex gap-3">
            <div className="h-3 w-16 rounded-full bg-cloud" />
            <div className="h-3 w-20 rounded-full bg-cloud" />
            <div className="h-3 w-24 rounded-full bg-cloud" />
          </div>
        </div>
      ))}
    </div>
  )
}

function TaskDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-6 w-1/2 rounded-full bg-cloud" />
      <div className="h-4 w-full rounded-full bg-cloud" />
      <div className="h-4 w-2/3 rounded-full bg-cloud" />
      <div className="h-4 w-1/3 rounded-full bg-cloud" />
      <div className="mt-4 h-40 rounded-2xl bg-cloud" />
    </div>
  )
}

export { TaskListSkeleton, TaskDetailSkeleton }
