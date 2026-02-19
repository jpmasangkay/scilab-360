import { useApp } from '../store/context';
import { CATEGORY_COLORS } from '../utils/colors';

export function LewisView() {
  const { state } = useApp();

  if (state.placedAtoms.length === 0) {
    return (
      <p className="text-[#4c1d95] font-share-tech text-xs text-center py-6">
        No atoms placed yet
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-10 justify-center py-6 px-4">
      {state.placedAtoms.map(atom => {
        const ve = atom.element.valenceElectrons;
        const colors = CATEGORY_COLORS[atom.element.category];

        // Dots placed at N/E/S/W and 4 corners
        // We use a padded container so dots never overflow it
        const PADDING = 14; // px — space for dots on each side
        const BOX = 60;     // symbol square size
        const TOTAL = BOX + PADDING * 2;

        // [cx%, cy%] within the TOTAL container where each dot lives
        const dots: [string, string][] = [
          ['50%', `${PADDING / 2}px`],                              // top-center
          [`calc(100% - ${PADDING / 2}px)`, '50%'],                 // right-center
          ['50%', `calc(100% - ${PADDING / 2}px)`],                 // bottom-center
          [`${PADDING / 2}px`, '50%'],                              // left-center
          [`calc(100% - ${PADDING / 2}px)`, `${PADDING / 2}px`],   // top-right
          [`calc(100% - ${PADDING / 2}px)`, `calc(100% - ${PADDING / 2}px)`], // bottom-right
          [`${PADDING / 2}px`, `calc(100% - ${PADDING / 2}px)`],   // bottom-left
          [`${PADDING / 2}px`, `${PADDING / 2}px`],                 // top-left
        ];

        return (
          <div key={atom.id} className="flex flex-col items-center gap-2">
            {/* Padded container — dots sit inside the padding, symbol in the center */}
            <div className="relative" style={{ width: TOTAL, height: TOTAL }}>
              {/* Symbol box, inset by PADDING */}
              <div
                className="absolute flex items-center justify-center font-orbitron font-bold text-xl rounded-xl"
                style={{
                  top: PADDING,
                  left: PADDING,
                  width: BOX,
                  height: BOX,
                  background: colors.bg,
                  border: `2px solid ${colors.border}`,
                  color: colors.text,
                  boxShadow: `0 0 14px ${colors.glow}50`,
                }}
              >
                {atom.element.symbol}
              </div>

              {/* Electron dots */}
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
                      background: filled ? '#a855f7' : 'transparent',
                      border: filled ? 'none' : '1px solid #3b1578',
                      boxShadow: filled ? '0 0 6px #a855f7, 0 0 12px #a855f760' : 'none',
                    }}
                  />
                );
              })}
            </div>

            {/* Label — always below the container, never overlapping */}
            <span className="text-xs text-[#c084fc] font-share-tech font-bold whitespace-nowrap">
              {atom.element.symbol} · {ve} val e⁻
            </span>
          </div>
        );
      })}
    </div>
  );
}
