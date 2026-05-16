import { useEffect, useMemo, useState } from 'react'
import { LayoutGrid, List, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../layouts/MainLayout'
import TaskBadge from '../../components/tasks/TaskBadge'
import TaskFormModal from '../../components/tasks/TaskFormModal'
import { TaskListSkeleton } from '../../components/tasks/TaskSkeleton'
import { useAuthStore } from '../../store/authStore'
import { useTaskStore } from '../../store/taskStore'

const useDebouncedValue = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

const formatDate = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function TaskListPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'admin'
  const {
    tasks,
    totalPages,
    page,
    isLoading,
    fetchTasks,
    deleteTask,
    fetchAssignableUsers,
    users,
  } = useTaskStore()

  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [dueFrom, setDueFrom] = useState('')
  const [dueTo, setDueTo] = useState('')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState('table')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const debouncedSearch = useDebouncedValue(search)

  useEffect(() => {
    if (isAdmin) {
      fetchAssignableUsers().catch(() => null)
    }
  }, [fetchAssignableUsers, isAdmin])

  useEffect(() => {
    fetchTasks({
      page: currentPage,
      limit: 10,
      status: statusFilter || undefined,
      priority: priorityFilter || undefined,
      dueDateFrom: dueFrom || undefined,
      dueDateTo: dueTo || undefined,
      search: debouncedSearch || undefined,
      sortBy,
      sortOrder,
    }).catch((error) => {
      toast.error(error.response?.data?.message || 'Unable to load tasks')
    })
  }, [
    currentPage,
    statusFilter,
    priorityFilter,
    dueFrom,
    dueTo,
    debouncedSearch,
    sortBy,
    sortOrder,
    fetchTasks,
  ])

  const assigneeMap = useMemo(() => {
    const map = new Map()
    users.forEach((member) => map.set(member._id, member))
    return map
  }, [users])

  const resolveAssignee = (task) => {
    if (!task.assignedTo) return 'Unassigned'
    if (typeof task.assignedTo === 'object') {
      if (task.assignedTo._id && task.assignedTo._id === user?._id) {
        return 'You'
      }
      return task.assignedTo.name || task.assignedTo.email || 'Assignee'
    }
    if (task.assignedTo === user?._id) return 'You'
    if (!isAdmin) return 'You'
    const member = assigneeMap.get(task.assignedTo)
    return member ? member.name || member.email : task.assignedTo
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const handleDelete = async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return
    try {
      await deleteTask(task._id)
      toast.success('Task deleted')
      await fetchTasks({
        page: currentPage,
        limit: 10,
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        dueDateFrom: dueFrom || undefined,
        dueDateTo: dueTo || undefined,
        search: debouncedSearch || undefined,
        sortBy,
      sortOrder,
      })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to delete task')
    }
  }

  const handleOpenCreate = () => {
    setEditingTask(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (task) => {
    setEditingTask(task)
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setEditingTask(null)
  }

  const handleSaved = () => {
    fetchTasks({
      page: currentPage,
      limit: 10,
      status: statusFilter || undefined,
      priority: priorityFilter || undefined,
      dueDateFrom: dueFrom || undefined,
      dueDateTo: dueTo || undefined,
      search: debouncedSearch || undefined,
      sortBy,
      sortOrder,
    }).catch((error) => {
      toast.error(error.response?.data?.message || 'Unable to refresh tasks')
    })
  }

  const emptyState = !isLoading && tasks.length === 0

  return (
    <MainLayout>
      <div className="min-h-screen bg-mist pt-[calc(var(--nav-height)+24px)]">
        <div className="mx-auto max-w-6xl px-6 pb-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-midnight">Tasks</h1>
              <p className="text-sm text-slate">
                Track progress, manage priorities, and stay on top of deadlines.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex rounded-xl border border-pebble bg-white/80 p-1">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                    viewMode === 'table'
                      ? 'bg-iris text-white'
                      : 'text-slate hover:text-midnight'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('cards')}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                    viewMode === 'cards'
                      ? 'bg-iris text-white'
                      : 'text-slate hover:text-midnight'
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-2 rounded-xl bg-iris px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-iris/90"
              >
                <Plus className="h-4 w-4" /> New task
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-pebble bg-white/80 p-4 shadow-soft backdrop-blur">
            <div className="grid gap-4 md:grid-cols-5">
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate">Search</label>
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value)
                    setCurrentPage(1)
                  }}
                  placeholder="Search by title..."
                  className="mt-2 w-full rounded-xl border border-pebble bg-white px-3 py-2 text-sm text-midnight focus:outline-none focus:ring-2 focus:ring-iris/40"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate">Status</label>
                <select
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(event.target.value)
                    setCurrentPage(1)
                  }}
                  className="mt-2 w-full rounded-xl border border-pebble bg-white px-3 py-2 text-sm text-midnight focus:outline-none focus:ring-2 focus:ring-iris/40"
                >
                  <option value="">All</option>
                  <option value="todo">To do</option>
                  <option value="in-progress">In progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate">Priority</label>
                <select
                  value={priorityFilter}
                  onChange={(event) => {
                    setPriorityFilter(event.target.value)
                    setCurrentPage(1)
                  }}
                  className="mt-2 w-full rounded-xl border border-pebble bg-white px-3 py-2 text-sm text-midnight focus:outline-none focus:ring-2 focus:ring-iris/40"
                >
                  <option value="">All</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="grid gap-2 md:grid-cols-2 md:col-span-2">
                <div>
                  <label className="text-xs font-semibold text-slate">Due from</label>
                  <input
                    type="date"
                    value={dueFrom}
                    onChange={(event) => {
                      setDueFrom(event.target.value)
                      setCurrentPage(1)
                    }}
                    className="mt-2 w-full rounded-xl border border-pebble bg-white px-3 py-2 text-xs text-midnight focus:outline-none focus:ring-2 focus:ring-iris/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate">Due to</label>
                  <input
                    type="date"
                    value={dueTo}
                    onChange={(event) => {
                      setDueTo(event.target.value)
                      setCurrentPage(1)
                    }}
                    className="mt-2 w-full rounded-xl border border-pebble bg-white px-3 py-2 text-xs text-midnight focus:outline-none focus:ring-2 focus:ring-iris/40"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            {isLoading ? (
              <TaskListSkeleton />
            ) : emptyState ? (
              <div className="rounded-3xl border border-pebble bg-white/80 p-8 text-center shadow-soft">
                <h3 className="text-lg font-semibold text-midnight">
                  No tasks found
                </h3>
                <p className="mt-2 text-sm text-slate">
                  Try adjusting your filters or create a new task.
                </p>
                <button
                  type="button"
                  onClick={handleOpenCreate}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-iris px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-iris/90"
                >
                  <Plus className="h-4 w-4" /> Create task
                </button>
              </div>
            ) : viewMode === 'table' ? (
              <div className="overflow-x-auto rounded-3xl border border-pebble bg-white/80 shadow-soft">
                <table className="w-full text-left text-sm text-midnight">
                  <thead className="bg-cloud/70 text-xs uppercase text-slate">
                    <tr>
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => handleSort('priority')}
                          className="flex items-center gap-1"
                        >
                          Priority
                          <span className="text-[10px]">
                            {sortBy === 'priority' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                          </span>
                        </button>
                      </th>
                      <th className="px-4 py-3">Assignee</th>
                      <th className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => handleSort('dueDate')}
                          className="flex items-center gap-1"
                        >
                          Due date
                          <span className="text-[10px]">
                            {sortBy === 'dueDate' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                          </span>
                        </button>
                      </th>
                      <th className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => handleSort('createdAt')}
                          className="flex items-center gap-1"
                        >
                          Created
                          <span className="text-[10px]">
                            {sortBy === 'createdAt' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                          </span>
                        </button>
                      </th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task._id} className="border-t border-pebble">
                        <td className="px-4 py-4">
                          <p className="font-semibold text-midnight">{task.title}</p>
                          <p className="max-w-xs truncate text-xs text-slate">
                            {task.description || 'No description'}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <TaskBadge type="status" value={task.status} />
                        </td>
                        <td className="px-4 py-4">
                          <TaskBadge type="priority" value={task.priority} />
                        </td>
                        <td className="px-4 py-4 text-sm text-slate">
                          {resolveAssignee(task)}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate">
                          {formatDate(task.dueDate)}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate">
                          {formatDate(task.createdAt)}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => navigate(`/tasks/${task._id}`)}
                              className="rounded-lg border border-pebble px-3 py-1 text-xs font-semibold text-midnight hover:bg-cloud"
                            >
                              View
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(task)}
                              className="rounded-lg border border-pebble px-3 py-1 text-xs font-semibold text-midnight hover:bg-cloud"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(task)}
                              className="rounded-lg border border-coral/30 px-3 py-1 text-xs font-semibold text-coral hover:bg-coral/10"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {tasks.map((task) => (
                  <div
                    key={task._id}
                    className="rounded-3xl border border-pebble bg-white/80 p-5 shadow-soft"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-midnight">
                        {task.title}
                      </h3>
                      <TaskBadge type="status" value={task.status} />
                    </div>
                    <p className="mt-2 text-sm text-slate">
                      {task.description || 'No description provided.'}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                      <TaskBadge type="priority" value={task.priority} />
                      <span className="rounded-full bg-cloud px-3 py-1 text-slate">
                        Due {formatDate(task.dueDate)}
                      </span>
                      <span className="rounded-full bg-cloud px-3 py-1 text-slate">
                        {resolveAssignee(task)}
                      </span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/tasks/${task._id}`)}
                        className="rounded-lg border border-pebble px-3 py-1 text-xs font-semibold text-midnight hover:bg-cloud"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(task)}
                        className="rounded-lg border border-pebble px-3 py-1 text-xs font-semibold text-midnight hover:bg-cloud"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(task)}
                        className="rounded-lg border border-coral/30 px-3 py-1 text-xs font-semibold text-coral hover:bg-coral/10"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!isLoading && tasks.length > 0 && (
            <div className="mt-6 flex items-center justify-between text-sm text-slate">
              <span>
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page <= 1}
                  className="rounded-lg border border-pebble px-3 py-1 text-xs font-semibold text-midnight hover:bg-cloud disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={page >= totalPages}
                  className="rounded-lg border border-pebble px-3 py-1 text-xs font-semibold text-midnight hover:bg-cloud disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <TaskFormModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        initialTask={editingTask}
        isAdmin={isAdmin}
        users={users}
        onSaved={handleSaved}
      />
    </MainLayout>
  )
}

export default TaskListPage
