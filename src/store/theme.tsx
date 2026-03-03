import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface ThemeTokens {
  // Mode
  isDark: boolean;

  // Page & surface
  bg: string;
  surface: string;
  surfaceAlt: string;
  surfaceHover: string;

  // Borders
  border: string;
  borderLight: string;

  // Text
  text: string;
  textSecondary: string;
  textTertiary: string;

  // Accent (teal)
  accent: string;
  accentDark: string;
  accentLight: string;
  accentBg: string;
  accentBorder: string;

  // Input
  inputBg: string;
  inputBorder: string;

  // Progress bars
  progressBg: string;

  // Shadows & overlay
  shadow: string;
  shadowLg: string;
  overlay: string;

  // Scrollbar
  scrollbarTrack: string;
  scrollbarThumb: string;
  scrollbarThumbHover: string;

  // Toast
  toastBg: string;
  toastBorder: string;
  toastShadow: string;
  toastText: string;

  // Specific semantic
  dangerText: string;
  dangerBg: string;
  dangerBorder: string;

  // Logo
  logoText: string;
  subtitleText: string;

  // Stats / counts label
  statBg: string;
  statText: string;

  // Formula
  formulaBg: string;
  formulaBorder: string;

  // Sandbox
  sandboxBg: string;
  sandboxBgHover: string;
  sandboxBorder: string;
  sandboxBorderHover: string;
  sandboxEmptyIcon: string;
  sandboxDotColor: string;
}

const lightTheme: ThemeTokens = {
  isDark: false,
  bg: '#f8fafc',
  surface: '#ffffff',
  surfaceAlt: '#f8fafc',
  surfaceHover: '#f0fdfa',

  border: '#e2e8f0',
  borderLight: '#f1f5f9',

  text: '#1e293b',
  textSecondary: '#64748b',
  textTertiary: '#94a3b8',

  accent: '#14b8a6',
  accentDark: '#0d9488',
  accentLight: '#5eead4',
  accentBg: '#f0fdfa',
  accentBorder: '#99f6e4',

  inputBg: '#f8fafc',
  inputBorder: '#e2e8f0',

  progressBg: '#e2e8f0',

  shadow: '0 1px 3px rgba(0,0,0,0.04)',
  shadowLg: '0 8px 32px rgba(0,0,0,0.12)',
  overlay: 'rgba(0,0,0,0.3)',

  scrollbarTrack: '#f1f5f9',
  scrollbarThumb: '#94a3b8',
  scrollbarThumbHover: '#64748b',

  toastBg: '#ffffff',
  toastBorder: '#14b8a6',
  toastShadow: '0 4px 16px rgba(0,0,0,0.1), 0 0 0 1px rgba(20,184,166,0.2)',
  toastText: '#0f766e',

  dangerText: '#ef4444',
  dangerBg: '#fef2f2',
  dangerBorder: '#fecaca',

  logoText: '#0f172a',
  subtitleText: '#94a3b8',

  statBg: '#f1f5f9',
  statText: '#94a3b8',

  formulaBg: '#ffffff',
  formulaBorder: '#99f6e4',

  sandboxBg: 'linear-gradient(135deg, #f8fafc 0%, #f0fdfa 50%, #ecfdf5 100%)',
  sandboxBgHover: '#f0fdfa',
  sandboxBorder: '#cbd5e1',
  sandboxBorderHover: '#14b8a6',
  sandboxEmptyIcon: '#e2e8f0',
  sandboxDotColor: '#94a3b8',
};

const darkTheme: ThemeTokens = {
  isDark: true,
  bg: '#0c1222',
  surface: '#162032',
  surfaceAlt: '#1a2740',
  surfaceHover: '#1a3a3a',

  border: '#2a3a52',
  borderLight: '#1e2e46',

  text: '#e8edf5',
  textSecondary: '#8899b0',
  textTertiary: '#5a6f8a',

  accent: '#2dd4bf',
  accentDark: '#14b8a6',
  accentLight: '#5eead4',
  accentBg: '#0d2e2e',
  accentBorder: '#1a5c5c',

  inputBg: '#1a2740',
  inputBorder: '#2a3a52',

  progressBg: '#2a3a52',

  shadow: '0 1px 3px rgba(0,0,0,0.3)',
  shadowLg: '0 8px 32px rgba(0,0,0,0.5)',
  overlay: 'rgba(0,0,0,0.6)',

  scrollbarTrack: '#162032',
  scrollbarThumb: '#3a4f6a',
  scrollbarThumbHover: '#5a6f8a',

  toastBg: '#162032',
  toastBorder: '#2dd4bf',
  toastShadow: '0 4px 16px rgba(0,0,0,0.4), 0 0 0 1px rgba(45,212,191,0.3)',
  toastText: '#2dd4bf',

  dangerText: '#f87171',
  dangerBg: '#2a1a1a',
  dangerBorder: '#7f1d1d',

  logoText: '#f1f5f9',
  subtitleText: '#5a6f8a',

  statBg: '#1a2740',
  statText: '#5a6f8a',

  formulaBg: '#162032',
  formulaBorder: '#1a5c5c',

  sandboxBg: 'linear-gradient(135deg, #0c1222 0%, #0d2222 50%, #0a1e1a 100%)',
  sandboxBgHover: '#0d2e2e',
  sandboxBorder: '#2a3a52',
  sandboxBorderHover: '#2dd4bf',
  sandboxEmptyIcon: '#2a3a52',
  sandboxDotColor: '#2a3a52',
};

type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  theme: ThemeTokens;
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('scilab-theme');
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return 'light';
  });

  useEffect(() => {
    localStorage.setItem('scilab-theme', mode);
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const toggleTheme = () => setMode(m => m === 'light' ? 'dark' : 'light');
  const theme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
