import { useCallback } from "react"
import { toast } from "sonner"
import type { QuizResult } from "../types/quiz"
import { ACHIEVEMENTS } from "../data/achievements"
import { useLocalStorage } from "./useLocalStorage"
import type { FreeMolecule } from "../types/freeplay"

export function useAchievements() {
  const [unlocked, setUnlocked] = useLocalStorage<string[]>(
    "chembond_achievements",
    []
  )

  const unlock = useCallback((id: string) => {
    setUnlocked(prev => {
      if (prev.includes(id)) return prev
      const achievement = ACHIEVEMENTS.find(a => a.id === id)
      if (achievement) {
        toast.success(`🏆 Achievement Unlocked: ${achievement.title}!`, { duration: 4000 })
      }
      return [...prev, id]
    })
  }, [setUnlocked])

  const checkAchievements = useCallback((
    results: QuizResult[],
    savedMolecules: FreeMolecule[]
  ) => {
    if (results.length >= 1) unlock("first_experiment")
    if (results.some(r => r.score >= 80)) unlock("chemist")
    if (results.length >= 5) unlock("lab_expert")
    if (results.some(r => r.score === 100)) unlock("valence_master")
    if (results.some(r => r.streak >= 3)) unlock("on_fire")

    const diffs = new Set(results.map(r => r.difficulty))
    if (diffs.has("easy") && diffs.has("medium") && diffs.has("hard")) {
      unlock("bond_master")
    }

    if (results.length >= 3) {
      const avg = results.slice(-3).reduce((s, r) => s + r.score, 0) / 3
      if (avg >= 90) unlock("scholar")
    }

    if (results.some(r => r.wrongBonds === 0 && r.totalChallenges >= 1)) {
      unlock("perfectionist")
    }

    if (savedMolecules.length >= 5) unlock("molecule_builder")
  }, [unlock])

  const isUnlocked = useCallback((id: string) => unlocked.includes(id), [unlocked])

  return { unlocked, unlock, checkAchievements, isUnlocked }
}
