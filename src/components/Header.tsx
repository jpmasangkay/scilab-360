import { useState, useEffect, useRef } from 'react';
import { RotateCcw, ClipboardList, BookOpen, FlaskConical, LayoutGrid, Atom, Menu, X, Sun, Moon, Beaker } from 'lucide-react';
import { useApp } from '../store/context';
import { useTheme } from '../store/theme';
import { ElementsPanel } from './ElementsPanel';
import { BondingsPanel } from './BondingsPanel';
import { useToast } from '../App';

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
    fontFamily: '"Nunito", sans-serif', fontWeight: 700,
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
    fontFamily: '"Nunito", sans-serif', fontWeight: 700,
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{
              width: isMobile ? 34 : 42, height: isMobile ? 34 : 42,
              borderRadius: 12, background: theme.accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 2px 8px ${theme.accent}40`,
            }}>
              <FlaskConical size={isMobile ? 18 : 22} color="#ffffff" strokeWidth={2.5} />
            </div>
            <div>
              <p style={{
                fontFamily: '"Nunito", sans-serif', fontWeight: 900, color: theme.logoText,
                fontSize: isMobile ? 16 : isTablet ? 18 : 22,
                letterSpacing: '-0.01em', lineHeight: 1.2,
              }}>
                SciLab 360
              </p>
              <p style={{
                fontFamily: '"Inter", sans-serif', fontSize: isMobile ? 9 : 11,
                color: theme.subtitleText, letterSpacing: '0.02em', lineHeight: 1, fontWeight: 500,
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
                    <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 11, color: theme.accent, letterSpacing: '0.05em', fontWeight: 700 }}>LEVEL {state.level}</span>
                    <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 13, fontWeight: 800, color: theme.accent }}>
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
                  fontFamily: '"Nunito", sans-serif', fontSize: 12, fontWeight: 700,
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
