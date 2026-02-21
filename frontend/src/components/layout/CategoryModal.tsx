import { useEffect, useState } from 'react'
import type { Category } from '@/types/todo'
import styles from './CategoryModal.module.css'

interface CategoryModalProps {
  open: boolean
  category?: Category | null   // null = create mode
  onClose: () => void
  onSubmit: (data: CategoryFormData) => Promise<void>
}

export interface CategoryFormData {
  name: string
  color: string
  icon: string
}

const PRESET_COLORS = [
  '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444',
  '#f59e0b', '#10b981', '#14b8a6', '#f97316',
]

export default function CategoryModal({ open, category, onClose, onSubmit }: CategoryModalProps) {
  const [form, setForm] = useState<CategoryFormData>({ name: '', color: '#8b5cf6', icon: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<CategoryFormData>>({})

  useEffect(() => {
    if (open) {
      if (category) {
        setForm({
          name: category.name,
          color: category.color || '#8b5cf6',
          icon: category.icon || '',
        })
      } else {
        setForm({ name: '', color: '#8b5cf6', icon: '' })
      }
      setErrors({})
    }
  }, [open, category])

  const validate = (): boolean => {
    const errs: Partial<CategoryFormData> = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    else if (form.name.length > 100) errs.name = 'Name must be under 100 characters'
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
        setErrors({ name: apiErrors.name?.[0] })
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
          <h2 className={styles.title}>{category ? 'Edit Category' : 'New Category'}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Preview */}
          <div className={styles.preview}>
            <span className={styles.previewDot} style={{ backgroundColor: form.color }} />
            <span className={styles.previewName}>{form.name || 'Category name'}</span>
          </div>

          {/* Name */}
          <div className={styles.field}>
            <label className={styles.label}>
              Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              placeholder="e.g. Work, Personal..."
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              autoFocus
              maxLength={100}
            />
            {errors.name && <p className={styles.errorText}>{errors.name}</p>}
          </div>

          {/* Color */}
          <div className={styles.field}>
            <label className={styles.label}>Color</label>
            <div className={styles.colorPicker}>
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`${styles.colorSwatch} ${form.color === color ? styles.colorSwatchActive : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setForm({ ...form, color })}
                  aria-label={color}
                />
              ))}
              <input
                type="color"
                className={styles.colorInput}
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                title="Custom color"
              />
            </div>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button type="button" className={`btn btn-ghost ${styles.cancelBtn}`} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : null}
              {category ? 'Save Changes' : 'Add Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
