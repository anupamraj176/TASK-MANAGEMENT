import { create } from 'zustand'
import api from '../services/api'

const TASKS_URL = '/api/tasks'
const ADMIN_USERS_URL = '/api/admin/users'

const appendIfDefined = (formData, key, value) => {
  if (value === undefined || value === null || value === '') {
    return
  }
  formData.append(key, value)
}

const buildTaskFormData = (payload) => {
  const formData = new FormData()
  appendIfDefined(formData, 'title', payload.title)
  appendIfDefined(formData, 'description', payload.description)
  appendIfDefined(formData, 'status', payload.status)
  appendIfDefined(formData, 'priority', payload.priority)
  appendIfDefined(formData, 'dueDate', payload.dueDate)
  appendIfDefined(formData, 'assignedTo', payload.assignedTo)
  appendIfDefined(formData, 'replaceDocuments', payload.replaceDocuments)

  if (payload.removeDocumentIds?.length) {
    formData.append('removeDocumentIds', JSON.stringify(payload.removeDocumentIds))
  }

  if (payload.documents?.length) {
    payload.documents.forEach((file) => {
      formData.append('documents', file)
    })
  }

  return formData
}

export const useTaskStore = create((set) => ({
  tasks: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  isLoading: false,
  isSaving: false,
  detailLoading: false,
  error: null,
  selectedTask: null,
  users: [],
  isUsersLoading: false,

  fetchTasks: async (params = {}) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.get(TASKS_URL, { params })
      set({
        tasks: response.data.data || [],
        total: response.data.total || 0,
        page: response.data.page || 1,
        limit: response.data.limit || 10,
        totalPages: response.data.totalPages || 1,
        isLoading: false,
      })
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Unable to load tasks',
        isLoading: false,
      })
      throw error
    }
  },

  fetchTaskById: async (taskId) => {
    set({ detailLoading: true, error: null })
    try {
      const response = await api.get(`${TASKS_URL}/${taskId}`)
      set({ selectedTask: response.data.task, detailLoading: false })
      return response.data.task
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Unable to load task',
        detailLoading: false,
      })
      throw error
    }
  },

  createTask: async (payload) => {
    set({ isSaving: true, error: null })
    try {
      const response = await api.post(TASKS_URL, buildTaskFormData(payload))
      set({ isSaving: false })
      return response.data.task
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Unable to create task',
        isSaving: false,
      })
      throw error
    }
  },

  updateTask: async (taskId, payload) => {
    set({ isSaving: true, error: null })
    try {
      const response = await api.put(`${TASKS_URL}/${taskId}`, buildTaskFormData(payload))
      set({ isSaving: false })
      return response.data.task
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Unable to update task',
        isSaving: false,
      })
      throw error
    }
  },

  deleteTask: async (taskId) => {
    set({ isSaving: true, error: null })
    try {
      await api.delete(`${TASKS_URL}/${taskId}`)
      set({ isSaving: false })
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Unable to delete task',
        isSaving: false,
      })
      throw error
    }
  },

  fetchAssignableUsers: async () => {
    set({ isUsersLoading: true, error: null })
    try {
      const response = await api.get(ADMIN_USERS_URL)
      set({ users: response.data.users || [], isUsersLoading: false })
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Unable to load users',
        isUsersLoading: false,
      })
      throw error
    }
  },

  clearSelectedTask: () => set({ selectedTask: null }),
}))
