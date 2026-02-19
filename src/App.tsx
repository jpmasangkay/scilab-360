import { AppProvider } from './store/context';
import { Header } from './components/Header';
import { LeftPanel } from './components/LeftPanel';
import { RightPanel } from './components/RightPanel';
import { Sandbox } from './components/Sandbox';
import { TeacherDashboard } from './components/TeacherDashboard';

export default function App() {
  return (
    <AppProvider>
      <div className="w-full h-screen flex flex-col overflow-hidden font-exo2" style={{ background: '#07011a', color: '#f3e8ff' }}>
        <Header />

        <div className="flex-1 flex gap-3 p-3 overflow-hidden">
          <LeftPanel />
          <div className="flex-1 flex flex-col gap-3 overflow-hidden">
            <Sandbox />
          </div>
          <RightPanel />
        </div>

        {/* Legend bar */}
        <div className="h-8 flex items-center gap-6 px-5 shrink-0" style={{ background: '#0d0120', borderTop: '1px solid #2d1b5e' }}>
          {[
            { color: '#a855f7', label: 'Covalent Bond' },
            { color: '#f43f5e', label: 'Ionic Bond' },
            { color: '#818cf8', label: 'Metallic Bond' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-6 h-0.5 rounded" style={{ background: color, boxShadow: `0 0 4px ${color}` }} />
              <span className="text-xs font-share-tech" style={{ color: '#c4b5fd' }}>{label}</span>
            </div>
          ))}
          <span className="ml-auto text-xs font-share-tech" style={{ color: '#6b21a8' }}>
            SciLab 360 v1.0 · 118 Elements
          </span>
        </div>

        <TeacherDashboard />
      </div>
    </AppProvider>
  );
}
