import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import apiClient from '@/lib/axios'
import type { Todo, Category, PaginatedResponse } from '@/types/todo'
import StatsCards from './StatsCards'
import TodoItem from './TodoItem'
import TodoModal, { type TodoFormData } from './TodoModal'
import styles from './TodosPage.module.css'

interface Stats {
  total: number
  pending: number
  completed: number
  overdue: number
}

export default function TodosPage() {
  const { user } = useAuth()
  const [todos, setTodos] = useState<Todo[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, completed: 0, overdue: 0 })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)

  useEffect(() => {
    fetchData()
    fetchCategories()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [todosRes, pendingRes, completedRes, overdueRes] = await Promise.all([
        apiClient.get<PaginatedResponse<Todo>>('/api/todos', { params: { per_page: 20 } }),
        apiClient.get<PaginatedResponse<Todo>>('/api/todos', { params: { status: 'pending', per_page: 1 } }),
        apiClient.get<PaginatedResponse<Todo>>('/api/todos', { params: { status: 'completed', per_page: 1 } }),
        apiClient.get<PaginatedResponse<Todo>>('/api/todos', { params: { status: 'overdue', per_page: 1 } }),
      ])
      setTodos(todosRes.data.data)
      setStats({
        total: todosRes.data.meta.total,
        pending: pendingRes.data.meta.total,
        completed: completedRes.data.meta.total,
        overdue: overdueRes.data.meta.total,
      })
    } catch (error) {
      console.error('Failed to fetch todos:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get<{ data: Category[] }>('/api/categories')
      setCategories(res.data.data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const handleToggle = async (id: number) => {
    try {
      await apiClient.patch(`/api/todos/${id}/toggle`)
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, is_completed: !todo.is_completed } : todo
        )
      )
      fetchData()
    } catch (error) {
      console.error('Failed to toggle todo:', error)
    }
  }

  const handleOpenCreate = () => {
    setEditingTodo(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (todo: Todo) => {
    setEditingTodo(todo)
    setModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this task?')) return
    try {
      await apiClient.delete(`/api/todos/${id}`)
      setTodos((prev) => prev.filter((t) => t.id !== id))
      fetchData()
    } catch (error) {
      console.error('Failed to delete todo:', error)
    }
  }

  const handleSubmit = async (data: TodoFormData) => {
    const payload = {
      title: data.title,
      description: data.description || undefined,
      priority: data.priority,
      due_date: data.due_date || undefined,
      category_id: data.category_id ? Number(data.category_id) : undefined,
    }

    if (editingTodo) {
      const res = await apiClient.patch<{ data: Todo }>(`/api/todos/${editingTodo.id}`, payload)
      setTodos((prev) =>
        prev.map((t) => (t.id === editingTodo.id ? res.data.data : t))
      )
    } else {
      const res = await apiClient.post<{ data: Todo }>('/api/todos', payload)
      setTodos((prev) => [res.data.data, ...prev])
    }
    fetchData()
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.is_completed
    if (filter === 'completed') return todo.is_completed
    return true
  })

  const completionPercent = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  return (
    <div className={styles.page}>
      {/* Welcome Banner */}
      <div className={styles.banner}>
        <div className={styles.bannerContent}>
          <span className={styles.bannerBadge}>{completionPercent}% Complete</span>
          <h1 className={styles.bannerTitle}>Welcome, {user?.name?.split(' ')[0]}</h1>
          <p className={styles.bannerSubtitle}>To your Task Dashboard</p>
          <div className={styles.progressWrap}>
            <span className={styles.progressLabel}>Task Completion</span>
            <span className={styles.progressValue}>{completionPercent}%</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${completionPercent}%` }} />
          </div>
        </div>
        <div className={styles.bannerAvatar}>
          {user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards
        total={stats.total}
        pending={stats.pending}
        completed={stats.completed}
        overdue={stats.overdue}
      />

      {/* Tasks Section */}
      <div className={styles.tasksSection}>
        <div className={styles.tasksHeader}>
          <div className={styles.tasksTitle}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={styles.tasksTitleIcon}>
              <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
            </svg>
            Today's Tasks
          </div>
          <div className={styles.tasksHeaderRight}>
            <div className={styles.filterTabs}>
              <button
                className={`${styles.filterTab} ${filter === 'all' ? styles.filterTabActive : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`${styles.filterTab} ${filter === 'active' ? styles.filterTabActive : ''}`}
                onClick={() => setFilter('active')}
              >
                Active
              </button>
              <button
                className={`${styles.filterTab} ${filter === 'completed' ? styles.filterTabActive : ''}`}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
            </div>
            <button className={`btn btn-primary ${styles.addBtn}`} onClick={handleOpenCreate}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={styles.addBtnIcon}>
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              New Task
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className={styles.tasksList}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              <span>Loading tasks...</span>
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className={styles.emptyState}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={styles.emptyIcon}>
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM6.39 9.967l2.18 2.179a.75.75 0 001.117.026l4.5-4.5a.75.75 0 10-1.061-1.06l-3.942 3.94-1.121-1.12a.75.75 0 00-1.06 1.06l.387.375z" />
              </svg>
              <p>No tasks found</p>
              <button className={`btn btn-primary btn-sm`} onClick={handleOpenCreate}>
                Add your first task
              </button>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      <TodoModal
        open={modalOpen}
        todo={editingTodo}
        categories={categories}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
