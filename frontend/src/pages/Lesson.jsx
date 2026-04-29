import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Bot, CheckCircle, Zap, BookOpen, Code2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getLesson, completeLesson } from '../api/lessons'
import { useProgressStore } from '../store/progressStore'
import { useAIStore } from '../store/aiStore'
import ExerciseBlock from '../components/ExerciseBlock'
import LoadingScreen from '../components/LoadingScreen'
import toast from 'react-hot-toast'

const TABS = ['Theory', 'Exercises']

export default function Lesson() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state } = useLocation()
  const { addXP } = useProgressStore()
  const { openPanel } = useAIStore()

  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('Theory')
  const [currentExIdx, setCurrentExIdx] = useState(0)
  const [results, setResults] = useState({})
  const [isCompleting, setIsCompleting] = useState(false)
  const [showComplete, setShowComplete] = useState(false)

  useEffect(() => {
    getLesson(id)
      .then(res => setLesson(res.data))
      .catch(() => toast.error('Lesson not found'))
      .finally(() => setLoading(false))
  }, [id])

  const exercises = lesson?.exercises || []
  const currentEx = exercises[currentExIdx]
  const allAnswered = exercises.length > 0 && exercises.every(ex => results[ex.id])

  const handleResult = (result) => {
    setResults(prev => ({ ...prev, [currentEx.id]: result }))
  }

  const handleComplete = async () => {
    setIsCompleting(true)
    try {
      const res = await completeLesson(id)
      addXP(res.data.xp_earned)
      setShowComplete(true)
    } catch {
      toast.error('Failed to mark lesson complete')
    } finally {
      setIsCompleting(false)
    }
  }

  if (loading) return <LoadingScreen message="Loading lesson..." />
  if (!lesson) return <div className="text-center py-20 text-slate-400">Lesson not found.</div>

  if (showComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 page-enter">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="text-8xl"
        >🎉</motion.div>
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Lesson Complete!</h2>
          <p className="text-slate-400">You earned <span className="text-brand-400 font-bold">+{lesson.xp_reward} XP</span></p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/roadmap')} className="btn-primary px-6 py-3">
            Next Lesson <ChevronRight className="w-4 h-4" />
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn-ghost px-6 py-3">
            Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5 page-enter">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <button onClick={() => navigate('/roadmap')} className="text-slate-500 hover:text-slate-300 text-sm flex items-center gap-1 mb-2">
            <ChevronLeft className="w-4 h-4" /> Roadmap
          </button>
          <h1 className="text-xl font-bold text-white">{lesson.title}</h1>
          <div className="flex items-center gap-3 mt-1.5">
            <span className={`badge capitalize text-xs font-semibold
              ${lesson.difficulty === 'easy' ? 'bg-brand-500/20 text-brand-400'
              : lesson.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400'
              : 'bg-red-500/20 text-red-400'}`}>
              {lesson.difficulty}
            </span>
            <span className="text-xs text-slate-500">⚡ {lesson.xp_reward} XP</span>
            <span className="text-xs text-slate-500">🕐 ~{lesson.estimated_minutes} min</span>
          </div>
        </div>
        <button onClick={() => openPanel(lesson.title)} title="Ask AI Tutor"
          className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue
                     flex items-center justify-center hover:scale-110 transition-transform glow-purple flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </button>
      </motion.div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 gap-1">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-colors flex items-center gap-1.5
              ${tab === t ? 'text-brand-400 border-b-2 border-brand-400 -mb-px bg-brand-500/5' : 'text-slate-500 hover:text-slate-300'}`}>
            {t === 'Theory' ? <BookOpen className="w-3.5 h-3.5" /> : <Code2 className="w-3.5 h-3.5" />}
            {t}
            {t === 'Exercises' && <span className="ml-1 text-xs bg-white/10 px-1.5 py-0.5 rounded">{exercises.length}</span>}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Theory Tab */}
        {tab === 'Theory' && (
          <motion.div key="theory" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            className="glass rounded-2xl p-6 border border-white/10">
            <div className="md-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.theory_content}</ReactMarkdown>
            </div>
            {lesson.summary && (
              <div className="mt-6 p-4 rounded-xl bg-brand-500/10 border border-brand-500/20">
                <div className="text-xs font-bold text-brand-400 mb-1">📌 SUMMARY</div>
                <p className="text-sm text-slate-300">{lesson.summary}</p>
              </div>
            )}
            <button onClick={() => setTab('Exercises')} className="btn-primary mt-6 w-full py-3">
              Start Exercises <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Exercises Tab */}
        {tab === 'Exercises' && (
          <motion.div key="exercises" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-4">
            {/* Exercise progress */}
            <div className="flex items-center gap-2">
              {exercises.map((ex, i) => (
                <button key={ex.id} onClick={() => setCurrentExIdx(i)}
                  className={`flex-1 h-2 rounded-full transition-all
                    ${i === currentExIdx ? 'bg-brand-500' : results[ex.id]?.correct ? 'bg-brand-700' : 'bg-surface-700'}`}
                />
              ))}
              <span className="text-xs text-slate-500 whitespace-nowrap ml-1">
                {Object.keys(results).length}/{exercises.length}
              </span>
            </div>

            {currentEx && (
              <ExerciseBlock
                key={currentEx.id}
                exercise={currentEx}
                lessonId={id}
                onResult={handleResult}
                language={state?.roadmap?.language || 'python'}
              />
            )}

            {/* Exercise navigation */}
            <div className="flex justify-between">
              <button onClick={() => setCurrentExIdx(i => Math.max(0, i - 1))}
                disabled={currentExIdx === 0} className="btn-ghost disabled:opacity-30 flex items-center gap-1.5">
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              {currentExIdx < exercises.length - 1 ? (
                <button onClick={() => setCurrentExIdx(i => i + 1)} className="btn-primary flex items-center gap-1.5">
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : allAnswered ? (
                <button onClick={handleComplete} disabled={isCompleting}
                  className="btn-primary flex items-center gap-1.5 glow-green px-6">
                  <CheckCircle className="w-4 h-4" />
                  {isCompleting ? 'Completing...' : 'Complete Lesson!'}
                </button>
              ) : (
                <button onClick={() => setCurrentExIdx(exercises.findIndex(ex => !results[ex.id]))}
                  className="btn-ghost flex items-center gap-1.5">
                  Skip to unanswered <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
