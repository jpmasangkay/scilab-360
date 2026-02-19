import { useState } from 'react';
import { RotateCcw, ClipboardList, BookOpen, FlaskConical, LayoutGrid, Atom } from 'lucide-react';
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
  const showToast = useToast();

  // Button sizing by breakpoint
  const btnPad  = isMobile ? '5px 8px'    : isTablet ? '6px 11px'   : '8px 16px';
  const btnSize = isMobile ? 10           : isTablet ? 11            : 13;
  const iconSz  = isMobile ? 11           : 13;

  return (
    <>
      <div
        className="flex shrink-0 relative overflow-hidden border-b border-[#4c1d95]"
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

        {/* ── Main row: always logo-left / buttons-right ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: isMobile ? '10px 12px' : isTablet ? '10px 16px' : '14px 28px',
          gap: 12, position: 'relative', zIndex: 1,
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

          {/* Right-side controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 10, flexShrink: 0 }}>

            {/* Atom/bond count — hide only on tiny mobile */}
            {!isMobile && (
              <span style={{
                fontFamily: '"Share Tech Mono", monospace', fontSize: btnSize,
                color: '#a855f7', whiteSpace: 'nowrap',
              }}>
                {state.placedAtoms.length} atom{state.placedAtoms.length !== 1 ? 's' : ''} · {state.bonds.length} bond{state.bonds.length !== 1 ? 's' : ''}
              </span>
            )}

            <button
              onClick={() => setShowElements(true)}
              style={{ ...BTN_BASE, padding: btnPad, fontSize: btnSize }}
              onMouseEnter={e => { const b = e.currentTarget; b.style.background = '#2d1263'; b.style.borderColor = '#a855f7'; }}
              onMouseLeave={e => { const b = e.currentTarget; b.style.background = '#1e0b3e'; b.style.borderColor = '#4c1d95'; }}
            >
              <BookOpen size={iconSz} /> ELEMENTS
            </button>

            <button
              onClick={() => dispatch({ type: 'CLEAR_SANDBOX' })}
              style={{ ...BTN_BASE, padding: btnPad, fontSize: btnSize }}
              onMouseEnter={e => { (e.currentTarget).style.boxShadow = '0 0 12px #a855f740'; }}
              onMouseLeave={e => { (e.currentTarget).style.boxShadow = 'none'; }}
            >
              <RotateCcw size={iconSz} /> CLEAR
            </button>

            {/* Tablet panel toggles */}
            {isTablet && onTabletPanelChange && (
              <>
                <button
                  onClick={() => onTabletPanelChange(tabletPanel === 'guide' ? 'none' : 'guide')}
                  style={{
                    ...BTN_BASE, padding: btnPad, fontSize: btnSize,
                    background: tabletPanel === 'guide' ? '#3b0764' : '#1e0b3e',
                    border: tabletPanel === 'guide' ? '1px solid #a855f7' : '1px solid #4c1d95',
                    color: tabletPanel === 'guide' ? '#e9d5ff' : '#c084fc',
                  }}
                >
                  <LayoutGrid size={iconSz} /> GUIDE
                </button>
                <button
                  onClick={() => onTabletPanelChange(tabletPanel === 'molecules' ? 'none' : 'molecules')}
                  style={{
                    ...BTN_BASE, padding: btnPad, fontSize: btnSize,
                    background: tabletPanel === 'molecules' ? '#3b0764' : '#1e0b3e',
                    border: tabletPanel === 'molecules' ? '1px solid #a855f7' : '1px solid #4c1d95',
                    color: tabletPanel === 'molecules' ? '#e9d5ff' : '#c084fc',
                  }}
                >
                  <Atom size={iconSz} /> MOLECULES
                </button>
              </>
            )}

            {/* MY PROGRESS — all sizes; label hidden on mobile to save space */}
            <button
              onClick={() => dispatch({ type: 'TOGGLE_TEACHER' })}
              title="My Progress"
              style={{
                ...BTN_BASE, padding: btnPad, fontSize: btnSize,
                background: state.showTeacherDash ? '#3b0764' : '#1e0b3e',
                border: state.showTeacherDash ? '1px solid #a855f7' : '1px solid #4c1d95',
                color: state.showTeacherDash ? '#e9d5ff' : '#c084fc',
                boxShadow: state.showTeacherDash ? '0 0 12px #a855f760' : 'none',
              }}
            >
              <ClipboardList size={iconSz} />
              {!isMobile && ' MY PROGRESS'}
            </button>
          </div>
        </div>

        {/* ── Mobile tab bar (second row) ── */}
        {isMobile && onTabChange && (
          <div style={{
            display: 'flex', gap: 6,
            borderTop: '1px solid #2d1b5e',
            padding: '8px 12px',
          }}>
            {([
              { id: 'lab',       label: 'LAB',       Icon: FlaskConical },
              { id: 'guide',     label: 'GUIDE',     Icon: LayoutGrid },
              { id: 'molecules', label: 'MOLECULES', Icon: Atom },
            ] as const).map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  padding: '7px 0', borderRadius: 8, cursor: 'pointer',
                  fontFamily: '"Share Tech Mono", monospace', fontSize: 11,
                  letterSpacing: '0.05em', transition: 'all 0.15s',
                  background: activeTab === id ? '#3b0764' : '#1e0b3e',
                  border: activeTab === id ? '1px solid #a855f7' : '1px solid #2d1b5e',
                  color: activeTab === id ? '#e9d5ff' : '#6b4dcc',
                  boxShadow: activeTab === id ? '0 0 10px #a855f740' : 'none',
                }}
              >
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
