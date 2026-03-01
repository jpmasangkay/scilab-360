import type { Molecule } from "@/types/chemistry"
import { Badge } from "@/components/ui/badge"

interface PropertiesPanelProps {
  molecule:      Molecule
  onSendToQuiz?: (id: string) => void
}

const DIFF_COLORS: Record<string, string> = {
  easy:   "#10b981",
  medium: "#f59e0b",
  hard:   "#ef4444",
}

const STRUCT_LABELS: Record<string, string> = {
  "bent":                "Bent",
  "linear":              "Linear",
  "trigonal-pyramidal":  "Trigonal Pyramidal",
  "tetrahedral":         "Tetrahedral",
  "trigonal-planar":     "Trigonal Planar",
  "octahedral":          "Octahedral",
  "square-planar":       "Square Planar",
  "seesaw":              "Seesaw",
  "t-shaped":            "T-Shaped",
  "trigonal-bipyramidal":"Trigonal Bipyramidal",
}

export function PropertiesPanel({ molecule, onSendToQuiz }: PropertiesPanelProps) {
  const bondTypes = [...new Set(molecule.connections.map(c => c.bondType))]
    .map(bt => bt.charAt(0).toUpperCase() + bt.slice(1))
    .join(", ")

  const elements = [...new Set(molecule.atoms.map(a => a.element))]

  return (
    <div style={{ padding:"20px" }}>
      {/* Header */}
      <div style={{ marginBottom:"20px" }}>
        <h2 style={{
          fontFamily:   "var(--font-display)",
          fontSize:     "22px",
          color:        "var(--color-cyan)",
          marginBottom: "4px",
        }}>
          {molecule.name}
        </h2>
        <div style={{
          fontFamily: "var(--font-mono)",
          fontSize:   "18px",
          color:      "var(--color-text-muted)",
          marginBottom: "10px",
        }}>
          {molecule.formula}
        </div>
        <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
          <span style={{
            background:   DIFF_COLORS[molecule.difficulty] + "22",
            border:       `1px solid ${DIFF_COLORS[molecule.difficulty]}`,
            color:        DIFF_COLORS[molecule.difficulty],
            borderRadius: "12px",
            padding:      "2px 10px",
            fontSize:     "13px",
            fontWeight:   600,
          }}>
            {molecule.difficulty.toUpperCase()}
          </span>
          <span style={{
            background:   "var(--color-cyan-dim)",
            border:       "1px solid var(--color-border-dim)",
            color:        "var(--color-text-muted)",
            borderRadius: "12px",
            padding:      "2px 10px",
            fontSize:     "13px",
          }}>
            {molecule.category}
          </span>
        </div>
      </div>

      {/* Properties */}
      <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
        <Row label="Structure"  value={STRUCT_LABELS[molecule.structure] ?? molecule.structure} />
        {molecule.bondAngle && <Row label="Bond Angle" value={`${molecule.bondAngle}°`} />}
        <Row label="Bond Types" value={bondTypes} />
        <Row label="Atom Count" value={`${molecule.atoms.length}`} />
        <Row label="Bonds"      value={`${molecule.connections.length}`} />

        {/* Description */}
        <div>
          <div style={{ fontSize:"13px", color:"var(--color-text-muted)", marginBottom:"4px", textTransform:"uppercase", letterSpacing:"0.08em" }}>
            Description
          </div>
          <p style={{ fontSize:"15px", color:"var(--color-text-primary)", lineHeight:"1.6" }}>
            {molecule.description}
          </p>
        </div>

        {/* Elements */}
        <div>
          <div style={{ fontSize:"13px", color:"var(--color-text-muted)", marginBottom:"8px", textTransform:"uppercase", letterSpacing:"0.08em" }}>
            Elements
          </div>
          {elements.map(el => (
            <div key={el.symbol} style={{
              display:       "flex",
              alignItems:    "center",
              gap:           "8px",
              marginBottom:  "6px",
              padding:       "8px",
              background:    "var(--color-bg-deep)",
              borderRadius:  "8px",
              border:        "1px solid var(--color-border-dim)",
            }}>
              <div style={{
                width:        "36px",
                height:       "36px",
                borderRadius: "6px",
                background:   el.color + "22",
                border:       `1px solid ${el.color}`,
                display:      "flex",
                alignItems:   "center",
                justifyContent:"center",
                fontFamily:   "var(--font-display)",
                fontSize:     "16px",
                fontWeight:   700,
                color:        el.color,
              }}>
                {el.symbol}
              </div>
              <div>
                <div style={{ fontSize:"14px", color:"var(--color-text-primary)" }}>{el.name}</div>
                <div style={{ fontSize:"12px", color:"var(--color-text-muted)", fontFamily:"var(--font-mono)" }}>
                  {el.electronConfig}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reaction timeline */}
        <div>
          <div style={{ fontSize:"13px", color:"var(--color-text-muted)", marginBottom:"8px", textTransform:"uppercase", letterSpacing:"0.08em" }}>
            Formation
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"6px", flexWrap:"wrap" }}>
            {molecule.atoms.map((atom, i) => (
              <span key={atom.id}>
                <span style={{
                  padding:      "2px 8px",
                  background:   atom.element.color + "22",
                  border:       `1px solid ${atom.element.color}`,
                  borderRadius: "6px",
                  fontSize:     "14px",
                  color:        atom.element.color,
                  fontFamily:   "var(--font-display)",
                }}>
                  {atom.element.symbol}
                </span>
                {i < molecule.atoms.length - 1 && (
                  <span style={{ color:"var(--color-text-muted)", margin:"0 4px" }}>+</span>
                )}
              </span>
            ))}
            <span style={{ color:"var(--color-text-muted)", margin:"0 4px" }}>→</span>
            <span style={{
              padding:      "2px 10px",
              background:   "var(--color-cyan-dim)",
              border:       "1px solid var(--color-cyan)",
              borderRadius: "6px",
              fontSize:     "14px",
              color:        "var(--color-cyan)",
              fontFamily:   "var(--font-display)",
            }}>
              {molecule.formula}
            </span>
          </div>
        </div>

        {/* Quiz button */}
        {onSendToQuiz && (
          <button
            onClick={() => onSendToQuiz(molecule.id)}
            aria-label={`Quiz me on ${molecule.name}`}
            style={{
              width:        "100%",
              padding:      "10px",
              background:   "var(--color-cyan-dim)",
              border:       "1px solid var(--color-cyan)",
              borderRadius: "8px",
              color:        "var(--color-cyan)",
              cursor:       "pointer",
              fontFamily:   "var(--font-display)",
              fontSize:     "15px",
              letterSpacing:"0.05em",
              marginTop:    "4px",
            }}
          >
            🧠 Quiz Me on This Molecule
          </button>
        )}
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
      <span style={{ fontSize:"14px", color:"var(--color-text-muted)", textTransform:"uppercase", letterSpacing:"0.06em" }}>
        {label}
      </span>
      <span style={{ fontSize:"15px", color:"var(--color-text-primary)", fontFamily:"var(--font-mono)", textAlign:"right", maxWidth:"60%" }}>
        {value}
      </span>
    </div>
  )
}
