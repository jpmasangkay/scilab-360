import { MolecularPanel } from './MolecularPanel';

interface RightPanelProps { fullHeight?: boolean; }

export function RightPanel({ fullHeight }: RightPanelProps) {
  return (
    <div style={{ width: fullHeight ? '100%' : 268, flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', height: fullHeight ? '100%' : undefined }}>
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 14, flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ padding: '14px 16px 8px 16px', flexShrink: 0 }}>
          <p style={{ fontFamily: '"Nunito", sans-serif', fontSize: 12, fontWeight: 800, letterSpacing: '0.05em', color: '#0f766e', textTransform: 'uppercase' }}>Molecular View</p>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px 16px' }}>
          <MolecularPanel />
        </div>
      </div>
    </div>
  );
}
