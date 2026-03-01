import { useState, useMemo } from "react"
import type { QuizResult } from "@/types/quiz"
import { GRADE_COLORS } from "@/utils/gradeCalculator"
import { exportToCSV } from "@/utils/csvExport"
import { ACHIEVEMENTS } from "@/data/achievements"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface DashboardTabProps {
  results:      QuizResult[]
  unlocked:     string[]
  onDelete:     (id: string) => void
  onClearAll:   () => void
  studentName:  string
}

type SortKey = "score" | "points" | "date" | "molecule" | "difficulty"
type SortDir = "asc" | "desc"

export function DashboardTab({ results, unlocked, onDelete, onClearAll, studentName }: DashboardTabProps) {
  const [sortKey,   setSortKey]   = useState<SortKey>("date")
  const [sortDir,   setSortDir]   = useState<SortDir>("desc")
  const [search,    setSearch]    = useState("")
  const [page,      setPage]      = useState(0)
  const [showClear, setShowClear] = useState(false)
  const ROWS = 10

  const totalPoints = results.reduce((s, r) => s + r.points, 0)
  const bestScore   = results.length ? Math.max(...results.map(r => r.score)) : 0
  const bestMol     = results.find(r => r.score === bestScore)?.moleculeName ?? "—"
  const bestStreak  = results.length ? Math.max(...results.map(r => r.streak)) : 0

  const filtered = useMemo(() => {
    let r = results.filter(res =>
      search === "" ||
      res.studentName.toLowerCase().includes(search.toLowerCase()) ||
      res.moleculeName.toLowerCase().includes(search.toLowerCase())
    )
    r = [...r].sort((a, b) => {
      let va: number | string, vb: number | string
      if (sortKey === "score")       { va = a.score;   vb = b.score }
      else if (sortKey === "points") { va = a.points;  vb = b.points }
      else if (sortKey === "date")   { va = a.completedAt; vb = b.completedAt }
      else if (sortKey === "molecule") { va = a.moleculeName; vb = b.moleculeName }
      else                           { va = a.difficulty; vb = b.difficulty }
      if (va < vb) return sortDir === "asc" ? -1 : 1
      if (va > vb) return sortDir === "asc" ? 1 : -1
      return 0
    })
    return r
  }, [results, search, sortKey, sortDir])

  const pages   = Math.ceil(filtered.length / ROWS)
  const paged   = filtered.slice(page * ROWS, (page + 1) * ROWS)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortKey(key); setSortDir("desc") }
    setPage(0)
  }

  const top5 = [...results].sort((a, b) => b.score - a.score).slice(0, 5)

  const medals = ["🥇","🥈","🥉","4th","5th"]
  const medalColors = ["#ffd700","#c0c0c0","#cd7f32","var(--color-text-muted)","var(--color-text-muted)"]

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden", background:"var(--color-bg-deep)" }}>
      {/* Header */}
      <div style={{ padding:"12px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"8px", flexShrink:0 }}>
        <div>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"26px", color:"var(--color-cyan)", letterSpacing:"0.05em" }}>Student Dashboard</h2>
          {studentName && (
            <p style={{ color:"var(--color-text-muted)", fontSize:"15px", marginTop:"2px" }}>
              Welcome back, {studentName}
            </p>
          )}
        </div>
        <div style={{ display:"flex", gap:"8px" }}>
          <button onClick={() => { exportToCSV(results); toast("⬇ CSV downloaded") }}
            aria-label="Export all data"
            style={{ padding:"7px 14px", background:"var(--color-bg-card)", border:"1px solid var(--color-border-dim)", borderRadius:"8px", color:"var(--color-text-muted)", cursor:"pointer", fontSize:"14px" }}>
            ⬇ Export CSV
          </button>
          <button onClick={() => setShowClear(true)}
            aria-label="Clear all data"
            style={{ padding:"7px 14px", background:"rgba(239,68,68,0.1)", border:"1px solid #ef4444", borderRadius:"8px", color:"#ef4444", cursor:"pointer", fontSize:"14px" }}>
            🗑 Clear All
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:"10px", padding:"0 20px 12px", flexShrink:0 }}>
        <StatCard icon="🏆" label="Total Points"  value={`${totalPoints}`}             color="var(--color-cyan)" />
        <StatCard icon="📝" label="Quizzes Taken"  value={`${results.length}`}          color="#7c3aed" />
        <StatCard icon="🎯" label="Best Score"     value={`${bestScore}% — ${bestMol}`} color="#10b981" small />
        <StatCard icon="🔥" label="Best Streak"    value={`×${bestStreak}`}             color="#f97316" />
      </div>

      {/* Table + Leaderboard + Achievements */}
      <div style={{ flex:1, overflow:"hidden", display:"grid", gridTemplateColumns:"1fr 280px", gap:"12px", padding:"0 20px 12px" }}>
        {/* Score table */}
        <div style={{ display:"flex", flexDirection:"column", background:"var(--color-bg-card)", borderRadius:"12px", border:"1px solid var(--color-border-dim)", overflow:"hidden" }}>
          <div style={{ padding:"10px 16px", borderBottom:"1px solid var(--color-border-dim)", display:"flex", alignItems:"center", gap:"12px", flexShrink:0 }}>
            <h3 style={{ fontFamily:"var(--font-display)", fontSize:"14px", color:"var(--color-text-muted)", textTransform:"uppercase", letterSpacing:"0.1em" }}>Score History</h3>
            <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(0) }}
              placeholder="Search…" aria-label="Search scores"
              style={{ marginLeft:"auto", padding:"5px 10px", background:"var(--color-bg-deep)", border:"1px solid var(--color-border-dim)", borderRadius:"6px", color:"var(--color-text-primary)", fontSize:"14px", outline:"none", width:"160px" }}
            />
          </div>
          <div style={{ flex:1, overflowY:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"14px" }}>
              <thead>
                <tr>
                  {[
                    { key:"score" as SortKey, label:"Score%" },
                    { key:"points" as SortKey, label:"Points" },
                    { key:null, label:"Grade" },
                    { key:"molecule" as SortKey, label:"Molecule" },
                    { key:"difficulty" as SortKey, label:"Diff" },
                    { key:"date" as SortKey, label:"Date" },
                    { key:null, label:"Actions" },
                  ].map(col => (
                    <th key={col.label}
                      onClick={() => col.key && handleSort(col.key)}
                      style={{ padding:"8px 10px", textAlign:"left", color:"var(--color-text-muted)", fontSize:"12px", textTransform:"uppercase", letterSpacing:"0.06em", borderBottom:"1px solid var(--color-border-dim)", cursor: col.key ? "pointer" : "default", whiteSpace:"nowrap", position:"sticky", top:0, background:"var(--color-bg-card)" }}>
                      {col.label}
                      {col.key === sortKey && <span style={{ marginLeft:"4px" }}>{sortDir === "asc" ? "↑" : "↓"}</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.map(r => (
                  <tr key={r.id}
                    style={{ borderBottom:"1px solid var(--color-border-dim)", transition:"background 0.1s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--color-cyan-dim)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding:"7px 10px", color:"var(--color-text-primary)", fontFamily:"var(--font-mono)" }}>{r.score}%</td>
                    <td style={{ padding:"7px 10px", color:"var(--color-cyan)", fontFamily:"var(--font-display)" }}>{r.points}</td>
                    <td style={{ padding:"7px 10px" }}>
                      <span style={{ padding:"2px 8px", background: GRADE_COLORS[r.grade] + "22", border:`1px solid ${GRADE_COLORS[r.grade]}`, borderRadius:"10px", color:GRADE_COLORS[r.grade], fontSize:"13px", fontFamily:"var(--font-display)" }}>
                        {r.grade}
                      </span>
                    </td>
                    <td style={{ padding:"7px 10px", color:"var(--color-text-primary)" }}>{r.moleculeName}</td>
                    <td style={{ padding:"7px 10px", color:"var(--color-text-muted)", textTransform:"capitalize" }}>{r.difficulty}</td>
                    <td style={{ padding:"7px 10px", color:"var(--color-text-muted)", whiteSpace:"nowrap" }}>
                      {new Date(r.completedAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding:"7px 10px" }}>
                      <button onClick={() => onDelete(r.id)} aria-label="Delete result"
                        style={{ padding:"2px 8px", background:"rgba(239,68,68,0.1)", border:"1px solid #ef4444", borderRadius:"4px", color:"#ef4444", cursor:"pointer", fontSize:"13px" }}>
                        🗑
                      </button>
                    </td>
                  </tr>
                ))}
                {paged.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding:"20px", textAlign:"center", color:"var(--color-text-muted)", fontSize:"15px" }}>
                      No results found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {pages > 1 && (
            <div style={{ padding:"8px 14px", borderTop:"1px solid var(--color-border-dim)", display:"flex", alignItems:"center", gap:"8px", justifyContent:"flex-end", flexShrink:0 }}>
              <span style={{ fontSize:"13px", color:"var(--color-text-muted)" }}>Page {page+1} of {pages}</span>
              <button onClick={() => setPage(p => Math.max(0, p-1))} disabled={page === 0}
                style={{ padding:"4px 10px", background:"var(--color-bg-deep)", border:"1px solid var(--color-border-dim)", borderRadius:"6px", color: page === 0 ? "var(--color-border-dim)" : "var(--color-text-muted)", cursor: page === 0 ? "not-allowed" : "pointer", fontSize:"13px" }}>
                ← Prev
              </button>
              <button onClick={() => setPage(p => Math.min(pages-1, p+1))} disabled={page >= pages-1}
                style={{ padding:"4px 10px", background:"var(--color-bg-deep)", border:"1px solid var(--color-border-dim)", borderRadius:"6px", color: page >= pages-1 ? "var(--color-border-dim)" : "var(--color-text-muted)", cursor: page >= pages-1 ? "not-allowed" : "pointer", fontSize:"13px" }}>
                Next →
              </button>
            </div>
          )}
        </div>

        {/* Right column: Leaderboard + Achievements stacked */}
        <div style={{ display:"flex", flexDirection:"column", gap:"12px", overflow:"hidden" }}>
          {/* Leaderboard */}
          <div style={{ background:"var(--color-bg-card)", borderRadius:"12px", border:"1px solid var(--color-border-dim)", overflow:"hidden", flexShrink:0 }}>
            <div style={{ padding:"10px 16px", borderBottom:"1px solid var(--color-border-dim)" }}>
              <h3 style={{ fontFamily:"var(--font-display)", fontSize:"14px", color:"var(--color-text-muted)", textTransform:"uppercase", letterSpacing:"0.1em" }}>Top 5</h3>
            </div>
            {top5.length === 0 ? (
              <div style={{ padding:"16px", textAlign:"center", color:"var(--color-text-muted)", fontSize:"14px" }}>No results yet</div>
            ) : top5.map((r, i) => (
              <div key={r.id} style={{ padding:"8px 14px", borderBottom:"1px solid var(--color-border-dim)", display:"flex", alignItems:"center", gap:"8px", background: i === 0 ? "rgba(255,215,0,0.05)" : i === 1 ? "rgba(192,192,192,0.05)" : i === 2 ? "rgba(205,127,50,0.05)" : "transparent" }}>
                <span style={{ fontSize:"18px", width:"26px" }}>{medals[i]}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:"14px", color:"var(--color-text-primary)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.studentName}</div>
                  <div style={{ fontSize:"12px", color:"var(--color-text-muted)" }}>{r.moleculeName}</div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontFamily:"var(--font-display)", fontSize:"15px", color: medalColors[i] }}>{r.score}%</div>
                  <div style={{ fontSize:"12px", color:"var(--color-text-muted)" }}>{r.points}pts</div>
                </div>
              </div>
            ))}
          </div>

          {/* Achievements */}
          <div style={{ background:"var(--color-bg-card)", borderRadius:"12px", border:"1px solid var(--color-border-dim)", padding:"12px", flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
            <h3 style={{ fontFamily:"var(--font-display)", fontSize:"14px", color:"var(--color-text-muted)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"10px", flexShrink:0 }}>
              Achievements
            </h3>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(80px, 1fr))", gap:"8px", overflow:"auto", flex:1 }}>
              {ACHIEVEMENTS.map(a => {
                const isUnlocked = unlocked.includes(a.id)
                return (
                  <div key={a.id} title={a.condition}
                    style={{ padding:"8px 4px", background:"var(--color-bg-deep)", border:`1px solid ${isUnlocked ? "var(--color-cyan)" : "var(--color-border-dim)"}`, borderRadius:"8px", textAlign:"center", opacity: isUnlocked ? 1 : 0.4, filter: isUnlocked ? "none" : "grayscale(1)", transition:"all 0.2s" }}>
                    <div style={{ fontSize:"22px", marginBottom:"4px" }}>{a.icon}</div>
                    <div style={{ fontFamily:"var(--font-display)", fontSize:"10px", color: isUnlocked ? "var(--color-cyan)" : "var(--color-text-muted)", letterSpacing:"0.04em", lineHeight:1.3 }}>
                      {a.title}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Clear All Dialog */}
      <Dialog open={showClear} onOpenChange={v => !v && setShowClear(false)}>
        <DialogContent style={{ background:"var(--color-bg-card)", border:"1px solid var(--color-border-dim)", color:"var(--color-text-primary)", maxWidth:"380px" }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily:"var(--font-display)", color:"#ef4444" }}>Clear All Data?</DialogTitle>
          </DialogHeader>
          <p style={{ color:"var(--color-text-muted)", fontSize:"15px", marginTop:"8px" }}>
            This will permanently delete all {results.length} quiz results and achievements. This cannot be undone.
          </p>
          <div style={{ display:"flex", gap:"10px", marginTop:"16px" }}>
            <button onClick={() => { onClearAll(); setShowClear(false); toast("All data cleared") }}
              style={{ flex:1, padding:"10px", background:"rgba(239,68,68,0.15)", border:"1px solid #ef4444", borderRadius:"8px", color:"#ef4444", cursor:"pointer", fontFamily:"var(--font-display)", fontSize:"14px" }}>
              Yes, Clear All
            </button>
            <button onClick={() => setShowClear(false)}
              style={{ flex:1, padding:"10px", background:"var(--color-bg-deep)", border:"1px solid var(--color-border-dim)", borderRadius:"8px", color:"var(--color-text-muted)", cursor:"pointer", fontSize:"14px" }}>
              Cancel
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function StatCard({ icon, label, value, color, small }: { icon:string; label:string; value:string; color:string; small?:boolean }) {
  return (
    <div style={{ background:"var(--color-bg-card)", border:"1px solid var(--color-border-dim)", borderRadius:"12px", padding:"12px", textAlign:"center" }}>
      <div style={{ fontSize:"24px", marginBottom:"4px" }}>{icon}</div>
      <div style={{ fontFamily:"var(--font-display)", fontSize: small ? "15px" : "20px", color, marginBottom:"2px", wordBreak:"break-word" }}>{value}</div>
      <div style={{ fontSize:"12px", color:"var(--color-text-muted)", textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</div>
    </div>
  )
}
