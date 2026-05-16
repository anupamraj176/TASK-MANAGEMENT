import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';
import { useSocket } from './useSocket';

export function useTask(id) {
  const socket = useSocket();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTask = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await taskService.getTask(id);
      setTask(data.task || data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load task.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  // Real-time socket event listeners for this specific task
  useEffect(() => {
    if (!socket || !id) return;

    const handleTaskUpdated = (updatedTask) => {
      const updatedId = updatedTask._id || updatedTask.id;
      if (updatedId === id) {
        setTask(updatedTask);
      }
    };

    const handleTaskDeleted = (deletedTask) => {
      const deletedId = deletedTask._id || deletedTask.id;
      if (deletedId === id) {
        setTask(null);
        setError('This task has been deleted.');
      }
    };

    socket.on('task:updated', handleTaskUpdated);
    socket.on('task:deleted', handleTaskDeleted);

    return () => {
      socket.off('task:updated', handleTaskUpdated);
      socket.off('task:deleted', handleTaskDeleted);
    };
  }, [socket, id]);

  const updateTask = useCallback(
    async (formData) => {
      const { data } = await taskService.updateTask(id, formData);
      setTask(data.task || data);
      return data;
    },
    [id]
  );

  const downloadDocument = useCallback(
    async (docId, filename) => {
      const response = await taskService.downloadDocument(id, docId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename || 'document.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    [id]
  );

  return { task, loading, error, refetch: fetchTask, updateTask, downloadDocument };
}
