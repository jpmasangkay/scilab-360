import type { BondConnection } from "../types/chemistry"

function bondKey(fromId: string, toId: string): string {
  return [fromId, toId].sort().join("—")
}

interface ValidationResult {
  correctBonds: BondConnection[]
  wrongBonds:   BondConnection[]
  missingBonds: BondConnection[]
}

export function validateBonds(
  placed:  BondConnection[],
  correct: BondConnection[]
): ValidationResult {
  const correctMap = new Map(correct.map(b => [bondKey(b.fromAtomId, b.toAtomId), b]))
  const placedMap  = new Map(placed.map(b => [bondKey(b.fromAtomId, b.toAtomId), b]))

  const correctBonds: BondConnection[] = []
  const wrongBonds:   BondConnection[] = []
  const missingBonds: BondConnection[] = []

  for (const [key, placedBond] of placedMap) {
    const correctBond = correctMap.get(key)
    if (correctBond && correctBond.bondType === placedBond.bondType) {
      correctBonds.push(placedBond)
    } else {
      wrongBonds.push(placedBond)
    }
  }

  for (const [key, correctBond] of correctMap) {
    if (!placedMap.has(key)) {
      missingBonds.push(correctBond)
    }
  }

  return { correctBonds, wrongBonds, missingBonds }
}
