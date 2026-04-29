import api from './client'

export const generateLesson = (data)              => api.post('/lessons/generate', data)
export const getLesson      = (lessonId)           => api.get(`/lessons/${lessonId}`)
export const submitAnswer   = (lessonId, data)     => api.post(`/lessons/${lessonId}/submit`, data)
export const completeLesson = (lessonId)           => api.post(`/lessons/${lessonId}/complete`)
