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

  useEffect(() => {
    if (!menuOpen) return;
    const handle = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [menuOpen]);

  const iconBtn = (active = false, danger = false): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 36, height: 36, borderRadius: 8, cursor: 'pointer',
    transition: 'all 0.18s', border: `1px solid ${danger ? theme.dangerBorder : active ? theme.accent : theme.border}`,
    background: active ? theme.accent : 'transparent',
    color: danger ? theme.dangerText : active ? '#fff' : theme.textSecondary,
    flexShrink: 0,
  });

  const textBtn = (active = false): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: 5,
    padding: '0 12px', height: 36, borderRadius: 8, cursor: 'pointer',
    fontFamily: '"DM Sans", sans-serif', fontWeight: 500, fontSize: 13,
    letterSpacing: '0.01em', whiteSpace: 'nowrap', transition: 'all 0.18s',
    border: `1px solid ${active ? theme.accent : theme.border}`,
    background: active ? theme.accent : 'transparent',
    color: active ? '#fff' : theme.textSecondary,
    flexShrink: 0,
  });

  const menuItemStyle = (active = false, danger = false): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: 12,
    width: '100%', padding: '14px 18px', cursor: 'pointer',
    fontFamily: '"DM Sans", sans-serif', fontWeight: 500, fontSize: 14,
    background: active ? theme.accentBg : 'transparent',
    border: 'none', borderBottom: `1px solid ${theme.borderLight}`,
    color: danger ? theme.dangerText : active ? theme.accent : theme.textSecondary,
    transition: 'background 0.15s', minHeight: 48,
  });

  const logoPotSize = isMobile ? 36 : 42;
  const logoPotRadius = isMobile ? 9 : 12;
  const logoFontSize = isMobile ? 15 : isTablet ? 17 : 20;

  return (
    <>
      <div style={{ background: theme.surface, borderBottom: `1px solid ${theme.border}`, flexShrink: 0, boxShadow: theme.shadow }}>

        {/* ── Main row ─────────────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: isMobile ? '8px 12px' : isTablet ? '9px 16px' : '10px 24px',
          gap: 10, minHeight: isMobile ? 52 : 56,
        }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{
              width: logoPotSize, height: logoPotSize, borderRadius: logoPotRadius,
              background: theme.accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 2px 10px ${theme.accent}40`, flexShrink: 0,
            }}>
              {/* Palayok logo — dark glazed clay pot with lid, icon scale */}
              <svg width={isMobile ? 20 : 24} height={isMobile ? 20 : 24} viewBox="0 0 24 22" fill="none">
                {/* Ground shadow */}
                <ellipse cx="12" cy="20.5" rx="7" ry="1.4" fill="black" opacity="0.3"/>
                {/* BODY */}
                <path d="M3,10 Q1,12 1,15 Q1,20 12,20 Q23,20 23,15 Q23,12 21,10 Z" fill="white" opacity="0.88"/>
                {/* Body right shadow */}
                <path d="M16,10 Q21.5,12 23,15 Q23,19.5 17,20 L12,20 Q18,19 20,15.5 Q21.5,12.5 16,10 Z" fill="black" opacity="0.22"/>
                {/* Body left highlight */}
                <path d="M3,10 Q1.2,12 1.3,14 Q2.5,12 5,10.8 Z" fill="white" opacity="0.4"/>
                {/* Specular */}
                <ellipse cx="6.5" cy="13" rx="2.2" ry="1.5" fill="white" opacity="0.3" transform="rotate(-20 6.5 13)"/>
                {/* Ring grooves */}
                <path d="M2.5,13 Q12,11.6 21.5,13" stroke="white" strokeWidth="0.5" strokeLinecap="round" opacity="0.25"/>
                <path d="M1.5,16.5 Q12,15.2 22.5,16.5" stroke="white" strokeWidth="0.45" strokeLinecap="round" opacity="0.18"/>
                {/* RIM LEDGE */}
                <ellipse cx="12" cy="10" rx="9" ry="2" fill="white" opacity="0.75"/>
                <path d="M3,10 Q12,8.5 21,10" stroke="white" strokeWidth="0.5" strokeLinecap="round" opacity="0.35"/>
                <ellipse cx="12" cy="10" rx="6.5" ry="1.2" fill="black" opacity="0.45"/>
                {/* LID */}
                <path d="M3,10 Q3,3.5 12,2.5 Q21,3.5 21,10 Z" fill="white" opacity="0.85"/>
                {/* Lid right shadow */}
                <path d="M16,3 Q20.5,5.5 21,10 L18,10 Q18.5,6 16,3 Z" fill="black" opacity="0.28"/>
                {/* Lid left highlight */}
                <path d="M3,10 Q3,5.5 5.5,3.8 Q3.5,5.5 3.2,9 Z" fill="white" opacity="0.3"/>
                {/* Lid ring */}
                <path d="M4,7.5 Q12,6 20,7.5" stroke="white" strokeWidth="0.45" strokeLinecap="round" opacity="0.2"/>
                {/* KNOB base */}
                <ellipse cx="12" cy="2.5" rx="3" ry="1" fill="white" opacity="0.72"/>
                {/* Knob dome */}
                <path d="M9,2.5 Q9,0 12,0 Q15,0 15,2.5 Z" fill="white" opacity="0.82"/>
                {/* Knob right shadow */}
                <path d="M13.5,0.3 Q15,1 15,2.5 L14,2.5 Q14.2,1.2 13.5,0.3 Z" fill="black" opacity="0.22"/>
                {/* Knob specular */}
                <ellipse cx="10.8" cy="1.2" rx="1" ry="0.7" fill="white" opacity="0.5"/>
              </svg>
            </div>
            <div>
              <p style={{ fontFamily: '"Playfair Display", serif', fontWeight: 800, color: theme.logoText, fontSize: logoFontSize, lineHeight: 1.1, letterSpacing: '-0.01em' }}>
                SciLab <em style={{ fontStyle: 'italic', fontWeight: 400, opacity: 0.7 }}>360</em>
              </p>
              {!isMobile && (
                <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 9, color: theme.subtitleText, letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1, marginTop: 2 }}>
                  Interactive Chemistry Lab
                </p>
              )}
            </div>
          </div>

          {/* ── MOBILE: hamburger ── */}
          {isMobile ? (
            <div ref={menuRef} style={{ position: 'relative', zIndex: 100 }}>
              <button
                onClick={() => setMenuOpen(o => !o)}
                style={{ ...iconBtn(menuOpen), width: 44, height: 44, borderRadius: 10 }}
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>

              {menuOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  width: 240, background: theme.surface,
                  border: `1px solid ${theme.border}`, borderRadius: 14,
                  boxShadow: theme.shadowLg, overflow: 'hidden', zIndex: 200,
                }}>
                  <div style={{ padding: '12px 18px', background: theme.accentBg, borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: theme.accent, letterSpacing: '0.05em', fontWeight: 600, textTransform: 'uppercase' }}>Level {state.level}</span>
                    <span style={{ fontFamily: '"Playfair Display", serif', fontSize: 16, fontWeight: 700, color: theme.accent }}>{state.score} pts</span>
                  </div>
                  <button style={menuItemStyle(false)} onClick={() => { setShowBondings(true); setMenuOpen(false); }}><Beaker size={16} /> Bondings</button>
                  <button style={menuItemStyle(false)} onClick={() => { setShowElements(true); setMenuOpen(false); }}><BookOpen size={16} /> Elements</button>
                  <button style={menuItemStyle(false)} onClick={() => { toggleTheme(); setMenuOpen(false); }}>
                    {mode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </button>
                  <button style={menuItemStyle(state.showTeacherDash)} onClick={() => { dispatch({ type: 'TOGGLE_TEACHER' }); setMenuOpen(false); }}><ClipboardList size={16} /> My Progress</button>
                  <button style={{ ...menuItemStyle(false, true), borderBottom: 'none' }} onClick={() => { dispatch({ type: 'CLEAR_SANDBOX' }); setMenuOpen(false); }}><RotateCcw size={16} /> Clear Lab</button>
                </div>
              )}
            </div>
          ) : (
            /* ── TABLET / DESKTOP ── */
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, flexWrap: 'nowrap' }}>

              {/* Stat pill */}
              <span style={{
                fontFamily: '"Space Mono", monospace', fontSize: 10,
                color: theme.textTertiary, background: theme.statBg,
                border: `1px solid ${theme.border}`,
                padding: '0 10px', height: 32, display: 'flex', alignItems: 'center',
                borderRadius: 6, whiteSpace: 'nowrap', letterSpacing: '0.02em', marginRight: 2,
              }}>
                {state.placedAtoms.length}a · {state.bonds.length}b
              </span>

              {/* Theme toggle — icon only */}
              <button
                onClick={toggleTheme}
                style={iconBtn()}
                onMouseEnter={e => { e.currentTarget.style.background = theme.accentBg; e.currentTarget.style.borderColor = theme.accentBorder; e.currentTarget.style.color = theme.accent; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.textSecondary; }}
              >
                {mode === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              </button>

              {/* Bondings — icon+label on desktop, icon only on tablet */}
              <button
                onClick={() => setShowBondings(true)}
                style={isTablet ? iconBtn() : textBtn()}
                onMouseEnter={e => { e.currentTarget.style.background = theme.accentBg; e.currentTarget.style.borderColor = theme.accentBorder; e.currentTarget.style.color = theme.accent; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.textSecondary; }}
              >
                <Beaker size={14} />
                {!isTablet && <span>Bondings</span>}
              </button>

              {/* Elements — icon+label on desktop, icon only on tablet */}
              <button
                onClick={() => setShowElements(true)}
                style={isTablet ? iconBtn() : textBtn()}
                onMouseEnter={e => { e.currentTarget.style.background = theme.accentBg; e.currentTarget.style.borderColor = theme.accentBorder; e.currentTarget.style.color = theme.accent; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.textSecondary; }}
              >
                <BookOpen size={14} />
                {!isTablet && <span>Elements</span>}
              </button>

              {/* Tablet panel toggles */}
              {isTablet && onTabletPanelChange && (
                <>
                  <button
                    onClick={() => onTabletPanelChange(tabletPanel === 'guide' ? 'none' : 'guide')}
                    style={iconBtn(tabletPanel === 'guide')}
                    onMouseEnter={e => { if (tabletPanel !== 'guide') { e.currentTarget.style.background = theme.accentBg; e.currentTarget.style.borderColor = theme.accentBorder; e.currentTarget.style.color = theme.accent; } }}
                    onMouseLeave={e => { if (tabletPanel !== 'guide') { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.textSecondary; } }}
                  >
                    <LayoutGrid size={14} />
                  </button>
                  <button
                    onClick={() => onTabletPanelChange(tabletPanel === 'molecules' ? 'none' : 'molecules')}
                    style={iconBtn(tabletPanel === 'molecules')}
                    onMouseEnter={e => { if (tabletPanel !== 'molecules') { e.currentTarget.style.background = theme.accentBg; e.currentTarget.style.borderColor = theme.accentBorder; e.currentTarget.style.color = theme.accent; } }}
                    onMouseLeave={e => { if (tabletPanel !== 'molecules') { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.textSecondary; } }}
                  >
                    <Atom size={14} />
                  </button>
                </>
              )}

              {/* My Progress */}
              <button
                onClick={() => dispatch({ type: 'TOGGLE_TEACHER' })}
                style={isTablet ? iconBtn(state.showTeacherDash) : textBtn(state.showTeacherDash)}
                onMouseEnter={e => { if (!state.showTeacherDash) { e.currentTarget.style.background = theme.accentBg; e.currentTarget.style.borderColor = theme.accentBorder; e.currentTarget.style.color = theme.accent; } }}
                onMouseLeave={e => { if (!state.showTeacherDash) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.textSecondary; } }}
              >
                <ClipboardList size={14} />
                {!isTablet && <span>My Progress</span>}
              </button>

              {/* Divider */}
              <div style={{ width: 1, height: 20, background: theme.border, flexShrink: 0 }} />

              {/* Clear — icon only, always */}
              <button
                onClick={() => dispatch({ type: 'CLEAR_SANDBOX' })}
                style={iconBtn(false, true)}
                title="Clear lab"
                onMouseEnter={e => { e.currentTarget.style.background = theme.dangerBg; e.currentTarget.style.borderColor = theme.dangerText; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = theme.dangerBorder; }}
              >
                <RotateCcw size={14} />
              </button>
            </div>
          )}
        </div>

        {/* ── Karagatan wave ─────────────────────────────── */}
        {!isMobile && (
          <svg style={{ display: 'block', width: '100%', height: 8 }} viewBox="0 0 900 8" preserveAspectRatio="none" fill="none">
            <path d="M0,4 C37.5,0.8 75,7.2 112.5,4 C150,0.8 187.5,7.2 225,4 C262.5,0.8 300,7.2 337.5,4 C375,0.8 412.5,7.2 450,4 C487.5,0.8 525,7.2 562.5,4 C600,0.8 637.5,7.2 675,4 C712.5,0.8 750,7.2 787.5,4 C825,0.8 862.5,7.2 900,4"
              stroke={theme.accentBorder} strokeWidth="1.4" strokeLinecap="round"/>
            <path d="M0,6.5 C37.5,3.3 75,9.7 112.5,6.5 C150,3.3 187.5,9.7 225,6.5 C262.5,3.3 300,9.7 337.5,6.5 C375,3.3 412.5,9.7 450,6.5 C487.5,3.3 525,9.7 562.5,6.5 C600,3.3 637.5,9.7 675,6.5 C712.5,3.3 750,9.7 787.5,6.5 C825,3.3 862.5,9.7 900,6.5"
              stroke={theme.accentBorder} strokeWidth="0.6" strokeLinecap="round" opacity="0.4"/>
          </svg>
        )}

        {/* ── Mobile tab bar — filled pill style ──────────── */}
        {isMobile && onTabChange && (
          <div style={{
            display: 'flex', gap: 6, padding: '7px 10px',
            borderTop: `1px solid ${theme.border}`,
            background: theme.surfaceAlt,
          }}>
            {([
              { id: 'lab',       label: 'Lab',       Icon: FlaskConical },
              { id: 'guide',     label: 'Guide',     Icon: LayoutGrid },
              { id: 'molecules', label: 'Molecules', Icon: Atom },
            ] as const).map(({ id, label, Icon }) => (
              <button key={id} onClick={() => onTabChange(id)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '9px 4px', cursor: 'pointer', minHeight: 44,
                  fontFamily: '"DM Sans", sans-serif', fontSize: 12, fontWeight: activeTab === id ? 600 : 400,
                  transition: 'all 0.18s',
                  borderRadius: 10,
                  border: activeTab === id ? `1px solid ${theme.accentDark}` : '1px solid transparent',
                  background: activeTab === id ? theme.accent : 'transparent',
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
