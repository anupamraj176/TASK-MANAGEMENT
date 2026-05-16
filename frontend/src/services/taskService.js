import api from './api';

export const taskService = {
  getTasks: (params = {}) =>
    api.get('/api/tasks', { params }),

  getTask: (id) =>
    api.get(`/api/tasks/${id}`),

  createTask: (formData) =>
    api.post('/api/tasks', formData),

  updateTask: (id, formData) =>
    api.put(`/api/tasks/${id}`, formData),

  deleteTask: (id) =>
    api.delete(`/api/tasks/${id}`),

  downloadDocument: (taskId, docId) =>
    api.get(`/api/tasks/${taskId}/documents/${docId}`, { responseType: 'blob' }),
};
