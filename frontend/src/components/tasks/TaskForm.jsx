import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { taskService } from '../../services/taskService';
import FileUpload from './FileUpload';
import { useAuth } from '../../hooks/useAuth'; // adjust path if needed

const INITIAL_FORM = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
  assignedTo: '',
};

function FormField({ label, required, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[#1A1A2E]">
        {label} {required && <span className="text-[#EF4444]">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-[#EF4444]">{error}</p>}
    </div>
  );
}

const inputClass =
  'w-full px-3 py-2.5 rounded-lg border border-[#E2E4ED] bg-white text-[#1A1A2E] text-sm placeholder-[#8B8FA8] ' +
  'focus:outline-none focus:ring-2 focus:ring-[#5C6AC4]/30 focus:border-[#5C6AC4] transition-all';

const selectClass =
  'w-full px-3 py-2.5 rounded-lg border border-[#E2E4ED] bg-white text-[#1A1A2E] text-sm ' +
  'focus:outline-none focus:ring-2 focus:ring-[#5C6AC4]/30 focus:border-[#5C6AC4] transition-all appearance-none cursor-pointer';

export default function TaskForm({ task = null, onSuccess, onCancel }) {
  const { user } = useAuth();
  const isEdit = Boolean(task);

  const [form, setForm] = useState(INITIAL_FORM);
  const [newFiles, setNewFiles] = useState([]);
  const [existingDocs, setExistingDocs] = useState([]);
  const [removedDocIds, setRemovedDocIds] = useState([]);
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const isAdmin = user?.role === 'admin';

  // Prefill form in edit mode
  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? task.dueDate.substring(0, 10) : '',
        assignedTo: task.assignedTo?._id || task.assignedTo || '',
      });
      setExistingDocs(task.attachedDocuments || []);
    }
  }, [task]);

  // Load users for assignee dropdown (admins only)
  useEffect(() => {
    if (!isAdmin) return;
    userService
      .getUsers({ limit: 100 })
      .then(({ data }) => setUsers(data.data || data.users || []))
      .catch(() => {});
  }, [isAdmin]);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required.';
    if (form.title.length > 200) errs.title = 'Title must be under 200 characters.';
    if (!form.dueDate) errs.dueDate = 'Due date is required.';
    return errs;
  };

  const handleRemoveExisting = (docId) => {
    setExistingDocs((prev) => prev.filter((d) => (d._id || d.id) !== docId));
    setRemovedDocIds((prev) => [...prev, docId]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    setServerError('');

    try {
      const fd = new FormData();
      fd.append('title', form.title.trim());
      fd.append('description', form.description.trim());
      fd.append('status', form.status);
      fd.append('priority', form.priority);
      fd.append('dueDate', form.dueDate);
      if (form.assignedTo) fd.append('assignedTo', form.assignedTo);

      // New file attachments
      newFiles.forEach((file) => fd.append('documents', file));

      // Tell backend which existing docs to remove
      if (removedDocIds.length > 0) {
        fd.append('removeDocumentIds', JSON.stringify(removedDocIds));
      }

      if (isEdit) {
        await taskService.updateTask(task._id || task.id, fd);
      } else {
        await taskService.createTask(fd);
      }

      onSuccess?.();
    } catch (err) {
      console.error('Task submission error:', err);
      setServerError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        err.message ||
        'Something went wrong. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {serverError && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-[#EF4444]">
          {serverError}
        </div>
      )}

      <FormField label="Title" required error={errors.title}>
        <input
          type="text"
          value={form.title}
          onChange={set('title')}
          placeholder="What needs to be done?"
          className={inputClass}
          maxLength={200}
        />
      </FormField>

      <FormField label="Description">
        <textarea
          value={form.description}
          onChange={set('description')}
          placeholder="Add more details..."
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Status" required>
          <div className="relative">
            <select value={form.status} onChange={set('status')} className={selectClass}>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B8FA8]"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </FormField>

        <FormField label="Priority" required>
          <div className="relative">
            <select value={form.priority} onChange={set('priority')} className={selectClass}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B8FA8]"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </FormField>
      </div>

      <FormField label="Due Date" required error={errors.dueDate}>
        <input
          type="date"
          value={form.dueDate}
          onChange={set('dueDate')}
          className={inputClass}
          min={new Date().toISOString().substring(0, 10)}
        />
      </FormField>

      {isAdmin && (
        <FormField label="Assign To">
          <div className="relative">
            <select value={form.assignedTo} onChange={set('assignedTo')} className={selectClass}>
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u._id || u.id} value={u._id || u.id}>
                  {u.name || u.email}
                </option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B8FA8]"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </FormField>
      )}

      <FormField label="Documents (PDF, max 3)">
        <FileUpload
          files={newFiles}
          onChange={setNewFiles}
          existingDocs={existingDocs}
          onRemoveExisting={isEdit ? handleRemoveExisting : undefined}
        />
      </FormField>

      <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E2E4ED]">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="px-4 py-2.5 rounded-lg text-sm font-medium text-[#1A1A2E] border border-[#E2E4ED]
            hover:bg-[#F5F6FA] transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-[#5C6AC4]
            hover:bg-[#4a58b0] transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          {submitting && (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}
