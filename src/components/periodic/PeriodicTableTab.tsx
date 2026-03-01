import { useState } from "react"
import type { ChemElement } from "@/types/chemistry"
import { ELEMENTS, CATEGORY_COLORS } from "@/data/elements"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface PeriodicTableTabProps {
  searchQuery: string
}

const CATEGORY_LABELS: Record<string, string> = {
  "nonmetal":         "Nonmetal",
  "noble-gas":        "Noble Gas",
  "alkali-metal":     "Alkali Metal",
  "alkaline-earth":   "Alkaline Earth",
  "transition-metal": "Transition Metal",
  "post-transition":  "Post-Transition",
  "metalloid":        "Metalloid",
  "halogen":          "Halogen",
  "lanthanide":       "Lanthanide",
  "actinide":         "Actinide",
}

function ElementTile({
  element, isHighlighted, onClick,
}: {
  element: ChemElement
  isHighlighted: boolean
  onClick: () => void
}) {
  const color   = CATEGORY_COLORS[element.category] ?? "#6366f1"
  const dimmed  = element.atomicNumber > 112
  const isSuperHeavy = element.atomicNumber > 112

  return (
    <button
      onClick={onClick}
      aria-label={`${element.name}, atomic number ${element.atomicNumber}`}
      style={{
        gridColumn: element.gridCol,
        gridRow:    element.gridRow,
        width:         "100%",
        aspectRatio:   "1 / 1.15",
        padding:       "2px",
        background:    isHighlighted
          ? color + "40"
          : color + "18",
        border:        `1px solid ${isHighlighted ? color : "transparent"}`,
        borderRadius:  "4px",
        cursor:        "pointer",
        transition:    "all 0.15s",
        display:       "flex",
        flexDirection: "column",
        alignItems:    "center",
        justifyContent:"space-between",
        opacity:       dimmed ? 0.55 : 1,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform   = "scale(1.18)"
        e.currentTarget.style.zIndex      = "50"
        e.currentTarget.style.borderColor = "var(--color-cyan)"
        e.currentTarget.style.background  = color + "40"
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform   = "scale(1)"
        e.currentTarget.style.zIndex      = "0"
        e.currentTarget.style.borderColor = isHighlighted ? color : "transparent"
        e.currentTarget.style.background  = isHighlighted ? color + "40" : color + "18"
      }}
    >
      <span style={{ fontSize:"9px", color:"var(--color-text-muted)", alignSelf:"flex-start", paddingLeft:"2px" }}>
        {element.atomicNumber}
      </span>
      <span style={{
        fontSize:   "clamp(12px, 1.4vw, 18px)",
        fontWeight: 700,
        color,
        fontFamily: "var(--font-display)",
        fontStyle:  isSuperHeavy ? "italic" : "normal",
      }}>
        {element.symbol}
      </span>
      <span style={{ fontSize:"clamp(6px, 0.65vw, 9px)", color:"var(--color-text-muted)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", width:"100%", textAlign:"center" }}>
        {element.name.length > 8 ? element.name.slice(0,7) + "…" : element.name}
      </span>
      <span style={{ fontSize:"clamp(6px, 0.65vw, 9px)", color:"var(--color-text-muted)" }}>
        {element.atomicMass.toFixed(1)}
      </span>
    </button>
  )
}

function ElementDialog({
  element,
  open,
  onClose,
}: {
  element: ChemElement | null
  open:    boolean
  onClose: () => void
}) {
  if (!element) return null
  const color = CATEGORY_COLORS[element.category] ?? "#6366f1"

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent style={{
        background:   "var(--color-bg-card)",
        border:       "1px solid var(--color-border-dim)",
        color:        "var(--color-text-primary)",
        maxWidth:     "520px",
      }}>
        <DialogHeader>
          <DialogTitle style={{ display:"flex", alignItems:"center", gap:"16px" }}>
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize:   "80px",
              color,
              lineHeight: 1,
              textShadow: `0 0 24px ${color}`,
            }}>
              {element.symbol}
            </span>
            <div>
              <div style={{ fontFamily:"var(--font-display)", fontSize:"26px", color:"var(--color-text-primary)" }}>
                {element.name}
              </div>
              <div style={{ display:"flex", gap:"6px", marginTop:"6px" }}>
                <span style={{
                  background:   color + "22",
                  border:       `1px solid ${color}`,
                  color,
                  borderRadius: "12px",
                  padding:      "3px 12px",
                  fontSize:     "13px",
                }}>
                  {CATEGORY_LABELS[element.category]}
                </span>
                <span style={{
                  background:   "var(--color-bg-deep)",
                  border:       "1px solid var(--color-border-dim)",
                  color:        "var(--color-text-muted)",
                  borderRadius: "12px",
                  padding:      "3px 12px",
                  fontSize:     "13px",
                }}>
                  {element.stateAtRoom}
                </span>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginTop:"16px" }}>
          <InfoRow label="Atomic Number"     value={`${element.atomicNumber}`} />
          <InfoRow label="Atomic Mass"       value={`${element.atomicMass}`} />
          <InfoRow label="Period"            value={`${element.period}`} />
          <InfoRow label="Group"             value={element.group ? `${element.group}` : "—"} />
          <InfoRow label="Valence e⁻"        value={`${element.valenceElectrons}`} />
          <InfoRow label="Electronegativity" value={element.electronegativity ? `${element.electronegativity}` : "—"} />
        </div>

        <div style={{ marginTop:"12px" }}>
          <div style={{ fontSize:"12px", color:"var(--color-text-muted)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"6px" }}>
            Electron Configuration
          </div>
          <div style={{ fontFamily:"var(--font-mono)", fontSize:"14px", color:"var(--color-cyan)", padding:"8px 12px", background:"var(--color-bg-deep)", borderRadius:"6px" }}>
            {element.electronConfig}
          </div>
        </div>

        {element.commonBonds.length > 0 && (
          <div style={{ marginTop:"12px" }}>
            <div style={{ fontSize:"12px", color:"var(--color-text-muted)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"8px" }}>
              Common Bonds
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
              {element.commonBonds.map(bond => (
                <span key={bond} style={{
                  fontFamily:   "var(--font-mono)",
                  fontSize:     "13px",
                  padding:      "4px 12px",
                  background:   color + "18",
                  border:       `1px solid ${color}44`,
                  borderRadius: "6px",
                  color:        color,
                }}>
                  {bond}
                </span>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      padding:      "10px 12px",
      background:   "var(--color-bg-deep)",
      borderRadius: "6px",
      border:       "1px solid var(--color-border-dim)",
    }}>
      <div style={{ fontSize:"11px", color:"var(--color-text-muted)", textTransform:"uppercase", letterSpacing:"0.06em" }}>
        {label}
      </div>
      <div style={{ fontFamily:"var(--font-mono)", fontSize:"16px", color:"var(--color-text-primary)", marginTop:"2px" }}>
        {value}
      </div>
    </div>
  )
}

export function PeriodicTableTab({ searchQuery }: PeriodicTableTabProps) {
  const [selected, setSelected] = useState<ChemElement | null>(null)

  const q = searchQuery.toLowerCase()
  const highlighted = new Set(
    q
      ? ELEMENTS
          .filter(e =>
            e.name.toLowerCase().includes(q) ||
            e.symbol.toLowerCase().includes(q) ||
            e.category.includes(q)
          )
          .map(e => e.symbol)
      : []
  )

  return (
    <div style={{
      overflow:   "auto",
      padding:    "24px",
      background: "var(--color-bg-deep)",
      minHeight:  "calc(100vh - 104px)",
      display:    "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      <div style={{ width: "100%", maxWidth: "1100px" }}>
        <h2 style={{
          fontFamily:    "var(--font-display)",
          fontSize:      "24px",
          color:         "var(--color-cyan)",
          marginBottom:  "20px",
          letterSpacing: "0.05em",
        }}>
          Periodic Table of Elements
        </h2>

        {/* Main Grid */}
        <div style={{
          display:             "grid",
          gridTemplateColumns: "repeat(18, 1fr)",
          gap:                 "2px",
          width:               "100%",
          paddingBottom:       "4px",
        }}>
          {ELEMENTS.filter(e => e.gridRow <= 7).map(el => (
            <ElementTile
              key={el.symbol}
              element={el}
              isHighlighted={highlighted.has(el.symbol)}
              onClick={() => setSelected(el)}
            />
          ))}
        </div>

        {/* Lanthanide/Actinide gap label */}
        <div style={{ display:"flex", alignItems:"center", margin:"16px 0 8px 0", gap:"12px" }}>
          <div style={{ width:"90px", fontSize:"11px", color:"var(--color-text-muted)", textAlign:"right", letterSpacing:"0.06em", flexShrink: 0 }}>
            LANTHANIDES
          </div>
          <div style={{
            display:             "grid",
            gridTemplateColumns: "repeat(15, 1fr)",
            gap:                 "2px",
            flex:                1,
          }}>
            {ELEMENTS.filter(e => e.gridRow === 8).map(el => (
              <ElementTile
                key={el.symbol}
                element={el}
                isHighlighted={highlighted.has(el.symbol)}
                onClick={() => setSelected(el)}
              />
            ))}
          </div>
        </div>

        <div style={{ display:"flex", alignItems:"center", margin:"4px 0 24px 0", gap:"12px" }}>
          <div style={{ width:"90px", fontSize:"11px", color:"var(--color-text-muted)", textAlign:"right", letterSpacing:"0.06em", flexShrink: 0 }}>
            ACTINIDES
          </div>
          <div style={{
            display:             "grid",
            gridTemplateColumns: "repeat(15, 1fr)",
            gap:                 "2px",
            flex:                1,
          }}>
            {ELEMENTS.filter(e => e.gridRow === 9).map(el => (
              <ElementTile
                key={el.symbol}
                element={el}
                isHighlighted={highlighted.has(el.symbol)}
                onClick={() => setSelected(el)}
              />
            ))}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:"10px", justifyContent:"center" }}>
          {Object.entries(CATEGORY_LABELS).map(([cat, label]) => (
            <div key={cat} style={{ display:"flex", alignItems:"center", gap:"6px" }}>
              <div style={{
                width:        "14px",
                height:       "14px",
                borderRadius: "3px",
                background:   (CATEGORY_COLORS[cat] ?? "#fff") + "40",
                border:       `1px solid ${CATEGORY_COLORS[cat] ?? "#fff"}`,
              }} />
              <span style={{ fontSize:"12px", color:"var(--color-text-muted)" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <ElementDialog
        element={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </div>
  )
}
