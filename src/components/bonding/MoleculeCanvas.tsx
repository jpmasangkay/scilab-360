import type { Molecule, BondConnection } from "@/types/chemistry"

interface MoleculeCanvasProps {
  molecule:    Molecule
  readOnly?:   boolean
  highlightBonds?: {
    correct:  BondConnection[]
    wrong:    BondConnection[]
    missing:  BondConnection[]
  }
}

function BondLine({
  fromX, fromY, toX, toY, bondType, status = "default"
}: {
  fromX: number; fromY: number; toX: number; toY: number
  bondType: string; status?: "default" | "correct" | "wrong" | "missing"
}) {
  const angle = Math.atan2(toY - fromY, toX - fromX)
  const px    = Math.sin(angle) * 4
  const py    = Math.cos(angle) * 4

  const color = status === "correct" ? "#10b981"
    : status === "wrong"   ? "#ef4444"
    : status === "missing" ? "#f59e0b"
    : "#00d4ff"

  const strokeDash = status === "missing" ? "6 4" : undefined
  const filter     = status === "default"
    ? `drop-shadow(0 0 6px ${color})`
    : undefined

  if (bondType === "single" || bondType === "ionic" || bondType === "hydrogen") {
    return (
      <line
        x1={fromX} y1={fromY} x2={toX} y2={toY}
        stroke={color}
        strokeWidth={bondType === "ionic" ? 3 : 2.5}
        strokeDasharray={bondType === "ionic" ? "8 4" : strokeDash}
        filter={filter}
        style={{ animation: status === "default" ? "var(--animate-bond-pulse)" : undefined }}
      />
    )
  }

  if (bondType === "double") {
    return (
      <>
        <line x1={fromX-px} y1={fromY-py} x2={toX-px} y2={toY-py}
          stroke={color} strokeWidth={2.5} filter={filter}
          strokeDasharray={strokeDash}
          style={{ animation: status === "default" ? "var(--animate-bond-pulse)" : undefined }}
        />
        <line x1={fromX+px} y1={fromY+py} x2={toX+px} y2={toY+py}
          stroke={color} strokeWidth={2.5} filter={filter}
          strokeDasharray={strokeDash}
          style={{ animation: status === "default" ? "var(--animate-bond-pulse)" : undefined }}
        />
      </>
    )
  }

  if (bondType === "triple") {
    return (
      <>
        <line x1={fromX}    y1={fromY}    x2={toX}    y2={toY}
          stroke={color} strokeWidth={2.5} filter={filter}
          strokeDasharray={strokeDash}
          style={{ animation: status === "default" ? "var(--animate-bond-pulse)" : undefined }}
        />
        <line x1={fromX-px*1.4} y1={fromY-py*1.4} x2={toX-px*1.4} y2={toY-py*1.4}
          stroke={color} strokeWidth={2} filter={filter}
          strokeDasharray={strokeDash}
        />
        <line x1={fromX+px*1.4} y1={fromY+py*1.4} x2={toX+px*1.4} y2={toY+py*1.4}
          stroke={color} strokeWidth={2} filter={filter}
          strokeDasharray={strokeDash}
        />
      </>
    )
  }

  return null
}

export function MoleculeCanvas({ molecule, readOnly = true, highlightBonds }: MoleculeCanvasProps) {
  const atomMap = Object.fromEntries(molecule.atoms.map(a => [a.id, a]))

  const getBondStatus = (conn: BondConnection) => {
    if (!highlightBonds) return "default"
    const bid = conn.id
    if (highlightBonds.correct.some(b => b.id === bid)) return "correct"
    if (highlightBonds.wrong.some(b => b.id === bid))   return "wrong"
    if (highlightBonds.missing.some(b => b.id === bid)) return "missing"
    return "default"
  }

  return (
    <div
      className="canvas-grid"
      style={{
        flex:          1,
        display:       "flex",
        flexDirection: "column",
        alignItems:    "center",
        justifyContent:"center",
        padding:       "16px",
        position:      "relative",
      }}
    >
      <div style={{
        fontFamily:    "var(--font-display)",
        fontSize:      "11px",
        letterSpacing: "0.1em",
        color:         "var(--color-text-muted)",
        marginBottom:  "8px",
        textTransform: "uppercase",
      }}>
        {molecule.name} — {molecule.structure}
      </div>

      <svg
        viewBox="0 0 700 500"
        style={{ width:"100%", maxWidth:"600px", maxHeight:"400px" }}
        aria-label={`${molecule.name} molecule diagram`}
      >
        <defs>
          <radialGradient id="atomGrad-O" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </radialGradient>
          <radialGradient id="atomGrad-H" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="100%" stopColor="#334155" />
          </radialGradient>
          <radialGradient id="atomGrad-C" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#6b7280" />
            <stop offset="100%" stopColor="#374151" />
          </radialGradient>
          <radialGradient id="atomGrad-N" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#3730a3" />
          </radialGradient>
          <radialGradient id="atomGrad-default" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#0891b2" />
            <stop offset="100%" stopColor="#0e7490" />
          </radialGradient>
          <filter id="bondGlow">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="atomGlowFilter">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Bonds */}
        {molecule.connections.map(conn => {
          const from  = atomMap[conn.fromAtomId]
          const to    = atomMap[conn.toAtomId]
          if (!from || !to) return null
          const status = getBondStatus(conn)
          return (
            <BondLine
              key={conn.id}
              fromX={from.position.x} fromY={from.position.y}
              toX={to.position.x}     toY={to.position.y}
              bondType={conn.bondType} status={status}
            />
          )
        })}

        {/* Atoms */}
        {molecule.atoms.map(atom => {
          const r     = atom.element.atomicNumber === 1 ? 28 : 40
          const grad  = `url(#atomGrad-${atom.element.symbol})` || "url(#atomGrad-default)"
          const color = atom.element.color

          return (
            <g
              key={atom.id}
              style={{ animation: readOnly ? "var(--animate-atom-glow)" : undefined }}
            >
              <title>{atom.element.name}</title>
              {/* Orbit rings */}
              {Array.from({ length: Math.min(atom.orbitRings, 3) }, (_, i) => (
                <ellipse
                  key={i}
                  cx={atom.position.x}
                  cy={atom.position.y}
                  rx={r + 14 + i * 12}
                  ry={r + 6 + i * 8}
                  fill="none"
                  stroke={color}
                  strokeWidth="0.5"
                  opacity="0.2"
                  transform={`rotate(${i * 60} ${atom.position.x} ${atom.position.y})`}
                />
              ))}
              {/* Atom circle */}
              <circle
                cx={atom.position.x}
                cy={atom.position.y}
                r={r}
                fill={grad}
                style={{ fill: color, fillOpacity: 0.85 }}
                className="atom-glow"
                stroke={color}
                strokeWidth="1.5"
                strokeOpacity="0.6"
              />
              {/* Symbol */}
              <text
                x={atom.position.x}
                y={atom.position.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#fff"
                fontSize={r < 30 ? 14 : 18}
                fontWeight="bold"
                fontFamily="var(--font-display)"
              >
                {atom.element.symbol}
              </text>
            </g>
          )
        })}

        {/* Bond angle arc */}
        {molecule.bondAngle && molecule.atoms.length >= 3 && (
          <text
            x={350} y={460}
            textAnchor="middle"
            fill="var(--color-text-muted)"
            fontSize={13}
            fontFamily="var(--font-mono)"
          >
            Bond angle: {molecule.bondAngle}°
          </text>
        )}
      </svg>

      {/* Label */}
      <div style={{
        fontFamily: "var(--font-display)",
        fontSize:   "12px",
        color:      "var(--color-text-muted)",
        marginTop:  "8px",
        letterSpacing: "0.08em",
      }}>
        Covalent Bond Formation
      </div>
    </div>
  )
}
