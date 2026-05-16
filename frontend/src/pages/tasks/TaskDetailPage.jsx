import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import MainLayout from '../../layouts/MainLayout'
import TaskBadge from '../../components/tasks/TaskBadge'
import { TaskDetailSkeleton } from '../../components/tasks/TaskSkeleton'
import { useTaskStore } from '../../store/taskStore'
import { useAuthStore } from '../../store/authStore'

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

const buildDownloadUrl = (taskId, document) => {
  if (document.downloadUrl) return document.downloadUrl
  const baseUrl = import.meta.env.VITE_API_URL || ''
  return `${baseUrl}/api/tasks/${taskId}/documents/${document._id}`
}

function TaskDetailPage() {
  const { id } = useParams()
  const { user } = useAuthStore()
  const {
    selectedTask,
    detailLoading,
    fetchTaskById,
    clearSelectedTask,
    users,
    fetchAssignableUsers,
  } = useTaskStore()
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTaskById(id)
      .then(() => setError(null))
      .catch((err) => {
        const message = err.response?.data?.message || 'Unable to load task'
        setError(message)
        toast.error(message)
      })

    return () => clearSelectedTask()
  }, [id, fetchTaskById, clearSelectedTask])

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAssignableUsers().catch(() => null)
    }
  }, [user, fetchAssignableUsers])

  const task = selectedTask
  const attachments = useMemo(() => task?.attachedDocuments || [], [task])
  const backPath = user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'
  const assigneeLabel = useMemo(() => {
    if (!task?.assignedTo) return 'Unassigned'
    if (typeof task.assignedTo === 'object') {
      if (task.assignedTo._id === user?._id) return 'You'
      return task.assignedTo.name || task.assignedTo.email || 'Assignee'
    }
    if (task.assignedTo === user?._id) return 'You'
    const member = users.find((entry) => entry._id === task.assignedTo)
    return member ? member.name || member.email : 'Assignee'
  }, [task, user, users])

  return (
    <MainLayout>
      <div className="min-h-screen bg-mist pt-[calc(var(--nav-height)+24px)]">
        <div className="mx-auto max-w-5xl px-6 pb-12">
          <Link
            to={backPath}
            className="text-sm font-semibold text-iris hover:text-iris/80"
          >
            ← Back to tasks
          </Link>

          <div className="mt-6 rounded-3xl border border-pebble bg-white/80 p-6 shadow-soft backdrop-blur">
            {detailLoading ? (
              <TaskDetailSkeleton />
            ) : error ? (
              <div className="rounded-2xl border border-coral/20 bg-coral/10 p-6 text-sm text-coral">
                {error}
              </div>
            ) : task ? (
              <div className="space-y-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-3xl font-semibold text-midnight">
                      {task.title}
                    </h1>
                    <TaskBadge type="status" value={task.status} />
                    <TaskBadge type="priority" value={task.priority} />
                  </div>
                  <p className="mt-2 text-sm text-slate">
                    {task.description || 'No description provided.'}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-pebble bg-white px-4 py-3">
                    <p className="text-xs font-semibold text-slate">Due date</p>
                    <p className="mt-2 text-sm font-semibold text-midnight">
                      {formatDate(task.dueDate)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-pebble bg-white px-4 py-3">
                    <p className="text-xs font-semibold text-slate">Created</p>
                    <p className="mt-2 text-sm font-semibold text-midnight">
                      {formatDate(task.createdAt)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-pebble bg-white px-4 py-3">
                    <p className="text-xs font-semibold text-slate">Assignee</p>
                    <p className="mt-2 text-sm font-semibold text-midnight">
                      {assigneeLabel}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-pebble bg-white px-4 py-4">
                  <p className="text-sm font-semibold text-midnight">
                    Attached documents
                  </p>
                  {attachments.length === 0 ? (
                    <p className="mt-2 text-sm text-slate">
                      No documents attached.
                    </p>
                  ) : (
                    <div className="mt-3 space-y-3">
                      {attachments.map((doc) => (
                        <div
                          key={doc._id}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-pebble px-3 py-2"
                        >
                          <div>
                            <p className="text-sm font-semibold text-midnight">
                              {doc.fileName}
                            </p>
                            <p className="text-xs text-slate">
                              Uploaded {formatDate(doc.uploadedAt)}
                            </p>
                          </div>
                          <div className="flex gap-3 text-xs font-semibold">
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-iris hover:text-iris/80"
                            >
                              View
                            </a>
                            <a
                              href={buildDownloadUrl(task._id, doc)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-iris hover:text-iris/80"
                            >
                              Download
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default TaskDetailPage
