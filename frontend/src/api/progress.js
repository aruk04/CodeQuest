import api from './client'

export const getProgressSummary = () => api.get('/progress/summary')
export const getStreak          = () => api.get('/progress/streak')
export const getWeakAreas       = () => api.get('/progress/weak-areas')
export const getRecentXP        = () => api.get('/progress/recent-xp')
export const markChallengeSolved = (data) => api.post('/progress/solved-challenge', data)
