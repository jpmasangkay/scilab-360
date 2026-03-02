import { useState } from 'react';
import { useApp } from '../store/context';
import { CATEGORY_COLORS, getAtomColor } from '../utils/colors';
import { KNOWN_COMPOUNDS } from '../data/compounds';
import { LewisView } from './LewisView';

type ViewMode = 'ball-stick' | 'lewis';

export function MolecularPanel() {
  const { state, dispatch } = useApp();
  const [view, setView] = useState<ViewMode>('ball-stick');
  const compound = KNOWN_COMPOUNDS[state.formula];
  const bondTypeCounts = state.bonds.reduce<Record<string, number>>((acc, b) => {
    acc[b.type] = (acc[b.type] || 0) + 1;
    return acc;
  }, {});

  const isDark = state.theme === 'dark';
  const toggleBg = isDark ? '#334155' : '#f1f5f9';
  const visBg = isDark ? '#334155' : '#f8fafc';
  const visBorder = isDark ? '#475569' : '#e2e8f0';
  const textColor = isDark ? '#e2e8f0' : '#94a3b8';
  const compoundBg = isDark ? '#0d6e6a' : '#f0fdfa';
  const compoundBorder = isDark ? '#0f9488' : '#99f6e4';
  const compoundText = isDark ? '#e2e8f0' : '#0f766e';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
      {/* Toggle */}
      <div style={{ display: 'flex', gap: 4, background: toggleBg, borderRadius: 10, padding: 4 }}>
        {(['ball-stick', 'lewis'] as ViewMode[]).map(v => (
          <button key={v} onClick={() => setView(v)}
            style={{ flex: 1, padding: '8px 0', fontSize: 12, borderRadius: 8, cursor: 'pointer', fontFamily: '"Nunito", sans-serif', fontWeight: 700, border: 'none', transition: 'all 0.15s', background: view === v ? '#14b8a6' : 'transparent', color: view === v ? '#ffffff' : textColor }}>
            {v === 'ball-stick' ? 'Ball & Stick' : 'Lewis / e'}
          </button>
        ))}
      </div>

      {/* Vis area */}
      <div style={{ flex: 1, borderRadius: 14, overflow: 'hidden', position: 'relative', minHeight: 160, background: visBg, border: `1px solid ${visBorder}` }}>
        {view === 'ball-stick' ? (
          state.placedAtoms.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: textColor }}>No molecule</p>
            </div>
          ) : (
            <svg width="100%" height="100%" viewBox="0 0 300 200" style={{ position: 'absolute', inset: 0 }}>
              {(() => {
                const atoms = state.placedAtoms;
                const minX = Math.min(...atoms.map(a => a.x));
                const maxX = Math.max(...atoms.map(a => a.x));
                const minY = Math.min(...atoms.map(a => a.y));
                const maxY = Math.max(...atoms.map(a => a.y));
                const pad = 40;
                const scale = Math.min((300 - pad * 2) / Math.max(maxX - minX, 60), (200 - pad * 2) / Math.max(maxY - minY, 60), 2.5);
                const cx = (minX + maxX) / 2;
                const cy = (minY + maxY) / 2;
                const ox = 150 - cx * scale;
                const oy = 100 - cy * scale;
                const p = (x: number, y: number) => ({ px: x * scale + ox, py: y * scale + oy });
                const am = new Map(atoms.map(a => [a.id, a]));
                return <>
                  {state.bonds.map((bond, i) => {
                    const a = am.get(bond.from); const b = am.get(bond.to);
                    if (!a || !b) return null;
                    const { px: ax, py: ay } = p(a.x, a.y);
                    const { px: bx, py: by } = p(b.x, b.y);
                    return <line key={i} x1={ax} y1={ay} x2={bx} y2={by} stroke={bond.type === 'ionic' ? '#f43f5e' : '#14b8a6'} strokeWidth={2.5} strokeLinecap="round" />;
                  })}
                  {atoms.map(atom => {
                    const { px, py } = p(atom.x, atom.y);
                    return <g key={atom.id}>
                      <circle cx={px} cy={py} r={14} fill={getAtomColor(atom.element.category)} />
                      <text x={px} y={py + 5} textAnchor="middle" fontSize={12} fontFamily="Nunito, sans-serif" fontWeight="700" fill="#fff">{atom.element.symbol}</text>
                    </g>;
                  })}
                </>;
              })()}
            </svg>
          )
        ) : (
          <div style={{ padding: 8, overflowY: 'auto', height: '100%' }}><LewisView /></div>
        )}
      </div>

      {/* Compound info */}
      {compound && (
        <div style={{ padding: '12px 14px', background: compoundBg, border: `1px solid ${compoundBorder}`, borderRadius: 12 }}>
          <p style={{ fontFamily: '"Nunito", sans-serif', fontSize: 14, fontWeight: 800, color: compoundText, marginBottom: 6 }}>{compound.name}</p>
          <div style={{ display: 'flex', gap: 16 }}>
            <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 12, color: compoundText }}>{compound.geometry}</span>
            <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 12, color: compoundText }}>{compound.bondAngle}</span>
          </div>
        </div>
      )}

      {/* Bond stats */}
      {state.bonds.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ fontFamily: '"Nunito", sans-serif', fontSize: 11, fontWeight: 800, letterSpacing: '0.05em', color: isDark ? '#14b8a6' : '#0f766e', textTransform: 'uppercase' }}>Bonds Detected</p>
          {Object.entries(bondTypeCounts).map(([type, count]) => {
            const bondColor = type === 'ionic' ? '#f43f5e' : type === 'metallic' ? '#3b82f6' : '#14b8a6';
            return (
              <div key={type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 24, height: 3, background: bondColor, borderRadius: 2 }} />
                  <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: textColor, textTransform: 'capitalize' }}>{type}</span>
                </div>
                <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 13, fontWeight: 700, color: isDark ? '#e2e8f0' : '#1e293b' }}>{count}x</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected element */}
      {state.selectedElement && (
        <div style={{ padding: '12px 14px', background: isDark ? '#334155' : '#ffffff', border: `2px solid ${CATEGORY_COLORS[state.selectedElement.category].border}`, borderRadius: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 900, fontSize: 22, color: CATEGORY_COLORS[state.selectedElement.category].text }}>{state.selectedElement.symbol}</span>
            <button onClick={() => dispatch({ type: 'SELECT_ELEMENT', payload: null })} style={{ cursor: 'pointer', background: 'transparent', border: 'none', fontSize: 16, color: '#94a3b8' }}>&#x2715;</button>
          </div>
          <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: '#475569', marginBottom: 12 }}>{state.selectedElement.name}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {[
              ['Atomic #', state.selectedElement.atomicNumber],
              ['Period', state.selectedElement.period],
              ['Group', state.selectedElement.group ?? '--'],
              ['Valence e', state.selectedElement.valenceElectrons],
              ['Category', state.selectedElement.category.replace(/-/g, ' ')],
              ['Electronegativity', state.selectedElement.electronegativity ?? '--'],
            ].map(([label, value]) => (
              <div key={String(label)} style={{ padding: '8px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
                <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8', marginBottom: 3 }}>{label}</p>
                <p style={{ fontFamily: '"Nunito", sans-serif', fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{String(value)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
