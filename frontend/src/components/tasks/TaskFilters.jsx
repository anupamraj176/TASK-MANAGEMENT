import { useState } from 'react';

const inputClass =
  'px-3 py-2 rounded-lg border border-[#E2E4ED] bg-white text-sm text-[#1A1A2E] ' +
  'placeholder-[#8B8FA8] focus:outline-none focus:ring-2 focus:ring-[#5C6AC4]/30 focus:border-[#5C6AC4] transition-all';

const selectClass =
  'px-3 py-2 rounded-lg border border-[#E2E4ED] bg-white text-sm text-[#1A1A2E] ' +
  'focus:outline-none focus:ring-2 focus:ring-[#5C6AC4]/30 focus:border-[#5C6AC4] transition-all ' +
  'appearance-none cursor-pointer pr-8';

function SelectWrapper({ children }) {
  return (
    <div className="relative">
      {children}
      <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8B8FA8]"
        fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}

export default function TaskFilters({ filters, onFilterChange, onReset }) {
  const [showDateRange, setShowDateRange] = useState(false);

  const hasActiveFilters =
    filters.status || filters.priority || filters.search ||
    filters.dueDateFrom || filters.dueDateTo;

  const set = (field) => (e) => onFilterChange({ [field]: e.target.value });

  return (
    <div className="bg-white border border-[#E2E4ED] rounded-xl p-4 space-y-3">
      {/* Top row: search + filters */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B8FA8]"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
          </svg>
          <input
            type="text"
            value={filters.search}
            onChange={set('search')}
            placeholder="Search tasks..."
            className={`${inputClass} pl-9 w-full`}
          />
        </div>

        {/* Status */}
        <SelectWrapper>
          <select value={filters.status} onChange={set('status')} className={selectClass}>
            <option value="">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </SelectWrapper>

        {/* Priority */}
        <SelectWrapper>
          <select value={filters.priority} onChange={set('priority')} className={selectClass}>
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </SelectWrapper>

        {/* Date range toggle */}
        <button
          type="button"
          onClick={() => setShowDateRange((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all
            ${showDateRange || filters.dueDateFrom || filters.dueDateTo
              ? 'border-[#5C6AC4] bg-[#EEF0FB] text-[#5C6AC4]'
              : 'border-[#E2E4ED] text-[#8B8FA8] hover:border-[#5C6AC4] hover:text-[#5C6AC4]'
            }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Due Date
        </button>

        {/* Reset */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-[#EF4444]
              hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear
          </button>
        )}
      </div>

      {/* Date range row */}
      {showDateRange && (
        <div className="flex flex-wrap gap-3 items-center pt-1 border-t border-[#E2E4ED]">
          <span className="text-xs font-medium text-[#8B8FA8]">Due between</span>
          <input
            type="date"
            value={filters.dueDateFrom}
            onChange={set('dueDateFrom')}
            className={inputClass}
          />
          <span className="text-xs text-[#8B8FA8]">and</span>
          <input
            type="date"
            value={filters.dueDateTo}
            onChange={set('dueDateTo')}
            min={filters.dueDateFrom}
            className={inputClass}
          />
        </div>
      )}
    </div>
  );
}
