/* eslint-disable @typescript-eslint/no-explicit-any */
import { useApp } from '../../shared/store/context';
import { useTheme } from '../../shared/store/theme';
import { PeriodicTablePanel } from '../periodic-table/PeriodicTablePanel';
import { QuizPanel } from '../quiz/QuizPanel';
import { QUIZ_LEVELS } from '../../shared/data/quizLevels';

const CARD: React.CSSProperties = { padding: '14px 16px', borderRadius: 14 };

interface LeftPanelProps {
  fullHeight?: boolean;
  isMobile?: boolean;
  isTablet?: boolean;
  onToast?: (msg: string) => void;
}

export function LeftPanel({ fullHeight, isMobile, isTablet, onToast }: LeftPanelProps) {
  const { state, dispatch } = useApp();
  const { theme } = useTheme();

  const feedbackAccent =
    state.feedbackType === 'success' ? '#10b981' :
    state.feedbackType === 'error'   ? '#ef4444' :
    state.feedbackType === 'warning' ? '#f59e0b' : theme.accent;

  const feedbackBg =
    state.feedbackType === 'success' ? (theme.isDark ? '#0a2a1a' : '#f0fdf4') :
    state.feedbackType === 'error'   ? (theme.isDark ? '#2a1a1a' : '#fef2f2') :
    state.feedbackType === 'warning' ? (theme.isDark ? '#2a2410' : '#fffbeb') : theme.accentBg;

  return (
    <div style={{ width: fullHeight ? '100%' : 'min(420px, 38vw)', minWidth: fullHeight ? undefined : 300, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14, height: '100%', minHeight: 0, overflow: 'hidden' }}>

      {/* Progress */}
      <div style={{ ...CARD, background: theme.surface, border: `1px solid ${theme.border}`, flexShrink: 0, boxShadow: theme.shadow }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontFamily: '"Playfair Display", sans-serif', fontSize: 12, fontWeight: 800, color: theme.accent, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Progress</span>
            <svg width="52" height="5" viewBox="0 0 52 5" fill="none">
              <path d="M1,2.5 Q13,0.5 26,2.5 Q39,4.5 51,2.5" stroke={theme.accentBorder} strokeWidth="1" strokeLinecap="round"/>
              <path d="M4,4 Q13,2.5 26,4 Q39,5.5 48,4" stroke={theme.accentBorder} strokeWidth="0.5" strokeLinecap="round" opacity="0.5"/>
            </svg>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {(['free-play', 'quiz'] as const).map(m => (
              <button key={m} onClick={() => dispatch({ type: 'SET_MODE', payload: m })}
                style={{ padding: '5px 14px', fontSize: 12, fontFamily: '"Playfair Display", sans-serif', fontWeight: 700, borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s', background: state.mode === m ? (m === 'quiz' ? '#B85030' : theme.accent) : theme.statBg, color: state.mode === m ? '#ffffff' : theme.textSecondary, border: state.mode === m ? `1px solid ${m === 'quiz' ? '#8A3A1E' : theme.accentDark}` : `1px solid ${theme.border}` }}>
                {m === 'free-play' ? 'Free Play' : 'Quiz'}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 13, color: theme.textSecondary }}>Level {state.level}</span>
          <span style={{ fontFamily: '"Playfair Display", sans-serif', fontSize: 13, fontWeight: 800, color: theme.accent }}>Score: {state.score}</span>
        </div>
        <div style={{ height: 8, background: theme.progressBg, borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(state.completedChallenges.length / QUIZ_LEVELS.length) * 100}%`, background: theme.accent, borderRadius: 999, transition: 'width 0.5s' }} />
        </div>
      </div>

      {/* Quiz */}
      <div style={{ maxHeight: 320, overflowY: 'auto', overflowX: 'hidden', borderRadius: 14, flexShrink: 0 }}>
        <QuizPanel />
      </div>

      {/* Feedback */}
      <div style={{ ...CARD, background: feedbackBg, border: `1px solid ${feedbackAccent}30`, borderLeft: `4px solid ${feedbackAccent}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, marginBottom: 6 }}>
          <p style={{ fontFamily: '"Playfair Display", sans-serif', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', color: feedbackAccent, textTransform: 'uppercase' }}>Feedback</p>
          <svg width="48" height="5" viewBox="0 0 48 5" fill="none">
            <path d="M1,2.5 Q12,0.5 24,2.5 Q36,4.5 47,2.5" stroke={feedbackAccent} strokeWidth="0.9" strokeLinecap="round" opacity="0.5"/>
            <path d="M4,4 Q12,2.5 24,4 Q36,5.5 44,4" stroke={feedbackAccent} strokeWidth="0.5" strokeLinecap="round" opacity="0.3"/>
          </svg>
        </div>
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: theme.textSecondary, lineHeight: 1.6 }}>{state.feedback}</p>
      </div>

      {/* Touch hint */}
      {(isMobile || isTablet) && (
        <div style={{ ...CARD, background: theme.accentBg, border: `1px solid ${theme.accentBorder}`, borderLeft: `4px solid ${theme.accent}`, flexShrink: 0, padding: '10px 14px' }}>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: theme.textSecondary, lineHeight: 1.6 }}>
            {isTablet
              ? <><strong style={{ color: theme.accent }}>Tap</strong> any element to add it &middot; <strong style={{ color: theme.accent }}>Drag</strong> it into the sandbox to place precisely</>
              : <><strong style={{ color: theme.accent }}>Tap any element</strong> below to add it to your lab instantly. Long-press for element details.</>
            }
          </p>
        </div>
      )}

      {/* Periodic table */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, maxWidth: '100%', WebkitOverflowScrolling: 'touch' as any, boxShadow: theme.shadow }}>
        <div style={{ padding: '14px 16px 16px 16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 12 }}>
            <p style={{ fontFamily: '"Playfair Display", sans-serif', fontSize: 12, fontWeight: 800, letterSpacing: '0.05em', color: theme.accent, textTransform: 'uppercase' }}>Periodic Table</p>
            <svg width="60" height="5" viewBox="0 0 60 5" fill="none">
              <path d="M1,2.5 Q15,0.5 30,2.5 Q45,4.5 59,2.5" stroke={theme.accentBorder} strokeWidth="1" strokeLinecap="round"/>
              <path d="M4,4 Q15,2.5 30,4 Q45,5.5 56,4" stroke={theme.accentBorder} strokeWidth="0.5" strokeLinecap="round" opacity="0.5"/>
            </svg>
          </div>
          <PeriodicTablePanel onToast={onToast} isMobile={isMobile} isTablet={isTablet} />
        </div>
      </div>
    </div>
  );
}
