import React from 'react'
import { motion } from 'framer-motion'
import { Lock, CheckCircle2, Clock, Zap } from 'lucide-react'

const STATUS_CONFIG = {
  locked: {
    border: 'border-white/10',
    bg: 'bg-surface-800/40',
    iconBg: 'bg-surface-700',
    textColor: 'text-slate-500',
    badge: { text: 'Locked', color: 'text-slate-500 bg-slate-800' },
    cursor: 'cursor-not-allowed',
    glow: '',
    icon: <Lock className="w-4 h-4 text-slate-600" />,
  },
  unlocked: {
    border: 'border-brand-500/40',
    bg: 'bg-surface-800/80',
    iconBg: 'bg-brand-500/20',
    textColor: 'text-white',
    badge: { text: 'Start', color: 'text-brand-400 bg-brand-500/20' },
    cursor: 'cursor-pointer',
    glow: 'glow-green',
    icon: <Zap className="w-4 h-4 text-brand-400" />,
  },
  in_progress: {
    border: 'border-accent-blue/40',
    bg: 'bg-surface-800/80',
    iconBg: 'bg-accent-blue/20',
    textColor: 'text-white',
    badge: { text: 'Continue', color: 'text-blue-400 bg-blue-500/20' },
    cursor: 'cursor-pointer',
    glow: 'glow-blue',
    icon: <Clock className="w-4 h-4 text-blue-400" />,
  },
  completed: {
    border: 'border-brand-500/60',
    bg: 'bg-brand-500/10',
    iconBg: 'bg-brand-500/30',
    textColor: 'text-white',
    badge: { text: 'Done ✓', color: 'text-brand-300 bg-brand-500/20' },
    cursor: 'cursor-pointer',
    glow: '',
    icon: <CheckCircle2 className="w-4 h-4 text-brand-400" />,
  },
}

export default function LessonCard({ node, onClick, index = 0 }) {
  const config = STATUS_CONFIG[node.status] || STATUS_CONFIG.locked
  const isClickable = node.status !== 'locked'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={isClickable ? onClick : undefined}
      className={`
        relative flex items-center gap-4 p-4 rounded-2xl border glass
        ${config.border} ${config.bg} ${config.cursor} ${config.glow}
        transition-all duration-200
        ${isClickable ? 'hover:scale-[1.02] hover:border-opacity-80 glass-hover' : 'opacity-50'}
      `}
    >
      {/* Icon */}
      <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${config.iconBg}
                       flex items-center justify-center text-2xl border border-white/5`}>
        {node.status === 'locked' ? '🔒' : node.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className={`font-semibold truncate ${config.textColor}`}>{node.title}</h3>
          {config.icon}
        </div>
        <p className="text-xs text-slate-500 truncate">{node.description}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Clock className="w-3 h-3" /> {node.estimated_minutes}m
          </span>
          <span className="text-xs text-amber-400 flex items-center gap-1">
            ⚡ {node.xp_reward} XP
          </span>
          {node.tags?.slice(0, 2).map((tag) => (
            <span key={tag} className="text-xs bg-white/5 text-slate-400 px-1.5 py-0.5 rounded-md">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Status Badge */}
      <div className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-lg ${config.badge.color}`}>
        {config.badge.text}
      </div>
    </motion.div>
  )
}
