import { useState } from 'react';
import type { ElementCategory } from '../types';
import { ELEMENTS, GRID_ELEMENTS, COMMON_ELEMENT_SYMBOLS } from '../data/elements';
import { ElementTile } from './ElementTile';

const FILTER_CATEGORIES = [
  'all', 'nonmetal', 'halogen', 'noble-gas',
  'alkali-metal', 'alkaline-earth', 'transition-metal', 'metalloid',
] as const;

type FilterCategory = (typeof FILTER_CATEGORIES)[number];

export function PeriodicTablePanel() {
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Search */}
      <input
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Search by name, symbol, or number..."
        style={{ width: '100%', padding: '8px 12px', borderRadius: 8, fontFamily: '"Share Tech Mono", monospace', fontSize: 12, outline: 'none', background: '#07011a', border: '1px solid #3b1d6e', color: '#e9d5ff', caretColor: '#a855f7', boxSizing: 'border-box' }}
      />

      {/* Category filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {FILTER_CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setFilterCat(c)}
            style={{ padding: '4px 10px', fontSize: 11, borderRadius: 8, cursor: 'pointer', fontFamily: '"Share Tech Mono", monospace', whiteSpace: 'nowrap', transition: 'all 0.15s', background: filterCat === c ? '#6d28d9' : '#1e0b3e', color: filterCat === c ? '#fff' : '#c4b5fd', border: filterCat === c ? '1px solid #a855f7' : '1px solid #3b1d6e', boxShadow: filterCat === c ? '0 0 8px #a855f750' : 'none' }}
          >
            {c === 'all' ? 'All' : c.replace(/-/g, ' ')}
          </button>
        ))}
      </div>

      {/* Toggle */}
      {!showFiltered && (
        <button
          onClick={() => setShowFull(v => !v)}
          style={{ padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontFamily: '"Share Tech Mono", monospace', fontSize: 12, textAlign: 'left', background: '#1e0b3e', border: '1px solid #3b1d6e', color: '#c4b5fd' }}
        >
          {showFull ? '▴ Show Common Only' : '▾ Show All 118 Elements'}
        </button>
      )}

      {/* Elements */}
      <div>
        {showFiltered ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {filtered.map(el => <ElementTile key={el.atomicNumber} el={el} />)}
            {filtered.length === 0 && (
              <p style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 13, color: '#c4b5fd', padding: 8 }}>No elements match.</p>
            )}
          </div>
        ) : showFull ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(18, 1fr)', gap: 2 }}>
              {Array.from({ length: 10 }, (_, r) =>
                Array.from({ length: 18 }, (_, c) => {
                  const el = GRID_ELEMENTS.find(g => g.row === r + 1 && g.col === c + 1);
                  if (!el) return <div key={`${r}-${c}`} style={{ aspectRatio: '1' }} />;
                  return <ElementTile key={el.atomicNumber} el={el} tiny />;
                }),
              )}
            </div>
            <div style={{ marginTop: 6, display: 'grid', gridTemplateColumns: 'repeat(18, 1fr)', gap: 2 }}>
              <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 4, fontSize: 7, fontFamily: '"Share Tech Mono", monospace', color: '#fb923c' }}>La-Lu</div>
              {Array.from({ length: 15 }, (_, i) => {
                const el = GRID_ELEMENTS.find(g => g.row === 9 && g.col === i + 3);
                return el ? <ElementTile key={el.atomicNumber} el={el} tiny /> : <div key={i} style={{ aspectRatio: '1' }} />;
              })}
            </div>
            <div style={{ marginTop: 2, display: 'grid', gridTemplateColumns: 'repeat(18, 1fr)', gap: 2 }}>
              <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 4, fontSize: 7, fontFamily: '"Share Tech Mono", monospace', color: '#f97316' }}>Ac-Lr</div>
              {Array.from({ length: 15 }, (_, i) => {
                const el = GRID_ELEMENTS.find(g => g.row === 10 && g.col === i + 3);
                return el ? <ElementTile key={el.atomicNumber} el={el} tiny /> : <div key={i} style={{ aspectRatio: '1' }} />;
              })}
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(64px, 1fr))', gap: 8 }}>
            {commonEls.map(el => <ElementTile key={el.atomicNumber} el={el} />)}
          </div>
        )}
      </div>
    </div>
  );
}
