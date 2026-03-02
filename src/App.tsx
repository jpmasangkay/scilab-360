/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, useCallback } from 'react';
import { AppProvider } from './store/context';
import { Header } from './components/Header';
import { LeftPanel } from './components/LeftPanel';
import { RightPanel } from './components/RightPanel';
import { Sandbox } from './components/Sandbox';
import { StudentDashboard } from './components/StudentDashboard';

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
}

type Tab = 'lab' | 'guide' | 'molecules';
interface Toast { id: number; msg: string; }

import { createContext, useContext } from 'react';
export const ToastContext = createContext<(msg: string) => void>(() => {});
export const useToast = () => useContext(ToastContext);

function AppLayout() {
  const width = useWindowWidth();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1100;
  const [activeTab, setActiveTab] = useState<Tab>('lab');
  const [tabletPanel, setTabletPanel] = useState<'none' | 'guide' | 'molecules'>('none');
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((msg: string) => {
    const id = Date.now();
    setToasts(prev => [...prev.slice(-2), { id, msg }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2500);
  }, []);

  const legend = (
    <div className="flex items-center gap-4 px-4 shrink-0" style={{ height: 36, background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
      {[
        { color: '#14b8a6', label: 'Covalent Bond' },
        { color: '#f43f5e', label: 'Ionic Bond' },
        { color: '#3b82f6', label: 'Metallic Bond' },
      ].map(({ color, label }) => (
        <div key={label} className="flex items-center gap-2">
          <div className="w-5 h-0.5 rounded-full" style={{ background: color }} />
          <span className="text-xs font-share-tech" style={{ color: '#64748b' }}>{label}</span>
        </div>
      ))}
    </div>
  );

  const bgColor = state.theme === 'dark' ? '#0f172a' : '#f8fafc';
  const textColor = state.theme === 'dark' ? '#e2e8f0' : '#1e293b';
  const borderColor = state.theme === 'dark' ? '#334155' : '#e2e8f0';

  return (
    <ToastContext.Provider value={showToast}>
      <div className="w-full h-screen flex flex-col overflow-hidden font-exo2" style={{ background: bgColor, color: textColor }}>
        <Header
          isMobile={isMobile}
          isTablet={isTablet}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabletPanel={tabletPanel}
          onTabletPanelChange={setTabletPanel}
        />

        {isMobile ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '16px 8px 8px', maxWidth: '100vw', paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}>
            {activeTab === 'lab' && (
              <>
                <div style={{ flex: 1, overflow: 'hidden', borderRadius: 12, display: 'flex', flexDirection: 'column', minHeight: 0, marginBottom: 16 }}>
                  <Sandbox isMobile />
                </div>
                <div style={{ flexShrink: 0, paddingBottom: 64 }}>
                  {legend}
                </div>
              </>
            )}
            {activeTab === 'guide' && (
              <div style={{ flex: 1, overflow: 'hidden', paddingBottom: 64 }}>
                <LeftPanel fullHeight isMobile onToast={showToast} />
              </div>
            )}
            {activeTab === 'molecules' && (
              <div style={{ flex: 1, overflow: 'hidden', paddingBottom: 64 }}>
                <RightPanel fullHeight />
              </div>
            )}
          </div>
        ) : isTablet ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '16px 8px 8px', gap: 8 }}>
            <div style={{ flex: 1, display: 'flex', gap: 8, overflow: 'hidden', minHeight: 0 }}>
              <div style={{ flex: 1, overflow: 'hidden', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <Sandbox />
              </div>
              {tabletPanel !== 'none' && (
                <div style={{ width: 320, flexShrink: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  {tabletPanel === 'guide' && <LeftPanel fullHeight isTablet onToast={showToast} />}
                  {tabletPanel === 'molecules' && <RightPanel fullHeight />}
                </div>
              )}
            </div>
            {legend}
          </div>
        ) : (
          <>
            <div className="flex-1 flex gap-3 p-6 overflow-hidden">
              <LeftPanel />
              <div className="flex-1 flex flex-col gap-3 overflow-hidden">
                <Sandbox />
              </div>
              <RightPanel />
            </div>
            <div style={{ paddingBottom: 16 }}>
              {legend}
            </div>
          </>
        )}

        <StudentDashboard />

        <div style={{ position: 'fixed', bottom: 48, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', zIndex: 9999, pointerEvents: 'none' }}>
          {toasts.map(t => (
            <div key={t.id} style={{
              padding: '8px 18px', borderRadius: 20,
              background: '#ffffff',
              border: '1px solid #14b8a6',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1), 0 0 0 1px rgba(20,184,166,0.2)',
              fontFamily: '"Space Mono", monospace', fontSize: 13, color: '#0f766e',
              whiteSpace: 'nowrap',
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
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}
