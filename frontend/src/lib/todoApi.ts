// ─── Todo API functions ────────────────────────────────────────────────────────
// Separate API calls into individual functions (service layer).
// React Query will call these functions in queryFn / mutationFn.

import apiClient from './axios'
import type { Todo, Category, PaginatedResponse } from '@/types/todo'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface TodoListParams {
  status?: 'pending' | 'completed' | 'overdue' | 'due_today'
  search?: string
  per_page?: number
  sort_by?: string
  sort_dir?: 'asc' | 'desc'
}

export interface TodoPayload {
  title: string
  description?: string
  priority?: 1 | 2 | 3
  due_date?: string
  category_id?: number
}

export interface CategoryPayload {
  name: string
  color?: string
  icon?: string
}

// ── Todo API ───────────────────────────────────────────────────────────────────

export const todoApi = {
  // Get todo list (with filter, search, pagination)
  list: (params: TodoListParams = {}): Promise<PaginatedResponse<Todo>> =>
    apiClient.get('/api/todos', { params }).then((r) => r.data),

  // Get statistics (runs 3 requests in parallel, returns stats object)
  stats: async () => {
    const [pending, completed, overdue] = await Promise.all([
      apiClient.get<PaginatedResponse<Todo>>('/api/todos', { params: { status: 'pending', per_page: 1 } }),
      apiClient.get<PaginatedResponse<Todo>>('/api/todos', { params: { status: 'completed', per_page: 1 } }),
      apiClient.get<PaginatedResponse<Todo>>('/api/todos', { params: { status: 'overdue', per_page: 1 } }),
    ])
    return {
      pending: pending.data.meta.total,
      completed: completed.data.meta.total,
      overdue: overdue.data.meta.total,
    }
  },

  // Create new todo
  create: (data: TodoPayload): Promise<{ data: Todo }> =>
    apiClient.post('/api/todos', data).then((r) => r.data),

  // Update todo
  update: (id: number, data: Partial<TodoPayload>): Promise<{ data: Todo }> =>
    apiClient.patch(`/api/todos/${id}`, data).then((r) => r.data),

  // Toggle completion
  toggle: (id: number): Promise<{ data: Todo }> =>
    apiClient.patch(`/api/todos/${id}/toggle`).then((r) => r.data),

  // Delete todo
  delete: (id: number): Promise<void> =>
    apiClient.delete(`/api/todos/${id}`).then(() => undefined),
}

// ── Category API ───────────────────────────────────────────────────────────────

export const categoryApi = {
  // Get all categories (with pending_count)
  list: (): Promise<{ data: Category[] }> =>
    apiClient.get('/api/categories').then((r) => r.data),

  // Create new category
  create: (data: CategoryPayload): Promise<{ data: Category }> =>
    apiClient.post('/api/categories', data).then((r) => r.data),

  // Update category
  update: (id: number, data: CategoryPayload): Promise<{ data: Category }> =>
    apiClient.patch(`/api/categories/${id}`, data).then((r) => r.data),

  // Delete category
  delete: (id: number): Promise<void> =>
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
