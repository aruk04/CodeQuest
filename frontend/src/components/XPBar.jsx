import React from 'react'
import { motion } from 'framer-motion'

export default function XPBar({ xp, level, xpToNext, completionPercent }) {
  return (
    <div className="flex items-center gap-3 w-full">
      {/* Level Badge */}
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-400
                      flex items-center justify-center text-sm font-bold text-white glow-green">
        {level}
      </div>

      {/* Bar */}
      <div className="flex-1">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span className="font-semibold text-brand-400">{xp.toLocaleString()} XP</span>
          <span>{xpToNext} to next level</span>
        </div>
        <div className="h-3 bg-surface-700 rounded-full overflow-hidden border border-white/5">
          <motion.div
            className="h-full xp-bar-fill rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(completionPercent, 100)}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  )
}
