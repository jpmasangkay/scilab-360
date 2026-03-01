import { useState, useCallback, useRef } from "react"
import type { DrawingState } from "../types/drawing"
import type { BondType } from "../types/chemistry"

interface UseBondDrawingReturn {
  state:        DrawingState
  selectedBond: BondType
  setSelectedBond: (t: BondType) => void
  handleAtomClick: (atomId: string, x: number, y: number) => void
  handleMouseMove: (x: number, y: number) => void
  handleCanvasClick: () => void
  reset: () => void
}

export function useBondDrawing(
  onBondPlaced: (fromId: string, toId: string, bondType: BondType) => void
): UseBondDrawingReturn {
  const [state, setState] = useState<DrawingState>({ phase: "idle" })
  const [selectedBond, setSelectedBond] = useState<BondType>("single")
  const stateRef = useRef(state)
  stateRef.current = state

  const handleAtomClick = useCallback((atomId: string, _x: number, _y: number) => {
    const cur = stateRef.current
    if (cur.phase === "idle") {
      setState({ phase: "selected", fromId: atomId, bondType: selectedBond })
    } else if (cur.phase === "selected" || cur.phase === "drawing") {
      const fromId = cur.fromId
      if (fromId === atomId) {
        setState({ phase: "idle" })
        return
      }
      onBondPlaced(fromId, atomId, cur.bondType)
      setState({ phase: "idle" })
    }
  }, [onBondPlaced, selectedBond])

  const handleMouseMove = useCallback((x: number, y: number) => {
    setState(prev => {
      if (prev.phase === "selected" || prev.phase === "drawing") {
        return { phase: "drawing", fromId: prev.fromId, bondType: prev.bondType, mouse: { x, y } }
      }
      return prev
    })
  }, [])

  const handleCanvasClick = useCallback(() => {
    setState({ phase: "idle" })
  }, [])

  const reset = useCallback(() => {
    setState({ phase: "idle" })
  }, [])

  return {
    state,
    selectedBond,
    setSelectedBond,
    handleAtomClick,
    handleMouseMove,
    handleCanvasClick,
    reset,
  }
}
