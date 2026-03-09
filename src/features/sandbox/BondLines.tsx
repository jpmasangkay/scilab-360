import type { PlacedAtom, Bond } from '../../shared/types';

interface BondLinesProps {
  atoms: PlacedAtom[];
  bonds: Bond[];
}

export function BondLines({ atoms, bonds }: BondLinesProps) {
  const atomMap = new Map(atoms.map(a => [a.id, a]));

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-1">
      {bonds.map((bond, i) => {
        const a = atomMap.get(bond.from);
        const b = atomMap.get(bond.to);
        if (!a || !b) return null;

        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const angle = Math.atan2(dy, dx);
        const color = bond.type === 'ionic' ? '#f43f5e' : bond.type === 'metallic' ? '#3b82f6' : '#14b8a6';

        if (bond.order === 1) {
          return (
            <line
              key={i}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={color} strokeWidth={3} strokeLinecap="round"
              opacity={0.8}
            />
          );
        }

        const perpX = Math.sin(angle) * 4;
        const perpY = -Math.cos(angle) * 4;
        const offsets = bond.order === 2 ? [-1, 1] : [-1, 0, 1];

        return (
          <g key={i}>
            {offsets.map((off, j) => (
              <line
                key={j}
                x1={a.x + perpX * off} y1={a.y + perpY * off}
                x2={b.x + perpX * off} y2={b.y + perpY * off}
                stroke={color} strokeWidth={2.5} strokeLinecap="round"
                opacity={0.8}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}
