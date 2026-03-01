import { useState, useCallback, useRef, useEffect } from "react"
import { v4 as uuid } from "uuid"
import type { Molecule, BondConnection, BondType } from "../types/chemistry"
import type { Difficulty, QuizResult, QuizConfig, QuizPhase } from "../types/quiz"
import { validateBonds } from "../utils/bondValidation"
import { calculateGrade } from "../utils/gradeCalculator"
import { MOLECULES } from "../data/molecules"

interface ChallengeAttempt {
  moleculeId:   string
  moleculeName: string
  correct:      number
  wrong:        number
  hints:        number
  timeTaken:    number
  points:       number
  isCorrect:    boolean
}

interface UseQuizStateReturn {
  phase:            QuizPhase
  config:           QuizConfig | null
  currentMolecule:  Molecule | null
  challengeIndex:   number
  totalChallenges:  number
  timeLeft:         number
  maxTime:          number
  points:           number
  streak:           number
  attempts:         ChallengeAttempt[]
  placedBonds:      BondConnection[]
  hintsUsed:        number
  feedback:         "none" | "correct" | "wrong"
  lastResult:       QuizResult | null
  startQuiz:        (cfg: QuizConfig) => void
  placeBond:        (fromId: string, toId: string, bondType: BondType) => void
  removeLastBond:   () => void
  checkBonds:       () => void
  useHint:          () => { fromId: string; toId: string } | null
  nextChallenge:    () => void
  resetQuiz:        () => void
}

const DIFFICULTY_TIME: Record<Difficulty, number> = {
  easy:   90,
  medium: 60,
  hard:   45,
}

const getTimerPoints = (timeLeft: number, maxTime: number): number => {
  const ratio = timeLeft / maxTime
  if (ratio > 0.7) return 30
  if (ratio > 0.4) return 20
  return 10
}

export function useQuizState(): UseQuizStateReturn {
  const [phase, setPhase]           = useState<QuizPhase>("setup")
  const [config, setConfig]         = useState<QuizConfig | null>(null)
  const [challengeIndex, setChallengeIndex] = useState(0)
  const [currentMolecule, setCurrentMolecule] = useState<Molecule | null>(null)
  const [moleculeQueue, setMoleculeQueue] = useState<Molecule[]>([])
  const [timeLeft, setTimeLeft]     = useState(90)
  const [maxTime, setMaxTime]       = useState(90)
  const [points, setPoints]         = useState(0)
  const [streak, setStreak]         = useState(0)
  const [attempts, setAttempts]     = useState<ChallengeAttempt[]>([])
  const [placedBonds, setPlacedBonds] = useState<BondConnection[]>([])
  const [hintsUsed, setHintsUsed]   = useState(0)
  const [feedback, setFeedback]     = useState<"none" | "correct" | "wrong">("none")
  const [lastResult, setLastResult] = useState<QuizResult | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(Date.now())

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const startTimer = (seconds: number) => {
    clearTimer()
    setTimeLeft(seconds)
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearTimer()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  useEffect(() => () => clearTimer(), [])

  const pickMolecule = (cfg: QuizConfig, exclude: string[] = []): Molecule => {
    if (cfg.moleculeId === "random") {
      const pool = MOLECULES.filter(m => !exclude.includes(m.id))
      return pool[Math.floor(Math.random() * pool.length)]!
    }
    return MOLECULES.find(m => m.id === cfg.moleculeId) ?? MOLECULES[0]!
  }

  const startQuiz = useCallback((cfg: QuizConfig) => {
    const queue: Molecule[] = []
    const usedIds: string[] = []
    for (let i = 0; i < cfg.totalChallenges; i++) {
      const mol = pickMolecule(cfg, usedIds)
      queue.push(mol)
      usedIds.push(mol.id)
    }
    const t = DIFFICULTY_TIME[cfg.difficulty]
    setConfig(cfg)
    setMoleculeQueue(queue)
    setCurrentMolecule(queue[0]!)
    setChallengIndex(0)
    setPoints(0)
    setStreak(0)
    setAttempts([])
    setPlacedBonds([])
    setHintsUsed(0)
    setFeedback("none")
    setMaxTime(t)
    startTimer(t)
    startTimeRef.current = Date.now()
    setPhase("challenge")
  }, [])

  function setChallengIndex(i: number) { setChallengeIndex(i) }

  const placeBond = useCallback((fromId: string, toId: string, bondType: BondType) => {
    setPlacedBonds(prev => {
      const key1 = `${fromId}-${toId}`
      const key2 = `${toId}-${fromId}`
      const exists = prev.some(b =>
        `${b.fromAtomId}-${b.toAtomId}` === key1 ||
        `${b.fromAtomId}-${b.toAtomId}` === key2
      )
      if (exists) return prev
      return [...prev, { id: uuid(), fromAtomId: fromId, toAtomId: toId, bondType }]
    })
  }, [])

  const removeLastBond = useCallback(() => {
    setPlacedBonds(prev => prev.slice(0, -1))
  }, [])

  const checkBonds = useCallback(() => {
    if (!currentMolecule) return
    const { correctBonds, wrongBonds, missingBonds } = validateBonds(
      placedBonds,
      currentMolecule.connections
    )
    const isCorrect = wrongBonds.length === 0 && missingBonds.length === 0
    const timeTaken = (Date.now() - startTimeRef.current) / 1000
    let earned = 0
    if (isCorrect) {
      if (hintsUsed === 0) earned = getTimerPoints(timeLeft, maxTime)
      else if (hintsUsed === 1) earned = 20
      else earned = 10
    }
    clearTimer()
    setPoints(p => p + earned)
    setStreak(s => isCorrect ? s + 1 : 0)
    setFeedback(isCorrect ? "correct" : "wrong")
    setAttempts(prev => [...prev, {
      moleculeId:   currentMolecule.id,
      moleculeName: currentMolecule.name,
      correct:      correctBonds.length,
      wrong:        wrongBonds.length,
      hints:        hintsUsed,
      timeTaken,
      points:       earned,
      isCorrect,
    }])
    setPhase("result")
  }, [currentMolecule, placedBonds, hintsUsed, timeLeft, maxTime])

  const useHint = useCallback(() => {
    if (!currentMolecule) return null
    const remaining = currentMolecule.connections.filter(c => {
      const k1 = `${c.fromAtomId}-${c.toAtomId}`
      const k2 = `${c.toAtomId}-${c.fromAtomId}`
      return !placedBonds.some(b =>
        `${b.fromAtomId}-${b.toAtomId}` === k1 ||
        `${b.fromAtomId}-${b.toAtomId}` === k2
      )
    })
    if (remaining.length === 0) return null
    const hint = remaining[0]!
    setHintsUsed(h => h + 1)
    return { fromId: hint.fromAtomId, toId: hint.toAtomId }
  }, [currentMolecule, placedBonds])

  const nextChallenge = useCallback(() => {
    if (!config) return
    const next = challengeIndex + 1
    if (next >= config.totalChallenges) {
      // build final result
      const allPoints = attempts.reduce((s, a) => s + a.points, 0)
      const maxPossible = config.totalChallenges * 30
      const pct = Math.round((allPoints / maxPossible) * 100)
      const grade = calculateGrade(pct)
      const totalCorrect = attempts.reduce((s, a) => s + a.correct, 0)
      const totalWrong   = attempts.reduce((s, a) => s + a.wrong, 0)
      const totalHints   = attempts.reduce((s, a) => s + a.hints, 0)
      const totalTime    = attempts.reduce((s, a) => s + a.timeTaken, 0)
      const maxStreak    = Math.max(...attempts.map((_, i, arr) => {
        let streak = 0, max = 0
        for (let j = 0; j <= i; j++) {
          if (arr[j]!.isCorrect) { streak++; max = Math.max(max, streak) }
          else streak = 0
        }
        return max
      }), 0)
      const result: QuizResult = {
        id:              uuid(),
        studentId:       uuid(),
        studentName:     config.studentName,
        score:           pct,
        points:          allPoints,
        grade,
        moleculeId:      moleculeQueue[0]?.id ?? "random",
        moleculeName:    config.moleculeId === "random" ? "Multiple" : (currentMolecule?.name ?? ""),
        difficulty:      config.difficulty,
        completedAt:     new Date().toISOString(),
        timeTaken:       totalTime,
        correctBonds:    totalCorrect,
        wrongBonds:      totalWrong,
        hintsUsed:       totalHints,
        streak:          maxStreak,
        totalChallenges: config.totalChallenges,
      }
      setLastResult(result)
      setPhase("complete")
      return
    }
    const nextMol = moleculeQueue[next]!
    const t = DIFFICULTY_TIME[config.difficulty]
    setChallengeIndex(next)
    setCurrentMolecule(nextMol)
    setPlacedBonds([])
    setHintsUsed(0)
    setFeedback("none")
    setMaxTime(t)
    startTimer(t)
    startTimeRef.current = Date.now()
    setPhase("challenge")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, challengeIndex, moleculeQueue, attempts, points, currentMolecule])

  const resetQuiz = useCallback(() => {
    clearTimer()
    setPhase("setup")
    setConfig(null)
    setChallengeIndex(0)
    setCurrentMolecule(null)
    setPoints(0)
    setStreak(0)
    setAttempts([])
    setPlacedBonds([])
    setHintsUsed(0)
    setFeedback("none")
    setLastResult(null)
  }, [])

  return {
    phase, config, currentMolecule, challengeIndex,
    totalChallenges: config?.totalChallenges ?? 0,
    timeLeft, maxTime, points, streak, attempts,
    placedBonds, hintsUsed, feedback, lastResult,
    startQuiz, placeBond, removeLastBond, checkBonds,
    useHint, nextChallenge, resetQuiz,
  }
}
