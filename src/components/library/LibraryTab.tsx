import { useState } from "react"
import type { Molecule } from "@/types/chemistry"
import { MOLECULES } from "@/data/molecules"

interface LibraryTabProps {
  searchQuery:    string
  onViewMolecule: (id: string) => void
  onQuizMolecule: (id: string) => void
}

type Filter = "all" | "easy" | "medium" | "hard" | "covalent" | "ionic" | "organic"

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all",      label: "All" },
  { id: "easy",     label: "Easy" },
  { id: "medium",   label: "Medium" },
  { id: "hard",     label: "Hard" },
  { id: "covalent", label: "Covalent" },
  { id: "ionic",    label: "Ionic" },
  { id: "organic",  label: "Organic" },
]

const DIFF_COLORS: Record<string, string> = {
  easy:   "#10b981",
  medium: "#f59e0b",
  hard:   "#ef4444",
}

function MiniMolecule({ molecule }: { molecule: Molecule }) {
  const cx = 60, cy = 40
  const atoms = molecule.atoms.slice(0, 5)

  return (
    <svg width="120" height="80" viewBox="0 0 120 80" aria-hidden="true">
      {molecule.connections.slice(0, 6).map(conn => {
        const from = atoms.find(a => a.id === conn.fromAtomId)
        const to   = atoms.find(a => a.id === conn.toAtomId)
        if (!from || !to) return null
        const scale = 0.17
        const fx = cx + (from.position.x - 350) * scale
        const fy = cy + (from.position.y - 250) * scale
        const tx = cx + (to.position.x   - 350) * scale
        const ty = cy + (to.position.y   - 250) * scale
        return (
          <line key={conn.id} x1={fx} y1={fy} x2={tx} y2={ty}
            stroke="#00d4ff" strokeWidth={1.5} opacity={0.7} />
        )
      })}
      {atoms.map(atom => {
        const scale = 0.17
        const ax = cx + (atom.position.x - 350) * scale
        const ay = cy + (atom.position.y - 250) * scale
        const r  = atom.element.atomicNumber === 1 ? 5 : 8
        return (
          <g key={atom.id}>
            <circle cx={ax} cy={ay} r={r}
              fill={atom.element.color} opacity={0.85} />
            <text x={ax} y={ay} textAnchor="middle" dominantBaseline="central"
              fontSize={r < 6 ? 5 : 7} fill="#fff" fontWeight="bold">
              {atom.element.symbol}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export function LibraryTab({ searchQuery, onViewMolecule, onQuizMolecule }: LibraryTabProps) {
  const [activeFilter, setActiveFilter] = useState<Filter>("all")

  const filtered = MOLECULES.filter(mol => {
    const matchSearch = searchQuery === "" ||
      mol.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mol.formula.toLowerCase().includes(searchQuery.toLowerCase())

    const matchFilter =
      activeFilter === "all"      ? true :
      activeFilter === "easy"     ? mol.difficulty === "easy" :
      activeFilter === "medium"   ? mol.difficulty === "medium" :
      activeFilter === "hard"     ? mol.difficulty === "hard" :
      activeFilter === "covalent" ? mol.category === "covalent" :
      activeFilter === "ionic"    ? mol.category === "ionic" :
      activeFilter === "organic"  ? mol.category === "organic" : true

    return matchSearch && matchFilter
  })

  return (
    <div style={{ padding:"24px", background:"var(--color-bg-deep)", minHeight:"calc(100vh - 104px)" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"20px" }}>
        <h2 style={{
          fontFamily:    "var(--font-display)",
          fontSize:      "20px",
          color:         "var(--color-cyan)",
          letterSpacing: "0.05em",
        }}>
          Molecule Library
        </h2>
        <span style={{ fontSize:"13px", color:"var(--color-text-muted)" }}>
          {filtered.length} molecules
        </span>
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:"8px", marginBottom:"20px", flexWrap:"wrap" }}>
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            aria-label={`Filter by ${f.label}`}
            style={{
              padding:      "6px 14px",
              background:   activeFilter === f.id ? "var(--color-cyan-dim)" : "var(--color-bg-card)",
              border:       `1px solid ${activeFilter === f.id ? "var(--color-cyan)" : "var(--color-border-dim)"}`,
              borderRadius: "20px",
              color:        activeFilter === f.id ? "var(--color-cyan)" : "var(--color-text-muted)",
              cursor:       "pointer",
              fontSize:     "13px",
              fontWeight:   activeFilter === f.id ? 600 : 400,
              transition:   "all 0.15s",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{
        display:             "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap:                 "16px",
      }}>
        {filtered.map(mol => (
          <div
            key={mol.id}
            className="neon-border"
            style={{
              background:    "var(--color-bg-card)",
              borderRadius:  "12px",
              padding:       "16px",
              display:       "flex",
              flexDirection: "column",
              gap:           "10px",
              transition:    "transform 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "none")}
          >
            {/* Mini preview */}
            <div style={{ display:"flex", justifyContent:"center", background:"var(--color-bg-deep)", borderRadius:"8px", padding:"8px" }}>
              <MiniMolecule molecule={mol} />
            </div>

            {/* Info */}
            <div>
              <div style={{ fontFamily:"var(--font-display)", fontSize:"14px", color:"var(--color-text-primary)" }}>
                {mol.name}
              </div>
              <div style={{ fontFamily:"var(--font-mono)", fontSize:"13px", color:"var(--color-cyan)", marginTop:"2px" }}>
                {mol.formula}
              </div>
            </div>

            {/* Badges */}
            <div style={{ display:"flex", gap:"4px", flexWrap:"wrap" }}>
              <span style={{
                fontSize:     "10px",
                padding:      "2px 8px",
                background:   (DIFF_COLORS[mol.difficulty] ?? "#fff") + "22",
                border:       `1px solid ${DIFF_COLORS[mol.difficulty] ?? "#fff"}`,
                color:        DIFF_COLORS[mol.difficulty],
                borderRadius: "10px",
              }}>
                {mol.difficulty}
              </span>
              <span style={{
                fontSize:     "10px",
                padding:      "2px 8px",
                background:   "var(--color-bg-deep)",
                border:       "1px solid var(--color-border-dim)",
                color:        "var(--color-text-muted)",
                borderRadius: "10px",
              }}>
                {mol.structure}
              </span>
            </div>

            {/* Actions */}
            <div style={{ display:"flex", gap:"6px" }}>
              <button
                onClick={() => onViewMolecule(mol.id)}
                aria-label={`View ${mol.name}`}
                style={{
                  flex:         1,
                  padding:      "6px",
                  background:   "var(--color-bg-deep)",
                  border:       "1px solid var(--color-border-dim)",
                  borderRadius: "6px",
                  color:        "var(--color-text-muted)",
                  cursor:       "pointer",
                  fontSize:     "12px",
                }}
              >
                👁 View
              </button>
              <button
                onClick={() => onQuizMolecule(mol.id)}
                aria-label={`Quiz on ${mol.name}`}
                style={{
                  flex:         1,
                  padding:      "6px",
                  background:   "var(--color-cyan-dim)",
                  border:       "1px solid var(--color-cyan)",
                  borderRadius: "6px",
                  color:        "var(--color-cyan)",
                  cursor:       "pointer",
                  fontSize:     "12px",
                  fontWeight:   600,
                }}
              >
                🧠 Quiz
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign:"center", padding:"60px 0", color:"var(--color-text-muted)" }}>
          No molecules match your search.
        </div>
      )}
    </div>
  )
}
