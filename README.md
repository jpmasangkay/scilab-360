<div align="center">

<img src="https://img.shields.io/badge/⚛-SCILAB%20360-a855f7?style=for-the-badge&labelColor=0d0120&color=a855f7" alt="SciLab 360" />

# ⚛ SCILAB 360

### Interactive Chemistry Lab

**Drag. Drop. Bond. Learn.**  
A gamified chemistry simulation where students build real molecules from scratch using all 118 elements of the periodic table.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://your-vercel-url.vercel.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)

</div>

---

## 📸 Preview

![SciLab 360 Screenshot](./screenshot.png)

> *The sandbox workspace — drag elements from the periodic table into the canvas to form bonds in real time.*

---

## ✨ Features

### 🧪 Interactive Sandbox
- Drag and drop any of the **118 elements** from the full periodic table into the molecule sandbox
- Bonds form **automatically** based on real electronegativity and valence electron rules
- Supports **covalent**, **ionic**, and **metallic** bonds
- Double-click any placed atom to remove it
- Real-time formula display as you build

### 🔬 Two Modes

| Mode | Description |
|------|-------------|
| **Free Play** | Explore freely — combine any elements and watch bonds form with live chemical feedback |
| **Quiz Mode** | 30 guided challenges across 3 difficulty tiers — build target molecules to earn points |

### 🏆 Quiz Challenges — 30 Levels

| Tier | Levels | Examples |
|------|--------|---------|
| 🟢 **Easy** | L1 – L10 | H₂, O₂, NaCl, HCl, H₂O |
| 🟡 **Medium** | L11 – L20 | NH₃, CH₄, CO₂, SO₂, N₂ |
| 🔴 **Hard** | L21 – L30 | H₂O₂, C₂H₄, FeCl₃, Fe₂O₃, C₂H₂ |

### 📊 Student Dashboard
- Tracks **correct answers**, **wrong answers**, and your **score out of 30**
- Progress bars per difficulty tier (Easy / Medium / Hard)
- Full level-by-level checklist, **sectioned by difficulty**
- **Download Progress Report** — exports a `.txt` file with:
  - Total points earned
  - Score (X / 30)
  - Every question answered correctly ✅
  - Every question not yet completed ❌

### 🧬 Molecular View Panel
- **Ball & Stick** view — visual molecule diagram with bond lines
- **Lewis / e⁻** view — electron dot structure visualization
- Updates live as atoms are placed and bonded

### 🔭 Periodic Table Panel
- All 118 elements with atomic number, symbol, name
- Filter by category: nonmetal, halogen, noble gas, alkali metal, alkaline earth, transition metal, metalloid
- Search by element name, symbol, or atomic number
- Color-coded by element category

---

## 🛠️ Tech Stack

- **React 18** + **TypeScript** — component architecture with `useReducer` state management
- **Vite** — fast dev server and build tool
- **Tailwind CSS** — utility-first styling
- **Lucide React** — icons
- **Google Fonts** — Orbitron, Share Tech Mono, Exo 2 for the sci-fi aesthetic
- Custom chemistry engine — bond detection, formula computation, and feedback generation

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/scilab360.git
cd scilab360

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

The output will be in the `dist/` folder, ready to deploy.

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo directly in the [Vercel Dashboard](https://vercel.com/dashboard) for automatic deployments on every push.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.tsx              # Top nav bar with mode controls & MY PROGRESS button
│   ├── LeftPanel.tsx           # Progress tracker, feedback, periodic table
│   ├── RightPanel.tsx          # Molecular view panel wrapper
│   ├── Sandbox.tsx             # Main drag-and-drop molecule canvas
│   ├── SandboxAtom.tsx         # Individual draggable atom element
│   ├── PeriodicTablePanel.tsx  # Full 118-element periodic table with filters
│   ├── ElementTile.tsx         # Single element card component
│   ├── QuizPanel.tsx           # Quiz challenge card and CHECK ANSWER logic
│   ├── MolecularPanel.tsx      # Ball & Stick / Lewis view switcher
│   ├── LewisView.tsx           # Lewis dot structure renderer
│   ├── BondLines.tsx           # SVG bond line renderer
│   └── StudentDashboard.tsx    # Student progress panel (Easy/Medium/Hard sections)
├── data/
│   ├── elements.ts             # All 118 elements with chemical properties
│   ├── compounds.ts            # Known compound definitions
│   └── quizLevels.ts           # 30 quiz challenges with difficulty tiers
├── store/
│   ├── context.tsx             # React Context + AppProvider
│   └── reducer.ts              # AppState reducer and initial state
├── types/
│   └── index.ts                # Shared TypeScript interfaces and types
├── utils/
│   ├── chemistry.ts            # Bond detection, formula computation, feedback engine
│   └── colors.ts               # Element category color mappings
├── App.tsx                     # Root component
└── main.tsx                    # Entry point
```

---

## 🧠 How the Chemistry Engine Works

SciLab 360 uses a real-time bond detection algorithm based on actual chemistry rules:

- **Covalent bonds** form between two nonmetals when they are placed within proximity, based on their electronegativity difference
- **Ionic bonds** form between a metal and a nonmetal (e.g. Na + Cl → NaCl)
- **Metallic bonds** form between two metals
- **Bond order** (single, double, triple) is inferred from valence electron count
- The **formula** is computed by counting each element symbol and formatting with subscripts (e.g. H₂O, CO₂)
- **Feedback** is generated in real time to guide students toward correct structures

---

## 🎮 How to Play

1. **Select a mode** — Free Play to explore, or Quiz to take on challenges
2. In **Quiz Mode**, read the target molecule shown in the challenge card
3. **Drag elements** from the Periodic Table panel on the left into the sandbox
4. Watch bonds form automatically as atoms get close enough
5. Click **CHECK ANSWER** when you think your molecule is correct
6. Earn points, advance levels, and track your progress in the **Student Dashboard**
7. When done, open **MY PROGRESS** → **DOWNLOAD MY REPORT** to save your results

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

Made with ⚛ and 💜 &nbsp;|&nbsp; **SciLab 360** — Interactive Chemistry Lab

</div>
