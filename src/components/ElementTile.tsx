import { useState } from 'react';
import type { DragEvent } from 'react';
import type { ElementData } from '../types';
import { CATEGORY_COLORS } from '../utils/colors';
import { useApp } from '../store/context';

// ── Element Detail Popup ─────────────────────────────────────────
interface ElementPopupProps { el: ElementData; onClose: () => void; }
function ElementPopup({ el, onClose }: ElementPopupProps) {
  const colors = CATEGORY_COLORS[el.category];
  const rows = [
    ['Atomic Number', el.atomicNumber],
    ['Period', el.period],
    ['Group', el.group ?? '—'],
    ['Valence Electrons', el.valenceElectrons],
    ['Electronegativity', el.electronegativity ?? '—'],
    ['Type', el.isMetal ? 'Metal' : 'Non-metal'],
    ['Category', el.category.replace(/-/g, ' ')],
  ];
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: 300, borderRadius: 16, overflow: 'hidden', background: '#0d0120', border: `2px solid ${colors.border}`, boxShadow: `0 0 40px ${colors.glow}60, 0 0 80px ${colors.glow}20` }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px 16px', background: colors.bg, borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 48, fontWeight: 900, color: colors.text, lineHeight: 1, textShadow: `0 0 20px ${colors.glow}` }}>
              {el.symbol}
            </div>
            <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 16, color: colors.text, marginTop: 4, opacity: 0.9 }}>{el.name}</div>
            <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 11, color: colors.text, marginTop: 2, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {el.category.replace(/-/g, ' ')}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: colors.text, fontSize: 18, opacity: 0.7, lineHeight: 1 }}>✕</button>
            <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 22, fontWeight: 700, color: colors.text, opacity: 0.8 }}>{el.atomicNumber}</div>
          </div>
        </div>
        {/* Properties grid */}
        <div style={{ padding: '16px 20px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {rows.map(([label, value]) => (
            <div key={String(label)} style={{ padding: '10px 12px', borderRadius: 10, background: '#130929', border: '1px solid #2d1b5e' }}>
              <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 9, color: '#9f7aea', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{label}</div>
              <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 14, fontWeight: 700, color: '#f3e8ff' }}>{String(value)}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: '0 20px 16px', fontFamily: '"Share Tech Mono", monospace', fontSize: 11, color: '#6b21a8', textAlign: 'center' }}>
          Click outside to close · Drag to sandbox to place
        </div>
      </div>
    </div>
  );
}

// ── Element Tile ────────────────────────────────────────────────
interface ElementTileProps { el: ElementData; tiny?: boolean; }

export function ElementTile({ el, tiny = false }: ElementTileProps) {
  const { dispatch } = useApp();
  const [showPopup, setShowPopup] = useState(false);
  const colors = CATEGORY_COLORS[el.category];

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('elementSymbol', el.symbol);
    dispatch({ type: 'SET_DRAG', payload: el });
  };
  const handleDragEnd = () => dispatch({ type: 'SET_DRAG', payload: null });
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'SELECT_ELEMENT', payload: el });
    setShowPopup(true);
  };

  return (
    <>
      {showPopup && <ElementPopup el={el} onClose={() => setShowPopup(false)} />}

      {tiny ? (
        <div
          draggable
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onClick={handleClick}
          title={`${el.name} (${el.atomicNumber}) — click for details`}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', aspectRatio: '1', borderRadius: 3, cursor: 'grab', userSelect: 'none', transition: 'all 0.15s', background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text, padding: 1, position: 'relative', zIndex: 1 }}
          onMouseEnter={e => {
            const d = e.currentTarget as HTMLDivElement;
            d.style.boxShadow = `0 0 8px ${colors.glow}`;
            d.style.transform = 'scale(1.2)';
            d.style.zIndex = '10';
          }}
          onMouseLeave={e => {
            const d = e.currentTarget as HTMLDivElement;
            d.style.boxShadow = 'none';
            d.style.transform = 'scale(1)';
            d.style.zIndex = '1';
          }}
        >
          <span style={{ fontSize: 6, opacity: 0.7, lineHeight: 1 }}>{el.atomicNumber}</span>
          <span style={{ fontFamily: 'Orbitron, monospace', fontWeight: 700, fontSize: 10, lineHeight: 1 }}>{el.symbol}</span>
        </div>
      ) : (
        <div
          draggable
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onClick={handleClick}
          title={`${el.name} — click for details`}
          style={{ cursor: 'grab', userSelect: 'none', borderRadius: 8, transition: 'all 0.15s', display: 'flex', flexDirection: 'column', gap: 2, background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text, padding: '8px 10px', minWidth: 64 }}
          onMouseEnter={e => {
            const d = e.currentTarget as HTMLDivElement;
            d.style.boxShadow = `0 0 14px ${colors.glow}`;
            d.style.transform = 'scale(1.06)';
          }}
          onMouseLeave={e => {
            const d = e.currentTarget as HTMLDivElement;
            d.style.boxShadow = 'none';
            d.style.transform = 'scale(1)';
          }}
        >
          <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 10, opacity: 0.7, lineHeight: 1 }}>{el.atomicNumber}</div>
          <div style={{ fontFamily: 'Orbitron, monospace', fontWeight: 700, fontSize: 18, lineHeight: 1.1 }}>{el.symbol}</div>
          <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 9, opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 54 }}>{el.name}</div>
        </div>
      )}
    </>
  );
}
