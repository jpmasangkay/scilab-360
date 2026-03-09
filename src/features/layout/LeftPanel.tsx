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
          <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 12, fontWeight: 800, color: theme.accent, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Progress</span>
          <div style={{ display: 'flex', gap: 10 }}>
            {(['free-play', 'quiz'] as const).map(m => (
              <button key={m} onClick={() => dispatch({ type: 'SET_MODE', payload: m })}
                style={{ padding: '5px 14px', fontSize: 12, fontFamily: '"Nunito", sans-serif', fontWeight: 700, borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s', background: state.mode === m ? (m === 'quiz' ? '#f43f5e' : theme.accent) : theme.statBg, color: state.mode === m ? '#ffffff' : theme.textSecondary, border: state.mode === m ? `1px solid ${m === 'quiz' ? '#e11d48' : theme.accentDark}` : `1px solid ${theme.border}` }}>
                {m === 'free-play' ? 'Free Play' : 'Quiz'}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 13, color: theme.textSecondary }}>Level {state.level}</span>
          <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 13, fontWeight: 800, color: theme.accent }}>Score: {state.score}</span>
        </div>
        <div style={{ height: 8, background: theme.progressBg, borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(state.completedChallenges.length / QUIZ_LEVELS.length) * 100}%`, background: `linear-gradient(90deg, ${theme.accent}, #06b6d4)`, borderRadius: 999, transition: 'width 0.5s' }} />
        </div>
      </div>

      {/* Quiz */}
      <div style={{ maxHeight: 320, overflowY: 'auto', overflowX: 'hidden', borderRadius: 14, flexShrink: 0 }}>
        <QuizPanel />
      </div>

      {/* Feedback */}
      <div style={{ ...CARD, background: feedbackBg, border: `1px solid ${feedbackAccent}30`, borderLeft: `4px solid ${feedbackAccent}`, flexShrink: 0 }}>
        <p style={{ fontFamily: '"Nunito", sans-serif', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', color: feedbackAccent, marginBottom: 6, textTransform: 'uppercase' }}>Feedback</p>
        <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: theme.textSecondary, lineHeight: 1.6 }}>{state.feedback}</p>
      </div>

      {/* Touch hint */}
      {(isMobile || isTablet) && (
        <div style={{ ...CARD, background: theme.accentBg, border: `1px solid ${theme.accentBorder}`, borderLeft: `4px solid ${theme.accent}`, flexShrink: 0, padding: '10px 14px' }}>
          <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: theme.textSecondary, lineHeight: 1.6 }}>
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
          <p style={{ fontFamily: '"Nunito", sans-serif', fontSize: 12, fontWeight: 800, letterSpacing: '0.05em', color: theme.accent, marginBottom: 12, textTransform: 'uppercase' }}>Periodic Table</p>
          <PeriodicTablePanel onToast={onToast} isMobile={isMobile} isTablet={isTablet} />
        </div>
      </div>
    </div>
  );
}
