import React from 'react'
import { motion } from 'framer-motion'

export default function StreakCounter({ streak, size = 'md' }) {
  const sizes = {
    sm: { wrap: 'gap-1.5', emoji: 'text-xl', num: 'text-lg', label: 'text-xs' },
    md: { wrap: 'gap-2',   emoji: 'text-3xl', num: 'text-2xl', label: 'text-sm' },
    lg: { wrap: 'gap-3',   emoji: 'text-5xl', num: 'text-4xl', label: 'text-base' },
  }
  const s = sizes[size]

  return (
    <div className={`flex items-center ${s.wrap}`}>
      <motion.span
        className={`streak-flame ${s.emoji} select-none`}
        animate={streak > 0 ? { scale: [1, 1.15, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        🔥
      </motion.span>
      <div>
        <div className={`font-extrabold text-orange-400 leading-none ${s.num}`}>
          {streak}
        </div>
        <div className={`text-slate-500 ${s.label}`}>
          {streak === 1 ? 'day streak' : 'day streak'}
        </div>
      </div>
    </div>
  )
}
