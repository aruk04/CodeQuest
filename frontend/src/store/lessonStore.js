import { create } from 'zustand'

export const useLessonStore = create((set) => ({
  currentLesson: null,
  currentExerciseIndex: 0,
  answers: {},
  results: {},
  isComplete: false,
  score: 0,

  setLesson: (lesson) =>
    set({
      currentLesson: lesson,
      currentExerciseIndex: 0,
      answers: {},
      results: {},
      isComplete: false,
      score: 0,
    }),

  setAnswer: (exerciseId, answer) =>
    set((state) => ({ answers: { ...state.answers, [exerciseId]: answer } })),

  setResult: (exerciseId, result) =>
    set((state) => ({
      results: { ...state.results, [exerciseId]: result },
    })),

  nextExercise: () =>
    set((state) => ({
      currentExerciseIndex: state.currentExerciseIndex + 1,
    })),

  setComplete: (score) => set({ isComplete: true, score }),

  reset: () =>
    set({
      currentLesson: null,
      currentExerciseIndex: 0,
      answers: {},
      results: {},
      isComplete: false,
      score: 0,
    }),
}))
