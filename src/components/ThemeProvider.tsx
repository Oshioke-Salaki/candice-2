'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'dark' | 'light'

interface ThemeCtx {
  theme: Theme
  toggle: () => void
}

const ThemeContext = createContext<ThemeCtx>({ theme: 'dark', toggle: () => {} })

export function useTheme() {
  return useContext(ThemeContext)
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const saved = (localStorage.getItem('wc-theme') as Theme) || 'dark'
    apply(saved)
    setTheme(saved)
  }, [])

  function apply(t: Theme) {
    const html = document.documentElement
    html.classList.remove('dark', 'light')
    html.classList.add(t)
  }

  function toggle() {
    setTheme(prev => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark'
      apply(next)
      localStorage.setItem('wc-theme', next)
      return next
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}
