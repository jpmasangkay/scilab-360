import { useState } from 'react';
import { useApp } from '../store/context';
import { QUIZ_LEVELS, DIFFICULTY_CONFIG } from '../data/quizLevels';
import type { Difficulty } from '../types';

const S = {
  mono: '"Share Tech Mono", monospace',
  orbit: 'Orbitron, monospace',
};

export function QuizPanel() {
  const { state, dispatch } = useApp();
  const [collapsed, setCollapsed] = useState(true);
  const [submitResult, setSubmitResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty | 'all'>('all');

  if (state.mode !== 'quiz') return null;

  const challenge = state.currentChallenge;

  const filteredLevels = activeDifficulty === 'all'
    ? QUIZ_LEVELS
    : QUIZ_LEVELS.filter(q => q.difficulty === activeDifficulty);

  if (!challenge) {
    return (
      <div style={{ padding: 16, borderRadius: 12, textAlign: 'center', background: '#1a0533', border: '1px solid #6d28d9', boxShadow: '0 0 20px #a855f730' }}>
        <p style={{ fontFamily: S.orbit, fontSize: 14, fontWeight: 700, color: '#f3e8ff' }}>🏆 ALL CHALLENGES COMPLETE!</p>
        <p style={{ fontFamily: S.mono, fontSize: 13, color: '#c4b5fd', marginTop: 6 }}>Score: {state.score}</p>
        <button onClick={() => dispatch({ type: 'SET_LEVEL', payload: 1 })}
          style={{ marginTop: 12, padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontFamily: S.mono, fontSize: 13, background: '#3b0764', border: '1px solid #a855f7', color: '#e9d5ff' }}>
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

  const handleSubmit = () => {
    dispatch({ type: 'INC_ATTEMPTS' });
    const formula = state.formula;
    if (formula === challenge.targetFormula) {
      const multiplier = challenge.difficulty === 'hard' ? 2 : challenge.difficulty === 'medium' ? 1.5 : 1;
      const pts = Math.round(Math.max(50, 100 + (3 - Math.min(3, state.attempts)) * 25) * multiplier);
      setSubmitResult({ ok: true, msg: `✅ Correct! ${challenge.description} — +${pts} pts` });
      dispatch({ type: 'ADD_SCORE', payload: pts });
      dispatch({ type: 'COMPLETE_CHALLENGE', payload: challenge.level });
      return;
    }
    if (state.placedAtoms.length === 0) {
      setSubmitResult({ ok: false, msg: '❌ No atoms placed! Drag atoms from the periodic table first.' });
    } else {
      const wrongAtoms = Object.entries(challenge.requiredAtoms).filter(([sym, need]) =>
        state.placedAtoms.filter(a => a.element.symbol === sym).length !== need
      );
      const extraAtoms = state.placedAtoms.filter(a => !challenge.requiredAtoms[a.element.symbol]);
      let diag = `❌ Not quite! Current: ${formula || '—'}, Target: ${challenge.targetFormula}.`;
      if (wrongAtoms.length) diag += ` ${wrongAtoms.map(([s, n]) => `Need ${n}×${s}`).join(', ')}.`;
      if (extraAtoms.length) diag += ` Remove: ${[...new Set(extraAtoms.map(a => a.element.symbol))].join(', ')}.`;
      setSubmitResult({ ok: false, msg: diag });
    }
  };

  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', background: '#0d0120', border: '1px solid #2d1b5e' }}>
      {/* Header */}
      <div onClick={() => setCollapsed(v => !v)}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', cursor: 'pointer', background: '#130929', borderBottom: collapsed ? 'none' : '1px solid #2d1b5e' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 11, fontFamily: S.mono, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: '#500724', color: '#f9a8d4', border: '1px solid #9d174d' }}>
            LVL {challenge.level}
          </span>
          <span style={{ fontSize: 10, fontFamily: S.mono, fontWeight: 700, padding: '2px 7px', borderRadius: 6, background: diff.bg, color: diff.color, border: `1px solid ${diff.border}` }}>
            {diff.emoji} {diff.label.toUpperCase()}
          </span>
          <span style={{ fontSize: 12, fontFamily: S.orbit, fontWeight: 700, color: '#f3e8ff' }}>
            {challenge.description}
          </span>
        </div>
        <span style={{ color: '#9f7aea', fontSize: 14, display: 'inline-block', transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▾</span>
      </div>

      {!collapsed && (
        <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* ── Difficulty selector ── */}
          <div>
            <p style={{ fontFamily: S.mono, fontSize: 10, color: '#9f7aea', letterSpacing: '0.1em', marginBottom: 7, fontWeight: 700 }}>DIFFICULTY</p>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['all', 'easy', 'medium', 'hard'] as const).map(d => {
                const isActive = activeDifficulty === d;
                const cfg = d === 'all' ? { color: '#c4b5fd', bg: '#1e0b3e', border: '#3b1d6e', emoji: '⚡' } : DIFFICULTY_CONFIG[d];
                return (
                  <button key={d} onClick={() => setActiveDifficulty(d)}
                    style={{ flex: 1, padding: '6px 0', borderRadius: 8, cursor: 'pointer', fontFamily: S.mono, fontSize: 11, fontWeight: 700, transition: 'all 0.15s', background: isActive ? cfg.bg : '#07011a', color: isActive ? cfg.color : '#6b21a8', border: `1px solid ${isActive ? cfg.border : '#1e0b3e'}`, boxShadow: isActive ? `0 0 8px ${cfg.color}40` : 'none' }}>
                    {d === 'all' ? '⚡ All' : `${(DIFFICULTY_CONFIG[d]).emoji} ${d.charAt(0).toUpperCase() + d.slice(1)}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Atom badges */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {Object.entries(atomCounts).map(([sym, { have, need, ok }]) => (
              <div key={sym} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, fontFamily: S.mono, fontSize: 13, fontWeight: 700, background: ok ? '#1a0533' : '#1e0b3e', border: `1px solid ${ok ? '#a855f7' : '#3b1d6e'}`, color: ok ? '#e9d5ff' : '#c4b5fd', boxShadow: ok ? '0 0 8px #a855f740' : 'none' }}>
                <span>{sym}</span>
                <span style={{ fontSize: 11, opacity: 0.8 }}>{have}/{need}</span>
                {ok && <span style={{ color: '#86efac' }}>✓</span>}
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontFamily: S.mono, fontWeight: 700, letterSpacing: '0.1em', color: '#a78bfa' }}>ATOMS PLACED</span>
              <span style={{ fontSize: 12, fontFamily: S.mono, color: '#c4b5fd' }}>{current}/{total}</span>
            </div>
            <div style={{ height: 8, background: '#1e0b3e', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(100, (current / total) * 100)}%`, background: current === total ? '#a855f7' : '#6d28d9', boxShadow: '0 0 6px #a855f7', borderRadius: 999, transition: 'width 0.3s' }} />
            </div>
          </div>

          {/* Hint */}
          <div style={{ padding: '10px 12px', background: '#07011a', border: '1px solid #2d1b5e', borderRadius: 8 }}>
            <p style={{ fontFamily: S.mono, fontSize: 12, color: '#c4b5fd', lineHeight: 1.6 }}>💡 {challenge.hint}</p>
          </div>

          {/* Submit result */}
          {submitResult && (
            <div style={{ padding: '10px 12px', borderRadius: 8, background: submitResult.ok ? '#052e16' : '#2d0a0a', border: `1px solid ${submitResult.ok ? '#a855f7' : '#f43f5e'}`, color: submitResult.ok ? '#86efac' : '#fca5a5' }}>
              <p style={{ fontFamily: S.mono, fontSize: 13, lineHeight: 1.6 }}>{submitResult.msg}</p>
            </div>
          )}

          {/* Check answer */}
          <button onClick={handleSubmit}
            style={{ padding: 12, borderRadius: 12, color: '#fff', fontFamily: S.orbit, fontWeight: 700, fontSize: 13, letterSpacing: '0.1em', cursor: 'pointer', border: 'none', background: 'linear-gradient(135deg, #6d28d9, #a855f7)', boxShadow: '0 0 20px #a855f760', transition: 'all 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 30px #a855f7bb'; (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px #a855f760'; (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}>
            ⚗ CHECK ANSWER
          </button>

          {/* Level selector filtered by difficulty */}
          <div>
            <p style={{ fontFamily: S.mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#9f7aea', marginBottom: 8 }}>
              {activeDifficulty === 'all' ? 'ALL LEVELS' : `${activeDifficulty.toUpperCase()} LEVELS`}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {filteredLevels.map(q => {
                const isActive = challenge.level === q.level;
                const isDone = state.completedChallenges.includes(q.level);
                const dc = DIFFICULTY_CONFIG[q.difficulty];
                return (
                  <button key={q.level}
                    onClick={() => { dispatch({ type: 'SET_CHALLENGE', payload: q }); setSubmitResult(null); }}
                    title={`${q.description} (${q.difficulty})`}
                    style={{ minWidth: 40, padding: '5px 8px', borderRadius: 6, fontSize: 11, cursor: 'pointer', fontFamily: S.mono, fontWeight: 700, transition: 'all 0.15s', background: isDone ? '#1a0533' : isActive ? '#6d28d9' : '#1e0b3e', color: isDone ? dc.color : isActive ? '#fff' : '#9f7aea', border: isActive ? '1px solid #a855f7' : `1px solid ${isDone ? dc.border : '#2d1b5e'}`, boxShadow: isActive ? '0 0 6px #a855f760' : 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 9 }}>{dc.emoji}</span> {q.level}
                    {isDone && <span style={{ fontSize: 9, color: dc.color }}>✓</span>}
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
