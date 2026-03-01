import type { QuizResult } from "@/types/quiz"
import { GRADE_COLORS } from "@/utils/gradeCalculator"
import { exportToCSV } from "@/utils/csvExport"
import { toast } from "sonner"

interface Attempt {
  moleculeId:   string
  moleculeName: string
  correct:      number
  wrong:        number
  hints:        number
  timeTaken:    number
  points:       number
  isCorrect:    boolean
}

interface QuizResultsProps {
  result:     QuizResult
  attempts:   Attempt[]
  onSave:     () => void
  onRetry:    () => void
  onFreePlay: () => void
}

export function QuizResults({ result, attempts, onSave, onRetry, onFreePlay }: QuizResultsProps) {
  const maxPossible = result.totalChallenges * 30
  const gradeColor  = GRADE_COLORS[result.grade]

  const handleSave = () => {
    onSave()
    toast("💾 Score saved to dashboard")
  }

  const handleExport = () => {
    exportToCSV([result])
    toast("⬇ CSV downloaded successfully")
  }

  return (
    <div style={{ height:"100%", overflow:"hidden", background:"var(--color-bg-deep)", display:"flex", flexDirection:"column" }}>
      <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column", maxWidth:"700px", margin:"0 auto", width:"100%", padding:"20px 24px" }}>
        {/* Score header */}
        <div style={{ textAlign:"center", marginBottom:"20px", flexShrink:0 }}>
          <div style={{
            fontFamily:   "var(--font-display)",
            fontSize:     "64px",
            color:        gradeColor,
            textShadow:   `0 0 32px ${gradeColor}`,
            animation:    "var(--animate-glow-pulse)",
            marginBottom: "4px",
          }}>
            {result.grade}
          </div>
          <div style={{ fontFamily:"var(--font-display)", fontSize:"28px", color:"var(--color-text-primary)" }}>
            {result.points} / {maxPossible} pts
          </div>
          <div style={{ fontFamily:"var(--font-display)", fontSize:"18px", color:"var(--color-text-muted)", marginTop:"2px" }}>
            {result.score}%
          </div>
          <div style={{ marginTop:"8px", color:"var(--color-text-muted)", fontSize:"15px" }}>
            {result.studentName} · {result.difficulty} · {new Date(result.completedAt).toLocaleString()}
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:"10px", marginBottom:"16px", flexShrink:0 }}>
          <StatCard icon="✅" label="Correct Bonds"  value={`${result.correctBonds}`}    color="#10b981" />
          <StatCard icon="❌" label="Wrong Bonds"    value={`${result.wrongBonds}`}       color="#ef4444" />
          <StatCard icon="💡" label="Hints Used"     value={`${result.hintsUsed}`}        color="#f59e0b" />
          <StatCard icon="🔥" label="Best Streak"    value={`×${result.streak}`}          color="#f97316" />
        </div>

        {/* Challenge breakdown table */}
        <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column", background:"var(--color-bg-card)", borderRadius:"12px", border:"1px solid var(--color-border-dim)", marginBottom:"16px" }}>
          <h3 style={{ fontFamily:"var(--font-display)", fontSize:"14px", color:"var(--color-text-muted)", textTransform:"uppercase", letterSpacing:"0.1em", padding:"14px 16px 0", flexShrink:0 }}>
            Challenge Breakdown
          </h3>
          <div style={{ flex:1, overflowY:"auto", padding:"8px 16px 16px" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"15px" }}>
              <thead>
                <tr>
                  {["#","Molecule","Result","Correct","Wrong","Hints","Points","Time"].map(h => (
                    <th key={h} style={{ textAlign:"left", padding:"6px 8px", color:"var(--color-text-muted)", fontSize:"12px", textTransform:"uppercase", letterSpacing:"0.06em", borderBottom:"1px solid var(--color-border-dim)", position:"sticky", top:0, background:"var(--color-bg-card)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {attempts.map((a, i) => (
                  <tr key={i} style={{ borderBottom:"1px solid var(--color-border-dim)" }}>
                    <td style={{ padding:"7px 8px", color:"var(--color-text-muted)" }}>{i + 1}</td>
                    <td style={{ padding:"7px 8px", color:"var(--color-text-primary)" }}>{a.moleculeName}</td>
                    <td style={{ padding:"7px 8px" }}>
                      <span style={{ color: a.isCorrect ? "#10b981" : "#ef4444" }}>
                        {a.isCorrect ? "✓" : "✗"}
                      </span>
                    </td>
                    <td style={{ padding:"7px 8px", color:"#10b981", fontFamily:"var(--font-mono)" }}>{a.correct}</td>
                    <td style={{ padding:"7px 8px", color:"#ef4444", fontFamily:"var(--font-mono)" }}>{a.wrong}</td>
                    <td style={{ padding:"7px 8px", color:"#f59e0b", fontFamily:"var(--font-mono)" }}>{a.hints}</td>
                    <td style={{ padding:"7px 8px", color:"var(--color-cyan)", fontFamily:"var(--font-display)" }}>{a.points}</td>
                    <td style={{ padding:"7px 8px", color:"var(--color-text-muted)", fontFamily:"var(--font-mono)" }}>{a.timeTaken.toFixed(1)}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display:"flex", gap:"10px", flexWrap:"wrap", flexShrink:0 }}>
          <button onClick={handleSave}
            style={{ padding:"10px 20px", background:"var(--color-cyan-dim)", border:"1px solid var(--color-cyan)", borderRadius:"8px", color:"var(--color-cyan)", cursor:"pointer", fontFamily:"var(--font-display)", fontSize:"15px" }}>
            💾 Save to Dashboard
          </button>
          <button onClick={handleExport}
            style={{ padding:"10px 20px", background:"var(--color-bg-card)", border:"1px solid var(--color-border-dim)", borderRadius:"8px", color:"var(--color-text-muted)", cursor:"pointer", fontSize:"15px" }}>
            ⬇ Export CSV
          </button>
          <button onClick={onRetry}
            style={{ padding:"10px 20px", background:"var(--color-bg-card)", border:"1px solid var(--color-border-dim)", borderRadius:"8px", color:"var(--color-text-muted)", cursor:"pointer", fontSize:"15px" }}>
            🔁 Try Again
          </button>
          <button onClick={onFreePlay}
            style={{ padding:"10px 20px", background:"rgba(124,58,237,0.15)", border:"1px solid var(--color-violet)", borderRadius:"8px", color:"var(--color-violet)", cursor:"pointer", fontSize:"15px" }}>
            🎮 Free Play
          </button>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }: { icon:string; label:string; value:string; color:string }) {
  return (
    <div style={{ background:"var(--color-bg-card)", border:"1px solid var(--color-border-dim)", borderRadius:"12px", padding:"12px", textAlign:"center" }}>
      <div style={{ fontSize:"22px", marginBottom:"4px" }}>{icon}</div>
      <div style={{ fontFamily:"var(--font-display)", fontSize:"20px", color, marginBottom:"2px" }}>{value}</div>
      <div style={{ fontSize:"12px", color:"var(--color-text-muted)", textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</div>
    </div>
  )
}
