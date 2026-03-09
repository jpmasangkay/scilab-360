import { useState, useMemo, useEffect } from 'react';
import { X, Search, Beaker, Zap, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import { useTheme } from '../../shared/store/theme';
import { BONDING_DATA, BOND_TYPE_INFO } from '../../shared/data/bondings';
import type { BondingEntry } from '../../shared/data/bondings';
import { STRUCTURES, ATOM_COLORS } from '../../shared/data/molecularStructures';
import type { MolecularStructure } from '../../shared/data/molecularStructures';

type BondFilter = 'all' | 'covalent' | 'polar-covalent' | 'ionic' | 'metallic' | 'coordinate';
type CategoryFilter = 'all' | 'organic' | 'inorganic' | 'acid' | 'base' | 'salt' | 'oxide' | 'hydride' | 'other';

const BOND_FILTERS: { value: BondFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'covalent', label: 'Covalent' },
  { value: 'polar-covalent', label: 'Polar Covalent' },
  { value: 'ionic', label: 'Ionic' },
  { value: 'metallic', label: 'Metallic' },
  { value: 'coordinate', label: 'Coordinate' },
];

const CAT_FILTERS: { value: CategoryFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'acid', label: 'Acids' },
  { value: 'base', label: 'Bases' },
  { value: 'salt', label: 'Salts' },
  { value: 'oxide', label: 'Oxides' },
  { value: 'organic', label: 'Organic' },
  { value: 'other', label: 'Other' },
];

// ── SVG Molecular Diagram ─────────────────────────────────────
function MolecularDiagram({ structure, bondColor, size = 120, theme }: {
  structure: MolecularStructure;
  bondColor: string;
  size?: number;
  theme: ReturnType<typeof useTheme>['theme'];
}) {
  const r = size < 100 ? 6 : 8;
  const fontSize = size < 100 ? 5 : 7;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ borderRadius: 10, background: theme.surfaceAlt, border: `1px solid ${theme.borderLight}`, flexShrink: 0 }}>
      {/* Bonds */}
      {structure.bonds.map((bond, i) => {
        const a = structure.atoms[bond.a];
        const b = structure.atoms[bond.b];
        if (!a || !b) return null;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        const gap = 3;

        if (bond.o === 1) {
          return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={bondColor} strokeWidth={1.5} strokeLinecap="round" opacity={0.7} />;
        }
        if (bond.o === 2) {
          return <g key={i}>
            <line x1={a.x + nx * gap} y1={a.y + ny * gap} x2={b.x + nx * gap} y2={b.y + ny * gap} stroke={bondColor} strokeWidth={1.2} strokeLinecap="round" opacity={0.7} />
            <line x1={a.x - nx * gap} y1={a.y - ny * gap} x2={b.x - nx * gap} y2={b.y - ny * gap} stroke={bondColor} strokeWidth={1.2} strokeLinecap="round" opacity={0.7} />
          </g>;
        }
        // Triple
        return <g key={i}>
          <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={bondColor} strokeWidth={1.2} strokeLinecap="round" opacity={0.7} />
          <line x1={a.x + nx * gap} y1={a.y + ny * gap} x2={b.x + nx * gap} y2={b.y + ny * gap} stroke={bondColor} strokeWidth={1.2} strokeLinecap="round" opacity={0.7} />
          <line x1={a.x - nx * gap} y1={a.y - ny * gap} x2={b.x - nx * gap} y2={b.y - ny * gap} stroke={bondColor} strokeWidth={1.2} strokeLinecap="round" opacity={0.7} />
        </g>;
      })}

      {/* Atoms */}
      {structure.atoms.map((atom, i) => {
        const color = ATOM_COLORS[atom.s] || '#94a3b8';
        return <g key={i}>
          <circle cx={atom.x} cy={atom.y} r={r} fill={color} stroke={theme.isDark ? '#ffffff20' : '#00000015'} strokeWidth={1} />
          <text x={atom.x} y={atom.y + (fontSize * 0.35)} textAnchor="middle" fontSize={fontSize} fontFamily="Nunito, sans-serif" fontWeight="800" fill="#fff">{atom.s}</text>
        </g>;
      })}
    </svg>
  );
}

function BondingCard({ entry, theme }: { entry: BondingEntry; theme: ReturnType<typeof useTheme>['theme'] }) {
  const [expanded, setExpanded] = useState(false);
  const bondInfo = BOND_TYPE_INFO[entry.bondType];
  const structure = STRUCTURES[entry.id];

  return (
    <div
      style={{
        borderRadius: 14,
        overflow: 'hidden',
        background: theme.surface,
        border: `1px solid ${theme.border}`,
        transition: 'all 0.2s',
        boxShadow: theme.shadow,
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = theme.shadowLg; (e.currentTarget as HTMLDivElement).style.borderColor = bondInfo.color + '60'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = theme.shadow; (e.currentTarget as HTMLDivElement).style.borderColor = theme.border; }}
    >
      {/* Header */}
      <div
        onClick={() => setExpanded(v => !v)}
        style={{ padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 12 }}
      >
        {/* Mini diagram */}
        {structure && <MolecularDiagram structure={structure} bondColor={bondInfo.color} size={64} theme={theme} />}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
            <span style={{
              fontFamily: '"Nunito", sans-serif', fontWeight: 900, fontSize: 20, color: theme.text, letterSpacing: '-0.01em',
            }}>
              {entry.formula}
            </span>
            <span style={{
              padding: '2px 10px', borderRadius: 6, fontSize: 10, fontFamily: '"Nunito", sans-serif', fontWeight: 700,
              background: bondInfo.color + '18', color: bondInfo.color, border: `1px solid ${bondInfo.color}30`,
              textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>
              {bondInfo.label}
            </span>
            <span style={{
              padding: '2px 8px', borderRadius: 6, fontSize: 10, fontFamily: '"Inter", sans-serif', fontWeight: 600,
              background: theme.statBg, color: theme.textSecondary,
              textTransform: 'capitalize',
            }}>
              {entry.category}
            </span>
          </div>
          <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, fontWeight: 600, color: theme.textSecondary, marginBottom: 4 }}>
            {entry.name}
          </p>
          {!expanded && (
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: theme.textTertiary, lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
              {entry.description}
            </p>
          )}
        </div>
        <div style={{ flexShrink: 0, color: theme.textTertiary, marginTop: 4 }}>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Large diagram */}
          {structure && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
              <MolecularDiagram structure={structure} bondColor={bondInfo.color} size={180} theme={theme} />
            </div>
          )}

          {/* Description */}
          <div style={{ padding: '12px 14px', background: theme.surfaceAlt, borderRadius: 10, border: `1px solid ${theme.borderLight}` }}>
            <p style={{ fontFamily: '"Nunito", sans-serif', fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', color: bondInfo.color, marginBottom: 6, textTransform: 'uppercase' }}>
              How It Bonds
            </p>
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: theme.text, lineHeight: 1.7 }}>
              {entry.description}
            </p>
          </div>

          {/* Properties */}
          <div style={{ padding: '12px 14px', background: theme.surfaceAlt, borderRadius: 10, border: `1px solid ${theme.borderLight}` }}>
            <p style={{ fontFamily: '"Nunito", sans-serif', fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', color: theme.accent, marginBottom: 6, textTransform: 'uppercase' }}>
              Properties & Uses
            </p>
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: theme.text, lineHeight: 1.7 }}>
              {entry.properties}
            </p>
          </div>

          {/* Data grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 8 }}>
            {[
              ['Molar Mass', `${entry.molarMass} g/mol`],
              ['ΔEN', entry.electronegativityDiff.toFixed(2)],
              ['State', entry.state.charAt(0).toUpperCase() + entry.state.slice(1)],
              ['Atoms', entry.atoms.join(', ')],
            ].map(([label, value]) => (
              <div key={label} style={{ padding: '10px 12px', borderRadius: 10, background: theme.surface, border: `1px solid ${theme.border}` }}>
                <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 9, color: theme.textTertiary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{label}</p>
                <p style={{ fontFamily: '"Nunito", sans-serif', fontSize: 14, fontWeight: 700, color: theme.text }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface BondingsPanelProps { onClose: () => void; }

function usePanelWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
}

export function BondingsPanel({ onClose }: BondingsPanelProps) {
  const { theme } = useTheme();
  const [search, setSearch] = useState('');
  const [bondFilter, setBondFilter] = useState<BondFilter>('all');
  const [catFilter, setCatFilter] = useState<CategoryFilter>('all');
  const [showFilters, setShowFilters] = useState(false);
  const panelWidth = usePanelWidth();
  const isMobile = panelWidth < 640;

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return BONDING_DATA.filter(entry => {
      const matchSearch = !search ||
        entry.name.toLowerCase().includes(s) ||
        entry.formula.toLowerCase().includes(s) ||
        entry.description.toLowerCase().includes(s) ||
        entry.atoms.some(a => a.toLowerCase() === s);
      const matchBond = bondFilter === 'all' || entry.bondType === bondFilter;
      const matchCat = catFilter === 'all' || entry.category === catFilter;
      return matchSearch && matchBond && matchCat;
    });
  }, [search, bondFilter, catFilter]);

  const bondCounts = useMemo(() => {
    const counts: Record<string, number> = { all: BONDING_DATA.length };
    BONDING_DATA.forEach(e => { counts[e.bondType] = (counts[e.bondType] || 0) + 1; });
    return counts;
  }, []);

  const activeFilterCount = (bondFilter !== 'all' ? 1 : 0) + (catFilter !== 'all' ? 1 : 0);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', flexDirection: 'column', background: theme.bg, fontFamily: '"Inter", sans-serif' }}>

      {/* Header */}
      <div style={{
        display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', justifyContent: 'space-between',
        padding: isMobile ? '12px 14px' : '14px 24px', background: theme.surface, borderBottom: `1px solid ${theme.border}`,
        flexShrink: 0, gap: isMobile ? 10 : 12, boxShadow: theme.shadow,
      }}>
        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <div style={{ width: isMobile ? 32 : 36, height: isMobile ? 32 : 36, borderRadius: 10, background: theme.accentBg, border: `1px solid ${theme.accent}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Beaker size={isMobile ? 17 : 20} color={theme.accentDark} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: isMobile ? 17 : 20, color: theme.logoText, letterSpacing: '0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Molecular Bonding
              </p>
              <p style={{ fontFamily: '"Inter", sans-serif', fontSize: isMobile ? 11 : 12, color: theme.textTertiary }}>
                {BONDING_DATA.length} chemical bonds & compounds
              </p>
            </div>
          </div>
          {isMobile && (
            <button
              onClick={onClose}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: 10, flexShrink: 0, background: theme.surfaceAlt, border: `1px solid ${theme.border}`, color: theme.textSecondary, cursor: 'pointer', transition: 'all 0.15s' }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Search row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: isMobile ? undefined : 1, maxWidth: isMobile ? '100%' : 400, minWidth: 0 }}>
          {isMobile && (
            <button
              onClick={() => setShowFilters(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                height: 36, padding: '0 10px', borderRadius: 10, flexShrink: 0,
                background: showFilters || activeFilterCount > 0 ? theme.accentBg : theme.surfaceAlt,
                border: `1px solid ${showFilters || activeFilterCount > 0 ? theme.accent + '60' : theme.border}`,
                color: showFilters || activeFilterCount > 0 ? theme.accent : theme.textSecondary,
                cursor: 'pointer', transition: 'all 0.15s',
                fontFamily: '"Nunito", sans-serif', fontSize: 12, fontWeight: 700,
              }}
            >
              <SlidersHorizontal size={14} />
              {activeFilterCount > 0 && (
                <span style={{
                  width: 18, height: 18, borderRadius: '50%', background: theme.accent, color: '#fff',
                  fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{activeFilterCount}</span>
              )}
            </button>
          )}
          <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: theme.textTertiary }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={isMobile ? 'Search...' : 'Search bonds, compounds, atoms...'}
              style={{
                width: '100%', padding: '8px 14px 8px 34px', background: theme.inputBg, border: `1px solid ${theme.inputBorder}`,
                borderRadius: 10, color: theme.text, fontFamily: '"Inter", sans-serif',
                fontSize: 13, outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = theme.accent)}
              onBlur={e => (e.currentTarget.style.borderColor = theme.inputBorder)}
            />
          </div>
          {!isMobile && (
            <button
              onClick={onClose}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: theme.surfaceAlt, border: `1px solid ${theme.border}`, color: theme.textSecondary, cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={e => { const b = e.currentTarget; b.style.background = theme.dangerBg; b.style.borderColor = theme.dangerBorder; b.style.color = theme.dangerText; }}
              onMouseLeave={e => { const b = e.currentTarget; b.style.background = theme.surfaceAlt; b.style.borderColor = theme.border; b.style.color = theme.textSecondary; }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile filters drawer */}
      {isMobile && showFilters && (
        <div style={{
          flexShrink: 0, background: theme.surface, borderBottom: `1px solid ${theme.border}`,
          padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10,
          maxHeight: '40vh', overflowY: 'auto',
        }}>
          {/* Bond type pills */}
          <div>
            <p style={{ fontFamily: '"Nunito", sans-serif', fontSize: 10, fontWeight: 800, letterSpacing: '0.05em', color: theme.accent, marginBottom: 8, textTransform: 'uppercase' }}>Bond Type</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {BOND_FILTERS.map(f => {
                const active = bondFilter === f.value;
                const info = f.value === 'all' ? { color: theme.accent, label: f.label } : BOND_TYPE_INFO[f.value];
                return (
                  <button key={f.value} onClick={() => setBondFilter(f.value)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '5px 10px', borderRadius: 16, cursor: 'pointer',
                      fontFamily: '"Nunito", sans-serif', fontSize: 11, fontWeight: 700,
                      background: active ? info.color + '18' : theme.surfaceAlt,
                      border: active ? `1px solid ${info.color}50` : `1px solid ${theme.border}`,
                      color: active ? info.color : theme.textSecondary,
                      transition: 'all 0.15s', whiteSpace: 'nowrap',
                    }}>
                    {f.label}
                    <span style={{ fontSize: 10, opacity: 0.6, fontFamily: '"Space Mono", monospace' }}>{bondCounts[f.value] ?? 0}</span>
                  </button>
                );
              })}
            </div>
          </div>
          {/* Category pills */}
          <div>
            <p style={{ fontFamily: '"Nunito", sans-serif', fontSize: 10, fontWeight: 800, letterSpacing: '0.05em', color: theme.accent, marginBottom: 8, textTransform: 'uppercase' }}>Category</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {CAT_FILTERS.map(f => {
                const active = catFilter === f.value;
                return (
                  <button key={f.value} onClick={() => setCatFilter(f.value)}
                    style={{
                      padding: '5px 10px', borderRadius: 16, cursor: 'pointer',
                      fontFamily: '"Nunito", sans-serif', fontSize: 11, fontWeight: 700,
                      background: active ? theme.accentBg : theme.surfaceAlt,
                      border: active ? `1px solid ${theme.accent}50` : `1px solid ${theme.border}`,
                      color: active ? theme.accent : theme.textSecondary,
                      transition: 'all 0.15s', whiteSpace: 'nowrap',
                    }}>
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Sidebar — desktop only */}
        {!isMobile && (
          <div style={{ width: 220, flexShrink: 0, borderRight: `1px solid ${theme.border}`, background: theme.surface, padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Bond type summary */}
            <div>
              <p style={{ fontFamily: '"Nunito", sans-serif', fontSize: 11, fontWeight: 800, letterSpacing: '0.05em', color: theme.accent, marginBottom: 10, textTransform: 'uppercase' }}>Bond Type</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {BOND_FILTERS.map(f => {
                  const active = bondFilter === f.value;
                  const info = f.value === 'all' ? { color: theme.accent, label: f.label } : BOND_TYPE_INFO[f.value];
                  return (
                    <button key={f.value} onClick={() => setBondFilter(f.value)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
                        fontFamily: '"Nunito", sans-serif', fontSize: 12, fontWeight: 700,
                        background: active ? info.color + '18' : 'transparent',
                        border: active ? `1px solid ${info.color}40` : '1px solid transparent',
                        color: active ? info.color : theme.textSecondary,
                        transition: 'all 0.15s', textAlign: 'left',
                      }}>
                      <span>{f.label}</span>
                      <span style={{ fontSize: 11, opacity: 0.6, fontFamily: '"Space Mono", monospace' }}>{bondCounts[f.value] ?? 0}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category filter */}
            <div>
              <p style={{ fontFamily: '"Nunito", sans-serif', fontSize: 11, fontWeight: 800, letterSpacing: '0.05em', color: theme.accent, marginBottom: 10, textTransform: 'uppercase' }}>Category</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {CAT_FILTERS.map(f => {
                  const active = catFilter === f.value;
                  return (
                    <button key={f.value} onClick={() => setCatFilter(f.value)}
                      style={{
                        padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
                        fontFamily: '"Nunito", sans-serif', fontSize: 12, fontWeight: 700,
                        background: active ? theme.accentBg : 'transparent',
                        border: active ? `1px solid ${theme.accent}40` : '1px solid transparent',
                        color: active ? theme.accent : theme.textSecondary,
                        transition: 'all 0.15s', textAlign: 'left',
                      }}>
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: 14 }}>
              <p style={{ fontFamily: '"Nunito", sans-serif', fontSize: 11, fontWeight: 800, letterSpacing: '0.05em', color: theme.textTertiary, marginBottom: 10, textTransform: 'uppercase' }}>Legend</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Object.entries(BOND_TYPE_INFO).map(([key, info]) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: info.color, flexShrink: 0, marginTop: 3 }} />
                    <div>
                      <p style={{ fontFamily: '"Nunito", sans-serif', fontSize: 11, fontWeight: 700, color: theme.text }}>{info.label}</p>
                      <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, color: theme.textTertiary, lineHeight: 1.4 }}>{info.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Cards */}
        <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '12px 10px' : 20 }}>
          {/* Stats bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 12, marginBottom: isMobile ? 10 : 16, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 12, color: theme.textSecondary }}>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </span>
            {bondFilter !== 'all' && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 6, fontSize: 11, fontFamily: '"Nunito", sans-serif', fontWeight: 700, background: BOND_TYPE_INFO[bondFilter].color + '18', color: BOND_TYPE_INFO[bondFilter].color, border: `1px solid ${BOND_TYPE_INFO[bondFilter].color}30` }}>
                {BOND_TYPE_INFO[bondFilter].label}
                <button onClick={() => setBondFilter('all')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 14, padding: 0, marginLeft: 4 }}>×</button>
              </span>
            )}
            {catFilter !== 'all' && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 6, fontSize: 11, fontFamily: '"Nunito", sans-serif', fontWeight: 700, background: theme.statBg, color: theme.textSecondary, border: `1px solid ${theme.border}` }}>
                {catFilter.charAt(0).toUpperCase() + catFilter.slice(1)}
                <button onClick={() => setCatFilter('all')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 14, padding: 0, marginLeft: 4 }}>×</button>
              </span>
            )}
          </div>

          {/* Card grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 8 : 10 }}>
            {filtered.map(entry => (
              <BondingCard key={entry.id} entry={entry} theme={theme} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: isMobile ? '40px 16px' : '60px 20px' }}>
              <Zap size={isMobile ? 32 : 40} color={theme.textTertiary} style={{ marginBottom: 12 }} />
              <p style={{ fontFamily: '"Nunito", sans-serif', fontSize: 16, fontWeight: 800, color: theme.textTertiary }}>No matches found</p>
              <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: theme.textTertiary, marginTop: 6 }}>Try a different search or filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
