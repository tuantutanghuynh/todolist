// ─── Todo API functions ────────────────────────────────────────────────────────
// Separate API calls into individual functions (service layer).
// React Query will call these functions in queryFn / mutationFn.

import apiClient from './axios'

// ── Todo API ───────────────────────────────────────────────────────────────────

export const todoApi = {
  // Get todo list (with filter, search, pagination)
  list: (params = {}) =>
    apiClient.get('/api/todos', { params }).then((r) => r.data),

  // Get statistics (runs 3 requests in parallel, returns stats object)
  stats: async () => {
    const [pending, completed, overdue] = await Promise.all([
      apiClient.get('/api/todos', { params: { status: 'pending', per_page: 1 } }),
      apiClient.get('/api/todos', { params: { status: 'completed', per_page: 1 } }),
      apiClient.get('/api/todos', { params: { status: 'overdue', per_page: 1 } }),
    ])
    return {
      pending: pending.data.meta.total,
      completed: completed.data.meta.total,
      overdue: overdue.data.meta.total,
    }
  },

  // Create new todo
  create: (data) =>
    apiClient.post('/api/todos', data).then((r) => r.data),

  // Update todo
  update: (id, data) =>
    apiClient.patch(`/api/todos/${id}`, data).then((r) => r.data),

  // Toggle completion
  toggle: (id) =>
    apiClient.patch(`/api/todos/${id}/toggle`).then((r) => r.data),

  // Delete todo
  delete: (id) =>
    apiClient.delete(`/api/todos/${id}`).then(() => undefined),
}

// ── Category API ───────────────────────────────────────────────────────────────

export const categoryApi = {
  // Get all categories (with pending_count)
  list: () =>
    apiClient.get('/api/categories').then((r) => r.data),

  // Create new category
  create: (data) =>
    apiClient.post('/api/categories', data).then((r) => r.data),

  // Update category
  update: (id, data) =>
    apiClient.patch(`/api/categories/${id}`, data).then((r) => r.data),

  // Delete category
  delete: (id) =>
    apiClient.delete(`/api/categories/${id}`).then(() => undefined),
}

// ── Sidebar counts API ─────────────────────────────────────────────────────────

export const sidebarApi = {
  counts: async () => {
    const [today, upcoming, overdue, completed] = await Promise.all([
      apiClient.get('/api/todos', { params: { status: 'due_today', per_page: 1 } }),
      apiClient.get('/api/todos', { params: { status: 'pending', per_page: 1 } }),
      apiClient.get('/api/todos', { params: { status: 'overdue', per_page: 1 } }),
      apiClient.get('/api/todos', { params: { status: 'completed', per_page: 1 } }),
    ])
    return {
      today: today.data.meta.total,
      upcoming: upcoming.data.meta.total,
      overdue: overdue.data.meta.total,
      completed: completed.data.meta.total,
    }
  },
}
