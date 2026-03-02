import { useApp } from '../store/context';
import { CATEGORY_COLORS } from '../utils/colors';

export function LewisView() {
  const { state } = useApp();
  const isDark = state.theme === 'dark';
  const textColor = isDark ? '#94a3b8' : '#94a3b8';

  if (state.placedAtoms.length === 0) {
    return (
      <p style={{ color: textColor, fontFamily: '"Inter", sans-serif', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>
        No atoms placed yet
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-10 justify-center py-6 px-4">
      {state.placedAtoms.map(atom => {
        const ve = atom.element.valenceElectrons;
        const colors = CATEGORY_COLORS[atom.element.category];

        const PADDING = 14;
        const BOX = 60;
        const TOTAL = BOX + PADDING * 2;

        const dots: [string, string][] = [
          ['50%', `${PADDING / 2}px`],
          [`calc(100% - ${PADDING / 2}px)`, '50%'],
          ['50%', `calc(100% - ${PADDING / 2}px)`],
          [`${PADDING / 2}px`, '50%'],
          [`calc(100% - ${PADDING / 2}px)`, `${PADDING / 2}px`],
          [`calc(100% - ${PADDING / 2}px)`, `calc(100% - ${PADDING / 2}px)`],
          [`${PADDING / 2}px`, `calc(100% - ${PADDING / 2}px)`],
          [`${PADDING / 2}px`, `${PADDING / 2}px`],
        ];

        return (
          <div key={atom.id} className="flex flex-col items-center gap-2">
            <div className="relative" style={{ width: TOTAL, height: TOTAL }}>
              <div
                className="absolute flex items-center justify-center rounded-xl"
                style={{
                  top: PADDING,
                  left: PADDING,
                  width: BOX,
                  height: BOX,
                  fontFamily: '"Nunito", sans-serif',
                  fontWeight: 800,
                  fontSize: 20,
                  background: colors.bg,
                  border: `2px solid ${colors.border}`,
                  color: colors.text,
                }}
              >
                {atom.element.symbol}
              </div>

              {dots.map(([left, top], i) => {
                const filled = i < ve;
                return (
                  <div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      width: 8,
                      height: 8,
                      left,
                      top,
                      transform: 'translate(-50%, -50%)',
                      background: filled ? '#14b8a6' : 'transparent',
                      border: filled ? 'none' : '1px solid #cbd5e1',
                    }}
                  />
                );
              })}
            </div>

            <span style={{ fontSize: 12, color: '#64748b', fontFamily: '"Space Mono", monospace', fontWeight: 700, whiteSpace: 'nowrap' }}>
              {atom.element.symbol} &middot; {ve} val e
            </span>
          </div>
        );
      })}
    </div>
  );
}
