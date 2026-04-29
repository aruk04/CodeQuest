import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Target, TrendingUp, AlertTriangle, BookOpen, ExternalLink, Youtube, Bot } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useProgressStore } from '../store/progressStore'
import { useAIStore } from '../store/aiStore'
import { getProgressSummary, getWeakAreas } from '../api/progress'
import { getMyRoadmap, getNextLesson } from '../api/roadmap'
import XPBar from '../components/XPBar'
import StreakCounter from '../components/StreakCounter'
import ProgressRing from '../components/ProgressRing'
import LoadingScreen from '../components/LoadingScreen'

export default function Dashboard() {
  const { user } = useAuthStore()
  const { xp, level, streak, xpToNextLevel, completionPercent, setProgress, setRoadmap, setWeakAreas, weakAreas } = useProgressStore()
  const [roadmap, setLocalRoadmap] = useState(null)
  const [nextLesson, setNextLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      try {
        const [prog, roadmapRes, nextRes, weakRes] = await Promise.all([
          getProgressSummary(),
          getMyRoadmap(),
          getNextLesson(),
          getWeakAreas(),
        ])
        setProgress(prog.data)
        setLocalRoadmap(roadmapRes.data)
        setRoadmap(roadmapRes.data)
        setNextLesson(nextRes.data)
        setWeakAreas(weakRes.data)
      } catch { /* silent */ }
      finally { setLoading(false) }
    }
    load()
  }, [])

  if (loading) return <LoadingScreen message="Loading your dashboard..." />

  const completedNodes = roadmap?.nodes?.filter(n => n.status === 'completed').length || 0
  const totalNodes = roadmap?.nodes?.length || 1

  return (
    <div className="space-y-6 page-enter">
      {/* Welcome Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, <span className="text-brand-400">{user?.username}</span>! 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {nextLesson?.title ? `Continue: ${nextLesson.title}` : 'Keep up the great work!'}
          </p>
        </div>
        <StreakCounter streak={streak} size="md" />
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total XP', value: xp.toLocaleString(), icon: '⚡', color: 'text-brand-400' },
          { label: 'Level', value: level, icon: '🏆', color: 'text-amber-400' },
          { label: 'Lessons Done', value: completedNodes, icon: '📚', color: 'text-blue-400' },
          { label: 'Roadmap', value: `${Math.round((completedNodes / totalNodes) * 100)}%`, icon: '🗺️', color: 'text-purple-400' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-2xl p-4 border border-white/10"
          >
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* XP Progress */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-5 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-slate-300">Level Progress</span>
          <span className="text-xs text-slate-500">{xpToNextLevel} XP to Level {level + 1}</span>
        </div>
        <XPBar xp={xp} level={level} xpToNext={xpToNextLevel} completionPercent={completionPercent} />
      </motion.div>

      <div className="grid md:grid-cols-3 gap-5">
        {/* Next Lesson CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="md:col-span-2 glass rounded-2xl p-6 border border-brand-500/30 bg-gradient-to-br from-brand-500/10 to-transparent">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center text-2xl flex-shrink-0">
              {nextLesson?.icon || '🚀'}
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold text-brand-400 mb-1 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> NEXT LESSON
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                {nextLesson?.title || 'You\'ve completed everything!'}
              </h3>
              <p className="text-sm text-slate-400">
                {nextLesson?.node_id ? 'Ready to level up your skills?' : 'Incredible work! 🎉'}
              </p>
              {nextLesson?.node_id && (
                <Link
                  to={`/roadmap`}
                  className="btn-primary mt-4 inline-flex text-sm"
                >
                  Continue Learning <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </motion.div>

        {/* Roadmap Ring */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6 border border-white/10 flex flex-col items-center justify-center gap-3">
          <ProgressRing
            percent={(completedNodes / totalNodes) * 100}
            size={100}
            strokeWidth={8}
          >
            <div className="text-center">
              <div className="text-lg font-extrabold text-white">{completedNodes}</div>
              <div className="text-xs text-slate-500">/{totalNodes}</div>
            </div>
          </ProgressRing>
          <div className="text-center">
            <div className="text-sm font-semibold text-white capitalize">{roadmap?.language || 'Your'} Roadmap</div>
            <Link to="/roadmap" className="text-xs text-brand-400 hover:underline">View all →</Link>
          </div>
        </motion.div>
      </div>

      {/* Weak Areas */}
      {weakAreas.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          className="glass rounded-2xl p-5 border border-amber-500/20 bg-amber-500/5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="font-semibold text-amber-400 text-sm">Areas Needing Revision</h3>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {weakAreas.slice(0, 6).map((area, i) => {
              const lang = roadmap?.language || ''
              const cleanConcept = area.concept.replace(/```.*?```/gs, '').replace(/`/g, '').slice(0, 60)
              const query = encodeURIComponent(`${lang} ${cleanConcept}`)
              const ytLink = `https://www.youtube.com/results?search_query=${query}`
              const gfgLink = `https://www.google.com/search?q=${encodeURIComponent(`site:geeksforgeeks.org ${lang} ${cleanConcept}`)}`

              return (
                <div key={i} className="relative group cursor-help flex items-center">
                  <span className="px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30
                                   text-amber-300 text-xs font-medium">
                    {area.concept.length > 55 ? area.concept.slice(0, 55) + '...' : area.concept} ({area.error_count}x)
                  </span>
                  
                  {/* Tooltip Bridge (prevents hover from breaking) */}
                  <div className="absolute bottom-full left-0 w-full h-2"></div>

                  {/* Tooltip Content */}
                  <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-64 p-3 
                                  bg-slate-800 border border-slate-600 rounded-xl shadow-2xl 
                                  opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                                  transition-all duration-200 z-50 pointer-events-auto">
                    <p className="text-[11px] text-slate-300 mb-2 font-semibold">Recommended Resources:</p>
                    <div className="flex flex-col gap-1.5">
                      {area.resources && area.resources.length > 0 ? (
                        area.resources.map((res, idx) => (
                          <a key={idx} href={res.url} target="_blank" rel="noreferrer" 
                             className={`flex items-center gap-2 text-xs hover:bg-white/5 p-1.5 rounded-lg transition-colors ${res.type === 'youtube' ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'}`}>
                             {res.type === 'youtube' ? <Youtube className="w-3.5 h-3.5 flex-shrink-0" /> : <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />}
                             <span className="truncate" title={res.title}>{res.title}</span>
                             <ExternalLink className="w-3 h-3 ml-auto opacity-50 flex-shrink-0" />
                          </a>
                        ))
                      ) : (
                        <>
                          <a href={ytLink} target="_blank" rel="noreferrer" 
                             className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-400/10 p-1.5 rounded-lg transition-colors">
                             <Youtube className="w-3.5 h-3.5 flex-shrink-0" />
                             <span>YouTube Search</span>
                             <ExternalLink className="w-3 h-3 ml-auto opacity-50 flex-shrink-0" />
                          </a>
                          <a href={gfgLink} target="_blank" rel="noreferrer" 
                             className="flex items-center gap-2 text-xs text-green-400 hover:text-green-300 hover:bg-green-400/10 p-1.5 rounded-lg transition-colors">
                             <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
                             <span>GeeksforGeeks Search</span>
                             <ExternalLink className="w-3 h-3 ml-auto opacity-50 flex-shrink-0" />
                          </a>
                        </>
                      )}
                      <div className="h-px bg-white/10 my-0.5"></div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const { openPanel, sendPrompt } = useAIStore.getState();
                          openPanel(`Revision: ${area.concept}`);
                          sendPrompt(`I am struggling with the concept: "${area.concept}". Can you explain it to me and provide a simple example in ${lang}?`, lang);
                        }}
                        className="flex items-center gap-2 text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-400/10 p-1.5 rounded-lg transition-colors w-full text-left"
                      >
                        <Bot className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Ask AI Tutor</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Recent Activity */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="glass rounded-2xl p-5 border border-white/10">
        <h3 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-brand-400" /> Quick Access
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { to: '/roadmap', icon: '🗺️', label: 'Roadmap' },
            { to: '/code', icon: '💻', label: 'Code Lab' },
            { to: '/profile', icon: '👤', label: 'Profile' },
            { to: '/code', icon: '🐛', label: 'Debugger' },
          ].map(({ to, icon, label }) => (
            <Link key={label} to={to}
              className="glass glass-hover rounded-xl p-3 text-center border border-white/10 group">
              <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">{icon}</div>
              <div className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors">{label}</div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
