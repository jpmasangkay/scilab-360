import { useState, useRef } from 'react';
import type { DragEvent } from 'react';
import { useApp } from '../store/context';
import { ELEMENTS } from '../data/elements';
import { validateBond } from '../utils/chemistry';
import { BondLines } from './BondLines';
import { SandboxAtom } from './SandboxAtom';
import { FlaskConical } from 'lucide-react';

// Subtle floating circles for the background
const BUBBLES = Array.from({ length: 20 }, (_, i) => ({
  left: ((i * 137.508) % 100).toFixed(2),
  top: ((i * 93.7) % 100).toFixed(2),
  size: i % 5 === 0 ? 12 : i % 3 === 0 ? 8 : 6,
  duration: (3 + (i % 5) * 0.8).toFixed(1),
  delay: ((i * 0.5) % 4).toFixed(1),
  color: ['#14b8a6', '#06b6d4', '#10b981', '#0ea5e9'][i % 4],
}));

interface SandboxProps { isMobile?: boolean; }

export function Sandbox({ isMobile }: SandboxProps) {
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
        dispatch({ type: 'SET_FEEDBACK', payload: { msg: `${validation.reason}`, type: 'warning' } });
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
      className="relative flex-1 rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        minHeight: isMobile ? 0 : 260,
        height: isMobile ? '100%' : undefined,
        background: dragOver
          ? '#f0fdfa'
          : 'linear-gradient(135deg, #f8fafc 0%, #f0fdfa 50%, #ecfdf5 100%)',
        border: dragOver ? '2px dashed #14b8a6' : '2px dashed #cbd5e1',
        boxShadow: dragOver ? 'inset 0 0 30px rgba(20,184,166,0.08)' : 'inset 0 0 20px rgba(0,0,0,0.02)',
      }}
    >
      {/* Floating bubbles */}
      {BUBBLES.map((bubble, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none animate-float-triangle"
          style={{
            left: `${bubble.left}%`,
            top: `${bubble.top}%`,
            width: bubble.size,
            height: bubble.size,
            background: bubble.color,
            opacity: 0.08,
            animationDuration: `${bubble.duration}s`,
            animationDelay: `${bubble.delay}s`,
          }}
        />
      ))}

      {/* Subtle dot grid */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]">
        <defs>
          <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="15" cy="15" r="1.2" fill="#94a3b8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      {/* Empty state */}
      {state.placedAtoms.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ gap: 8 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FlaskConical size={28} color="#94a3b8" />
          </div>
          {isMobile ? (
            <>
              <p style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: 14, color: '#94a3b8', letterSpacing: '0.02em' }}>Lab is Empty</p>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '10px 18px', textAlign: 'center', maxWidth: 240, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#64748b' }}>
                  Go to the <span style={{ color: '#14b8a6', fontWeight: 700 }}>Guide</span> tab
                </p>
                <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                  and tap any element to add it
                </p>
              </div>
            </>
          ) : (
            <>
              <p style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: 15, color: '#94a3b8', letterSpacing: '0.02em' }}>Drag Atoms Here</p>
              <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, marginTop: 2, color: '#cbd5e1' }}>Double-click atoms to remove</p>
            </>
          )}
        </div>
      )}

      <BondLines atoms={state.placedAtoms} bonds={state.bonds} />
      {state.placedAtoms.map(atom => <SandboxAtom key={atom.id} atom={atom} />)}

      {/* Formula overlay */}
      {state.formula && (
        <div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 px-5 py-2 rounded-xl z-10"
          style={{
            fontFamily: '"Nunito", sans-serif',
            fontSize: 18,
            fontWeight: 800,
            color: '#0f766e',
            letterSpacing: '0.5px',
            background: '#ffffff',
            border: '1px solid #99f6e4',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          }}
        >
          {state.formula}
        </div>
      )}
    </div>
  );
}
