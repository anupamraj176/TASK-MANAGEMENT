import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTask } from '../../hooks/useTask';
import { taskService } from '../../services/taskService';
import TaskStatusBadge from '../../components/tasks/TaskStatusBadge';
import TaskPriorityBadge from '../../components/tasks/TaskPriorityBadge';
import TaskDocuments from '../../components/tasks/TaskDocuments';
import TaskModal from '../../components/tasks/TaskModal';
import DeleteConfirmModal from '../../components/tasks/DeleteConfirmModal';
import { useAuth } from '../../hooks/useAuth';

function DetailField({ label, children }) {
  return (
    <div>
      <p className="text-xs font-semibold text-[#8B8FA8] uppercase tracking-wide mb-1.5">{label}</p>
      <div className="text-sm text-[#1A1A2E]">{children}</div>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
}

function isOverdue(dateStr, status) {
  if (!dateStr || status === 'done') return false;
  return new Date(dateStr) < new Date();
}

export default function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { task, loading, error, refetch } = useTask(id);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isOwner = task?.assignedTo?._id === user?.id || task?.assignedTo === user?.id;
  const canModify = isAdmin || isOwner;

  const handleDeleteConfirm = async (taskId) => {
    await taskService.deleteTask(taskId);
    navigate('/tasks');
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-pulse">
        <div className="h-8 bg-[#E2E4ED] rounded w-1/2" />
        <div className="bg-white rounded-2xl border border-[#E2E4ED] p-6 space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 bg-[#E2E4ED] rounded w-24" />
              <div className="h-5 bg-[#E2E4ED] rounded w-48" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-[#1A1A2E] font-semibold">Task not found</p>
        <p className="text-sm text-[#8B8FA8]">{error || 'This task may have been deleted.'}</p>
        <button
          onClick={() => navigate('/tasks')}
          className="text-sm text-[#5C6AC4] font-medium hover:underline"
        >
          ← Back to Tasks
        </button>
      </div>
    );
  }

  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Breadcrumb + actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/tasks')}
            className="flex items-center gap-1.5 text-sm text-[#8B8FA8] hover:text-[#5C6AC4] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tasks
          </button>

          {canModify && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E2E4ED]
                  text-sm font-medium text-[#1A1A2E] hover:border-[#5C6AC4] hover:text-[#5C6AC4] hover:bg-[#EEF0FB] transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                onClick={() => setDeleteOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E2E4ED]
                  text-sm font-medium text-[#8B8FA8] hover:border-red-300 hover:text-[#EF4444] hover:bg-red-50 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Main card */}
        <div className="bg-white border border-[#E2E4ED] rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#E2E4ED]">
            <div className="flex items-start gap-3 flex-wrap">
              <h1 className="text-xl font-semibold text-[#1A1A2E] flex-1">{task.title}</h1>
              <div className="flex items-center gap-2 shrink-0">
                <TaskStatusBadge status={task.status} />
                <TaskPriorityBadge priority={task.priority} />
              </div>
            </div>
            {task.description && (
              <p className="mt-3 text-sm text-[#8B8FA8] leading-relaxed">{task.description}</p>
            )}
          </div>

          {/* Detail fields */}
          <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-[#E2E4ED]">
            <DetailField label="Assigned To">
              {task.assignedTo ? (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#5C6AC4] flex items-center justify-center text-white text-xs font-semibold">
                    {(task.assignedTo.name || task.assignedTo.email || '?')[0].toUpperCase()}
                  </div>
                  <span>{task.assignedTo.name || task.assignedTo.email}</span>
                </div>
              ) : (
                <span className="text-[#8B8FA8]">Unassigned</span>
              )}
            </DetailField>

            <DetailField label="Due Date">
              <span className={overdue ? 'text-[#EF4444] font-medium' : ''}>
                {overdue && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#EF4444] mr-1.5 mb-0.5" />
                )}
                {formatDate(task.dueDate)}
                {overdue && <span className="ml-1.5 text-xs font-normal text-[#EF4444]">(Overdue)</span>}
              </span>
            </DetailField>

            <DetailField label="Created">
              <span className="text-[#8B8FA8]">{formatDate(task.createdAt)}</span>
            </DetailField>

            <DetailField label="Last Updated">
              <span className="text-[#8B8FA8]">{formatDate(task.updatedAt)}</span>
            </DetailField>
          </div>

          {/* Documents */}
          <div className="px-6 py-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-[#1A1A2E]">
                Attached Documents
              </h2>
              {task.attachedDocuments?.length > 0 && (
                <span className="text-xs text-[#8B8FA8] bg-[#F5F6FA] px-2 py-0.5 rounded-full">
                  {task.attachedDocuments.length} / 3
                </span>
              )}
            </div>
            <TaskDocuments taskId={id} documents={task.attachedDocuments} />
          </div>
        </div>
      </div>

      {/* Edit modal */}
      <TaskModal
        isOpen={editOpen}
        task={task}
        onSuccess={() => { setEditOpen(false); refetch(); }}
        onClose={() => setEditOpen(false)}
      />

      {/* Delete confirmation */}
      <DeleteConfirmModal
        task={deleteOpen ? task : null}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteOpen(false)}
      />
    </div>
  );
}
