import { useState, useEffect, useRef } from 'react';
import { RotateCcw, ClipboardList, BookOpen, FlaskConical, LayoutGrid, Atom, Menu, X, Sun, Moon, Beaker } from 'lucide-react';
import { useApp } from '../../shared/store/context';
import { useTheme } from '../../shared/store/theme';
import { ElementsPanel } from '../periodic-table/ElementsPanel';
import { BondingsPanel } from '../bondings/BondingsPanel';
import { useToast } from '../../App';

interface HeaderProps {
  activeTab?: 'lab' | 'guide' | 'molecules';
  onTabChange?: (tab: 'lab' | 'guide' | 'molecules') => void;
  isMobile?: boolean;
  isTablet?: boolean;
  tabletPanel?: 'none' | 'guide' | 'molecules';
  onTabletPanelChange?: (panel: 'none' | 'guide' | 'molecules') => void;
}

export function Header({ activeTab, onTabChange, isMobile, isTablet, tabletPanel, onTabletPanelChange }: HeaderProps) {
  const { state, dispatch } = useApp();
  const { theme, mode, toggleTheme } = useTheme();
  const [showElements, setShowElements] = useState(false);
  const [showBondings, setShowBondings] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const showToast = useToast();

  const BTN_BASE: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 6,
    borderRadius: 10, cursor: 'pointer', whiteSpace: 'nowrap',
    fontFamily: '"Playfair Display", sans-serif', fontWeight: 700,
    letterSpacing: '0.02em', transition: 'all 0.2s',
    background: theme.surface, border: `1px solid ${theme.border}`, color: theme.accent,
    fontSize: 13,
  };

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

  const btnPad  = isTablet ? '7px 12px' : '8px 16px';
  const iconSz  = 15;

  const menuItem = (active = false, danger = false): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: 10,
    width: '100%', padding: '12px 16px', cursor: 'pointer',
    fontFamily: '"Playfair Display", sans-serif', fontWeight: 700,
    fontSize: 13, letterSpacing: '0.02em',
    background: active ? theme.accentBg : 'transparent',
    border: 'none',
    borderBottom: `1px solid ${theme.borderLight}`,
    color: danger ? theme.dangerText : active ? theme.accent : theme.textSecondary,
    transition: 'background 0.15s',
  });

  return (
    <>
      <div
        className="flex shrink-0 relative"
        style={{
          background: theme.surface,
          borderBottom: `1px solid ${theme.border}`,
          flexDirection: 'column',
          boxShadow: theme.shadow,
        }}
      >
        {/* Main row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: isMobile ? '10px 14px' : isTablet ? '10px 18px' : '12px 28px',
          gap: 12, position: 'relative', zIndex: 2,
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 12, flexShrink: 0 }}>
            <div style={{
              width: isMobile ? 34 : 42, height: isMobile ? 34 : 42,
              borderRadius: isMobile ? 10 : 14,
              background: theme.accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 2px 10px ${theme.accent}50`,
              border: `1px solid ${theme.accentDark}`,
            }}>
              {/* Palayok (clay pot) icon */}
              <svg width={isMobile ? 18 : 22} height={isMobile ? 18 : 22} viewBox="0 0 22 24" fill="none">
                <ellipse cx="11" cy="6" rx="5" ry="1.6" fill="white" opacity="0.95"/>
                <path d="M6,6 L5.5,9 Q5,9.5 5.5,10 L16.5,10 Q17,9.5 16.5,9 L16,6" fill="white" opacity="0.9"/>
                <path d="M5.5,10 Q2,13 2,17 Q2,22 11,22 Q20,22 20,17 Q20,13 16.5,10 Z" fill="white"/>
                <path d="M4.5,15 Q11,13.5 17.5,15" stroke={theme.accent} strokeWidth="0.7" strokeLinecap="round"/>
                <path d="M3.5,18.5 Q11,17 18.5,18.5" stroke={theme.accent} strokeWidth="0.6" strokeLinecap="round" opacity="0.6"/>
              </svg>
            </div>
            <div>
              <p style={{
                fontFamily: '"Playfair Display", serif', fontWeight: 800, color: theme.logoText,
                fontSize: isMobile ? 15 : isTablet ? 18 : 21,
                letterSpacing: '0em', lineHeight: 1.15,
              }}>
                SciLab <em style={{ fontStyle: 'italic', fontWeight: 400 }}>360</em>
              </p>
              <p style={{
                fontFamily: '"DM Sans", sans-serif', fontSize: isMobile ? 9 : 10,
                color: theme.subtitleText, letterSpacing: '0.06em', lineHeight: 1,
                fontWeight: 400, textTransform: 'uppercase',
              }}>
                Interactive Chemistry Lab
              </p>
            </div>
          </div>

          {/* MOBILE: hamburger */}
          {isMobile ? (
            <div ref={menuRef} style={{ position: 'relative', zIndex: 100 }}>
              <button
                onClick={() => setMenuOpen(o => !o)}
                style={{
                  ...BTN_BASE,
                  padding: '8px 10px',
                  background: menuOpen ? theme.accentBg : theme.surface,
                  border: menuOpen ? `1px solid ${theme.accent}` : `1px solid ${theme.border}`,
                  color: menuOpen ? theme.accent : theme.textSecondary,
                }}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              {menuOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  width: 220,
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 14,
                  boxShadow: theme.shadowLg,
                  overflow: 'hidden',
                  zIndex: 200,
                }}>
                  <div style={{ padding: '10px 16px', background: theme.accentBg, borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: '"Playfair Display", sans-serif', fontSize: 11, color: theme.accent, letterSpacing: '0.05em', fontWeight: 700 }}>LEVEL {state.level}</span>
                    <span style={{ fontFamily: '"Playfair Display", sans-serif', fontSize: 13, fontWeight: 800, color: theme.accent }}>
                      {state.score} pts
                    </span>
                  </div>

                  <button style={menuItem(false)}
                    onClick={() => { setShowBondings(true); setMenuOpen(false); }}>
                    <Beaker size={16} /> Bondings
                  </button>

                  <button style={menuItem(false)}
                    onClick={() => { setShowElements(true); setMenuOpen(false); }}>
                    <BookOpen size={16} /> Elements
                  </button>

                  <button style={menuItem(false)}
                    onClick={() => { toggleTheme(); setMenuOpen(false); }}>
                    {mode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </button>

                  <button style={menuItem(state.showTeacherDash)}
                    onClick={() => { dispatch({ type: 'TOGGLE_TEACHER' }); setMenuOpen(false); }}>
                    <ClipboardList size={16} /> My Progress
                  </button>

                  <button style={{ ...menuItem(false, true), borderBottom: 'none' }}
                    onClick={() => { dispatch({ type: 'CLEAR_SANDBOX' }); setMenuOpen(false); }}>
                    <RotateCcw size={16} /> Clear Lab
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* DESKTOP / TABLET buttons */
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 12, color: theme.statText, whiteSpace: 'nowrap', background: theme.statBg, padding: '4px 10px', borderRadius: 8 }}>
                {state.placedAtoms.length} atom{state.placedAtoms.length !== 1 ? 's' : ''} &middot; {state.bonds.length} bond{state.bonds.length !== 1 ? 's' : ''}
              </span>

              {/* Dark/Light toggle */}
              <button onClick={toggleTheme}
                style={{ ...BTN_BASE, padding: btnPad }}
                onMouseEnter={e => { const b = e.currentTarget; b.style.background = theme.surfaceHover; b.style.borderColor = theme.accent; }}
                onMouseLeave={e => { const b = e.currentTarget; b.style.background = theme.surface; b.style.borderColor = theme.border; }}>
                {mode === 'dark' ? <Sun size={iconSz} /> : <Moon size={iconSz} />}
              </button>

              <button onClick={() => setShowBondings(true)}
                style={{ ...BTN_BASE, padding: btnPad }}
                onMouseEnter={e => { const b = e.currentTarget; b.style.background = theme.surfaceHover; b.style.borderColor = theme.accent; }}
                onMouseLeave={e => { const b = e.currentTarget; b.style.background = theme.surface; b.style.borderColor = theme.border; }}>
                <Beaker size={iconSz} /> Bondings
              </button>

              <button onClick={() => setShowElements(true)}
                style={{ ...BTN_BASE, padding: btnPad }}
                onMouseEnter={e => { const b = e.currentTarget; b.style.background = theme.surfaceHover; b.style.borderColor = theme.accent; }}
                onMouseLeave={e => { const b = e.currentTarget; b.style.background = theme.surface; b.style.borderColor = theme.border; }}>
                <BookOpen size={iconSz} /> Elements
              </button>

              <button onClick={() => dispatch({ type: 'CLEAR_SANDBOX' })}
                style={{ ...BTN_BASE, padding: btnPad, color: theme.dangerText, border: `1px solid ${theme.dangerBorder}` }}
                onMouseEnter={e => { e.currentTarget.style.background = theme.dangerBg; e.currentTarget.style.borderColor = theme.dangerText; }}
                onMouseLeave={e => { e.currentTarget.style.background = theme.surface; e.currentTarget.style.borderColor = theme.dangerBorder; }}>
                <RotateCcw size={iconSz} /> Clear
              </button>

              {isTablet && onTabletPanelChange && (
                <>
                  <button onClick={() => onTabletPanelChange(tabletPanel === 'guide' ? 'none' : 'guide')}
                    style={{ ...BTN_BASE, padding: btnPad, background: tabletPanel === 'guide' ? theme.accentBg : theme.surface, border: tabletPanel === 'guide' ? `1px solid ${theme.accent}` : `1px solid ${theme.border}`, color: tabletPanel === 'guide' ? theme.accent : theme.textSecondary }}>
                    <LayoutGrid size={iconSz} /> Guide
                  </button>
                  <button onClick={() => onTabletPanelChange(tabletPanel === 'molecules' ? 'none' : 'molecules')}
                    style={{ ...BTN_BASE, padding: btnPad, background: tabletPanel === 'molecules' ? theme.accentBg : theme.surface, border: tabletPanel === 'molecules' ? `1px solid ${theme.accent}` : `1px solid ${theme.border}`, color: tabletPanel === 'molecules' ? theme.accent : theme.textSecondary }}>
                    <Atom size={iconSz} /> Molecules
                  </button>
                </>
              )}



              <button onClick={() => dispatch({ type: 'TOGGLE_TEACHER' })}
                style={{ ...BTN_BASE, padding: btnPad, background: state.showTeacherDash ? theme.accent : theme.surface, border: state.showTeacherDash ? `1px solid ${theme.accentDark}` : `1px solid ${theme.border}`, color: state.showTeacherDash ? '#ffffff' : theme.textSecondary }}>
                <ClipboardList size={iconSz} /> My Progress
              </button>
            </div>
          )}
        </div>

        {/* Karagatan wave — bottom decoration */}
        {!isMobile && (
          <svg
            style={{ display: 'block', width: '100%', height: 7, position: 'relative', zIndex: 1, marginTop: -1 }}
            viewBox="0 0 900 7"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d="M0,3.5 C30,0.5 60,6.5 90,3.5 C120,0.5 150,6.5 180,3.5 C210,0.5 240,6.5 270,3.5 C300,0.5 330,6.5 360,3.5 C390,0.5 420,6.5 450,3.5 C480,0.5 510,6.5 540,3.5 C570,0.5 600,6.5 630,3.5 C660,0.5 690,6.5 720,3.5 C750,0.5 780,6.5 810,3.5 C840,0.5 870,6.5 900,3.5"
              stroke={theme.accentBorder}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d="M0,5.5 C30,2.5 60,8.5 90,5.5 C120,2.5 150,8.5 180,5.5 C210,2.5 240,8.5 270,5.5 C300,2.5 330,8.5 360,5.5 C390,2.5 420,8.5 450,5.5 C480,2.5 510,8.5 540,5.5 C570,2.5 600,8.5 630,5.5 C660,2.5 690,8.5 720,5.5 C750,2.5 780,8.5 810,5.5 C840,2.5 870,8.5 900,5.5"
              stroke={theme.accentBorder}
              strokeWidth="0.6"
              strokeLinecap="round"
              opacity="0.45"
            />
          </svg>
        )}

        {/* Mobile tab bar */}
        {isMobile && onTabChange && (
          <div style={{ display: 'flex', gap: 6, borderTop: `1px solid ${theme.border}`, padding: '6px 12px', background: theme.surfaceAlt }}>
            {([
              { id: 'lab',       label: 'Lab',       Icon: FlaskConical },
              { id: 'guide',     label: 'Guide',     Icon: LayoutGrid },
              { id: 'molecules', label: 'Molecules', Icon: Atom },
            ] as const).map(({ id, label, Icon }) => (
              <button key={id} onClick={() => onTabChange(id)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  padding: '8px 0', borderRadius: 10, cursor: 'pointer',
                  fontFamily: '"Playfair Display", sans-serif', fontSize: 12, fontWeight: 700,
                  transition: 'all 0.2s',
                  background: activeTab === id ? theme.accent : 'transparent',
                  border: activeTab === id ? `1px solid ${theme.accentDark}` : '1px solid transparent',
                  color: activeTab === id ? '#ffffff' : theme.textTertiary,
                }}>
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {showElements && <ElementsPanel onClose={() => setShowElements(false)} onToast={showToast} />}
      {showBondings && <BondingsPanel onClose={() => setShowBondings(false)} />}
    </>
  );
}
