import { useState, useCallback } from "react"
import type { QuizConfig, Difficulty } from "@/types/quiz"
import { MOLECULES } from "@/data/molecules"
import { validateStudentName } from "@/schemas/validation"

interface QuizSetupProps {
  preselectedMolecule?: string
  onStart: (config: QuizConfig) => void
}

const DIFFICULTIES: { id: Difficulty; label: string; desc: string; time: number }[] = [
  { id:"easy",   label:"Easy",   desc:"90s · Bond type shown",         time:90 },
  { id:"medium", label:"Medium", desc:"60s · Select bond type",        time:60 },
  { id:"hard",   label:"Hard",   desc:"45s · No hints by default",     time:45 },
]

export function QuizSetup({ preselectedMolecule, onStart }: QuizSetupProps) {
  const [name,         setName]         = useState("")
  const [nameError,    setNameError]    = useState<string | null>(null)
  const [nameValid,    setNameValid]    = useState(false)
  const [difficulty,   setDifficulty]   = useState<Difficulty>("easy")
  const [moleculeId,   setMoleculeId]   = useState<string>(preselectedMolecule ?? "random")
  const [challenges,   setChallenges]   = useState<3 | 5 | 10>(5)

  const handleNameChange = useCallback((val: string) => {
    setName(val)
    const err = validateStudentName(val)
    setNameError(err)
    setNameValid(!err && val.length >= 2)
  }, [])

  const handleStart = () => {
    if (!nameValid) return
    onStart({ studentName: name.trim(), difficulty, moleculeId, totalChallenges: challenges })
  }

  return (
    <div style={{
      height:         "100%",
      overflow:       "hidden",
      background:     "var(--color-bg-deep)",
      display:        "flex",
      alignItems:     "center",
      justifyContent: "center",
      padding:        "24px",
    }}>
      <div style={{
        width:        "100%",
        maxWidth:     "520px",
        background:   "var(--color-bg-card)",
        border:       "1px solid var(--color-border-dim)",
        borderRadius: "16px",
        padding:      "28px",
      }}>
        <h2 style={{
          fontFamily:    "var(--font-display)",
          fontSize:      "28px",
          color:         "var(--color-cyan)",
          marginBottom:  "6px",
          letterSpacing: "0.05em",
        }}>
          🧠 Quiz Mode
        </h2>
        <p style={{ color:"var(--color-text-muted)", fontSize:"16px", marginBottom:"24px" }}>
          Draw bonds to complete the molecule structure.
        </p>

        {/* Name */}
        <div style={{ marginBottom:"18px" }}>
          <label style={{ display:"block", fontSize:"14px", color:"var(--color-text-muted)", marginBottom:"6px", textTransform:"uppercase", letterSpacing:"0.08em" }}>
            Your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => handleNameChange(e.target.value)}
            placeholder="Enter your name..."
            aria-label="Student name"
            aria-invalid={!!nameError}
            style={{
              width:        "100%",
              padding:      "10px 14px",
              background:   "var(--color-bg-deep)",
              border:       `2px solid ${nameError ? "var(--color-error)" : nameValid ? "var(--color-success)" : "var(--color-border-dim)"}`,
              borderRadius: "8px",
              color:        "var(--color-text-primary)",
              fontSize:     "16px",
              outline:      "none",
              transition:   "border-color 0.2s",
            }}
          />
          {nameError && (
            <p style={{ color:"var(--color-error)", fontSize:"14px", marginTop:"4px" }}>
              ✗ {nameError}
            </p>
          )}
          {nameValid && (
            <p style={{ color:"var(--color-success)", fontSize:"14px", marginTop:"4px" }}>
              ✓ Ready
            </p>
          )}
        </div>

        {/* Difficulty */}
        <div style={{ marginBottom:"18px" }}>
          <label style={{ display:"block", fontSize:"14px", color:"var(--color-text-muted)", marginBottom:"8px", textTransform:"uppercase", letterSpacing:"0.08em" }}>
            Difficulty
          </label>
          <div style={{ display:"flex", gap:"8px" }}>
            {DIFFICULTIES.map(d => (
              <button
                key={d.id}
                onClick={() => setDifficulty(d.id)}
                aria-label={`${d.label} difficulty`}
                style={{
                  flex:         1,
                  padding:      "10px 6px",
                  background:   difficulty === d.id ? "var(--color-cyan-dim)" : "var(--color-bg-deep)",
                  border:       `1px solid ${difficulty === d.id ? "var(--color-cyan)" : "var(--color-border-dim)"}`,
                  borderRadius: "8px",
                  cursor:       "pointer",
                  textAlign:    "center",
                }}
              >
                <div style={{ fontFamily:"var(--font-display)", fontSize:"15px", color: difficulty === d.id ? "var(--color-cyan)" : "var(--color-text-primary)" }}>
                  {d.label}
                </div>
                <div style={{ fontSize:"12px", color:"var(--color-text-muted)", marginTop:"3px" }}>
                  {d.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Molecule */}
        <div style={{ marginBottom:"18px" }}>
          <label style={{ display:"block", fontSize:"14px", color:"var(--color-text-muted)", marginBottom:"6px", textTransform:"uppercase", letterSpacing:"0.08em" }}>
            Molecule
          </label>
          <select
            value={moleculeId}
            onChange={e => setMoleculeId(e.target.value)}
            aria-label="Select molecule"
            style={{
              width:        "100%",
              padding:      "10px 14px",
              background:   "var(--color-bg-deep)",
              border:       "1px solid var(--color-border-dim)",
              borderRadius: "8px",
              color:        "var(--color-text-primary)",
              fontSize:     "16px",
              outline:      "none",
              cursor:       "pointer",
            }}
          >
            <option value="random">🎲 Random</option>
            {MOLECULES.map(mol => (
              <option key={mol.id} value={mol.id}>
                {mol.formula} — {mol.name} ({mol.difficulty})
              </option>
            ))}
          </select>
        </div>

        {/* Challenges */}
        <div style={{ marginBottom:"24px" }}>
          <label style={{ display:"block", fontSize:"14px", color:"var(--color-text-muted)", marginBottom:"8px", textTransform:"uppercase", letterSpacing:"0.08em" }}>
            Challenges
          </label>
          <div style={{ display:"flex", gap:"8px" }}>
            {([3,5,10] as const).map(n => (
              <button
                key={n}
                onClick={() => setChallenges(n)}
                aria-label={`${n} challenges`}
                style={{
                  flex:         1,
                  padding:      "10px",
                  background:   challenges === n ? "var(--color-cyan-dim)" : "var(--color-bg-deep)",
                  border:       `1px solid ${challenges === n ? "var(--color-cyan)" : "var(--color-border-dim)"}`,
                  borderRadius: "8px",
                  cursor:       "pointer",
                  fontFamily:   "var(--font-display)",
                  fontSize:     "18px",
                  color:        challenges === n ? "var(--color-cyan)" : "var(--color-text-primary)",
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Start */}
        <button
          onClick={handleStart}
          disabled={!nameValid}
          aria-label="Start quiz"
          style={{
            width:        "100%",
            padding:      "14px",
            background:   nameValid
              ? "linear-gradient(135deg, var(--color-cyan), var(--color-violet))"
              : "var(--color-border-dim)",
            border:       "none",
            borderRadius: "10px",
            color:        nameValid ? "#fff" : "var(--color-text-muted)",
            cursor:       nameValid ? "pointer" : "not-allowed",
            fontFamily:   "var(--font-display)",
            fontSize:     "17px",
            letterSpacing:"0.08em",
            transition:   "opacity 0.2s",
            opacity:      nameValid ? 1 : 0.6,
          }}
        >
          ▶ Start Quiz
        </button>
      </div>
    </div>
  )
}
