import api from './api';

export const userService = {
  getUsers: (params = {}) =>
    api.get('/api/users', { params }),

  getUser: (id) =>
    api.get(`/api/users/${id}`),
};
