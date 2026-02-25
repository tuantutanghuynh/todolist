import { useState, useEffect } from 'react'

export function useDarkMode() {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('theme')
    if (saved) return saved

    // Then check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }

    return 'dark' // Default to dark mode
  })

  const isDark = theme === 'dark'

  useEffect(() => {
    const root = document.documentElement

    if (isDark) {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }

    localStorage.setItem('theme', theme)
  }, [theme, isDark])

  const toggle = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const setDark = () => setTheme('dark')
  const setLight = () => setTheme('light')

  return { theme, isDark, toggle, setDark, setLight }
}
