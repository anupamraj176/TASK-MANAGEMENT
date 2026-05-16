import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';

const DEFAULT_FILTERS = {
  status: '',
  priority: '',
  search: '',
  dueDateFrom: '',
  dueDateTo: '',
};

const DEFAULT_SORT = { field: 'createdAt', order: 'desc' };
const DEFAULT_PAGINATION = { page: 1, limit: 10, total: 0, totalPages: 1 };

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sort, setSort] = useState(DEFAULT_SORT);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '')
      );
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: sort.field,
        sortOrder: sort.order,
        ...activeFilters,
      };
      const { data } = await taskService.getTasks(params);
      const taskList = data.data || data.tasks || [];
      setTasks(taskList);
      setPagination((prev) => ({
        ...prev,
        total: data.total || taskList.length,
        totalPages: data.totalPages || Math.ceil((data.total || taskList.length) / prev.limit),
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters, sort]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const updateSort = useCallback((field) => {
    setSort((prev) => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc',
    }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const goToPage = useCallback((page) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const deleteTask = useCallback(
    async (id) => {
      await taskService.deleteTask(id);
      fetchTasks();
    },
    [fetchTasks]
  );

  return {
    tasks,
    loading,
    error,
    pagination,
    filters,
    sort,
    updateFilters,
    resetFilters,
    updateSort,
    goToPage,
    deleteTask,
    refetch: fetchTasks,
  };
}
