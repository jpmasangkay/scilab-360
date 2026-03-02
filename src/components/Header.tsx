import { useState, useEffect, useRef } from 'react';
import { RotateCcw, ClipboardList, BookOpen, FlaskConical, LayoutGrid, Atom, Menu, X, Moon, Sun } from 'lucide-react';
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
  borderRadius: 10, cursor: 'pointer', whiteSpace: 'nowrap',
  fontFamily: '"Nunito", sans-serif', fontWeight: 700,
  letterSpacing: '0.02em', transition: 'all 0.2s',
  background: '#ffffff', border: '1px solid #e2e8f0', color: '#0f766e',
  fontSize: 13,
};

export function Header({ activeTab, onTabChange, isMobile, isTablet, tabletPanel, onTabletPanelChange }: HeaderProps) {
  const { state, dispatch } = useApp();
  const [showElements, setShowElements] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const showToast = useToast();

  const isDark = state.theme === 'dark';
  const headerBg = isDark ? '#1e293b' : '#ffffff';
  const headerBorder = isDark ? '#334155' : '#e2e8f0';
  const textPrimary = isDark ? '#e2e8f0' : '#0f172a';
  const textSecondary = isDark ? '#94a3b8' : '#64748b';
  const btnBg = isDark ? '#334155' : '#ffffff';
  const btnHoverBg = isDark ? '#475569' : '#f0fdfa';
  const menuBg = isDark ? '#1e293b' : '#ffffff';
  const menuBorder = isDark ? '#334155' : '#e2e8f0';
  const activeColor = '#14b8a6';

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
    background: active ? btnHoverBg : 'transparent',
    border: 'none',
    borderBottom: `1px solid ${menuBorder}`,
    color: danger ? '#ef4444' : active ? activeColor : textSecondary,
    transition: 'background 0.15s',
  });

  return (
    <>
      <div
        className="flex shrink-0 relative"
        style={{
          background: headerBg,
          borderBottom: `1px solid ${headerBorder}`,
          flexDirection: 'column',
          boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.05)',
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
              borderRadius: 12, background: '#14b8a6',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(20,184,166,0.3)',
            }}>
              <FlaskConical size={isMobile ? 18 : 22} color="#ffffff" strokeWidth={2.5} />
            </div>
            <div>
              <p style={{
                fontFamily: '"Nunito", sans-serif', fontWeight: 900, color: textPrimary,
                fontSize: isMobile ? 16 : isTablet ? 18 : 22,
                letterSpacing: '-0.01em', lineHeight: 1.2,
              }}>
                SciLab 360
              </p>
              <p style={{
                fontFamily: '"Inter", sans-serif', fontSize: isMobile ? 9 : 11,
                color: textSecondary, letterSpacing: '0.02em', lineHeight: 1, fontWeight: 500,
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
                  background: menuOpen ? btnHoverBg : btnBg,
                  border: menuOpen ? `1px solid ${activeColor}` : `1px solid ${headerBorder}`,
                  color: menuOpen ? activeColor : textSecondary,
                }}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              {menuOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  width: 220,
                  background: menuBg,
                  border: `1px solid ${menuBorder}`,
                  borderRadius: 14,
                  boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(0,0,0,0.12)',
                  overflow: 'hidden',
                  zIndex: 200,
                }}>
                  <div style={{ padding: '10px 16px', background: btnHoverBg, borderBottom: `1px solid ${menuBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 11, color: activeColor, letterSpacing: '0.05em', fontWeight: 700 }}>LEVEL {state.level}</span>
                    <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 13, fontWeight: 800, color: activeColor }}>{state.score} pts</span>
                  </div>

                  <button style={menuItem(false)}
                    onClick={() => { setShowElements(true); setMenuOpen(false); }}>
                    <BookOpen size={16} /> Elements
                  </button>

                  <button style={menuItem(state.showTeacherDash)}
                    onClick={() => { dispatch({ type: 'TOGGLE_TEACHER' }); setMenuOpen(false); }}>
                    <ClipboardList size={16} /> My Progress
                  </button>

                  <button style={menuItem(false)}
                    onClick={() => { dispatch({ type: 'TOGGLE_THEME' }); setMenuOpen(false); }}>
                    {isDark ? <Sun size={16} /> : <Moon size={16} />} Theme
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
              <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 12, color: textSecondary, whiteSpace: 'nowrap', background: isDark ? '#334155' : '#f1f5f9', padding: '4px 10px', borderRadius: 8 }}>
                {state.placedAtoms.length} atom{state.placedAtoms.length !== 1 ? 's' : ''} &middot; {state.bonds.length} bond{state.bonds.length !== 1 ? 's' : ''}
              </span>

              <button onClick={() => setShowElements(true)}
                style={{ ...BTN_BASE, padding: btnPad, background: btnBg, borderColor: headerBorder, color: textSecondary }}
                onMouseEnter={e => { const b = e.currentTarget; b.style.background = btnHoverBg; b.style.borderColor = activeColor; b.style.color = activeColor; }}
                onMouseLeave={e => { const b = e.currentTarget; b.style.background = btnBg; b.style.borderColor = headerBorder; b.style.color = textSecondary; }}>
                <BookOpen size={iconSz} /> Elements
              </button>

              <button onClick={() => dispatch({ type: 'CLEAR_SANDBOX' })}
                style={{ ...BTN_BASE, padding: btnPad, color: '#ef4444', border: `1px solid ${isDark ? '#7f1d1d' : '#fecaca'}`, background: btnBg }}
                onMouseEnter={e => { e.currentTarget.style.background = isDark ? '#7f1d1d' : '#fef2f2'; e.currentTarget.style.borderColor = '#ef4444'; }}
                onMouseLeave={e => { e.currentTarget.style.background = btnBg; e.currentTarget.style.borderColor = isDark ? '#7f1d1d' : '#fecaca'; }}>
                <RotateCcw size={iconSz} /> Clear
              </button>

              {isTablet && onTabletPanelChange && (
                <>
                  <button onClick={() => onTabletPanelChange(tabletPanel === 'guide' ? 'none' : 'guide')}
                    style={{ ...BTN_BASE, padding: btnPad, background: tabletPanel === 'guide' ? btnHoverBg : btnBg, border: tabletPanel === 'guide' ? `1px solid ${activeColor}` : `1px solid ${headerBorder}`, color: tabletPanel === 'guide' ? activeColor : textSecondary }}>
                    <LayoutGrid size={iconSz} /> Guide
                  </button>
                  <button onClick={() => onTabletPanelChange(tabletPanel === 'molecules' ? 'none' : 'molecules')}
                    style={{ ...BTN_BASE, padding: btnPad, background: tabletPanel === 'molecules' ? btnHoverBg : btnBg, border: tabletPanel === 'molecules' ? `1px solid ${activeColor}` : `1px solid ${headerBorder}`, color: tabletPanel === 'molecules' ? activeColor : textSecondary }}>
                    <Atom size={iconSz} /> Molecules
                  </button>
                </>
              )}

              <button onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
                style={{ ...BTN_BASE, padding: btnPad, background: btnBg, borderColor: headerBorder, color: textSecondary }}
                onMouseEnter={e => { const b = e.currentTarget; b.style.background = btnHoverBg; b.style.borderColor = activeColor; b.style.color = activeColor; }}
                onMouseLeave={e => { const b = e.currentTarget; b.style.background = btnBg; b.style.borderColor = headerBorder; b.style.color = textSecondary; }}>
                {isDark ? <Sun size={iconSz} /> : <Moon size={iconSz} />}
              </button>

              <button onClick={() => dispatch({ type: 'TOGGLE_TEACHER' })}
                style={{ ...BTN_BASE, padding: btnPad, background: state.showTeacherDash ? activeColor : btnBg, border: state.showTeacherDash ? `1px solid ${activeColor}` : `1px solid ${headerBorder}`, color: state.showTeacherDash ? '#ffffff' : textSecondary }}>
                <ClipboardList size={iconSz} /> My Progress
              </button>
            </div>
          )}
        </div>

        {/* Mobile tab bar */}
        {isMobile && onTabChange && (
          <div style={{ display: 'flex', gap: 6, borderTop: `1px solid ${menuBorder}`, padding: '6px 12px', background: isDark ? '#1e293b' : '#f8fafc' }}>
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
                  background: activeTab === id ? activeColor : 'transparent',
                  border: activeTab === id ? `1px solid ${activeColor}` : '1px solid transparent',
                  color: activeTab === id ? '#ffffff' : textSecondary,
                }}>
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {showElements && <ElementsPanel onClose={() => setShowElements(false)} onToast={showToast} />}
    </>
  );
}
