// ─── Todo API functions ────────────────────────────────────────────────────────
// Tách API calls thành các hàm riêng (service layer).
// React Query sẽ gọi những hàm này trong queryFn / mutationFn.

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
  // Lấy danh sách todos (có filter, search, pagination)
  list: (params: TodoListParams = {}): Promise<PaginatedResponse<Todo>> =>
    apiClient.get('/api/todos', { params }).then((r) => r.data),

  // Lấy thống kê (gọi 4 request song song, trả về object stats)
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

  // Tạo todo mới
  create: (data: TodoPayload): Promise<{ data: Todo }> =>
    apiClient.post('/api/todos', data).then((r) => r.data),

  // Cập nhật todo
  update: (id: number, data: Partial<TodoPayload>): Promise<{ data: Todo }> =>
    apiClient.patch(`/api/todos/${id}`, data).then((r) => r.data),

  // Toggle hoàn thành
  toggle: (id: number): Promise<{ data: Todo }> =>
    apiClient.patch(`/api/todos/${id}/toggle`).then((r) => r.data),

  // Xóa todo
  delete: (id: number): Promise<void> =>
    apiClient.delete(`/api/todos/${id}`).then(() => undefined),
}

// ── Category API ───────────────────────────────────────────────────────────────

export const categoryApi = {
  // Lấy tất cả categories (kèm pending_count)
  list: (): Promise<{ data: Category[] }> =>
    apiClient.get('/api/categories').then((r) => r.data),

  // Tạo category mới
  create: (data: CategoryPayload): Promise<{ data: Category }> =>
    apiClient.post('/api/categories', data).then((r) => r.data),

  // Cập nhật category
  update: (id: number, data: CategoryPayload): Promise<{ data: Category }> =>
    apiClient.patch(`/api/categories/${id}`, data).then((r) => r.data),

  // Xóa category
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
