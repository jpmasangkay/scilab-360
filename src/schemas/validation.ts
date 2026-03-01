import { z } from "zod"

export const StudentSchema = z.object({
  id:        z.string().uuid(),
  name:      z.string()
    .min(2, "At least 2 characters required")
    .max(50, "Max 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Letters and spaces only"),
  createdAt: z.string().datetime(),
})

export const QuizResultSchema = z.object({
  id:              z.string().uuid(),
  studentId:       z.string().uuid(),
  studentName:     z.string().min(1),
  score:           z.number().min(0).max(100),
  points:          z.number().min(0),
  grade:           z.enum(["A","B","C","D","F"]),
  moleculeId:      z.string(),
  moleculeName:    z.string(),
  difficulty:      z.enum(["easy","medium","hard"]),
  completedAt:     z.string().datetime(),
  timeTaken:       z.number().positive(),
  correctBonds:    z.number().min(0),
  wrongBonds:      z.number().min(0),
  hintsUsed:       z.number().min(0),
  streak:          z.number().min(0),
  totalChallenges: z.number().min(1),
})

export const BondAttemptSchema = z.object({
  moleculeId: z.string(),
  fromAtomId: z.string(),
  toAtomId:   z.string(),
  bondType:   z.enum(["single","double","triple","ionic","coordinate","metallic","hydrogen"]),
  isCorrect:  z.boolean(),
  timeMs:     z.number().min(0),
})

export const FreeMoleculeSchema = z.object({
  id:      z.string(),
  name:    z.string().min(1).max(100),
  atoms:   z.array(z.object({
    id:     z.string(),
    symbol: z.string(),
    x:      z.number(),
    y:      z.number(),
    color:  z.string(),
  })),
  bonds:   z.array(z.object({
    id:     z.string(),
    fromId: z.string(),
    toId:   z.string(),
    type:   z.enum(["single","double","triple","ionic","coordinate","metallic","hydrogen"]),
  })),
  savedAt: z.string().datetime(),
})

// Safe localStorage parsers
export const safeParseScores = (raw: unknown) => {
  const r = QuizResultSchema.array().safeParse(raw)
  return r.success ? r.data : []
}

export const safeParseMolecules = (raw: unknown) => {
  const r = FreeMoleculeSchema.array().safeParse(raw)
  return r.success ? r.data : []
}

export const safeParseStudent = (raw: unknown) => {
  const r = StudentSchema.safeParse(raw)
  return r.success ? r.data : null
}

// Name validation helper
export const validateStudentName = (name: string) => {
  const result = StudentSchema.shape.name.safeParse(name)
  return result.success ? null : result.error.issues[0]?.message ?? "Invalid name"
}
