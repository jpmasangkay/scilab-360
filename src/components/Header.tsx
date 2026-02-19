import { useState, useEffect, useRef } from 'react';
import { RotateCcw, ClipboardList, BookOpen, FlaskConical, LayoutGrid, Atom, Menu, X } from 'lucide-react';
import { useApp } from '../store/context';
import { ElementsPanel } from './ElementsPanel';
import { useToast } from '../App';

interface HeaderProps {
  activeTab?: 'lab' | 'guide' | 'molecules';
  onTabChange?: (tab: 'lab' | 'guide' | 'molecules') => void;
  isMobile?: boolean;
  isTablet?: boolean;
  tabletPanel?: 'none' | 'guide' | 'molecules';
  onTabletPanelChange?: (panel: 'none' | 'guide' | 'molecules') => void;
}

const BTN_BASE: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6,
  borderRadius: 8, cursor: 'pointer', whiteSpace: 'nowrap',
  fontFamily: '"Share Tech Mono", monospace', fontWeight: 700,
  letterSpacing: '0.05em', transition: 'all 0.15s',
  background: '#1e0b3e', border: '1px solid #4c1d95', color: '#c084fc',
};

export function Header({ activeTab, onTabChange, isMobile, isTablet, tabletPanel, onTabletPanelChange }: HeaderProps) {
  const { state, dispatch } = useApp();
  const [showElements, setShowElements] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const showToast = useToast();

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handle = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [menuOpen]);

  const btnPad  = isTablet ? '6px 11px' : '8px 16px';
  const btnSize = isTablet ? 11 : 13;
  const iconSz  = 13;

  // Mobile menu item style
  const menuItem = (active = false, danger = false): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: 10,
    width: '100%', padding: '12px 16px', cursor: 'pointer',
    fontFamily: '"Share Tech Mono", monospace', fontWeight: 700,
    fontSize: 13, letterSpacing: '0.06em',
    background: active ? '#2d1263' : 'transparent',
    border: 'none',
    borderBottom: '1px solid #1e0b3e',
    color: danger ? '#f87171' : active ? '#e9d5ff' : '#c084fc',
    transition: 'background 0.15s',
  });

  return (
    <>
      <div
        className="flex shrink-0 relative border-b border-[#4c1d95]"
        style={{
          background: 'linear-gradient(90deg, #0d0120 0%, #1a0533 40%, #200040 100%)',
          flexDirection: 'column',
        }}
      >
        {/* Twinkling dots */}
        {[10, 25, 60, 80, 92].map((left, i) => {
          const tops = [20, 70, 30, 60, 25];
          const sizes = [2, 3, 2, 3, 2];
          const durations = [1.8, 2.4, 1.5, 2.1, 1.9];
          return (
            <div key={i} className="absolute rounded-full bg-[#c084fc] opacity-30 pointer-events-none animate-twinkle"
              style={{ left: `${left}%`, top: `${tops[i]}%`, width: sizes[i], height: sizes[i], animationDuration: `${durations[i]}s` }} />
          );
        })}

        {/* ── Main row ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: isMobile ? '10px 12px' : isTablet ? '10px 16px' : '14px 28px',
          gap: 12, position: 'relative', zIndex: 2,
        }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <span style={{ fontSize: isMobile ? 22 : isTablet ? 24 : 30, filter: 'drop-shadow(0 0 10px #a855f7)', lineHeight: 1 }}>⚛</span>
            <div>
              <p style={{
                fontFamily: 'Orbitron, monospace', fontWeight: 900, color: '#fff',
                fontSize: isMobile ? 14 : isTablet ? 16 : 20,
                letterSpacing: isMobile ? '2px' : '4px',
                textShadow: '0 0 20px #a855f780', lineHeight: 1.2,
              }}>
                SCILAB 360
              </p>
              <p style={{
                fontFamily: '"Share Tech Mono", monospace', fontSize: isMobile ? 8 : 11,
                color: '#c084fc', letterSpacing: isMobile ? '2px' : '3px', lineHeight: 1,
              }}>
                INTERACTIVE CHEMISTRY LAB
              </p>
            </div>
          </div>

          {/* ── MOBILE: hamburger ── */}
          {isMobile ? (
            <div ref={menuRef} style={{ position: 'relative', zIndex: 100 }}>
              <button
                onClick={() => setMenuOpen(o => !o)}
                style={{
                  ...BTN_BASE,
                  padding: '8px 10px',
                  background: menuOpen ? '#3b0764' : '#1e0b3e',
                  border: menuOpen ? '1px solid #a855f7' : '1px solid #4c1d95',
                  color: menuOpen ? '#e9d5ff' : '#c084fc',
                  boxShadow: menuOpen ? '0 0 12px #a855f760' : 'none',
                }}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              {/* Dropdown */}
              {menuOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  width: 220,
                  background: '#0d0120',
                  border: '1px solid #4c1d95',
                  borderRadius: 12,
                  boxShadow: '0 8px 32px #00000090, 0 0 20px #a855f730',
                  overflow: 'hidden',
                  zIndex: 200,
                }}>
                  {/* Score pill at top */}
                  <div style={{ padding: '10px 16px', background: '#130929', borderBottom: '1px solid #2d1b5e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'Orbitron, monospace', fontSize: 10, color: '#a78bfa', letterSpacing: '0.1em' }}>LEVEL {state.level}</span>
                    <span style={{ fontFamily: 'Orbitron, monospace', fontSize: 12, fontWeight: 700, color: '#e9d5ff' }}>⭐ {state.score} pts</span>
                  </div>

                  <button style={menuItem(false)}
                    onClick={() => { setShowElements(true); setMenuOpen(false); }}>
                    <BookOpen size={16} /> ELEMENTS
                  </button>

                  <button style={menuItem(state.showTeacherDash)}
                    onClick={() => { dispatch({ type: 'TOGGLE_TEACHER' }); setMenuOpen(false); }}>
                    <ClipboardList size={16} /> MY PROGRESS
                  </button>

                  <button style={{ ...menuItem(false, true), borderBottom: 'none' }}
                    onClick={() => { dispatch({ type: 'CLEAR_SANDBOX' }); setMenuOpen(false); }}>
                    <RotateCcw size={16} /> CLEAR LAB
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ── DESKTOP / TABLET: original buttons ── */
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: btnSize, color: '#a855f7', whiteSpace: 'nowrap' }}>
                {state.placedAtoms.length} atom{state.placedAtoms.length !== 1 ? 's' : ''} · {state.bonds.length} bond{state.bonds.length !== 1 ? 's' : ''}
              </span>

              <button onClick={() => setShowElements(true)}
                style={{ ...BTN_BASE, padding: btnPad, fontSize: btnSize }}
                onMouseEnter={e => { const b = e.currentTarget; b.style.background = '#2d1263'; b.style.borderColor = '#a855f7'; }}
                onMouseLeave={e => { const b = e.currentTarget; b.style.background = '#1e0b3e'; b.style.borderColor = '#4c1d95'; }}>
                <BookOpen size={iconSz} /> ELEMENTS
              </button>

              <button onClick={() => dispatch({ type: 'CLEAR_SANDBOX' })}
                style={{ ...BTN_BASE, padding: btnPad, fontSize: btnSize }}
                onMouseEnter={e => { (e.currentTarget).style.boxShadow = '0 0 12px #a855f740'; }}
                onMouseLeave={e => { (e.currentTarget).style.boxShadow = 'none'; }}>
                <RotateCcw size={iconSz} /> CLEAR
              </button>

              {isTablet && onTabletPanelChange && (
                <>
                  <button onClick={() => onTabletPanelChange(tabletPanel === 'guide' ? 'none' : 'guide')}
                    style={{ ...BTN_BASE, padding: btnPad, fontSize: btnSize, background: tabletPanel === 'guide' ? '#3b0764' : '#1e0b3e', border: tabletPanel === 'guide' ? '1px solid #a855f7' : '1px solid #4c1d95', color: tabletPanel === 'guide' ? '#e9d5ff' : '#c084fc' }}>
                    <LayoutGrid size={iconSz} /> GUIDE
                  </button>
                  <button onClick={() => onTabletPanelChange(tabletPanel === 'molecules' ? 'none' : 'molecules')}
                    style={{ ...BTN_BASE, padding: btnPad, fontSize: btnSize, background: tabletPanel === 'molecules' ? '#3b0764' : '#1e0b3e', border: tabletPanel === 'molecules' ? '1px solid #a855f7' : '1px solid #4c1d95', color: tabletPanel === 'molecules' ? '#e9d5ff' : '#c084fc' }}>
                    <Atom size={iconSz} /> MOLECULES
                  </button>
                </>
              )}

              <button onClick={() => dispatch({ type: 'TOGGLE_TEACHER' })}
                style={{ ...BTN_BASE, padding: btnPad, fontSize: btnSize, background: state.showTeacherDash ? '#3b0764' : '#1e0b3e', border: state.showTeacherDash ? '1px solid #a855f7' : '1px solid #4c1d95', color: state.showTeacherDash ? '#e9d5ff' : '#c084fc', boxShadow: state.showTeacherDash ? '0 0 12px #a855f760' : 'none' }}>
                <ClipboardList size={iconSz} /> MY PROGRESS
              </button>
            </div>
          )}
        </div>

        {/* ── Mobile tab bar (second row) ── */}
        {isMobile && onTabChange && (
          <div style={{ display: 'flex', gap: 6, borderTop: '1px solid #2d1b5e', padding: '8px 12px' }}>
            {([
              { id: 'lab',       label: 'LAB',       Icon: FlaskConical },
              { id: 'guide',     label: 'GUIDE',     Icon: LayoutGrid },
              { id: 'molecules', label: 'MOLECULES', Icon: Atom },
            ] as const).map(({ id, label, Icon }) => (
              <button key={id} onClick={() => onTabChange(id)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  padding: '7px 0', borderRadius: 8, cursor: 'pointer',
                  fontFamily: '"Share Tech Mono", monospace', fontSize: 11,
                  letterSpacing: '0.05em', transition: 'all 0.15s',
                  background: activeTab === id ? '#3b0764' : '#1e0b3e',
                  border: activeTab === id ? '1px solid #a855f7' : '1px solid #2d1b5e',
                  color: activeTab === id ? '#e9d5ff' : '#6b4dcc',
                  boxShadow: activeTab === id ? '0 0 10px #a855f740' : 'none',
                }}>
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {showElements && <ElementsPanel onClose={() => setShowElements(false)} onToast={showToast} />}
    </>
  );
}
