import type { Molecule } from "../types/chemistry"
import { ELEMENT_BY_SYMBOL } from "./elements"

const H  = ELEMENT_BY_SYMBOL["H"]!
const He = ELEMENT_BY_SYMBOL["He"]!
const C  = ELEMENT_BY_SYMBOL["C"]!
const N  = ELEMENT_BY_SYMBOL["N"]!
const O  = ELEMENT_BY_SYMBOL["O"]!
const F  = ELEMENT_BY_SYMBOL["F"]!
const Na = ELEMENT_BY_SYMBOL["Na"]!
const S  = ELEMENT_BY_SYMBOL["S"]!
const Cl = ELEMENT_BY_SYMBOL["Cl"]!
const P  = ELEMENT_BY_SYMBOL["P"]!
const B  = ELEMENT_BY_SYMBOL["B"]!
const Xe = ELEMENT_BY_SYMBOL["Xe"]!

export const MOLECULES: Molecule[] = [
  // 1. H₂O
  {
    id: "h2o", name: "Water", formula: "H₂O",
    structure: "bent", bondAngle: 104.5,
    description: "The most abundant liquid on Earth. Essential for all known life. Bent molecular geometry due to two lone pairs on oxygen.",
    category: "covalent", difficulty: "easy",
    atoms: [
      { id:"O1", element:O, position:{x:350,y:180}, orbitRings:3 },
      { id:"H1", element:H, position:{x:190,y:320}, orbitRings:1 },
      { id:"H2", element:H, position:{x:510,y:320}, orbitRings:1 },
    ],
    connections: [
      { id:"b1", fromAtomId:"O1", toAtomId:"H1", bondType:"single" },
      { id:"b2", fromAtomId:"O1", toAtomId:"H2", bondType:"single" },
    ],
  },
  // 2. CO₂
  {
    id: "co2", name: "Carbon Dioxide", formula: "CO₂",
    structure: "linear", bondAngle: 180,
    description: "Linear molecule with two double bonds. Major greenhouse gas produced by combustion and respiration.",
    category: "covalent", difficulty: "easy",
    atoms: [
      { id:"O1", element:O, position:{x:150,y:250}, orbitRings:3 },
      { id:"C1", element:C, position:{x:350,y:250}, orbitRings:2 },
      { id:"O2", element:O, position:{x:550,y:250}, orbitRings:3 },
    ],
    connections: [
      { id:"b1", fromAtomId:"O1", toAtomId:"C1", bondType:"double" },
      { id:"b2", fromAtomId:"C1", toAtomId:"O2", bondType:"double" },
    ],
  },
  // 3. NH₃
  {
    id: "nh3", name: "Ammonia", formula: "NH₃",
    structure: "trigonal-pyramidal", bondAngle: 107,
    description: "Trigonal pyramidal due to lone pair on nitrogen. Important industrial chemical and biological compound.",
    category: "covalent", difficulty: "easy",
    atoms: [
      { id:"N1", element:N, position:{x:350,y:160}, orbitRings:2 },
      { id:"H1", element:H, position:{x:180,y:330}, orbitRings:1 },
      { id:"H2", element:H, position:{x:350,y:360}, orbitRings:1 },
      { id:"H3", element:H, position:{x:520,y:330}, orbitRings:1 },
    ],
    connections: [
      { id:"b1", fromAtomId:"N1", toAtomId:"H1", bondType:"single" },
      { id:"b2", fromAtomId:"N1", toAtomId:"H2", bondType:"single" },
      { id:"b3", fromAtomId:"N1", toAtomId:"H3", bondType:"single" },
    ],
  },
  // 4. CH₄
  {
    id: "ch4", name: "Methane", formula: "CH₄",
    structure: "tetrahedral", bondAngle: 109.5,
    description: "Simplest alkane. Perfect tetrahedral geometry with 4 C-H single bonds. Main component of natural gas.",
    category: "organic", difficulty: "easy",
    atoms: [
      { id:"C1", element:C, position:{x:350,y:250}, orbitRings:2 },
      { id:"H1", element:H, position:{x:200,y:160}, orbitRings:1 },
      { id:"H2", element:H, position:{x:500,y:160}, orbitRings:1 },
      { id:"H3", element:H, position:{x:200,y:340}, orbitRings:1 },
      { id:"H4", element:H, position:{x:500,y:340}, orbitRings:1 },
    ],
    connections: [
      { id:"b1", fromAtomId:"C1", toAtomId:"H1", bondType:"single" },
      { id:"b2", fromAtomId:"C1", toAtomId:"H2", bondType:"single" },
      { id:"b3", fromAtomId:"C1", toAtomId:"H3", bondType:"single" },
      { id:"b4", fromAtomId:"C1", toAtomId:"H4", bondType:"single" },
    ],
  },
  // 5. NaCl
  {
    id: "nacl", name: "Sodium Chloride", formula: "NaCl",
    structure: "linear", bondAngle: null,
    description: "Classic ionic compound. Sodium donates an electron to chlorine forming Na⁺ and Cl⁻ ions.",
    category: "ionic", difficulty: "easy",
    atoms: [
      { id:"Na1", element:Na, position:{x:220,y:250}, orbitRings:3 },
      { id:"Cl1", element:Cl, position:{x:480,y:250}, orbitRings:3 },
    ],
    connections: [
      { id:"b1", fromAtomId:"Na1", toAtomId:"Cl1", bondType:"ionic" },
    ],
  },
  // 6. HCl
  {
    id: "hcl", name: "Hydrogen Chloride", formula: "HCl",
    structure: "linear", bondAngle: 180,
    description: "Polar covalent bond. Dissolves in water to form hydrochloric acid.",
    category: "covalent", difficulty: "easy",
    atoms: [
      { id:"H1", element:H, position:{x:220,y:250}, orbitRings:1 },
      { id:"Cl1", element:Cl, position:{x:480,y:250}, orbitRings:3 },
    ],
    connections: [
      { id:"b1", fromAtomId:"H1", toAtomId:"Cl1", bondType:"single" },
    ],
  },
  // 7. H₂
  {
    id: "h2", name: "Hydrogen Gas", formula: "H₂",
    structure: "linear", bondAngle: 180,
    description: "Simplest diatomic molecule. Single covalent bond between two hydrogen atoms.",
    category: "covalent", difficulty: "easy",
    atoms: [
      { id:"H1", element:H, position:{x:230,y:250}, orbitRings:1 },
      { id:"H2", element:H, position:{x:470,y:250}, orbitRings:1 },
    ],
    connections: [
      { id:"b1", fromAtomId:"H1", toAtomId:"H2", bondType:"single" },
    ],
  },
  // 8. O₂
  {
    id: "o2", name: "Oxygen Gas", formula: "O₂",
    structure: "linear", bondAngle: 180,
    description: "Diatomic oxygen with a double bond. Essential for aerobic respiration.",
    category: "covalent", difficulty: "easy",
    atoms: [
      { id:"O1", element:O, position:{x:230,y:250}, orbitRings:2 },
      { id:"O2", element:O, position:{x:470,y:250}, orbitRings:2 },
    ],
    connections: [
      { id:"b1", fromAtomId:"O1", toAtomId:"O2", bondType:"double" },
    ],
  },
  // 9. N₂
  {
    id: "n2", name: "Nitrogen Gas", formula: "N₂",
    structure: "linear", bondAngle: 180,
    description: "Triple bond makes N₂ extremely stable. Makes up 78% of Earth's atmosphere.",
    category: "covalent", difficulty: "medium",
    atoms: [
      { id:"N1", element:N, position:{x:230,y:250}, orbitRings:2 },
      { id:"N2", element:N, position:{x:470,y:250}, orbitRings:2 },
    ],
    connections: [
      { id:"b1", fromAtomId:"N1", toAtomId:"N2", bondType:"triple" },
    ],
  },
  // 10. HF
  {
    id: "hf", name: "Hydrogen Fluoride", formula: "HF",
    structure: "linear", bondAngle: 180,
    description: "Highly polar covalent bond due to fluorine's extreme electronegativity.",
    category: "covalent", difficulty: "easy",
    atoms: [
      { id:"H1", element:H, position:{x:230,y:250}, orbitRings:1 },
      { id:"F1", element:F, position:{x:470,y:250}, orbitRings:3 },
    ],
    connections: [
      { id:"b1", fromAtomId:"H1", toAtomId:"F1", bondType:"single" },
    ],
  },
  // 11. SO₂
  {
    id: "so2", name: "Sulfur Dioxide", formula: "SO₂",
    structure: "bent", bondAngle: 119,
    description: "Bent molecule due to lone pair on S. Resonance structure with one single and one double bond.",
    category: "covalent", difficulty: "medium",
    atoms: [
      { id:"S1", element:S, position:{x:350,y:190}, orbitRings:3 },
      { id:"O1", element:O, position:{x:190,y:330}, orbitRings:2 },
      { id:"O2", element:O, position:{x:510,y:330}, orbitRings:2 },
    ],
    connections: [
      { id:"b1", fromAtomId:"S1", toAtomId:"O1", bondType:"single" },
      { id:"b2", fromAtomId:"S1", toAtomId:"O2", bondType:"double" },
    ],
  },
  // 12. SO₃
  {
    id: "so3", name: "Sulfur Trioxide", formula: "SO₃",
    structure: "trigonal-planar", bondAngle: 120,
    description: "Trigonal planar with three double bonds due to resonance. Reacts with water to form sulfuric acid.",
    category: "covalent", difficulty: "medium",
    atoms: [
      { id:"S1", element:S, position:{x:350,y:250}, orbitRings:3 },
      { id:"O1", element:O, position:{x:350,y:120}, orbitRings:2 },
      { id:"O2", element:O, position:{x:200,y:340}, orbitRings:2 },
      { id:"O3", element:O, position:{x:500,y:340}, orbitRings:2 },
    ],
    connections: [
      { id:"b1", fromAtomId:"S1", toAtomId:"O1", bondType:"double" },
      { id:"b2", fromAtomId:"S1", toAtomId:"O2", bondType:"double" },
      { id:"b3", fromAtomId:"S1", toAtomId:"O3", bondType:"double" },
    ],
  },
  // 13. H₂O₂
  {
    id: "h2o2", name: "Hydrogen Peroxide", formula: "H₂O₂",
    structure: "bent", bondAngle: 111,
    description: "Contains an O-O single bond (peroxide bond). Used as bleaching agent and antiseptic.",
    category: "covalent", difficulty: "medium",
    atoms: [
      { id:"H1", element:H, position:{x:180,y:200}, orbitRings:1 },
      { id:"O1", element:O, position:{x:280,y:280}, orbitRings:3 },
      { id:"O2", element:O, position:{x:420,y:280}, orbitRings:3 },
      { id:"H2", element:H, position:{x:520,y:200}, orbitRings:1 },
    ],
    connections: [
      { id:"b1", fromAtomId:"H1", toAtomId:"O1", bondType:"single" },
      { id:"b2", fromAtomId:"O1", toAtomId:"O2", bondType:"single" },
      { id:"b3", fromAtomId:"O2", toAtomId:"H2", bondType:"single" },
    ],
  },
  // 14. CH₂O (Formaldehyde)
  {
    id: "ch2o", name: "Formaldehyde", formula: "CH₂O",
    structure: "trigonal-planar", bondAngle: 120,
    description: "Simplest aldehyde. Trigonal planar around carbon with a C=O double bond.",
    category: "organic", difficulty: "medium",
    atoms: [
      { id:"C1", element:C, position:{x:350,y:250}, orbitRings:2 },
      { id:"O1", element:O, position:{x:350,y:110}, orbitRings:3 },
      { id:"H1", element:H, position:{x:200,y:340}, orbitRings:1 },
      { id:"H2", element:H, position:{x:500,y:340}, orbitRings:1 },
    ],
    connections: [
      { id:"b1", fromAtomId:"C1", toAtomId:"O1", bondType:"double" },
      { id:"b2", fromAtomId:"C1", toAtomId:"H1", bondType:"single" },
      { id:"b3", fromAtomId:"C1", toAtomId:"H2", bondType:"single" },
    ],
  },
  // 15. C₂H₄ (Ethylene)
  {
    id: "c2h4", name: "Ethylene", formula: "C₂H₄",
    structure: "trigonal-planar", bondAngle: 120,
    description: "Simplest alkene with a C=C double bond. Used in plastics production. Each carbon is sp² hybridized.",
    category: "organic", difficulty: "medium",
    atoms: [
      { id:"C1", element:C, position:{x:260,y:250}, orbitRings:2 },
      { id:"C2", element:C, position:{x:440,y:250}, orbitRings:2 },
      { id:"H1", element:H, position:{x:160,y:160}, orbitRings:1 },
      { id:"H2", element:H, position:{x:160,y:340}, orbitRings:1 },
      { id:"H3", element:H, position:{x:540,y:160}, orbitRings:1 },
      { id:"H4", element:H, position:{x:540,y:340}, orbitRings:1 },
    ],
    connections: [
      { id:"b1", fromAtomId:"C1", toAtomId:"C2", bondType:"double" },
      { id:"b2", fromAtomId:"C1", toAtomId:"H1", bondType:"single" },
      { id:"b3", fromAtomId:"C1", toAtomId:"H2", bondType:"single" },
      { id:"b4", fromAtomId:"C2", toAtomId:"H3", bondType:"single" },
      { id:"b5", fromAtomId:"C2", toAtomId:"H4", bondType:"single" },
    ],
  },
  // 16. C₂H₂ (Acetylene)
  {
    id: "c2h2", name: "Acetylene", formula: "C₂H₂",
    structure: "linear", bondAngle: 180,
    description: "Simplest alkyne with a C≡C triple bond. Linear geometry. Used in welding torches.",
    category: "organic", difficulty: "hard",
    atoms: [
      { id:"H1", element:H, position:{x:160,y:250}, orbitRings:1 },
      { id:"C1", element:C, position:{x:290,y:250}, orbitRings:2 },
      { id:"C2", element:C, position:{x:410,y:250}, orbitRings:2 },
      { id:"H2", element:H, position:{x:540,y:250}, orbitRings:1 },
    ],
    connections: [
      { id:"b1", fromAtomId:"H1", toAtomId:"C1", bondType:"single" },
      { id:"b2", fromAtomId:"C1", toAtomId:"C2", bondType:"triple" },
      { id:"b3", fromAtomId:"C2", toAtomId:"H2", bondType:"single" },
    ],
  },
  // 17. PCl₃
  {
    id: "pcl3", name: "Phosphorus Trichloride", formula: "PCl₃",
    structure: "trigonal-pyramidal", bondAngle: 100,
    description: "Trigonal pyramidal geometry with a lone pair on phosphorus. Important reagent in organic synthesis.",
    category: "covalent", difficulty: "medium",
    atoms: [
      { id:"P1", element:P, position:{x:350,y:180}, orbitRings:3 },
      { id:"Cl1", element:Cl, position:{x:180,y:340}, orbitRings:3 },
      { id:"Cl2", element:Cl, position:{x:350,y:370}, orbitRings:3 },
      { id:"Cl3", element:Cl, position:{x:520,y:340}, orbitRings:3 },
    ],
    connections: [
      { id:"b1", fromAtomId:"P1", toAtomId:"Cl1", bondType:"single" },
      { id:"b2", fromAtomId:"P1", toAtomId:"Cl2", bondType:"single" },
      { id:"b3", fromAtomId:"P1", toAtomId:"Cl3", bondType:"single" },
    ],
  },
  // 18. PCl₅
  {
    id: "pcl5", name: "Phosphorus Pentachloride", formula: "PCl₅",
    structure: "trigonal-bipyramidal", bondAngle: null,
    description: "Trigonal bipyramidal geometry. Expanded octet - phosphorus can hold 5 bonds.",
    category: "covalent", difficulty: "hard",
    atoms: [
      { id:"P1", element:P, position:{x:350,y:250}, orbitRings:3 },
      { id:"Cl1", element:Cl, position:{x:350,y:110}, orbitRings:3 },
      { id:"Cl2", element:Cl, position:{x:180,y:310}, orbitRings:3 },
      { id:"Cl3", element:Cl, position:{x:520,y:310}, orbitRings:3 },
      { id:"Cl4", element:Cl, position:{x:230,y:190}, orbitRings:3 },
      { id:"Cl5", element:Cl, position:{x:470,y:190}, orbitRings:3 },
    ],
    connections: [
      { id:"b1", fromAtomId:"P1", toAtomId:"Cl1", bondType:"single" },
      { id:"b2", fromAtomId:"P1", toAtomId:"Cl2", bondType:"single" },
      { id:"b3", fromAtomId:"P1", toAtomId:"Cl3", bondType:"single" },
      { id:"b4", fromAtomId:"P1", toAtomId:"Cl4", bondType:"single" },
      { id:"b5", fromAtomId:"P1", toAtomId:"Cl5", bondType:"single" },
    ],
  },
  // 19. SF₄
  {
    id: "sf4", name: "Sulfur Tetrafluoride", formula: "SF₄",
    structure: "seesaw", bondAngle: null,
    description: "Seesaw geometry with one lone pair on sulfur. Expanded octet compound.",
    category: "covalent", difficulty: "hard",
    atoms: [
      { id:"S1", element:S, position:{x:350,y:250}, orbitRings:3 },
      { id:"F1", element:F, position:{x:350,y:110}, orbitRings:2 },
      { id:"F2", element:F, position:{x:200,y:200}, orbitRings:2 },
      { id:"F3", element:F, position:{x:500,y:200}, orbitRings:2 },
      { id:"F4", element:F, position:{x:350,y:390}, orbitRings:2 },
    ],
    connections: [
      { id:"b1", fromAtomId:"S1", toAtomId:"F1", bondType:"single" },
      { id:"b2", fromAtomId:"S1", toAtomId:"F2", bondType:"single" },
      { id:"b3", fromAtomId:"S1", toAtomId:"F3", bondType:"single" },
      { id:"b4", fromAtomId:"S1", toAtomId:"F4", bondType:"single" },
    ],
  },
  // 20. SF₆
  {
    id: "sf6", name: "Sulfur Hexafluoride", formula: "SF₆",
    structure: "octahedral", bondAngle: 90,
    description: "Perfect octahedral geometry with 6 S-F bonds. Highly stable, used as electrical insulator.",
    category: "covalent", difficulty: "hard",
    atoms: [
      { id:"S1", element:S, position:{x:350,y:250}, orbitRings:3 },
      { id:"F1", element:F, position:{x:350,y:110}, orbitRings:2 },
      { id:"F2", element:F, position:{x:350,y:390}, orbitRings:2 },
      { id:"F3", element:F, position:{x:210,y:250}, orbitRings:2 },
      { id:"F4", element:F, position:{x:490,y:250}, orbitRings:2 },
      { id:"F5", element:F, position:{x:230,y:160}, orbitRings:2 },
      { id:"F6", element:F, position:{x:470,y:340}, orbitRings:2 },
    ],
    connections: [
      { id:"b1", fromAtomId:"S1", toAtomId:"F1", bondType:"single" },
      { id:"b2", fromAtomId:"S1", toAtomId:"F2", bondType:"single" },
      { id:"b3", fromAtomId:"S1", toAtomId:"F3", bondType:"single" },
      { id:"b4", fromAtomId:"S1", toAtomId:"F4", bondType:"single" },
      { id:"b5", fromAtomId:"S1", toAtomId:"F5", bondType:"single" },
      { id:"b6", fromAtomId:"S1", toAtomId:"F6", bondType:"single" },
    ],
  },
  // 21. BF₃
  {
    id: "bf3", name: "Boron Trifluoride", formula: "BF₃",
    structure: "trigonal-planar", bondAngle: 120,
    description: "Trigonal planar. Boron has only 6 valence electrons - incomplete octet (Lewis acid).",
    category: "covalent", difficulty: "medium",
    atoms: [
      { id:"B1", element:B, position:{x:350,y:250}, orbitRings:2 },
      { id:"F1", element:F, position:{x:350,y:110}, orbitRings:3 },
      { id:"F2", element:F, position:{x:200,y:340}, orbitRings:3 },
      { id:"F3", element:F, position:{x:500,y:340}, orbitRings:3 },
    ],
    connections: [
      { id:"b1", fromAtomId:"B1", toAtomId:"F1", bondType:"single" },
      { id:"b2", fromAtomId:"B1", toAtomId:"F2", bondType:"single" },
      { id:"b3", fromAtomId:"B1", toAtomId:"F3", bondType:"single" },
    ],
  },
  // 22. XeF₂
  {
    id: "xef2", name: "Xenon Difluoride", formula: "XeF₂",
    structure: "linear", bondAngle: 180,
    description: "Linear noble gas compound. Xe has 3 lone pairs and forms 2 bonds with fluorine.",
    category: "covalent", difficulty: "hard",
    atoms: [
      { id:"F1", element:F, position:{x:180,y:250}, orbitRings:2 },
      { id:"Xe1", element:Xe, position:{x:350,y:250}, orbitRings:3 },
      { id:"F2", element:F, position:{x:520,y:250}, orbitRings:2 },
    ],
    connections: [
      { id:"b1", fromAtomId:"Xe1", toAtomId:"F1", bondType:"single" },
      { id:"b2", fromAtomId:"Xe1", toAtomId:"F2", bondType:"single" },
    ],
  },
  // 23. XeF₄
  {
    id: "xef4", name: "Xenon Tetrafluoride", formula: "XeF₄",
    structure: "square-planar", bondAngle: 90,
    description: "Square planar xenon compound with 2 lone pairs on Xe. Expanded octet noble gas molecule.",
    category: "covalent", difficulty: "hard",
    atoms: [
      { id:"Xe1", element:Xe, position:{x:350,y:250}, orbitRings:3 },
      { id:"F1", element:F, position:{x:350,y:110}, orbitRings:2 },
      { id:"F2", element:F, position:{x:490,y:250}, orbitRings:2 },
      { id:"F3", element:F, position:{x:350,y:390}, orbitRings:2 },
      { id:"F4", element:F, position:{x:210,y:250}, orbitRings:2 },
    ],
    connections: [
      { id:"b1", fromAtomId:"Xe1", toAtomId:"F1", bondType:"single" },
      { id:"b2", fromAtomId:"Xe1", toAtomId:"F2", bondType:"single" },
      { id:"b3", fromAtomId:"Xe1", toAtomId:"F3", bondType:"single" },
      { id:"b4", fromAtomId:"Xe1", toAtomId:"F4", bondType:"single" },
    ],
  },
  // 24. ClF₃
  {
    id: "clf3", name: "Chlorine Trifluoride", formula: "ClF₃",
    structure: "t-shaped", bondAngle: null,
    description: "T-shaped geometry with 2 lone pairs on Cl in equatorial positions. Highly reactive.",
    category: "covalent", difficulty: "hard",
    atoms: [
      { id:"Cl1", element:Cl, position:{x:350,y:250}, orbitRings:3 },
      { id:"F1", element:F, position:{x:350,y:110}, orbitRings:2 },
      { id:"F2", element:F, position:{x:210,y:250}, orbitRings:2 },
      { id:"F3", element:F, position:{x:490,y:250}, orbitRings:2 },
    ],
    connections: [
      { id:"b1", fromAtomId:"Cl1", toAtomId:"F1", bondType:"single" },
      { id:"b2", fromAtomId:"Cl1", toAtomId:"F2", bondType:"single" },
      { id:"b3", fromAtomId:"Cl1", toAtomId:"F3", bondType:"single" },
    ],
  },
  // 25. H₂SO₄
  {
    id: "h2so4", name: "Sulfuric Acid", formula: "H₂SO₄",
    structure: "tetrahedral", bondAngle: 109.5,
    description: "Strong diprotic acid. S has tetrahedral geometry with 2 double bonds to O and 2 single bonds to OH groups.",
    category: "covalent", difficulty: "hard",
    atoms: [
      { id:"S1",  element:S, position:{x:350,y:250}, orbitRings:3 },
      { id:"O1",  element:O, position:{x:350,y:110}, orbitRings:2 },
      { id:"O2",  element:O, position:{x:490,y:250}, orbitRings:2 },
      { id:"O3",  element:O, position:{x:350,y:390}, orbitRings:3 },
      { id:"O4",  element:O, position:{x:210,y:250}, orbitRings:3 },
      { id:"H1",  element:H, position:{x:460,y:390}, orbitRings:1 },
      { id:"H2",  element:H, position:{x:120,y:250}, orbitRings:1 },
    ],
    connections: [
      { id:"b1", fromAtomId:"S1",  toAtomId:"O1",  bondType:"double" },
      { id:"b2", fromAtomId:"S1",  toAtomId:"O2",  bondType:"double" },
      { id:"b3", fromAtomId:"S1",  toAtomId:"O3",  bondType:"single" },
      { id:"b4", fromAtomId:"S1",  toAtomId:"O4",  bondType:"single" },
      { id:"b5", fromAtomId:"O3",  toAtomId:"H1",  bondType:"single" },
      { id:"b6", fromAtomId:"O4",  toAtomId:"H2",  bondType:"single" },
    ],
  },
]

// suppress unused import warning - He is exported for reference
export const _He = He

export const MOLECULE_BY_ID = Object.fromEntries(
  MOLECULES.map(m => [m.id, m])
) as Record<string, Molecule>
