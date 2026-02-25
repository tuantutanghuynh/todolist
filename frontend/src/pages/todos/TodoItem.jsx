import styles from './TodoItem.module.css'

export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const priorityClass =
    todo.priority === 3 ? styles.priorityHigh :
    todo.priority === 2 ? styles.priorityMedium :
    styles.priorityLow

  const cardClass = [
    styles.card,
    todo.is_completed ? styles.cardCompleted : '',
    todo.is_overdue && !todo.is_completed ? styles.cardOverdue : '',
  ].filter(Boolean).join(' ')

  const formatDate = (dateStr) => {
    if (!dateStr) return null
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
  }

  return (
    <div className={cardClass}>
      {/* Priority Indicator */}
      <div className={`${styles.priorityBar} ${priorityClass}`} />

      {/* Checkbox */}
      <button
        className={`${styles.checkbox} ${todo.is_completed ? styles.checkboxChecked : ''}`}
        onClick={() => onToggle(todo.id)}
        aria-label={todo.is_completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {todo.is_completed && (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={styles.checkIcon}>
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className={styles.content}>
        <h4 className={styles.title}>{todo.title}</h4>
        {todo.description && (
          <p className={styles.description}>{todo.description}</p>
        )}
        <div className={styles.meta}>
          {/* Category Badge */}
          {todo.category && (
            <span className={styles.categoryBadge}>
              {todo.category.name}
            </span>
          )}

          {/* Due Date */}
          {todo.due_date && (
            <span className={`${styles.dueDate} ${todo.is_overdue && !todo.is_completed ? styles.dueDateOverdue : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={styles.metaIcon}>
                <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
              </svg>
              {formatDate(todo.due_date)}
            </span>
          )}

          {/* Priority Label */}
          <span className={`${styles.priorityLabel} ${priorityClass}`}>
            {todo.priority_label}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button className={styles.actionBtn} title="Edit" onClick={() => onEdit(todo)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
          </svg>
        </button>
        <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`} title="Delete" onClick={() => onDelete(todo.id)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  )
}
