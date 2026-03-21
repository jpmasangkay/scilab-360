import { useTheme } from '../../shared/store/theme';
import { MolecularPanel } from '../molecular-view/MolecularPanel';

interface RightPanelProps { fullHeight?: boolean; }

export function RightPanel({ fullHeight }: RightPanelProps) {
  const { theme } = useTheme();
  return (
    <div style={{ width: fullHeight ? '100%' : 268, flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', height: fullHeight ? '100%' : undefined }}>
      <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: theme.shadow }}>
        <div style={{ padding: '14px 16px 8px 16px', flexShrink: 0 }}>
          <p style={{ fontFamily: '"Playfair Display", sans-serif', fontSize: 12, fontWeight: 800, letterSpacing: '0.05em', color: theme.accent, textTransform: 'uppercase', marginBottom: 3 }}>Molecular View</p>
          <svg width="68" height="5" viewBox="0 0 68 5" fill="none">
            <path d="M1,2.5 Q17,0.5 34,2.5 Q51,4.5 67,2.5" stroke={theme.accentBorder} strokeWidth="1" strokeLinecap="round"/>
            <path d="M4,4 Q17,2.5 34,4 Q51,5.5 64,4" stroke={theme.accentBorder} strokeWidth="0.5" strokeLinecap="round" opacity="0.5"/>
          </svg>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px 16px' }}>
          <MolecularPanel />
        </div>
      </div>
    </div>
  );
}
