import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Brain, Zap, Globe, Cpu } from 'lucide-react'

const TIPS = [
  "Analyzing your skill level...",
  "Curating the best lessons for you...",
  "Synthesizing personalized learning nodes...",
  "Integrating AI tutoring patterns...",
  "Optimizing your learning path...",
  "Preparing interactive exercises...",
]

export default function GenerationLoader({ isOpen }) {
  const [tipIdx, setTipIdx] = useState(0)

  useEffect(() => {
    if (!isOpen) return
    const interval = setInterval(() => {
      setTipIdx(prev => (prev + 1) % TIPS.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-surface-950/95 backdrop-blur-xl flex flex-col items-center justify-center text-center px-6"
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -top-1/4 -left-1/4 w-full h-full bg-brand-500/20 rounded-full blur-[120px]"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [0, -90, 0],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-accent-purple/20 rounded-full blur-[120px]"
            />
          </div>

          <div className="relative">
            {/* Central Icon Animation */}
            <div className="relative w-32 h-32 mb-12">
               <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-brand-500/30"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 rounded-full border-2 border-dotted border-accent-purple/30"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    filter: ["drop-shadow(0 0 0px #3b82f6)", "drop-shadow(0 0 20px #3b82f6)", "drop-shadow(0 0 0px #3b82f6)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 bg-gradient-to-br from-brand-500 to-accent-blue rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <Brain className="w-8 h-8 text-white" />
                </motion.div>
              </div>

              {/* Orbiting Icons */}
              {[Globe, Zap, Cpu, Sparkles].map((Icon, i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 pointer-events-none"
                >
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-surface-800 border border-white/10 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Icon className="w-4 h-4 text-brand-400" />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white mb-4 tracking-tight"
          >
            Generating Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-blue">CodeQuest</span>
          </motion.h2>

          <div className="h-8 mb-8 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={tipIdx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-slate-400 font-medium"
              >
                {TIPS[tipIdx]}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 15, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-brand-500 to-accent-purple"
            />
          </div>
          
          <p className="mt-4 text-[10px] text-slate-600 uppercase tracking-[0.2em]">
            This usually takes about 10-15 seconds
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
