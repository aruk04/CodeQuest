import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb } from 'lucide-react'
import { submitAnswer } from '../api/lessons'
import { useProgressStore } from '../store/progressStore'
import toast from 'react-hot-toast'

export default function ExerciseBlock({ exercise, lessonId, onResult, language }) {
  const [selected, setSelected] = useState(null)
  const [codeAnswer, setCodeAnswer] = useState(exercise.starter_code || '')
  const [fillAnswer, setFillAnswer] = useState('')
  const [result, setResult] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const addXP = useProgressStore((s) => s.addXP)

  const getAnswer = () => {
    if (exercise.type === 'mcq' || exercise.type === 'true_false') return selected
    if (exercise.type === 'fill_in') return fillAnswer
    if (exercise.type === 'code_challenge') return codeAnswer
    return selected
  }

  const handleSubmit = async () => {
    const answer = getAnswer()
    if (!answer) return toast.error('Please provide an answer')

    setIsLoading(true)
    try {
      const res = await submitAnswer(lessonId, {
        exercise_id: exercise.id,
        answer,
        time_spent_seconds: 30,
      })
      setResult(res.data)
      if (res.data.correct) addXP(res.data.xp_earned)
      onResult?.(res.data)
    } catch (e) {
      toast.error('Failed to submit answer')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Question */}
      <div className="glass rounded-2xl p-5 border border-white/10">
        <div className="flex items-start justify-between gap-3 mb-4">
          <p className="text-white font-medium text-base leading-relaxed">{exercise.question}</p>
          <span className="flex-shrink-0 text-xs bg-accent-purple/20 text-purple-300 px-2.5 py-1 rounded-lg font-semibold capitalize">
            {exercise.type.replace('_', ' ')}
          </span>
        </div>

        {/* MCQ Options */}
        {exercise.type === 'mcq' && !result && (
          <div className="space-y-2">
            {exercise.options?.map((opt) => (
              <button
                key={opt}
                onClick={() => setSelected(opt)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-150 text-sm font-medium
                  ${selected === opt
                    ? 'border-brand-500 bg-brand-500/20 text-brand-300'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/25 hover:bg-white/10'
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Fill in */}
        {exercise.type === 'fill_in' && !result && (
          <input
            className="input"
            placeholder="Type your answer..."
            value={fillAnswer}
            onChange={(e) => setFillAnswer(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
        )}

        {/* Code challenge */}
        {exercise.type === 'code_challenge' && !result && (
          <textarea
            className="input font-mono text-sm resize-none"
            rows={6}
            value={codeAnswer}
            onChange={(e) => setCodeAnswer(e.target.value)}
            spellCheck={false}
          />
        )}

        {/* True/False */}
        {exercise.type === 'true_false' && !result && (
          <div className="flex gap-3">
            {['True', 'False'].map((opt) => (
              <button
                key={opt}
                onClick={() => setSelected(opt)}
                className={`flex-1 py-3 rounded-xl border transition-all text-sm font-semibold
                  ${selected === opt
                    ? (opt === 'True' ? 'border-brand-500 bg-brand-500/20 text-brand-300' : 'border-red-500 bg-red-500/20 text-red-300')
                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/25'
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Result feedback */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-xl p-4 mt-3 ${result.correct ? 'feedback-correct' : 'feedback-wrong'}`}
            >
              <div className={`font-bold text-lg mb-1 ${result.correct ? 'text-brand-400' : 'text-red-400'}`}>
                {result.correct ? '✅ Correct! +' + result.xp_earned + ' XP' : '❌ Not quite...'}
              </div>
              <p className="text-sm text-slate-300">{result.explanation}</p>
              {!result.correct && result.correct_answer && (
                <p className="text-sm text-slate-400 mt-2">
                  <span className="text-brand-400 font-semibold">Answer: </span>{result.correct_answer}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowHint(!showHint)}
          className="btn-ghost text-xs flex items-center gap-1.5"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          {showHint ? 'Hide hint' : 'Show hint'}
        </button>

        {!result ? (
          <button
            onClick={handleSubmit}
            disabled={isLoading || !getAnswer()}
            className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Checking...' : 'Check Answer'}
          </button>
        ) : !result.correct ? (
          <button
            onClick={() => setResult(null)}
            className="btn-ghost px-6 flex items-center gap-1.5 glow-red border-red-500/50 hover:bg-red-500/10 text-red-400"
          >
            Try Again
          </button>
        ) : null}
      </div>

      {/* Hint */}
      <AnimatePresence>
        {showHint && exercise.hint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass rounded-xl p-3 border border-amber-500/20 bg-amber-500/5 text-sm text-slate-300"
          >
            <span className="text-amber-400 font-semibold">💡 Hint: </span>
            {exercise.hint}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
