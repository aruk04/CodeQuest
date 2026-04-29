import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Zap, Target } from 'lucide-react'
import { generateRoadmap } from '../api/roadmap'
import { useAuthStore } from '../store/authStore'
import { useProgressStore } from '../store/progressStore'
import toast from 'react-hot-toast'

// API helper
import api from '../api/client'

const LANGUAGES = [
  { id: 'python',     name: 'Python',     emoji: '🐍', desc: 'Great for beginners, AI/ML, automation',    color: 'from-blue-600/20 to-yellow-500/20', border: 'border-blue-500/40' },
  { id: 'javascript', name: 'JavaScript', emoji: '⚡', desc: 'Web development, frontend & backend',       color: 'from-yellow-500/20 to-orange-500/20', border: 'border-yellow-500/40' },
  { id: 'cpp',        name: 'C++',        emoji: '⚙️', desc: 'Systems, competitive programming, games',   color: 'from-purple-500/20 to-blue-500/20', border: 'border-purple-500/40' },
  { id: 'java',       name: 'Java',       emoji: '☕', desc: 'Enterprise apps, Android development',      color: 'from-red-500/20 to-orange-500/20', border: 'border-red-500/40' },
]

const SKILL_LEVELS = [
  { id: 'beginner',     label: 'Beginner',     emoji: '🌱', desc: 'I\'m new to programming' },
  { id: 'intermediate', label: 'Intermediate', emoji: '🌿', desc: 'I know the basics, want to go deeper' },
  { id: 'advanced',     label: 'Advanced',     emoji: '🌳', desc: 'I\'m experienced, want to master concepts' },
]

const GOALS = [
  'Get a software engineering job',
  'Crack FAANG interviews',
  'Learn DSA & algorithms',
  'Build web applications',
  'Master competitive programming',
  'Personal projects & automation',
]

const LEARNING_STYLES = [
  { id: 'balanced',      label: 'Balanced',       emoji: '⚖️',  desc: 'Mix of theory and practice' },
  { id: 'practice_heavy',label: 'Practice-Heavy', emoji: '💪', desc: 'Learn by doing, lots of exercises' },
  { id: 'theory_first',  label: 'Theory First',   emoji: '📖', desc: 'Understand concepts deeply first' },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const { updateUser } = useAuthStore()
  const { setRoadmap } = useProgressStore()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    language: '',
    skill_level: '',
    learning_style: 'balanced',
    goal: '',
  })

  const steps = [
    { title: 'Pick your language', subtitle: 'What do you want to learn?' },
    { title: 'What\'s your level?', subtitle: 'Be honest — we\'ll adapt!' },
    { title: 'Your learning style', subtitle: 'How do you learn best?' },
    { title: 'What\'s your goal?', subtitle: 'Set your north star' },
  ]

  const canNext = () => {
    if (step === 0) return !!form.language
    if (step === 1) return !!form.skill_level
    if (step === 2) return !!form.learning_style
    if (step === 3) return !!form.goal
    return false
  }

  const handleFinish = async () => {
    setLoading(true)
    try {
      await api.post('/users/onboard', { ...form })
      const roadmapRes = await generateRoadmap({ language: form.language, skill_level: form.skill_level, goal: form.goal })
      setRoadmap(roadmapRes.data)
      updateUser({ is_onboarded: true })
      toast.success('Your personalized roadmap is ready! 🗺️')
      navigate('/dashboard')
    } catch (e) {
      toast.error('Setup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-950 bg-mesh flex flex-col items-center justify-center px-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap className="w-6 h-6 text-brand-400" />
          <span className="font-extrabold text-white text-xl">CodeQuest Setup</span>
        </div>
        {/* Progress dots */}
        <div className="flex gap-2 justify-center">
          {steps.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all duration-300
              ${i === step ? 'w-8 bg-brand-500' : i < step ? 'w-2 bg-brand-700' : 'w-2 bg-surface-700'}`} />
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="glass rounded-2xl p-8 border border-white/10">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">{steps[step].title}</h1>
            <p className="text-slate-400 mt-1">{steps[step].subtitle}</p>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 0: Language */}
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-2 gap-3">
                {LANGUAGES.map((lang) => (
                  <button key={lang.id} onClick={() => setForm({ ...form, language: lang.id })}
                    className={`p-4 rounded-2xl border text-left transition-all duration-200 bg-gradient-to-br ${lang.color}
                      ${form.language === lang.id ? `${lang.border} scale-[1.02] shadow-lg shadow-brand-500/10` : 'border-white/10 hover:border-white/25'}`}
                  >
                    <div className="text-3xl mb-2">{lang.emoji}</div>
                    <div className="font-bold text-white">{lang.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{lang.desc}</div>
                  </button>
                ))}
              </motion.div>
            )}

            {/* Step 1: Skill Level */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-3">
                {SKILL_LEVELS.map((level) => (
                  <button key={level.id} onClick={() => setForm({ ...form, skill_level: level.id })}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all
                      ${form.skill_level === level.id ? 'border-brand-500 bg-brand-500/15 scale-[1.01]' : 'border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10'}`}
                  >
                    <span className="text-3xl">{level.emoji}</span>
                    <div>
                      <div className="font-bold text-white">{level.label}</div>
                      <div className="text-sm text-slate-400">{level.desc}</div>
                    </div>
                    {form.skill_level === level.id && <span className="ml-auto text-brand-400 text-xl">✓</span>}
                  </button>
                ))}
              </motion.div>
            )}

            {/* Step 2: Learning Style */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-3">
                {LEARNING_STYLES.map((style) => (
                  <button key={style.id} onClick={() => setForm({ ...form, learning_style: style.id })}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all
                      ${form.learning_style === style.id ? 'border-brand-500 bg-brand-500/15 scale-[1.01]' : 'border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10'}`}
                  >
                    <span className="text-3xl">{style.emoji}</span>
                    <div>
                      <div className="font-bold text-white">{style.label}</div>
                      <div className="text-sm text-slate-400">{style.desc}</div>
                    </div>
                    {form.learning_style === style.id && <span className="ml-auto text-brand-400 text-xl">✓</span>}
                  </button>
                ))}
              </motion.div>
            )}

            {/* Step 3: Goal */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-2">
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {GOALS.map((goal) => (
                    <button key={goal} onClick={() => setForm({ ...form, goal })}
                      className={`p-3 rounded-xl border text-sm text-left transition-all
                        ${form.goal === goal ? 'border-brand-500 bg-brand-500/15 text-white' : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/25 hover:bg-white/10 hover:text-white'}`}
                    >
                      <Target className="w-3.5 h-3.5 mb-1 inline mr-1" />{goal}
                    </button>
                  ))}
                </div>
                <input
                  className="input text-sm"
                  placeholder="Or type your own goal..."
                  value={GOALS.includes(form.goal) ? '' : form.goal}
                  onChange={(e) => setForm({ ...form, goal: e.target.value })}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nav Buttons */}
          <div className="flex justify-between mt-8">
            <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
              className="btn-ghost disabled:opacity-30 flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            {step < steps.length - 1 ? (
              <button onClick={() => setStep(s => s + 1)} disabled={!canNext()}
                className="btn-primary disabled:opacity-40 flex items-center gap-1.5">
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleFinish} disabled={!canNext() || loading}
                className="btn-primary disabled:opacity-40 flex items-center gap-1.5 px-6 glow-green">
                {loading ? '🧠 Generating roadmap...' : <>Let's Go! <Zap className="w-4 h-4" /></>}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
