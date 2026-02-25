import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { categoryApi, sidebarApi } from '@/lib/todoApi'
import CategoryModal from './CategoryModal'
import styles from './Sidebar.module.css'

export default function Sidebar() {
  const qc = useQueryClient()
  const [activeView, setActiveView] = useState('dashboard')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)

  // ── Queries ──────────────────────────────────────────────────────────────────

  const { data: categoriesData } = useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: categoryApi.list,
  })

  const { data: counts } = useQuery({
    queryKey: ['sidebar', 'counts'],
    queryFn: sidebarApi.counts,
    // Sidebar counts are less critical, cache for 1 minute
    staleTime: 60_000,
  })

  const categories = categoriesData?.data ?? []

  // ── Mutations ─────────────────────────────────────────────────────────────────

  const createMutation = useMutation({
    mutationFn: (data) => categoryApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.categories.all })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => categoryApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.categories.all })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => categoryApi.delete(id),
    // Optimistic update: remove immediately from list without waiting for server
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: queryKeys.categories.list() })
      const prev = qc.getQueryData(queryKeys.categories.list())
      qc.setQueryData(queryKeys.categories.list(), (old) => ({
        ...old,
        data: old.data.filter((c) => c.id !== id),
      }))
      return { prev }
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(queryKeys.categories.list(), ctx.prev)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.categories.all })
    },
  })

  // ── Handlers ──────────────────────────────────────────────────────────────────

  const handleOpenCreate = () => { setEditingCategory(null); setModalOpen(true) }

  const handleOpenEdit = (e, cat) => {
    e.stopPropagation()
    setEditingCategory(cat)
    setModalOpen(true)
  }

  const handleDelete = (e, id) => {
    e.stopPropagation()
    if (!window.confirm('Delete this category? Tasks in it will not be deleted.')) return
    deleteMutation.mutate(id)
  }

  const handleSubmit = async (form) => {
    const payload = {
      name: form.name,
      color: form.color,
      icon: form.icon || undefined,
    }
    if (editingCategory) {
      await updateMutation.mutateAsync({ id: editingCategory.id, data: payload })
    } else {
      await createMutation.mutateAsync(payload)
    }
  }

  return (
    <aside className={styles.sidebar}>
      {/* Quick Access */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Quick Access</div>
        <ul className={styles.navList}>
          <li>
            <button
              className={`${styles.navItem} ${activeView === 'dashboard' ? styles.navItemActive : ''}`}
              onClick={() => setActiveView('dashboard')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={styles.navIcon}>
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className={styles.navLabel}>Dashboard</span>
            </button>
          </li>
          <li>
            <button className={`${styles.navItem} ${activeView === 'today' ? styles.navItemActive : ''}`} onClick={() => setActiveView('today')}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={styles.navIcon}>
                <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
              </svg>
              <span className={styles.navLabel}>Today</span>
              {(counts?.today ?? 0) > 0 && <span className={styles.navBadge}>{counts.today}</span>}
            </button>
          </li>
          <li>
            <button className={`${styles.navItem} ${activeView === 'upcoming' ? styles.navItemActive : ''}`} onClick={() => setActiveView('upcoming')}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={styles.navIcon}>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
              </svg>
              <span className={styles.navLabel}>Upcoming</span>
              {(counts?.upcoming ?? 0) > 0 && <span className={styles.navBadge}>{counts.upcoming}</span>}
            </button>
          </li>
          <li>
            <button className={`${styles.navItem} ${activeView === 'overdue' ? styles.navItemActive : ''}`} onClick={() => setActiveView('overdue')}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={styles.navIcon}>
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <span className={styles.navLabel}>Overdue</span>
              {(counts?.overdue ?? 0) > 0 && <span className={`${styles.navBadge} ${styles.navBadgeDanger}`}>{counts.overdue}</span>}
            </button>
          </li>
          <li>
            <button className={`${styles.navItem} ${activeView === 'completed' ? styles.navItemActive : ''}`} onClick={() => setActiveView('completed')}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={styles.navIcon}>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              <span className={styles.navLabel}>Completed</span>
              {(counts?.completed ?? 0) > 0 && <span className={styles.navBadge}>{counts.completed}</span>}
            </button>
          </li>
        </ul>
      </div>

      <div className={styles.divider} />

      {/* Categories */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Categories</div>
        <ul className={styles.navList}>
          {categories.map((cat) => (
            <li key={cat.id} className={styles.categoryItem}>
              <button className={styles.navItem}>
                <span className={styles.categoryDot} style={{ backgroundColor: cat.color || '#c77dff' }} />
                <span className={styles.navLabel}>{cat.name}</span>
                {cat.pending_count > 0 && <span className={styles.navBadge}>{cat.pending_count}</span>}
              </button>
              <div className={styles.categoryActions}>
                <button className={styles.categoryActionBtn} title="Edit" onClick={(e) => handleOpenEdit(e, cat)}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                  </svg>
                </button>
                <button className={`${styles.categoryActionBtn} ${styles.categoryActionBtnDanger}`} title="Delete" onClick={(e) => handleDelete(e, cat.id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
        <button className={styles.addCategoryBtn} onClick={handleOpenCreate}>
          <span className={styles.addIcon}>+</span>
          <span>Add Category</span>
        </button>
      </div>

      <CategoryModal
        open={modalOpen}
        category={editingCategory}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </aside>
  )
}
