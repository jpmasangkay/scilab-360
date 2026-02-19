import { MolecularPanel } from './MolecularPanel';

interface RightPanelProps { fullHeight?: boolean; }

export function RightPanel({ fullHeight }: RightPanelProps) {
  return (
    <div style={{ width: fullHeight ? '100%' : 268, flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', height: fullHeight ? '100%' : undefined }}>
      <div style={{ background: '#0d0120', border: '1px solid #2d1b5e', borderRadius: 12, flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '14px 16px 8px 16px', flexShrink: 0 }}>
          <p style={{ fontFamily: 'Orbitron, monospace', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: '#d8b4fe' }}>MOLECULAR VIEW</p>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px 16px' }}>
          <MolecularPanel />
        </div>
      </div>
    </div>
  );
}
