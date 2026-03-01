export type Difficulty = "easy" | "medium" | "hard"
export type Grade      = "A" | "B" | "C" | "D" | "F"

export interface QuizResult {
  id:              string
  studentId:       string
  studentName:     string
  score:           number
  points:          number
  grade:           Grade
  moleculeId:      string
  moleculeName:    string
  difficulty:      Difficulty
  completedAt:     string
  timeTaken:       number
  correctBonds:    number
  wrongBonds:      number
  hintsUsed:       number
  streak:          number
  totalChallenges: number
}

export interface Student {
  id:        string
  name:      string
  createdAt: string
}

export type QuizPhase =
  | "setup"
  | "challenge"
  | "result"
  | "complete"

export interface QuizConfig {
  studentName:     string
  difficulty:      Difficulty
  moleculeId:      string | "random"
  totalChallenges: number
}
