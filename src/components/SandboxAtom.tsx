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
  const elRef = useRef<HTMLDivElement>(null);
  const color = getAtomColor(atom.element.category);
  const colors = CATEGORY_COLORS[atom.element.category];

  const onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!elRef.current) return;
    offsetRef.current = { x: e.clientX - atom.x, y: e.clientY - atom.y };
    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) return;

    const onMove = (e: MouseEvent) => {
      const sandbox = document.getElementById('sandbox-area');
      if (!sandbox || !elRef.current) return;
      const rect = sandbox.getBoundingClientRect();
      const newX = Math.max(30, Math.min(rect.width - 30, e.clientX - offsetRef.current.x));
      const newY = Math.max(30, Math.min(rect.height - 30, e.clientY - offsetRef.current.y));
      elRef.current.style.left = `${newX}px`;
      elRef.current.style.top = `${newY}px`;
    };

    const onUp = (e: MouseEvent) => {
      setDragging(false);
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

  return (
    <div
      ref={elRef}
      onMouseDown={onMouseDown}
      onDoubleClick={() => dispatch({ type: 'REMOVE_ATOM', payload: atom.id })}
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
