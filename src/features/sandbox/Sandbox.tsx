import { useState, useRef } from 'react';
import type { DragEvent } from 'react';
import { useApp } from '../../shared/store/context';
import { useTheme } from '../../shared/store/theme';
import { ELEMENTS } from '../../shared/data/elements';
import { validateBond } from '../../shared/utils/chemistry';
import { BondLines } from './BondLines';
import { SandboxAtom } from './SandboxAtom';


// Floating particles for the background
const BUBBLES = Array.from({ length: 20 }, (_, i) => ({
  left: ((i * 137.508) % 100).toFixed(2),
  top: ((i * 93.7) % 100).toFixed(2),
  size: i % 5 === 0 ? 32 : i % 3 === 0 ? 26 : 20,
  duration: (3 + (i % 5) * 0.8).toFixed(1),
  delay: ((i * 0.5) % 4).toFixed(1),
  color: ['#0E6B68', '#3BA8A2', '#8A9E6E', '#2EC4BC'][i % 4],
  variant: i % 3, // 0,1,2 → different shell / fish variants
  flip: i % 2 === 0, // mirror every other particle
}));

// ── Seashell SVG (light mode) ──────────────────────────────────────────────
// Three variants: spiral conch, scallop fan, nautilus-style coil
function SeashellIcon({ size, color, variant, flip }: { size: number; color: string; variant: number; flip: boolean }) {
  const s = size;
  const t = `scale(${flip ? -1 : 1},1) translate(${flip ? -s : 0},0)`;
  if (variant === 0) {
    // Spiral conch shell
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
        <g transform={t}>
          {/* Outer whorl */}
          <path d="M12 2 C17 2 21 6 21 11 C21 16 17 20 12 20 C9 20 7 18.5 6 16.5" stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round"/>
          {/* Inner spiral whorl */}
          <path d="M12 5 C15.5 5 18 7.5 18 11 C18 14 15.5 16 12 16 C10 16 8.5 15 7.5 13.5" stroke={color} strokeWidth="1.1" fill="none" strokeLinecap="round"/>
          {/* Core */}
          <path d="M12 8 C13.8 8 15 9.2 15 11 C15 12.5 13.8 13.5 12 13.5" stroke={color} strokeWidth="0.9" fill="none" strokeLinecap="round"/>
          {/* Center dot */}
          <circle cx="12" cy="11" r="1.2" fill={color} opacity="0.7"/>
          {/* Spire tip */}
          <path d="M12 2 L10 4 L11 5" stroke={color} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
          {/* Base lip */}
          <path d="M6 16.5 C5 17.5 4.5 19 5.5 20 C6.5 21 8 20.5 9 19.5" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
          {/* Rib lines */}
          <path d="M9 4.5 C8 6 7.5 8 8 10" stroke={color} strokeWidth="0.7" fill="none" strokeLinecap="round" opacity="0.6"/>
          <path d="M15.5 4 C16.5 5.5 17 7 17 9" stroke={color} strokeWidth="0.7" fill="none" strokeLinecap="round" opacity="0.6"/>
          <path d="M18.5 12 C18 14 16.5 16 14.5 17.5" stroke={color} strokeWidth="0.7" fill="none" strokeLinecap="round" opacity="0.6"/>
        </g>
      </svg>
    );
  }
  if (variant === 1) {
    // Scallop / fan shell
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
        <g transform={t}>
          {/* Fan ribs spreading from hinge */}
          <line x1="12" y1="19" x2="4"  y2="8"  stroke={color} strokeWidth="1.1" strokeLinecap="round"/>
          <line x1="12" y1="19" x2="6"  y2="6"  stroke={color} strokeWidth="1.1" strokeLinecap="round"/>
          <line x1="12" y1="19" x2="9"  y2="5"  stroke={color} strokeWidth="1.1" strokeLinecap="round"/>
          <line x1="12" y1="19" x2="12" y2="4"  stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
          <line x1="12" y1="19" x2="15" y2="5"  stroke={color} strokeWidth="1.1" strokeLinecap="round"/>
          <line x1="12" y1="19" x2="18" y2="6"  stroke={color} strokeWidth="1.1" strokeLinecap="round"/>
          <line x1="12" y1="19" x2="20" y2="8"  stroke={color} strokeWidth="1.1" strokeLinecap="round"/>
          {/* Outer scallop edge arc */}
          <path d="M4 8 Q5 6 6 6 Q7 4.5 9 5 Q10.5 4 12 4 Q13.5 4 15 5 Q17 4.5 18 6 Q19 6 20 8" stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round"/>
          {/* Scalloped bumps along top */}
          <path d="M4 8 Q4.5 7 5 7.5 Q5.5 7 6 6" stroke={color} strokeWidth="0.8" fill="none"/>
          <path d="M6 6 Q7 5.2 8 5.5 Q8.5 5 9 5" stroke={color} strokeWidth="0.8" fill="none"/>
          <path d="M15 5 Q15.5 5 16 5.5 Q16.5 5 18 6" stroke={color} strokeWidth="0.8" fill="none"/>
          <path d="M18 6 Q19 6.5 19.5 7 Q20 7.5 20 8" stroke={color} strokeWidth="0.8" fill="none"/>
          {/* Hinge knob */}
          <ellipse cx="12" cy="19.5" rx="2" ry="1.2" fill={color} opacity="0.55"/>
          {/* Concentric arc lines for depth */}
          <path d="M6.5 14 Q12 10 17.5 14" stroke={color} strokeWidth="0.7" fill="none" strokeLinecap="round" opacity="0.5"/>
          <path d="M5 11 Q12 7 19 11" stroke={color} strokeWidth="0.6" fill="none" strokeLinecap="round" opacity="0.4"/>
        </g>
      </svg>
    );
  }
  // variant === 2: Nautilus / ammonite coil
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
      <g transform={t}>
        {/* Outer chamber ring */}
        <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.3" fill="none"/>
        {/* Mid chamber */}
        <circle cx="12" cy="12" r="5.5" stroke={color} strokeWidth="1.1" fill="none"/>
        {/* Inner coil */}
        <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="0.9" fill="none"/>
        {/* Nucleus */}
        <circle cx="12" cy="12" r="1.2" fill={color} opacity="0.65"/>
        {/* Septum lines dividing chambers */}
        <path d="M12 3 Q17 7 17 12" stroke={color} strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.7"/>
        <path d="M17 12 Q17 17 12 21" stroke={color} strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.55"/>
        <path d="M12 6.5 Q15.5 8 15.5 12" stroke={color} strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.6"/>
        <path d="M15.5 12 Q15 15.5 12 17.5" stroke={color} strokeWidth="0.7" fill="none" strokeLinecap="round" opacity="0.5"/>
        <path d="M12 9 Q14 10 14 12" stroke={color} strokeWidth="0.7" fill="none" strokeLinecap="round" opacity="0.55"/>
        {/* Outer texture dots */}
        <circle cx="12" cy="3"  r="0.9" fill={color} opacity="0.5"/>
        <circle cx="21" cy="12" r="0.9" fill={color} opacity="0.5"/>
        <circle cx="12" cy="21" r="0.9" fill={color} opacity="0.5"/>
        <circle cx="3"  cy="12" r="0.9" fill={color} opacity="0.5"/>
      </g>
    </svg>
  );
}

// ── Fish SVG (dark mode) ───────────────────────────────────────────────────
// Three variants: tropical fish, slim dart fish, round puffer-ish fish
function FishIcon({ size, color, variant, flip }: { size: number; color: string; variant: number; flip: boolean }) {
  const s = size;
  const t = `scale(${flip ? -1 : 1},1) translate(${flip ? -s : 0},0)`;
  if (variant === 0) {
    // Classic tropical fish — rounded body, forked tail
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
        <g transform={t}>
          {/* Body */}
          <ellipse cx="11" cy="12" rx="7" ry="5" stroke={color} strokeWidth="1.3" fill="none"/>
          {/* Tail */}
          <path d="M18 12 L22 8 L23 12 L22 16 Z" stroke={color} strokeWidth="1.1" fill="none" strokeLinejoin="round"/>
          {/* Dorsal fin */}
          <path d="M7 7.5 Q10 4.5 14 7" stroke={color} strokeWidth="1.1" fill="none" strokeLinecap="round"/>
          {/* Pectoral fin */}
          <path d="M9 13 Q8 15.5 10.5 15.5" stroke={color} strokeWidth="1" fill="none" strokeLinecap="round"/>
          {/* Eye */}
          <circle cx="6.5" cy="11.5" r="1.3" stroke={color} strokeWidth="1" fill="none"/>
          <circle cx="6.5" cy="11.5" r="0.5" fill={color} opacity="0.8"/>
          {/* Stripe */}
          <path d="M10 7.2 Q10.5 12 10 16.8" stroke={color} strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.6"/>
          <path d="M13 7.6 Q13.5 12 13 16.4" stroke={color} strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.5"/>
          {/* Mouth */}
          <path d="M4 12 Q3.5 12.5 4 13" stroke={color} strokeWidth="1" strokeLinecap="round"/>
          {/* Tail fork detail */}
          <path d="M18 12 L20.5 10 M18 12 L20.5 14" stroke={color} strokeWidth="0.7" strokeLinecap="round" opacity="0.6"/>
        </g>
      </svg>
    );
  }
  if (variant === 1) {
    // Slim dart / mackerel fish
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
        <g transform={t}>
          {/* Slim body */}
          <path d="M3 12 Q7 8.5 15 10.5 Q18 11.5 20 12 Q18 12.5 15 13.5 Q7 15.5 3 12 Z" stroke={color} strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
          {/* Forked tail */}
          <path d="M20 12 L23 9 M20 12 L23 15" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M22 9.5 Q21.5 12 22 14.5" stroke={color} strokeWidth="0.7" strokeLinecap="round" opacity="0.5"/>
          {/* Dorsal fin */}
          <path d="M8 10 Q11 7 14 10" stroke={color} strokeWidth="1" fill="none" strokeLinecap="round"/>
          {/* Anal fin (bottom) */}
          <path d="M10 14 Q11 16.5 13 14" stroke={color} strokeWidth="0.9" fill="none" strokeLinecap="round"/>
          {/* Eye */}
          <circle cx="5.5" cy="12" r="1.1" stroke={color} strokeWidth="1" fill="none"/>
          <circle cx="5.5" cy="12" r="0.45" fill={color} opacity="0.85"/>
          {/* Lateral line */}
          <path d="M8 11.8 Q13 11.5 18 12" stroke={color} strokeWidth="0.6" strokeLinecap="round" strokeDasharray="1.2 1.4" opacity="0.55"/>
          {/* Pectoral fin */}
          <path d="M8 12 Q7.5 13.5 9.5 13.5" stroke={color} strokeWidth="0.9" fill="none" strokeLinecap="round"/>
        </g>
      </svg>
    );
  }
  // variant === 2: Chubby puffer / round fish
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
      <g transform={t}>
        {/* Round chubby body */}
        <circle cx="11" cy="12" r="7.5" stroke={color} strokeWidth="1.2" fill="none"/>
        {/* Tail */}
        <path d="M18.5 12 L22 8.5 Q22.5 12 22 15.5 Z" stroke={color} strokeWidth="1.1" fill="none" strokeLinejoin="round"/>
        {/* Dorsal fin */}
        <path d="M7 5 Q11 3 15 5.5" stroke={color} strokeWidth="1.1" fill="none" strokeLinecap="round"/>
        {/* Ventral fin */}
        <path d="M7 19 Q11 21 15 18.5" stroke={color} strokeWidth="1" fill="none" strokeLinecap="round"/>
        {/* Pectoral fin */}
        <path d="M9 13.5 Q7 15.5 9.5 17" stroke={color} strokeWidth="1" fill="none" strokeLinecap="round"/>
        {/* Eye (big & cute) */}
        <circle cx="7" cy="11" r="2" stroke={color} strokeWidth="1.1" fill="none"/>
        <circle cx="7" cy="11" r="0.8" fill={color} opacity="0.9"/>
        {/* Highlight in eye */}
        <circle cx="7.5" cy="10.4" r="0.35" fill={color} opacity="0.4"/>
        {/* Mouth */}
        <path d="M3.8 12.5 Q3.2 13 3.8 13.8" stroke={color} strokeWidth="1" strokeLinecap="round"/>
        {/* Body spots */}
        <circle cx="12" cy="10" r="0.7" fill={color} opacity="0.4"/>
        <circle cx="14.5" cy="13" r="0.7" fill={color} opacity="0.4"/>
        <circle cx="11.5" cy="15" r="0.6" fill={color} opacity="0.35"/>
        {/* Scale arc lines */}
        <path d="M9 8.5 Q13 7 16.5 9" stroke={color} strokeWidth="0.65" fill="none" strokeLinecap="round" opacity="0.45"/>
        <path d="M7.5 13 Q12 11.5 17 13.5" stroke={color} strokeWidth="0.65" fill="none" strokeLinecap="round" opacity="0.4"/>
      </g>
    </svg>
  );
}

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
      style={{
        position: 'relative', flex: 1, borderRadius: 16,
        overflow: 'hidden', transition: 'all 0.2s',
        minHeight: isMobile ? 0 : 260,
        height: isMobile ? '100%' : undefined,
        background: dragOver ? theme.sandboxBgHover : theme.sandboxBg,
        border: dragOver
          ? `1.5px dashed ${theme.sandboxBorderHover}`
          : `1.5px dashed ${theme.sandboxBorder}`,
        boxShadow: dragOver
          ? `inset 0 0 40px ${theme.accent}0e`
          : `inset 0 0 30px rgba(0,0,0,0.015)`,
      }}
    >
      {/* Floating seashells (light) / fish (dark) */}
      {BUBBLES.map((bubble, i) => (
        <div
          key={i}
          className="absolute pointer-events-none animate-float-triangle"
          style={{
            left: `${bubble.left}%`,
            top: `${bubble.top}%`,
            opacity: theme.isDark ? 0.28 : 0.35,
            animationDuration: `${bubble.duration}s`,
            animationDelay: `${bubble.delay}s`,
          }}
        >
          {theme.isDark
            ? <FishIcon size={bubble.size} color={bubble.color} variant={bubble.variant} flip={bubble.flip} />
            : <SeashellIcon size={bubble.size} color={bubble.color} variant={bubble.variant} flip={bubble.flip} />
          }
        </div>
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
          {/* ── Palayok — dark glazed clay pot with lid, matching real San Juan palayok ── */}
          {(() => {
            // Light mode: black tones  |  Dark mode: light brown tones
            const potBase  = theme.isDark ? '#C49A6C' : '#0A0A0A';
            const potRim   = theme.isDark ? '#D4AA7A' : '#1A1A1A';
            const potInner = theme.isDark ? '#8C6A40' : '#000000';
            return (
              <svg width="120" height="120" viewBox="0 0 120 108" fill="none" style={{ opacity: theme.isDark ? 0.92 : 0.72 }}>
                <defs>
                  <clipPath id="lid-clip">
                    <path d="M22,47 Q22,28 60,26 Q98,28 98,47 Z"/>
                  </clipPath>
                  <clipPath id="body-clip">
                    <path d="M22,47 Q8,56 8,68 Q8,88 60,88 Q112,88 112,68 Q112,56 98,47 Z"/>
                  </clipPath>
                </defs>

                {/* ── Ground shadow ── */}
                <ellipse cx="60" cy="92" rx="36" ry="6" fill="black" opacity="0.32"/>

                {/* ── Karagatan waves below pot ── */}
                <path d="M4,100 C15,95 26,105 37,100 C48,95 59,105 70,100 C79,96 88,102 106,100" stroke={theme.accent} strokeWidth="1.3" strokeLinecap="round" opacity="0.65"/>
                <path d="M8,108 C19,103 30,113 41,108 C52,103 63,113 74,108 C83,105 91,110 108,108" stroke={theme.accent} strokeWidth="0.9" strokeLinecap="round" opacity="0.35"/>

                {/* ═══════════════════════════════════
                    BODY — wide squat belly, flares outward
                    ═══════════════════════════════════ */}
                {/* Body base */}
                <path d="M22,47 Q8,56 8,68 Q8,88 60,88 Q112,88 112,68 Q112,56 98,47 Z" fill={potBase}/>
                {/* Body right shadow — deepens the round form */}
                <path d="M72,47 Q96,53 112,68 Q112,86 82,88 L60,88 Q88,86 94,70 Q100,56 72,47 Z"
                  fill="black" opacity="0.38" clipPath="url(#body-clip)"/>
                {/* Body left highlight — light source upper-left */}
                <path d="M22,47 Q9,55 9,63 Q11,55 20,50 Q30,46 46,45 Z"
                  fill="white" opacity="0.14" clipPath="url(#body-clip)"/>
                {/* Specular highlight — bright oval upper-left */}
                <ellipse cx="34" cy="57" rx="10" ry="7" fill="white" opacity="0.12" transform="rotate(-25 34 57)"/>

                {/* Wheel-thrown ring grooves — follow the curvature */}
                <path d="M16,57 Q60,52 104,57" stroke="white" strokeWidth="0.9" strokeLinecap="round" opacity="0.18"/>
                <path d="M10,67 Q60,62 110,67" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.14"/>
                <path d="M11,77 Q60,72 109,77" stroke="white" strokeWidth="0.7" strokeLinecap="round" opacity="0.1"/>
                {/* Right-side ring shadow — ring disappears into shadow zone */}
                <path d="M88,57 Q103,59 104,57" stroke="black" strokeWidth="1" strokeLinecap="round" opacity="0.22"/>
                <path d="M92,67 Q108,69 110,67" stroke="black" strokeWidth="0.8" strokeLinecap="round" opacity="0.18"/>

                {/* ═══════════════════════════════════
                    RIM LEDGE — where lid rests on body
                    ═══════════════════════════════════ */}
                {/* Rim ring — slightly wider than neck, forms the ledge */}
                <ellipse cx="60" cy="47" rx="38" ry="8" fill={potRim}/>
                {/* Rim top face — catches light */}
                <path d="M22,47 Q60,41 98,47" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.22"/>
                {/* Rim inner edge — dark shadow into body opening */}
                <ellipse cx="60" cy="47" rx="28" ry="5" fill={potInner}/>

                {/* ═══════════════════════════════════
                    LID — domed, sits on rim ledge
                    ═══════════════════════════════════ */}
                {/* Lid dome base */}
                <path d="M22,47 Q22,28 60,26 Q98,28 98,47 Z" fill={potBase}/>
                {/* Lid right shadow */}
                <path d="M74,27 Q96,33 98,47 L86,47 Q88,35 74,27 Z"
                  fill="black" opacity="0.32" clipPath="url(#lid-clip)"/>
                {/* Lid left highlight */}
                <path d="M22,47 Q22,34 30,29 Q24,34 23,44 Z"
                  fill="white" opacity="0.13" clipPath="url(#lid-clip)"/>
                {/* Lid specular */}
                <ellipse cx="38" cy="36" rx="9" ry="6" fill="white" opacity="0.1" transform="rotate(-20 38 36)"/>
                {/* Lid ring groove */}
                <path d="M26,42 Q60,38 94,42" stroke="white" strokeWidth="0.7" strokeLinecap="round" opacity="0.15"/>
                {/* Lid bottom edge — where it meets the rim */}
                <path d="M22,47 Q60,44 98,47" stroke={potInner} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>

                {/* ═══════════════════════════════════
                    KNOB — small dome handle on lid
                    ═══════════════════════════════════ */}
                {/* Knob base / stem */}
                <ellipse cx="60" cy="26" rx="9" ry="4" fill={potRim}/>
                {/* Knob dome */}
                <path d="M51,26 Q51,18 60,16 Q69,18 69,26 Z" fill={potBase}/>
                {/* Knob dome right shadow */}
                <path d="M64,17 Q69,20 69,26 L66,26 Q67,21 64,17 Z" fill="black" opacity="0.3"/>
                {/* Knob dome highlight */}
                <path d="M52,26 Q52,20 56,17 Q52,21 52,25 Z" fill="white" opacity="0.18"/>
                {/* Knob specular */}
                <ellipse cx="56" cy="20" rx="2.5" ry="1.8" fill="white" opacity="0.22" transform="rotate(-20 56 20)"/>
                {/* Knob base rim highlight */}
                <path d="M51,26 Q60,23 69,26" stroke="white" strokeWidth="0.7" strokeLinecap="round" opacity="0.2"/>
              </svg>
            );
          })()}

          {isMobile ? (
            <>
              <p style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, fontSize: 14, color: theme.textTertiary, fontStyle: 'italic' }}>Lab is empty</p>
              <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 10, padding: '9px 18px', textAlign: 'center', maxWidth: 230, boxShadow: theme.shadow, marginTop: 4 }}>
                <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: theme.textSecondary, lineHeight: 1.5 }}>
                  Open the <span style={{ color: theme.accent, fontWeight: 600 }}>Guide</span> tab and tap an element to begin.
                </p>
              </div>
            </>
          ) : (
            <>
              <p style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, fontSize: 16, color: theme.textTertiary, fontStyle: 'italic', letterSpacing: '-0.01em' }}>Drag atoms here</p>
              <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: theme.textTertiary, opacity: 0.7, marginTop: 2, letterSpacing: '0.01em' }}>Double-click a placed atom to remove it</p>
            </>
          )}
        </div>
      )}

      <BondLines atoms={state.placedAtoms} bonds={state.bonds} />
      {state.placedAtoms.map(atom => <SandboxAtom key={atom.id} atom={atom} />)}

      {/* Formula overlay */}
      {state.formula && (
        <div
          style={{
            position: 'absolute', bottom: 14, left: '50%',
            transform: 'translateX(-50%)',
            padding: '7px 22px', borderRadius: 10, zIndex: 10,
            fontFamily: '"Playfair Display", serif',
            fontSize: 17, fontWeight: 700, fontStyle: 'italic',
            color: theme.accent,
            letterSpacing: '0.02em',
            background: theme.formulaBg,
            border: `1px solid ${theme.formulaBorder}`,
            boxShadow: theme.shadowLg,
            whiteSpace: 'nowrap',
          }}
        >
          {state.formula}
        </div>
      )}
    </div>
  );
}
