import type { BondType } from "./chemistry"

export type DrawingState =
  | { phase: "idle" }
  | { phase: "selected"; fromId: string; bondType: BondType }
  | { phase: "drawing";  fromId: string; bondType: BondType; mouse: { x: number; y: number } }

export type AtomFeedback = "default" | "selected" | "correct" | "wrong" | "missing"
