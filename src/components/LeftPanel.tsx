/* eslint-disable @typescript-eslint/no-explicit-any */
import { useApp } from '../store/context';
import { PeriodicTablePanel } from './PeriodicTablePanel';
import { QuizPanel } from './QuizPanel';
import { QUIZ_LEVELS } from '../data/quizLevels';

const CARD: React.CSSProperties = { padding: '14px 16px', borderRadius: 14 };

interface LeftPanelProps {
  fullHeight?: boolean;
  isMobile?: boolean;
  isTablet?: boolean;
  onToast?: (msg: string) => void;
}

export function LeftPanel({ fullHeight, isMobile, isTablet, onToast }: LeftPanelProps) {
  const { state, dispatch } = useApp();

  const isDark = state.theme === 'dark';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const cardBorder = isDark ? '#334155' : '#e2e8f0';
  const textPrimary = isDark ? '#e2e8f0' : '#1e293b';
  const textSecondary = isDark ? '#94a3b8' : '#64748b';
  const accentLight = isDark ? '#0f766e' : '#0f766e';
  const bgLight = isDark ? '#334155' : '#f1f5f9';

  const feedbackAccent =
    state.feedbackType === 'success' ? '#10b981' :
    state.feedbackType === 'error'   ? '#ef4444' :
    state.feedbackType === 'warning' ? '#f59e0b' : '#14b8a6';

  const feedbackBg =
    state.feedbackType === 'success' ? (isDark ? '#064e3b' : '#f0fdf4') :
    state.feedbackType === 'error'   ? (isDark ? '#7f1d1d' : '#fef2f2') :
    state.feedbackType === 'warning' ? (isDark ? '#78350f' : '#fffbeb') : (isDark ? '#134e4a' : '#f0fdfa');

  return (
    <div style={{ width: fullHeight ? '100%' : 'min(420px, 38vw)', minWidth: fullHeight ? undefined : 300, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 10, height: '100%', minHeight: 0, overflow: 'hidden' }}>

      {/* Progress */}
      <div style={{ ...CARD, background: cardBg, border: `1px solid ${cardBorder}`, flexShrink: 0, boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 12, fontWeight: 800, color: accentLight, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Progress</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['free-play', 'quiz'] as const).map(mode => (
              <button key={mode} onClick={() => dispatch({ type: 'SET_MODE', payload: mode })}
                style={{ padding: '5px 14px', fontSize: 12, fontFamily: '"Nunito", sans-serif', fontWeight: 700, borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s', background: state.mode === mode ? (mode === 'quiz' ? '#f43f5e' : '#14b8a6') : bgLight, color: state.mode === mode ? '#ffffff' : textSecondary, border: state.mode === mode ? `1px solid ${mode === 'quiz' ? '#e11d48' : '#0d9488'}` : `1px solid ${cardBorder}` }}>
                {mode === 'free-play' ? 'Free Play' : 'Quiz'}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 13, color: textSecondary }}>Level {state.level}</span>
          <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 13, fontWeight: 800, color: accentLight }}>Score: {state.score}</span>
        </div>
        <div style={{ height: 8, background: cardBorder, borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(state.completedChallenges.length / QUIZ_LEVELS.length) * 100}%`, background: 'linear-gradient(90deg, #14b8a6, #06b6d4)', borderRadius: 999, transition: 'width 0.5s' }} />
        </div>
      </div>

      {/* Quiz */}
      <div style={{ maxHeight: 320, overflowY: 'auto', overflowX: 'hidden', borderRadius: 14, flexShrink: 0 }}>
        <QuizPanel />
      </div>

      {/* Feedback */}
      <div style={{ ...CARD, background: feedbackBg, border: `1px solid ${feedbackAccent}30`, borderLeft: `4px solid ${feedbackAccent}`, flexShrink: 0 }}>
        <p style={{ fontFamily: '"Nunito", sans-serif', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', color: feedbackAccent, marginBottom: 6, textTransform: 'uppercase' }}>Feedback</p>
        <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: textSecondary, lineHeight: 1.6 }}>{state.feedback}</p>
      </div>

      {/* Touch hint */}
      {(isMobile || isTablet) && (
        <div style={{ ...CARD, background: isDark ? '#134e4a' : '#f0fdfa', border: `1px solid ${isDark ? '#0d6e6a' : '#ccfbf1'}`, borderLeft: '4px solid #14b8a6', flexShrink: 0, padding: '10px 14px' }}>
          <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: textSecondary, lineHeight: 1.6 }}>
            {isTablet
              ? <><strong style={{ color: accentLight }}>Tap</strong> any element to add it &middot; <strong style={{ color: accentLight }}>Drag</strong> it into the sandbox to place precisely</>
              : <><strong style={{ color: accentLight }}>Tap any element</strong> below to add it to your lab instantly. Long-press for element details.</>
            }
          </p>
        </div>
      )}

      {/* Periodic table */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 14, maxWidth: '100%', WebkitOverflowScrolling: 'touch' as any, boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ padding: '14px 16px 16px 16px' }}>
          <p style={{ fontFamily: '"Nunito", sans-serif', fontSize: 12, fontWeight: 800, letterSpacing: '0.05em', color: accentLight, marginBottom: 12, textTransform: 'uppercase' }}>Periodic Table</p>
          <PeriodicTablePanel onToast={onToast} isMobile={isMobile} isTablet={isTablet} />
        </div>
      </div>
    </div>
  );
}
