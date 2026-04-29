import api from './client'

export const generateRoadmap      = (data) => api.post('/roadmap/generate', data)
export const getMyRoadmap         = ()     => api.get('/roadmap/me')
export const getNextLesson        = ()     => api.get('/roadmap/next-lesson')
export const getAvailableRoadmaps = ()     => api.get('/roadmap/available')
export const switchRoadmap        = (data) => api.post('/roadmap/switch', data)
export const getAllRoadmaps       = ()     => api.get('/roadmap/all')
export const setActiveRoadmap     = (id)   => api.post(`/roadmap/set-active/${id}`)
