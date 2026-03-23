import { useTheme } from '../../shared/store/theme';
import { MolecularPanel } from '../molecular-view/MolecularPanel';

function PotteryRing({ width = 56, color }: { width?: number; color: string }) {
  return (
    <svg width={width} height={6} viewBox={`0 0 ${width} 6`} fill="none" style={{ display: 'block' }}>
      <path d={`M1,3 Q${width/4},1 ${width/2},3 Q${width*3/4},5 ${width-1},3`} stroke={color} strokeWidth="1.1" strokeLinecap="round"/>
      <path d={`M4,5 Q${width/4},3 ${width/2},5 Q${width*3/4},7 ${width-4},5`} stroke={color} strokeWidth="0.5" strokeLinecap="round" opacity="0.4"/>
    </svg>
  );
}

interface RightPanelProps { fullHeight?: boolean; compact?: boolean; }

export function RightPanel({ fullHeight, compact }: RightPanelProps) {
  const { theme } = useTheme();
  return (
    <div style={{ width: fullHeight ? '100%' : 248, flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', height: fullHeight ? '100%' : undefined }}>
      <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 12, flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: theme.shadow }}>
        <div style={{ padding: compact ? '12px 14px 8px' : '14px 18px 8px', flexShrink: 0 }}>
          <p style={{ fontFamily: '"Playfair Display", serif', fontSize: 11, fontWeight: 800, letterSpacing: '0.07em', color: theme.accent, textTransform: 'uppercase', marginBottom: 4 }}>
            Molecular View
          </p>
          <PotteryRing width={72} color={theme.accentBorder} />
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: compact ? '4px 14px 14px' : '4px 18px 18px' }}>
          <MolecularPanel />
        </div>
      </div>
    </div>
  );
}
