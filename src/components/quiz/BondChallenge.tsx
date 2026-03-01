import { useRef, useState, useCallback } from "react"
import type { Molecule, BondConnection, BondType } from "@/types/chemistry"
import type { Difficulty } from "@/types/quiz"
import { useBondDrawing } from "@/hooks/useBondDrawing"
import { validateBonds } from "@/utils/bondValidation"
import { toast } from "sonner"

interface BondChallengeProps {
  molecule:        Molecule
  difficulty:      Difficulty
  challengeIndex:  number
  totalChallenges: number
  timeLeft:        number
  maxTime:         number
  points:          number
  streak:          number
  placedBonds:     BondConnection[]
  hintsUsed:       number
  feedback:        "none" | "correct" | "wrong"
  onPlaceBond:     (fromId: string, toId: string, bondType: BondType) => void
  onRemoveLast:    () => void
  onCheck:         () => void
  onHint:          () => { fromId: string; toId: string } | null
  onNext:          () => void
}

const BOND_TYPES: { type: BondType; label: string; symbol: string }[] = [
  { type:"single",     label:"Single",     symbol:"─" },
  { type:"double",     label:"Double",     symbol:"═" },
  { type:"triple",     label:"Triple",     symbol:"≡" },
  { type:"ionic",      label:"Ionic",      symbol:"⊕" },
]

export function BondChallenge({
  molecule, difficulty, challengeIndex, totalChallenges,
  timeLeft, maxTime, points, streak, placedBonds, hintsUsed,
  feedback, onPlaceBond, onRemoveLast, onCheck, onHint, onNext,
}: BondChallengeProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [hintAtoms, setHintAtoms] = useState<{ fromId: string; toId: string } | null>(null)

  const getSVGCoords = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 }
    const pt = svgRef.current.createSVGPoint()
    pt.x = clientX
    pt.y = clientY
    const t = pt.matrixTransform(svgRef.current.getScreenCTM()!.inverse())
    return { x: t.x, y: t.y }
  }, [])

  const { state, selectedBond, setSelectedBond, handleAtomClick, handleMouseMove, handleCanvasClick } =
    useBondDrawing(onPlaceBond)

  const { correctBonds, wrongBonds, missingBonds } = feedback !== "none"
    ? validateBonds(placedBonds, molecule.connections)
    : { correctBonds: [], wrongBonds: [], missingBonds: [] }

  const handleHintClick = () => {
    const h = onHint()
    if (h) {
      setHintAtoms(h)
      toast("💡 Hint active for 3 seconds", { duration: 2500 })
      setTimeout(() => setHintAtoms(null), 3000)
    } else {
      toast("All bonds already placed!")
    }
  }

  const timerRatio  = timeLeft / maxTime
  const timerColor  = timerRatio > 0.5 ? "#10b981" : timerRatio > 0.25 ? "#f59e0b" : "#ef4444"
  const isTimerWarn = timeLeft < 10

  const atomMap = Object.fromEntries(molecule.atoms.map(a => [a.id, a]))

  const getBondColor = (bond: BondConnection) => {
    if (feedback === "none") return "#00d4ff"
    if (correctBonds.some(b => b.id === bond.id)) return "#10b981"
    if (wrongBonds.some(b => b.id === bond.id))   return "#ef4444"
    return "#00d4ff"
  }

  const getAtomState = (atomId: string) => {
    if (state.phase !== "idle" && (state.phase === "selected" || state.phase === "drawing") && state.fromId === atomId) return "selected"
    if (feedback !== "none") {
      const isInCorrect  = correctBonds.some(b => b.fromAtomId === atomId || b.toAtomId === atomId)
      const isInWrong    = wrongBonds.some(b => b.fromAtomId === atomId || b.toAtomId === atomId)
      const isInMissing  = missingBonds.some(b => b.fromAtomId === atomId || b.toAtomId === atomId)
      if (isInWrong)    return "wrong"
      if (isInMissing)  return "missing"
      if (isInCorrect)  return "correct"
    }
    return "default"
  }

  const renderBond = (bond: BondConnection) => {
    const from  = atomMap[bond.fromAtomId]
    const to    = atomMap[bond.toAtomId]
    if (!from || !to) return null
    const color = getBondColor(bond)
    const angle = Math.atan2(to.position.y - from.position.y, to.position.x - from.position.x)
    const px    = Math.sin(angle) * 4
    const py    = Math.cos(angle) * 4
    const glow  = `drop-shadow(0 0 6px ${color})`

    if (bond.bondType === "double") return (
      <g key={bond.id}>
        <line x1={from.position.x - px} y1={from.position.y - py} x2={to.position.x - px} y2={to.position.y - py} stroke={color} strokeWidth={2.5} style={{ filter: glow }} />
        <line x1={from.position.x + px} y1={from.position.y + py} x2={to.position.x + px} y2={to.position.y + py} stroke={color} strokeWidth={2.5} style={{ filter: glow }} />
      </g>
    )
    if (bond.bondType === "triple") return (
      <g key={bond.id}>
        <line x1={from.position.x} y1={from.position.y} x2={to.position.x} y2={to.position.y} stroke={color} strokeWidth={2.5} style={{ filter: glow }} />
        <line x1={from.position.x - px * 1.5} y1={from.position.y - py * 1.5} x2={to.position.x - px * 1.5} y2={to.position.y - py * 1.5} stroke={color} strokeWidth={2} />
        <line x1={from.position.x + px * 1.5} y1={from.position.y + py * 1.5} x2={to.position.x + px * 1.5} y2={to.position.y + py * 1.5} stroke={color} strokeWidth={2} />
      </g>
    )
    if (bond.bondType === "ionic") return (
      <g key={bond.id}>
        <line x1={from.position.x} y1={from.position.y} x2={to.position.x} y2={to.position.y} stroke={color} strokeWidth={3} strokeDasharray="8 4" style={{ filter: glow }} />
        <text x={(from.position.x + to.position.x) / 2 - 16} y={(from.position.y + to.position.y) / 2 - 8} fill={color} fontSize={10} fontFamily="var(--font-mono)">δ+</text>
        <text x={(from.position.x + to.position.x) / 2 + 6}  y={(from.position.y + to.position.y) / 2 - 8} fill={color} fontSize={10} fontFamily="var(--font-mono)">δ-</text>
      </g>
    )
    return (
      <line key={bond.id} x1={from.position.x} y1={from.position.y} x2={to.position.x} y2={to.position.y} stroke={color} strokeWidth={3} style={{ filter: glow }} />
    )
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:"var(--color-bg-deep)" }}>
      {/* Header */}
      <div style={{ padding:"12px 20px", background:"var(--color-bg-panel)", borderBottom:"1px solid var(--color-border-dim)", display:"flex", alignItems:"center", gap:"16px", flexWrap:"wrap" }}>
        <span style={{ fontFamily:"var(--font-display)", fontSize:"15px", color:"var(--color-text-muted)" }}>
          Challenge {challengeIndex + 1} / {totalChallenges}
        </span>
        <span style={{ fontFamily:"var(--font-display)", fontSize:"18px", color:"var(--color-cyan)" }}>⚡ {points}pts</span>
        {streak >= 2 && <span style={{ fontSize:"15px", color:"#f59e0b" }}>🔥×{streak}</span>}

        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:"10px" }}>
          {/* Timer */}
          <div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"6px 14px", background:"var(--color-bg-card)", borderRadius:"20px", border:`1px solid ${timerColor}` }}>
            <span style={{ fontFamily:"var(--font-mono)", fontSize:"20px", color:timerColor, fontWeight:700, animation: isTimerWarn ? "var(--animate-timer-warn)" : undefined }}>
              {timeLeft}s
            </span>
          </div>
          {/* Progress bar */}
          <div style={{ width:"100px", height:"6px", background:"var(--color-border-dim)", borderRadius:"3px" }}>
            <div style={{ height:"100%", borderRadius:"3px", width:`${(timeLeft / maxTime) * 100}%`, background:timerColor, transition:"width 1s linear" }} />
          </div>
        </div>
      </div>

      {/* Instructions + bond selector */}
      <div style={{ padding:"10px 20px", background:"var(--color-bg-panel)", borderBottom:"1px solid var(--color-border-dim)", display:"flex", alignItems:"center", gap:"12px", flexWrap:"wrap" }}>
        <span style={{ fontSize:"16px", color:"var(--color-text-primary)" }}>
          Connect atoms to form <strong style={{ color:"var(--color-cyan)", fontFamily:"var(--font-mono)" }}>{molecule.formula}</strong>
        </span>

        {difficulty !== "easy" && (
          <div style={{ display:"flex", gap:"6px", marginLeft:"auto" }}>
            {BOND_TYPES.map(bt => (
              <button key={bt.type} onClick={() => setSelectedBond(bt.type)} aria-label={`${bt.label} bond`}
                style={{ padding:"5px 12px", background: selectedBond === bt.type ? "var(--color-cyan-dim)" : "var(--color-bg-card)", border:`1px solid ${selectedBond === bt.type ? "var(--color-cyan)" : "var(--color-border-dim)"}`, borderRadius:"8px", color: selectedBond === bt.type ? "var(--color-cyan)" : "var(--color-text-muted)", cursor:"pointer", fontFamily:"var(--font-mono)", fontSize:"15px" }}>
                {bt.symbol} {bt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Canvas + hints */}
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
        {/* SVG Canvas */}
        <div className="canvas-grid" style={{ flex:1, position:"relative" }}>
          {/* Result overlay */}
          {feedback !== "none" && (
            <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, background: feedback === "correct" ? "rgba(16,185,129,0.06)" : "rgba(239,68,68,0.06)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:10, pointerEvents:"none" }}>
              <div style={{ background:"var(--color-bg-card)", border:`2px solid ${feedback === "correct" ? "#10b981" : "#ef4444"}`, borderRadius:"16px", padding:"24px 36px", textAlign:"center", animation:"var(--animate-badge-pop)", pointerEvents:"all" }}>
                <div style={{ fontSize:"42px", marginBottom:"8px" }}>{feedback === "correct" ? "✅" : "❌"}</div>
                <div style={{ fontFamily:"var(--font-display)", fontSize:"20px", color: feedback === "correct" ? "#10b981" : "#ef4444", marginBottom:"4px" }}>
                  {feedback === "correct" ? "Perfect Bonds!" : "Check Your Bonds"}
                </div>
                <div style={{ fontSize:"14px", color:"var(--color-text-muted)", marginBottom:"16px" }}>
                  ✓ {correctBonds.length} correct · ✗ {wrongBonds.length} wrong · ○ {missingBonds.length} missing
                </div>
                <button onClick={onNext} style={{ padding:"10px 24px", background:"linear-gradient(135deg, var(--color-cyan), var(--color-violet))", border:"none", borderRadius:"10px", color:"#fff", cursor:"pointer", fontFamily:"var(--font-display)", fontSize:"16px", letterSpacing:"0.05em" }}>
                  Next Challenge →
                </button>
              </div>
            </div>
          )}

          <svg
            ref={svgRef}
            viewBox="0 0 700 500"
            style={{ width:"100%", height:"100%", display:"block", cursor: state.phase === "idle" ? "default" : "crosshair" }}
            aria-label={`Bond drawing canvas for ${molecule.name}`}
            onMouseMove={e => { const c = getSVGCoords(e.clientX, e.clientY); handleMouseMove(c.x, c.y) }}
            onClick={e => {
              const t = e.target as Element
              if (t === svgRef.current) handleCanvasClick()
            }}
          >
            {/* Missing bond hints (from validation) */}
            {feedback !== "none" && missingBonds.map(b => {
              const from = atomMap[b.fromAtomId], to = atomMap[b.toAtomId]
              if (!from || !to) return null
              return (
                <line key={`missing-${b.id}`}
                  x1={from.position.x} y1={from.position.y}
                  x2={to.position.x}   y2={to.position.y}
                  stroke="#f59e0b" strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
              )
            })}

            {/* Hint highlight */}
            {hintAtoms && atomMap[hintAtoms.fromId] && atomMap[hintAtoms.toId] && (
              <line
                x1={atomMap[hintAtoms.fromId]!.position.x} y1={atomMap[hintAtoms.fromId]!.position.y}
                x2={atomMap[hintAtoms.toId]!.position.x}   y2={atomMap[hintAtoms.toId]!.position.y}
                stroke="#f59e0b" strokeWidth={5} strokeDasharray="10 5" opacity={0.9}
                style={{ animation:"var(--animate-drag-line)" }}
              />
            )}

            {/* Placed bonds */}
            {placedBonds.map(renderBond)}

            {/* Drag preview */}
            {state.phase === "drawing" && atomMap[state.fromId] && (
              <line
                x1={atomMap[state.fromId]!.position.x}
                y1={atomMap[state.fromId]!.position.y}
                x2={state.mouse.x}
                y2={state.mouse.y}
                stroke="var(--color-cyan)"
                strokeWidth={2}
                strokeDasharray="8 4"
                opacity={0.7}
                style={{ animation:"var(--animate-drag-line)" }}
              />
            )}

            {/* Atoms */}
            {molecule.atoms.map(atom => {
              const r     = atom.element.atomicNumber === 1 ? 26 : 38
              const color = atom.element.color
              const astate = getAtomState(atom.id)
              const isSelected = astate === "selected"
              const ringColor  = isSelected ? "var(--color-cyan)" : astate === "correct" ? "#10b981" : astate === "missing" ? "#f59e0b" : color

              return (
                <g
                  key={atom.id}
                  onClick={e => { e.stopPropagation(); handleAtomClick(atom.id, atom.position.x, atom.position.y) }}
                  style={{ cursor:"pointer", animation: astate === "correct" ? "var(--animate-correct)" : astate === "wrong" ? "var(--animate-wrong)" : undefined }}
                  role="button"
                  aria-label={`${atom.element.name} atom`}
                >
                  <title>{atom.element.name}</title>
                  {/* Selection ring */}
                  {(isSelected || astate === "missing") && (
                    <circle cx={atom.position.x} cy={atom.position.y} r={r + 8} fill="none"
                      stroke={ringColor} strokeWidth={2} strokeDasharray={astate === "missing" ? "6 3" : undefined} opacity={0.8}
                      style={{ animation: isSelected ? "var(--animate-glow-pulse)" : undefined }} />
                  )}
                  {/* Atom body */}
                  <circle
                    cx={atom.position.x}
                    cy={atom.position.y}
                    r={r}
                    style={{
                      fill:   color,
                      fillOpacity: 0.85,
                      stroke: ringColor,
                      strokeWidth: isSelected ? 3 : 1.5,
                      filter: `drop-shadow(0 0 ${isSelected ? 14 : 8}px ${ringColor})`,
                    }}
                  />
                  {/* Symbol */}
                  <text
                    x={atom.position.x}
                    y={atom.position.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#fff"
                    fontSize={r < 30 ? 13 : 17}
                    fontWeight="bold"
                    fontFamily="var(--font-display)"
                    style={{ pointerEvents:"none", userSelect:"none" }}
                  >
                    {atom.element.symbol}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Hints sidebar */}
        <div style={{ width:"220px", flexShrink:0, background:"var(--color-bg-panel)", borderLeft:"1px solid var(--color-border-dim)", padding:"16px", display:"flex", flexDirection:"column", gap:"12px" }}>
          <h3 style={{ fontFamily:"var(--font-display)", fontSize:"14px", color:"var(--color-text-muted)", textTransform:"uppercase", letterSpacing:"0.1em" }}>
            Hints
          </h3>
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            <HintRow label="Bonds needed" value={`${molecule.connections.length}`} />
            <HintRow label="Placed"       value={`${placedBonds.length}`} />
            <HintRow label="Structure"    value={molecule.structure} />
            {molecule.bondAngle && <HintRow label="Bond angle" value={`${molecule.bondAngle}°`} />}
            <HintRow label="Hints used"   value={`${hintsUsed} (−${hintsUsed * 5}pts)`} />
          </div>

          <button
            onClick={handleHintClick}
            disabled={feedback !== "none"}
            aria-label="Reveal hint"
            style={{ padding:"10px", background: feedback !== "none" ? "var(--color-border-dim)" : "rgba(245,158,11,0.15)", border:"1px solid #f59e0b", borderRadius:"8px", color: feedback !== "none" ? "var(--color-text-muted)" : "#f59e0b", cursor: feedback !== "none" ? "not-allowed" : "pointer", fontSize:"15px", fontWeight:600 }}>
            💡 Reveal Hint (−5pts)
          </button>

          <div style={{ marginTop:"auto", display:"flex", flexDirection:"column", gap:"6px" }}>
            <button onClick={onRemoveLast} disabled={placedBonds.length === 0 || feedback !== "none"}
              aria-label="Remove last bond"
              style={{ padding:"8px", background:"var(--color-bg-card)", border:"1px solid var(--color-border-dim)", borderRadius:"8px", color:"var(--color-text-muted)", cursor: placedBonds.length === 0 ? "not-allowed" : "pointer", fontSize:"14px" }}>
              ↩ Undo Last Bond
            </button>
            <button onClick={onCheck} disabled={placedBonds.length === 0 || feedback !== "none"}
              aria-label="Check my bonds"
              style={{ padding:"10px", background: placedBonds.length > 0 && feedback === "none" ? "linear-gradient(135deg, var(--color-cyan), var(--color-violet))" : "var(--color-border-dim)", border:"none", borderRadius:"8px", color: placedBonds.length > 0 && feedback === "none" ? "#fff" : "var(--color-text-muted)", cursor: placedBonds.length === 0 || feedback !== "none" ? "not-allowed" : "pointer", fontFamily:"var(--font-display)", fontSize:"15px", letterSpacing:"0.05em" }}>
              ✓ Check My Bonds
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function HintRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid var(--color-border-dim)" }}>
      <span style={{ fontSize:"11px", color:"var(--color-text-muted)", textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</span>
      <span style={{ fontSize:"12px", color:"var(--color-text-primary)", fontFamily:"var(--font-mono)" }}>{value}</span>
    </div>
  )
}
