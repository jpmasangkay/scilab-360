/**
 * SciLab 360 — Entry point
 *
 * This file is kept for backward compatibility.
 * The app is fully split into feature-based modules:
 *
 *  src/
 *  ├── App.tsx                              ← root component & layout
 *  ├── features/
 *  │   ├── layout/                          ← app shell & navigation
 *  │   │   ├── Header.tsx
 *  │   │   ├── LeftPanel.tsx
 *  │   │   └── RightPanel.tsx
 *  │   ├── sandbox/                         ← interactive chemistry lab
 *  │   │   ├── Sandbox.tsx
 *  │   │   ├── SandboxAtom.tsx
 *  │   │   └── BondLines.tsx
 *  │   ├── periodic-table/                  ← element selection & display
 *  │   │   ├── PeriodicTablePanel.tsx
 *  │   │   ├── ElementTile.tsx
 *  │   │   └── ElementsPanel.tsx
 *  │   ├── molecular-view/                  ← molecule visualization
 *  │   │   ├── MolecularPanel.tsx
 *  │   │   └── LewisView.tsx
 *  │   ├── quiz/                            ← quiz challenges
 *  │   │   └── QuizPanel.tsx
 *  │   ├── bondings/                        ← bonding reference guide
 *  │   │   └── BondingsPanel.tsx
 *  │   └── dashboard/                       ← student & teacher progress
 *  │       ├── StudentDashboard.tsx
 *  │       └── TeacherDashboard.tsx
 *  └── shared/
 *      ├── store/                           ← state management
 *      │   ├── context.tsx
 *      │   ├── reducer.ts
 *      │   └── theme.tsx
 *      ├── types/
 *      │   └── index.ts
 *      ├── utils/
 *      │   ├── chemistry.ts
 *      │   └── colors.ts
 *      └── data/
 *          ├── elements.ts
 *          ├── bondings.ts
 *          ├── compounds.ts
 *          ├── quizLevels.ts
 *          └── molecularStructures.ts
 */

export { default } from './App';
