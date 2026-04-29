import api from './client'

export const runCode      = (data) => api.post('/code/run', data)
export const validateCode = (data) => api.post('/code/validate', data)
