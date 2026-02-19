import { useState, useMemo, useEffect, useRef } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { ELEMENTS, GRID_ELEMENTS } from '../data/elements';
import { CATEGORY_COLORS } from '../utils/colors';
import type { ElementData, ElementCategory } from '../types';
import { useApp } from '../store/context';

// ── Responsive hook ──────────────────────────────────────────────
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
}

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

// ── Inline tile ──────────────────────────────────────────────────
function PTile({
  el, selected, dimmed, onSelect, onAddToLab, compact,
}: {
  el: ElementData;
  selected: boolean;
  dimmed: boolean;
  onSelect: (el: ElementData) => void;
  onAddToLab?: (el: ElementData) => void;
  compact?: boolean;
}) {
  const c = CATEGORY_COLORS[el.category];
  const touchHandled = useRef(false);

  // Tablet tap: add to lab immediately; long-press: show info
  const handleTouchStart = onAddToLab ? (e: React.TouchEvent<HTMLDivElement>) => {
    if (dimmed) return;
    touchHandled.current = true;
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    let moved = false;

    const timer = setTimeout(() => {
      if (!moved) onSelect(el);
    }, 600);

    const onMove = (ev: globalThis.TouchEvent) => {
      const t = ev.touches[0];
      if (Math.hypot(t.clientX - startX, t.clientY - startY) > 8) {
        moved = true;
        clearTimeout(timer);
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('touchend', onEnd);
      }
    };
    const onEnd = () => {
      clearTimeout(timer);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
      if (!moved) {
        onSelect(el);
        onAddToLab(el);
      }
    };
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
  } : undefined;

  // Suppress click when touch already handled it
  const handleClick = () => {
    if (touchHandled.current) { touchHandled.current = false; return; }
    if (!dimmed) onSelect(el);
  };

  return (
    <div
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      title={`${el.name} (${el.atomicNumber})`}
      style={{
        aspectRatio: '1',
        borderRadius: compact ? 3 : 4,
        cursor: dimmed ? 'not-allowed' : 'pointer',
        userSelect: 'none',
        transition: 'all 0.12s',
        touchAction: 'auto',
        background: selected ? c.border : c.bg,
        border: `1px solid ${selected ? c.border : c.border + '80'}`,
        color: selected ? '#fff' : c.text,
        opacity: dimmed ? 0.15 : 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: compact ? 1 : 3,
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
      <span style={{ fontSize: compact ? '5px' : 'clamp(7px, 0.6vw, 10px)', opacity: 0.9, lineHeight: 1, fontFamily: '"Share Tech Mono", monospace' }}>
        {el.atomicNumber}
      </span>
      <span style={{ fontFamily: 'Orbitron, monospace', fontWeight: 700, fontSize: compact ? '8px' : 'clamp(11px, 1vw, 16px)', lineHeight: 1, marginTop: 1, textShadow: `0 0 6px ${c.glow}` }}>
        {el.symbol}
      </span>
      {!compact && (
        <span style={{ fontSize: 'clamp(7px, 0.55vw, 10px)', opacity: 0.9, lineHeight: 1, marginTop: 1, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: '"Share Tech Mono", monospace' }}>
          {el.name}
        </span>
      )}
    </div>
  );
}

// ── Element detail ───────────────────────────────────────────────
function ElementDetail({ el, isMobile, onAddToLab }: { el: ElementData; isMobile?: boolean; onAddToLab?: () => void; }) {
  const c = CATEGORY_COLORS[el.category];
  const stats: [string, string | number][] = [
    ['Atomic Number',     el.atomicNumber],
    ['Period',            el.period],
    ['Group',             el.group ?? '—'],
    ['Valence e⁻',        el.valenceElectrons],
    ['Electronegativity', el.electronegativity ?? '—'],
    ['Metal',             el.isMetal ? 'Yes' : 'No'],
    ['Category',          el.category.replace(/-/g, ' ')],
  ];
  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: isMobile ? 12 : 14, alignItems: isMobile ? 'flex-start' : 'stretch' }}>
      {/* Symbol tile */}
      <div style={{
        borderRadius: 12, background: c.bg, border: `2px solid ${c.border}`,
        padding: isMobile ? '12px 14px' : '20px 16px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        boxShadow: `0 0 30px ${c.glow}40`, flexShrink: 0,
        minWidth: isMobile ? 88 : 'auto',
      }}>
        <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 11, color: c.text, opacity: 0.6 }}>{el.atomicNumber}</span>
        <span style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: isMobile ? 34 : 52, color: c.text, lineHeight: 1, textShadow: `0 0 20px ${c.glow}` }}>{el.symbol}</span>
        <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: isMobile ? 11 : 14, color: c.text, marginTop: 6, textAlign: 'center' }}>{el.name}</span>
        <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 9, color: c.text, opacity: 0.7, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 4, padding: '2px 8px', marginTop: 8, textTransform: 'capitalize', letterSpacing: '0.08em', textAlign: 'center' }}>
          {el.category.replace(/-/g, ' ')}
        </span>
      </div>

      {/* Stats grid */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(4, 1fr)' : '1fr 1fr', gap: isMobile ? 5 : 8, marginBottom: 8 }}>
          {stats.map(([label, value]) => (
            <div key={label} style={{ background: '#130929', border: '1px solid #2d1b5e', borderRadius: 8, padding: isMobile ? '5px 7px' : '8px 10px' }}>
              <p style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 8, color: '#6b21a8', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</p>
              <p style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: isMobile ? 11 : 13, color: '#e9d5ff', textTransform: 'capitalize' }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Add to Lab button — shown on mobile and tablet (whenever onAddToLab is provided) */}
        {onAddToLab && (
          <button
            onClick={onAddToLab}
            style={{
              width: '100%', marginTop: 8, padding: '10px', borderRadius: 8, cursor: 'pointer',
              fontFamily: '"Share Tech Mono", monospace', fontSize: 12, fontWeight: 700,
              letterSpacing: '0.1em', background: '#6d28d9', border: '1px solid #a855f7',
              color: '#fff', boxShadow: '0 0 14px #a855f750',
            }}
          >
            ⚗ ADD TO LAB
          </button>
        )}

        {/* Valence shell — desktop only */}
        {!isMobile && (
          <div style={{ background: '#130929', border: '1px solid #2d1b5e', borderRadius: 8, padding: '10px 12px' }}>
            <p style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 8, color: '#6b21a8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Valence Shell (max 8)</p>
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
        )}
      </div>
    </div>
  );
}

// ── Main panel ───────────────────────────────────────────────────
interface ElementsPanelProps { onClose: () => void; onToast?: (msg: string) => void; }

export function ElementsPanel({ onClose, onToast }: ElementsPanelProps) {
  const { state, dispatch } = useApp();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ElementData>(ELEMENTS[0]);
  const [filterCat, setFilterCat] = useState<ElementCategory | 'all'>('all');
  const [detailOpen, setDetailOpen] = useState(false);

  const width = useWindowWidth();
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  const tileCompact = isMobile || isTablet;

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

  function handleSelect(el: ElementData) {
    setSelected(el);
    if (isMobile) setDetailOpen(true);
  }

  function addToLab(el: ElementData) {
    const sandbox = document.getElementById('sandbox-area');
    const rect = sandbox?.getBoundingClientRect();
    const W = rect?.width ?? 320;
    const H = rect?.height ?? 300;
    const count = state.placedAtoms.length;
    const cols = Math.max(1, Math.floor(W / 90));
    const col = count % cols;
    const row = Math.floor(count / cols);
    const x = Math.min(60 + col * 90 + (row % 2) * 20, W - 50);
    const y = Math.min(60 + row * 90, H - 50);
    dispatch({ type: 'DROP_ATOM', payload: { element: el, x, y } });
    onToast?.(`${el.symbol} — ${el.name} added to lab ⚗`);
  }

  const COLS = 'repeat(18, minmax(0, 1fr))';

  function renderRow(row: number) {
    return Array.from({ length: 18 }, (_, c) => {
      const el = GRID_ELEMENTS.find(g => g.row === row && g.col === c + 1);
      if (!el) return <div key={`${row}-${c}`} style={{ aspectRatio: '1' }} />;
      return (
        <PTile key={el.atomicNumber} el={el}
          selected={selected?.atomicNumber === el.atomicNumber}
          dimmed={!matchSet.has(el.atomicNumber)}
          onSelect={handleSelect}
          onAddToLab={isTablet ? addToLab : undefined}
          compact={tileCompact}
        />
      );
    });
  }

  const activeCatColor = selected ? CATEGORY_COLORS[selected.category] : null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', flexDirection: 'column', background: '#07011a', fontFamily: '"Share Tech Mono", monospace' }}>

      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '10px 12px' : '1.25rem 1.75rem',
        background: 'linear-gradient(90deg, #0d0120 0%, #1a0533 40%, #200040 100%)',
        borderBottom: '1px solid #4c1d95',
        flexShrink: 0, gap: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 12 }}>
          <span style={{ fontSize: isMobile ? 20 : 30, filter: 'drop-shadow(0 0 10px #a855f7)', flexShrink: 0 }}>⚛</span>
          <div>
            <p style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: isMobile ? 12 : 20, color: '#f3e8ff', letterSpacing: isMobile ? '1px' : '4px', textShadow: '0 0 20px #a855f780', whiteSpace: 'nowrap' }}>
              ELEMENT LIBRARY
            </p>
            {!isMobile && <p style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 11, color: '#c084fc', letterSpacing: '3px' }}>ALL 118 ELEMENTS</p>}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: isMobile ? 1 : 'none' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={isMobile ? 'Search…' : 'Search name, symbol or number…'}
            style={{
              width: isMobile ? '100%' : 220, minWidth: 0,
              padding: '7px 12px', background: '#0d0120', border: '1px solid #2d1b5e',
              borderRadius: 8, color: '#e9d5ff', fontFamily: '"Share Tech Mono", monospace',
              fontSize: 12, outline: 'none',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = '#7c3aed')}
            onBlur={e => (e.currentTarget.style.borderColor = '#2d1b5e')}
          />
          <button
            onClick={onClose}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 8, flexShrink: 0, background: '#1e0b3e', border: '1px solid #4c1d95', color: '#c084fc', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#3b0764'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#a855f7'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#1e0b3e'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#4c1d95'; }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden', position: 'relative' }}>

        {/* ── Left / main: table ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: isMobile ? '8px 8px' : '16px 20px', overflow: 'auto', gap: isMobile ? 6 : 10, minWidth: 0 }}>

          {/* Filter pills — horizontally scrollable on mobile */}
          <div style={{ display: 'flex', flexWrap: isMobile ? 'nowrap' : 'wrap', gap: 5, flexShrink: 0, overflowX: 'auto', paddingBottom: isMobile ? 3 : 0 }}>
            <button
              onClick={() => setFilterCat('all')}
              style={{ padding: '5px 10px', fontSize: isMobile ? 10 : 11, borderRadius: 6, cursor: 'pointer', background: filterCat === 'all' ? '#7c3aed' : '#1e0b3e', color: filterCat === 'all' ? '#fff' : '#a78bfa', border: filterCat === 'all' ? '1px solid #a855f7' : '1px solid #2d1b5e', transition: 'all 0.12s', whiteSpace: 'nowrap', flexShrink: 0 }}
            >All</button>
            {LEGEND_CATS.map(cat => {
              const c = CATEGORY_COLORS[cat.value];
              const active = filterCat === cat.value;
              return (
                <button key={cat.value} onClick={() => setFilterCat(active ? 'all' : cat.value)}
                  style={{ padding: '5px 10px', fontSize: isMobile ? 10 : 11, borderRadius: 6, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, background: active ? c.border : c.bg, color: active ? '#fff' : c.text, border: `1px solid ${active ? c.border : c.border + '80'}`, boxShadow: active ? `0 0 8px ${c.glow}60` : 'none', transition: 'all 0.12s' }}
                >{cat.label}</button>
              );
            })}
          </div>

          {/* ── Table — horizontal scroll so it never crushes on mobile ── */}
          <div style={{ flex: 1, overflowX: 'auto', overflowY: 'visible' }}>
            <div style={{ minWidth: isMobile ? 480 : 'auto', display: 'flex', flexDirection: 'column', gap: isMobile ? 2 : 3 }}>

              {/* Rows 1–7 */}
              <div style={{ display: 'grid', gridTemplateColumns: COLS, gap: isMobile ? 2 : 3 }}>
                {Array.from({ length: 7 }, (_, r) => renderRow(r + 1))}
              </div>

              {/* Gap hint */}
              <div style={{ display: 'grid', gridTemplateColumns: COLS, gap: isMobile ? 2 : 3 }}>
                <div style={{ gridColumn: '1 / 3' }} />
                <div style={{ gridColumn: '3 / 18', height: isMobile ? 4 : 6, borderRadius: 3, background: 'linear-gradient(90deg, #fb923c20, #f8717120)', border: '1px dashed #2d1b5e40', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {!isMobile && <span style={{ fontSize: 7, color: '#6b4dcc', fontFamily: '"Share Tech Mono", monospace', letterSpacing: '0.15em' }}>LANTHANIDES & ACTINIDES BELOW</span>}
                </div>
              </div>

              {/* Lanthanides */}
              <div style={{ display: 'grid', gridTemplateColumns: COLS, gap: isMobile ? 2 : 3 }}>
                <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 3 }}>
                  <span style={{ fontSize: isMobile ? 6 : 8, color: '#fb923c', fontFamily: '"Share Tech Mono", monospace' }}>57–71</span>
                </div>
                {Array.from({ length: 15 }, (_, i) => {
                  const el = GRID_ELEMENTS.find(g => g.row === 9 && g.col === i + 3);
                  return el
                    ? <PTile key={el.atomicNumber} el={el} selected={selected?.atomicNumber === el.atomicNumber} dimmed={!matchSet.has(el.atomicNumber)} onSelect={handleSelect} onAddToLab={isTablet ? addToLab : undefined} compact={tileCompact} />
                    : <div key={i} style={{ aspectRatio: '1' }} />;
                })}
                <div style={{ aspectRatio: '1' }} />
              </div>

              {/* Actinides */}
              <div style={{ display: 'grid', gridTemplateColumns: COLS, gap: isMobile ? 2 : 3 }}>
                <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 3 }}>
                  <span style={{ fontSize: isMobile ? 6 : 8, color: '#f87171', fontFamily: '"Share Tech Mono", monospace' }}>89–103</span>
                </div>
                {Array.from({ length: 15 }, (_, i) => {
                  const el = GRID_ELEMENTS.find(g => g.row === 10 && g.col === i + 3);
                  return el
                    ? <PTile key={el.atomicNumber} el={el} selected={selected?.atomicNumber === el.atomicNumber} dimmed={!matchSet.has(el.atomicNumber)} onSelect={handleSelect} onAddToLab={isTablet ? addToLab : undefined} compact={tileCompact} />
                    : <div key={i} style={{ aspectRatio: '1' }} />;
                })}
                <div style={{ aspectRatio: '1' }} />
              </div>

            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? 5 : 8, flexShrink: 0, paddingTop: 2, paddingBottom: isMobile ? 60 : 0 }}>
            {LEGEND_CATS.map(cat => {
              const c = CATEGORY_COLORS[cat.value];
              return (
                <div key={cat.value} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: c.bg, border: `1px solid ${c.border}`, flexShrink: 0 }} />
                  <span style={{ fontSize: isMobile ? 9 : 10, color: '#a78bfa', fontFamily: '"Share Tech Mono", monospace' }}>{cat.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Desktop / tablet right panel ── */}
        {!isMobile && (
          <div style={{ width: isTablet ? 220 : 260, flexShrink: 0, borderLeft: '1px solid #2d1b5e', background: '#0a0118', padding: 16, overflowY: 'auto' }}>
            {selected
              ? <ElementDetail el={selected} onAddToLab={isTablet ? () => addToLab(selected) : undefined} />
              : <p style={{ color: '#2d1b5e', fontSize: 12, textAlign: 'center', marginTop: 40 }}>{isTablet ? 'Tap any element' : 'Click any element'}</p>
            }
          </div>
        )}

        {/* ── Mobile bottom sheet ── */}
        {isMobile && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: '#0a0118',
            borderTop: `2px solid ${activeCatColor ? activeCatColor.border : '#2d1b5e'}`,
            borderRadius: '14px 14px 0 0',
            transform: detailOpen ? 'translateY(0)' : 'translateY(calc(100% - 50px))',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 100,
            boxShadow: `0 -8px 40px ${activeCatColor ? activeCatColor.glow + '50' : '#00000060'}`,
            maxHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Drag handle + summary row */}
            <div
              onClick={() => setDetailOpen(v => !v)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', cursor: 'pointer', flexShrink: 0, gap: 10 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* pill */}
                <div style={{ width: 32, height: 3, borderRadius: 99, background: '#4c1d95' }} />
                {selected && (
                  <span style={{ fontFamily: 'Orbitron, monospace', fontWeight: 700, fontSize: 13, color: activeCatColor?.text ?? '#e9d5ff' }}>
                    {selected.symbol} &mdash; {selected.name}
                  </span>
                )}
              </div>
              <ChevronDown size={16} color="#a78bfa" style={{ transform: detailOpen ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.3s', flexShrink: 0 }} />
            </div>

            {/* Scrollable detail */}
            <div style={{ overflowY: 'auto', padding: '0 14px 24px', flex: 1 }}>
              {selected
                ? <ElementDetail el={selected} isMobile onAddToLab={() => addToLab(selected)} />
                : <p style={{ color: '#4c1d95', fontSize: 12, textAlign: 'center', padding: 16 }}>Tap any element</p>
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
