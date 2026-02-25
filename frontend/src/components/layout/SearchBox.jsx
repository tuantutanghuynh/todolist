import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { todoApi } from '@/lib/todoApi'
import styles from './SearchBox.module.css'

// ─── Debounce hook ────────────────────────────────────────────────────────────
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

const PRIORITY_COLORS = { 1: '#3b82f6', 2: '#f59e0b', 3: '#ef4444' }
const PRIORITY_LABELS = { 1: 'Low', 2: 'Med', 3: 'High' }

export default function SearchBox() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef(null)
  const inputRef = useRef(null)
  const debouncedQuery = useDebounce(query, 350)

  // ── React Query: only fetch when there is a keyword ──────────────────────────
  const { data, isFetching } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => todoApi.list({ search: debouncedQuery, per_page: 8 }),
    enabled: debouncedQuery.trim().length > 0,  // Don't fetch when query is empty
    staleTime: 30_000,  // Cache results for 30 seconds
    placeholderData: (prev) => prev,  // Keep previous results while loading new ones
  })

  const results = data?.data ?? []

  // ── Click outside ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // ── Ctrl+K shortcut ───────────────────────────────────────────────────────────
  useEffect(() => {
    const handleKeydown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setIsOpen(true)
      }
    }
    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [])

  // ── Handlers ──────────────────────────────────────────────────────────────────
  const handleInputChange = (e) => {
    setQuery(e.target.value)
    setIsOpen(true)
    setActiveIndex(-1)
  }

  const handleFocus = () => {
    if (query.trim()) setIsOpen(true)
  }

  const handleClear = () => {
    setQuery('')
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (!isOpen) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, -1))
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return null
    return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
  }

  const showDropdown = isOpen && query.trim().length > 0

  return (
    <div className={styles.container} ref={containerRef}>
      {/* Search Input */}
      <div className={styles.inputWrap}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={styles.searchIcon}>
          <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          placeholder="Search tasks… (Ctrl+K)"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        {isFetching && <span className={styles.spinner} />}
        {query && !isFetching && (
          <button className={styles.clearBtn} onClick={handleClear} aria-label="Clear search">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className={styles.dropdown}>
          {results.length === 0 && !isFetching ? (
            <div className={styles.empty}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={styles.emptyIcon}>
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
              </svg>
              <span>No results for "<strong>{query}</strong>"</span>
            </div>
          ) : (
            <>
              <div className={styles.dropdownHeader}>
                {results.length} result{results.length !== 1 ? 's' : ''} found
              </div>
              <ul className={styles.resultList}>
                {results.map((todo, index) => (
                  <li key={todo.id}>
                    <div
                      className={`${styles.resultItem} ${index === activeIndex ? styles.resultItemActive : ''}`}
                      onMouseEnter={() => setActiveIndex(index)}
                    >
                      <div className={styles.priorityBar} style={{ backgroundColor: PRIORITY_COLORS[todo.priority] }} />
                      <div className={`${styles.statusDot} ${todo.is_completed ? styles.statusDotDone : ''}`}>
                        {todo.is_completed && (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className={styles.resultContent}>
                        <span className={`${styles.resultTitle} ${todo.is_completed ? styles.resultTitleDone : ''}`}>
                          {highlightMatch(todo.title, query)}
                        </span>
                        <div className={styles.resultMeta}>
                          {todo.category && <span className={styles.metaCategory}>{todo.category.name}</span>}
                          <span className={styles.metaPriority} style={{ color: PRIORITY_COLORS[todo.priority] }}>
                            {PRIORITY_LABELS[todo.priority]}
                          </span>
                          {todo.due_date && (
                            <span className={`${styles.metaDate} ${todo.is_overdue && !todo.is_completed ? styles.metaDateOverdue : ''}`}>
                              {formatDate(todo.due_date)}
                            </span>
                          )}
                          {todo.is_overdue && !todo.is_completed && (
                            <span className={styles.metaOverdue}>Overdue</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className={styles.dropdownFooter}>
                <kbd className={styles.kbd}>↑↓</kbd> navigate &nbsp;
                <kbd className={styles.kbd}>Esc</kbd> close
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function highlightMatch(text, query) {
  if (!query.trim()) return <>{text}</>
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? <mark key={i} className={styles.highlight}>{part}</mark> : part
      )}
    </>
  )
}
