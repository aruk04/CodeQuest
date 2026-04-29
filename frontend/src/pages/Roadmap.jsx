import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Map, RefreshCw } from 'lucide-react'
import { getMyRoadmap, getAvailableRoadmaps, switchRoadmap, getAllRoadmaps, setActiveRoadmap, generateRoadmap } from '../api/roadmap'
import { generateLesson } from '../api/lessons'
import { getMe } from '../api/auth'
import { useProgressStore } from '../store/progressStore'
import { useAuthStore } from '../store/authStore'
import LessonCard from '../components/LessonCard'
import LoadingScreen from '../components/LoadingScreen'
import toast from 'react-hot-toast'

export default function Roadmap() {
  const [roadmap, setRoadmap] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generatingLesson, setGeneratingLesson] = useState(null)
  const [availableRoadmaps, setAvailableRoadmaps] = useState([])
  const [userRoadmaps, setUserRoadmaps] = useState([])
  const [switchingRoadmap, setSwitchingRoadmap] = useState(null)
  
  const [showNewModal, setShowNewModal] = useState(false)
  const [newForm, setNewForm] = useState({ language: 'python', skill_level: 'beginner', goal: '' })
  const [generatingNew, setGeneratingNew] = useState(false)

  const navigate = useNavigate()
  const { user, updateUser } = useAuthStore()

  const loadData = () => {
    setLoading(true)
    Promise.all([
      getMyRoadmap().then(res => setRoadmap(res.data)).catch(() => {}),
      getAvailableRoadmaps().then(res => setAvailableRoadmaps(res.data.roadmaps)).catch(() => {}),
      getAllRoadmaps().then(res => setUserRoadmaps(res.data.roadmaps)).catch(() => {})
    ]).finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [])

  const syncProfile = async () => {
    try {
      const res = await getMe()
      updateUser(res.data)
    } catch (e) {}
  }

  const handleSetActiveRoadmap = async (id) => {
    setSwitchingRoadmap(id)
    try {
      await setActiveRoadmap(id)
      await syncProfile()
      toast.success('Switched active learning path!')
      loadData()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      toast.error('Failed to switch path')
    } finally {
      setSwitchingRoadmap(null)
    }
  }

  const handleGenerateNewRoadmap = async (e) => {
    e.preventDefault()
    setGeneratingNew(true)
    try {
      await generateRoadmap(newForm)
      await syncProfile()
      toast.success('New learning path created!')
      setShowNewModal(false)
      loadData()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      console.error("Generate roadmap error:", err)
      toast.error(err.response?.data?.detail || err.message || 'Failed to generate path')
    } finally {
      setGeneratingNew(false)
    }
  }

  const handleSwitchRoadmap = async (levelId) => {
    setSwitchingRoadmap(levelId)
    try {
      const res = await switchRoadmap({ level_id: levelId, language: roadmap.language })
      setRoadmap(res.data)
      await syncProfile()
      toast.success('Successfully switched roadmap!')
      loadData()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to switch roadmap')
    } finally {
      setSwitchingRoadmap(null)
    }
  }

  const handleNodeClick = async (node) => {
    if (node.status === 'locked') return
    setGeneratingLesson(node.id)
    try {
      const res = await generateLesson({
        node_id: node.id,
        language: roadmap.language,
        topic: node.title,
        skill_level: roadmap.skill_level,
      })
      navigate(`/lesson/${res.data.id}`, { state: { node, roadmap } })
    } catch {
      toast.error('Failed to load lesson. Please try again.')
    } finally {
      setGeneratingLesson(null)
    }
  }

  if (loading) return <LoadingScreen message="Loading your roadmap..." />

  if (!roadmap) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">🗺️</div>
        <p className="text-slate-400">No roadmap found. Complete onboarding first.</p>
      </div>
    )
  }

  const completedCount = roadmap.nodes.filter(n => n.status === 'completed').length

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 border border-white/10 bg-gradient-to-r from-surface-800 to-surface-900">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Map className="w-5 h-5 text-brand-400" />
              <span className="text-brand-400 text-sm font-semibold">YOUR LEARNING ROADMAP</span>
            </div>
            <h1 className="text-2xl font-bold text-white">{roadmap.title}</h1>
            <p className="text-slate-400 text-sm mt-1">{roadmap.description}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-extrabold text-brand-400">{completedCount}/{roadmap.nodes.length}</div>
            <div className="text-xs text-slate-500">completed</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="h-2 bg-surface-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full xp-bar-fill rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / roadmap.nodes.length) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1.5">
            <span>Start</span>
            <span className="capitalize">{roadmap.language} Mastery</span>
          </div>
        </div>
      </motion.div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-slate-400">
        {[
          { color: 'bg-brand-500', label: 'Completed' },
          { color: 'bg-blue-500', label: 'In Progress' },
          { color: 'bg-white/30', label: 'Unlocked' },
          { color: 'bg-white/10', label: 'Locked' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-full ${color}`} />
            {label}
          </div>
        ))}
      </div>

      {/* Nodes list */}
      <div className="space-y-3">
        {roadmap.nodes.map((node, i) => (
          <div key={node.id} className="relative">
            {/* Connector line */}
            {i < roadmap.nodes.length - 1 && (
              <div className="absolute left-6 top-full h-3 w-0.5 roadmap-connector z-0" />
            )}
            {generatingLesson === node.id ? (
              <div className="glass rounded-2xl p-4 border border-brand-500/40 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-brand-400 animate-spin" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">{node.title}</div>
                    <div className="text-xs text-brand-400">🧠 AI is preparing your lesson...</div>
                  </div>
                </div>
              </div>
            ) : (
              <LessonCard node={node} index={i} onClick={() => handleNodeClick(node)} />
            )}
          </div>
        ))}
      </div>



      {/* Your Roadmaps */}
      {userRoadmaps.length > 0 && (
        <div className="mt-12 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5 text-brand-400" />
              <h2 className="text-xl font-bold text-white">Your Learning Paths</h2>
            </div>
            <button
              onClick={() => setShowNewModal(true)}
              className="btn-primary text-xs px-4 py-2 flex items-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600"
            >
              <span className="text-lg">🌟</span>
              <span>I want to learn something new!</span>
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {userRoadmaps.map((rm) => (
              <div key={rm.id} className={`glass rounded-2xl p-5 border transition-all
                ${rm.is_active ? 'border-brand-500 bg-brand-500/5' : 'border-white/10 hover:border-white/20'}`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-white text-lg capitalize">{rm.language} <span className="text-slate-400 font-normal text-sm">({rm.skill_level})</span></h3>
                  {rm.is_active ? (
                    <span className="text-xs font-bold text-brand-400 bg-brand-400/10 px-2 py-1 rounded">Active</span>
                  ) : (
                    <button 
                      onClick={() => handleSetActiveRoadmap(rm.id)}
                      disabled={switchingRoadmap === rm.id}
                      className="text-xs font-bold text-white bg-surface-700 hover:bg-surface-600 px-3 py-1 rounded transition-colors"
                    >
                      {switchingRoadmap === rm.id ? 'Switching...' : 'Switch to this'}
                    </button>
                  )}
                </div>
                <p className="text-sm text-slate-400 mt-1">{rm.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Roadmaps */}
      {availableRoadmaps.length > 0 && (
        <div className="mt-12 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Map className="w-5 h-5 text-accent-purple" />
            <h2 className="text-xl font-bold text-white">Explore Roadmaps</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {availableRoadmaps.map((rm) => {
              const isLocked = user?.profile?.level < rm.min_level
              const isCurrent = roadmap.skill_level === rm.skill || roadmap.title === rm.title
              
              return (
                <div key={rm.id} className={`glass rounded-2xl p-5 border relative overflow-hidden transition-all
                  ${isCurrent ? 'border-brand-500 bg-brand-500/5' : isLocked ? 'border-white/5 opacity-75' : 'border-white/10 hover:border-white/20'}`}>
                  
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-2xl">{rm.icon}</div>
                    {isCurrent ? (
                      <span className="text-xs font-bold text-brand-400 bg-brand-400/10 px-2 py-1 rounded">Active</span>
                    ) : isLocked ? (
                      <span className="text-xs font-bold text-slate-400 bg-white/5 px-2 py-1 rounded flex items-center gap-1">
                        🔒 Unlocks at Lvl {rm.min_level}
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleSwitchRoadmap(rm.id)}
                        disabled={switchingRoadmap === rm.id}
                        className="text-xs font-bold text-white bg-accent-purple hover:bg-accent-purple/90 px-3 py-1 rounded transition-colors"
                      >
                        {switchingRoadmap === rm.id ? 'Generating...' : 'Switch to this'}
                      </button>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-white text-lg">{rm.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">{rm.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* New Roadmap Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setShowNewModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">🌟 Learn Something New</h2>
            <p className="text-slate-400 text-sm mb-6">Pick a new language and goal. Your current roadmap will be saved!</p>
            
            <form onSubmit={handleGenerateNewRoadmap} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1">Language</label>
                <select 
                  className="input w-full"
                  value={newForm.language}
                  onChange={e => setNewForm({...newForm, language: e.target.value})}
                >
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1">Skill Level</label>
                <select 
                  className="input w-full"
                  value={newForm.skill_level}
                  onChange={e => setNewForm({...newForm, skill_level: e.target.value})}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1">Specific Goal (Optional)</label>
                <input 
                  type="text"
                  className="input w-full"
                  placeholder="e.g. Build a web server"
                  value={newForm.goal}
                  onChange={e => setNewForm({...newForm, goal: e.target.value})}
                />
              </div>

              <button 
                type="submit" 
                disabled={generatingNew}
                className="btn-primary w-full py-3 mt-4 flex items-center justify-center gap-2 font-bold"
              >
                {generatingNew ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Generate New Path 🚀'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
