/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, useCallback } from 'react';
import { AppProvider } from './shared/store/context';
import { ThemeProvider, useTheme } from './shared/store/theme';
import { Header } from './features/layout/Header';
import { LeftPanel } from './features/layout/LeftPanel';
import { RightPanel } from './features/layout/RightPanel';
import { Sandbox } from './features/sandbox/Sandbox';
import { StudentDashboard } from './features/dashboard/StudentDashboard';

function useWindowSize() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    const handler = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return size;
}

type Tab = 'lab' | 'guide' | 'molecules';
interface Toast { id: number; msg: string; }

import { createContext, useContext } from 'react';
export const ToastContext = createContext<(msg: string) => void>(() => {});
export const useToast = () => useContext(ToastContext);

function AppLayout() {
  const { theme } = useTheme();
  const { w } = useWindowSize();
  const isMobile = w < 768;
  const isTablet = w >= 768 && w < 1100;
  const [activeTab, setActiveTab] = useState<Tab>('lab');
  const [tabletPanel, setTabletPanel] = useState<'none' | 'guide' | 'molecules'>('none');
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((msg: string) => {
    const id = Date.now();
    setToasts(prev => [...prev.slice(-2), { id, msg }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2500);
  }, []);

  const legend = (
    <div style={{
      height: 36, display: 'flex', alignItems: 'center', gap: isMobile ? 16 : 24,
      padding: isMobile ? '0 12px' : '0 18px', flexShrink: 0,
      background: theme.surface, borderTop: `1px solid ${theme.border}`,
    }}>
      <svg width="24" height="10" viewBox="0 0 24 10" fill="none" style={{ flexShrink: 0, opacity: 0.45 }}>
        <path d="M0,5 C3,2 6,8 9,5 C12,2 15,8 18,5 C20,3 22,7 24,5" stroke={theme.accent} strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
      {[
        { color: '#0E6B68', label: isMobile ? 'Covalent' : 'Covalent bond' },
        { color: '#B85030', label: isMobile ? 'Ionic' : 'Ionic bond' },
        { color: '#4A78A0', label: isMobile ? 'Metallic' : 'Metallic bond' },
      ].map(({ color, label }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ width: 18, height: 2, background: color, borderRadius: 1, flexShrink: 0 }} />
          <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: isMobile ? 10 : 11, color: theme.textTertiary, letterSpacing: '0.03em', whiteSpace: 'nowrap' }}>{label}</span>
        </div>
      ))}
    </div>
  );

  return (
    <ToastContext.Provider value={showToast}>
      <div style={{ width: '100%', height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: theme.bg, color: theme.text }}>
        <Header
          isMobile={isMobile}
          isTablet={isTablet}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabletPanel={tabletPanel}
          onTabletPanelChange={setTabletPanel}
        />

        {/* ── MOBILE ── */}
        {isMobile ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
            {activeTab === 'lab' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '8px 8px 0', minHeight: 0 }}>
                <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: 14 }}>
                  <Sandbox isMobile />
                </div>
                {legend}
              </div>
            )}
            {activeTab === 'guide' && (
              <div style={{ flex: 1, overflow: 'hidden', padding: '8px 8px 0', minHeight: 0 }}>
                <LeftPanel fullHeight isMobile onToast={showToast} />
              </div>
            )}
            {activeTab === 'molecules' && (
              <div style={{ flex: 1, overflow: 'hidden', padding: '8px 8px 0', minHeight: 0 }}>
                <RightPanel fullHeight />
              </div>
            )}
          </div>
        ) : isTablet ? (
          /* ── TABLET ── */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '10px 10px 0', gap: 0, minHeight: 0 }}>
            <div style={{ flex: 1, display: 'flex', gap: 10, overflow: 'hidden', minHeight: 0 }}>
              <div style={{ flex: 1, overflow: 'hidden', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <Sandbox />
              </div>
              {tabletPanel !== 'none' && (
                <div style={{ width: Math.min(300, w * 0.32), flexShrink: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  {tabletPanel === 'guide' && <LeftPanel fullHeight isTablet onToast={showToast} />}
                  {tabletPanel === 'molecules' && <RightPanel fullHeight />}
                </div>
              )}
            </div>
            {legend}
          </div>
        ) : (
          /* ── DESKTOP ── */
          <>
            <div style={{ flex: 1, display: 'flex', gap: 14, padding: 14, overflow: 'hidden', minHeight: 0 }}>
              <LeftPanel />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
                <Sandbox />
              </div>
              <RightPanel />
            </div>
            {legend}
          </>
        )}

        <StudentDashboard />

        {/* Toasts */}
        <div style={{ position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', zIndex: 9999, pointerEvents: 'none' }}>
          {toasts.map(t => (
            <div key={t.id} style={{
              padding: '9px 20px', borderRadius: 24,
              background: theme.toastBg, border: `1px solid ${theme.toastBorder}`,
              boxShadow: theme.toastShadow,
              fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 500,
              color: theme.toastText, whiteSpace: 'nowrap',
              animation: 'slideUp 0.25s ease-out',
            }}>
              {t.msg}
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppLayout />
      </AppProvider>
    </ThemeProvider>
  );
}
