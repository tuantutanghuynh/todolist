import { useEffect, useState } from 'react'
import apiClient from '@/lib/axios'
import type { Category } from '@/types/todo'
import styles from './Sidebar.module.css'

interface TodoCounts {
  today: number
  upcoming: number
  overdue: number
  completed: number
}

export default function Sidebar() {
  const [categories, setCategories] = useState<Category[]>([])
  const [counts, setCounts] = useState<TodoCounts>({ today: 0, upcoming: 0, overdue: 0, completed: 0 })
  const [activeView, setActiveView] = useState('dashboard')

  useEffect(() => {
    apiClient.get<{ data: Category[] }>('/api/categories').then(({ data }) => {
      setCategories(data.data)
    }).catch(() => {})

    // Fetch counts for sidebar badges
    Promise.all([
      apiClient.get('/api/todos', { params: { status: 'due_today', per_page: 1 } }),
      apiClient.get('/api/todos', { params: { status: 'pending', per_page: 1 } }),
      apiClient.get('/api/todos', { params: { status: 'overdue', per_page: 1 } }),
      apiClient.get('/api/todos', { params: { status: 'completed', per_page: 1 } }),
    ]).then(([today, upcoming, overdue, completed]) => {
      setCounts({
        today: today.data.meta.total,
        upcoming: upcoming.data.meta.total,
        overdue: overdue.data.meta.total,
        completed: completed.data.meta.total,
      })
    }).catch(() => {})
  }, [])

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
            <button
              className={`${styles.navItem} ${activeView === 'today' ? styles.navItemActive : ''}`}
              onClick={() => setActiveView('today')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={styles.navIcon}>
                <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
              </svg>
              <span className={styles.navLabel}>Today</span>
              {counts.today > 0 && <span className={styles.navBadge}>{counts.today}</span>}
            </button>
          </li>
          <li>
            <button
              className={`${styles.navItem} ${activeView === 'upcoming' ? styles.navItemActive : ''}`}
              onClick={() => setActiveView('upcoming')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={styles.navIcon}>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
              </svg>
              <span className={styles.navLabel}>Upcoming</span>
              {counts.upcoming > 0 && <span className={styles.navBadge}>{counts.upcoming}</span>}
            </button>
          </li>
          <li>
            <button
              className={`${styles.navItem} ${activeView === 'overdue' ? styles.navItemActive : ''}`}
              onClick={() => setActiveView('overdue')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={styles.navIcon}>
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <span className={styles.navLabel}>Overdue</span>
              {counts.overdue > 0 && <span className={`${styles.navBadge} ${styles.navBadgeDanger}`}>{counts.overdue}</span>}
            </button>
          </li>
          <li>
            <button
              className={`${styles.navItem} ${activeView === 'completed' ? styles.navItemActive : ''}`}
              onClick={() => setActiveView('completed')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={styles.navIcon}>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              <span className={styles.navLabel}>Completed</span>
              {counts.completed > 0 && <span className={styles.navBadge}>{counts.completed}</span>}
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
            <li key={cat.id}>
              <button className={styles.navItem}>
                <span
                  className={styles.categoryDot}
                  style={{ backgroundColor: cat.color || '#c77dff' }}
                />
                <span className={styles.navLabel}>{cat.name}</span>
                {cat.pending_count > 0 && (
                  <span className={styles.navBadge}>{cat.pending_count}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
        <button className={styles.addCategoryBtn}>
          <span className={styles.addIcon}>+</span>
          <span>Add Category</span>
        </button>
      </div>
    </aside>
  )
}
