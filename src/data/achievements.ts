export interface Achievement {
  id:          string
  icon:        string
  title:       string
  description: string
  condition:   string
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id:          "first_experiment",
    icon:        "🔬",
    title:       "First Experiment",
    description: "Complete your first quiz",
    condition:   "Complete 1 quiz",
  },
  {
    id:          "chemist",
    icon:        "⚗️",
    title:       "Chemist",
    description: "Score 80% or higher on any quiz",
    condition:   "Score ≥80% on any quiz",
  },
  {
    id:          "lab_expert",
    icon:        "🧪",
    title:       "Lab Expert",
    description: "Complete 5 quizzes",
    condition:   "Complete 5 quizzes",
  },
  {
    id:          "valence_master",
    icon:        "💎",
    title:       "Valence Master",
    description: "Score 100% on any quiz",
    condition:   "Score 100% on any quiz",
  },
  {
    id:          "on_fire",
    icon:        "🔥",
    title:       "On Fire",
    description: "Get 3 consecutive perfect bond sets",
    condition:   "Streak ≥3 in one quiz",
  },
  {
    id:          "scholar",
    icon:        "🌟",
    title:       "Scholar",
    description: "Average 90%+ across 3 or more quizzes",
    condition:   "Avg ≥90% over 3 quizzes",
  },
  {
    id:          "bond_master",
    icon:        "🧲",
    title:       "Bond Master",
    description: "Try all difficulty levels",
    condition:   "Complete easy, medium, and hard",
  },
  {
    id:          "speed_demon",
    icon:        "⚡",
    title:       "Speed Demon",
    description: "Finish any challenge in under 10 seconds",
    condition:   "Solve a challenge in <10s",
  },
  {
    id:          "perfectionist",
    icon:        "🎯",
    title:       "Perfectionist",
    description: "Complete an entire quiz with zero wrong bonds",
    condition:   "Zero wrong bonds in a quiz",
  },
  {
    id:          "molecule_builder",
    icon:        "🧬",
    title:       "Molecule Builder",
    description: "Save 5 molecules in Free Play",
    condition:   "Save 5 free-play molecules",
  },
]
