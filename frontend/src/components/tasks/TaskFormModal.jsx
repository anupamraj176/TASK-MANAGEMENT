import { useEffect, useMemo, useState } from 'react'
import { FileText, X } from 'lucide-react'
import toast from 'react-hot-toast'
import FileDropzone from './FileDropzone'
import { useTaskStore } from '../../store/taskStore'

const formatDateForInput = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

const buildDownloadUrl = (taskId, document) => {
  if (document.downloadUrl) return document.downloadUrl
  const baseUrl = import.meta.env.VITE_API_URL || ''
  return `${baseUrl}/api/tasks/${taskId}/documents/${document._id}`
}

function TaskFormModal({ isOpen, onClose, initialTask, isAdmin, users, onSaved }) {
  const { createTask, updateTask, isSaving } = useTaskStore()
  const isEdit = Boolean(initialTask)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('todo')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [documents, setDocuments] = useState([])
  const [removedDocumentIds, setRemovedDocumentIds] = useState([])

  useEffect(() => {
    if (!isOpen) return
    setTitle(initialTask?.title || '')
    setDescription(initialTask?.description || '')
    setStatus(initialTask?.status || 'todo')
    setPriority(initialTask?.priority || 'medium')
    setDueDate(formatDateForInput(initialTask?.dueDate))
    setAssignedTo(
      isAdmin
        ? initialTask?.assignedTo?._id || initialTask?.assignedTo || ''
        : ''
    )
    setDocuments([])
    setRemovedDocumentIds([])
  }, [initialTask, isAdmin, isOpen])

  const activeDocuments = useMemo(() => {
    const docs = initialTask?.attachedDocuments || []
    return docs.filter((doc) => !removedDocumentIds.includes(doc._id))
  }, [initialTask, removedDocumentIds])

  const handleRemoveDoc = (docId) => {
    setRemovedDocumentIds((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const payload = {
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : '',
      assignedTo: isAdmin ? assignedTo : undefined,
      documents,
      removeDocumentIds: removedDocumentIds,
    }

    try {
      if (isEdit) {
        await updateTask(initialTask._id, payload)
        toast.success('Task updated')
      } else {
        await createTask(payload)
        toast.success('Task created')
      }
      onSaved?.()
      onClose()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/40 px-4 py-10">
      <div className="w-full max-w-2xl rounded-3xl border border-pebble bg-white p-6 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-midnight">
              {isEdit ? 'Edit task' : 'Create task'}
            </h2>
            <p className="text-xs text-slate">
              {isEdit
                ? 'Update details and attachments for this task.'
                : 'Fill in the details to create a new task.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-pebble p-2 text-slate transition hover:text-midnight"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate">Title</label>
            <input
              className="mt-2 w-full rounded-xl border border-pebble bg-white px-3 py-2 text-sm text-midnight focus:outline-none focus:ring-2 focus:ring-iris/40"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Prepare sprint review deck"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate">Description</label>
            <textarea
              rows="3"
              className="mt-2 w-full rounded-xl border border-pebble bg-white px-3 py-2 text-sm text-midnight focus:outline-none focus:ring-2 focus:ring-iris/40"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Add more context for the task..."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate">Status</label>
              <select
                className="mt-2 w-full rounded-xl border border-pebble bg-white px-3 py-2 text-sm text-midnight focus:outline-none focus:ring-2 focus:ring-iris/40"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value="todo">To do</option>
                <option value="in-progress">In progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate">Priority</label>
              <select
                className="mt-2 w-full rounded-xl border border-pebble bg-white px-3 py-2 text-sm text-midnight focus:outline-none focus:ring-2 focus:ring-iris/40"
                value={priority}
                onChange={(event) => setPriority(event.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate">Due date</label>
              <input
                type="date"
                className="mt-2 w-full rounded-xl border border-pebble bg-white px-3 py-2 text-sm text-midnight focus:outline-none focus:ring-2 focus:ring-iris/40"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
              />
            </div>

            {isAdmin && (
              <div>
                <label className="text-xs font-semibold text-slate">Assign to</label>
                <select
                  className="mt-2 w-full rounded-xl border border-pebble bg-white px-3 py-2 text-sm text-midnight focus:outline-none focus:ring-2 focus:ring-iris/40"
                  value={assignedTo}
                  onChange={(event) => setAssignedTo(event.target.value)}
                >
                  <option value="">Assign to myself</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {initialTask?.attachedDocuments?.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate">Existing documents</p>
                {removedDocumentIds.length > 0 && (
                  <span className="text-xs text-coral">
                    {removedDocumentIds.length} marked for removal
                  </span>
                )}
              </div>
              <div className="space-y-2">
                {initialTask.attachedDocuments.map((doc) => {
                  const isRemoved = removedDocumentIds.includes(doc._id)
                  return (
                    <div
                      key={doc._id}
                      className={`flex items-center justify-between rounded-xl border px-3 py-2 ${
                        isRemoved ? 'border-coral/30 bg-coral/5' : 'border-pebble bg-white/80'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-iris" />
                        <div>
                          <p
                            className={`font-medium ${
                              isRemoved ? 'line-through text-slate' : 'text-midnight'
                            }`}
                          >
                            {doc.fileName}
                          </p>
                          <div className="flex gap-2 text-xs text-slate">
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-iris hover:text-iris/80"
                            >
                              View
                            </a>
                            <a
                              href={buildDownloadUrl(initialTask._id, doc)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-iris hover:text-iris/80"
                            >
                              Download
                            </a>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveDoc(doc._id)}
                        className={`text-xs font-semibold ${
                          isRemoved ? 'text-iris' : 'text-coral'
                        }`}
                      >
                        {isRemoved ? 'Undo' : 'Remove'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate">Upload PDFs</label>
            <p className="mt-1 text-xs text-slate">
              PDF only, up to 3 files. Selected files will be added to the task.
            </p>
            <div className="mt-2">
              <FileDropzone
                files={documents}
                onChange={setDocuments}
                existingCount={activeDocuments.length}
                maxFiles={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-pebble px-4 py-2 text-sm font-semibold text-midnight hover:bg-cloud"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-iris px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-iris/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? 'Saving...' : isEdit ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskFormModal
