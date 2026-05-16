import { useEffect } from 'react';
import TaskForm from './TaskForm';

export default function TaskModal({ isOpen, task, onSuccess, onClose }) {
  const isEdit = Boolean(task);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSuccess = () => {
    onSuccess?.();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? 'Edit task' : 'Create task'}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1A1A2E]/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E4ED]">
          <h2 className="text-lg font-semibold text-[#1A1A2E]">
            {isEdit ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#8B8FA8]
              hover:text-[#1A1A2E] hover:bg-[#F5F6FA] transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          <TaskForm task={task} onSuccess={handleSuccess} onCancel={onClose} />
        </div>
      </div>
    </div>
  );
}
