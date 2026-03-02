import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getTheme, type ThemeColors } from '../utils/theme';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  t: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
  t: getTheme(false),
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem('scilab360-theme') === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('scilab360-theme', isDark ? 'dark' : 'light');
    } catch {
      // ignore
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);
  const t = getTheme(isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, t }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
