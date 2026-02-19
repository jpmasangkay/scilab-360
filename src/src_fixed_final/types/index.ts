export type ElementCategory =
  | 'noble-gas'
  | 'alkali-metal'
  | 'alkaline-earth'
  | 'transition-metal'
  | 'post-transition'
  | 'metalloid'
  | 'nonmetal'
  | 'halogen'
  | 'lanthanide'
  | 'actinide'
  | 'unknown';

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
  type: 'ionic' | 'covalent' | 'metallic';
  order: number;
}

export type GameMode = 'free-play' | 'quiz';

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
  feedbackType: 'info' | 'success' | 'error' | 'warning';
  currentChallenge: QuizChallenge | null;
  completedChallenges: number[];
  selectedElement: ElementData | null;
  draggedElement: ElementData | null;
  showTeacherDash: boolean;
  atomCount: number;
  attempts: number;
}

export type AppAction =
  | { type: 'SET_MODE'; payload: GameMode }
  | { type: 'DROP_ATOM'; payload: { element: ElementData; x: number; y: number } }
  | { type: 'REMOVE_ATOM'; payload: string }
  | { type: 'CLEAR_SANDBOX' }
  | { type: 'SET_DRAG'; payload: ElementData | null }
  | { type: 'SELECT_ELEMENT'; payload: ElementData | null }
  | { type: 'SET_FEEDBACK'; payload: { msg: string; type: AppState['feedbackType'] } }
  | { type: 'SET_LEVEL'; payload: number }
  | { type: 'SET_CHALLENGE'; payload: QuizChallenge | null }
  | { type: 'COMPLETE_CHALLENGE'; payload: number }
  | { type: 'ADD_SCORE'; payload: number }
  | { type: 'TOGGLE_TEACHER' }
  | { type: 'INC_ATTEMPTS' };

export interface GridElement extends ElementData {
  col: number;
  row: number;
}

export interface CategoryColors {
  bg: string;
  border: string;
  text: string;
  glow: string;
}
