import { useState, useRef } from 'react';
import type { DragEvent } from 'react';
import { useApp } from '../store/context';
import { ELEMENTS } from '../data/elements';
import { validateBond } from '../utils/chemistry';
import { BondLines } from './BondLines';
import { SandboxAtom } from './SandboxAtom';

// Stable star positions generated from deterministic values
const STARS = Array.from({ length: 60 }, (_, i) => ({
  left: ((i * 137.508) % 100).toFixed(2),
  top: ((i * 93.7) % 100).toFixed(2),
  size: i % 5 === 0 ? 2.5 : i % 3 === 0 ? 2 : 1.5,
  duration: (1.5 + (i % 7) * 0.4).toFixed(1),
  delay: ((i * 0.3) % 3).toFixed(1),
  color: ['#c084fc', '#e2e8f0', '#a78bfa', '#f0abfc'][i % 4],
}));

export function Sandbox() {
  const { state, dispatch } = useApp();
  const [dragOver, setDragOver] = useState(false);
  const sandboxRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const symbol = e.dataTransfer.getData('elementSymbol');
    if (!symbol) return;
    const el = ELEMENTS.find(el => el.symbol === symbol);
    if (!el) return;
    const rect = sandboxRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (state.placedAtoms.length > 0 && state.mode !== 'free-play') {
      const validation = validateBond(el, state.placedAtoms[0].element);
      if (!validation.valid) {
        dispatch({ type: 'SET_FEEDBACK', payload: { msg: `⚠️ ${validation.reason}`, type: 'warning' } });
        return;
      }
    }

    dispatch({ type: 'DROP_ATOM', payload: { element: el, x: e.clientX - rect.left, y: e.clientY - rect.top } });
  };

  return (
    <div
      id="sandbox-area"
      ref={sandboxRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="relative flex-1 rounded-xl overflow-hidden transition-all duration-200 min-h-[400px]"
      style={{
        background: dragOver
          ? 'radial-gradient(ellipse at center, #2d1263 0%, #0d0120 70%)'
          : 'radial-gradient(ellipse at 30% 40%, #1a0533 0%, #0d0120 60%, #07011a 100%)',
        border: dragOver ? '2px dashed #a855f7' : '2px dashed #2d1b5e',
        boxShadow: dragOver ? 'inset 0 0 40px #a855f720' : 'inset 0 0 20px #0d0120',
      }}
    >
      {/* Starfield */}
      {STARS.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none animate-twinkle"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
            background: star.color,
            opacity: 0.35,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}

      {/* Floating triangles */}
      <div className="absolute left-5 bottom-10 pointer-events-none animate-float-triangle opacity-[0.12]"
        style={{ width: 0, height: 0, borderLeft: '20px solid transparent', borderRight: '20px solid transparent', borderBottom: '35px solid #4c1d95' }} />
      <div className="absolute right-[30px] top-10 pointer-events-none animate-float-triangle opacity-[0.15]"
        style={{ width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderBottom: '24px solid #7c3aed', animationDelay: '1s', animationDuration: '5.5s' }} />
      <div className="absolute right-[100px] bottom-[60px] pointer-events-none animate-float-triangle opacity-10"
        style={{ width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '14px solid #c084fc', animationDelay: '2s', animationDuration: '3.5s' }} />

      {/* Dot grid */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.12]">
        <defs>
          <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="15" cy="15" r="1" fill="#7c3aed" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      {/* Empty state */}
      {state.placedAtoms.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-[44px] mb-3 opacity-50" style={{ filter: 'drop-shadow(0 0 12px #a855f7)' }}>⚛</div>
          <p className="font-orbitron font-bold text-sm tracking-[4px] text-[#4c1d95]">DRAG ATOMS HERE</p>
          <p className="font-share-tech text-[11px] mt-1 text-[#2d1b5e]">Double-click atoms to remove</p>
        </div>
      )}

      <BondLines atoms={state.placedAtoms} bonds={state.bonds} />
      {state.placedAtoms.map(atom => <SandboxAtom key={atom.id} atom={atom} />)}

      {/* Formula overlay */}
      {state.formula && (
        <div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-lg font-orbitron text-xl text-[#e2e8f0] tracking-[2px] z-10"
          style={{
            background: 'linear-gradient(135deg, #1a0533, #0d0120)',
            border: '1px solid #4c1d95',
            boxShadow: '0 0 24px #a855f750, 0 0 4px #a855f7',
            textShadow: '0 0 12px #a855f7',
          }}
        >
          {state.formula}
        </div>
      )}
    </div>
  );
}
