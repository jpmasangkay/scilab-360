import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface ThemeTokens {
  isDark: boolean;

  bg: string;
  surface: string;
  surfaceAlt: string;
  surfaceHover: string;

  border: string;
  borderLight: string;

  text: string;
  textSecondary: string;
  textTertiary: string;

  accent: string;
  accentDark: string;
  accentLight: string;
  accentBg: string;
  accentBorder: string;

  inputBg: string;
  inputBorder: string;

  progressBg: string;

  shadow: string;
  shadowLg: string;
  overlay: string;

  scrollbarTrack: string;
  scrollbarThumb: string;
  scrollbarThumbHover: string;

  toastBg: string;
  toastBorder: string;
  toastShadow: string;
  toastText: string;

  dangerText: string;
  dangerBg: string;
  dangerBorder: string;

  logoText: string;
  subtitleText: string;

  statBg: string;
  statText: string;

  formulaBg: string;
  formulaBorder: string;

  sandboxBg: string;
  sandboxBgHover: string;
  sandboxBorder: string;
  sandboxBorderHover: string;
  sandboxEmptyIcon: string;
  sandboxDotColor: string;
}

// ─── Light: Laiya Beach — warm sand, Tayabas Bay teal ───────────────────────
const lightTheme: ThemeTokens = {
  isDark: false,
  // Sandy warm backgrounds — like the white sand beaches of Laiya
  bg:           '#F5EFE4',
  surface:      '#FDFAF5',
  surfaceAlt:   '#EDE5D6',
  surfaceHover: '#E4F2F0',

  // Earthy porous borders — pottery & stone
  border:      '#D4C8B4',
  borderLight: '#E8DECE',

  // Text inspired by deep mangrove green-black
  text:          '#1A2826',
  textSecondary: '#566860',
  textTertiary:  '#96AEA8',

  // Tayabas Bay ocean teal — the deep clear water off Laiya
  accent:       '#0E6B68',
  accentDark:   '#094E4C',
  accentLight:  '#3BA8A2',
  accentBg:     '#E4F3F2',
  accentBorder: '#9AD4D0',

  inputBg:     '#FDFAF5',
  inputBorder: '#D4C8B4',

  progressBg: '#D8CFC0',

  shadow:   '0 1px 4px rgba(26,40,38,0.07)',
  shadowLg: '0 8px 36px rgba(26,40,38,0.14)',
  overlay:  'rgba(10,20,18,0.35)',

  scrollbarTrack:     '#EDE5D6',
  scrollbarThumb:     '#B8A898',
  scrollbarThumbHover:'#8A7C6E',

  toastBg:     '#FDFAF5',
  toastBorder: '#0E6B68',
  toastShadow: '0 4px 20px rgba(14,107,104,0.15), 0 0 0 1px rgba(14,107,104,0.2)',
  toastText:   '#094E4C',

  // Pottery terracotta for danger/destructive actions
  dangerText:   '#B85030',
  dangerBg:     '#FBF0EA',
  dangerBorder: '#E4B09A',

  logoText:    '#1A2826',
  subtitleText:'#96AEA8',

  statBg:  '#EDE5D6',
  statText:'#96AEA8',

  formulaBg:     '#FDFAF5',
  formulaBorder: '#9AD4D0',

  // Sandbox: flat sandy tone (no gradient)
  sandboxBg:          '#F0EAE0',
  sandboxBgHover:     '#E4F2F0',
  sandboxBorder:      '#C8C0B0',
  sandboxBorderHover: '#0E6B68',
  sandboxEmptyIcon:   '#D8CFBE',
  sandboxDotColor:    '#C4B89E',
};

// ─── Dark: Deep ocean floor — Tayabas Bay at night ──────────────────────────
const darkTheme: ThemeTokens = {
  isDark: true,
  // Deep ocean floor — like the sea at night off San Juan's coast
  bg:           '#0C1918',
  surface:      '#152422',
  surfaceAlt:   '#1C3230',
  surfaceHover: '#1C3A38',

  border:      '#2A4240',
  borderLight: '#1E3230',

  text:          '#E8F0EE',
  textSecondary: '#7A9A96',
  textTertiary:  '#4A6A66',

  // Bioluminescent ocean teal — glowing sea at night
  accent:       '#2EC4BC',
  accentDark:   '#1A8C86',
  accentLight:  '#5ED8D2',
  accentBg:     '#0C2E2C',
  accentBorder: '#1A5C58',

  inputBg:     '#1C3230',
  inputBorder: '#2A4240',

  progressBg: '#2A4240',

  shadow:   '0 1px 4px rgba(0,0,0,0.35)',
  shadowLg: '0 8px 36px rgba(0,0,0,0.55)',
  overlay:  'rgba(0,0,0,0.65)',

  scrollbarTrack:      '#1A2A28',
  scrollbarThumb:      '#3A5250',
  scrollbarThumbHover: '#5A7270',

  toastBg:     '#152422',
  toastBorder: '#2EC4BC',
  toastShadow: '0 4px 20px rgba(0,0,0,0.45), 0 0 0 1px rgba(46,196,188,0.3)',
  toastText:   '#2EC4BC',

  // Terracotta pottery glow for danger
  dangerText:   '#E87050',
  dangerBg:     '#2A1A14',
  dangerBorder: '#7A3020',

  logoText:    '#E8F0EE',
  subtitleText:'#4A6A66',

  statBg:  '#1C3230',
  statText:'#4A6A66',

  formulaBg:     '#152422',
  formulaBorder: '#1A5C58',

  // Sandbox: flat deep ocean tone (no gradient)
  sandboxBg:          '#0E2220',
  sandboxBgHover:     '#0C2E2C',
  sandboxBorder:      '#2A4240',
  sandboxBorderHover: '#2EC4BC',
  sandboxEmptyIcon:   '#2A4240',
  sandboxDotColor:    '#1E3430',
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
