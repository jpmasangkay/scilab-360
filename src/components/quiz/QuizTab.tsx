import { useCallback } from "react"
import type { QuizConfig, QuizResult } from "@/types/quiz"
import { useQuizState } from "@/hooks/useQuizState"
import { QuizSetup } from "./QuizSetup"
import { BondChallenge } from "./BondChallenge"
import { QuizResults } from "./QuizResults"

interface QuizTabProps {
  preselectedMolecule?: string
  onSaveResult:         (result: QuizResult) => void
  onGoFreePlay:         () => void
  existingResults:      QuizResult[]
}

export function QuizTab({ preselectedMolecule, onSaveResult, onGoFreePlay, existingResults }: QuizTabProps) {
  const {
    phase, config, currentMolecule, challengeIndex,
    totalChallenges, timeLeft, maxTime, points, streak,
    attempts, placedBonds, hintsUsed, feedback, lastResult,
    startQuiz, placeBond, removeLastBond, checkBonds,
    useHint, nextChallenge, resetQuiz,
  } = useQuizState()

  const handleStart = useCallback((cfg: QuizConfig) => {
    startQuiz(cfg)
  }, [startQuiz])

  const handleSave = useCallback(() => {
    if (lastResult) {
      onSaveResult(lastResult)
    }
  }, [lastResult, onSaveResult])

  if (phase === "setup") {
    return (
      <QuizSetup
        preselectedMolecule={preselectedMolecule}
        onStart={handleStart}
      />
    )
  }

  if ((phase === "challenge" || phase === "result") && currentMolecule) {
    return (
      <BondChallenge
        molecule={currentMolecule}
        difficulty={config?.difficulty ?? "easy"}
        challengeIndex={challengeIndex}
        totalChallenges={totalChallenges}
        timeLeft={timeLeft}
        maxTime={maxTime}
        points={points}
        streak={streak}
        placedBonds={placedBonds}
        hintsUsed={hintsUsed}
        feedback={phase === "result" ? feedback : "none"}
        onPlaceBond={placeBond}
        onRemoveLast={removeLastBond}
        onCheck={checkBonds}
        onHint={useHint}
        onNext={nextChallenge}
      />
    )
  }

  if (phase === "complete" && lastResult) {
    return (
      <QuizResults
        result={lastResult}
        attempts={attempts as Parameters<typeof QuizResults>[0]["attempts"]}
        onSave={handleSave}
        onRetry={resetQuiz}
        onFreePlay={onGoFreePlay}
      />
    )
  }

  return null
}
