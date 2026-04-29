import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Zap, Palette, CheckCircle, Lock } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { buyHint, buyTheme, setTheme } from '../api/store'
import { getMe } from '../api/auth'
import { getProgressSummary } from '../api/progress'
import { useProgressStore } from '../store/progressStore'
import toast from 'react-hot-toast'

export const THEMES = [
  { id: 'vs-dark', name: 'Default Dark', cost: 0, preview: 'bg-slate-900', color: 'text-slate-300' },
  { id: 'dracula', name: 'Dracula', cost: 10, preview: 'bg-[#282a36]', color: 'text-[#ff79c6]' },
  { id: 'monokai', name: 'Monokai', cost: 10, preview: 'bg-[#272822]', color: 'text-[#f92672]' },
  { id: 'synthwave', name: 'Synthwave Glow', cost: 10, preview: 'bg-[#2b213a]', color: 'text-[#f92aad]' }
]

export default function Store() {
  const { user, updateUser } = useAuthStore()
  const { xp, setProgress } = useProgressStore()
  const profile = user?.profile
  const [loading, setLoading] = useState(false)

  const syncAll = async () => {
    try {
      const [authRes, progRes] = await Promise.all([
        getMe(),
        getProgressSummary()
      ])
      updateUser(authRes.data)
      setProgress(progRes.data)
    } catch (e) {
      console.error(e)
    }
  }

  const handleBuyHint = async () => {
    if (xp < 50) return toast.error('Not enough XP!')
    setLoading(true)
    try {
      await buyHint()
      await syncAll()
      toast.success('Bought 1 Bonus AI Hint!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to buy hint')
    } finally {
      setLoading(false)
    }
  }

  const handleBuyTheme = async (themeId) => {
    if (xp < 10) return toast.error('Not enough XP!')
    setLoading(true)
    try {
      await buyTheme(themeId)
      await syncAll()
      toast.success('Theme unlocked! It is now active.')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to buy theme')
    } finally {
      setLoading(false)
    }
  }

  const handleSetTheme = async (themeId) => {
    setLoading(true)
    try {
      await setTheme(themeId)
      await syncAll()
      toast.success('Theme applied!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to apply theme')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 page-enter max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 border border-brand-500/30 bg-gradient-to-br from-brand-500/10 to-surface-900 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-purple/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        
        <ShoppingBag className="w-12 h-12 text-brand-400 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-white mb-2">XP Store</h1>
        <p className="text-slate-400">Spend your hard-earned XP on premium rewards!</p>
        
        <div className="mt-6 inline-flex items-center gap-3 bg-surface-900/80 px-6 py-3 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md">
          <span className="text-slate-400 font-semibold">Your Balance:</span>
          <span className="text-2xl font-black text-brand-400">{xp || 0} XP</span>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Boosts */}
        <section>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-amber-400" /> Boosts
          </h2>
          <div className="glass rounded-2xl p-6 border border-white/5 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mb-4 border border-amber-500/30">
              <Zap className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Bonus AI Hint</h3>
            <p className="text-sm text-slate-400 mb-6">Stuck on a bug? Buy an extra AI Debug token to help you out.</p>
            
            <div className="flex items-center justify-between w-full mt-auto">
              <div className="text-left">
                <div className="text-xs text-slate-500 font-semibold">COST</div>
                <div className="text-xl font-black text-amber-400">50 XP</div>
              </div>
              <button 
                onClick={handleBuyHint}
                disabled={loading || profile?.xp < 50}
                className="btn-primary bg-amber-500 hover:bg-amber-400 text-surface-900 px-6 py-2 rounded-xl font-bold disabled:opacity-50"
              >
                Buy Hint
              </button>
            </div>
            <div className="w-full text-left mt-4 text-xs text-slate-500 bg-surface-800/50 p-3 rounded-lg border border-white/5">
              You currently have <strong className="text-white">{profile?.bonus_hints || 0}</strong> bonus hints available.
            </div>
          </div>
        </section>

        {/* Editor Themes */}
        <section>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-accent-purple" /> Editor Themes
          </h2>
          <div className="grid gap-3">
            {THEMES.map(theme => {
              const isUnlocked = profile?.unlocked_themes?.includes(theme.id) || theme.cost === 0
              const isActive = profile?.active_theme === theme.id

              return (
                <div key={theme.id} className={`glass rounded-2xl p-4 border transition-all flex items-center justify-between
                  ${isActive ? 'border-brand-500 bg-brand-500/5 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'border-white/5 hover:border-white/10'}`}>
                  
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl ${theme.preview} border border-white/10 flex items-center justify-center`}>
                      <span className={`text-xl ${theme.color}`}>{'{}'}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{theme.name}</h3>
                      {!isUnlocked && <div className="text-xs font-semibold text-accent-purple">{theme.cost} XP</div>}
                    </div>
                  </div>

                  <div>
                    {isActive ? (
                      <div className="flex items-center gap-1.5 text-brand-400 text-sm font-bold bg-brand-400/10 px-3 py-1.5 rounded-lg">
                        <CheckCircle className="w-4 h-4" /> Active
                      </div>
                    ) : isUnlocked ? (
                      <button onClick={() => handleSetTheme(theme.id)} disabled={loading}
                        className="px-4 py-1.5 rounded-lg border border-white/20 text-sm font-semibold hover:bg-white/10 transition-colors">
                        Equip
                      </button>
                    ) : (
                      <button onClick={() => handleBuyTheme(theme.id)} disabled={loading || profile?.xp < theme.cost}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-accent-purple hover:bg-accent-purple/90 text-white text-sm font-bold transition-colors disabled:opacity-50">
                        <Lock className="w-4 h-4" /> Buy
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
