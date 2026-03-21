import { useState, useRef } from 'react';
import type { DragEvent } from 'react';
import { useApp } from '../../shared/store/context';
import { useTheme } from '../../shared/store/theme';
import { ELEMENTS } from '../../shared/data/elements';
import { validateBond } from '../../shared/utils/chemistry';
import { BondLines } from './BondLines';
import { SandboxAtom } from './SandboxAtom';


// Subtle floating circles for the background
const BUBBLES = Array.from({ length: 20 }, (_, i) => ({
  left: ((i * 137.508) % 100).toFixed(2),
  top: ((i * 93.7) % 100).toFixed(2),
  size: i % 5 === 0 ? 12 : i % 3 === 0 ? 8 : 6,
  duration: (3 + (i % 5) * 0.8).toFixed(1),
  delay: ((i * 0.5) % 4).toFixed(1),
  color: ['#0E6B68', '#3BA8A2', '#8A9E6E', '#2EC4BC'][i % 4],
}));

interface SandboxProps { isMobile?: boolean; }

export function Sandbox({ isMobile }: SandboxProps) {
  const { state, dispatch } = useApp();
  const { theme } = useTheme();
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
          ? theme.sandboxBgHover
          : theme.sandboxBg,
        border: dragOver ? `2px dashed ${theme.sandboxBorderHover}` : `2px dashed ${theme.sandboxBorder}`,
        boxShadow: dragOver ? `inset 0 0 30px ${theme.accent}10` : 'inset 0 0 20px rgba(0,0,0,0.02)',
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
            opacity: theme.isDark ? 0.12 : 0.08,
            animationDuration: `${bubble.duration}s`,
            animationDelay: `${bubble.delay}s`,
          }}
        />
      ))}

      {/* Karagatan wave-grid background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: theme.isDark ? 0.07 : 0.055 }}>
        <defs>
          <pattern id="karagatan" x="0" y="0" width="60" height="18" patternUnits="userSpaceOnUse">
            <path d="M0,9 C10,4 20,14 30,9 C40,4 50,14 60,9" fill="none" stroke={theme.sandboxDotColor} strokeWidth="1.2" strokeLinecap="round"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#karagatan)" />
      </svg>

      {/* Empty state */}
      {state.placedAtoms.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ gap: 10 }}>
          {/* Palayok + Karagatan illustration */}
          <svg width="90" height="100" viewBox="0 0 90 100" fill="none" style={{ opacity: theme.isDark ? 0.22 : 0.18 }}>
            {/* Waves below pot — karagatan */}
            <path d="M5,78 C15,73 25,83 35,78 C45,73 55,83 65,78 C72,74 79,80 85,78" stroke={theme.accent} strokeWidth="1.4" strokeLinecap="round"/>
            <path d="M10,85 C20,80 30,90 40,85 C50,80 60,90 70,85 C75,82 80,87 85,85" stroke={theme.accent} strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
            <path d="M2,92 C12,87 22,97 32,92 C42,87 52,97 62,92 C70,88 77,94 88,92" stroke={theme.accent} strokeWidth="0.8" strokeLinecap="round" opacity="0.35"/>
            {/* Palayok body — wide round belly */}
            <path d="M17,38 Q12,43 12,52 Q12,68 45,68 Q78,68 78,52 Q78,43 73,38 Z" fill={theme.accent}/>
            {/* Palayok neck */}
            <path d="M30,38 L29,28 Q29,26 32,26 L58,26 Q61,26 61,28 L60,38 Z" fill={theme.accent}/>
            {/* Palayok rim */}
            <ellipse cx="45" cy="26" rx="17" ry="4.5" fill={theme.accent}/>
            {/* Horizontal ring texture on belly */}
            <path d="M18,47 Q45,44 72,47" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.25"/>
            <path d="M14,56 Q45,53 76,56" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.2"/>
            <path d="M16,64 Q45,61 74,64" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.15"/>
            {/* Coconut frond — left */}
            <path d="M8,36 C4,30 0,22 6,16" stroke={theme.accentLight} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
            <path d="M8,36 C2,33 -2,26 2,20" stroke={theme.accentLight} strokeWidth="1" strokeLinecap="round" opacity="0.3"/>
            {/* Coconut frond — right */}
            <path d="M82,36 C86,30 90,22 84,16" stroke={theme.accentLight} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
            <path d="M82,36 C88,33 92,26 88,20" stroke={theme.accentLight} strokeWidth="1" strokeLinecap="round" opacity="0.3"/>
          </svg>

          {isMobile ? (
            <>
              <p style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: 14, color: theme.textTertiary, letterSpacing: '0.01em', fontStyle: 'italic' }}>Lab is Empty</p>
              <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 12, padding: '10px 18px', textAlign: 'center', maxWidth: 240, boxShadow: theme.shadow }}>
                <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: theme.textSecondary }}>
                  Go to the <span style={{ color: theme.accent, fontWeight: 700 }}>Guide</span> tab
                </p>
                <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: theme.textTertiary, marginTop: 4 }}>
                  and tap any element to add it
                </p>
              </div>
            </>
          ) : (
            <>
              <p style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: 15, color: theme.textTertiary, letterSpacing: '0.01em', fontStyle: 'italic' }}>Drag Atoms Here</p>
              <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, marginTop: 0, color: theme.textTertiary }}>Double-click placed atoms to remove</p>
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
            fontFamily: '"Playfair Display", sans-serif',
            fontSize: 18,
            fontWeight: 800,
            color: theme.accent,
            letterSpacing: '0.5px',
            background: theme.formulaBg,
            border: `1px solid ${theme.formulaBorder}`,
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          }}
        >
          {state.formula}
        </div>
      )}
    </div>
  );
}
