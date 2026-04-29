import api from './client'

export const register = (data) => api.post('/auth/register', data)
export const login    = (data) => api.post('/auth/login', data)
export const getMe   = ()     => api.get('/users/me')
export const changePassword = (data) => api.put('/users/password', data)
