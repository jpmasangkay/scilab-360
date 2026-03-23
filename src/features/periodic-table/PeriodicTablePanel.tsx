/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import type { ElementCategory } from '../../shared/types';
import { ELEMENTS, GRID_ELEMENTS, COMMON_ELEMENT_SYMBOLS } from '../../shared/data/elements';
import { ElementTile } from './ElementTile';
import { useTheme } from '../../shared/store/theme';

const FILTER_CATEGORIES = [
  'all', 'nonmetal', 'halogen', 'noble-gas',
  'alkali-metal', 'alkaline-earth', 'transition-metal', 'metalloid',
] as const;

type FilterCategory = (typeof FILTER_CATEGORIES)[number];

interface PeriodicTablePanelProps { onToast?: (msg: string) => void; isMobile?: boolean; isTablet?: boolean; }

export function PeriodicTablePanel({ onToast, isMobile, isTablet }: PeriodicTablePanelProps) {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCat, setFilterCat] = useState<FilterCategory>('all');
  const [showFull, setShowFull] = useState(false);

  const filtered = ELEMENTS.filter(el => {
    const matchSearch =
      !searchTerm ||
      el.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      el.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      el.atomicNumber.toString() === searchTerm;
    const matchCat = filterCat === 'all' || el.category === (filterCat as ElementCategory);
    return matchSearch && matchCat;
  });

  const commonEls = ELEMENTS.filter(el => COMMON_ELEMENT_SYMBOLS.includes(el.symbol));
  const showFiltered = Boolean(searchTerm) || filterCat !== 'all';
  const GRID_COLS = 'repeat(18, minmax(22px, 1fr))';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <input
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Search by name, symbol, or number..."
        style={{ width: '100%', padding: '9px 14px', borderRadius: 10, fontFamily: '"DM Sans", sans-serif', fontSize: 13, outline: 'none', background: theme.inputBg, border: `1px solid ${theme.inputBorder}`, color: theme.text, caretColor: theme.accent, boxSizing: 'border-box', transition: 'border-color 0.2s' }}
        onFocus={e => (e.currentTarget.style.borderColor = theme.accent)}
        onBlur={e => (e.currentTarget.style.borderColor = theme.inputBorder)}
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {FILTER_CATEGORIES.map(c => (
          <button key={c} onClick={() => setFilterCat(c)}
            style={{ padding: '4px 12px', fontSize: 12, borderRadius: 8, cursor: 'pointer', fontFamily: '"Playfair Display", serif', fontWeight: 700, whiteSpace: 'nowrap', transition: 'all 0.15s', background: filterCat === c ? theme.accent : theme.surfaceAlt, color: filterCat === c ? '#ffffff' : theme.textSecondary, border: filterCat === c ? `1px solid ${theme.accentDark}` : `1px solid ${theme.border}` }}>
            {c === 'all' ? 'All' : c.replace(/-/g, ' ')}
          </button>
        ))}
      </div>

      {!showFiltered && (
        <button onClick={() => setShowFull(v => !v)}
          style={{ padding: '7px 14px', borderRadius: 10, cursor: 'pointer', fontFamily: '"Playfair Display", serif', fontSize: 13, fontWeight: 700, textAlign: 'left', background: theme.surfaceAlt, border: `1px solid ${theme.border}`, color: theme.textSecondary, transition: 'all 0.15s' }}>
          {showFull ? 'Show Common Only' : 'Show All 118 Elements'}
        </button>
      )}

      {/* Element display area */}
      {showFiltered ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {filtered.map(el => <ElementTile key={el.atomicNumber} el={el} onToast={onToast} isMobile={isMobile} isTablet={isTablet} />)}
          {filtered.length === 0 && (
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: theme.textTertiary, padding: 8 }}>No elements match.</p>
          )}
        </div>
      ) : showFull ? (
        <div style={{ overflowX: 'auto', paddingBottom: 6 }}>
          <div style={{ overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch' as any }}>
            <div style={{ minWidth: 520 }}>
            <div style={{ display: 'grid', gridTemplateColumns: GRID_COLS, gap: 2 }}>
              {Array.from({ length: 10 }, (_, r) =>
                Array.from({ length: 18 }, (_, c) => {
                  const el = GRID_ELEMENTS.find(g => g.row === r + 1 && g.col === c + 1);
                  if (!el) return <div key={`${r}-${c}`} style={{ aspectRatio: '1' }} />;
                  return <ElementTile key={el.atomicNumber} el={el} tiny onToast={onToast} isMobile={isMobile} isTablet={isTablet} />;
                }),
              )}
            </div>
            {/* Lanthanides */}
            <div style={{ display: 'grid', gridTemplateColumns: GRID_COLS, gap: 2, marginTop: 6 }}>
              <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 4, fontSize: 8, fontFamily: '"Space Mono", monospace', color: '#f97316' }}>La-Lu</div>
              {Array.from({ length: 15 }, (_, i) => {
                const el = GRID_ELEMENTS.find(g => g.row === 9 && g.col === i + 3);
                return el ? <ElementTile key={el.atomicNumber} el={el} tiny onToast={onToast} isMobile={isMobile} isTablet={isTablet} /> : <div key={i} style={{ aspectRatio: '1' }} />;
              })}
              <div style={{ aspectRatio: '1' }} />
            </div>
            {/* Actinides */}
            <div style={{ display: 'grid', gridTemplateColumns: GRID_COLS, gap: 2, marginTop: 2 }}>
              <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 4, fontSize: 8, fontFamily: '"Space Mono", monospace', color: '#ef4444' }}>Ac-Lr</div>
              {Array.from({ length: 15 }, (_, i) => {
                const el = GRID_ELEMENTS.find(g => g.row === 10 && g.col === i + 3);
                return el ? <ElementTile key={el.atomicNumber} el={el} tiny onToast={onToast} isMobile={isMobile} isTablet={isTablet} /> : <div key={i} style={{ aspectRatio: '1' }} />;
              })}
              <div style={{ aspectRatio: '1' }} />
            </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(64px, 1fr))', gap: 8 }}>
          {commonEls.map(el => <ElementTile key={el.atomicNumber} el={el} onToast={onToast} isMobile={isMobile} isTablet={isTablet} />)}
        </div>
      )}
    </div>
  );
}
