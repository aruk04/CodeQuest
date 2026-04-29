import api from './client'

export const explainConcept = (data) => api.post('/ai/explain', data)
export const getHint        = (data) => api.post('/ai/hint', data)
export const getFeedback    = (data) => api.post('/ai/feedback', data)
export const debugCode      = (data) => api.post('/ai/debug', data)
export const chatWithTutor    = (data) => api.post('/ai/chat', data)
export const getMascotFeedback = (data) => api.post('/ai/mascot-feedback', data)
