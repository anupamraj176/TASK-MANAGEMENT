import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTasks } from '../../hooks/useTasks';
import TaskFilters from '../../components/tasks/TaskFilters';
import TaskTable from '../../components/tasks/TaskTable';
import TaskModal from '../../components/tasks/TaskModal';
import DeleteConfirmModal from '../../components/tasks/DeleteConfirmModal';
import { useAuth } from '../../hooks/useAuth';

function Pagination({ pagination, onPageChange }) {
  const { page, totalPages, total, limit } = pagination;
  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-[#8B8FA8]">
        Showing <span className="font-medium text-[#1A1A2E]">{from}–{to}</span> of{' '}
        <span className="font-medium text-[#1A1A2E]">{total}</span> tasks
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-2 rounded-lg border border-[#E2E4ED] text-[#8B8FA8] hover:border-[#5C6AC4]
            hover:text-[#5C6AC4] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {pages.map((p, i) => {
          const prev = pages[i - 1];
          return (
            <span key={p} className="flex items-center gap-1">
              {prev && p - prev > 1 && (
                <span className="text-sm text-[#8B8FA8] px-1">...</span>
              )}
              <button
                onClick={() => onPageChange(p)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all
                  ${p === page
                    ? 'bg-[#5C6AC4] text-white'
                    : 'border border-[#E2E4ED] text-[#1A1A2E] hover:border-[#5C6AC4] hover:text-[#5C6AC4]'
                  }`}
              >
                {p}
              </button>
            </span>
          );
        })}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="p-2 rounded-lg border border-[#E2E4ED] text-[#8B8FA8] hover:border-[#5C6AC4]
            hover:text-[#5C6AC4] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function TasksPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Navigate to home page first to avoid ProtectedRoute throwing us to /login
    navigate('/');
    // Then clear the session in the background
    setTimeout(() => {
      logout();
    }, 100);
  };
  const {
    tasks, loading, error, pagination, filters, sort,
    updateFilters, resetFilters, updateSort, goToPage, deleteTask, refetch,
  } = useTasks();

  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const openCreate = () => { setEditTask(null); setModalOpen(true); };
  const openEdit = (task) => { setEditTask(task); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditTask(null); };

  const handleModalSuccess = () => {
    closeModal();
    refetch();
  };

  const handleDeleteConfirm = async (id) => {
    await deleteTask(id);
    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#1A1A2E]">Tasks</h1>
            <p className="text-sm text-[#8B8FA8] mt-0.5">
              {pagination.total > 0 ? `${pagination.total} task${pagination.total !== 1 ? 's' : ''}` : 'Manage your work'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {user?.role === 'admin' && (
              <Link
                to="/admin/users"
                className="flex items-center gap-2 px-4 py-2.5 bg-purple-50 text-purple-700 text-sm font-medium
                  rounded-xl hover:bg-purple-100 transition-colors shadow-sm border border-purple-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Manage Users
              </Link>
            )}
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#5C6AC4] text-white text-sm font-medium
                rounded-xl hover:bg-[#4a58b0] transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Task
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 border border-[#E2E4ED] text-[#1A1A2E] text-sm font-medium
                rounded-xl hover:bg-[#F5F6FA] hover:text-[#EF4444] transition-colors shadow-sm"
              title="Logout"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Filters */}
        <TaskFilters filters={filters} onFilterChange={updateFilters} onReset={resetFilters} />

        {/* Error state */}
        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-[#EF4444] flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
            <button onClick={refetch} className="ml-auto text-xs font-medium underline">Retry</button>
          </div>
        )}

        {/* Table */}
        <TaskTable
          tasks={tasks}
          sort={sort}
          onSort={updateSort}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
          loading={loading}
        />

        {/* Pagination */}
        {!loading && (
          <Pagination pagination={pagination} onPageChange={goToPage} />
        )}
      </div>

      {/* Create / Edit modal */}
      <TaskModal
        isOpen={modalOpen}
        task={editTask}
        onSuccess={handleModalSuccess}
        onClose={closeModal}
      />

      {/* Delete confirmation */}
      <DeleteConfirmModal
        task={deleteTarget}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
