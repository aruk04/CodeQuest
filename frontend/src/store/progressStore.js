import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useProgressStore = create(
  persist(
    (set) => ({
      xp: 0,
      level: 1,
      streak: 0,
      longestStreak: 0,
      totalLessonsCompleted: 0,
      xpToNextLevel: 500,
      completionPercent: 0,
      solvedChallenges: [],
      weakAreas: [],
      roadmap: null,

      setProgress: (data) =>
        set({
          xp: data.xp,
          level: data.level,
          streak: data.streak,
          longestStreak: data.longest_streak,
          totalLessonsCompleted: data.total_lessons_completed,
          xpToNextLevel: data.xp_to_next_level,
          completionPercent: data.completion_percent,
          solvedChallenges: data.solved_challenges || [],
        }),

      setWeakAreas: (areas) => set({ weakAreas: areas }),

      setRoadmap: (roadmap) => set({ roadmap }),
      
      addSolvedChallenge: (challengeId) =>
        set((state) => ({
          solvedChallenges: [...state.solvedChallenges, challengeId]
        })),

      addXP: (amount) =>
        set((state) => {
          const newXp = state.xp + amount
          const newLevel = Math.max(1, Math.floor(newXp / 500) + 1)
          return {
            xp: newXp,
            level: newLevel,
            xpToNextLevel: (newLevel * 500) - newXp,
            completionPercent: ((newXp % 500) / 500) * 100,
          }
        }),
    }),
    {
      name: 'codequest-progress',
    }
  )
)
