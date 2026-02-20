import { useAuth } from '@/contexts/AuthContext'
import styles from './Header.module.css'

export default function Header() {
  const { user, logout } = useAuth()

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.logoIcon}>&#10070;</div>
        <div className={styles.logoText}>
          Todo<span className={styles.logoAccent}>List</span>
        </div>
      </div>

      <div className={styles.actions}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>{initials}</div>
          <span className={styles.userName}>{user?.name}</span>
        </div>

        <button onClick={logout} className={styles.logoutBtn}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={styles.logoutIcon}
          >
            <path
              fillRule="evenodd"
              d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z"
              clipRule="evenodd"
            />
          </svg>
          Logout
        </button>
      </div>
    </header>
  )
}
