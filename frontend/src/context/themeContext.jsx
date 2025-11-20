import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext({
  darkMode: false,
  setDarkMode: () => {},
  compactView: false,
  setCompactView: () => {},
})

export function ThemeProvider({ children }) {
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
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
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
