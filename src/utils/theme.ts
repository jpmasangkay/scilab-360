export interface ThemeColors {
  bg: {
    app: string;
    card: string;
    cardAlt: string;
    input: string;
    sandbox: string;
    sandboxHover: string;
    overlay: string;
    muted: string;
    progressBar: string;
  };
  border: {
    default: string;
    subtle: string;
    dashed: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    accent: string;
    heading: string;
  };
  accent: {
    primary: string;
    primaryHover: string;
  };
  feedback: {
    successBg: string;
    successText: string;
    successBorder: string;
    errorBg: string;
    errorText: string;
    errorBorder: string;
    warningBg: string;
    warningText: string;
    warningBorder: string;
    infoBg: string;
    infoText: string;
    infoBorder: string;
  };
  diff: {
    easy: { bg: string; text: string; border: string };
    medium: { bg: string; text: string; border: string };
    hard: { bg: string; text: string; border: string };
  };
  shadow: {
    card: string;
    panel: string;
    popup: string;
  };
  toast: {
    bg: string;
    border: string;
    text: string;
  };
  scoreBanner: {
    bg: string;
    border: string;
    statBg: string;
    statBorder: string;
    divider: string;
  };
  bubble: {
    opacity: number;
  };
  dot: {
    fill: string;
  };
}

const lightTheme: ThemeColors = {
  bg: {
    app: '#f8fafc',
    card: '#ffffff',
    cardAlt: '#f8fafc',
    input: '#f8fafc',
    sandbox: 'linear-gradient(135deg, #f8fafc 0%, #f0fdfa 50%, #ecfdf5 100%)',
    sandboxHover: '#f0fdfa',
    overlay: 'rgba(0,0,0,0.3)',
    muted: '#f1f5f9',
    progressBar: '#e2e8f0',
  },
  border: {
    default: '#e2e8f0',
    subtle: '#f1f5f9',
    dashed: '#cbd5e1',
  },
  text: {
    primary: '#1e293b',
    secondary: '#475569',
    muted: '#94a3b8',
    accent: '#0f766e',
    heading: '#0f172a',
  },
  accent: {
    primary: '#14b8a6',
    primaryHover: '#0d9488',
  },
  feedback: {
    successBg: '#f0fdf4',
    successText: '#16a34a',
    successBorder: '#bbf7d0',
    errorBg: '#fef2f2',
    errorText: '#dc2626',
    errorBorder: '#fecaca',
    warningBg: '#fffbeb',
    warningText: '#d97706',
    warningBorder: '#fde68a',
    infoBg: '#f0fdfa',
    infoText: '#14b8a6',
    infoBorder: '#99f6e4',
  },
  diff: {
    easy: { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
    medium: { bg: '#fffbeb', text: '#d97706', border: '#fde68a' },
    hard: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
  },
  shadow: {
    card: '0 1px 3px rgba(0,0,0,0.04)',
    panel: '-4px 0 24px rgba(0,0,0,0.08)',
    popup: '0 16px 48px rgba(0,0,0,0.15)',
  },
  toast: {
    bg: '#ffffff',
    border: '#14b8a6',
    text: '#0f766e',
  },
  scoreBanner: {
    bg: 'linear-gradient(135deg, #f0fdfa, #ecfdf5)',
    border: '#99f6e4',
    statBg: '#ffffff',
    statBorder: '#e2e8f0',
    divider: '#e2e8f0',
  },
  bubble: { opacity: 0.08 },
  dot: { fill: '#94a3b8' },
};

const darkTheme: ThemeColors = {
  bg: {
    app: '#0f172a',
    card: '#1e293b',
    cardAlt: '#1a2332',
    input: '#0f172a',
    sandbox: 'linear-gradient(135deg, #0f172a 0%, #0c1a2e 50%, #0a1628 100%)',
    sandboxHover: '#132a3e',
    overlay: 'rgba(0,0,0,0.6)',
    muted: '#1e293b',
    progressBar: '#334155',
  },
  border: {
    default: '#334155',
    subtle: '#1e293b',
    dashed: '#475569',
  },
  text: {
    primary: '#f1f5f9',
    secondary: '#94a3b8',
    muted: '#64748b',
    accent: '#5eead4',
    heading: '#f1f5f9',
  },
  accent: {
    primary: '#14b8a6',
    primaryHover: '#0d9488',
  },
  feedback: {
    successBg: '#052e16',
    successText: '#4ade80',
    successBorder: '#166534',
    errorBg: '#2a0a0a',
    errorText: '#fb7185',
    errorBorder: '#7f1d1d',
    warningBg: '#2a1f04',
    warningText: '#fbbf24',
    warningBorder: '#854d0e',
    infoBg: '#042f2e',
    infoText: '#5eead4',
    infoBorder: '#115e59',
  },
  diff: {
    easy: { bg: '#052e16', text: '#4ade80', border: '#166534' },
    medium: { bg: '#2a1f04', text: '#fbbf24', border: '#854d0e' },
    hard: { bg: '#2a0a0a', text: '#fb7185', border: '#7f1d1d' },
  },
  shadow: {
    card: '0 1px 3px rgba(0,0,0,0.2)',
    panel: '-4px 0 24px rgba(0,0,0,0.3)',
    popup: '0 16px 48px rgba(0,0,0,0.4)',
  },
  toast: {
    bg: '#1e293b',
    border: '#14b8a6',
    text: '#5eead4',
  },
  scoreBanner: {
    bg: 'linear-gradient(135deg, #042f2e, #0a2a1e)',
    border: '#115e59',
    statBg: '#1e293b',
    statBorder: '#334155',
    divider: '#334155',
  },
  bubble: { opacity: 0.05 },
  dot: { fill: '#475569' },
};

export function getTheme(isDark: boolean): ThemeColors {
  return isDark ? darkTheme : lightTheme;
}
