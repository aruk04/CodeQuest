import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Map, Code2, User, Bot, Zap, ShoppingBag, Layers } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useProgressStore } from '../store/progressStore'
import { useAIStore } from '../store/aiStore'
import XPBar from './XPBar'
import StreakCounter from './StreakCounter'

const NAV_ITEMS = [
  { to: '/dashboard', icon: Home,  label: 'Home' },
  { to: '/roadmap',   icon: Map,   label: 'Roadmap' },
  { to: '/code',      icon: Code2, label: 'Code Lab' },
  { to: '/visualize', icon: Layers, label: 'Visualize' },
  { to: '/store',     icon: ShoppingBag, label: 'Store' },
  { to: '/profile',   icon: User,  label: 'Profile' },
]

export default function Navbar() {
  const location = useLocation()
  const { user } = useAuthStore()
  const { xp, level, xpToNextLevel, completionPercent, streak } = useProgressStore()
  const { togglePanel } = useAIStore()

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-surface-900/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center glow-green">
            <Zap className="w-4 h-4 text-white fill-current" />
          </div>
          <span className="font-extrabold text-white text-lg tracking-tight">
            Code<span className="text-brand-400">Quest</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 ml-4">
          {NAV_ITEMS.filter(item => !['Home', 'Profile'].includes(item.label)).map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 text-sm font-semibold transition-colors
                  ${active ? 'text-brand-400' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* XP Bar (desktop) */}
        <div className="hidden md:block flex-1 max-w-xs ml-auto">
          <XPBar xp={xp} level={level} xpToNext={xpToNextLevel} completionPercent={completionPercent} />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <StreakCounter streak={streak} size="sm" />

          {/* AI Tutor Button */}
          <button
            onClick={togglePanel}
            className="relative w-9 h-9 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue
                       flex items-center justify-center hover:scale-110 transition-transform glow-purple"
            title="AI Tutor"
          >
            <Bot className="w-4 h-4 text-white" />
          </button>

          {/* Avatar */}
          <Link 
            to="/profile"
            className="w-9 h-9 rounded-full bg-gradient-to-br from-surface-600 to-surface-700
                       flex items-center justify-center border border-white/20 hover:scale-105 hover:border-brand-500/50 transition-all cursor-pointer"
            title="Profile"
          >
            <span className="text-sm font-bold text-white">
              {user?.username?.[0]?.toUpperCase() || '?'}
            </span>
          </Link>
        </div>
      </div>

      {/* Bottom nav (mobile) */}
      <nav className="md:hidden flex border-t border-white/10">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={`flex-1 flex flex-col items-center py-2.5 text-xs font-medium transition-colors
                ${active ? 'text-brand-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${active ? 'text-brand-400' : ''}`} />
              {label}
              {active && (
                <motion.div layoutId="nav-dot" className="w-1 h-1 rounded-full bg-brand-400 mt-0.5" />
              )}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
