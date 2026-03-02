import { useState } from 'react';
import { useApp } from '../store/context';
import { useTheme } from '../store/themeContext';
import { QUIZ_LEVELS, DIFFICULTY_CONFIG } from '../data/quizLevels';
import type { Difficulty } from '../types';

export function QuizPanel() {
  const { state, dispatch } = useApp();
  const { t } = useTheme();
  const [collapsed, setCollapsed] = useState(true);
  const [submitResult, setSubmitResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty | 'all'>('all');

  if (state.mode !== 'quiz') return null;

  const challenge = state.currentChallenge;
  const diffColors = t.diff;

  const filteredLevels = activeDifficulty === 'all'
    ? QUIZ_LEVELS
    : QUIZ_LEVELS.filter(q => q.difficulty === activeDifficulty);

  if (!challenge) {
    return (
      <div style={{ padding: 20, borderRadius: 14, textAlign: 'center', background: t.feedback.infoBg, border: `1px solid ${t.feedback.infoBorder}` }}>
        <p style={{ fontFamily: '"Nunito", sans-serif', fontSize: 16, fontWeight: 800, color: t.text.accent }}>All Challenges Complete!</p>
        <p style={{ fontFamily: '"Space Mono", monospace', fontSize: 13, color: t.text.muted, marginTop: 6 }}>Score: {state.score}</p>
        <button onClick={() => dispatch({ type: 'SET_LEVEL', payload: 1 })}
          style={{ marginTop: 12, padding: '8px 20px', borderRadius: 10, cursor: 'pointer', fontFamily: '"Nunito", sans-serif', fontSize: 13, fontWeight: 700, background: '#14b8a6', border: 'none', color: '#ffffff' }}>
          Play Again
        </button>
      </div>
    );
  }

  const total = Object.values(challenge.requiredAtoms).reduce((a, b) => a + b, 0);
  const current = state.placedAtoms.length;
  const atomCounts: Record<string, { have: number; need: number; ok: boolean }> = {};
  for (const [sym, need] of Object.entries(challenge.requiredAtoms)) {
    const have = state.placedAtoms.filter(a => a.element.symbol === sym).length;
    atomCounts[sym] = { have, need, ok: have >= need };
  }
  const diff = DIFFICULTY_CONFIG[challenge.difficulty];

  const alreadyCompleted = state.completedChallenges.includes(challenge.level);

  const handleSubmit = () => {
    if (alreadyCompleted) return;
    dispatch({ type: 'INC_ATTEMPTS' });
    const formula = state.formula;
    if (formula === challenge.targetFormula) {
      const multiplier = challenge.difficulty === 'hard' ? 2 : challenge.difficulty === 'medium' ? 1.5 : 1;
      const pts = Math.round(Math.max(50, 100 + (3 - Math.min(3, state.attempts)) * 25) * multiplier);
      setSubmitResult({ ok: true, msg: `Correct! ${challenge.description} -- +${pts} pts` });
      dispatch({ type: 'ADD_SCORE', payload: pts });
      dispatch({ type: 'COMPLETE_CHALLENGE', payload: challenge.level });
      return;
    }
    if (state.placedAtoms.length === 0) {
      setSubmitResult({ ok: false, msg: 'No atoms placed! Drag atoms from the periodic table first.' });
    } else {
      const wrongAtoms = Object.entries(challenge.requiredAtoms).filter(([sym, need]) =>
        state.placedAtoms.filter(a => a.element.symbol === sym).length !== need
      );
      const extraAtoms = state.placedAtoms.filter(a => !challenge.requiredAtoms[a.element.symbol]);
      let diag = `Not quite! Current: ${formula || '--'}, Target: ${challenge.targetFormula}.`;
      if (wrongAtoms.length) diag += ` ${wrongAtoms.map(([s, n]) => `Need ${n}x${s}`).join(', ')}.`;
      if (extraAtoms.length) diag += ` Remove: ${[...new Set(extraAtoms.map(a => a.element.symbol))].join(', ')}.`;
      setSubmitResult({ ok: false, msg: diag });
    }
  };

  const nextChallenge = QUIZ_LEVELS.find(
    q => q.level > challenge.level && !state.completedChallenges.includes(q.level)
  );

  return (
    <div style={{ borderRadius: 14, overflow: 'hidden', background: t.bg.card, border: `1px solid ${t.border.default}`, boxShadow: t.shadow.card }}>
      {/* Header */}
      <div onClick={() => setCollapsed(v => !v)}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', cursor: 'pointer', background: t.bg.cardAlt, borderBottom: collapsed ? 'none' : `1px solid ${t.border.default}` }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, fontFamily: '"Nunito", sans-serif', fontWeight: 800, padding: '3px 10px', borderRadius: 8, background: '#14b8a6', color: '#ffffff' }}>
            Lvl {challenge.level}
          </span>
          <span style={{ fontSize: 11, fontFamily: '"Nunito", sans-serif', fontWeight: 700, padding: '3px 9px', borderRadius: 8, background: diffColors[challenge.difficulty]?.bg ?? t.bg.muted, color: diffColors[challenge.difficulty]?.text ?? t.text.muted, border: `1px solid ${diffColors[challenge.difficulty]?.border ?? t.border.default}` }}>
            {diff.emoji} {diff.label}
          </span>
          <span style={{ fontSize: 13, fontFamily: '"Nunito", sans-serif', fontWeight: 700, color: t.text.primary }}>
            {challenge.description}
          </span>
        </div>
        <span style={{ color: t.text.muted, fontSize: 14, display: 'inline-block', transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>&#x25BE;</span>
      </div>

      {!collapsed && (
        <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Difficulty selector */}
          <div>
            <p style={{ fontFamily: '"Nunito", sans-serif', fontSize: 11, color: t.text.muted, letterSpacing: '0.05em', marginBottom: 7, fontWeight: 700, textTransform: 'uppercase' }}>Difficulty</p>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['all', 'easy', 'medium', 'hard'] as const).map(d => {
                const isActive = activeDifficulty === d;
                const dc = d === 'all' ? { bg: t.bg.muted, text: t.text.muted, border: t.border.default } : (diffColors[d] ?? { bg: t.bg.muted, text: t.text.muted, border: t.border.default });
                return (
                  <button key={d} onClick={() => setActiveDifficulty(d)}
                    style={{ flex: 1, padding: '6px 0', borderRadius: 8, cursor: 'pointer', fontFamily: '"Nunito", sans-serif', fontSize: 12, fontWeight: 700, transition: 'all 0.15s', background: isActive ? dc.bg : t.bg.cardAlt, color: isActive ? dc.text : t.text.muted, border: `1px solid ${isActive ? dc.border : t.border.default}` }}>
                    {d === 'all' ? 'All' : `${d.charAt(0).toUpperCase() + d.slice(1)}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Atom badges */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {Object.entries(atomCounts).map(([sym, { have, need, ok }]) => (
              <div key={sym} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 10, fontFamily: '"Nunito", sans-serif', fontSize: 13, fontWeight: 700, background: ok ? t.feedback.successBg : t.bg.cardAlt, border: `1px solid ${ok ? t.feedback.successBorder : t.border.default}`, color: ok ? t.feedback.successText : t.text.secondary }}>
                <span style={{ fontWeight: 800 }}>{sym}</span>
                <span style={{ fontSize: 12, opacity: 0.7 }}>{have}/{need}</span>
                {ok && <span style={{ color: t.feedback.successText, fontWeight: 800 }}>&#x2713;</span>}
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontFamily: '"Nunito", sans-serif', fontWeight: 700, letterSpacing: '0.05em', color: t.text.muted, textTransform: 'uppercase' }}>Atoms Placed</span>
              <span style={{ fontSize: 12, fontFamily: '"Space Mono", monospace', color: t.text.muted }}>{current}/{total}</span>
            </div>
            <div style={{ height: 8, background: t.bg.progressBar, borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(100, (current / total) * 100)}%`, background: current === total ? '#14b8a6' : '#5eead4', borderRadius: 999, transition: 'width 0.3s' }} />
            </div>
          </div>

          {/* Hint */}
          <div style={{ padding: '10px 14px', background: t.feedback.warningBg, border: `1px solid ${t.feedback.warningBorder}`, borderRadius: 10 }}>
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: t.feedback.warningText, lineHeight: 1.6 }}>Hint: {challenge.hint}</p>
          </div>

          {/* Submit result */}
          {submitResult && (
            <div style={{ padding: '10px 14px', borderRadius: 10, background: submitResult.ok ? t.feedback.successBg : t.feedback.errorBg, border: `1px solid ${submitResult.ok ? t.feedback.successBorder : t.feedback.errorBorder}`, color: submitResult.ok ? t.feedback.successText : t.feedback.errorText }}>
              <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, lineHeight: 1.6 }}>{submitResult.msg}</p>
            </div>
          )}

          {/* Check answer / completion */}
          {alreadyCompleted ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ padding: '12px 14px', borderRadius: 12, background: t.feedback.successBg, border: `1px solid ${t.feedback.successBorder}`, textAlign: 'center' }}>
                <p style={{ fontFamily: '"Nunito", sans-serif', fontSize: 13, fontWeight: 800, color: t.feedback.successText }}>
                  Challenge Complete!
                </p>
              </div>
              {nextChallenge && (
                <button
                  onClick={() => { dispatch({ type: 'SET_CHALLENGE', payload: nextChallenge }); setSubmitResult(null); }}
                  style={{ padding: 12, borderRadius: 12, color: '#ffffff', fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: 14, cursor: 'pointer', border: 'none', background: '#14b8a6', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#0d9488'; e.currentTarget.style.transform = 'scale(1.02)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#14b8a6'; e.currentTarget.style.transform = 'scale(1)'; }}>
                  Next Challenge (Lvl {nextChallenge.level})
                </button>
              )}
            </div>
          ) : (
            <button onClick={handleSubmit}
              style={{ padding: 12, borderRadius: 12, color: '#ffffff', fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: 14, cursor: 'pointer', border: 'none', background: '#14b8a6', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#0d9488'; e.currentTarget.style.transform = 'scale(1.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#14b8a6'; e.currentTarget.style.transform = 'scale(1)'; }}>
              Check Answer
            </button>
          )}

          {/* Level selector */}
          <div>
            <p style={{ fontFamily: '"Nunito", sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', color: t.text.muted, marginBottom: 8, textTransform: 'uppercase' }}>
              {activeDifficulty === 'all' ? 'All Levels' : `${activeDifficulty.charAt(0).toUpperCase() + activeDifficulty.slice(1)} Levels`}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {filteredLevels.map(q => {
                const isActive = challenge.level === q.level;
                const isDone = state.completedChallenges.includes(q.level);
                const dc = diffColors[q.difficulty] ?? { bg: t.bg.muted, text: t.text.muted, border: t.border.default };
                return (
                  <button key={q.level}
                    onClick={() => { dispatch({ type: 'SET_CHALLENGE', payload: q }); setSubmitResult(null); }}
                    title={`${q.description} (${q.difficulty})`}
                    style={{ minWidth: 40, padding: '5px 10px', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: '"Nunito", sans-serif', fontWeight: 700, transition: 'all 0.15s', background: isActive ? '#14b8a6' : isDone ? dc.bg : t.bg.cardAlt, color: isActive ? '#ffffff' : isDone ? dc.text : t.text.muted, border: isActive ? '1px solid #0d9488' : `1px solid ${isDone ? dc.border : t.border.default}`, display: 'flex', alignItems: 'center', gap: 4 }}>
                    {q.level}
                    {isDone && <span style={{ fontSize: 10, color: dc.text }}>&#x2713;</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
