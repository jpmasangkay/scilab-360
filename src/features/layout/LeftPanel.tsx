/* eslint-disable @typescript-eslint/no-explicit-any */
import { useApp } from '../../shared/store/context';
import { useTheme } from '../../shared/store/theme';
import { PeriodicTablePanel } from '../periodic-table/PeriodicTablePanel';
import { QuizPanel } from '../quiz/QuizPanel';
import { QUIZ_LEVELS } from '../../shared/data/quizLevels';

function PotteryRing({ width = 56, color }: { width?: number; color: string }) {
  return (
    <svg width={width} height={6} viewBox={`0 0 ${width} 6`} fill="none" style={{ display: 'block' }}>
      <path d={`M1,3 Q${width/4},1 ${width/2},3 Q${width*3/4},5 ${width-1},3`} stroke={color} strokeWidth="1.1" strokeLinecap="round"/>
      <path d={`M4,5 Q${width/4},3 ${width/2},5 Q${width*3/4},7 ${width-4},5`} stroke={color} strokeWidth="0.5" strokeLinecap="round" opacity="0.4"/>
    </svg>
  );
}

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
    state.feedbackType === 'success' ? '#16a34a' :
    state.feedbackType === 'error'   ? '#B85030' :
    state.feedbackType === 'warning' ? '#c07a28' : theme.accent;

  const feedbackBg =
    state.feedbackType === 'success' ? (theme.isDark ? '#0a2a18' : '#f0fdf4') :
    state.feedbackType === 'error'   ? (theme.isDark ? '#2A1A12' : '#FBF0EA') :
    state.feedbackType === 'warning' ? (theme.isDark ? '#2a2010' : '#fffbeb') : theme.accentBg;

  const compact = isMobile || isTablet;
  const cardPad = compact ? '12px 14px' : '16px 18px';
  const gap = compact ? 8 : 12;

  return (
    <div style={{
      width: fullHeight ? '100%' : 'min(380px, 34vw)',
      minWidth: fullHeight ? undefined : 272,
      flexShrink: 0,
      display: 'flex', flexDirection: 'column',
      gap, height: '100%', minHeight: 0, overflow: 'hidden',
    }}>

      {/* ── Progress ─────────────────────────────── */}
      <div style={{
        padding: cardPad, borderRadius: 12,
        background: theme.surface, border: `1px solid ${theme.border}`,
        flexShrink: 0, boxShadow: theme.shadow,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: compact ? 10 : 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span style={{ fontFamily: '"Playfair Display", serif', fontSize: 11, fontWeight: 800, color: theme.accent, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Progress</span>
            <PotteryRing width={50} color={theme.accentBorder} />
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            {(['free-play', 'quiz'] as const).map(m => (
              <button key={m} onClick={() => dispatch({ type: 'SET_MODE', payload: m })}
                style={{
                  padding: '5px 10px', fontSize: 11,
                  fontFamily: '"DM Sans", sans-serif', fontWeight: 500,
                  borderRadius: 6, cursor: 'pointer', transition: 'all 0.18s',
                  minHeight: 32,
                  background: state.mode === m ? (m === 'quiz' ? '#B85030' : theme.accent) : 'transparent',
                  color: state.mode === m ? '#ffffff' : theme.textTertiary,
                  border: state.mode === m
                    ? `1px solid ${m === 'quiz' ? '#8A3A1E' : theme.accentDark}`
                    : `1px solid ${theme.border}`,
                }}>
                {m === 'free-play' ? 'Free Play' : 'Quiz'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 11, color: theme.textTertiary }}>Level {state.level}</span>
          <span style={{ fontFamily: '"Playfair Display", serif', fontSize: compact ? 15 : 17, fontWeight: 700, color: theme.accent }}>
            {state.score} <span style={{ fontSize: 10, fontWeight: 400, fontStyle: 'italic', opacity: 0.7 }}>pts</span>
          </span>
        </div>

        <div style={{ height: 5, background: theme.progressBg, borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(state.completedChallenges.length / QUIZ_LEVELS.length) * 100}%`, background: theme.accent, borderRadius: 4, transition: 'width 0.6s ease' }} />
        </div>
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 10, color: theme.textTertiary, marginTop: 5, letterSpacing: '0.02em' }}>
          {state.completedChallenges.length} of {QUIZ_LEVELS.length} challenges
        </p>
      </div>

      {/* ── Quiz ──────────────────────────────────── */}
      <div style={{ maxHeight: compact ? 240 : 300, overflowY: 'auto', overflowX: 'hidden', borderRadius: 12, flexShrink: 0 }}>
        <QuizPanel />
      </div>

      {/* ── Feedback ──────────────────────────────── */}
      <div style={{
        padding: compact ? '10px 14px' : '14px 18px', borderRadius: 10,
        background: feedbackBg,
        border: `1px solid ${feedbackAccent}25`,
        borderLeft: `3px solid ${feedbackAccent}`,
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 6 }}>
          <p style={{ fontFamily: '"Playfair Display", serif', fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', color: feedbackAccent, textTransform: 'uppercase' }}>Feedback</p>
          <PotteryRing width={40} color={feedbackAccent} />
        </div>
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: compact ? 12 : 13, color: theme.textSecondary, lineHeight: 1.6 }}>
          {state.feedback}
        </p>
      </div>

      {/* ── Touch hint (tablet only, not mobile — mobile has less space) ── */}
      {isTablet && (
        <div style={{
          padding: '9px 14px', borderRadius: 9,
          background: theme.accentBg, border: `1px solid ${theme.accentBorder}`,
          borderLeft: `3px solid ${theme.accent}`, flexShrink: 0,
        }}>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: theme.textSecondary, lineHeight: 1.55 }}>
            <strong style={{ color: theme.accent, fontWeight: 600 }}>Tap</strong> an element to add &middot; <strong style={{ color: theme.accent, fontWeight: 600 }}>Drag</strong> to place
          </p>
        </div>
      )}

      {/* ── Periodic table ────────────────────────── */}
      <div style={{
        flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden',
        background: theme.surface, border: `1px solid ${theme.border}`,
        borderRadius: 12, maxWidth: '100%',
        WebkitOverflowScrolling: 'touch' as any,
        boxShadow: theme.shadow,
      }}>
        <div style={{ padding: compact ? '12px 12px 14px' : '14px 16px 18px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: compact ? 10 : 14 }}>
            <p style={{ fontFamily: '"Playfair Display", serif', fontSize: 11, fontWeight: 800, letterSpacing: '0.07em', color: theme.accent, textTransform: 'uppercase' }}>Periodic Table</p>
            <PotteryRing width={62} color={theme.accentBorder} />
          </div>
          <PeriodicTablePanel onToast={onToast} isMobile={isMobile} isTablet={isTablet} />
        </div>
      </div>
    </div>
  );
}
