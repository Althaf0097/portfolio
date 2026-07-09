/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
  theme: 'dark-red',
  toggleTheme: () => {},
  isDarkRed: true,
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('portfolio_theme') || localStorage.getItem('theme');
      return saved === 'light-blue' || saved === 'dark-red' ? saved : 'dark-red';
    } catch {
      return 'dark-red';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('portfolio_theme', theme);
      localStorage.setItem('theme', theme);
    } catch (e) {
      console.warn('Could not save theme to localStorage', e);
    }
    const root = document.documentElement;
    if (theme === 'dark-red') {
      root.classList.add('dark', 'dark-theme', 'theme-dark-red');
      root.classList.remove('light', 'light-theme', 'theme-light-blue');
      root.setAttribute('data-theme', 'dark-red');
    } else {
      root.classList.add('light', 'light-theme', 'theme-light-blue');
      root.classList.remove('dark', 'dark-theme', 'theme-dark-red');
      root.setAttribute('data-theme', 'light-blue');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark-red' ? 'light-blue' : 'dark-red'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDarkRed: theme === 'dark-red' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
