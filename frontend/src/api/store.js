import api from './client'

export const buyHint = () => {
  return api.post('/store/buy-hint')
}

export const buyTheme = (themeId) => {
  return api.post('/store/buy-theme', { theme_id: themeId })
}

export const setTheme = (themeId) => {
  return api.post('/store/set-theme', { theme_id: themeId })
}
