/* eslint-disable react-refresh/only-export-components */
/**
 * SciLab 360 — Interactive Chemistry Simulation
 * Single-file React TSX component
 * Fonts loaded via <link> tag — add to your index.html:
 *   <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Exo+2:wght@300;400;600&display=swap" rel="stylesheet">
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useRef,
  useState,
  useEffect,
  type DragEvent,
} from "react";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type ElementCategory =
  | "noble-gas"
  | "alkali-metal"
  | "alkaline-earth"
  | "transition-metal"
  | "post-transition"
  | "metalloid"
  | "nonmetal"
  | "halogen"
  | "lanthanide"
  | "actinide"
  | "unknown";

export interface ElementData {
  atomicNumber: number;
  symbol: string;
  name: string;
  category: ElementCategory;
  valenceElectrons: number;
  electronegativity: number | null;
  group: number | null;
  period: number;
  isMetal: boolean;
}

export interface PlacedAtom {
  id: string;
  element: ElementData;
  x: number;
  y: number;
}

export interface Bond {
  from: string;
  to: string;
  type: "ionic" | "covalent" | "metallic";
  order: number;
}

export type GameMode = "free-play" | "quiz";

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface QuizChallenge {
  level: number;
  title: string;
  description: string;
  targetFormula: string;
  requiredAtoms: Record<string, number>;
  hint: string;
  difficulty: Difficulty;
}

export interface AppState {
  mode: GameMode;
  score: number;
  level: number;
  placedAtoms: PlacedAtom[];
  bonds: Bond[];
  formula: string;
  feedback: string;
  feedbackType: "info" | "success" | "error" | "warning";
  currentChallenge: QuizChallenge | null;
  completedChallenges: number[];
  selectedElement: ElementData | null;
  draggedElement: ElementData | null;
  showTeacherDash: boolean;
  atomCount: number;
  attempts: number;
}

type AppAction =
  | { type: "SET_MODE"; payload: GameMode }
  | { type: "DROP_ATOM"; payload: { element: ElementData; x: number; y: number } }
  | { type: "REMOVE_ATOM"; payload: string }
  | { type: "CLEAR_SANDBOX" }
  | { type: "SET_DRAG"; payload: ElementData | null }
  | { type: "SELECT_ELEMENT"; payload: ElementData | null }
  | { type: "SET_FEEDBACK"; payload: { msg: string; type: AppState["feedbackType"] } }
  | { type: "SET_LEVEL"; payload: number }
  | { type: "SET_CHALLENGE"; payload: QuizChallenge | null }
  | { type: "COMPLETE_CHALLENGE"; payload: number }
  | { type: "ADD_SCORE"; payload: number }
  | { type: "TOGGLE_TEACHER" }
  | { type: "INC_ATTEMPTS" };

// ─────────────────────────────────────────────────────────────────────────────
// ELEMENT DATA (all 118)
// ─────────────────────────────────────────────────────────────────────────────

function cat(c: ElementCategory): ElementCategory { return c; }

const ELEMENTS: ElementData[] = [
  { atomicNumber: 1, symbol: "H", name: "Hydrogen", category: cat("nonmetal"), valenceElectrons: 1, electronegativity: 2.2, group: 1, period: 1, isMetal: false },
  { atomicNumber: 2, symbol: "He", name: "Helium", category: cat("noble-gas"), valenceElectrons: 2, electronegativity: null, group: 18, period: 1, isMetal: false },
  { atomicNumber: 3, symbol: "Li", name: "Lithium", category: cat("alkali-metal"), valenceElectrons: 1, electronegativity: 0.98, group: 1, period: 2, isMetal: true },
  { atomicNumber: 4, symbol: "Be", name: "Beryllium", category: cat("alkaline-earth"), valenceElectrons: 2, electronegativity: 1.57, group: 2, period: 2, isMetal: true },
  { atomicNumber: 5, symbol: "B", name: "Boron", category: cat("metalloid"), valenceElectrons: 3, electronegativity: 2.04, group: 13, period: 2, isMetal: false },
  { atomicNumber: 6, symbol: "C", name: "Carbon", category: cat("nonmetal"), valenceElectrons: 4, electronegativity: 2.55, group: 14, period: 2, isMetal: false },
  { atomicNumber: 7, symbol: "N", name: "Nitrogen", category: cat("nonmetal"), valenceElectrons: 5, electronegativity: 3.04, group: 15, period: 2, isMetal: false },
  { atomicNumber: 8, symbol: "O", name: "Oxygen", category: cat("nonmetal"), valenceElectrons: 6, electronegativity: 3.44, group: 16, period: 2, isMetal: false },
  { atomicNumber: 9, symbol: "F", name: "Fluorine", category: cat("halogen"), valenceElectrons: 7, electronegativity: 3.98, group: 17, period: 2, isMetal: false },
  { atomicNumber: 10, symbol: "Ne", name: "Neon", category: cat("noble-gas"), valenceElectrons: 8, electronegativity: null, group: 18, period: 2, isMetal: false },
  { atomicNumber: 11, symbol: "Na", name: "Sodium", category: cat("alkali-metal"), valenceElectrons: 1, electronegativity: 0.93, group: 1, period: 3, isMetal: true },
  { atomicNumber: 12, symbol: "Mg", name: "Magnesium", category: cat("alkaline-earth"), valenceElectrons: 2, electronegativity: 1.31, group: 2, period: 3, isMetal: true },
  { atomicNumber: 13, symbol: "Al", name: "Aluminum", category: cat("post-transition"), valenceElectrons: 3, electronegativity: 1.61, group: 13, period: 3, isMetal: true },
  { atomicNumber: 14, symbol: "Si", name: "Silicon", category: cat("metalloid"), valenceElectrons: 4, electronegativity: 1.9, group: 14, period: 3, isMetal: false },
  { atomicNumber: 15, symbol: "P", name: "Phosphorus", category: cat("nonmetal"), valenceElectrons: 5, electronegativity: 2.19, group: 15, period: 3, isMetal: false },
  { atomicNumber: 16, symbol: "S", name: "Sulfur", category: cat("nonmetal"), valenceElectrons: 6, electronegativity: 2.58, group: 16, period: 3, isMetal: false },
  { atomicNumber: 17, symbol: "Cl", name: "Chlorine", category: cat("halogen"), valenceElectrons: 7, electronegativity: 3.16, group: 17, period: 3, isMetal: false },
  { atomicNumber: 18, symbol: "Ar", name: "Argon", category: cat("noble-gas"), valenceElectrons: 8, electronegativity: null, group: 18, period: 3, isMetal: false },
  { atomicNumber: 19, symbol: "K", name: "Potassium", category: cat("alkali-metal"), valenceElectrons: 1, electronegativity: 0.82, group: 1, period: 4, isMetal: true },
  { atomicNumber: 20, symbol: "Ca", name: "Calcium", category: cat("alkaline-earth"), valenceElectrons: 2, electronegativity: 1.0, group: 2, period: 4, isMetal: true },
  { atomicNumber: 21, symbol: "Sc", name: "Scandium", category: cat("transition-metal"), valenceElectrons: 3, electronegativity: 1.36, group: 3, period: 4, isMetal: true },
  { atomicNumber: 22, symbol: "Ti", name: "Titanium", category: cat("transition-metal"), valenceElectrons: 4, electronegativity: 1.54, group: 4, period: 4, isMetal: true },
  { atomicNumber: 23, symbol: "V", name: "Vanadium", category: cat("transition-metal"), valenceElectrons: 5, electronegativity: 1.63, group: 5, period: 4, isMetal: true },
  { atomicNumber: 24, symbol: "Cr", name: "Chromium", category: cat("transition-metal"), valenceElectrons: 6, electronegativity: 1.66, group: 6, period: 4, isMetal: true },
  { atomicNumber: 25, symbol: "Mn", name: "Manganese", category: cat("transition-metal"), valenceElectrons: 7, electronegativity: 1.55, group: 7, period: 4, isMetal: true },
  { atomicNumber: 26, symbol: "Fe", name: "Iron", category: cat("transition-metal"), valenceElectrons: 2, electronegativity: 1.83, group: 8, period: 4, isMetal: true },
  { atomicNumber: 27, symbol: "Co", name: "Cobalt", category: cat("transition-metal"), valenceElectrons: 2, electronegativity: 1.88, group: 9, period: 4, isMetal: true },
  { atomicNumber: 28, symbol: "Ni", name: "Nickel", category: cat("transition-metal"), valenceElectrons: 2, electronegativity: 1.91, group: 10, period: 4, isMetal: true },
  { atomicNumber: 29, symbol: "Cu", name: "Copper", category: cat("transition-metal"), valenceElectrons: 1, electronegativity: 1.9, group: 11, period: 4, isMetal: true },
  { atomicNumber: 30, symbol: "Zn", name: "Zinc", category: cat("transition-metal"), valenceElectrons: 2, electronegativity: 1.65, group: 12, period: 4, isMetal: true },
  { atomicNumber: 31, symbol: "Ga", name: "Gallium", category: cat("post-transition"), valenceElectrons: 3, electronegativity: 1.81, group: 13, period: 4, isMetal: true },
  { atomicNumber: 32, symbol: "Ge", name: "Germanium", category: cat("metalloid"), valenceElectrons: 4, electronegativity: 2.01, group: 14, period: 4, isMetal: false },
  { atomicNumber: 33, symbol: "As", name: "Arsenic", category: cat("metalloid"), valenceElectrons: 5, electronegativity: 2.18, group: 15, period: 4, isMetal: false },
  { atomicNumber: 34, symbol: "Se", name: "Selenium", category: cat("nonmetal"), valenceElectrons: 6, electronegativity: 2.55, group: 16, period: 4, isMetal: false },
  { atomicNumber: 35, symbol: "Br", name: "Bromine", category: cat("halogen"), valenceElectrons: 7, electronegativity: 2.96, group: 17, period: 4, isMetal: false },
  { atomicNumber: 36, symbol: "Kr", name: "Krypton", category: cat("noble-gas"), valenceElectrons: 8, electronegativity: 3.0, group: 18, period: 4, isMetal: false },
  { atomicNumber: 37, symbol: "Rb", name: "Rubidium", category: cat("alkali-metal"), valenceElectrons: 1, electronegativity: 0.82, group: 1, period: 5, isMetal: true },
  { atomicNumber: 38, symbol: "Sr", name: "Strontium", category: cat("alkaline-earth"), valenceElectrons: 2, electronegativity: 0.95, group: 2, period: 5, isMetal: true },
  { atomicNumber: 39, symbol: "Y", name: "Yttrium", category: cat("transition-metal"), valenceElectrons: 3, electronegativity: 1.22, group: 3, period: 5, isMetal: true },
  { atomicNumber: 40, symbol: "Zr", name: "Zirconium", category: cat("transition-metal"), valenceElectrons: 4, electronegativity: 1.33, group: 4, period: 5, isMetal: true },
  { atomicNumber: 41, symbol: "Nb", name: "Niobium", category: cat("transition-metal"), valenceElectrons: 5, electronegativity: 1.6, group: 5, period: 5, isMetal: true },
  { atomicNumber: 42, symbol: "Mo", name: "Molybdenum", category: cat("transition-metal"), valenceElectrons: 6, electronegativity: 2.16, group: 6, period: 5, isMetal: true },
  { atomicNumber: 43, symbol: "Tc", name: "Technetium", category: cat("transition-metal"), valenceElectrons: 7, electronegativity: 1.9, group: 7, period: 5, isMetal: true },
  { atomicNumber: 44, symbol: "Ru", name: "Ruthenium", category: cat("transition-metal"), valenceElectrons: 7, electronegativity: 2.2, group: 8, period: 5, isMetal: true },
  { atomicNumber: 45, symbol: "Rh", name: "Rhodium", category: cat("transition-metal"), valenceElectrons: 6, electronegativity: 2.28, group: 9, period: 5, isMetal: true },
  { atomicNumber: 46, symbol: "Pd", name: "Palladium", category: cat("transition-metal"), valenceElectrons: 10, electronegativity: 2.2, group: 10, period: 5, isMetal: true },
  { atomicNumber: 47, symbol: "Ag", name: "Silver", category: cat("transition-metal"), valenceElectrons: 1, electronegativity: 1.93, group: 11, period: 5, isMetal: true },
  { atomicNumber: 48, symbol: "Cd", name: "Cadmium", category: cat("transition-metal"), valenceElectrons: 2, electronegativity: 1.69, group: 12, period: 5, isMetal: true },
  { atomicNumber: 49, symbol: "In", name: "Indium", category: cat("post-transition"), valenceElectrons: 3, electronegativity: 1.78, group: 13, period: 5, isMetal: true },
  { atomicNumber: 50, symbol: "Sn", name: "Tin", category: cat("post-transition"), valenceElectrons: 4, electronegativity: 1.96, group: 14, period: 5, isMetal: true },
  { atomicNumber: 51, symbol: "Sb", name: "Antimony", category: cat("metalloid"), valenceElectrons: 5, electronegativity: 2.05, group: 15, period: 5, isMetal: false },
  { atomicNumber: 52, symbol: "Te", name: "Tellurium", category: cat("metalloid"), valenceElectrons: 6, electronegativity: 2.1, group: 16, period: 5, isMetal: false },
  { atomicNumber: 53, symbol: "I", name: "Iodine", category: cat("halogen"), valenceElectrons: 7, electronegativity: 2.66, group: 17, period: 5, isMetal: false },
  { atomicNumber: 54, symbol: "Xe", name: "Xenon", category: cat("noble-gas"), valenceElectrons: 8, electronegativity: 2.6, group: 18, period: 5, isMetal: false },
  { atomicNumber: 55, symbol: "Cs", name: "Cesium", category: cat("alkali-metal"), valenceElectrons: 1, electronegativity: 0.79, group: 1, period: 6, isMetal: true },
  { atomicNumber: 56, symbol: "Ba", name: "Barium", category: cat("alkaline-earth"), valenceElectrons: 2, electronegativity: 0.89, group: 2, period: 6, isMetal: true },
  { atomicNumber: 57, symbol: "La", name: "Lanthanum", category: cat("lanthanide"), valenceElectrons: 3, electronegativity: 1.1, group: 3, period: 6, isMetal: true },
  { atomicNumber: 58, symbol: "Ce", name: "Cerium", category: cat("lanthanide"), valenceElectrons: 4, electronegativity: 1.12, group: null, period: 6, isMetal: true },
  { atomicNumber: 59, symbol: "Pr", name: "Praseodymium", category: cat("lanthanide"), valenceElectrons: 3, electronegativity: 1.13, group: null, period: 6, isMetal: true },
  { atomicNumber: 60, symbol: "Nd", name: "Neodymium", category: cat("lanthanide"), valenceElectrons: 3, electronegativity: 1.14, group: null, period: 6, isMetal: true },
  { atomicNumber: 61, symbol: "Pm", name: "Promethium", category: cat("lanthanide"), valenceElectrons: 3, electronegativity: 1.13, group: null, period: 6, isMetal: true },
  { atomicNumber: 62, symbol: "Sm", name: "Samarium", category: cat("lanthanide"), valenceElectrons: 3, electronegativity: 1.17, group: null, period: 6, isMetal: true },
  { atomicNumber: 63, symbol: "Eu", name: "Europium", category: cat("lanthanide"), valenceElectrons: 3, electronegativity: 1.2, group: null, period: 6, isMetal: true },
  { atomicNumber: 64, symbol: "Gd", name: "Gadolinium", category: cat("lanthanide"), valenceElectrons: 3, electronegativity: 1.2, group: null, period: 6, isMetal: true },
  { atomicNumber: 65, symbol: "Tb", name: "Terbium", category: cat("lanthanide"), valenceElectrons: 3, electronegativity: 1.1, group: null, period: 6, isMetal: true },
  { atomicNumber: 66, symbol: "Dy", name: "Dysprosium", category: cat("lanthanide"), valenceElectrons: 3, electronegativity: 1.22, group: null, period: 6, isMetal: true },
  { atomicNumber: 67, symbol: "Ho", name: "Holmium", category: cat("lanthanide"), valenceElectrons: 3, electronegativity: 1.23, group: null, period: 6, isMetal: true },
  { atomicNumber: 68, symbol: "Er", name: "Erbium", category: cat("lanthanide"), valenceElectrons: 3, electronegativity: 1.24, group: null, period: 6, isMetal: true },
  { atomicNumber: 69, symbol: "Tm", name: "Thulium", category: cat("lanthanide"), valenceElectrons: 3, electronegativity: 1.25, group: null, period: 6, isMetal: true },
  { atomicNumber: 70, symbol: "Yb", name: "Ytterbium", category: cat("lanthanide"), valenceElectrons: 3, electronegativity: 1.1, group: null, period: 6, isMetal: true },
  { atomicNumber: 71, symbol: "Lu", name: "Lutetium", category: cat("lanthanide"), valenceElectrons: 3, electronegativity: 1.27, group: 3, period: 6, isMetal: true },
  { atomicNumber: 72, symbol: "Hf", name: "Hafnium", category: cat("transition-metal"), valenceElectrons: 4, electronegativity: 1.3, group: 4, period: 6, isMetal: true },
  { atomicNumber: 73, symbol: "Ta", name: "Tantalum", category: cat("transition-metal"), valenceElectrons: 5, electronegativity: 1.5, group: 5, period: 6, isMetal: true },
  { atomicNumber: 74, symbol: "W", name: "Tungsten", category: cat("transition-metal"), valenceElectrons: 6, electronegativity: 2.36, group: 6, period: 6, isMetal: true },
  { atomicNumber: 75, symbol: "Re", name: "Rhenium", category: cat("transition-metal"), valenceElectrons: 7, electronegativity: 1.9, group: 7, period: 6, isMetal: true },
  { atomicNumber: 76, symbol: "Os", name: "Osmium", category: cat("transition-metal"), valenceElectrons: 6, electronegativity: 2.2, group: 8, period: 6, isMetal: true },
  { atomicNumber: 77, symbol: "Ir", name: "Iridium", category: cat("transition-metal"), valenceElectrons: 6, electronegativity: 2.2, group: 9, period: 6, isMetal: true },
  { atomicNumber: 78, symbol: "Pt", name: "Platinum", category: cat("transition-metal"), valenceElectrons: 1, electronegativity: 2.28, group: 10, period: 6, isMetal: true },
  { atomicNumber: 79, symbol: "Au", name: "Gold", category: cat("transition-metal"), valenceElectrons: 1, electronegativity: 2.54, group: 11, period: 6, isMetal: true },
  { atomicNumber: 80, symbol: "Hg", name: "Mercury", category: cat("transition-metal"), valenceElectrons: 2, electronegativity: 2.0, group: 12, period: 6, isMetal: true },
  { atomicNumber: 81, symbol: "Tl", name: "Thallium", category: cat("post-transition"), valenceElectrons: 3, electronegativity: 1.62, group: 13, period: 6, isMetal: true },
  { atomicNumber: 82, symbol: "Pb", name: "Lead", category: cat("post-transition"), valenceElectrons: 4, electronegativity: 2.33, group: 14, period: 6, isMetal: true },
  { atomicNumber: 83, symbol: "Bi", name: "Bismuth", category: cat("post-transition"), valenceElectrons: 5, electronegativity: 2.02, group: 15, period: 6, isMetal: true },
  { atomicNumber: 84, symbol: "Po", name: "Polonium", category: cat("post-transition"), valenceElectrons: 6, electronegativity: 2.0, group: 16, period: 6, isMetal: true },
  { atomicNumber: 85, symbol: "At", name: "Astatine", category: cat("halogen"), valenceElectrons: 7, electronegativity: 2.2, group: 17, period: 6, isMetal: false },
  { atomicNumber: 86, symbol: "Rn", name: "Radon", category: cat("noble-gas"), valenceElectrons: 8, electronegativity: null, group: 18, period: 6, isMetal: false },
  { atomicNumber: 87, symbol: "Fr", name: "Francium", category: cat("alkali-metal"), valenceElectrons: 1, electronegativity: 0.7, group: 1, period: 7, isMetal: true },
  { atomicNumber: 88, symbol: "Ra", name: "Radium", category: cat("alkaline-earth"), valenceElectrons: 2, electronegativity: 0.9, group: 2, period: 7, isMetal: true },
  { atomicNumber: 89, symbol: "Ac", name: "Actinium", category: cat("actinide"), valenceElectrons: 3, electronegativity: 1.1, group: 3, period: 7, isMetal: true },
  { atomicNumber: 90, symbol: "Th", name: "Thorium", category: cat("actinide"), valenceElectrons: 4, electronegativity: 1.3, group: null, period: 7, isMetal: true },
  { atomicNumber: 91, symbol: "Pa", name: "Protactinium", category: cat("actinide"), valenceElectrons: 5, electronegativity: 1.5, group: null, period: 7, isMetal: true },
  { atomicNumber: 92, symbol: "U", name: "Uranium", category: cat("actinide"), valenceElectrons: 6, electronegativity: 1.38, group: null, period: 7, isMetal: true },
  { atomicNumber: 93, symbol: "Np", name: "Neptunium", category: cat("actinide"), valenceElectrons: 5, electronegativity: 1.36, group: null, period: 7, isMetal: true },
  { atomicNumber: 94, symbol: "Pu", name: "Plutonium", category: cat("actinide"), valenceElectrons: 6, electronegativity: 1.28, group: null, period: 7, isMetal: true },
  { atomicNumber: 95, symbol: "Am", name: "Americium", category: cat("actinide"), valenceElectrons: 3, electronegativity: 1.13, group: null, period: 7, isMetal: true },
  { atomicNumber: 96, symbol: "Cm", name: "Curium", category: cat("actinide"), valenceElectrons: 3, electronegativity: 1.28, group: null, period: 7, isMetal: true },
  { atomicNumber: 97, symbol: "Bk", name: "Berkelium", category: cat("actinide"), valenceElectrons: 3, electronegativity: 1.3, group: null, period: 7, isMetal: true },
  { atomicNumber: 98, symbol: "Cf", name: "Californium", category: cat("actinide"), valenceElectrons: 3, electronegativity: 1.3, group: null, period: 7, isMetal: true },
  { atomicNumber: 99, symbol: "Es", name: "Einsteinium", category: cat("actinide"), valenceElectrons: 3, electronegativity: 1.3, group: null, period: 7, isMetal: true },
  { atomicNumber: 100, symbol: "Fm", name: "Fermium", category: cat("actinide"), valenceElectrons: 3, electronegativity: 1.3, group: null, period: 7, isMetal: true },
  { atomicNumber: 101, symbol: "Md", name: "Mendelevium", category: cat("actinide"), valenceElectrons: 3, electronegativity: 1.3, group: null, period: 7, isMetal: true },
  { atomicNumber: 102, symbol: "No", name: "Nobelium", category: cat("actinide"), valenceElectrons: 3, electronegativity: 1.3, group: null, period: 7, isMetal: true },
  { atomicNumber: 103, symbol: "Lr", name: "Lawrencium", category: cat("actinide"), valenceElectrons: 3, electronegativity: 1.3, group: 3, period: 7, isMetal: true },
  { atomicNumber: 104, symbol: "Rf", name: "Rutherfordium", category: cat("unknown"), valenceElectrons: 4, electronegativity: null, group: 4, period: 7, isMetal: true },
  { atomicNumber: 105, symbol: "Db", name: "Dubnium", category: cat("unknown"), valenceElectrons: 5, electronegativity: null, group: 5, period: 7, isMetal: true },
  { atomicNumber: 106, symbol: "Sg", name: "Seaborgium", category: cat("unknown"), valenceElectrons: 6, electronegativity: null, group: 6, period: 7, isMetal: true },
  { atomicNumber: 107, symbol: "Bh", name: "Bohrium", category: cat("unknown"), valenceElectrons: 7, electronegativity: null, group: 7, period: 7, isMetal: true },
  { atomicNumber: 108, symbol: "Hs", name: "Hassium", category: cat("unknown"), valenceElectrons: 8, electronegativity: null, group: 8, period: 7, isMetal: true },
  { atomicNumber: 109, symbol: "Mt", name: "Meitnerium", category: cat("unknown"), valenceElectrons: 9, electronegativity: null, group: 9, period: 7, isMetal: true },
  { atomicNumber: 110, symbol: "Ds", name: "Darmstadtium", category: cat("unknown"), valenceElectrons: 10, electronegativity: null, group: 10, period: 7, isMetal: true },
  { atomicNumber: 111, symbol: "Rg", name: "Roentgenium", category: cat("unknown"), valenceElectrons: 11, electronegativity: null, group: 11, period: 7, isMetal: true },
  { atomicNumber: 112, symbol: "Cn", name: "Copernicium", category: cat("unknown"), valenceElectrons: 12, electronegativity: null, group: 12, period: 7, isMetal: true },
  { atomicNumber: 113, symbol: "Nh", name: "Nihonium", category: cat("unknown"), valenceElectrons: 3, electronegativity: null, group: 13, period: 7, isMetal: true },
  { atomicNumber: 114, symbol: "Fl", name: "Flerovium", category: cat("unknown"), valenceElectrons: 4, electronegativity: null, group: 14, period: 7, isMetal: true },
  { atomicNumber: 115, symbol: "Mc", name: "Moscovium", category: cat("unknown"), valenceElectrons: 5, electronegativity: null, group: 15, period: 7, isMetal: true },
  { atomicNumber: 116, symbol: "Lv", name: "Livermorium", category: cat("unknown"), valenceElectrons: 6, electronegativity: null, group: 16, period: 7, isMetal: true },
  { atomicNumber: 117, symbol: "Ts", name: "Tennessine", category: cat("unknown"), valenceElectrons: 7, electronegativity: null, group: 17, period: 7, isMetal: false },
  { atomicNumber: 118, symbol: "Og", name: "Oganesson", category: cat("unknown"), valenceElectrons: 8, electronegativity: null, group: 18, period: 7, isMetal: false },
];

// ─────────────────────────────────────────────────────────────────────────────
// CHEMISTRY ENGINE
// ─────────────────────────────────────────────────────────────────────────────

export const KNOWN_COMPOUNDS: Record<string, { name: string; geometry: string; bondAngle: string }> = {
  "H2": { name: "Dihydrogen", geometry: "Linear", bondAngle: "180°" },
  "O2": { name: "Dioxygen", geometry: "Linear", bondAngle: "180°" },
  "N2": { name: "Dinitrogen", geometry: "Linear", bondAngle: "180°" },
  "F2": { name: "Difluorine", geometry: "Linear", bondAngle: "180°" },
  "Cl2": { name: "Dichlorine", geometry: "Linear", bondAngle: "180°" },
  "Br2": { name: "Dibromine", geometry: "Linear", bondAngle: "180°" },
  "I2": { name: "Diiodine", geometry: "Linear", bondAngle: "180°" },
  "HCl": { name: "Hydrogen Chloride", geometry: "Linear", bondAngle: "180°" },
  "HF": { name: "Hydrogen Fluoride", geometry: "Linear", bondAngle: "180°" },
  "HBr": { name: "Hydrogen Bromide", geometry: "Linear", bondAngle: "180°" },
  "H2O": { name: "Water", geometry: "Bent", bondAngle: "104.5°" },
  "H2S": { name: "Hydrogen Sulfide", geometry: "Bent", bondAngle: "92°" },
  "NH3": { name: "Ammonia", geometry: "Trigonal Pyramidal", bondAngle: "107°" },
  "CO2": { name: "Carbon Dioxide", geometry: "Linear", bondAngle: "180°" },
  "CO": { name: "Carbon Monoxide", geometry: "Linear", bondAngle: "180°" },
  "CH4": { name: "Methane", geometry: "Tetrahedral", bondAngle: "109.5°" },
  "SO2": { name: "Sulfur Dioxide", geometry: "Bent", bondAngle: "119°" },
  "SO3": { name: "Sulfur Trioxide", geometry: "Trigonal Planar", bondAngle: "120°" },
  "NO2": { name: "Nitrogen Dioxide", geometry: "Bent", bondAngle: "134°" },
  "NaCl": { name: "Sodium Chloride (Table Salt)", geometry: "Ionic Crystal", bondAngle: "90°" },
  "KCl": { name: "Potassium Chloride", geometry: "Ionic Crystal", bondAngle: "90°" },
  "MgO": { name: "Magnesium Oxide", geometry: "Ionic Crystal", bondAngle: "90°" },
  "CaCl2": { name: "Calcium Chloride", geometry: "Ionic Crystal", bondAngle: "90°" },
  "NaF": { name: "Sodium Fluoride", geometry: "Ionic Crystal", bondAngle: "90°" },
  "LiCl": { name: "Lithium Chloride", geometry: "Ionic Crystal", bondAngle: "90°" },
  "Fe2O3": { name: "Iron(III) Oxide (Rust)", geometry: "Ionic Crystal", bondAngle: "90°" },
  "C2H2": { name: "Acetylene", geometry: "Linear", bondAngle: "180°" },
  "C2H4": { name: "Ethylene", geometry: "Trigonal Planar", bondAngle: "120°" },
  "C2H6": { name: "Ethane", geometry: "Tetrahedral", bondAngle: "109.5°" },
  "C6H6": { name: "Benzene", geometry: "Trigonal Planar", bondAngle: "120°" },
  "H2O2": { name: "Hydrogen Peroxide", geometry: "Bent", bondAngle: "111°" },
  "PCl3": { name: "Phosphorus Trichloride", geometry: "Trigonal Pyramidal", bondAngle: "100°" },
  "PCl5": { name: "Phosphorus Pentachloride", geometry: "Trigonal Bipyramidal", bondAngle: "90°/120°" },
  "SF6": { name: "Sulfur Hexafluoride", geometry: "Octahedral", bondAngle: "90°" },
};

export function computeFormula(atoms: PlacedAtom[]): string {
  const counts: Record<string, number> = {};
  for (const a of atoms) {
    counts[a.element.symbol] = (counts[a.element.symbol] || 0) + 1;
  }
  // Hill order: C first, then H, then rest alphabetically
  const order = Object.keys(counts).sort((a, b) => {
    if (a === "C") return -1;
    if (b === "C") return 1;
    if (a === "H") return -1;
    if (b === "H") return 1;
    return a.localeCompare(b);
  });
  return order.map(s => counts[s] > 1 ? `${s}${counts[s]}` : s).join("");
}

export function detectBonds(atoms: PlacedAtom[]): Bond[] {
  const bonds: Bond[] = [];
  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const a = atoms[i];
      const b = atoms[j];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist < 130) {
        const aIsMetal = a.element.isMetal;
        const bIsMetal = b.element.isMetal;
        let bondType: Bond["type"];
        if (aIsMetal && bIsMetal) bondType = "metallic";
        else if (aIsMetal !== bIsMetal) bondType = "ionic";
        else bondType = "covalent";

        const sharedPairs = Math.min(
          Math.floor((8 - a.element.valenceElectrons) / 2),
          Math.floor((8 - b.element.valenceElectrons) / 2)
        );
        const order = Math.max(1, Math.min(3, sharedPairs));

        bonds.push({ from: a.id, to: b.id, type: bondType, order });
      }
    }
  }
  return bonds;
}

export function validateBond(a: ElementData, b: ElementData): { valid: boolean; reason: string } {
  if (a.category === "noble-gas" || b.category === "noble-gas") {
    const ng = a.category === "noble-gas" ? a : b;
    return { valid: false, reason: `${ng.name} is a noble gas and rarely forms bonds (stable octet).` };
  }
  return { valid: true, reason: "" };
}

export function generateFeedback(atoms: PlacedAtom[], bonds: Bond[], formula: string): { msg: string; type: AppState["feedbackType"] } {
  if (atoms.length === 0) return { msg: "Drag atoms from the periodic table into the sandbox to begin building molecules!", type: "info" };
  if (atoms.length === 1) return { msg: `${atoms[0].element.name} added. Add more atoms to form bonds. Valence electrons: ${atoms[0].element.valenceElectrons}`, type: "info" };

  const compound = KNOWN_COMPOUNDS[formula];
  if (compound) {
    const bondTypes = [...new Set(bonds.map(b => b.type))];
    const bondDesc = bondTypes.join(" & ");
    return {
      msg: `✨ ${compound.name} (${formula}) — ${bondDesc} bonding | Geometry: ${compound.geometry} | Bond Angle: ${compound.bondAngle}`,
      type: "success"
    };
  }

  if (bonds.length === 0 && atoms.length > 1) {
    return { msg: `${atoms.length} atoms present but no bonds detected. Bring atoms closer together (within 130px).`, type: "warning" };
  }

  const ionicBonds = bonds.filter(b => b.type === "ionic");
  const covalentBonds = bonds.filter(b => b.type === "covalent");
  if (ionicBonds.length > 0 && covalentBonds.length === 0) {
    return { msg: `Formula: ${formula} — Ionic bonding detected (metal + nonmetal electron transfer). Lattice energy holds the compound together.`, type: "info" };
  }
  if (covalentBonds.length > 0 && ionicBonds.length === 0) {
    const doubleBonds = bonds.filter(b => b.order === 2).length;
    const tripleBonds = bonds.filter(b => b.order === 3).length;
    let desc = "Covalent bonding (electron sharing)";
    if (tripleBonds > 0) desc += ` | ${tripleBonds} triple bond(s)`;
    else if (doubleBonds > 0) desc += ` | ${doubleBonds} double bond(s)`;
    return { msg: `Formula: ${formula} — ${desc}.`, type: "info" };
  }

  return { msg: `Formula: ${formula} — ${bonds.length} bond(s) detected (mixed ionic/covalent).`, type: "info" };
}

// ─────────────────────────────────────────────────────────────────────────────
// QUIZ CHALLENGES
// ─────────────────────────────────────────────────────────────────────────────

const QUIZ_LEVELS: QuizChallenge[] = [
  {
    level: 1, title: "Diatomic Molecules", description: "Build Hydrogen Gas (H₂)", targetFormula: "H2", requiredAtoms: { H: 2 }, hint: "Drag 2 Hydrogen atoms close together. Two nonmetals share electrons = covalent bond!",
    difficulty: "easy"
  },
  {
    level: 2, title: "Diatomic Molecules", description: "Build Oxygen Gas (O₂)", targetFormula: "O2", requiredAtoms: { O: 2 }, hint: "Oxygen needs 2 more electrons to complete its octet — it forms a double bond with another O!",
    difficulty: "easy"
  },
  {
    level: 3, title: "Ionic Compounds", description: "Build Table Salt (NaCl)", targetFormula: "NaCl", requiredAtoms: { Na: 1, Cl: 1 }, hint: "Sodium (metal) transfers its 1 valence electron to Chlorine (nonmetal). Metal + Nonmetal = Ionic bond!",
    difficulty: "easy"
  },
  {
    level: 4, title: "Simple Covalent", description: "Build Water (H₂O)", targetFormula: "H2O", requiredAtoms: { H: 2, O: 1 }, hint: "Oxygen has 6 valence electrons and needs 2 more. Two H atoms share one electron each. Bent geometry, 104.5°!",
    difficulty: "easy"
  },
  {
    level: 5, title: "Simple Covalent", description: "Build Ammonia (NH₃)", targetFormula: "NH3", requiredAtoms: { N: 1, H: 3 }, hint: "Nitrogen has 5 valence electrons, needs 3 more. Add 3 Hydrogen atoms around it!",
    difficulty: "easy"
  },
  {
    level: 6, title: "Carbon Compounds", description: "Build Carbon Dioxide (CO₂)", targetFormula: "CO2", requiredAtoms: { C: 1, O: 2 }, hint: "Carbon needs 4 bonds. Each Oxygen forms a double bond with Carbon. Linear geometry!",
    difficulty: "easy"
  },
  {
    level: 7, title: "Carbon Compounds", description: "Build Methane (CH₄)", targetFormula: "CH4", requiredAtoms: { C: 1, H: 4 }, hint: "Carbon has 4 valence electrons and needs 4 single bonds. Add 4 Hydrogen atoms!",
    difficulty: "easy"
  },
  {
    level: 8, title: "Ionic Compound", description: "Build Magnesium Oxide (MgO)", targetFormula: "MgO", requiredAtoms: { Mg: 1, O: 1 }, hint: "Magnesium (metal) transfers 2 electrons to Oxygen (nonmetal). Ionic bond with 2:2 charge balance!",
    difficulty: "easy"
  },
  {
    level: 9, title: "Polyatomic", description: "Build Sulfur Dioxide (SO₂)", targetFormula: "SO2", requiredAtoms: { S: 1, O: 2 }, hint: "Sulfur can expand its octet. Place 2 Oxygen atoms around Sulfur for bent geometry!",
    difficulty: "easy"
  },
  {
    level: 10, title: "Complex Covalent", description: "Build Hydrogen Peroxide (H₂O₂)", targetFormula: "H2O2", requiredAtoms: { H: 2, O: 2 }, hint: "Two O atoms bonded to each other, each also bonded to one H. Bent geometry per oxygen!",
    difficulty: "easy"
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// STATE MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

const initialState: AppState = {
  mode: "free-play",
  score: 0,
  level: 1,
  placedAtoms: [],
  bonds: [],
  formula: "",
  feedback: "Drag atoms from the periodic table into the sandbox to begin building molecules!",
  feedbackType: "info",
  currentChallenge: QUIZ_LEVELS[0],
  completedChallenges: [],
  selectedElement: null,
  draggedElement: null,
  showTeacherDash: false,
  atomCount: 0,
  attempts: 0,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_MODE": {
      const challenge = action.payload === "quiz" ? QUIZ_LEVELS[0] : null;
      return { ...state, mode: action.payload, currentChallenge: challenge, placedAtoms: [], bonds: [], formula: "", feedback: action.payload === "quiz" ? `Quiz Mode: ${QUIZ_LEVELS[0].description}` : "Free Play — explore any combination!", feedbackType: "info" };
    }
    case "DROP_ATOM": {
      const id = `${action.payload.element.symbol}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const newAtom: PlacedAtom = { id, element: action.payload.element, x: action.payload.x, y: action.payload.y };
      const newAtoms = [...state.placedAtoms, newAtom];
      const newBonds = detectBonds(newAtoms);
      const formula = computeFormula(newAtoms);
      const fb = generateFeedback(newAtoms, newBonds, formula);

      // Check quiz completion
      let newScore = state.score;
      let newCompleted = state.completedChallenges;
      let newLevel = state.level;
      let newChallenge = state.currentChallenge;

      if (state.mode === "quiz" && state.currentChallenge && formula === state.currentChallenge.targetFormula) {
        const pts = 100 + (3 - Math.min(3, state.attempts)) * 25;
        newScore = state.score + pts;
        newCompleted = [...newCompleted, state.currentChallenge.level];
        const nextIdx = QUIZ_LEVELS.findIndex(q => q.level === state.currentChallenge!.level + 1);
        newLevel = state.level + 1;
        newChallenge = nextIdx >= 0 ? QUIZ_LEVELS[nextIdx] : null;
        return { ...state, placedAtoms: newAtoms, bonds: newBonds, formula, feedback: `🎉 Correct! ${state.currentChallenge.description} solved! +${pts} pts`, feedbackType: "success", score: newScore, completedChallenges: newCompleted, level: newLevel, currentChallenge: newChallenge, atomCount: state.atomCount + 1 };
      }

      return { ...state, placedAtoms: newAtoms, bonds: newBonds, formula, feedback: fb.msg, feedbackType: fb.type, atomCount: state.atomCount + 1 };
    }
    case "REMOVE_ATOM": {
      const newAtoms = state.placedAtoms.filter(a => a.id !== action.payload);
      const newBonds = detectBonds(newAtoms);
      const formula = computeFormula(newAtoms);
      const fb = generateFeedback(newAtoms, newBonds, formula);
      return { ...state, placedAtoms: newAtoms, bonds: newBonds, formula, feedback: fb.msg, feedbackType: fb.type };
    }
    case "CLEAR_SANDBOX":
      return { ...state, placedAtoms: [], bonds: [], formula: "", feedback: "Sandbox cleared. Start building!", feedbackType: "info", attempts: 0 };
    case "SET_DRAG":
      return { ...state, draggedElement: action.payload };
    case "SELECT_ELEMENT":
      return { ...state, selectedElement: action.payload };
    case "SET_FEEDBACK":
      return { ...state, feedback: action.payload.msg, feedbackType: action.payload.type };
    case "SET_LEVEL":
      return { ...state, level: action.payload, currentChallenge: QUIZ_LEVELS.find(q => q.level === action.payload) || null };
    case "SET_CHALLENGE":
      return { ...state, currentChallenge: action.payload, placedAtoms: [], bonds: [], formula: "", attempts: 0 };
    case "COMPLETE_CHALLENGE":
      return { ...state, completedChallenges: [...state.completedChallenges, action.payload] };
    case "ADD_SCORE":
      return { ...state, score: state.score + action.payload };
    case "TOGGLE_TEACHER":
      return { ...state, showTeacherDash: !state.showTeacherDash };
    case "INC_ATTEMPTS":
      return { ...state, attempts: state.attempts + 1 };
    default:
      return state;
  }
}

const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<AppAction> } | null>(null);

function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

// ─────────────────────────────────────────────────────────────────────────────
// COLOR MAPPINGS
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<ElementCategory, { bg: string; border: string; text: string; glow: string }> = {
  "alkali-metal":     { bg: "#3b0764", border: "#a855f7", text: "#d8b4fe", glow: "#a855f7" },
  "alkaline-earth":   { bg: "#4a044e", border: "#e879f9", text: "#f0abfc", glow: "#e879f9" },
  "transition-metal": { bg: "#1e1b4b", border: "#818cf8", text: "#c7d2fe", glow: "#818cf8" },
  "post-transition":  { bg: "#0c1a3e", border: "#38bdf8", text: "#bae6fd", glow: "#38bdf8" },
  "metalloid":        { bg: "#2d1b69", border: "#7c3aed", text: "#ddd6fe", glow: "#7c3aed" },
  "nonmetal":         { bg: "#0c1445", border: "#6366f1", text: "#a5b4fc", glow: "#6366f1" },
  "halogen":          { bg: "#500724", border: "#f43f5e", text: "#fda4af", glow: "#f43f5e" },
  "noble-gas":        { bg: "#042f2e", border: "#2dd4bf", text: "#99f6e4", glow: "#2dd4bf" },
  "lanthanide":       { bg: "#1c1917", border: "#fb923c", text: "#fed7aa", glow: "#fb923c" },
  "actinide":         { bg: "#2d1515", border: "#f87171", text: "#fecaca", glow: "#f87171" },
  "unknown":          { bg: "#1e1b2e", border: "#6b21a8", text: "#c084fc", glow: "#6b21a8" },
};

function getAtomColor(category: ElementCategory): string {
  const map: Record<ElementCategory, string> = {
    "nonmetal":         "#4338ca",
    "noble-gas":        "#0d9488",
    "alkali-metal":     "#7e22ce",
    "alkaline-earth":   "#a21caf",
    "transition-metal": "#3730a3",
    "post-transition":  "#0369a1",
    "metalloid":        "#5b21b6",
    "halogen":          "#be123c",
    "lanthanide":       "#c2410c",
    "actinide":         "#991b1b",
    "unknown":          "#3b0764",
  };
  return map[category] || "#3b0764";
}

// ─────────────────────────────────────────────────────────────────────────────
// PERIODIC TABLE LAYOUT (standard 18-column grid)
// ─────────────────────────────────────────────────────────────────────────────

interface GridElement extends ElementData { col: number; row: number; }

function buildPeriodicGrid(): GridElement[] {
  const result: GridElement[] = [];

  // Map each element to row/col in the standard 18-column layout
  for (const el of ELEMENTS) {
    let row = el.period;
    let col = el.group || 0;

    if (el.category === "lanthanide" && el.atomicNumber >= 58 && el.atomicNumber <= 71) {
      row = 9; // Extra lanthanide row
      col = el.atomicNumber - 57 + 2;
    } else if (el.category === "actinide" && el.atomicNumber >= 90 && el.atomicNumber <= 103) {
      row = 10; // Extra actinide row
      col = el.atomicNumber - 89 + 2;
    }

    if (col > 0 && row > 0) {
      result.push({ ...el, row, col });
    }
  }
  return result;
}

const GRID_ELEMENTS = buildPeriodicGrid();

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

// ── Periodic Table Tile ──
const ElementTile: React.FC<{ el: ElementData; tiny?: boolean }> = ({ el, tiny = false }) => {
  const { dispatch } = useApp();
  const colors = CATEGORY_COLORS[el.category];

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("elementSymbol", el.symbol);
    dispatch({ type: "SET_DRAG", payload: el });
  };

  const handleDragEnd = () => dispatch({ type: "SET_DRAG", payload: null });

  const handleClick = () => dispatch({ type: "SELECT_ELEMENT", payload: el });

  if (tiny) {
    return (
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        title={`${el.name} (${el.atomicNumber})`}
        style={{
          background: colors.bg,
          border: `1px solid ${colors.border}`,
          color: colors.text,
          cursor: "grab",
          userSelect: "none",
          width: "100%",
          aspectRatio: "1",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 3,
          transition: "all 0.15s",
          fontSize: 9,
          lineHeight: 1,
          padding: 1,
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 8px ${colors.glow}`;
          (e.currentTarget as HTMLDivElement).style.transform = "scale(1.15)";
          (e.currentTarget as HTMLDivElement).style.zIndex = "10";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
          (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
          (e.currentTarget as HTMLDivElement).style.zIndex = "1";
        }}
      >
        <span style={{ fontSize: 6, opacity: 0.7 }}>{el.atomicNumber}</span>
        <span style={{ fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: 10 }}>{el.symbol}</span>
      </div>
    );
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        color: colors.text,
        cursor: "grab",
        userSelect: "none",
        padding: "4px 6px",
        borderRadius: 4,
        transition: "all 0.15s",
        minWidth: 42,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 12px ${colors.glow}`;
        (e.currentTarget as HTMLDivElement).style.transform = "scale(1.05)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
      }}
    >
      <div style={{ fontSize: 9, opacity: 0.6, fontFamily: "'Share Tech Mono', monospace" }}>{el.atomicNumber}</div>
      <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: 14 }}>{el.symbol}</div>
      <div style={{ fontSize: 8, opacity: 0.7, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 40 }}>{el.name}</div>
    </div>
  );
};

// ── Periodic Table Panel ──
const PeriodicTablePanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCat, setFilterCat] = useState<ElementCategory | "all">("all");
  const [showFull, setShowFull] = useState(false);

  const COMMON_ELEMENTS = ["H", "He", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca", "Fe", "Cu", "Zn", "Br", "I", "Ba", "Pb"];

  const filtered = ELEMENTS.filter(el => {
    const matchSearch = !searchTerm ||
      el.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      el.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      el.atomicNumber.toString() === searchTerm;
    const matchCat = filterCat === "all" || el.category === filterCat;
    return matchSearch && matchCat;
  });

  const commonEls = ELEMENTS.filter(el => COMMON_ELEMENTS.includes(el.symbol));
  const showFiltered = searchTerm || filterCat !== "all";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {/* Search */}
      <input
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Search by name, symbol, or number..."
        style={{
          width: "100%", padding: "5px 10px", background: "#07011a", border: "1px solid #2d1b5e",
          borderRadius: 6, color: "#e2e8f0", fontFamily: "'Share Tech Mono', monospace", fontSize: 11,
          boxSizing: "border-box", outline: "none",
        }}
      />
      {/* Category filter */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {(["all", "nonmetal", "halogen", "noble-gas", "alkali-metal", "alkaline-earth", "transition-metal", "metalloid"] as const).map(c => (
          <button key={c} onClick={() => setFilterCat(c)} style={{
            padding: "2px 5px", fontSize: 9, borderRadius: 3, cursor: "pointer",
            background: filterCat === c ? "#7c3aed" : "#1e0b3e",
            color: filterCat === c ? "#fff" : "#4c1d95",
            border: filterCat === c ? "1px solid #a855f7" : "1px solid #2d1b5e",
            fontFamily: "'Share Tech Mono', monospace",
            boxShadow: filterCat === c ? "0 0 6px #a855f750" : "none",
          }}>{c === "all" ? "All" : c.replace(/-/g, " ")}</button>
        ))}
      </div>
      {/* Toggle */}
      {!showFiltered && (
        <button onClick={() => setShowFull(v => !v)} style={{
          padding: "3px 8px", background: "#1e0b3e", border: "1px solid #2d1b5e",
          color: "#6b21a8", borderRadius: 5, cursor: "pointer", fontSize: 10,
          fontFamily: "'Share Tech Mono', monospace",
        }}>{showFull ? "▴ Show Common Only" : "▾ Show All 118 Elements"}</button>
      )}
      {/* Scrollable element area — fixed height so it never disappears */}
      <div style={{ overflowY: "auto", maxHeight: 360, minHeight: 100, paddingRight: 2 }}>
        {showFiltered ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {filtered.map(el => <ElementTile key={el.atomicNumber} el={el} />)}
            {filtered.length === 0 && <div style={{ color: "#2d1b5e", fontSize: 12, padding: 8 }}>No elements match.</div>}
          </div>
        ) : showFull ? (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(18, 1fr)", gap: 2 }}>
              {Array.from({ length: 10 }, (_, r) =>
                Array.from({ length: 18 }, (_, c) => {
                  const el = GRID_ELEMENTS.find(g => g.row === r + 1 && g.col === c + 1);
                  if (!el) return <div key={`${r}-${c}`} style={{ aspectRatio: "1" }} />;
                  return <ElementTile key={el.atomicNumber} el={el} tiny />;
                })
              )}
            </div>
            <div style={{ marginTop: 6, display: "grid", gridTemplateColumns: "repeat(18, 1fr)", gap: 2 }}>
              <div style={{ gridColumn: "1/3", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 3, fontSize: 7, color: "#fb923c", fontFamily: "Share Tech Mono" }}>La-Lu</div>
              {Array.from({ length: 15 }, (_, i) => {
                const el = GRID_ELEMENTS.find(g => g.row === 9 && g.col === i + 3);
                return el ? <ElementTile key={el.atomicNumber} el={el} tiny /> : <div key={i} style={{ aspectRatio: "1" }} />;
              })}
            </div>
            <div style={{ marginTop: 2, display: "grid", gridTemplateColumns: "repeat(18, 1fr)", gap: 2 }}>
              <div style={{ gridColumn: "1/3", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 3, fontSize: 7, color: "#f97316", fontFamily: "Share Tech Mono" }}>Ac-Lr</div>
              {Array.from({ length: 15 }, (_, i) => {
                const el = GRID_ELEMENTS.find(g => g.row === 10 && g.col === i + 3);
                return el ? <ElementTile key={el.atomicNumber} el={el} tiny /> : <div key={i} style={{ aspectRatio: "1" }} />;
              })}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {commonEls.map(el => <ElementTile key={el.atomicNumber} el={el} />)}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Placed Atom in Sandbox ──
const SandboxAtom: React.FC<{ atom: PlacedAtom }> = ({ atom }) => {
  const { dispatch } = useApp();
  const [dragging, setDragging] = useState(false);
  const offsetRef = useRef({ x: 0, y: 0 });
  const elRef = useRef<HTMLDivElement>(null);
  const color = getAtomColor(atom.element.category);
  const colors = CATEGORY_COLORS[atom.element.category];

  const onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!elRef.current) return;
    offsetRef.current = { x: e.clientX - atom.x, y: e.clientY - atom.y };
    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      const sandbox = document.getElementById("sandbox-area");
      if (!sandbox) return;
      const rect = sandbox.getBoundingClientRect();
      const newX = e.clientX - offsetRef.current.x;
      const newY = e.clientY - offsetRef.current.y;
      const clampedX = Math.max(30, Math.min(rect.width - 30, newX));
      const clampedY = Math.max(30, Math.min(rect.height - 30, newY));
      // Directly move the element for performance
      if (elRef.current) {
        elRef.current.style.left = clampedX + "px";
        elRef.current.style.top = clampedY + "px";
      }
    };
    const onUp = (e: MouseEvent) => {
      setDragging(false);
      const sandbox = document.getElementById("sandbox-area");
      if (!sandbox || !elRef.current) return;
      const rect = sandbox.getBoundingClientRect();
      const newX = e.clientX - offsetRef.current.x;
      const newY = e.clientY - offsetRef.current.y;
      const clampedX = Math.max(30, Math.min(rect.width - 30, newX));
      const clampedY = Math.max(30, Math.min(rect.height - 30, newY));
      // Update state
      dispatch({ type: "REMOVE_ATOM", payload: atom.id });
      setTimeout(() => dispatch({ type: "DROP_ATOM", payload: { element: atom.element, x: clampedX, y: clampedY } }), 0);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [dragging, atom, dispatch]);

  return (
    <div
      ref={elRef}
      onMouseDown={onMouseDown}
      onDoubleClick={() => dispatch({ type: "REMOVE_ATOM", payload: atom.id })}
      style={{
        position: "absolute",
        left: atom.x,
        top: atom.y,
        transform: "translate(-50%, -50%)",
        width: 52,
        height: 52,
        borderRadius: "50%",
        background: `radial-gradient(circle at 35% 35%, ${color}99, ${color}dd)`,
        border: `2px solid ${colors.border}`,
        boxShadow: dragging ? `0 0 24px ${colors.glow}, 0 0 48px ${colors.glow}40` : `0 0 12px ${colors.glow}60`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: dragging ? "grabbing" : "grab",
        userSelect: "none",
        zIndex: dragging ? 100 : 2,
        transition: dragging ? "none" : "box-shadow 0.2s",
      }}
    >
      <span style={{ fontFamily: "'Orbitron', monospace", fontWeight: 700, color: "#fff", fontSize: 13, lineHeight: 1 }}>{atom.element.symbol}</span>
      <span style={{ fontSize: 8, color: "#ffffffaa", fontFamily: "'Share Tech Mono', monospace" }}>{atom.element.valenceElectrons}e⁻</span>
    </div>
  );
};

// ── Bond Lines (SVG overlay) ──
const BondLines: React.FC<{ atoms: PlacedAtom[]; bonds: Bond[] }> = ({ atoms, bonds }) => {
  const atomMap = new Map(atoms.map(a => [a.id, a]));

  return (
    <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}>
      <defs>
        <filter id="glow-ionic">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow-cov">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {bonds.map((bond, i) => {
        const a = atomMap.get(bond.from);
        const b = atomMap.get(bond.to);
        if (!a || !b) return null;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const angle = Math.atan2(dy, dx);
        const color = bond.type === "ionic" ? "#f43f5e" : bond.type === "metallic" ? "#818cf8" : "#a855f7";
        const filter = bond.type === "ionic" ? "url(#glow-ionic)" : "url(#glow-cov)";

        if (bond.order === 1) {
          return (
            <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={color} strokeWidth={2.5} filter={filter} strokeLinecap="round" />
          );
        }
        // Multiple bond lines
        const perpX = Math.sin(angle) * 4;
        const perpY = -Math.cos(angle) * 4;
        const offsets = bond.order === 2 ? [-1, 1] : [-1, 0, 1];
        return (
          <g key={i}>
            {offsets.map((off, j) => (
              <line key={j}
                x1={a.x + perpX * off} y1={a.y + perpY * off}
                x2={b.x + perpX * off} y2={b.y + perpY * off}
                stroke={color} strokeWidth={2} filter={filter} strokeLinecap="round" />
            ))}
          </g>
        );
      })}
    </svg>
  );
};

// ── Sandbox ──
const Sandbox: React.FC = () => {
  const { state, dispatch } = useApp();
  const [dragOver, setDragOver] = useState(false);
  const sandboxRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const symbol = e.dataTransfer.getData("elementSymbol");
    if (!symbol) return;
    const el = ELEMENTS.find(el => el.symbol === symbol);
    if (!el) return;
    const rect = sandboxRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const validation = state.placedAtoms.length > 0 ? validateBond(el, state.placedAtoms[0].element) : { valid: true, reason: "" };
    if (!validation.valid && state.mode !== "free-play") {
      dispatch({ type: "SET_FEEDBACK", payload: { msg: `⚠️ ${validation.reason}`, type: "warning" } });
      return;
    }

    dispatch({ type: "DROP_ATOM", payload: { element: el, x, y } });
  };

  // Generate stable star positions
  const stars = Array.from({ length: 60 }, (_, i) => ({
    left: ((i * 137.508) % 100).toFixed(2),
    top: ((i * 93.7) % 100).toFixed(2),
    size: i % 5 === 0 ? 2.5 : i % 3 === 0 ? 2 : 1.5,
    duration: (1.5 + (i % 7) * 0.4).toFixed(1),
    delay: ((i * 0.3) % 3).toFixed(1),
  }));

  return (
    <div
      id="sandbox-area"
      ref={sandboxRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        position: "relative",
        flex: 1,
        background: dragOver
          ? "radial-gradient(ellipse at center, #2d1263 0%, #0d0120 70%)"
          : "radial-gradient(ellipse at 30% 40%, #1a0533 0%, #0d0120 60%, #07011a 100%)",
        border: dragOver ? "2px dashed #a855f7" : "2px dashed #2d1b5e",
        borderRadius: 12,
        overflow: "hidden",
        transition: "all 0.2s",
        minHeight: 400,
        boxShadow: dragOver ? "inset 0 0 40px #a855f720" : "inset 0 0 20px #0d0120",
      }}
    >
      {/* Starfield background */}
      {stars.map((star, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${star.left}%`,
          top: `${star.top}%`,
          width: star.size,
          height: star.size,
          borderRadius: "50%",
          background: i % 4 === 0 ? "#c084fc" : i % 4 === 1 ? "#e2e8f0" : i % 4 === 2 ? "#a78bfa" : "#f0abfc",
          opacity: 0.35,
          animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          pointerEvents: "none",
        }} />
      ))}

      {/* Decorative floating triangles */}
      <div style={{
        position: "absolute", left: 20, bottom: 40,
        width: 0, height: 0,
        borderLeft: "20px solid transparent", borderRight: "20px solid transparent",
        borderBottom: "35px solid #4c1d95",
        opacity: 0.12,
        animation: "float-triangle 4s ease-in-out infinite",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", right: 30, top: 40,
        width: 0, height: 0,
        borderLeft: "14px solid transparent", borderRight: "14px solid transparent",
        borderBottom: "24px solid #7c3aed",
        opacity: 0.15,
        animation: "float-triangle 5.5s ease-in-out 1s infinite",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", right: 100, bottom: 60,
        width: 0, height: 0,
        borderLeft: "8px solid transparent", borderRight: "8px solid transparent",
        borderBottom: "14px solid #c084fc",
        opacity: 0.1,
        animation: "float-triangle 3.5s ease-in-out 2s infinite",
        pointerEvents: "none",
      }} />

      {/* Grid dots background */}
      <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.12, pointerEvents: "none" }}>
        <defs>
          <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="15" cy="15" r="1" fill="#7c3aed" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      {/* Empty state hint */}
      {state.placedAtoms.length === 0 && (
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", pointerEvents: "none",
        }}>
          <div style={{ fontSize: 44, marginBottom: 12, filter: "drop-shadow(0 0 12px #a855f7)", opacity: 0.5 }}>⚛</div>
          <div style={{ color: "#4c1d95", fontFamily: "'Orbitron', monospace", fontSize: 14, fontWeight: 700, letterSpacing: 4 }}>DRAG ATOMS HERE</div>
          <div style={{ color: "#2d1b5e", fontFamily: "'Share Tech Mono', monospace", fontSize: 11, marginTop: 4 }}>Double-click atoms to remove</div>
        </div>
      )}

      <BondLines atoms={state.placedAtoms} bonds={state.bonds} />
      {state.placedAtoms.map(atom => <SandboxAtom key={atom.id} atom={atom} />)}

      {/* Formula overlay */}
      {state.formula && (
        <div style={{
          position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)",
          background: "linear-gradient(135deg, #1a0533, #0d0120)",
          border: "1px solid #4c1d95",
          borderRadius: 8,
          padding: "6px 20px",
          fontFamily: "'Orbitron', monospace",
          fontSize: 20,
          color: "#e2e8f0",
          boxShadow: "0 0 24px #a855f750, 0 0 4px #a855f7",
          zIndex: 10,
          letterSpacing: 2,
          textShadow: "0 0 12px #a855f7",
        }}>
          {state.formula}
        </div>
      )}
    </div>
  );
};

// ── Lewis Structure Dot View ──
const LewisView: React.FC = () => {
  const { state } = useApp();
  if (state.placedAtoms.length === 0) {
    return <div style={{ color: "#2d1b5e", fontFamily: "'Share Tech Mono', monospace", fontSize: 11, textAlign: "center", padding: 20 }}>No atoms placed yet</div>;
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", padding: 8 }}>
      {state.placedAtoms.map(atom => {
        const ve = atom.element.valenceElectrons;
        const dots: Array<{ pos: string; filled: boolean }> = [];
        // 8 positions (top, topright, right, bottomright, bottom, bottomleft, left, topleft)
        for (let i = 0; i < 8; i++) {
          dots.push({ pos: ["top", "right", "bottom", "left", "top-r", "bot-r", "bot-l", "top-l"][i], filled: i < ve });
        }
        const colors = CATEGORY_COLORS[atom.element.category];

        return (
          <div key={atom.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ position: "relative", width: 60, height: 60 }}>
              {/* Center symbol */}
              <div style={{
                position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                background: colors.bg, border: `2px solid ${colors.border}`, borderRadius: 8,
                fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: 16, color: colors.text,
              }}>{atom.element.symbol}</div>
              {/* Electron dots */}
              {[
                { top: -6, left: "50%", ml: -3 }, // top
                { top: "50%", right: -6, mt: -3 }, // right
                { bottom: -6, left: "50%", ml: -3 }, // bottom
                { top: "50%", left: -6, mt: -3 }, // left
                { top: -6, right: -6 }, // top-right
                { bottom: -6, right: -6 }, // bot-right
                { bottom: -6, left: -6 }, // bot-left
                { top: -6, left: -6 }, // top-left
              ].map((pos, i) => (
                <div key={i} style={{
                  position: "absolute",
                  width: 6, height: 6, borderRadius: "50%",
                  background: i < ve ? "#a855f7" : "transparent",
                  border: i < ve ? "none" : "1px solid #1e0b3e",
                  boxShadow: i < ve ? "0 0 4px #a855f7" : "none",
                  ...Object.fromEntries(Object.entries(pos).map(([k, v]) =>
                    [k === "ml" ? "marginLeft" : k === "mt" ? "marginTop" : k, typeof v === "number" ? `${v}px` : v]
                  )),
                }} />
              ))}
            </div>
            <div style={{ fontSize: 9, color: "#4c1d95", fontFamily: "'Share Tech Mono', monospace" }}>{ve} val e⁻</div>
          </div>
        );
      })}
    </div>
  );
};

// ── Molecular Info Panel ──
const MolecularPanel: React.FC = () => {
  const { state } = useApp();
  const [view, setView] = useState<"ball-stick" | "lewis">("ball-stick");

  const compound = KNOWN_COMPOUNDS[state.formula];
  const bondTypeCounts = state.bonds.reduce<Record<string, number>>((acc, b) => {
    acc[b.type] = (acc[b.type] || 0) + 1;
    return acc;
  }, {});

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function dispatch(_arg0: { type: string; payload: null; }): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, height: "100%" }}>
      {/* View toggle */}
      <div style={{ display: "flex", gap: 4, background: "#0d0120", borderRadius: 8, padding: 3 }}>
        {(["ball-stick", "lewis"] as const).map(v => (
          <button key={v} onClick={() => setView(v)} style={{
            flex: 1, padding: "4px 0", fontSize: 10, borderRadius: 6, cursor: "pointer",
            background: view === v ? "#7c3aed" : "transparent",
            color: view === v ? "#fff" : "#6b21a8",
            border: "none",
            fontFamily: "'Share Tech Mono', monospace",
            boxShadow: view === v ? "0 0 8px #a855f760" : "none",
            transition: "all 0.15s",
          }}>{v === "ball-stick" ? "Ball & Stick" : "Lewis / e⁻"}</button>
        ))}
      </div>

      {/* View area */}
      <div style={{
        flex: 1, background: "#07011a", borderRadius: 8, border: "1px solid #2d1b5e",
        overflow: "hidden", position: "relative", minHeight: 160,
      }}>
        {view === "ball-stick" ? (
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            {/* Mini ball-stick model */}
            {state.placedAtoms.length === 0 ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#2d1b5e", fontFamily: "'Share Tech Mono', monospace", fontSize: 11 }}>No molecule</div>
            ) : (
              <svg width="100%" height="100%" viewBox="0 0 300 200" style={{ position: "absolute" }}>
                {/* Render a scaled-down version */}
                {(() => {
                  const atoms = state.placedAtoms;
                  if (atoms.length === 0) return null;
                  const minX = Math.min(...atoms.map(a => a.x));
                  const maxX = Math.max(...atoms.map(a => a.x));
                  const minY = Math.min(...atoms.map(a => a.y));
                  const maxY = Math.max(...atoms.map(a => a.y));
                  const rangeX = Math.max(maxX - minX, 1);
                  const rangeY = Math.max(maxY - minY, 1);
                  const scale = Math.min(240 / rangeX, 140 / rangeY, 2);
                  const offsetX = (300 - rangeX * scale) / 2 - minX * scale;
                  const offsetY = (200 - rangeY * scale) / 2 - minY * scale;

                  const project = (x: number, y: number) => ({
                    px: x * scale + offsetX,
                    py: y * scale + offsetY,
                  });
                  const atomMap = new Map(atoms.map(a => [a.id, a]));

                  return (
                    <>
                      {state.bonds.map((bond, i) => {
                        const a = atomMap.get(bond.from);
                        const b = atomMap.get(bond.to);
                        if (!a || !b) return null;
                        const { px: ax, py: ay } = project(a.x, a.y);
                        const { px: bx, py: by } = project(b.x, b.y);
                        const color = bond.type === "ionic" ? "#f43f5e" : "#a855f7";
                        return <line key={i} x1={ax} y1={ay} x2={bx} y2={by} stroke={color} strokeWidth={2.5} />;
                      })}
                      {atoms.map(atom => {
                        const { px, py } = project(atom.x, atom.y);
                        const color = getAtomColor(atom.element.category);
                        return (
                          <g key={atom.id}>
                            <circle cx={px} cy={py} r={12} fill={color} opacity={0.8} />
                            <text x={px} y={py + 4} textAnchor="middle" fontSize={10} fontFamily="Orbitron,monospace" fontWeight="700" fill="#fff">{atom.element.symbol}</text>
                          </g>
                        );
                      })}
                    </>
                  );
                })()}
              </svg>
            )}
          </div>
        ) : (
          <div style={{ padding: 12, overflowY: "auto", height: "100%" }}>
            <LewisView />
          </div>
        )}
      </div>

      {/* Compound info */}
      {compound && (
        <div style={{ background: "#1a0533", border: "1px solid #4c1d95", borderRadius: 8, padding: 10, boxShadow: "0 0 12px #a855f720" }}>
          <div style={{ color: "#d8b4fe", fontFamily: "'Orbitron', monospace", fontSize: 11, fontWeight: 700 }}>{compound.name}</div>
          <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
            <div style={{ fontSize: 10, color: "#c084fc", fontFamily: "'Share Tech Mono', monospace" }}>📐 {compound.geometry}</div>
            <div style={{ fontSize: 10, color: "#c084fc", fontFamily: "'Share Tech Mono', monospace" }}>∠ {compound.bondAngle}</div>
          </div>
        </div>
      )}

      {/* Bond stats */}
      {state.bonds.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ fontSize: 10, color: "#4c1d95", fontFamily: "'Share Tech Mono', monospace" }}>BONDS DETECTED</div>
          {Object.entries(bondTypeCounts).map(([type, count]) => (
            <div key={type} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 20, height: 3, background: type === "ionic" ? "#f43f5e" : type === "metallic" ? "#818cf8" : "#a855f7", borderRadius: 2 }} />
                <span style={{ fontSize: 11, color: "#c084fc", fontFamily: "'Share Tech Mono', monospace", textTransform: "capitalize" }}>{type}</span>
              </div>
              <span style={{ fontSize: 11, color: "#e2e8f0", fontFamily: "'Share Tech Mono', monospace" }}>{count}×</span>
            </div>
          ))}
        </div>
      )}

      {/* Selected element info */}
      {state.selectedElement && (
        <div style={{ background: "#130929", border: `1px solid ${CATEGORY_COLORS[state.selectedElement.category].border}`, borderRadius: 8, padding: 10, boxShadow: `0 0 12px ${CATEGORY_COLORS[state.selectedElement.category].glow}20` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: 16, color: CATEGORY_COLORS[state.selectedElement.category].text }}>
              {state.selectedElement.symbol}
            </div>
            <button onClick={() => dispatch({ type: "SELECT_ELEMENT", payload: null })} style={{ background: "none", border: "none", color: "#4c1d95", cursor: "pointer", fontSize: 14 }}>✕</button>
          </div>
          <div style={{ fontSize: 11, color: "#c084fc", fontFamily: "'Share Tech Mono', monospace" }}>{state.selectedElement.name}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, marginTop: 6 }}>
            {[
              ["Atomic #", state.selectedElement.atomicNumber],
              ["Period", state.selectedElement.period],
              ["Group", state.selectedElement.group || "—"],
              ["Valence e⁻", state.selectedElement.valenceElectrons],
              ["Category", state.selectedElement.category.replace(/-/g, " ")],
              ["Electronegativity", state.selectedElement.electronegativity || "—"],
            ].map(([label, value]) => (
              <div key={label as string} style={{ background: "#0d0120", borderRadius: 4, padding: "3px 6px", border: "1px solid #1e0b3e" }}>
                <div style={{ fontSize: 8, color: "#4c1d95", fontFamily: "'Share Tech Mono', monospace" }}>{label}</div>
                <div style={{ fontSize: 11, color: "#e2e8f0", fontFamily: "'Share Tech Mono', monospace" }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Quiz Panel ──
const QuizPanel: React.FC = () => {
  const { state, dispatch } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ ok: boolean; msg: string } | null>(null);

  if (state.mode !== "quiz") return null;

  const challenge = state.currentChallenge;
  if (!challenge) {
    return (
      <div style={{ background: "#1a0533", border: "1px solid #4c1d95", borderRadius: 8, padding: 12, textAlign: "center", boxShadow: "0 0 20px #a855f730" }}>
        <div style={{ color: "#d8b4fe", fontFamily: "'Orbitron', monospace", fontSize: 14, fontWeight: 700 }}>🏆 ALL CHALLENGES COMPLETE!</div>
        <div style={{ color: "#c084fc", fontSize: 11, fontFamily: "'Share Tech Mono', monospace", marginTop: 4 }}>Score: {state.score}</div>
        <button onClick={() => dispatch({ type: "SET_LEVEL", payload: 1 })} style={{ marginTop: 8, padding: "6px 12px", background: "#3b0764", border: "1px solid #a855f7", color: "#d8b4fe", borderRadius: 6, cursor: "pointer", fontSize: 11, fontFamily: "'Share Tech Mono', monospace" }}>Play Again</button>
      </div>
    );
  }

  const total = Object.values(challenge.requiredAtoms).reduce((a, b) => a + b, 0);
  const current = state.placedAtoms.length;

  // Per-atom counts matching requirement
  const atomCounts: Record<string, { have: number; need: number; ok: boolean }> = {};
  for (const [sym, need] of Object.entries(challenge.requiredAtoms)) {
    const have = state.placedAtoms.filter(a => a.element.symbol === sym).length;
    atomCounts[sym] = { have, need, ok: have >= need };
  }

  const handleSubmit = () => {
    dispatch({ type: "INC_ATTEMPTS" });
    const formula = state.formula;
    if (formula === challenge.targetFormula) {
      const pts = Math.max(50, 100 + (3 - Math.min(3, state.attempts)) * 25);
      setSubmitResult({ ok: true, msg: `✅ Correct! ${challenge.description} — +${pts} pts` });
      dispatch({ type: "ADD_SCORE", payload: pts });
      dispatch({ type: "COMPLETE_CHALLENGE", payload: challenge.level });
      setTimeout(() => {
        setSubmitResult(null);
        const nextIdx = QUIZ_LEVELS.findIndex(q => q.level === challenge.level + 1);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dispatch({ type: "SET_CHALLENGE", payload: nextIdx >= 0 ? QUIZ_LEVELS[nextIdx] : null as any });
      }, 2200);
    } else if (state.placedAtoms.length === 0) {
      setSubmitResult({ ok: false, msg: "❌ No atoms placed! Drag atoms from the periodic table into the sandbox first." });
      setTimeout(() => setSubmitResult(null), 3000);
    } else {
      // Diagnostic message
      const wrongAtoms = Object.entries(challenge.requiredAtoms).filter(([sym, need]) => {
        const have = state.placedAtoms.filter(a => a.element.symbol === sym).length;
        return have !== need;
      });
      const extraAtoms = state.placedAtoms.filter(a => !challenge.requiredAtoms[a.element.symbol]);
      let diag = `❌ Not quite! Current: ${formula || "—"}, Target: ${challenge.targetFormula}.`;
      if (wrongAtoms.length > 0) {
        diag += ` ${wrongAtoms.map(([s, n]) => `Need ${n}×${s}`).join(", ")}.`;
      }
      if (extraAtoms.length > 0) {
        diag += ` Remove: ${[...new Set(extraAtoms.map(a => a.element.symbol))].join(", ")}.`;
      }
      diag += ` Hint: ${challenge.hint}`;
      setSubmitResult({ ok: false, msg: diag });
      setTimeout(() => setSubmitResult(null), 4000);
    }
  };

  return (
    <div style={{ background: "#0d0120", border: "1px solid #2d1b5e", borderRadius: 8, overflow: "hidden" }}>
      {/* Header row — always visible */}
      <div
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", cursor: "pointer", background: "#130929", borderBottom: collapsed ? "none" : "1px solid #1e0b3e" }}
        onClick={() => setCollapsed(v => !v)}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ fontSize: 9, color: "#ec4899", fontFamily: "'Share Tech Mono', monospace", fontWeight: 700 }}>LVL {challenge.level}</div>
          <div style={{ fontSize: 11, color: "#e2e8f0", fontFamily: "'Orbitron', monospace", fontWeight: 700 }}>{challenge.description}</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ fontSize: 9, color: "#a855f7", fontFamily: "'Share Tech Mono', monospace" }}>{state.completedChallenges.length}/{QUIZ_LEVELS.length}</div>
          <div style={{ color: "#4c1d95", fontSize: 12, transition: "transform 0.2s", transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)" }}>▾</div>
        </div>
      </div>

      {!collapsed && (
        <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Atom requirement badges */}
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {Object.entries(atomCounts).map(([sym, { have, need, ok }]) => (
              <div key={sym} style={{
                background: ok ? "#1a0533" : "#1e0b3e",
                border: `1px solid ${ok ? "#a855f7" : "#2d1b5e"}`,
                borderRadius: 4, padding: "3px 10px", fontSize: 12,
                color: ok ? "#d8b4fe" : "#6b21a8",
                fontFamily: "'Share Tech Mono', monospace",
                display: "flex", alignItems: "center", gap: 4,
                boxShadow: ok ? "0 0 8px #a855f740" : "none",
              }}>
                <span style={{ fontWeight: 700 }}>{sym}</span>
                <span style={{ opacity: 0.7 }}>{have}/{need}</span>
                {ok && <span>✓</span>}
              </div>
            ))}
          </div>

          {/* Atom count progress bar */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <span style={{ fontSize: 9, color: "#4c1d95", fontFamily: "'Share Tech Mono', monospace" }}>ATOMS PLACED</span>
              <span style={{ fontSize: 9, color: "#6b21a8", fontFamily: "'Share Tech Mono', monospace" }}>{current}/{total}</span>
            </div>
            <div style={{ height: 5, background: "#1e0b3e", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.min(100, (current / total) * 100)}%`, background: current === total ? "#a855f7" : "#7c3aed", transition: "width 0.3s", boxShadow: "0 0 6px #a855f7" }} />
            </div>
          </div>

          {/* Hint */}
          <div style={{ background: "#07011a", borderRadius: 6, padding: "6px 10px", fontSize: 10, color: "#6b21a8", fontFamily: "'Share Tech Mono', monospace", lineHeight: 1.6, border: "1px solid #1e0b3e" }}>
            💡 {challenge.hint}
          </div>

          {/* Submit result feedback */}
          {submitResult && (
            <div style={{
              background: submitResult.ok ? "#1a0533" : "#2a0f1a",
              border: `1px solid ${submitResult.ok ? "#a855f7" : "#f43f5e"}`,
              borderRadius: 6, padding: "8px 10px",
              fontSize: 10, color: submitResult.ok ? "#d8b4fe" : "#fda4af",
              fontFamily: "'Share Tech Mono', monospace", lineHeight: 1.6,
              animation: "pulse-glow 0.4s ease-out",
              boxShadow: `0 0 12px ${submitResult.ok ? "#a855f740" : "#f43f5e30"}`,
            }}>
              {submitResult.msg}
            </div>
          )}

          {/* ── CHECK ANSWER button ── */}
          <button
            onClick={handleSubmit}
            style={{
              padding: "9px 0",
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              border: "none",
              borderRadius: 7,
              color: "#fff",
              fontFamily: "'Orbitron', monospace",
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
              letterSpacing: 1,
              boxShadow: "0 0 20px #a855f760",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 30px #a855f7bb"; (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 20px #a855f760"; (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
          >
            ⚗ CHECK ANSWER
          </button>

          {/* Level selector */}
          <div>
            <div style={{ fontSize: 9, color: "#2d1b5e", fontFamily: "'Share Tech Mono', monospace", marginBottom: 4 }}>JUMP TO LEVEL</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              {QUIZ_LEVELS.map(q => (
                <button key={q.level} onClick={() => { dispatch({ type: "SET_CHALLENGE", payload: q }); setSubmitResult(null); }} style={{
                  width: 22, height: 22, borderRadius: 3, fontSize: 9, cursor: "pointer",
                  background: state.completedChallenges.includes(q.level) ? "#3b0764" : challenge.level === q.level ? "#7c3aed" : "#1e0b3e",
                  color: state.completedChallenges.includes(q.level) ? "#d8b4fe" : challenge.level === q.level ? "#fff" : "#4c1d95",
                  border: challenge.level === q.level ? "1px solid #a855f7" : "1px solid #2d1b5e",
                  fontFamily: "'Share Tech Mono', monospace",
                  boxShadow: challenge.level === q.level ? "0 0 6px #a855f760" : "none",
                }}>{q.level}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Student Dashboard ──
const TOTAL_QUESTIONS = 30;

const DIFFICULTY_STYLES: Record<string, { color: string; border: string; emoji: string; label: string }> = {
  easy:   { color: "#4ade80", border: "#166534", emoji: "🟢", label: "Easy" },
  medium: { color: "#fbbf24", border: "#92400e", emoji: "🟡", label: "Medium" },
  hard:   { color: "#f87171", border: "#7f1d1d", emoji: "🔴", label: "Hard" },
};

const TeacherDashboard: React.FC = () => {
  const { state, dispatch } = useApp();
  if (!state.showTeacherDash) return null;

  const completed = state.completedChallenges.length;
  const wrong = Math.max(0, state.attempts - completed);
  const pct = Math.round((completed / TOTAL_QUESTIONS) * 100);

  const exportReport = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    const correctList = QUIZ_LEVELS
      .filter(q => state.completedChallenges.includes(q.level))
      .map(q => `  ✅  Q${q.level} — ${q.description} [${q.difficulty.toUpperCase()}]`)
      .join("\n") || "  None completed yet";

    const wrongList = QUIZ_LEVELS
      .filter(q => !state.completedChallenges.includes(q.level))
      .map(q => `  ❌  Q${q.level} — ${q.description} [${q.difficulty.toUpperCase()}]`)
      .join("\n") || "  All questions answered correctly!";

    const report = `
╔══════════════════════════════════════════════════════╗
║           SCILAB 360 — STUDENT PROGRESS REPORT        ║
╚══════════════════════════════════════════════════════╝

Report generated: ${dateStr} at ${timeStr}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  SCORE SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Points Earned     ${state.score} pts
  Score             ${completed} / ${TOTAL_QUESTIONS}
  Questions Correct ${completed}
  Questions Wrong   ${wrong}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  QUESTIONS ANSWERED CORRECTLY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${correctList}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  QUESTIONS NOT YET COMPLETED / WRONG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${wrongList}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Generated by SciLab 360 — Interactive Chemistry Lab
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`.trim();

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `scilab360-student-report-${now.toISOString().slice(0, 10)}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      position: "fixed", top: 0, right: 0, bottom: 0, width: 320,
      background: "#0d0120", borderLeft: "1px solid #3b1d6e", zIndex: 1000,
      display: "flex", flexDirection: "column",
      boxShadow: "-4px 0 40px #00000080, -2px 0 20px #a855f720",
      overflowY: "auto",
    }}>
      {/* Header */}
      <div style={{ padding: "18px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #2d1b5e", flexShrink: 0 }}>
        <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: 13, color: "#fff", letterSpacing: "0.15em" }}>STUDENT DASHBOARD</div>
        <button onClick={() => dispatch({ type: "TOGGLE_TEACHER" })} style={{ background: "none", border: "none", color: "#6b21a8", cursor: "pointer", fontSize: 18 }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#a855f7"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#6b21a8"; }}>✕</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 16, flex: 1 }}>

        {/* Score banner */}
        <div style={{ borderRadius: 12, padding: 16, background: "linear-gradient(135deg, #1a0533, #200040)", border: "1px solid #6d28d9", boxShadow: "0 0 20px #a855f730", textAlign: "center" }}>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 40, fontWeight: 900, color: "#e9d5ff", lineHeight: 1, textShadow: "0 0 20px #a855f780" }}>{state.score}</div>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#a78bfa", marginTop: 4, letterSpacing: "0.1em" }}>TOTAL POINTS</div>

          {/* Correct / Wrong / Score grid */}
          <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center", background: "#07011a", borderRadius: 10, padding: "10px 14px", border: "1px solid #2d1b5e" }}>
            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 22, fontWeight: 900, color: "#4ade80", textShadow: "0 0 10px #4ade8060" }}>{completed}</div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: "#86efac", marginTop: 2, letterSpacing: "0.08em" }}>CORRECT</div>
            </div>
            <div style={{ width: 1, height: 36, background: "#2d1b5e" }} />
            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 22, fontWeight: 900, color: "#f87171", textShadow: "0 0 10px #f8717160" }}>{wrong}</div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: "#fca5a5", marginTop: 2, letterSpacing: "0.08em" }}>WRONG</div>
            </div>
            <div style={{ width: 1, height: 36, background: "#2d1b5e" }} />
            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 18, fontWeight: 900, color: "#e9d5ff", textShadow: "0 0 10px #a855f760" }}>
                {completed}<span style={{ fontSize: 12, color: "#9f7aea" }}>/{TOTAL_QUESTIONS}</span>
              </div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: "#c4b5fd", marginTop: 2, letterSpacing: "0.08em" }}>SCORE</div>
            </div>
          </div>

          <div style={{ marginTop: 12, height: 8, background: "#1e0b3e", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, #7c3aed, #ec4899)", borderRadius: 999, transition: "width 0.5s", boxShadow: "0 0 8px #a855f7" }} />
          </div>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#c4b5fd", marginTop: 6 }}>{pct}% complete</div>
        </div>

        {/* Difficulty breakdown bars */}
        <div style={{ borderRadius: 12, padding: "14px 18px", background: "#130929", border: "1px solid #2d1b5e" }}>
          <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, fontWeight: 700, color: "#a855f7", letterSpacing: "0.15em", marginBottom: 12, margin: "0 0 12px 0" }}>PROGRESS BY DIFFICULTY</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(["easy", "medium", "hard"] as const).map(d => {
              const cfg = DIFFICULTY_STYLES[d];
              const levelsInD = QUIZ_LEVELS.filter(q => q.difficulty === d);
              const doneInD = levelsInD.filter(q => state.completedChallenges.includes(q.level)).length;
              const dpct = levelsInD.length > 0 ? (doneInD / levelsInD.length) * 100 : 0;
              return (
                <div key={d}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: cfg.color, fontWeight: 700 }}>{cfg.emoji} {cfg.label}</span>
                    <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: "#c4b5fd" }}>{doneInD}/{levelsInD.length}</span>
                  </div>
                  <div style={{ height: 6, background: "#1e0b3e", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${dpct}%`, background: cfg.color, borderRadius: 999, boxShadow: `0 0 6px ${cfg.color}`, transition: "width 0.5s" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sectioned progress list — Easy / Medium / Hard */}
        {(["easy", "medium", "hard"] as const).map(d => {
          const cfg = DIFFICULTY_STYLES[d];
          const levelsInD = QUIZ_LEVELS.filter(q => q.difficulty === d);
          return (
            <div key={d} style={{ borderRadius: 12, padding: "14px 18px", background: "#130929", border: `1px solid ${cfg.border}` }}>
              <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, fontWeight: 700, color: cfg.color, letterSpacing: "0.15em", margin: "0 0 10px 0" }}>
                {cfg.emoji} {cfg.label.toUpperCase()} — L{levelsInD[0].level}–L{levelsInD[levelsInD.length - 1].level}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {levelsInD.map(q => {
                  const done = state.completedChallenges.includes(q.level);
                  return (
                    <div key={q.level} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", borderRadius: 8, background: done ? "#0f0620" : "#07011a", border: `1px solid ${done ? "#3b1d6e" : "#1e0b3e"}` }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#6b21a8", minWidth: 24 }}>L{q.level}</span>
                        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: done ? "#c4b5fd" : "#4c1d95" }}>{q.description}</span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: done ? cfg.color : "#2d1b5e" }}>{done ? "✓" : "○"}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Download button */}
        <button onClick={exportReport} style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          padding: "14px 16px", borderRadius: 12, cursor: "pointer",
          fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: 13, letterSpacing: "0.08em",
          color: "#e9d5ff", background: "linear-gradient(135deg, #3b0764, #4c1d95)",
          border: "1px solid #a855f7", boxShadow: "0 0 16px #a855f740", transition: "all 0.15s",
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 24px #a855f7aa"; (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 16px #a855f740"; (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}>
          📊 DOWNLOAD MY REPORT
        </button>
      </div>
    </div>
  );
};

// ── Left Panel ──
const LeftPanel: React.FC = () => {
  const { state, dispatch } = useApp();

  const feedbackBorderColor =
    state.feedbackType === "success" ? "#166534" :
    state.feedbackType === "error"   ? "#7f1d1d" :
    state.feedbackType === "warning" ? "#78350f" : "#2d1b5e";
  const feedbackAccent =
    state.feedbackType === "success" ? "#4ade80" :
    state.feedbackType === "error"   ? "#ef4444" :
    state.feedbackType === "warning" ? "#f97316" : "#a855f7";

  return (
    <div style={{
      width: 272,
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      gap: 8,
      overflow: "hidden",
      height: "100%",
    }}>

      {/* PINNED TOP ZONE - never scrolls */}
      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: 8 }}>

        {/* Progress + mode switcher */}
        <div style={{ background: "#130929", border: "1px solid #2d1b5e", borderRadius: 10, padding: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 10, fontWeight: 700, color: "#c084fc", letterSpacing: 2 }}>PROGRESS</div>
            <div style={{ display: "flex", gap: 4 }}>
              <button onClick={() => dispatch({ type: "SET_MODE", payload: "free-play" })} style={{
                padding: "3px 8px", fontSize: 9, borderRadius: 4, cursor: "pointer",
                background: state.mode === "free-play" ? "#7c3aed" : "#1e0b3e",
                color: state.mode === "free-play" ? "#fff" : "#6b21a8",
                border: state.mode === "free-play" ? "1px solid #a855f7" : "1px solid #2d1b5e",
                fontFamily: "'Share Tech Mono', monospace",
                boxShadow: state.mode === "free-play" ? "0 0 10px #a855f760" : "none",
              }}>FREE PLAY</button>
              <button onClick={() => dispatch({ type: "SET_MODE", payload: "quiz" })} style={{
                padding: "3px 8px", fontSize: 9, borderRadius: 4, cursor: "pointer",
                background: state.mode === "quiz" ? "#be185d" : "#1e0b3e",
                color: state.mode === "quiz" ? "#fff" : "#6b21a8",
                border: state.mode === "quiz" ? "1px solid #f43f5e" : "1px solid #2d1b5e",
                fontFamily: "'Share Tech Mono', monospace",
                boxShadow: state.mode === "quiz" ? "0 0 10px #f43f5e60" : "none",
              }}>QUIZ</button>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: "#6b21a8", fontFamily: "'Share Tech Mono', monospace" }}>Level {state.level}</span>
            <span style={{ fontSize: 10, color: "#a855f7", fontFamily: "'Share Tech Mono', monospace" }}>Score: {state.score}</span>
          </div>
          <div style={{ height: 5, background: "#1e0b3e", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(state.completedChallenges.length / QUIZ_LEVELS.length) * 100}%`, background: "linear-gradient(90deg, #7c3aed, #ec4899)", transition: "width 0.5s", boxShadow: "0 0 8px #a855f7" }} />
          </div>
        </div>

        {/* Quiz challenge card - always visible, never scrolls away */}
        <QuizPanel />

        {/* Feedback - pinned, always visible */}
        <div style={{
          background: "#0d0120",
          border: `1px solid ${feedbackBorderColor}`,
          borderLeft: `3px solid ${feedbackAccent}`,
          borderRadius: 10,
          padding: "8px 12px",
          boxShadow: `0 0 8px ${feedbackAccent}20`,
        }}>
          <div style={{ fontSize: 9, color: "#4c1d95", fontFamily: "'Share Tech Mono', monospace", marginBottom: 3, letterSpacing: 2 }}>FEEDBACK</div>
          <div style={{ fontSize: 11, color: "#e2e8f0", fontFamily: "'Share Tech Mono', monospace", lineHeight: 1.5 }}>{state.feedback}</div>
        </div>
      </div>

      {/* SCROLLABLE ZONE - only the periodic table scrolls */}
      <div style={{ flex: 1, overflowY: "auto", minHeight: 0, paddingRight: 2 }}>
        <div style={{ background: "#0d0120", border: "1px solid #2d1b5e", borderRadius: 10, padding: 12 }}>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 11, fontWeight: 700, color: "#c084fc", marginBottom: 8, letterSpacing: 2 }}>
            PERIODIC TABLE
          </div>
          <PeriodicTablePanel />
        </div>
      </div>

    </div>
  );
};

// ── Right Panel ──
const RightPanel: React.FC = () => {
  return (
    <div style={{ width: 240, display: "flex", flexDirection: "column", gap: 10, overflow: "hidden" }}>
      <div style={{ background: "#0d0120", border: "1px solid #2d1b5e", borderRadius: 10, padding: 12, flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 11, fontWeight: 700, color: "#c084fc", marginBottom: 8, letterSpacing: 2 }}>MOLECULAR VIEW</div>
        <div style={{ flex: 1, overflow: "auto" }}>
          <MolecularPanel />
        </div>
      </div>
    </div>
  );
};

// ── Header ──
const Header: React.FC = () => {
  const { state, dispatch } = useApp();

  return (
    <div style={{
      height: 56,
      background: "linear-gradient(90deg, #0d0120 0%, #1a0533 40%, #200040 100%)",
      borderBottom: "1px solid #4c1d95",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 20px",
      flexShrink: 0,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Decorative stars */}
      {[10, 25, 60, 80, 92].map((left, i) => (
        <div key={i} style={{
          position: "absolute", left: `${left}%`, top: `${[20, 70, 30, 60, 25][i]}%`,
          width: [2, 3, 2, 3, 2][i], height: [2, 3, 2, 3, 2][i],
          borderRadius: "50%", background: "#c084fc", opacity: 0.4,
          animation: `twinkle ${[1.8, 2.4, 1.5, 2.1, 1.9][i]}s ease-in-out infinite`,
        }} />
      ))}
      {/* Decorative triangle accents */}
      <div style={{
        position: "absolute", right: 180, top: "50%", transform: "translateY(-50%)",
        width: 0, height: 0,
        borderLeft: "8px solid transparent", borderRight: "8px solid transparent",
        borderBottom: "14px solid #4c1d95", opacity: 0.4,
      }} />
      <div style={{
        position: "absolute", right: 200, top: "50%", transform: "translateY(-50%)",
        width: 0, height: 0,
        borderLeft: "5px solid transparent", borderRight: "5px solid transparent",
        borderBottom: "9px solid #7c3aed", opacity: 0.25,
      }} />

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 24, filter: "drop-shadow(0 0 10px #a855f7)" }}>⚛</div>
        <div>
          <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 16, color: "#e2e8f0", letterSpacing: 4, textShadow: "0 0 20px #a855f780" }}>SCILAB 360</div>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: "#a855f7", letterSpacing: 3 }}>INTERACTIVE CHEMISTRY LAB</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#6b21a8" }}>{state.placedAtoms.length} atom{state.placedAtoms.length !== 1 ? "s" : ""} · {state.bonds.length} bond{state.bonds.length !== 1 ? "s" : ""}</div>
        <button onClick={() => dispatch({ type: "CLEAR_SANDBOX" })} style={{
          padding: "5px 12px", background: "#1e0b3e", border: "1px solid #4c1d95",
          color: "#c084fc", borderRadius: 6, cursor: "pointer", fontSize: 11,
          fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1,
          transition: "all 0.15s",
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#2d1263"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 12px #a855f740"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#1e0b3e"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "none"; }}
        >↺ CLEAR</button>
        <button onClick={() => dispatch({ type: "TOGGLE_TEACHER" })} style={{
          padding: "5px 12px",
          background: state.showTeacherDash ? "#3b0764" : "#1e0b3e",
          border: state.showTeacherDash ? "1px solid #a855f7" : "1px solid #4c1d95",
          color: state.showTeacherDash ? "#d8b4fe" : "#c084fc",
          borderRadius: 6, cursor: "pointer", fontSize: 11,
          fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1,
          transition: "all 0.15s",
          boxShadow: state.showTeacherDash ? "0 0 12px #a855f760" : "none",
        }}>📊 MY PROGRESS</button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────────────────────

export function SciLab360(): React.ReactElement {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <div style={{
        width: "100vw", height: "100vh",
        background: "#07011a",
        color: "#e2e8f0",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Exo 2', sans-serif",
        overflow: "hidden",
      }}>
        {/* Font import */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Exo+2:wght@300;400;600&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          ::-webkit-scrollbar { width: 5px; height: 5px; }
          ::-webkit-scrollbar-track { background: #130929; }
          ::-webkit-scrollbar-thumb { background: #4c1d95; border-radius: 3px; }
          ::-webkit-scrollbar-thumb:hover { background: #6d28d9; }
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 8px #a855f740; }
            50% { box-shadow: 0 0 20px #a855f7aa; }
          }
          @keyframes twinkle {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.8; }
          }
          @keyframes float-triangle {
            0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.15; }
            50% { transform: translateY(-12px) rotate(3deg); opacity: 0.3; }
          }
        `}</style>

        <Header />

        <div style={{ flex: 1, display: "flex", gap: 10, padding: 10, overflow: "hidden" }}>
          <LeftPanel />

          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, overflow: "hidden" }}>
            <Sandbox />
          </div>

          <RightPanel />
        </div>

        {/* Legend bar */}
        <div style={{
          height: 28, background: "#0d0120", borderTop: "1px solid #2d1b5e",
          display: "flex", alignItems: "center", gap: 16, padding: "0 16px",
          flexShrink: 0,
        }}>
          {[
            { color: "#a855f7", label: "Covalent" },
            { color: "#f43f5e", label: "Ionic" },
            { color: "#818cf8", label: "Metallic" },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 20, height: 2, background: color, borderRadius: 1, boxShadow: `0 0 4px ${color}` }} />
              <span style={{ fontSize: 9, color: "#6b21a8", fontFamily: "'Share Tech Mono', monospace" }}>{label} Bond</span>
            </div>
          ))}
          <div style={{ marginLeft: "auto", fontSize: 9, color: "#2d1b5e", fontFamily: "'Share Tech Mono', monospace" }}>SciLab 360 v1.0 · 118 Elements</div>
        </div>

        <TeacherDashboard />
      </div>
    </AppContext.Provider>
  );
}

export default SciLab360;
