/* eslint-disable @typescript-eslint/no-explicit-any */
import { useApp } from '../store/context';
import { useTheme } from '../store/themeContext';
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
  const { isDark, t } = useTheme();

  const feedbackAccent =
    state.feedbackType === 'success' ? t.feedback.successText :
    state.feedbackType === 'error'   ? t.feedback.errorText :
    state.feedbackType === 'warning' ? t.feedback.warningText : t.feedback.infoText;

  const feedbackBg =
    state.feedbackType === 'success' ? t.feedback.successBg :
    state.feedbackType === 'error'   ? t.feedback.errorBg :
    state.feedbackType === 'warning' ? t.feedback.warningBg : t.feedback.infoBg;

  return (
    <div style={{ width: fullHeight ? '100%' : 'min(420px, 38vw)', minWidth: fullHeight ? undefined : 300, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 10, height: '100%', minHeight: 0, overflow: 'hidden' }}>

      {/* Progress */}
      <div style={{ ...CARD, background: t.bg.card, border: `1px solid ${t.border.default}`, flexShrink: 0, boxShadow: t.shadow.card }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 12, fontWeight: 800, color: t.text.accent, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Progress</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['free-play', 'quiz'] as const).map(mode => (
              <button key={mode} onClick={() => dispatch({ type: 'SET_MODE', payload: mode })}
                style={{ padding: '5px 14px', fontSize: 12, fontFamily: '"Nunito", sans-serif', fontWeight: 700, borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s', background: state.mode === mode ? (mode === 'quiz' ? '#f43f5e' : '#14b8a6') : t.bg.muted, color: state.mode === mode ? '#ffffff' : t.text.muted, border: state.mode === mode ? `1px solid ${mode === 'quiz' ? '#e11d48' : '#0d9488'}` : `1px solid ${t.border.default}` }}>
                {mode === 'free-play' ? 'Free Play' : 'Quiz'}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 13, color: t.text.muted }}>Level {state.level}</span>
          <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 13, fontWeight: 800, color: t.text.accent }}>Score: {state.score}</span>
        </div>
        <div style={{ height: 8, background: t.bg.progressBar, borderRadius: 999, overflow: 'hidden' }}>
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
        <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: t.text.secondary, lineHeight: 1.6 }}>{state.feedback}</p>
      </div>

      {/* Touch hint */}
      {(isMobile || isTablet) && (
        <div style={{ ...CARD, background: isDark ? t.feedback.infoBg : '#f0fdfa', border: `1px solid ${isDark ? t.feedback.infoBorder : '#ccfbf1'}`, borderLeft: `4px solid ${t.accent.primary}`, flexShrink: 0, padding: '10px 14px' }}>
          <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: t.text.secondary, lineHeight: 1.6 }}>
            {isTablet
              ? <><strong style={{ color: t.text.accent }}>Tap</strong> any element to add it &middot; <strong style={{ color: t.text.accent }}>Drag</strong> it into the sandbox to place precisely</>
              : <><strong style={{ color: t.text.accent }}>Tap any element</strong> below to add it to your lab instantly. Long-press for element details.</>
            }
          </p>
        </div>
      )}

      {/* Periodic table */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', background: t.bg.card, border: `1px solid ${t.border.default}`, borderRadius: 14, maxWidth: '100%', WebkitOverflowScrolling: 'touch' as any, boxShadow: t.shadow.card }}>
        <div style={{ padding: '14px 16px 16px 16px' }}>
          <p style={{ fontFamily: '"Nunito", sans-serif', fontSize: 12, fontWeight: 800, letterSpacing: '0.05em', color: t.text.accent, marginBottom: 12, textTransform: 'uppercase' }}>Periodic Table</p>
          <PeriodicTablePanel onToast={onToast} isMobile={isMobile} isTablet={isTablet} />
        </div>
      </div>
    </div>
  );
}
