import { useState, useMemo, useEffect, useRef } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { ELEMENTS, GRID_ELEMENTS } from '../../shared/data/elements';
import { getCategoryColors } from '../../shared/utils/colors';
import type { ElementData, ElementCategory } from '../../shared/types';
import { useApp } from '../../shared/store/context';
import { useTheme } from '../../shared/store/theme';

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
  const { theme } = useTheme();
  const CATEGORY_COLORS = getCategoryColors(theme.isDark);
  const c = CATEGORY_COLORS[el.category];
  const touchHandled = useRef(false);

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
        borderRadius: compact ? 4 : 6,
        cursor: dimmed ? 'not-allowed' : 'pointer',
        userSelect: 'none',
        transition: 'all 0.15s ease',
        touchAction: 'auto',
        background: selected ? c.border : c.bg,
        border: `1.5px solid ${selected ? c.border : c.border + '60'}`,
        color: selected ? '#ffffff' : c.text,
        opacity: dimmed ? 0.2 : 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: compact ? 1 : 3,
        position: 'relative',
        zIndex: selected ? 5 : 1,
        boxShadow: selected ? `0 2px 10px ${c.border}40` : 'none',
        pointerEvents: dimmed ? 'none' : 'auto',
      }}
      onMouseEnter={e => {
        const d = e.currentTarget as HTMLDivElement;
        d.style.transform = 'scale(1.2)';
        d.style.zIndex = '20';
        d.style.boxShadow = `0 4px 14px ${c.border}30`;
      }}
      onMouseLeave={e => {
        const d = e.currentTarget as HTMLDivElement;
        d.style.transform = 'scale(1)';
        d.style.zIndex = selected ? '5' : '1';
        d.style.boxShadow = selected ? `0 2px 10px ${c.border}40` : 'none';
      }}
    >
      <span style={{ fontSize: compact ? '5px' : 'clamp(7px, 0.6vw, 10px)', opacity: 0.7, lineHeight: 1, fontFamily: '"Space Mono", monospace' }}>
        {el.atomicNumber}
      </span>
      <span style={{ fontFamily: '"Playfair Display", serif', fontWeight: 800, fontSize: compact ? '8px' : 'clamp(11px, 1vw, 16px)', lineHeight: 1, marginTop: 1 }}>
        {el.symbol}
      </span>
      {!compact && (
        <span style={{ fontSize: 'clamp(7px, 0.55vw, 10px)', opacity: 0.7, lineHeight: 1, marginTop: 1, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: '"DM Sans", sans-serif' }}>
          {el.name}
        </span>
      )}
    </div>
  );
}

// ── Element detail ───────────────────────────────────────────────
function ElementDetail({ el, isMobile, onAddToLab }: { el: ElementData; isMobile?: boolean; onAddToLab?: () => void; }) {
  const { theme } = useTheme();
  const CATEGORY_COLORS = getCategoryColors(theme.isDark);
  const c = CATEGORY_COLORS[el.category];
  const stats: [string, string | number][] = [
    ['Atomic Number',     el.atomicNumber],
    ['Period',            el.period],
    ['Group',             el.group ?? '--'],
    ['Valence e-',        el.valenceElectrons],
    ['Electronegativity', el.electronegativity ?? '--'],
    ['Metal',             el.isMetal ? 'Yes' : 'No'],
    ['Category',          el.category.replace(/-/g, ' ')],
  ];
  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: isMobile ? 12 : 14, alignItems: isMobile ? 'flex-start' : 'stretch' }}>
      {/* Symbol tile */}
      <div style={{
        borderRadius: 14, background: c.bg, border: `2px solid ${c.border}`,
        padding: isMobile ? '12px 14px' : '20px 16px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        boxShadow: `0 4px 20px ${c.border}20`, flexShrink: 0,
        minWidth: isMobile ? 88 : 'auto',
      }}>
        <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 11, color: c.text, opacity: 0.6 }}>{el.atomicNumber}</span>
        <span style={{ fontFamily: '"Playfair Display", serif', fontWeight: 900, fontSize: isMobile ? 34 : 52, color: c.text, lineHeight: 1 }}>{el.symbol}</span>
        <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: isMobile ? 11 : 14, color: c.text, marginTop: 6, textAlign: 'center', fontWeight: 600 }}>{el.name}</span>
        <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 9, color: c.text, opacity: 0.7, background: theme.surface, border: `1px solid ${c.border}60`, borderRadius: 6, padding: '3px 10px', marginTop: 8, textTransform: 'capitalize', letterSpacing: '0.05em', textAlign: 'center' }}>
          {el.category.replace(/-/g, ' ')}
        </span>
      </div>

      {/* Stats grid */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(4, 1fr)' : '1fr 1fr', gap: isMobile ? 5 : 8, marginBottom: 8 }}>
          {stats.map(([label, value]) => (
            <div key={label} style={{ background: theme.surfaceAlt, border: `1px solid ${theme.border}`, borderRadius: 10, padding: isMobile ? '5px 7px' : '8px 10px' }}>
              <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 8, color: theme.textTertiary, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
              <p style={{ fontFamily: '"Playfair Display", serif', fontSize: isMobile ? 11 : 13, color: theme.text, fontWeight: 700, textTransform: 'capitalize' }}>{value}</p>
            </div>
          ))}
        </div>

        {onAddToLab && (
          <button
            onClick={onAddToLab}
            style={{
              width: '100%', marginTop: 8, padding: '10px', borderRadius: 10, cursor: 'pointer',
              fontFamily: '"Playfair Display", serif', fontSize: 13, fontWeight: 800,
              letterSpacing: '0.05em', background: theme.accent, border: `1px solid ${theme.accentDark}`,
              color: '#ffffff', boxShadow: `0 2px 10px ${theme.accent}30`,
              transition: 'all 0.15s',
            }}
          >
            ADD TO LAB
          </button>
        )}

        {!isMobile && (
          <div style={{ background: theme.surfaceAlt, border: `1px solid ${theme.border}`, borderRadius: 10, padding: '10px 12px', marginTop: 8 }}>
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 9, color: theme.textTertiary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Valence Shell (max 8)</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} style={{
                  width: 18, height: 18, borderRadius: '50%',
                  background: i < el.valenceElectrons ? c.border : 'transparent',
                  border: `2px solid ${i < el.valenceElectrons ? c.border : theme.border}`,
                  boxShadow: i < el.valenceElectrons ? `0 1px 6px ${c.border}40` : 'none',
                  transition: 'all 0.2s',
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
  const { theme } = useTheme();
  const CATEGORY_COLORS = getCategoryColors(theme.isDark);
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
    onToast?.(`${el.symbol} -- ${el.name} added to lab`);
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
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', flexDirection: 'column', background: theme.bg, fontFamily: '"DM Sans", sans-serif' }}>

      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '10px 12px' : '14px 24px',
        background: theme.surface,
        borderBottom: `1px solid ${theme.border}`,
        flexShrink: 0, gap: 10,
        boxShadow: theme.shadow,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: theme.accentBg, border: `1px solid ${theme.accent}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.accentDark} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /><ellipse cx="12" cy="12" rx="10" ry="4" /></svg>
          </div>
          <div>
            <p style={{ fontFamily: '"Playfair Display", serif', fontWeight: 800, fontSize: isMobile ? 14 : 20, color: theme.logoText, letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
              Element Library
            </p>
            {!isMobile && <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: theme.textTertiary, letterSpacing: '0.02em' }}>All 118 Elements</p>}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: isMobile ? 1 : 'none' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={isMobile ? 'Search...' : 'Search name, symbol or number...'}
            style={{
              width: isMobile ? '100%' : 240, minWidth: 0,
              padding: '8px 14px', background: theme.inputBg, border: `1px solid ${theme.inputBorder}`,
              borderRadius: 10, color: theme.text, fontFamily: '"DM Sans", sans-serif',
              fontSize: 13, outline: 'none', transition: 'border-color 0.2s',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = theme.accent)}
            onBlur={e => (e.currentTarget.style.borderColor = theme.inputBorder)}
          />
          <button
            onClick={onClose}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: theme.surfaceAlt, border: `1px solid ${theme.border}`, color: theme.textSecondary, cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = theme.dangerBg; (e.currentTarget as HTMLButtonElement).style.borderColor = theme.dangerBorder; (e.currentTarget as HTMLButtonElement).style.color = theme.dangerText; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = theme.surfaceAlt; (e.currentTarget as HTMLButtonElement).style.borderColor = theme.border; (e.currentTarget as HTMLButtonElement).style.color = theme.textSecondary; }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden', position: 'relative' }}>

        {/* ── Left / main: table ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: isMobile ? '8px 8px' : '16px 20px', overflow: 'auto', gap: isMobile ? 6 : 10, minWidth: 0 }}>

          {/* Filter pills */}
          <div style={{ display: 'flex', flexWrap: isMobile ? 'nowrap' : 'wrap', gap: 5, flexShrink: 0, overflowX: 'auto', paddingBottom: isMobile ? 3 : 0 }}>
            <button
              onClick={() => setFilterCat('all')}
              style={{ padding: '5px 12px', fontSize: isMobile ? 10 : 11, borderRadius: 8, cursor: 'pointer', fontFamily: '"Playfair Display", serif', fontWeight: 700, background: filterCat === 'all' ? theme.accent : theme.surface, color: filterCat === 'all' ? '#ffffff' : theme.textSecondary, border: filterCat === 'all' ? `1px solid ${theme.accentDark}` : `1px solid ${theme.border}`, transition: 'all 0.12s', whiteSpace: 'nowrap', flexShrink: 0 }}
            >All</button>
            {LEGEND_CATS.map(cat => {
              const c = CATEGORY_COLORS[cat.value];
              const active = filterCat === cat.value;
              return (
                <button key={cat.value} onClick={() => setFilterCat(active ? 'all' : cat.value)}
                  style={{ padding: '5px 12px', fontSize: isMobile ? 10 : 11, borderRadius: 8, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, fontFamily: '"Playfair Display", serif', fontWeight: 700, background: active ? c.border : c.bg, color: active ? '#ffffff' : c.text, border: `1px solid ${active ? c.border : c.border + '40'}`, boxShadow: active ? `0 2px 8px ${c.border}30` : 'none', transition: 'all 0.12s' }}
                >{cat.label}</button>
              );
            })}
          </div>

          {/* ── Table ── */}
          <div style={{ flex: 1, overflowX: 'auto', overflowY: 'visible' }}>
            <div style={{ minWidth: isMobile ? 480 : 'auto', display: 'flex', flexDirection: 'column', gap: isMobile ? 2 : 3 }}>

              {/* Rows 1-7 */}
              <div style={{ display: 'grid', gridTemplateColumns: COLS, gap: isMobile ? 2 : 3 }}>
                {Array.from({ length: 7 }, (_, r) => renderRow(r + 1))}
              </div>

              {/* Gap hint */}
              <div style={{ display: 'grid', gridTemplateColumns: COLS, gap: isMobile ? 2 : 3 }}>
                <div style={{ gridColumn: '1 / 3' }} />
                <div style={{ gridColumn: '3 / 18', height: isMobile ? 4 : 8, borderRadius: 4, background: theme.borderLight, border: `1px dashed ${theme.sandboxBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {!isMobile && <span style={{ fontSize: 8, color: theme.textTertiary, fontFamily: '"DM Sans", sans-serif', letterSpacing: '0.1em', fontWeight: 500 }}>LANTHANIDES & ACTINIDES</span>}
                </div>
              </div>

              {/* Lanthanides */}
              <div style={{ display: 'grid', gridTemplateColumns: COLS, gap: isMobile ? 2 : 3 }}>
                <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 3 }}>
                  <span style={{ fontSize: isMobile ? 6 : 9, color: '#f97316', fontFamily: '"Space Mono", monospace', fontWeight: 700 }}>57-71</span>
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
                  <span style={{ fontSize: isMobile ? 6 : 9, color: '#ef4444', fontFamily: '"Space Mono", monospace', fontWeight: 700 }}>89-103</span>
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
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: c.bg, border: `1.5px solid ${c.border}`, flexShrink: 0 }} />
                  <span style={{ fontSize: isMobile ? 9 : 10, color: theme.textSecondary, fontFamily: '"DM Sans", sans-serif', fontWeight: 500 }}>{cat.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Desktop / tablet right panel ── */}
        {!isMobile && (
          <div style={{ width: isTablet ? 220 : 270, flexShrink: 0, borderLeft: `1px solid ${theme.border}`, background: theme.surface, padding: 16, overflowY: 'auto' }}>
            {selected
              ? <ElementDetail el={selected} onAddToLab={isTablet ? () => addToLab(selected) : undefined} />
              : <p style={{ color: theme.textTertiary, fontSize: 13, textAlign: 'center', marginTop: 40, fontFamily: '"DM Sans", sans-serif' }}>{isTablet ? 'Tap any element' : 'Click any element'}</p>
            }
          </div>
        )}

        {/* ── Mobile bottom sheet ── */}
        {isMobile && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: theme.surface,
            borderTop: `2px solid ${activeCatColor ? activeCatColor.border : theme.border}`,
            borderRadius: '16px 16px 0 0',
            transform: detailOpen ? 'translateY(0)' : 'translateY(calc(100% - 50px))',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 100,
            boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
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
                <div style={{ width: 32, height: 3, borderRadius: 99, background: theme.sandboxBorder }} />
                {selected && (
                  <span style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: 13, color: activeCatColor?.text ?? theme.text }}>
                    {selected.symbol} &mdash; {selected.name}
                  </span>
                )}
              </div>
              <ChevronDown size={16} color={theme.textTertiary} style={{ transform: detailOpen ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.3s', flexShrink: 0 }} />
            </div>

            {/* Scrollable detail */}
            <div style={{ overflowY: 'auto', padding: '0 14px 24px', flex: 1 }}>
              {selected
                ? <ElementDetail el={selected} isMobile onAddToLab={() => addToLab(selected)} />
                : <p style={{ color: theme.textTertiary, fontSize: 12, textAlign: 'center', padding: 16 }}>Tap any element</p>
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
