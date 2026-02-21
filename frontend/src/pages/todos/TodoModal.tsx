import { useEffect, useState } from 'react'
import type { Todo, Category } from '@/types/todo'
import styles from './TodoModal.module.css'

interface TodoModalProps {
  open: boolean
  todo?: Todo | null          // null = create mode, Todo = edit mode
  categories: Category[]
  onClose: () => void
  onSubmit: (data: TodoFormData) => Promise<void>
}

export interface TodoFormData {
  title: string
  description: string
  priority: 1 | 2 | 3
  due_date: string
  category_id: string
}

export default function TodoModal({ open, todo, categories, onClose, onSubmit }: TodoModalProps) {
  const [form, setForm] = useState<TodoFormData>({
    title: '',
    description: '',
    priority: 2,
    due_date: '',
    category_id: '',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<TodoFormData>>({})

  useEffect(() => {
    if (open) {
      if (todo) {
        setForm({
          title: todo.title,
          description: todo.description ?? '',
          priority: todo.priority,
          due_date: todo.due_date ?? '',
          category_id: todo.category_id ? String(todo.category_id) : '',
        })
      } else {
        setForm({ title: '', description: '', priority: 2, due_date: '', category_id: '' })
      }
      setErrors({})
    }
  }, [open, todo])

  const validate = (): boolean => {
    const errs: Partial<TodoFormData> = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    else if (form.title.length > 255) errs.title = 'Title must be under 255 characters'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await onSubmit(form)
      onClose()
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { errors?: Record<string, string[]> } } }
      if (axiosErr.response?.data?.errors) {
        const apiErrors = axiosErr.response.data.errors
        setErrors({
          title: apiErrors.title?.[0],
          description: apiErrors.description?.[0],
          due_date: apiErrors.due_date?.[0],
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  if (!open) return null

  return (
    <div className={styles.backdrop} onClick={handleBackdrop}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>{todo ? 'Edit Task' : 'New Task'}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Title */}
          <div className={styles.field}>
            <label className={styles.label}>
              Title <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
              placeholder="What needs to be done?"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              autoFocus
            />
            {errors.title && <p className={styles.errorText}>{errors.title}</p>}
          </div>

          {/* Description */}
          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea
              className={styles.textarea}
              placeholder="Add more details..."
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {/* Priority & Due Date */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Priority</label>
              <select
                className={styles.select}
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: Number(e.target.value) as 1 | 2 | 3 })}
              >
                <option value={1}>Low</option>
                <option value={2}>Medium</option>
                <option value={3}>High</option>
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Due Date</label>
              <input
                type="date"
                className={`${styles.input} ${errors.due_date ? styles.inputError : ''}`}
                value={form.due_date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
              />
              {errors.due_date && <p className={styles.errorText}>{errors.due_date}</p>}
            </div>
          </div>

          {/* Category */}
          <div className={styles.field}>
            <label className={styles.label}>Category</label>
            <select
              className={styles.select}
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            >
              <option value="">None</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button type="button" className={`btn btn-ghost ${styles.cancelBtn}`} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
              {loading ? (
                <span className={styles.spinner} />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={styles.btnIcon}>
                  {todo
                    ? <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                    : <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                  }
                </svg>
              )}
              {todo ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
