'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface ThemeContextType {
  darkMode: boolean
  setDarkMode: (value: boolean) => void
  compactView: boolean
  setCompactView: (value: boolean) => void
}

const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  setDarkMode: () => {},
  compactView: false,
  setCompactView: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false)
  const [compactView, setCompactView] = useState(false)

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    const savedCompactView = localStorage.getItem('compactView') === 'true'
    setDarkMode(savedDarkMode)
    setCompactView(savedCompactView)
  }, [])

  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode))
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('compactView', String(compactView))
  }, [compactView])

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, compactView, setCompactView }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
