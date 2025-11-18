import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * Tema y modo compacto (derivado del layout de v0).
 * Persistimos en localStorage para mantener la experiencia entre sesiones.
 */
const ThemeContext = createContext({
  darkMode: false,
  setDarkMode: () => {},
  compactView: false,
  setCompactView: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [compactView, setCompactView] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedCompactView = localStorage.getItem('compactView') === 'true';
    setDarkMode(savedDarkMode);
    setCompactView(savedCompactView);
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('compactView', String(compactView));
  }, [compactView]);

  const value = { darkMode, setDarkMode, compactView, setCompactView };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);
