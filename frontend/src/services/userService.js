import api from './api';

export const userService = {
  getUsers: (params = {}) =>
    api.get('/api/users', { params }),

  getUser: (id) =>
    api.get(`/api/users/${id}`),

  createUser: (userData) =>
    api.post('/api/users', userData),

  updateUser: (id, userData) =>
    api.put(`/api/users/${id}`, userData),

  deleteUser: (id) =>
    api.delete(`/api/users/${id}`),
};
