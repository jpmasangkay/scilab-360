# ⚛ SCILAB 360
[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/jpmasangkay/scilab-360)

### Interactive Chemistry Lab

**Drag. Drop. Bond. Learn.**

A gamified chemistry simulation where students build real molecules from scratch using all 118 elements of the periodic table.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

---

## ✨ Features

### 🧪 Interactive Sandbox

- Drag and drop any of the **118 elements** from the full periodic table into the molecule sandbox
- Bonds form **automatically** based on real electronegativity and valence electron rules
- Supports **covalent**, **ionic**, and **metallic** bond types
- Double-click any placed atom to remove it
- Real-time molecular formula display as you build
- Responsive layout — works on desktop, tablet, and mobile

### 🔬 Two Game Modes

| Mode | Description |
|------|-------------|
| **Free Play** | Explore freely — combine any elements and watch bonds form with live chemical feedback |
| **Quiz Mode** | 30 guided challenges across 3 difficulty tiers — build target molecules to earn points |

### 🏆 Quiz Challenges — 30 Levels

| Tier | Levels | Examples |
|------|--------|---------|
| 🟢 **Easy** | L1 – L10 | H₂, O₂, F₂, Cl₂, NaCl, HCl, HF, H₂O, LiF, KBr |
| 🟡 **Medium** | L11 – L20 | NH₃, CH₄, CO₂, SO₂, N₂, CaO, MgO, NO₂, H₂S, PCl₃ |
| 🔴 **Hard** | L21 – L30 | H₂O₂, C₂H₄, FeCl₃, Na₂O, CaCl₂, SO₃, Al₂O₃, C₂H₂, C₂H₆, Fe₂O₃ |

Each challenge includes a **title**, **description**, **target formula**, and a **contextual hint** to guide learners.

### 📊 Student Dashboard

- Tracks **correct answers**, **wrong answers**, and your **score out of 30**
- Visual progress bars per difficulty tier (Easy / Medium / Hard)
- Full level-by-level checklist, **sectioned by difficulty**
- **Download Progress Report** — exports a `.txt` file with:
  - Total points earned
  - Score summary (X / 30)
  - Every question answered correctly ✅
  - Every question not yet completed ❌

### 🧬 Molecular View Panel

- **Ball & Stick** view — visual molecule diagram with SVG bond lines
- **Lewis / e⁻** view — electron dot structure visualization
- Updates live as atoms are placed and bonded in the sandbox

### 🔭 Periodic Table Panel

- All **118 elements** with atomic number, symbol, and name
- Filter by category: nonmetal, halogen, noble gas, alkali metal, alkaline earth, transition metal, post-transition metal, metalloid, lanthanide, actinide
- Search by element **name**, **symbol**, or **atomic number**
- Color-coded tiles by element category
- Full interactive periodic table grid layout

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | Component architecture with `useReducer` + Context state management |
| **TypeScript 5.9** | Full type safety across the entire codebase |
| **Vite 7** | Lightning-fast dev server and optimized production builds |
| **Tailwind CSS 4** | Utility-first styling with custom sci-fi theme |
| **Lucide React** | Crisp, consistent icon set |
| **Google Fonts** | Orbitron, Share Tech Mono, Exo 2 for the sci-fi aesthetic |

The app uses a **custom chemistry engine** built from scratch — handling bond detection, formula computation, and real-time feedback generation without any external chemistry libraries.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/jpmasangkay/scilab-360.git
cd scilab-360

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check with `tsc` and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

### Build for Production

```bash
npm run build
```

The output will be in the `dist/` folder, ready to deploy to any static hosting provider.

---

## 📁 Project Structure

```
scilab-360/
├── public/                         # Static assets
├── src/
│   ├── components/
│   │   ├── Header.tsx              # Top nav bar — mode toggle, reset, MY PROGRESS
│   │   ├── LeftPanel.tsx           # Progress tracker, feedback panel, periodic table
│   │   ├── RightPanel.tsx          # Molecular view panel wrapper
│   │   ├── Sandbox.tsx             # Main drag-and-drop molecule canvas
│   │   ├── SandboxAtom.tsx         # Individual draggable atom in the sandbox
│   │   ├── BondLines.tsx           # SVG bond line renderer between atoms
│   │   ├── ElementsPanel.tsx       # Full-screen elements browser overlay
│   │   ├── ElementTile.tsx         # Single element card component
│   │   ├── PeriodicTablePanel.tsx  # 118-element periodic table with filters & search
│   │   ├── QuizPanel.tsx           # Quiz challenge card and CHECK ANSWER logic
│   │   ├── MolecularPanel.tsx      # Ball & Stick / Lewis view switcher
│   │   ├── LewisView.tsx           # Lewis dot structure renderer
│   │   └── StudentDashboard.tsx    # Student progress modal (Easy/Medium/Hard tiers)
│   ├── data/
│   │   ├── elements.ts            # All 118 elements with chemical properties & grid positions
│   │   ├── compounds.ts           # Known compound definitions for formula matching
│   │   └── quizLevels.ts          # 30 quiz challenges with difficulty tiers & hints
│   ├── store/
│   │   ├── context.tsx            # React Context provider & useApp hook
│   │   └── reducer.ts             # App state reducer, actions & initial state
│   ├── types/
│   │   └── index.ts               # Shared TypeScript interfaces & types
│   ├── utils/
│   │   ├── chemistry.ts           # Bond detection, formula computation, feedback engine
│   │   └── colors.ts              # Element category → color mappings
│   ├── App.tsx                    # Root layout component (responsive desktop/tablet/mobile)
│   ├── App.css                    # Global styles
│   ├── main.tsx                   # Application entry point
│   └── SciLab360.tsx              # Re-export entry (backward compat)
├── index.html                     # HTML shell
├── vite.config.ts                 # Vite configuration
├── tsconfig.json                  # TypeScript project references
├── tsconfig.app.json              # TypeScript config for app source
├── tsconfig.node.json             # TypeScript config for Node tooling
├── eslint.config.js               # ESLint flat config
└── package.json
```

---

## 🧠 How the Chemistry Engine Works

SciLab 360 uses a **real-time bond detection algorithm** based on actual chemistry rules:

1. **Bond Classification** — When two atoms are placed near each other, the engine classifies the bond:
   - **Covalent bonds** form between two nonmetals, based on electronegativity difference
   - **Ionic bonds** form between a metal and a nonmetal (e.g. Na + Cl → NaCl)
   - **Metallic bonds** form between two metals

2. **Bond Order** — Single, double, and triple bonds are inferred from each atom's valence electron count and bonding capacity

3. **Formula Computation** — Element symbols are counted and formatted into standard chemical notation with subscripts (e.g. H₂O, CO₂, Fe₂O₃)

4. **Real-time Feedback** — The engine generates contextual messages to guide students:
   - Identifies the compound being built
   - Warns about incorrect combinations
   - Provides hints in quiz mode

---

## 🎮 How to Play

1. **Choose a mode** — **Free Play** to explore, or **Quiz** to take on challenges
2. In **Quiz Mode**, read the target molecule shown in the challenge card
3. **Drag elements** from the Periodic Table panel on the left into the sandbox
4. Watch bonds form **automatically** as atoms are placed near each other
5. Click **CHECK ANSWER** when you think your molecule is correct
6. Earn points, advance through 30 levels, and track your progress in the **Student Dashboard**
7. Open **MY PROGRESS** → **DOWNLOAD MY REPORT** to save a full progress report

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---
