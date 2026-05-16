import { useNavigate } from 'react-router-dom';
import TaskStatusBadge from './TaskStatusBadge';
import TaskPriorityBadge from './TaskPriorityBadge';
import { useAuth } from '../../hooks/useAuth';

function SortIcon({ field, sort }) {
  if (sort.field !== field) {
    return (
      <svg className="w-3.5 h-3.5 text-[#E2E4ED]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    );
  }
  return sort.order === 'asc' ? (
    <svg className="w-3.5 h-3.5 text-[#5C6AC4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  ) : (
    <svg className="w-3.5 h-3.5 text-[#5C6AC4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function SortableHeader({ label, field, sort, onSort }) {
  return (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-[#8B8FA8] uppercase tracking-wider
        cursor-pointer select-none hover:text-[#5C6AC4] transition-colors"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1.5">
        {label}
        <SortIcon field={field} sort={sort} />
      </div>
    </th>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function isOverdue(dateStr, status) {
  if (!dateStr || status === 'done') return false;
  return new Date(dateStr) < new Date();
}

export default function TaskTable({ tasks, sort, onSort, onEdit, onDelete, loading }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-[#E2E4ED] overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="px-6 py-4 border-b border-[#F5F6FA] animate-pulse">
            <div className="flex gap-4 items-center">
              <div className="h-4 bg-[#E2E4ED] rounded w-48" />
              <div className="h-6 bg-[#E2E4ED] rounded-full w-20" />
              <div className="h-6 bg-[#E2E4ED] rounded w-16" />
              <div className="h-4 bg-[#E2E4ED] rounded w-28 ml-auto" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#E2E4ED] flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-14 h-14 rounded-full bg-[#F5F6FA] flex items-center justify-center">
          <svg className="w-7 h-7 text-[#8B8FA8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-sm font-medium text-[#1A1A2E]">No tasks found</p>
        <p className="text-sm text-[#8B8FA8]">Try adjusting your filters or create a new task.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#E2E4ED] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F5F6FA] border-b border-[#E2E4ED]">
            <tr>
              <SortableHeader label="Title" field="title" sort={sort} onSort={onSort} />
              <SortableHeader label="Status" field="status" sort={sort} onSort={onSort} />
              <SortableHeader label="Priority" field="priority" sort={sort} onSort={onSort} />
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#8B8FA8] uppercase tracking-wider">
                Assignee
              </th>
              <SortableHeader label="Due Date" field="dueDate" sort={sort} onSort={onSort} />
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#8B8FA8] uppercase tracking-wider">
                Docs
              </th>
              <th className="px-4 py-3 w-24" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F6FA]">
            {tasks.map((task) => {
              const overdue = isOverdue(task.dueDate, task.status);
              return (
                <tr
                  key={task._id || task.id}
                  className="hover:bg-[#F5F6FA] transition-colors cursor-pointer group"
                  onClick={() => navigate(`/tasks/${task._id || task.id}`)}
                >
                  {/* Title */}
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-medium text-[#1A1A2E] line-clamp-1 group-hover:text-[#5C6AC4] transition-colors">
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-xs text-[#8B8FA8] line-clamp-1 mt-0.5">{task.description}</p>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <TaskStatusBadge status={task.status} />
                  </td>

                  {/* Priority */}
                  <td className="px-4 py-3.5">
                    <TaskPriorityBadge priority={task.priority} />
                  </td>

                  {/* Assignee */}
                  <td className="px-4 py-3.5">
                    {task.assignedTo ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#5C6AC4] flex items-center justify-center
                          text-white text-xs font-medium shrink-0">
                          {(task.assignedTo.name || task.assignedTo.email || '?')[0].toUpperCase()}
                        </div>
                        <span className="text-sm text-[#1A1A2E] truncate max-w-[120px]">
                          {task.assignedTo.name || task.assignedTo.email}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-[#8B8FA8]">Unassigned</span>
                    )}
                  </td>

                  {/* Due date */}
                  <td className="px-4 py-3.5">
                    <span className={`text-sm ${overdue ? 'text-[#EF4444] font-medium' : 'text-[#1A1A2E]'}`}>
                      {overdue && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#EF4444] mr-1.5 mb-0.5" />
                      )}
                      {formatDate(task.dueDate)}
                    </span>
                  </td>

                  {/* Docs count */}
                  <td className="px-4 py-3.5">
                    {task.attachedDocuments?.length > 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs text-[#5C6AC4] bg-[#EEF0FB] px-2 py-0.5 rounded-full">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        {task.attachedDocuments.length}
                      </span>
                    ) : (
                      <span className="text-sm text-[#E2E4ED]">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(task)}
                        className="p-1.5 rounded-lg text-[#8B8FA8] hover:text-[#5C6AC4] hover:bg-[#EEF0FB] transition-all"
                        aria-label="Edit task"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      {(isAdmin || task.assignedTo?._id === user?.id || task.assignedTo === user?.id) && (
                        <button
                          onClick={() => onDelete(task)}
                          className="p-1.5 rounded-lg text-[#8B8FA8] hover:text-[#EF4444] hover:bg-red-50 transition-all"
                          aria-label="Delete task"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
