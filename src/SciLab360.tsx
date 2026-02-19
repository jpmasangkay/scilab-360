/**
 * SciLab 360 — Entry point
 *
 * This file is kept for backward compatibility.
 * The app is fully split into modular files:
 *
 *  src/
 *  ├── App.tsx                        ← root component & layout
 *  ├── types/index.ts                 ← all TypeScript types
 *  ├── data/
 *  │   ├── elements.ts                ← 118 elements + periodic grid
 *  │   ├── compounds.ts               ← known compound data
 *  │   └── quizLevels.ts              ← quiz challenge definitions
 *  ├── utils/
 *  │   ├── chemistry.ts               ← formula, bond detection, feedback
 *  │   └── colors.ts                  ← category colour maps
 *  ├── store/
 *  │   ├── context.tsx                ← AppContext & useApp hook
 *  │   └── reducer.ts                 ← appReducer & initialState
 *  └── components/
 *      ├── Header.tsx
 *      ├── LeftPanel.tsx
 *      ├── RightPanel.tsx
 *      ├── Sandbox.tsx
 *      ├── SandboxAtom.tsx
 *      ├── BondLines.tsx
 *      ├── ElementTile.tsx
 *      ├── PeriodicTablePanel.tsx
 *      ├── LewisView.tsx
 *      ├── MolecularPanel.tsx
 *      ├── QuizPanel.tsx
 *      ├── TeacherDashboard.tsx
 *      └── StudentDashboard.tsx
 */

export { default } from './App';
