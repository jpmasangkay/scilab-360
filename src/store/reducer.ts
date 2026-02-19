import type { AppState, AppAction } from '../types';
import { QUIZ_LEVELS } from '../data/quizLevels';
import { detectBonds, computeFormula, generateFeedback } from '../utils/chemistry';

export const initialState: AppState = {
  mode: 'free-play',
  score: 0,
  level: 1,
  placedAtoms: [],
  bonds: [],
  formula: '',
  feedback: 'Drag atoms from the periodic table into the sandbox to begin building molecules!',
  feedbackType: 'info',
  currentChallenge: QUIZ_LEVELS[0],
  completedChallenges: [],
  selectedElement: null,
  draggedElement: null,
  showTeacherDash: false,
  atomCount: 0,
  attempts: 0,
};

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_MODE': {
      const challenge = action.payload === 'quiz' ? QUIZ_LEVELS[0] : null;
      return {
        ...state,
        mode: action.payload,
        currentChallenge: challenge,
        placedAtoms: [],
        bonds: [],
        formula: '',
        feedback: action.payload === 'quiz'
          ? `Quiz Mode: ${QUIZ_LEVELS[0].description}`
          : 'Free Play — explore any combination!',
        feedbackType: 'info',
      };
    }

    case 'DROP_ATOM': {
      const id = `${action.payload.element.symbol}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const newAtom = { id, element: action.payload.element, x: action.payload.x, y: action.payload.y };
      const newAtoms = [...state.placedAtoms, newAtom];
      const newBonds = detectBonds(newAtoms);
      const formula = computeFormula(newAtoms);
      const fb = generateFeedback(newAtoms, newBonds, formula);

      if (state.mode === 'quiz' && state.currentChallenge && formula === state.currentChallenge.targetFormula) {
        const pts = 100 + (3 - Math.min(3, state.attempts)) * 25;
        const newCompleted = [...state.completedChallenges, state.currentChallenge.level];
        const nextIdx = QUIZ_LEVELS.findIndex(q => q.level === state.currentChallenge!.level + 1);
        return {
          ...state,
          placedAtoms: newAtoms,
          bonds: newBonds,
          formula,
          feedback: `🎉 Correct! ${state.currentChallenge.description} solved! +${pts} pts`,
          feedbackType: 'success',
          score: state.score + pts,
          completedChallenges: newCompleted,
          level: state.level + 1,
          currentChallenge: nextIdx >= 0 ? QUIZ_LEVELS[nextIdx] : null,
          atomCount: state.atomCount + 1,
        };
      }

      return { ...state, placedAtoms: newAtoms, bonds: newBonds, formula, feedback: fb.msg, feedbackType: fb.type, atomCount: state.atomCount + 1 };
    }

    case 'REMOVE_ATOM': {
      const newAtoms = state.placedAtoms.filter(a => a.id !== action.payload);
      const newBonds = detectBonds(newAtoms);
      const formula = computeFormula(newAtoms);
      const fb = generateFeedback(newAtoms, newBonds, formula);
      return { ...state, placedAtoms: newAtoms, bonds: newBonds, formula, feedback: fb.msg, feedbackType: fb.type };
    }

    case 'CLEAR_SANDBOX':
      return { ...state, placedAtoms: [], bonds: [], formula: '', feedback: 'Sandbox cleared. Start building!', feedbackType: 'info', attempts: 0 };

    case 'SET_DRAG':         return { ...state, draggedElement: action.payload };
    case 'SELECT_ELEMENT':   return { ...state, selectedElement: action.payload };
    case 'SET_FEEDBACK':     return { ...state, feedback: action.payload.msg, feedbackType: action.payload.type };
    case 'SET_LEVEL':        return { ...state, level: action.payload, currentChallenge: QUIZ_LEVELS.find(q => q.level === action.payload) || null };
    case 'SET_CHALLENGE':    return { ...state, currentChallenge: action.payload, placedAtoms: [], bonds: [], formula: '', attempts: 0 };
    case 'COMPLETE_CHALLENGE': return { ...state, completedChallenges: [...state.completedChallenges, action.payload] };
    case 'ADD_SCORE':        return { ...state, score: state.score + action.payload };
    case 'TOGGLE_TEACHER':   return { ...state, showTeacherDash: !state.showTeacherDash };
    case 'INC_ATTEMPTS':     return { ...state, attempts: state.attempts + 1 };
    default:                 return state;
  }
}
