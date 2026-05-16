import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';
import { useSocket } from './useSocket';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

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
  const { user } = useAuth();
  const socket = useSocket();
  
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

  // Real-time socket event listeners
  useEffect(() => {
    if (!socket || !user) return;

    const handleTaskCreated = (task) => {
      const assignedId = task.assignedTo?._id || task.assignedTo;
      const creatorId = task.createdBy?._id || task.createdBy;
      
      if (user.role === 'admin' || assignedId === user._id) {
        setTasks((prev) => {
          // Prevent duplicates
          if (prev.some(t => t._id === task._id)) return prev;
          return [task, ...prev].slice(0, pagination.limit);
        });
        setPagination((prev) => ({ ...prev, total: prev.total + 1 }));
        
        if (assignedId === user._id && creatorId !== user._id) {
          toast.success(`New task assigned to you: ${task.title}`);
        }
      }
    };

    const handleTaskUpdated = (updatedTask) => {
      const assignedId = updatedTask.assignedTo?._id || updatedTask.assignedTo;
      
      setTasks((prev) => {
        // If task is in our list, update it
        if (prev.some(t => t._id === updatedTask._id)) {
          return prev.map(t => t._id === updatedTask._id ? updatedTask : t);
        }
        // If it was just assigned to us and we didn't have it (e.g. we are a user)
        if (user.role !== 'admin' && assignedId === user._id) {
          return [updatedTask, ...prev].slice(0, pagination.limit);
        }
        return prev;
      });
      
      if (assignedId === user._id) {
        toast('A task assigned to you was updated: ' + updatedTask.title, { icon: '🔄' });
      }
    };

    const handleTaskDeleted = ({ _id }) => {
      setTasks((prev) => prev.filter(t => t._id !== _id));
      setPagination((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
    };

    socket.on('task:created', handleTaskCreated);
    socket.on('task:updated', handleTaskUpdated);
    socket.on('task:deleted', handleTaskDeleted);

    return () => {
      socket.off('task:created', handleTaskCreated);
      socket.off('task:updated', handleTaskUpdated);
      socket.off('task:deleted', handleTaskDeleted);
    };
  }, [socket, user, pagination.limit]);

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
