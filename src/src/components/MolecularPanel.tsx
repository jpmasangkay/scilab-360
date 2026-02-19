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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
      {/* Toggle */}
      <div style={{ display: 'flex', gap: 4, background: '#07011a', borderRadius: 8, padding: 4 }}>
        {(['ball-stick', 'lewis'] as ViewMode[]).map(v => (
          <button key={v} onClick={() => setView(v)}
            style={{ flex: 1, padding: '8px 0', fontSize: 12, borderRadius: 6, cursor: 'pointer', fontFamily: '"Share Tech Mono", monospace', fontWeight: 700, border: 'none', transition: 'all 0.15s', background: view === v ? '#6d28d9' : 'transparent', color: view === v ? '#fff' : '#c4b5fd', boxShadow: view === v ? '0 0 8px #a855f760' : 'none' }}>
            {v === 'ball-stick' ? 'Ball & Stick' : 'Lewis / e⁻'}
          </button>
        ))}
      </div>

      {/* Vis area */}
      <div style={{ flex: 1, borderRadius: 12, overflow: 'hidden', position: 'relative', minHeight: 160, background: '#07011a', border: '1px solid #2d1b5e' }}>
        {view === 'ball-stick' ? (
          state.placedAtoms.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <p style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 12, color: '#4c1d95' }}>No molecule</p>
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
                    return <line key={i} x1={ax} y1={ay} x2={bx} y2={by} stroke={bond.type === 'ionic' ? '#f43f5e' : '#a855f7'} strokeWidth={2.5} />;
                  })}
                  {atoms.map(atom => {
                    const { px, py } = p(atom.x, atom.y);
                    return <g key={atom.id}>
                      <circle cx={px} cy={py} r={14} fill={getAtomColor(atom.element.category)} opacity={0.9} />
                      <text x={px} y={py + 5} textAnchor="middle" fontSize={12} fontFamily="Orbitron,monospace" fontWeight="700" fill="#fff">{atom.element.symbol}</text>
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
        <div style={{ padding: '12px 14px', background: '#1a0533', border: '1px solid #6d28d9', borderRadius: 12, boxShadow: '0 0 12px #a855f720' }}>
          <p style={{ fontFamily: 'Orbitron, monospace', fontSize: 13, fontWeight: 700, color: '#f3e8ff', marginBottom: 8 }}>{compound.name}</p>
          <div style={{ display: 'flex', gap: 16 }}>
            <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 12, color: '#c4b5fd' }}>📐 {compound.geometry}</span>
            <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 12, color: '#c4b5fd' }}>∠ {compound.bondAngle}</span>
          </div>
        </div>
      )}

      {/* Bond stats */}
      {state.bonds.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ fontFamily: 'Orbitron, monospace', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#d8b4fe' }}>BONDS DETECTED</p>
          {Object.entries(bondTypeCounts).map(([type, count]) => {
            const bondColor = type === 'ionic' ? '#f43f5e' : type === 'metallic' ? '#818cf8' : '#a855f7';
            return (
              <div key={type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 24, height: 2, background: bondColor, boxShadow: `0 0 4px ${bondColor}`, borderRadius: 2 }} />
                  <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 13, color: '#e9d5ff', textTransform: 'capitalize' }}>{type}</span>
                </div>
                <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 13, fontWeight: 700, color: '#fff' }}>{count}×</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected element */}
      {state.selectedElement && (
        <div style={{ padding: '12px 14px', background: '#130929', border: `1px solid ${CATEGORY_COLORS[state.selectedElement.category].border}`, borderRadius: 12, boxShadow: `0 0 12px ${CATEGORY_COLORS[state.selectedElement.category].glow}20` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontFamily: 'Orbitron, monospace', fontWeight: 700, fontSize: 20, color: CATEGORY_COLORS[state.selectedElement.category].text }}>{state.selectedElement.symbol}</span>
            <button onClick={() => dispatch({ type: 'SELECT_ELEMENT', payload: null })} style={{ cursor: 'pointer', background: 'transparent', border: 'none', fontSize: 16, color: '#a78bfa' }}>✕</button>
          </div>
          <p style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 13, color: '#e9d5ff', marginBottom: 12 }}>{state.selectedElement.name}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              ['Atomic #', state.selectedElement.atomicNumber],
              ['Period', state.selectedElement.period],
              ['Group', state.selectedElement.group ?? '—'],
              ['Valence e⁻', state.selectedElement.valenceElectrons],
              ['Category', state.selectedElement.category.replace(/-/g, ' ')],
              ['Electronegativity', state.selectedElement.electronegativity ?? '—'],
            ].map(([label, value]) => (
              <div key={String(label)} style={{ padding: '8px 10px', background: '#07011a', border: '1px solid #2d1b5e', borderRadius: 8 }}>
                <p style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9f7aea', marginBottom: 4 }}>{label}</p>
                <p style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 13, fontWeight: 700, color: '#f3e8ff' }}>{String(value)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
