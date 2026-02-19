/* eslint-disable @typescript-eslint/no-explicit-any */
import { useApp } from '../store/context';
import { PeriodicTablePanel } from './PeriodicTablePanel';
import { QuizPanel } from './QuizPanel';
import { QUIZ_LEVELS } from '../data/quizLevels';

const CARD: React.CSSProperties = { padding: '14px 16px', borderRadius: 12 };

interface LeftPanelProps {
  fullHeight?: boolean;
  isMobile?: boolean;
  isTablet?: boolean;
  onToast?: (msg: string) => void;
}

export function LeftPanel({ fullHeight, isMobile, isTablet, onToast }: LeftPanelProps) {
  const { state, dispatch } = useApp();

  const feedbackAccent =
    state.feedbackType === 'success' ? '#4ade80' :
    state.feedbackType === 'error'   ? '#ef4444' :
    state.feedbackType === 'warning' ? '#f97316' : '#c084fc';

  const feedbackBg =
    state.feedbackType === 'success' ? '#052e16' :
    state.feedbackType === 'error'   ? '#2d0a0a' :
    state.feedbackType === 'warning' ? '#2d1500' : '#1a0b38';

  return (
    <div style={{ width: fullHeight ? '100%' : 'min(420px, 38vw)', minWidth: fullHeight ? undefined : 300, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 10, height: '100%', minHeight: 0, overflow: 'hidden' }}>

      {/* Progress */}
      <div style={{ ...CARD, background: '#130929', border: '1px solid #3b1d6e', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontFamily: 'Orbitron, monospace', fontSize: 11, fontWeight: 700, color: '#d8b4fe', letterSpacing: '0.15em' }}>PROGRESS</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['free-play', 'quiz'] as const).map(mode => (
              <button key={mode} onClick={() => dispatch({ type: 'SET_MODE', payload: mode })}
                style={{ padding: '4px 12px', fontSize: 11, fontFamily: '"Share Tech Mono", monospace', fontWeight: 700, letterSpacing: '0.05em', borderRadius: 8, cursor: 'pointer', transition: 'all 0.15s', background: state.mode === mode ? (mode === 'quiz' ? '#be185d' : '#6d28d9') : '#1e0b3e', color: state.mode === mode ? '#fff' : '#a78bfa', border: state.mode === mode ? `1px solid ${mode === 'quiz' ? '#f43f5e' : '#a855f7'}` : '1px solid #3b1d6e', boxShadow: state.mode === mode ? `0 0 10px ${mode === 'quiz' ? '#f43f5e60' : '#a855f760'}` : 'none' }}>
                {mode === 'free-play' ? 'FREE PLAY' : 'QUIZ'}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 13, color: '#c4b5fd' }}>Level {state.level}</span>
          <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 13, fontWeight: 700, color: '#e9d5ff' }}>Score: {state.score}</span>
        </div>
        <div style={{ height: 8, background: '#2d1b5e', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(state.completedChallenges.length / QUIZ_LEVELS.length) * 100}%`, background: 'linear-gradient(90deg, #7c3aed, #ec4899)', boxShadow: '0 0 8px #a855f7', borderRadius: 999, transition: 'width 0.5s' }} />
        </div>
      </div>

      {/* Quiz */}
      <div style={{ maxHeight: 320, overflowY: 'auto', overflowX: 'hidden', borderRadius: 12, flexShrink: 0 }}>
        <QuizPanel />
      </div>

      {/* Feedback */}
      <div style={{ ...CARD, background: feedbackBg, border: `1px solid ${feedbackAccent}50`, borderLeft: `4px solid ${feedbackAccent}`, boxShadow: `0 0 14px ${feedbackAccent}18`, flexShrink: 0 }}>
        <p style={{ fontFamily: 'Orbitron, monospace', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: feedbackAccent, marginBottom: 8, textTransform: 'uppercase' }}>Feedback</p>
        <p style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 13, color: '#f3e8ff', lineHeight: 1.6 }}>{state.feedback}</p>
      </div>

      {/* Touch hint */}
      {(isMobile || isTablet) && (
        <div style={{ ...CARD, background: '#0d0a1f', border: '1px solid #3b1d6e', borderLeft: '4px solid #6d28d9', flexShrink: 0, padding: '10px 14px' }}>
          <p style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 11, color: '#a78bfa', lineHeight: 1.6 }}>
            {isTablet
              ? <>💡 <strong style={{ color: '#c4b5fd' }}>Tap</strong> any element to add it · <strong style={{ color: '#c4b5fd' }}>Drag</strong> it into the sandbox to place precisely</>
              : <>💡 <strong style={{ color: '#c4b5fd' }}>Tap any element</strong> below to add it to your lab instantly. Long-press for element details.</>
            }
          </p>
        </div>
      )}

      {/* Periodic table — WebkitOverflowScrolling for smooth iOS touch scroll */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', background: '#0d0120', border: '1px solid #2d1b5e', borderRadius: 12, maxWidth: '100%', WebkitOverflowScrolling: 'touch' as any }}>
        <div style={{ padding: '14px 16px 160px 16px' }}>
          <p style={{ fontFamily: 'Orbitron, monospace', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: '#d8b4fe', marginBottom: 12 }}>PERIODIC TABLE</p>
          <PeriodicTablePanel onToast={onToast} isMobile={isMobile} isTablet={isTablet} />
        </div>
      </div>
    </div>
  );
}
