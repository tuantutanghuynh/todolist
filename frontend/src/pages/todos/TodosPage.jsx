import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'
import { queryKeys } from '@/lib/queryKeys'
import { todoApi, categoryApi } from '@/lib/todoApi'
import StatsCards from './StatsCards'
import TodoItem from './TodoItem'
import TodoModal from './TodoModal'
import styles from './TodosPage.module.css'

export default function TodosPage() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const [filter, setFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState(null)

  // ── Queries ──────────────────────────────────────────────────────────────────

  const { data: todosData, isLoading } = useQuery({
    queryKey: queryKeys.todos.list({ per_page: 20 }),
    queryFn: () => todoApi.list({ per_page: 20 }),
  })

  const { data: statsData } = useQuery({
    queryKey: queryKeys.todos.stats(),
    queryFn: todoApi.stats,
  })

  const { data: categoriesData } = useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: categoryApi.list,
  })

  const todos = todosData?.data ?? []
  const categories = categoriesData?.data ?? []
  const stats = {
    total: todosData?.meta.total ?? 0,
    pending: statsData?.pending ?? 0,
    completed: statsData?.completed ?? 0,
    overdue: statsData?.overdue ?? 0,
  }

  // ── Mutations ─────────────────────────────────────────────────────────────────

  // Toggle: use optimistic update so UI responds immediately
  const toggleMutation = useMutation({
    mutationFn: (id) => todoApi.toggle(id),
    onMutate: async (id) => {
      // Cancel all pending refetches to avoid overwriting the optimistic update
      await qc.cancelQueries({ queryKey: queryKeys.todos.lists() })
      // Save previous data for rollback on error
      const prev = qc.getQueryData(queryKeys.todos.list({ per_page: 20 }))
      // Update cache immediately (don't wait for server)
      qc.setQueryData(queryKeys.todos.list({ per_page: 20 }), (old) => ({
        ...old,
        data: old.data.map((t) =>
          t.id === id ? { ...t, is_completed: !t.is_completed } : t
        ),
      }))
      return { prev }
    },
    onError: (_err, _id, ctx) => {
      // Rollback if server returns an error
      if (ctx?.prev) qc.setQueryData(queryKeys.todos.list({ per_page: 20 }), ctx.prev)
    },
    onSettled: () => {
      // Always sync real data from server after mutation completes
      qc.invalidateQueries({ queryKey: queryKeys.todos.all })
    },
  })

  const createMutation = useMutation({
    mutationFn: (data) => todoApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.todos.all })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => todoApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.todos.all })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => todoApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.todos.all })
    },
  })

  // ── Handlers ──────────────────────────────────────────────────────────────────

  const handleToggle = (id) => toggleMutation.mutate(id)

  const handleOpenCreate = () => { setEditingTodo(null); setModalOpen(true) }

  const handleOpenEdit = (todo) => { setEditingTodo(todo); setModalOpen(true) }

  const handleDelete = (id) => {
    if (!window.confirm('Delete this task?')) return
    deleteMutation.mutate(id)
  }

  const handleSubmit = async (form) => {
    const payload = {
      title: form.title,
      description: form.description || undefined,
      priority: form.priority,
      due_date: form.due_date || undefined,
      category_id: form.category_id ? Number(form.category_id) : undefined,
    }
    if (editingTodo) {
      await updateMutation.mutateAsync({ id: editingTodo.id, data: payload })
    } else {
      await createMutation.mutateAsync(payload)
    }
  }

  // ── Filter ────────────────────────────────────────────────────────────────────

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.is_completed
    if (filter === 'completed') return todo.is_completed
    return true
  })

  const completionPercent =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

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
              {['all', 'active', 'completed'].map((f) => (
                <button
                  key={f}
                  className={`${styles.filterTab} ${filter === f ? styles.filterTabActive : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
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
          {isLoading ? (
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
              <button className="btn btn-primary btn-sm" onClick={handleOpenCreate}>
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
