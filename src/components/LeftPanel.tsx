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

  const feedbackAccent =
    state.feedbackType === 'success' ? '#10b981' :
    state.feedbackType === 'error'   ? '#ef4444' :
    state.feedbackType === 'warning' ? '#f59e0b' : '#14b8a6';

  const feedbackBg =
    state.feedbackType === 'success' ? '#f0fdf4' :
    state.feedbackType === 'error'   ? '#fef2f2' :
    state.feedbackType === 'warning' ? '#fffbeb' : '#f0fdfa';

  return (
    <div style={{ width: fullHeight ? '100%' : 'min(420px, 38vw)', minWidth: fullHeight ? undefined : 300, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 10, height: '100%', minHeight: 0, overflow: 'hidden' }}>

      {/* Progress */}
      <div style={{ ...CARD, background: '#ffffff', border: '1px solid #e2e8f0', flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 12, fontWeight: 800, color: '#0f766e', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Progress</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['free-play', 'quiz'] as const).map(mode => (
              <button key={mode} onClick={() => dispatch({ type: 'SET_MODE', payload: mode })}
                style={{ padding: '5px 14px', fontSize: 12, fontFamily: '"Nunito", sans-serif', fontWeight: 700, borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s', background: state.mode === mode ? (mode === 'quiz' ? '#f43f5e' : '#14b8a6') : '#f1f5f9', color: state.mode === mode ? '#ffffff' : '#64748b', border: state.mode === mode ? `1px solid ${mode === 'quiz' ? '#e11d48' : '#0d9488'}` : '1px solid #e2e8f0' }}>
                {mode === 'free-play' ? 'Free Play' : 'Quiz'}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 13, color: '#64748b' }}>Level {state.level}</span>
          <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 13, fontWeight: 800, color: '#0f766e' }}>Score: {state.score}</span>
        </div>
        <div style={{ height: 8, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden' }}>
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
        <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: '#334155', lineHeight: 1.6 }}>{state.feedback}</p>
      </div>

      {/* Touch hint */}
      {(isMobile || isTablet) && (
        <div style={{ ...CARD, background: '#f0fdfa', border: '1px solid #ccfbf1', borderLeft: '4px solid #14b8a6', flexShrink: 0, padding: '10px 14px' }}>
          <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#475569', lineHeight: 1.6 }}>
            {isTablet
              ? <><strong style={{ color: '#0f766e' }}>Tap</strong> any element to add it &middot; <strong style={{ color: '#0f766e' }}>Drag</strong> it into the sandbox to place precisely</>
              : <><strong style={{ color: '#0f766e' }}>Tap any element</strong> below to add it to your lab instantly. Long-press for element details.</>
            }
          </p>
        </div>
      )}

      {/* Periodic table */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 14, maxWidth: '100%', WebkitOverflowScrolling: 'touch' as any, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ padding: '14px 16px 16px 16px' }}>
          <p style={{ fontFamily: '"Nunito", sans-serif', fontSize: 12, fontWeight: 800, letterSpacing: '0.05em', color: '#0f766e', marginBottom: 12, textTransform: 'uppercase' }}>Periodic Table</p>
          <PeriodicTablePanel onToast={onToast} isMobile={isMobile} isTablet={isTablet} />
        </div>
      </div>
    </div>
  );
}
