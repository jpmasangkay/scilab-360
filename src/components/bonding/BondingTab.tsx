import { useState } from "react"
import type { Molecule } from "@/types/chemistry"
import { MOLECULES } from "@/data/molecules"
import { MoleculeCanvas } from "./MoleculeCanvas"
import { PropertiesPanel } from "./PropertiesPanel"

interface BondingTabProps {
  searchQuery: string
  onSendToQuiz?: (moleculeId: string) => void
}

export function BondingTab({ searchQuery, onSendToQuiz }: BondingTabProps) {
  const [selected, setSelected] = useState<Molecule>(MOLECULES[0]!)

  const filtered = MOLECULES.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.formula.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div style={{ display:"flex", height:"100%", overflow:"hidden" }}>
      {/* Left Sidebar */}
      <aside style={{
        width:        "256px",
        flexShrink:   0,
        background:   "var(--color-bg-panel)",
        borderRight:  "1px solid var(--color-border-dim)",
        overflowY:    "auto",
        padding:      "16px",
      }}>
        <h3 style={{
          fontFamily:    "var(--font-display)",
          fontSize:      "13px",
          letterSpacing: "0.12em",
          color:         "var(--color-text-muted)",
          marginBottom:  "12px",
          textTransform: "uppercase",
        }}>
          Molecules
        </h3>
        {filtered.map(mol => (
          <button
            key={mol.id}
            onClick={() => setSelected(mol)}
            aria-label={`Select ${mol.name}`}
            style={{
              display:       "flex",
              flexDirection: "column",
              alignItems:    "flex-start",
              width:         "100%",
              padding:       "10px 12px",
              marginBottom:  "4px",
              background:    mol.id === selected.id
                ? "var(--color-cyan-dim)"
                : "transparent",
              border:        "1px solid",
              borderColor:   mol.id === selected.id
                ? "var(--color-cyan)"
                : "transparent",
              borderRadius:  "8px",
              cursor:        "pointer",
              textAlign:     "left",
              transition:    "all 0.15s",
            }}
          >
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize:   "15px",
              color:      mol.id === selected.id
                ? "var(--color-cyan)"
                : "var(--color-text-primary)",
            }}>
              {mol.formula}
            </span>
            <span style={{ fontSize:"13px", color:"var(--color-text-muted)" }}>
              {mol.name}
            </span>
          </button>
        ))}
      </aside>

      {/* Canvas */}
      <main style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
        <MoleculeCanvas molecule={selected} />
      </main>

      {/* Right Properties */}
      <aside style={{
        width:       "288px",
        flexShrink:  0,
        background:  "var(--color-bg-panel)",
        borderLeft:  "1px solid var(--color-border-dim)",
        overflowY:   "auto",
      }}>
        <PropertiesPanel molecule={selected} onSendToQuiz={onSendToQuiz} />
      </aside>
    </div>
  )
}
