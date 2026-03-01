import type { QuizResult } from "../types/quiz"

export function exportToCSV(results: QuizResult[]): void {
  const headers = [
    "StudentName","Score%","Points","Grade","Molecule",
    "Difficulty","TotalChallenges","CorrectBonds",
    "WrongBonds","HintsUsed","Date","TimeSecs","Streak"
  ]

  const rows = results.map(r => [
    r.studentName,
    r.score,
    r.points,
    r.grade,
    r.moleculeName,
    r.difficulty,
    r.totalChallenges,
    r.correctBonds,
    r.wrongBonds,
    r.hintsUsed,
    new Date(r.completedAt).toLocaleDateString(),
    r.timeTaken.toFixed(1),
    r.streak,
  ])

  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(","))
    .join("\n")

  const blob    = new Blob([csv], { type: "text/csv" })
  const url     = URL.createObjectURL(blob)
  const a       = document.createElement("a")
  a.href        = url
  a.download    = `chembond_scores_${new Date().toISOString().slice(0,10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
