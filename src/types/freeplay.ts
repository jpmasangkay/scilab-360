import type { BondType } from "./chemistry"

export interface CanvasAtom {
  id:     string
  symbol: string
  x:      number
  y:      number
  color:  string
}

export interface CanvasBond {
  id:     string
  fromId: string
  toId:   string
  type:   BondType
}

export interface FreeMolecule {
  id:     string
  name:   string
  atoms:  CanvasAtom[]
  bonds:  CanvasBond[]
  savedAt: string
}

export interface CanvasTransform {
  x:     number
  y:     number
  scale: number
}

export type FreePlayTool = "select" | "move" | "bond" | "delete"
