import { useState, useRef } from 'react';
import type { DragEvent } from 'react';
import type { ElementData } from '../types';
import { getCategoryColors } from '../utils/colors';
import { useApp } from '../store/context';
import { useTheme } from '../store/theme';

// Smart placement
function getSmartPosition(existingCount: number): { x: number; y: number } {
  const sandbox = document.getElementById('sandbox-area');
  const rect = sandbox?.getBoundingClientRect();
  const W = rect?.width ?? 320;
  const H = rect?.height ?? 300;
  const cols = Math.max(1, Math.floor(W / 90));
  const col = existingCount % cols;
  const row = Math.floor(existingCount / cols);
  return {
    x: Math.min(60 + col * 90 + (row % 2) * 20, W - 50),
    y: Math.min(60 + row * 90, H - 50),
  };
}

// Element Detail Popup
interface ElementPopupProps { el: ElementData; onClose: () => void; }
function ElementPopup({ el, onClose }: ElementPopupProps) {
  const { theme } = useTheme();
  const CATEGORY_COLORS = getCategoryColors(theme.isDark);
  const colors = CATEGORY_COLORS[el.category];
  const rows = [
    ['Atomic Number', el.atomicNumber],
    ['Period', el.period],
    ['Group', el.group ?? '--'],
    ['Valence Electrons', el.valenceElectrons],
    ['Electronegativity', el.electronegativity ?? '--'],
    ['Type', el.isMetal ? 'Metal' : 'Non-metal'],
    ['Category', el.category.replace(/-/g, ' ')],
  ];
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: theme.overlay, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(4px)' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 340, borderRadius: 20, overflow: 'hidden', background: theme.surface, border: `2px solid ${colors.border}`, boxShadow: '0 16px 48px rgba(0,0,0,0.15)' }}>
        <div style={{ padding: '20px 24px 16px', background: colors.bg, borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 48, fontWeight: 900, color: colors.text, lineHeight: 1 }}>{el.symbol}</div>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 16, color: colors.text, marginTop: 4, fontWeight: 600 }}>{el.name}</div>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: colors.text, marginTop: 2, opacity: 0.7, textTransform: 'capitalize', letterSpacing: '0.05em' }}>{el.category.replace(/-/g, ' ')}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: colors.text, fontSize: 18, opacity: 0.6 }}>&#x2715;</button>
            <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 22, fontWeight: 800, color: colors.text, opacity: 0.8 }}>{el.atomicNumber}</div>
          </div>
        </div>
        <div style={{ padding: '16px 20px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {rows.map(([label, value]) => (
            <div key={String(label)} style={{ padding: '10px 12px', borderRadius: 10, background: theme.surfaceAlt, border: `1px solid ${theme.border}` }}>
              <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 9, color: theme.textTertiary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{label}</div>
              <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 14, fontWeight: 700, color: theme.text }}>{String(value)}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: '0 20px 16px', fontFamily: '"Inter", sans-serif', fontSize: 11, color: theme.textTertiary, textAlign: 'center' }}>
          Click outside to close
        </div>
      </div>
    </div>
  );
}

// Element Tile
interface ElementTileProps {
  el: ElementData;
  tiny?: boolean;
  onToast?: (msg: string) => void;
  isMobile?: boolean;
  isTablet?: boolean;
}

// Touch drag ghost
let ghostEl: HTMLDivElement | null = null;
function createGhost(symbol: string, color: string, x: number, y: number) {
  removeGhost();
  ghostEl = document.createElement('div');
  ghostEl.textContent = symbol;
  ghostEl.style.cssText = `
    position:fixed;pointer-events:none;z-index:99999;
    width:56px;height:56px;border-radius:50%;
    background:${color};border:3px solid #14b8a6;
    display:flex;align-items:center;justify-content:center;
    font-family:Nunito,sans-serif;font-weight:800;font-size:18px;
    color:#fff;opacity:0.92;box-shadow:0 4px 20px rgba(0,0,0,0.2);
    transform:translate(-50%,-50%);
    left:${x}px;top:${y}px;
    transition:none;
  `;
  document.body.appendChild(ghostEl);
}
function moveGhost(x: number, y: number) {
  if (ghostEl) { ghostEl.style.left = `${x}px`; ghostEl.style.top = `${y}px`; }
}
function removeGhost() {
  if (ghostEl) { ghostEl.remove(); ghostEl = null; }
}

const isTouchDevice =
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0);

export function ElementTile({ el, tiny = false, onToast, isMobile }: ElementTileProps) {
  const { state, dispatch } = useApp();
  const { theme } = useTheme();
  const CATEGORY_COLORS = getCategoryColors(theme.isDark);
  const [showPopup, setShowPopup] = useState(false);
  const colors = CATEGORY_COLORS[el.category];

  const treatAsTablet = !isMobile && isTouchDevice;

  const touchHandled = useRef(false);
  const touchDragging = useRef(false);

  const addToLab = () => {
    const pos = getSmartPosition(state.placedAtoms.length);
    dispatch({ type: 'DROP_ATOM', payload: { element: el, x: pos.x, y: pos.y } });
    onToast?.(`${el.symbol} -- ${el.name} added`);
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('elementSymbol', el.symbol);
    dispatch({ type: 'SET_DRAG', payload: el });
  };
  const handleDragEnd = () => dispatch({ type: 'SET_DRAG', payload: null });

  const handleClick = () => {
    if (touchHandled.current) { touchHandled.current = false; return; }
    dispatch({ type: 'SELECT_ELEMENT', payload: el });
    setShowPopup(true);
  };

  const handleMobileTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchHandled.current = true;
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;

    const timer = setTimeout(() => {
      dispatch({ type: 'SELECT_ELEMENT', payload: el });
      setShowPopup(true);
    }, 600);

    const onMove = (ev: globalThis.TouchEvent) => {
      const t = ev.touches[0];
      if (Math.hypot(t.clientX - startX, t.clientY - startY) > 8) {
        clearTimeout(timer);
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('touchend', onEnd);
      }
    };
    const onEnd = () => {
      clearTimeout(timer);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
      addToLab();
    };
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd, { passive: true });
  };

  const handleTabletTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchHandled.current = true;
    touchDragging.current = false;
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;

    const onMove = (ev: globalThis.TouchEvent) => {
      const t = ev.touches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      const dist = Math.hypot(dx, dy);

      if (touchDragging.current) {
        moveGhost(t.clientX, t.clientY);
        return;
      }

      if (dist > 12 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        touchDragging.current = true;
        createGhost(el.symbol, colors.bg, t.clientX, t.clientY);
        dispatch({ type: 'SET_DRAG', payload: el });
      }
    };

    const onEnd = (ev: globalThis.TouchEvent) => {
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);

      if (touchDragging.current) {
        removeGhost();
        dispatch({ type: 'SET_DRAG', payload: null });
        touchDragging.current = false;

        const t = ev.changedTouches[0];
        const sandbox = document.getElementById('sandbox-area');
        if (sandbox) {
          const rect = sandbox.getBoundingClientRect();
          if (
            t.clientX >= rect.left && t.clientX <= rect.right &&
            t.clientY >= rect.top  && t.clientY <= rect.bottom
          ) {
            dispatch({
              type: 'DROP_ATOM',
              payload: { element: el, x: t.clientX - rect.left, y: t.clientY - rect.top },
            });
            onToast?.(`${el.symbol} -- ${el.name} added`);
          }
        }
      } else {
        const t = ev.changedTouches[0];
        if (Math.hypot(t.clientX - startX, t.clientY - startY) < 10) {
          addToLab();
        }
      }
    };

    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd, { passive: true });
  };

  const handleTouchStart = isMobile
    ? handleMobileTouchStart
    : treatAsTablet
    ? handleTabletTouchStart
    : undefined;

  const sharedStyle: React.CSSProperties = {
    userSelect: 'none',
    transition: 'all 0.2s',
    background: colors.bg,
    border: `1px solid ${colors.border}`,
    color: colors.text,
    touchAction: treatAsTablet ? 'pan-y' : 'auto',
    cursor: 'pointer',
    position: 'relative',
  };

  return (
    <>
      {showPopup && <ElementPopup el={el} onClose={() => setShowPopup(false)} />}

      {tiny ? (
        <div
          draggable={!isMobile && !treatAsTablet}
          onDragStart={(!isMobile && !treatAsTablet) ? handleDragStart : undefined}
          onDragEnd={(!isMobile && !treatAsTablet) ? handleDragEnd : undefined}
          onTouchStart={handleTouchStart}
          onClick={handleClick}
          title={`${el.name} (${el.atomicNumber})`}
          style={{ ...sharedStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', aspectRatio: '1', borderRadius: 4, padding: 1, zIndex: 1 }}
          onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.transform = 'scale(1.2)'; d.style.zIndex = '10'; d.style.boxShadow = `0 2px 8px ${colors.border}40`; }}
          onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.transform = 'scale(1)'; d.style.zIndex = '1'; d.style.boxShadow = 'none'; }}
        >
          <span style={{ fontSize: 'clamp(7px, 0.6vw, 10px)', opacity: 0.7, lineHeight: 1, fontFamily: '"Space Mono", monospace' }}>{el.atomicNumber}</span>
          <span style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: 'clamp(11px, 1vw, 16px)', lineHeight: 1 }}>{el.symbol}</span>
        </div>
      ) : (
        <div
          draggable={!isMobile && !treatAsTablet}
          onDragStart={(!isMobile && !treatAsTablet) ? handleDragStart : undefined}
          onDragEnd={(!isMobile && !treatAsTablet) ? handleDragEnd : undefined}
          onTouchStart={handleTouchStart}
          onClick={handleClick}
          title={`${el.name} -- tap to add`}
          style={{ ...sharedStyle, borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 2, padding: '8px 10px', minWidth: 64 }}
          onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.boxShadow = `0 4px 12px ${colors.border}30`; d.style.transform = 'scale(1.04)'; }}
          onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.boxShadow = 'none'; d.style.transform = 'scale(1)'; }}
        >
          <div style={{ fontFamily: '"Space Mono", monospace', fontSize: 12, opacity: 0.6, lineHeight: 1 }}>{el.atomicNumber}</div>
          <div style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: 24, lineHeight: 1.1 }}>{el.symbol}</div>
          <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 60, opacity: 0.8 }}>{el.name}</div>
        </div>
      )}
    </>
  );
}
