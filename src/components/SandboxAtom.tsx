import { useState, useEffect, useRef } from 'react';
import type { PlacedAtom } from '../types';
import { CATEGORY_COLORS, getAtomColor } from '../utils/colors';
import { useApp } from '../store/context';

interface SandboxAtomProps {
  atom: PlacedAtom;
}

export function SandboxAtom({ atom }: SandboxAtomProps) {
  const { dispatch } = useApp();
  const [dragging, setDragging] = useState(false);
  const offsetRef = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);
  const elRef = useRef<HTMLDivElement>(null);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const color = getAtomColor(atom.element.category);
  const colors = CATEGORY_COLORS[atom.element.category];

  // ── Mouse drag ────────────────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!elRef.current) return;
    offsetRef.current = { x: e.clientX - atom.x, y: e.clientY - atom.y };
    hasMoved.current = false;
    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) return;

    const onMove = (e: MouseEvent) => {
      const sandbox = document.getElementById('sandbox-area');
      if (!sandbox || !elRef.current) return;
      const dx = e.clientX - (atom.x + offsetRef.current.x);
      const dy = e.clientY - (atom.y + offsetRef.current.y);
      if (!hasMoved.current && Math.hypot(dx, dy) > 4) hasMoved.current = true;
      if (!hasMoved.current) return;
      const rect = sandbox.getBoundingClientRect();
      const newX = Math.max(30, Math.min(rect.width - 30, e.clientX - offsetRef.current.x));
      const newY = Math.max(30, Math.min(rect.height - 30, e.clientY - offsetRef.current.y));
      elRef.current.style.left = `${newX}px`;
      elRef.current.style.top = `${newY}px`;
    };

    const onUp = (e: MouseEvent) => {
      setDragging(false);
      if (!hasMoved.current) return;
      const sandbox = document.getElementById('sandbox-area');
      if (!sandbox) return;
      const rect = sandbox.getBoundingClientRect();
      const newX = Math.max(30, Math.min(rect.width - 30, e.clientX - offsetRef.current.x));
      const newY = Math.max(30, Math.min(rect.height - 30, e.clientY - offsetRef.current.y));
      dispatch({ type: 'REMOVE_ATOM', payload: atom.id });
      setTimeout(() => dispatch({ type: 'DROP_ATOM', payload: { element: atom.element, x: newX, y: newY } }), 0);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragging, atom, dispatch]);

  // ── Touch drag ────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    const touch = e.touches[0];
    offsetRef.current = { x: touch.clientX - atom.x, y: touch.clientY - atom.y };
    hasMoved.current = false;
    // detect double-tap for removal
    if (tapTimer.current) {
      clearTimeout(tapTimer.current);
      tapTimer.current = null;
      dispatch({ type: 'REMOVE_ATOM', payload: atom.id });
      return;
    }
    tapTimer.current = setTimeout(() => { tapTimer.current = null; }, 300);
    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) return;

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const sandbox = document.getElementById('sandbox-area');
      if (!sandbox || !elRef.current) return;
      const dx = touch.clientX - (atom.x + offsetRef.current.x);
      const dy = touch.clientY - (atom.y + offsetRef.current.y);
      if (!hasMoved.current && Math.hypot(dx, dy) > 4) hasMoved.current = true;
      if (!hasMoved.current) return;
      const rect = sandbox.getBoundingClientRect();
      const newX = Math.max(30, Math.min(rect.width - 30, touch.clientX - offsetRef.current.x));
      const newY = Math.max(30, Math.min(rect.height - 30, touch.clientY - offsetRef.current.y));
      elRef.current.style.left = `${newX}px`;
      elRef.current.style.top = `${newY}px`;
    };

    const onTouchEnd = (e: TouchEvent) => {
      setDragging(false);
      if (!hasMoved.current) return;
      const touch = e.changedTouches[0];
      const sandbox = document.getElementById('sandbox-area');
      if (!sandbox) return;
      const rect = sandbox.getBoundingClientRect();
      const newX = Math.max(30, Math.min(rect.width - 30, touch.clientX - offsetRef.current.x));
      const newY = Math.max(30, Math.min(rect.height - 30, touch.clientY - offsetRef.current.y));
      dispatch({ type: 'REMOVE_ATOM', payload: atom.id });
      setTimeout(() => dispatch({ type: 'DROP_ATOM', payload: { element: atom.element, x: newX, y: newY } }), 0);
    };

    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [dragging, atom, dispatch]);

  return (
    <div
      ref={elRef}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onDoubleClick={(e) => { e.stopPropagation(); dispatch({ type: 'REMOVE_ATOM', payload: atom.id }); }}
      title="Double-tap or double-click to remove"
      className="absolute flex flex-col items-center justify-center w-13 h-13 rounded-full select-none -translate-x-1/2 -translate-y-1/2"
      style={{
        left: atom.x,
        top: atom.y,
        background: `radial-gradient(circle at 35% 35%, ${color}99, ${color}dd)`,
        border: `2px solid ${colors.border}`,
        boxShadow: dragging
          ? `0 0 24px ${colors.glow}, 0 0 48px ${colors.glow}40`
          : `0 0 12px ${colors.glow}60`,
        cursor: dragging ? 'grabbing' : 'grab',
        zIndex: dragging ? 100 : 2,
        transition: dragging ? 'none' : 'box-shadow 0.2s',
        touchAction: 'none',
      }}
    >
      <span className="font-orbitron font-bold text-white text-[13px] leading-none">
        {atom.element.symbol}
      </span>
      <span className="text-[8px] text-white/70 font-share-tech">
        {atom.element.valenceElectrons}e⁻
      </span>
    </div>
  );
}
