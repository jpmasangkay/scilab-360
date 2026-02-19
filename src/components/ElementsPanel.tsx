import { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { ELEMENTS, GRID_ELEMENTS } from '../data/elements';
import { CATEGORY_COLORS } from '../utils/colors';
import type { ElementData, ElementCategory } from '../types';

// ── Category legend ──────────────────────────────────────────────
const LEGEND_CATS: { value: ElementCategory; label: string }[] = [
  { value: 'alkali-metal',     label: 'Alkali Metal' },
  { value: 'alkaline-earth',   label: 'Alkaline Earth' },
  { value: 'transition-metal', label: 'Transition Metal' },
  { value: 'post-transition',  label: 'Post-Transition' },
  { value: 'metalloid',        label: 'Metalloid' },
  { value: 'nonmetal',         label: 'Nonmetal' },
  { value: 'halogen',          label: 'Halogen' },
  { value: 'noble-gas',        label: 'Noble Gas' },
  { value: 'lanthanide',       label: 'Lanthanide' },
  { value: 'actinide',         label: 'Actinide' },
  { value: 'unknown',          label: 'Unknown' },
];

// ── Inline tile (no popup — click selects in right panel) ────────
function PTile({
  el,
  selected,
  dimmed,
  onSelect,
}: {
  el: ElementData;
  selected: boolean;
  dimmed: boolean;
  onSelect: (el: ElementData) => void;
}) {
  const c = CATEGORY_COLORS[el.category];
  return (
    <div
      onClick={() => onSelect(el)}
      title={`${el.name} (${el.atomicNumber})`}
      style={{
        aspectRatio: '1',
        borderRadius: 4,
        cursor: dimmed ? 'not-allowed' : 'pointer',
        userSelect: 'none',
        transition: 'all 0.12s',
        background: selected ? c.border : c.bg,
        border: `1px solid ${selected ? c.border : c.border + '80'}`,
        color: selected ? '#fff' : c.text,
        opacity: dimmed ? 0.15 : 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
        position: 'relative',
        zIndex: selected ? 5 : 1,
        boxShadow: selected ? `0 0 10px ${c.glow}` : 'none',
        pointerEvents: dimmed ? 'none' : 'auto',
      }}
      onMouseEnter={e => {
          const d = e.currentTarget as HTMLDivElement;
          d.style.transform = 'scale(1.25)';
          d.style.zIndex = '20';
          d.style.boxShadow = `0 0 12px ${c.glow}`;
      }}
      onMouseLeave={e => {
        const d = e.currentTarget as HTMLDivElement;
        d.style.transform = 'scale(1)';
        d.style.zIndex = selected ? '5' : '1';
        d.style.boxShadow = selected ? `0 0 10px ${c.glow}` : 'none';
      }}
    >
      <span style={{ fontSize: 'clamp(7px, 0.6vw, 10px)', opacity: 0.9, lineHeight: 1, fontFamily: '"Share Tech Mono", monospace' }}>
        {el.atomicNumber}
      </span>
      <span style={{ fontFamily: 'Orbitron, monospace', fontWeight: 700, fontSize: 'clamp(11px, 1vw, 16px)', lineHeight: 1, marginTop: 1, textShadow: `0 0 6px ${c.glow}` }}>
        {el.symbol}
      </span>
      <span style={{ fontSize: 'clamp(7px, 0.55vw, 10px)', opacity: 0.9, lineHeight: 1, marginTop: 1, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: '"Share Tech Mono", monospace' }}>
        {el.name}
      </span>
    </div>
  );
}

// ── Element detail ───────────────────────────────────────────────
function ElementDetail({ el }: { el: ElementData }) {
  const c = CATEGORY_COLORS[el.category];
  const stats: [string, string | number][] = [
    ['Atomic Number',    el.atomicNumber],
    ['Period',           el.period],
    ['Group',            el.group ?? '—'],
    ['Valence e⁻',       el.valenceElectrons],
    ['Electronegativity',el.electronegativity ?? '—'],
    ['Metal',            el.isMetal ? 'Yes' : 'No'],
    ['Category',         el.category.replace(/-/g, ' ')],
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Big tile */}
      <div style={{
        borderRadius: 12,
        background: c.bg,
        border: `2px solid ${c.border}`,
        padding: '20px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: `0 0 30px ${c.glow}40`,
      }}>
        <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 11, color: c.text, opacity: 0.6 }}>
          {el.atomicNumber}
        </span>
        <span style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: 52, color: c.text, lineHeight: 1, textShadow: `0 0 20px ${c.glow}` }}>
          {el.symbol}
        </span>
        <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 14, color: c.text, marginTop: 6 }}>
          {el.name}
        </span>
        <span style={{
          fontFamily: '"Share Tech Mono", monospace', fontSize: 9,
          color: c.text, opacity: 0.7,
          background: c.bg,
          border: `1px solid ${c.border}`,
          borderRadius: 4,
          padding: '2px 8px',
          marginTop: 8,
          textTransform: 'capitalize',
          letterSpacing: '0.08em',
        }}>
          {el.category.replace(/-/g, ' ')}
        </span>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {stats.map(([label, value]) => (
          <div key={label} style={{ background: '#130929', border: '1px solid #2d1b5e', borderRadius: 8, padding: '8px 10px' }}>
            <p style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 8, color: '#6b21a8', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {label}
            </p>
            <p style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 13, color: '#e9d5ff', textTransform: 'capitalize' }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Valence electron dots */}
      <div style={{ background: '#130929', border: '1px solid #2d1b5e', borderRadius: 8, padding: '10px 12px' }}>
        <p style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 8, color: '#6b21a8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Valence Shell (max 8)
        </p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} style={{
              width: 16, height: 16, borderRadius: '50%',
              background: i < el.valenceElectrons ? c.border : 'transparent',
              border: `1px solid ${i < el.valenceElectrons ? c.border : '#2d1b5e'}`,
              boxShadow: i < el.valenceElectrons ? `0 0 6px ${c.glow}` : 'none',
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main panel ───────────────────────────────────────────────────
interface ElementsPanelProps { onClose: () => void; }

export function ElementsPanel({ onClose }: ElementsPanelProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ElementData>(ELEMENTS[0]);
  const [filterCat, setFilterCat] = useState<ElementCategory | 'all'>('all');

  const matchSet = useMemo(() => {
    const s = search.toLowerCase();
    return new Set(
      ELEMENTS
        .filter(el => {
          const matchSearch = !search ||
            el.name.toLowerCase().includes(s) ||
            el.symbol.toLowerCase().includes(s) ||
            String(el.atomicNumber) === search;
          const matchCat = filterCat === 'all' || el.category === filterCat;
          return matchSearch && matchCat;
        })
        .map(el => el.atomicNumber)
    );
  }, [search, filterCat]);

  const COLS = 'repeat(18, minmax(0, 1fr))';

  function renderRow(row: number) {
    return Array.from({ length: 18 }, (_, c) => {
      const el = GRID_ELEMENTS.find(g => g.row === row && g.col === c + 1);
      if (!el) return <div key={`${row}-${c}`} style={{ aspectRatio: '1' }} />;
      return (
        <PTile
          key={el.atomicNumber}
          el={el}
          selected={selected?.atomicNumber === el.atomicNumber}
          dimmed={!matchSet.has(el.atomicNumber)}
          onSelect={setSelected}
        />
      );
    });
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      display: 'flex', flexDirection: 'column',
      background: '#07011a',
      fontFamily: '"Share Tech Mono", monospace',
    }}>
      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.25rem 1.75rem',
        background: 'linear-gradient(90deg, #0d0120 0%, #1a0533 40%, #200040 100%)',
        borderBottom: '1px solid #4c1d95',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 30, filter: 'drop-shadow(0 0 10px #a855f7)' }}>⚛</span>
          <div>
            <p style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: 20, color: '#f3e8ff', letterSpacing: '4px', textShadow: '0 0 20px #a855f780' }}>
              ELEMENT LIBRARY
            </p>
            <p style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 11, color: '#c084fc', letterSpacing: '3px' }}>
              ALL 118 ELEMENTS
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Search */}
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, symbol or number…"
            style={{
              width: 220, padding: '7px 12px',
              background: '#0d0120', border: '1px solid #2d1b5e', borderRadius: 8,
              color: '#e9d5ff', fontFamily: '"Share Tech Mono", monospace', fontSize: 12,
              outline: 'none',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = '#7c3aed')}
            onBlur={e => (e.currentTarget.style.borderColor = '#2d1b5e')}
          />
          <button
            onClick={onClose}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36, borderRadius: 8,
              background: '#1e0b3e', border: '1px solid #4c1d95',
              color: '#c084fc', cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#3b0764'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#a855f7'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#1e0b3e'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#4c1d95'; }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ── Left: periodic table + legend ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px 20px', overflow: 'auto', gap: 10 }}>

          {/* Category filter pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, flexShrink: 0 }}>
            <button
              onClick={() => setFilterCat('all')}
              style={{ padding: '4px 11px', fontSize: 11, borderRadius: 6, cursor: 'pointer', background: filterCat === 'all' ? '#7c3aed' : '#1e0b3e', color: filterCat === 'all' ? '#fff' : '#a78bfa', border: filterCat === 'all' ? '1px solid #a855f7' : '1px solid #2d1b5e', transition: 'all 0.12s' }}
            >All</button>
            {LEGEND_CATS.map(cat => {
              const c = CATEGORY_COLORS[cat.value];
              const active = filterCat === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setFilterCat(active ? 'all' : cat.value)}
                  style={{
                    padding: '4px 11px', fontSize: 11, borderRadius: 6, cursor: 'pointer',
                    background: active ? c.border : c.bg,
                    color: active ? '#fff' : c.text,
                    border: `1px solid ${active ? c.border : c.border + '80'}`,
                    boxShadow: active ? `0 0 8px ${c.glow}60` : 'none',
                    transition: 'all 0.12s',
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* ── Main 18-col grid (rows 1–7) ── */}
          <div style={{ display: 'grid', gridTemplateColumns: COLS, gap: 3, flexShrink: 0 }}>
            {Array.from({ length: 7 }, (_, r) => renderRow(r + 1))}
          </div>

          {/* ── Gap row hint ── */}
          <div style={{ display: 'grid', gridTemplateColumns: COLS, gap: 3, flexShrink: 0 }}>
            <div style={{ gridColumn: '1 / 3' }} />
            <div style={{ gridColumn: '3 / 18', height: 6, borderRadius: 3, background: 'linear-gradient(90deg, #fb923c20, #f8717120)', border: '1px dashed #2d1b5e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 8, color: '#6b4dcc', fontFamily: '"Share Tech Mono", monospace', letterSpacing: '0.2em' }}>LANTHANIDES & ACTINIDES BELOW</span>
            </div>
          </div>

          {/* ── Lanthanides (row 9) ── */}
          <div style={{ display: 'grid', gridTemplateColumns: COLS, gap: 3, flexShrink: 0 }}>
            <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 4 }}>
              <span style={{ fontSize: 8, color: '#fb923c', fontFamily: '"Share Tech Mono", monospace' }}>57-71</span>
            </div>
            {Array.from({ length: 15 }, (_, i) => {
              const el = GRID_ELEMENTS.find(g => g.row === 9 && g.col === i + 3);
              return el ? (
                <PTile key={el.atomicNumber} el={el} selected={selected?.atomicNumber === el.atomicNumber} dimmed={!matchSet.has(el.atomicNumber)} onSelect={setSelected} />
              ) : <div key={i} style={{ aspectRatio: '1' }} />;
            })}
            <div style={{ aspectRatio: '1' }} />
          </div>

          {/* ── Actinides (row 10) ── */}
          <div style={{ display: 'grid', gridTemplateColumns: COLS, gap: 3, flexShrink: 0 }}>
            <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 4 }}>
              <span style={{ fontSize: 8, color: '#f87171', fontFamily: '"Share Tech Mono", monospace' }}>89-103</span>
            </div>
            {Array.from({ length: 15 }, (_, i) => {
              const el = GRID_ELEMENTS.find(g => g.row === 10 && g.col === i + 3);
              return el ? (
                <PTile key={el.atomicNumber} el={el} selected={selected?.atomicNumber === el.atomicNumber} dimmed={!matchSet.has(el.atomicNumber)} onSelect={setSelected} />
              ) : <div key={i} style={{ aspectRatio: '1' }} />;
            })}
            <div style={{ aspectRatio: '1' }} />
          </div>

          {/* ── Legend ── */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, flexShrink: 0, paddingTop: 4 }}>
            {LEGEND_CATS.map(cat => {
              const c = CATEGORY_COLORS[cat.value];
              return (
                <div key={cat.value} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: c.bg, border: `1px solid ${c.border}` }} />
                  <span style={{ fontSize: 10, color: '#a78bfa', fontFamily: '"Share Tech Mono", monospace' }}>{cat.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Right: detail panel ── */}
        <div style={{
          width: 260, flexShrink: 0,
          borderLeft: '1px solid #2d1b5e',
          background: '#0a0118',
          padding: 16,
          overflowY: 'auto',
        }}>
          {selected
            ? <ElementDetail el={selected} />
            : <p style={{ color: '#2d1b5e', fontSize: 12, textAlign: 'center', marginTop: 40 }}>Click any element</p>
          }
        </div>
      </div>
    </div>
  );
}
