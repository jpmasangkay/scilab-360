import { useState } from 'react';
import { useApp } from '../../shared/store/context';
import { useTheme } from '../../shared/store/theme';
import { getCategoryColors, getAtomColor } from '../../shared/utils/colors';
import { KNOWN_COMPOUNDS } from '../../shared/data/compounds';
import { LewisView } from './LewisView';

type ViewMode = 'ball-stick' | 'lewis';

export function MolecularPanel() {
  const { state, dispatch } = useApp();
  const { theme } = useTheme();
  const CATEGORY_COLORS = getCategoryColors(theme.isDark);
  const [view, setView] = useState<ViewMode>('ball-stick');
  const compound = KNOWN_COMPOUNDS[state.formula];
  const bondTypeCounts = state.bonds.reduce<Record<string, number>>((acc, b) => {
    acc[b.type] = (acc[b.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
      {/* Toggle */}
      <div style={{ display: 'flex', gap: 4, background: theme.statBg, borderRadius: 10, padding: 4 }}>
        {(['ball-stick', 'lewis'] as ViewMode[]).map(v => (
          <button key={v} onClick={() => setView(v)}
            style={{ flex: 1, padding: '8px 0', fontSize: 12, borderRadius: 8, cursor: 'pointer', fontFamily: '"Playfair Display", serif', fontWeight: 700, border: 'none', transition: 'all 0.15s', background: view === v ? theme.accent : 'transparent', color: view === v ? '#ffffff' : theme.textSecondary }}>
            {v === 'ball-stick' ? 'Ball & Stick' : 'Lewis / e'}
          </button>
        ))}
      </div>

      {/* Vis area */}
      <div style={{ flex: 1, borderRadius: 14, overflow: 'hidden', position: 'relative', minHeight: 160, background: theme.surfaceAlt, border: `1px solid ${theme.border}` }}>
        {view === 'ball-stick' ? (
          state.placedAtoms.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: theme.textTertiary }}>No molecule</p>
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
                    return <line key={i} x1={ax} y1={ay} x2={bx} y2={by} stroke={bond.type === 'ionic' ? '#B85030' : '#0E6B68'} strokeWidth={2.5} strokeLinecap="round" />;
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
        <div style={{ padding: '12px 14px', background: theme.accentBg, border: `1px solid ${theme.accentBorder}`, borderRadius: 12 }}>
          <p style={{ fontFamily: '"Playfair Display", serif', fontSize: 14, fontWeight: 800, color: theme.accent, marginBottom: 6 }}>{compound.name}</p>
          <div style={{ display: 'flex', gap: 16 }}>
            <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 12, color: theme.textSecondary }}>{compound.geometry}</span>
            <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 12, color: theme.textSecondary }}>{compound.bondAngle}</span>
          </div>
        </div>
      )}

      {/* Bond stats */}
      {state.bonds.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ fontFamily: '"Playfair Display", serif', fontSize: 11, fontWeight: 800, letterSpacing: '0.05em', color: theme.accent, textTransform: 'uppercase' }}>Bonds Detected</p>
          {Object.entries(bondTypeCounts).map(([type, count]) => {
            const bondColor = type === 'ionic' ? '#B85030' : type === 'metallic' ? '#4A78A0' : '#0E6B68';
            return (
              <div key={type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 24, height: 3, background: bondColor, borderRadius: 2 }} />
                  <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: theme.textSecondary, textTransform: 'capitalize' }}>{type}</span>
                </div>
                <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 13, fontWeight: 700, color: theme.text }}>{count}x</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected element */}
      {state.selectedElement && (
        <div style={{ padding: '12px 14px', background: theme.surface, border: `2px solid ${CATEGORY_COLORS[state.selectedElement.category].border}`, borderRadius: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontFamily: '"Playfair Display", serif', fontWeight: 900, fontSize: 22, color: CATEGORY_COLORS[state.selectedElement.category].text }}>{state.selectedElement.symbol}</span>
            <button onClick={() => dispatch({ type: 'SELECT_ELEMENT', payload: null })} style={{ cursor: 'pointer', background: 'transparent', border: 'none', fontSize: 16, color: theme.textTertiary }}>&#x2715;</button>
          </div>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: theme.textSecondary, marginBottom: 12 }}>{state.selectedElement.name}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {[
              ['Atomic #', state.selectedElement.atomicNumber],
              ['Period', state.selectedElement.period],
              ['Group', state.selectedElement.group ?? '--'],
              ['Valence e', state.selectedElement.valenceElectrons],
              ['Category', state.selectedElement.category.replace(/-/g, ' ')],
              ['Electronegativity', state.selectedElement.electronegativity ?? '--'],
            ].map(([label, value]) => (
              <div key={String(label)} style={{ padding: '8px 10px', background: theme.surfaceAlt, border: `1px solid ${theme.border}`, borderRadius: 8 }}>
                <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em', color: theme.textTertiary, marginBottom: 3 }}>{label}</p>
                <p style={{ fontFamily: '"Playfair Display", serif', fontSize: 13, fontWeight: 700, color: theme.text }}>{String(value)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
