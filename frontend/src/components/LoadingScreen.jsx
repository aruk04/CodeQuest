import React from 'react'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

export default function LoadingScreen({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen bg-surface-950 bg-mesh flex flex-col items-center justify-center gap-6">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600
                   flex items-center justify-center glow-green"
      >
        <Zap className="w-8 h-8 text-white fill-current" />
      </motion.div>
      <div className="text-center">
        <p className="text-slate-300 font-medium">{message}</p>
        <div className="flex gap-1.5 justify-center mt-3">
          {[0,1,2].map(i => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-brand-500"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, delay: i * 0.2, duration: 0.8 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
