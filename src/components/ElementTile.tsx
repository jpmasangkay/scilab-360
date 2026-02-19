import { useState, useRef } from 'react';
import type { DragEvent } from 'react';
import type { ElementData } from '../types';
import { CATEGORY_COLORS } from '../utils/colors';
import { useApp } from '../store/context';

// ── Smart placement ───────────────────────────────────────────────
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

// ── Element Detail Popup (desktop only) ──────────────────────────
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
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 320, borderRadius: 16, overflow: 'hidden', background: '#0d0120', border: `2px solid ${colors.border}`, boxShadow: `0 0 40px ${colors.glow}60` }}>
        <div style={{ padding: '20px 24px 16px', background: colors.bg, borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 48, fontWeight: 900, color: colors.text, lineHeight: 1, textShadow: `0 0 20px ${colors.glow}` }}>{el.symbol}</div>
            <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 16, color: colors.text, marginTop: 4 }}>{el.name}</div>
            <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 11, color: colors.text, marginTop: 2, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{el.category.replace(/-/g, ' ')}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: colors.text, fontSize: 18, opacity: 0.7 }}>✕</button>
            <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 22, fontWeight: 700, color: colors.text, opacity: 0.8 }}>{el.atomicNumber}</div>
          </div>
        </div>
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
interface ElementTileProps {
  el: ElementData;
  tiny?: boolean;
  onToast?: (msg: string) => void;
  isMobile?: boolean;
  isTablet?: boolean;
}

// ── Touch drag ghost (tablet only) ───────────────────────────────
let ghostEl: HTMLDivElement | null = null;
function createGhost(symbol: string, color: string, x: number, y: number) {
  removeGhost();
  ghostEl = document.createElement('div');
  ghostEl.textContent = symbol;
  ghostEl.style.cssText = `
    position:fixed;pointer-events:none;z-index:99999;
    width:52px;height:52px;border-radius:50%;
    background:${color};border:2px solid #a855f7;
    display:flex;align-items:center;justify-content:center;
    font-family:Orbitron,monospace;font-weight:700;font-size:16px;
    color:#fff;opacity:0.9;box-shadow:0 0 20px #a855f7;
    transform:translate(-50%,-50%);
    left:${x}px;top:${y}px;
  `;
  document.body.appendChild(ghostEl);
}
function moveGhost(x: number, y: number) {
  if (ghostEl) { ghostEl.style.left = `${x}px`; ghostEl.style.top = `${y}px`; }
}
function removeGhost() {
  if (ghostEl) { ghostEl.remove(); ghostEl = null; }
}

export function ElementTile({ el, tiny = false, onToast, isMobile, isTablet }: ElementTileProps) {
  const { state, dispatch } = useApp();
  const [showPopup, setShowPopup] = useState(false);
  const colors = CATEGORY_COLORS[el.category];

  // Track touch state to prevent click from firing after touch
  const touchHandled = useRef(false);
  const touchDragging = useRef(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Add atom to lab ───────────────────────────────────────────
  const addToLab = () => {
    const pos = getSmartPosition(state.placedAtoms.length);
    dispatch({ type: 'DROP_ATOM', payload: { element: el, x: pos.x, y: pos.y } });
    onToast?.(`${el.symbol} — ${el.name} added ⚗`);
  };

  // ── Desktop: drag ─────────────────────────────────────────────
  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('elementSymbol', el.symbol);
    dispatch({ type: 'SET_DRAG', payload: el });
  };
  const handleDragEnd = () => dispatch({ type: 'SET_DRAG', payload: null });

  // ── Desktop: click → popup ────────────────────────────────────
  const handleClick = () => {
    // Ignore click if it was triggered by a touch event
    if (touchHandled.current) {
      touchHandled.current = false;
      return;
    }
    dispatch({ type: 'SELECT_ELEMENT', payload: el });
    setShowPopup(true);
  };

  // ── Mobile: tap=add, long-press=details, NO drag, scroll free ───
  const handleMobileTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchHandled.current = true;
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;

    longPressTimer.current = setTimeout(() => {
      longPressTimer.current = null;
      dispatch({ type: 'SELECT_ELEMENT', payload: el });
      setShowPopup(true);
    }, 600);

    const onMove = (ev: globalThis.TouchEvent) => {
      const t = ev.touches[0];
      if (Math.hypot(t.clientX - startX, t.clientY - startY) > 8 && longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('touchend', onEnd);
      }
    };
    const onEnd = () => {
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
        addToLab();
      }
    };
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
  };

  // ── Tablet: tap=add, drag=drop, 2s hold=info, scroll by touching gaps ──
  const handleTabletTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchHandled.current = true;
    touchDragging.current = false;
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    let scrolling = false;

    // Find the nearest scrollable parent to scroll manually when needed
    const scrollParent = (e.currentTarget as HTMLElement).closest('[style*="overflow"]') as HTMLElement | null;
    let scrollStartTop = scrollParent?.scrollTop ?? 0;

    longPressTimer.current = setTimeout(() => {
      longPressTimer.current = null;
      if (!touchDragging.current && !scrolling) {
        dispatch({ type: 'SELECT_ELEMENT', payload: el });
        setShowPopup(true);
      }
    }, 2000);

    const onMove = (ev: globalThis.TouchEvent) => {
      const t = ev.touches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      const dist = Math.hypot(dx, dy);

      if (!touchDragging.current && !scrolling) {
        if (dist > 6) {
          if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
          }
          // Mostly vertical → scroll the list
          if (Math.abs(dy) > Math.abs(dx) * 1.2) {
            scrolling = true;
            if (scrollParent) scrollParent.scrollTop = scrollStartTop - dy;
            return;
          }
          // Otherwise → start drag
          if (dist > 10) {
            touchDragging.current = true;
            createGhost(el.symbol, colors.bg, t.clientX, t.clientY);
            dispatch({ type: 'SET_DRAG', payload: el });
          }
        }
        return;
      }

      if (scrolling) {
        // Keep scrolling
        ev.preventDefault();
        if (scrollParent) scrollParent.scrollTop = scrollStartTop - dy;
        return;
      }

      // Dragging — follow finger
      ev.preventDefault();
      moveGhost(t.clientX, t.clientY);
    };

    const onEnd = (ev: globalThis.TouchEvent) => {
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }

      if (touchDragging.current) {
        removeGhost();
        dispatch({ type: 'SET_DRAG', payload: null });
        const t = ev.changedTouches[0];
        const sandbox = document.getElementById('sandbox-area');
        if (sandbox) {
          const rect = sandbox.getBoundingClientRect();
          if (t.clientX >= rect.left && t.clientX <= rect.right &&
              t.clientY >= rect.top && t.clientY <= rect.bottom) {
            dispatch({ type: 'DROP_ATOM', payload: { element: el, x: t.clientX - rect.left, y: t.clientY - rect.top } });
            onToast?.(`${el.symbol} — ${el.name} added ⚗`);
          }
        }
        touchDragging.current = false;
      } else if (!scrolling && !showPopup) {
        // Clean short tap → add to lab
        addToLab();
      }
    };

    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
  };

  const handleTouchStart = isMobile ? handleMobileTouchStart : isTablet ? handleTabletTouchStart : undefined;

  const sharedStyle: React.CSSProperties = {
    userSelect: 'none',
    transition: 'all 0.15s',
    background: colors.bg,
    border: `1px solid ${colors.border}`,
    color: colors.text,
    // tablet: touch-action:none so browser doesn't steal the gesture before JS can detect drag
    // mobile: auto so native scroll works freely
    touchAction: isTablet ? 'none' : 'auto',
    cursor: 'pointer',
    position: 'relative',
  };

  return (
    <>
      {showPopup && <ElementPopup el={el} onClose={() => setShowPopup(false)} />}

      {tiny ? (
        <div
          draggable={!isMobile && !isTablet}
          onDragStart={(!isMobile && !isTablet) ? handleDragStart : undefined}
          onDragEnd={(!isMobile && !isTablet) ? handleDragEnd : undefined}
          onTouchStart={handleTouchStart}
          onClick={handleClick}
          title={`${el.name} (${el.atomicNumber})`}
          style={{ ...sharedStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', aspectRatio: '1', borderRadius: 3, padding: 1, zIndex: 1 }}
          onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.boxShadow = `0 0 8px ${colors.glow}`; d.style.transform = 'scale(1.2)'; d.style.zIndex = '10'; }}
          onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.boxShadow = 'none'; d.style.transform = 'scale(1)'; d.style.zIndex = '1'; }}
        >
          <span style={{ fontSize: 'clamp(7px, 0.6vw, 10px)', opacity: 0.9, lineHeight: 1 }}>{el.atomicNumber}</span>
          <span style={{ fontFamily: 'Orbitron, monospace', fontWeight: 700, fontSize: 'clamp(11px, 1vw, 16px)', lineHeight: 1, textShadow: `0 0 6px ${colors.glow}` }}>{el.symbol}</span>
        </div>
      ) : (
        <div
          draggable={!isMobile && !isTablet}
          onDragStart={(!isMobile && !isTablet) ? handleDragStart : undefined}
          onDragEnd={(!isMobile && !isTablet) ? handleDragEnd : undefined}
          onTouchStart={handleTouchStart}
          onClick={handleClick}
          title={`${el.name} — tap to add / click for details`}
          style={{ ...sharedStyle, borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 2, padding: '8px 10px', minWidth: 64 }}
          onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.boxShadow = `0 0 14px ${colors.glow}`; d.style.transform = 'scale(1.06)'; }}
          onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.boxShadow = 'none'; d.style.transform = 'scale(1)'; }}
        >
          <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 13, opacity: 0.9, lineHeight: 1 }}>{el.atomicNumber}</div>
          <div style={{ fontFamily: 'Orbitron, monospace', fontWeight: 700, fontSize: 24, lineHeight: 1.1, textShadow: `0 0 10px ${colors.glow}` }}>{el.symbol}</div>
          <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 60 }}>{el.name}</div>
        </div>
      )}
    </>
  );
}
