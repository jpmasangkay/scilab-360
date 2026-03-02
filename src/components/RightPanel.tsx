import { useApp } from '../store/context';
import { MolecularPanel } from './MolecularPanel';

interface RightPanelProps { fullHeight?: boolean; }

export function RightPanel({ fullHeight }: RightPanelProps) {
  const { state } = useApp();
  const isDark = state.theme === 'dark';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const cardBorder = isDark ? '#334155' : '#e2e8f0';
  const accentLight = isDark ? '#0f766e' : '#0f766e';

  return (
    <div style={{ width: fullHeight ? '100%' : 268, flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', height: fullHeight ? '100%' : undefined }}>
      <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 14, flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ padding: '14px 16px 8px 16px', flexShrink: 0 }}>
          <p style={{ fontFamily: '"Nunito", sans-serif', fontSize: 12, fontWeight: 800, letterSpacing: '0.05em', color: accentLight, textTransform: 'uppercase' }}>Molecular View</p>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px 16px' }}>
          <MolecularPanel />
        </div>
      </div>
    </div>
  );
}
