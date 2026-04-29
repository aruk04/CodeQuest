import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, MessageSquare } from 'lucide-react';

const EMOTIONS = {
  idle: { emoji: '🤖', color: 'bg-slate-700' },
  thinking: { emoji: '🤔', color: 'bg-accent-blue' },
  happy: { emoji: '😊', color: 'bg-brand-500' },
  worried: { emoji: '😟', color: 'bg-amber-500' },
  celebrating: { emoji: '🥳', color: 'bg-accent-purple' },
};

export default function Mascot({ message, emotion = 'idle', direction = 'neutral' }) {
  const currentEmotion = EMOTIONS[emotion] || EMOTIONS.idle;

  return (
    <div className="flex items-start gap-4 p-4">
      <div className="relative">
        <motion.div
          animate={{
            y: [0, -4, 0],
            rotate: emotion === 'celebrating' ? [0, 5, -5, 0] : 0,
            scale: emotion === 'thinking' ? [1, 1.05, 1] : 1,
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut"
          }}
          className={`w-16 h-16 rounded-2xl ${currentEmotion.color} flex items-center justify-center text-3xl shadow-lg border-2 border-white/10 relative z-10`}
        >
          {currentEmotion.emoji}
          
          {/* Decorative glow */}
          <div className={`absolute inset-0 rounded-2xl blur-xl opacity-30 ${currentEmotion.color}`} />
        </motion.div>

        {/* Status indicator */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-surface-900 flex items-center justify-center
            ${direction === 'right' ? 'bg-brand-500' : direction === 'wrong' ? 'bg-red-500' : 'bg-slate-500'}`}
        >
          {direction === 'right' && <span className="text-[10px] text-white">✓</span>}
          {direction === 'wrong' && <span className="text-[10px] text-white">!</span>}
        </motion.div>
      </div>

      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={message}
            initial={{ opacity: 0, x: -10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            className="relative bg-surface-800 border border-white/10 rounded-2xl p-4 shadow-xl"
          >
            {/* Speech bubble tail */}
            <div className="absolute top-4 -left-2 w-4 h-4 bg-surface-800 border-l border-b border-white/10 rotate-45" />
            
            <div className="flex items-start gap-2">
              <MessageSquare className="w-4 h-4 text-brand-400 mt-1 flex-shrink-0" />
              <p className="text-sm text-slate-200 leading-relaxed font-medium italic">
                "{message}"
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
