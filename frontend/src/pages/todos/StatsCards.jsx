import styles from './StatsCards.module.css'

export default function StatsCards({ total, pending, completed, overdue }) {
  return (
    <div className={styles.grid}>
      {/* Total Tasks */}
      <div className={`${styles.card} ${styles.cardTotal}`}>
        <div className={styles.iconWrap}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={styles.icon}>
            <path d="M5.127 3.502L5.25 3.5h9.5c.041 0 .082 0 .123.002A2.251 2.251 0 0012.75 2h-5.5a2.25 2.25 0 00-2.123 1.502zM1 10.75A2.25 2.25 0 013.25 8.5h13.5A2.25 2.25 0 0119 10.75v5.5A2.25 2.25 0 0116.75 18.5H3.25A2.25 2.25 0 011 16.25v-5.5zM3.25 6.5c-.04 0-.082 0-.123.002A2.25 2.25 0 015.25 5h9.5c.98 0 1.814.627 2.123 1.502a3.819 3.819 0 00-.123-.002H3.25z" />
          </svg>
        </div>
        <div className={styles.info}>
          <span className={styles.label}>Total Tasks</span>
          <span className={styles.value}>{total}</span>
        </div>
      </div>

      {/* Pending */}
      <div className={`${styles.card} ${styles.cardPending}`}>
        <div className={styles.iconWrap}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={styles.icon}>
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
          </svg>
        </div>
        <div className={styles.info}>
          <span className={styles.label}>Pending</span>
          <span className={styles.value}>{pending}</span>
        </div>
      </div>

      {/* Completed */}
      <div className={`${styles.card} ${styles.cardCompleted}`}>
        <div className={styles.iconWrap}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={styles.icon}>
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
          </svg>
        </div>
        <div className={styles.info}>
          <span className={styles.label}>Completed</span>
          <span className={styles.value}>{completed}</span>
        </div>
      </div>

      {/* Overdue */}
      <div className={`${styles.card} ${styles.cardOverdue}`}>
        <div className={styles.iconWrap}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={styles.icon}>
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </div>
        <div className={styles.info}>
          <span className={styles.label}>Overdue</span>
          <span className={styles.value}>{overdue}</span>
        </div>
      </div>
    </div>
  )
}
