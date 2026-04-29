import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Brain, Code2, Trophy, ArrowRight, CheckCircle } from 'lucide-react'

const FEATURES = [
  { icon: '🧠', title: 'AI Adaptive Learning', desc: 'Claude personalizes every lesson to your skill level and learning style.' },
  { icon: '🔥', title: 'Daily Streaks', desc: 'Build habits with Duolingo-style streaks, XP, and level progression.' },
  { icon: '💻', title: 'Live Code Execution', desc: 'Write and run code instantly. Python, JavaScript, C++, Java — all in browser.' },
  { icon: '🤖', title: 'AI Debug Assistant', desc: 'Paste your broken code and get instant explanations + fixes from Claude.' },
  { icon: '🗺️', title: 'Personalized Roadmap', desc: 'Your own AI-generated learning path from beginner to advanced.' },
  { icon: '📊', title: 'Weakness Detection', desc: 'AI detects where you struggle and plans targeted revision sessions.' },
]

const LANGUAGES = [
  { name: 'Python', emoji: '🐍', color: 'from-blue-500/20 to-yellow-500/20', border: 'border-blue-500/30' },
  { name: 'JavaScript', emoji: '⚡', color: 'from-yellow-500/20 to-orange-500/20', border: 'border-yellow-500/30' },
  { name: 'C++', emoji: '⚙️', color: 'from-purple-500/20 to-blue-500/20', border: 'border-purple-500/30' },
  { name: 'Java', emoji: '☕', color: 'from-red-500/20 to-orange-500/20', border: 'border-red-500/30' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-surface-950 bg-mesh overflow-x-hidden">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 border-b border-white/10 bg-surface-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white fill-current" />
            </div>
            <span className="font-extrabold text-white text-lg">Code<span className="text-brand-400">Quest</span></span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost text-sm px-4 py-2">Log in</Link>
            <Link to="/signup" className="btn-primary text-sm px-4 py-2">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/30
                          bg-brand-500/10 text-brand-400 text-sm font-semibold mb-8">
            <Zap className="w-4 h-4" />
            Coding made fun • Upgrade your coding skills!
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
            Learn Coding
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-brand-300 to-accent-cyan text-glow-green">
              Like a Game
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Master Python, JavaScript, C++, and Java with AI-powered adaptive lessons,
            live code execution, and gamified progress tracking.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn-primary text-base px-8 py-3.5 glow-green">
              Start Learning Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="btn-ghost text-base px-8 py-3.5">
              Sign in
            </Link>
          </div>
        </motion.div>

        {/* Language Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mt-14"
        >
          {LANGUAGES.map((lang, i) => (
            <motion.div
              key={lang.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r ${lang.color}
                          border ${lang.border} backdrop-blur-sm`}
            >
              <span className="text-2xl">{lang.emoji}</span>
              <span className="font-bold text-white text-sm">{lang.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold text-white text-center mb-3">Everything you need to master coding</h2>
        <p className="text-slate-400 text-center mb-12">Built for serious learners who want real results.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass glass-hover rounded-2xl p-6 border border-white/10"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/10 py-16 bg-surface-900/50">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          {[
            { num: '4+', label: 'Languages' },
            { num: 'Claude', label: 'AI Engine' },
            { num: '∞', label: 'Lessons' },
          ].map(({ num, label }) => (
            <div key={label}>
              <div className="text-4xl font-black text-brand-400 text-glow-green">{num}</div>
              <div className="text-slate-400 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to start your coding journey?</h2>
        <p className="text-slate-400 mb-8">Free to start. No credit card required.</p>
        <Link to="/signup" className="btn-primary text-base px-10 py-4 glow-green">
          Start Learning Now — It's Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-slate-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-brand-400" />
          <span className="font-bold text-white">CodeQuest</span>
        </div>

      </footer>
    </div>
  )
}
