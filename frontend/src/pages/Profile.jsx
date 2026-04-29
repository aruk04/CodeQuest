import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, User, Trophy, Zap, Target, TrendingUp } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useProgressStore } from '../store/progressStore'
import { useNavigate } from 'react-router-dom'
import { getRecentXP } from '../api/progress'
import { changePassword } from '../api/auth'
import XPBar from '../components/XPBar'
import StreakCounter from '../components/StreakCounter'
import ProgressRing from '../components/ProgressRing'
import toast from 'react-hot-toast'

const LANG_LABELS = { python: '🐍 Python', javascript: '⚡ JavaScript', cpp: '⚙️ C++', java: '☕ Java' }
const LEVEL_LABELS = { beginner: '🌱 Beginner', intermediate: '🌿 Intermediate', advanced: '🌳 Advanced' }

export default function Profile() {
  const { user, logout } = useAuthStore()
  const { xp, level, streak, longestStreak, xpToNextLevel, completionPercent, roadmap } = useProgressStore()
  const navigate = useNavigate()
  const [recentXP, setRecentXP] = useState([])
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '' })
  const [isSavingPassword, setIsSavingPassword] = useState(false)

  useEffect(() => {
    getRecentXP().then(res => setRecentXP(res.data)).catch(() => {})
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleSavePassword = async () => {
    if (!passwordForm.current_password || !passwordForm.new_password) {
      return toast.error('Please fill in both fields')
    }
    if (passwordForm.new_password.length < 6) {
      return toast.error('New password must be at least 6 characters')
    }
    setIsSavingPassword(true)
    try {
      await changePassword(passwordForm)
      toast.success('Password updated successfully!')
      setIsChangingPassword(false)
      setPasswordForm({ current_password: '', new_password: '' })
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to change password')
    } finally {
      setIsSavingPassword(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5 page-enter">
      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 border border-white/10 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-500 to-accent-purple
                        flex items-center justify-center text-3xl font-extrabold text-white mx-auto mb-4 glow-green">
          {user?.username?.[0]?.toUpperCase() || '?'}
        </div>
        <h2 className="text-2xl font-bold text-white">{user?.username}</h2>
        <p className="text-slate-400 text-sm">{user?.email}</p>
        <div className="flex items-center justify-center gap-3 mt-3">
          {roadmap?.language && (
            <span className="badge bg-surface-700 text-slate-300 border border-white/10">
              {LANG_LABELS[roadmap.language]}
            </span>
          )}
          {roadmap?.skill_level && (
            <span className="badge bg-surface-700 text-slate-300 border border-white/10">
              {LEVEL_LABELS[roadmap.skill_level] || roadmap.skill_level}
            </span>
          )}
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-5 border border-white/10 flex flex-col items-center">
          <ProgressRing percent={completionPercent} size={80}>
            <span className="text-sm font-bold text-brand-400">Lv{level}</span>
          </ProgressRing>
          <div className="mt-3 text-center">
            <div className="font-bold text-white">{xp.toLocaleString()} XP</div>
            <div className="text-xs text-slate-500">{xpToNextLevel} to next level</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
          className="glass rounded-2xl p-5 border border-white/10 flex flex-col items-center justify-center gap-4">
          <StreakCounter streak={streak} size="lg" />
          <div className="text-center">
            <div className="text-xs text-slate-500">Longest streak</div>
            <div className="font-bold text-orange-400 flex items-center gap-1">
              🔥 {longestStreak} days
            </div>
          </div>
        </motion.div>
      </div>

      {/* XP Bar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-5 border border-white/10">
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-brand-400" /> Level Progress
        </h3>
        <XPBar xp={xp} level={level} xpToNext={xpToNextLevel} completionPercent={completionPercent} />
      </motion.div>

      {/* Recent XP */}
      {recentXP.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          className="glass rounded-2xl p-5 border border-white/10">
          <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent-blue" /> Recent XP Activity
          </h3>
          <div className="space-y-2">
            {recentXP.slice(0, 8).map((tx, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-slate-400 capitalize">{tx.reason.replace('_', ' ')}</span>
                <span className="text-brand-400 font-semibold">+{tx.amount} XP</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Settings (Dummy) */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.26 }}
        className="glass rounded-2xl p-5 border border-white/10">
        <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-brand-400" /> Account Settings
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-500 font-semibold mb-1 block">Email Address</label>
            <div className="flex gap-2">
              <input type="email" value={user?.email || ''} readOnly className="input flex-1 opacity-70" />
              <button className="btn-ghost px-4 text-sm" onClick={() => toast('Change email coming soon!')}>Change</button>
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 font-semibold mb-1 block">Password</label>
            <AnimatePresence mode="wait">
              {!isChangingPassword ? (
                <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-2">
                  <input type="password" value="********" readOnly className="input flex-1 opacity-70" />
                  <button className="btn-ghost px-4 text-sm" onClick={() => setIsChangingPassword(true)}>Change</button>
                </motion.div>
              ) : (
                <motion.div key="edit" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3 bg-surface-800 p-4 rounded-xl border border-white/5 mt-2">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Current Password</label>
                    <input 
                      type="password" 
                      placeholder="Enter current password"
                      value={passwordForm.current_password}
                      onChange={e => setPasswordForm(p => ({ ...p, current_password: e.target.value }))}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">New Password</label>
                    <input 
                      type="password" 
                      placeholder="Enter new password (min 6 chars)"
                      value={passwordForm.new_password}
                      onChange={e => setPasswordForm(p => ({ ...p, new_password: e.target.value }))}
                      className="input w-full"
                    />
                  </div>
                  <div className="flex gap-2 justify-end pt-2">
                    <button 
                      onClick={() => { setIsChangingPassword(false); setPasswordForm({ current_password: '', new_password: '' }); }}
                      className="btn-ghost px-4 py-1.5 text-sm"
                      disabled={isSavingPassword}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSavePassword}
                      className="btn-primary px-4 py-1.5 text-sm"
                      disabled={isSavingPassword}
                    >
                      {isSavingPassword ? 'Saving...' : 'Save Password'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Regain Streak (Dummy) */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}
        className="glass rounded-2xl p-5 border border-amber-500/20 bg-amber-500/5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-amber-400 mb-1 flex items-center gap-2">
              🔥 Regain Lost Streak
            </h3>
            <p className="text-xs text-slate-400">Missed a day? Use a Streak Freeze to save your progress!</p>
          </div>
          <button 
            onClick={() => toast.success('💳 Payment portal coming soon!')}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center glow-amber hover:scale-105 transition-transform"
            title="Buy Streak Freeze"
          >
            <span className="text-lg">💳</span>
          </button>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-5 border border-red-500/20 bg-red-500/5">
        <h3 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
          <LogOut className="w-4 h-4" /> Danger Zone
        </h3>
        <button onClick={handleLogout} className="btn-ghost w-full border border-red-500/50 text-red-400 hover:bg-red-500/10">
          Log Out
        </button>
      </motion.div>
    </div>
  )
}
