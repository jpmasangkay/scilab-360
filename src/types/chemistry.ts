export type ElementCategory =
  | "nonmetal"
  | "noble-gas"
  | "alkali-metal"
  | "alkaline-earth"
  | "transition-metal"
  | "post-transition"
  | "metalloid"
  | "halogen"
  | "lanthanide"
  | "actinide"

export interface ChemElement {
  symbol:            string
  name:              string
  atomicNumber:      number
  atomicMass:        number
  category:          ElementCategory
  electronConfig:    string
  valenceElectrons:  number
  electronegativity: number | null
  period:            number
  group:             number | null
  stateAtRoom:       "solid" | "liquid" | "gas"
  color:             string
  commonBonds:       string[]
  maxBonds:          number
  gridCol:           number
  gridRow:           number
}

export type MoleculeStructure =
  | "bent"
  | "linear"
  | "trigonal-pyramidal"
  | "tetrahedral"
  | "trigonal-planar"
  | "octahedral"
  | "square-planar"
  | "seesaw"
  | "t-shaped"
  | "trigonal-bipyramidal"

export type BondType =
  | "single"
  | "double"
  | "triple"
  | "ionic"
  | "coordinate"
  | "metallic"
  | "hydrogen"

export interface AtomNode {
  id:         string
  element:    ChemElement
  position:   { x: number; y: number }
  orbitRings: number
}

export interface BondConnection {
  id:         string
  fromAtomId: string
  toAtomId:   string
  bondType:   BondType
}

export interface Molecule {
  id:          string
  name:        string
  formula:     string
  structure:   MoleculeStructure
  bondAngle:   number | null
  atoms:       AtomNode[]
  connections: BondConnection[]
  description: string
  category:    "organic" | "inorganic" | "ionic" | "covalent"
  difficulty:  "easy" | "medium" | "hard"
}
