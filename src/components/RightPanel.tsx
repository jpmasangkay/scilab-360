import { useTheme } from '../store/theme';
import { MolecularPanel } from './MolecularPanel';

interface RightPanelProps { fullHeight?: boolean; }

export function RightPanel({ fullHeight }: RightPanelProps) {
  const { theme } = useTheme();
  return (
    <div style={{ width: fullHeight ? '100%' : 268, flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', height: fullHeight ? '100%' : undefined }}>
      <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: theme.shadow }}>
        <div style={{ padding: '14px 16px 8px 16px', flexShrink: 0 }}>
          <p style={{ fontFamily: '"Nunito", sans-serif', fontSize: 12, fontWeight: 800, letterSpacing: '0.05em', color: theme.accent, textTransform: 'uppercase' }}>Molecular View</p>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px 16px' }}>
          <MolecularPanel />
        </div>
      </div>
    </div>
  );
}
