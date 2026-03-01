import type { CanvasAtom, CanvasBond } from "../types/freeplay"
import type { MoleculeStructure } from "../types/chemistry"
import { MOLECULES } from "../data/molecules"

interface Analysis {
  name:        string | null
  formula:     string | null
  isValid:     boolean
  structure:   MoleculeStructure | null
  warnings:    string[]
  bondCounts:  Record<string, number>
}

const MAX_BONDS: Record<string, number> = {
  H:1, He:0, Li:1, Be:2, B:3, C:4, N:3, O:2, F:1, Ne:0,
  Na:1, Mg:2, Al:3, Si:4, P:5, S:6, Cl:1, Ar:0,
}

export function analyzeMolecule(atoms: CanvasAtom[], bonds: CanvasBond[]): Analysis {
  const warnings: string[] = []
  const bondCounts: Record<string, number> = {}

  for (const atom of atoms) {
    bondCounts[atom.id] = 0
  }
  for (const bond of bonds) {
    const count = bond.type === "triple" ? 3 : bond.type === "double" ? 2 : 1
    if (bondCounts[bond.fromId] !== undefined) bondCounts[bond.fromId]! += count
    if (bondCounts[bond.toId] !== undefined) bondCounts[bond.toId]! += count
  }

  for (const atom of atoms) {
    const max = MAX_BONDS[atom.symbol]
    const count = bondCounts[atom.id] ?? 0
    if (max !== undefined && count > max) {
      warnings.push(`⚠ ${atom.symbol} has ${count} bonds (max ${max})`)
    }
  }

  // Try to match known molecules
  for (const mol of MOLECULES) {
    if (mol.atoms.length !== atoms.length) continue
    if (mol.connections.length !== bonds.length) continue

    const molSymbols = mol.atoms.map(a => a.element.symbol).sort().join(",")
    const ourSymbols = atoms.map(a => a.symbol).sort().join(",")
    if (molSymbols === ourSymbols) {
      return {
        name:       mol.name,
        formula:    mol.formula,
        isValid:    warnings.length === 0,
        structure:  mol.structure,
        warnings,
        bondCounts,
      }
    }
  }

  // Predict structure from VSEPR
  const centerAtom  = atoms.reduce((best, a) => {
    const bc = bondCounts[a.id] ?? 0
    const bBest = bondCounts[best.id] ?? 0
    return bc > bBest ? a : best
  }, atoms[0] ?? { id: "", symbol: "" })

  const bondCount = bondCounts[centerAtom.id] ?? 0
  let structure: MoleculeStructure | null = null
  if (bondCount === 2) structure = "bent"
  else if (bondCount === 3) structure = "trigonal-planar"
  else if (bondCount === 4) structure = "tetrahedral"

  return { name:null, formula:null, isValid:warnings.length===0, structure, warnings, bondCounts }
}
