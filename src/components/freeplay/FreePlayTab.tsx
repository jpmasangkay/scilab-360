import { useState, useRef, useCallback } from "react"
import { v4 as uuid } from "uuid"
import type { ChemElement, BondType } from "@/types/chemistry"
import type { CanvasAtom, CanvasBond, FreeMolecule, CanvasTransform } from "@/types/freeplay"
import { ELEMENTS, CATEGORY_COLORS } from "@/data/elements"
import { analyzeMolecule } from "@/utils/moleculeAnalysis"
import { safeParseMolecules, FreeMoleculeSchema } from "@/schemas/validation"
import { exportSVG } from "@/utils/svgExport"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { toast } from "sonner"

const BOND_TYPES: { type: BondType; symbol: string; label: string }[] = [
  { type:"single",  symbol:"─", label:"Single" },
  { type:"double",  symbol:"═", label:"Double" },
  { type:"triple",  symbol:"≡", label:"Triple" },
  { type:"ionic",   symbol:"⊕", label:"Ionic" },
]

export function FreePlayTab() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [atoms,    setAtoms]    = useState<CanvasAtom[]>([])
  const [bonds,    setBonds]    = useState<CanvasBond[]>([])
  const [transform, setTransform] = useState<CanvasTransform>({ x:0, y:0, scale:1 })
  const [selectedBondType, setSelectedBondType] = useState<BondType>("single")
  const [draggingAtom, setDraggingAtom] = useState<string | null>(null)
  const [fromAtom,     setFromAtom]     = useState<string | null>(null)
  const [mousePos,     setMousePos]     = useState({ x:0, y:0 })
  const [drawingBond,  setDrawingBond]  = useState(false)
  const [isPanning,    setIsPanning]    = useState(false)
  const [panStart,     setPanStart]     = useState({ x:0, y:0 })
  const [saveName,     setSaveName]     = useState("")
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [search,       setSearch]       = useState("")
  const [saved, setSaved] = useLocalStorage<FreeMolecule[]>(
    "chembond_molecules", [], safeParseMolecules
  )

  const getSVGCoords = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return { x:0, y:0 }
    const pt = svgRef.current.createSVGPoint()
    pt.x = clientX
    pt.y = clientY
    const t = pt.matrixTransform(svgRef.current.getScreenCTM()!.inverse())
    return { x: t.x, y: t.y }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const symbol = e.dataTransfer.getData("text/plain")
    const el     = ELEMENTS.find(el => el.symbol === symbol)
    if (!el) return
    const coords = getSVGCoords(e.clientX, e.clientY)
    const newAtom: CanvasAtom = {
      id:     uuid(),
      symbol: el.symbol,
      x:      (coords.x - transform.x) / transform.scale,
      y:      (coords.y - transform.y) / transform.scale,
      color:  el.color,
    }
    setAtoms(prev => [...prev, newAtom])
  }, [getSVGCoords, transform])

  const handleAtomMouseDown = useCallback((e: React.MouseEvent, atomId: string) => {
    e.stopPropagation()
    if (e.button === 0) {
      if (fromAtom === null) {
        setFromAtom(atomId)
        setDrawingBond(true)
      } else if (fromAtom !== atomId) {
        // Place bond
        const exists = bonds.some(b =>
          (b.fromId === fromAtom && b.toId === atomId) ||
          (b.fromId === atomId   && b.toId === fromAtom)
        )
        if (!exists) {
          setBonds(prev => [...prev, { id:uuid(), fromId:fromAtom, toId:atomId, type:selectedBondType }])
          toast(`Bond placed: ${selectedBondType}`, { duration: 1000 })
        }
        setFromAtom(null)
        setDrawingBond(false)
      } else {
        setFromAtom(null)
        setDrawingBond(false)
      }
    }
  }, [fromAtom, bonds, selectedBondType])

  const handleAtomDrag = useCallback((e: React.MouseEvent, atomId: string) => {
    if (e.buttons !== 2) return
    const coords = getSVGCoords(e.clientX, e.clientY)
    setAtoms(prev => prev.map(a =>
      a.id === atomId ? { ...a, x: coords.x, y: coords.y } : a
    ))
  }, [getSVGCoords])

  const deleteAtom = useCallback((atomId: string) => {
    setAtoms(prev => prev.filter(a => a.id !== atomId))
    setBonds(prev => prev.filter(b => b.fromId !== atomId && b.toId !== atomId))
  }, [])

  const handleSVGMouseMove = useCallback((e: React.MouseEvent) => {
    const coords = getSVGCoords(e.clientX, e.clientY)
    setMousePos(coords)
    if (isPanning) {
      const dx = e.clientX - panStart.x
      const dy = e.clientY - panStart.y
      setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }))
      setPanStart({ x: e.clientX, y: e.clientY })
    }
  }, [getSVGCoords, isPanning, panStart])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setTransform(prev => ({
      ...prev,
      scale: Math.min(4, Math.max(0.25, prev.scale * delta))
    }))
  }, [])

  const handleSave = () => {
    if (!saveName.trim()) return
    try {
      const mol: FreeMolecule = {
        id:      uuid(),
        name:    saveName.trim(),
        atoms,
        bonds,
        savedAt: new Date().toISOString(),
      }
      FreeMoleculeSchema.parse(mol)
      setSaved(prev => [...prev, mol])
      toast(`💾 "${mol.name}" saved!`)
      setSaveName("")
      setShowSaveDialog(false)
    } catch {
      toast.error("Invalid molecule data")
    }
  }

  const loadMolecule = (mol: FreeMolecule) => {
    setAtoms(mol.atoms)
    setBonds(mol.bonds)
    toast(`Loaded "${mol.name}"`)
  }

  const deleteSaved = (id: string) => {
    setSaved(prev => prev.filter(m => m.id !== id))
    toast("Molecule deleted")
  }

  const analysis   = analyzeMolecule(atoms, bonds)
  const atomMap    = Object.fromEntries(atoms.map(a => [a.id, a]))
  const filtered   = ELEMENTS.filter(e =>
    search === "" ||
    e.symbol.toLowerCase().includes(search.toLowerCase()) ||
    e.name.toLowerCase().includes(search.toLowerCase())
  )

  // Group by category
  const byCategory: Record<string, typeof ELEMENTS> = {}
  for (const el of filtered) {
    if (!byCategory[el.category]) byCategory[el.category] = []
    byCategory[el.category]!.push(el)
  }

  return (
    <div style={{ display:"flex", height:"100%", overflow:"hidden", background:"var(--color-bg-deep)" }}>
      {/* Element Palette */}
      <aside style={{ width:"224px", flexShrink:0, background:"var(--color-bg-panel)", borderRight:"1px solid var(--color-border-dim)", display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ padding:"12px" }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search elements…"
            aria-label="Search elements"
            style={{ width:"100%", padding:"8px 12px", background:"var(--color-bg-card)", border:"1px solid var(--color-border-dim)", borderRadius:"6px", color:"var(--color-text-primary)", fontSize:"15px", outline:"none" }}
          />
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"0 12px 12px" }}>
          {Object.entries(byCategory).map(([cat, els]) => (
            <div key={cat} style={{ marginBottom:"12px" }}>
              <div style={{ fontSize:"13px", color:"var(--color-text-muted)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"6px" }}>{cat}</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"4px" }}>
                {els.map(el => (
                  <div
                    key={el.symbol}
                    draggable
                    onDragStart={e => e.dataTransfer.setData("text/plain", el.symbol)}
                    title={`${el.name} (${el.symbol})`}
                    style={{
                      width:        "42px",
                      height:       "42px",
                      background:   el.color + "22",
                      border:       `1px solid ${el.color}44`,
                      borderRadius: "6px",
                      display:      "flex",
                      alignItems:   "center",
                      justifyContent:"center",
                      cursor:       "grab",
                      fontFamily:   "var(--font-display)",
                      fontSize:     "15px",
                      color:        el.color,
                      fontWeight:   700,
                      userSelect:   "none",
                    }}
                  >
                    {el.symbol}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Canvas */}
      <main style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Toolbar */}
        <div style={{ padding:"8px 12px", background:"var(--color-bg-panel)", borderBottom:"1px solid var(--color-border-dim)", display:"flex", alignItems:"center", gap:"6px", flexWrap:"wrap" }}>
          <span style={{ fontSize:"15px", color:"var(--color-text-muted)", marginRight:"4px" }}>Bond:</span>
          {BOND_TYPES.map(bt => (
            <button key={bt.type} onClick={() => setSelectedBondType(bt.type)}
              aria-label={`Select ${bt.label} bond`}
              style={{ padding:"5px 10px", background: selectedBondType === bt.type ? "var(--color-cyan-dim)" : "var(--color-bg-card)", border:`1px solid ${selectedBondType === bt.type ? "var(--color-cyan)" : "var(--color-border-dim)"}`, borderRadius:"6px", color: selectedBondType === bt.type ? "var(--color-cyan)" : "var(--color-text-muted)", cursor:"pointer", fontFamily:"var(--font-mono)", fontSize:"16px" }}>
              {bt.symbol}
            </button>
          ))}
          <div style={{ width:"1px", height:"20px", background:"var(--color-border-dim)", margin:"0 4px" }} />
          <button onClick={() => { setAtoms([]); setBonds([]); toast("Canvas cleared") }}
            aria-label="Clear canvas"
            style={{ padding:"5px 10px", background:"var(--color-bg-card)", border:"1px solid var(--color-border-dim)", borderRadius:"6px", color:"var(--color-text-muted)", cursor:"pointer", fontSize:"15px" }}>
            ⬜ Clear
          </button>
          <button onClick={() => setBonds(prev => prev.slice(0,-1))}
            aria-label="Undo last bond"
            style={{ padding:"5px 10px", background:"var(--color-bg-card)", border:"1px solid var(--color-border-dim)", borderRadius:"6px", color:"var(--color-text-muted)", cursor:"pointer", fontSize:"15px" }}>
            ↩ Undo
          </button>
          <button onClick={() => { if(fromAtom) { setFromAtom(null); setDrawingBond(false) } }} 
            aria-label="Cancel bond drawing"
            style={{ padding:"5px 10px", background: fromAtom ? "rgba(239,68,68,0.15)" : "var(--color-bg-card)", border:`1px solid ${fromAtom ? "#ef4444" : "var(--color-border-dim)"}`, borderRadius:"6px", color: fromAtom ? "#ef4444" : "var(--color-text-muted)", cursor:"pointer", fontSize:"15px" }}>
            ✕ {fromAtom ? "Cancel Bond" : "Deselect"}
          </button>
          <div style={{ marginLeft:"auto", display:"flex", gap:"6px" }}>
            <button onClick={() => setShowSaveDialog(true)}
              aria-label="Save molecule"
              style={{ padding:"5px 12px", background:"var(--color-cyan-dim)", border:"1px solid var(--color-cyan)", borderRadius:"6px", color:"var(--color-cyan)", cursor:"pointer", fontSize:"15px", fontWeight:600 }}>
              💾 Save
            </button>
            <button onClick={() => { if(svgRef.current) exportSVG(svgRef.current) }}
              aria-label="Export SVG"
              style={{ padding:"5px 12px", background:"var(--color-bg-card)", border:"1px solid var(--color-border-dim)", borderRadius:"6px", color:"var(--color-text-muted)", cursor:"pointer", fontSize:"15px" }}>
              ⬇ SVG
            </button>
          </div>
        </div>

        {/* SVG Canvas */}
        <div
          className="canvas-grid"
          style={{ flex:1, position:"relative", overflow:"hidden" }}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
        >
          {atoms.length === 0 && (
            <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", textAlign:"center", pointerEvents:"none" }}>
              <div style={{ fontSize:"48px", marginBottom:"12px" }}>⚗️</div>
              <div style={{ fontFamily:"var(--font-display)", fontSize:"20px", color:"var(--color-text-muted)", letterSpacing:"0.05em" }}>
                Drag elements from the palette to start building
              </div>
              <div style={{ fontSize:"16px", color:"var(--color-border-dim)", marginTop:"8px" }}>
                Click atoms to connect them with bonds
              </div>
            </div>
          )}

          {/* Save dialog */}
          {showSaveDialog && (
            <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", zIndex:100, background:"var(--color-bg-card)", border:"1px solid var(--color-border-dim)", borderRadius:"12px", padding:"20px", minWidth:"280px", boxShadow:"0 8px 32px rgba(0,0,0,0.5)" }}>
              <h3 style={{ fontFamily:"var(--font-display)", fontSize:"16px", color:"var(--color-cyan)", marginBottom:"12px" }}>Save Molecule</h3>
              <input value={saveName} onChange={e => setSaveName(e.target.value)} placeholder="Molecule name..."
                autoFocus onKeyDown={e => e.key === "Enter" && handleSave()}
                style={{ width:"100%", padding:"8px 12px", background:"var(--color-bg-deep)", border:"1px solid var(--color-border-dim)", borderRadius:"6px", color:"var(--color-text-primary)", fontSize:"15px", outline:"none", marginBottom:"10px" }}
              />
              <div style={{ display:"flex", gap:"8px" }}>
                <button onClick={handleSave} style={{ flex:1, padding:"8px", background:"var(--color-cyan-dim)", border:"1px solid var(--color-cyan)", borderRadius:"6px", color:"var(--color-cyan)", cursor:"pointer", fontSize:"15px" }}>Save</button>
                <button onClick={() => setShowSaveDialog(false)} style={{ flex:1, padding:"8px", background:"var(--color-bg-deep)", border:"1px solid var(--color-border-dim)", borderRadius:"6px", color:"var(--color-text-muted)", cursor:"pointer", fontSize:"15px" }}>Cancel</button>
              </div>
            </div>
          )}

          <svg
            ref={svgRef}
            style={{ width:"100%", height:"100%", display:"block" }}
            aria-label="Free play chemistry canvas"
            onMouseMove={handleSVGMouseMove}
            onWheel={handleWheel}
            onMouseDown={e => {
              if (e.target === svgRef.current) {
                setIsPanning(true)
                setPanStart({ x:e.clientX, y:e.clientY })
                if (fromAtom) { setFromAtom(null); setDrawingBond(false) }
              }
            }}
            onMouseUp={() => setIsPanning(false)}
          >
            <g transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`}>
              {/* Bonds */}
              {bonds.map(bond => {
                const from = atomMap[bond.fromId], to = atomMap[bond.toId]
                if (!from || !to) return null
                const angle = Math.atan2(to.y - from.y, to.x - from.x)
                const px    = Math.sin(angle) * 4
                const py    = Math.cos(angle) * 4

                if (bond.type === "double") return (
                  <g key={bond.id}>
                    <line x1={from.x-px} y1={from.y-py} x2={to.x-px} y2={to.y-py} stroke="var(--color-cyan)" strokeWidth={2.5} opacity={0.8} />
                    <line x1={from.x+px} y1={from.y+py} x2={to.x+px} y2={to.y+py} stroke="var(--color-cyan)" strokeWidth={2.5} opacity={0.8} />
                  </g>
                )
                if (bond.type === "triple") return (
                  <g key={bond.id}>
                    <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="var(--color-cyan)" strokeWidth={2.5} opacity={0.8} />
                    <line x1={from.x-px*1.5} y1={from.y-py*1.5} x2={to.x-px*1.5} y2={to.y-py*1.5} stroke="var(--color-cyan)" strokeWidth={2} opacity={0.7} />
                    <line x1={from.x+px*1.5} y1={from.y+py*1.5} x2={to.x+px*1.5} y2={to.y+py*1.5} stroke="var(--color-cyan)" strokeWidth={2} opacity={0.7} />
                  </g>
                )
                if (bond.type === "ionic") return (
                  <line key={bond.id} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="var(--color-violet)" strokeWidth={3} strokeDasharray="8 4" opacity={0.9} />
                )
                return (
                  <line key={bond.id} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="var(--color-cyan)" strokeWidth={2.5} opacity={0.8} />
                )
              })}

              {/* Drag preview */}
              {drawingBond && fromAtom && atomMap[fromAtom] && (
                <line
                  x1={atomMap[fromAtom]!.x} y1={atomMap[fromAtom]!.y}
                  x2={mousePos.x} y2={mousePos.y}
                  stroke="var(--color-cyan)" strokeWidth={2} strokeDasharray="8 4" opacity={0.6}
                  style={{ animation:"var(--animate-drag-line)" }}
                />
              )}

              {/* Atoms */}
              {atoms.map(atom => {
                const isSelected = atom.id === fromAtom
                return (
                  <g key={atom.id}
                    onMouseDown={e => handleAtomMouseDown(e, atom.id)}
                    onContextMenu={e => { e.preventDefault(); deleteAtom(atom.id) }}
                    style={{ cursor:"pointer" }}
                    role="button"
                    aria-label={`${atom.symbol} atom`}
                  >
                    <circle cx={atom.x} cy={atom.y} r={24}
                      fill={atom.color} fillOpacity={0.85}
                      stroke={isSelected ? "var(--color-cyan)" : atom.color}
                      strokeWidth={isSelected ? 3 : 1.5}
                      style={{ filter:`drop-shadow(0 0 ${isSelected ? 12:6}px ${atom.color})` }}
                    />
                    <text x={atom.x} y={atom.y} textAnchor="middle" dominantBaseline="central"
                      fill="#fff" fontSize={14} fontWeight="bold" fontFamily="var(--font-display)"
                      style={{ pointerEvents:"none", userSelect:"none" }}>
                      {atom.symbol}
                    </text>
                  </g>
                )
              })}
            </g>
          </svg>
        </div>

        {/* Saved molecules */}
        {saved.length > 0 && (
          <div style={{ background:"var(--color-bg-panel)", borderTop:"1px solid var(--color-border-dim)", padding:"10px 12px", maxHeight:"120px", overflowY:"auto" }}>
            <div style={{ fontSize:"15px", color:"var(--color-text-muted)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"8px" }}>My Saved Molecules</div>
            <div style={{ display:"flex", gap:"8px", overflowX:"auto" }}>
              {saved.map(mol => (
                <div key={mol.id} style={{ flexShrink:0, background:"var(--color-bg-card)", border:"1px solid var(--color-border-dim)", borderRadius:"8px", padding:"6px 10px", display:"flex", alignItems:"center", gap:"8px" }}>
                  <span style={{ fontSize:"16px", color:"var(--color-text-primary)" }}>{mol.name}</span>
                  <button onClick={() => loadMolecule(mol)} aria-label={`Load ${mol.name}`} style={{ padding:"2px 8px", background:"var(--color-cyan-dim)", border:"1px solid var(--color-cyan)", borderRadius:"4px", color:"var(--color-cyan)", cursor:"pointer", fontSize:"14px" }}>Load</button>
                  <button onClick={() => deleteSaved(mol.id)} aria-label={`Delete ${mol.name}`} style={{ padding:"2px 6px", background:"rgba(239,68,68,0.1)", border:"1px solid #ef4444", borderRadius:"4px", color:"#ef4444", cursor:"pointer", fontSize:"14px" }}>✕</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Analysis panel */}
      <aside style={{ width:"240px", flexShrink:0, background:"var(--color-bg-panel)", borderLeft:"1px solid var(--color-border-dim)", padding:"16px", overflowY:"auto" }}>
        <h3 style={{ fontFamily:"var(--font-display)", fontSize:"15px", color:"var(--color-text-muted)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"12px" }}>Live Analysis</h3>

        {analysis.name ? (
          <div style={{ padding:"10px 12px", background:"var(--color-cyan-dim)", border:"1px solid var(--color-cyan)", borderRadius:"8px", marginBottom:"12px" }}>
            <div style={{ fontFamily:"var(--font-display)", fontSize:"18px", color:"var(--color-cyan)" }}>{analysis.name}</div>
            <div style={{ fontFamily:"var(--font-mono)", fontSize:"16px", color:"var(--color-text-muted)" }}>{analysis.formula}</div>
          </div>
        ) : atoms.length > 0 ? (
          <div style={{ padding:"10px 12px", background:"var(--color-bg-card)", border:"1px solid var(--color-border-dim)", borderRadius:"8px", marginBottom:"12px" }}>
            <div style={{ fontSize:"15px", color:"var(--color-text-muted)" }}>Unknown molecule</div>
            {analysis.structure && <div style={{ fontSize:"14px", color:"var(--color-text-muted)", marginTop:"2px" }}>Predicted: {analysis.structure}</div>}
          </div>
        ) : null}

        {/* Validity */}
        {atoms.length > 0 && (
          <div style={{ padding:"8px 12px", background: analysis.isValid ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", border:`1px solid ${analysis.isValid ? "#10b981" : "#ef4444"}`, borderRadius:"6px", marginBottom:"12px" }}>
            <span style={{ fontSize:"15px", color: analysis.isValid ? "#10b981" : "#ef4444" }}>
              {analysis.isValid ? "✓ Valid structure" : "⚠ Issues detected"}
            </span>
          </div>
        )}

        {/* Warnings */}
        {analysis.warnings.map((w, i) => (
          <div key={i} style={{ padding:"6px 10px", background:"rgba(245,158,11,0.1)", border:"1px solid #f59e0b", borderRadius:"6px", marginBottom:"6px", fontSize:"15px", color:"#f59e0b" }}>
            {w}
          </div>
        ))}

        {/* Atom count */}
        {atoms.length > 0 && (
          <div style={{ marginTop:"12px" }}>
            <div style={{ fontSize:"14px", color:"var(--color-text-muted)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"8px" }}>Atoms ({atoms.length})</div>
            {atoms.map(atom => {
              const bc = analysis.bondCounts[atom.id] ?? 0
              const el = ELEMENTS.find(e => e.symbol === atom.symbol)
              const max = el?.maxBonds ?? 0
              return (
                <div key={atom.id} style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", borderBottom:"1px solid var(--color-border-dim)", fontSize:"15px" }}>
                  <span style={{ color:atom.color, fontFamily:"var(--font-display)" }}>{atom.symbol}</span>
                  <span style={{ color: bc > max ? "#ef4444" : "var(--color-text-muted)", fontFamily:"var(--font-mono)" }}>
                    {bc}/{max} bonds
                  </span>
                </div>
              )
            })}
          </div>
        )}

        <div style={{ marginTop:"12px", fontSize:"14px", color:"var(--color-border-dim)" }}>
          Right-click atom to delete · Scroll to zoom · Drag background to pan
        </div>
      </aside>
    </div>
  )
}
