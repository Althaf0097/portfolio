import { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext({
  theme: 'dark-red',
  toggleTheme: () => {},
  isDarkRed: true,
});

export const ThemeProvider = ({ children }) => {
  useEffect(() => {
    try {
      localStorage.setItem('portfolio_theme', 'dark-red');
      localStorage.setItem('theme', 'dark-red');
    } catch {
      console.warn('Could not save theme to localStorage');
    }
    const root = document.documentElement;
    root.classList.add('dark', 'dark-theme', 'theme-dark-red');
    root.classList.remove('light', 'light-theme', 'theme-light-blue');
    root.setAttribute('data-theme', 'dark-red');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: 'dark-red', toggleTheme: () => {}, isDarkRed: true }}>
      {children}
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
