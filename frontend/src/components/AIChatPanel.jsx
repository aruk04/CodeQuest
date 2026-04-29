import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Bot, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useAIStore } from '../store/aiStore'
import { chatWithTutor } from '../api/ai'
import { useProgressStore } from '../store/progressStore'

export default function AIChatPanel() {
  const { isPanelOpen, closePanel, messages, addMessage, setLoading, isLoading, clearMessages, context, sendPrompt } = useAIStore()
  const { roadmap } = useProgressStore()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = () => {
    if (!input.trim() || isLoading) return
    const text = input.trim()
    setInput('')
    sendPrompt(text, roadmap?.language || 'python')
  }

  return (
    <AnimatePresence>
      {isPanelOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePanel}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md z-50 flex flex-col
                       glass border-l border-white/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue
                                flex items-center justify-center glow-purple">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">CodeQuest AI Tutor</h3>
                  <p className="text-xs text-brand-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Powered by Claude
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={clearMessages} className="btn-ghost text-xs px-2.5 py-1.5">
                  Clear
                </button>
                <button onClick={closePanel} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">🤖</div>
                  <p className="text-slate-400 text-sm">Ask me anything about your lesson!</p>
                  <div className="mt-4 space-y-2">
                    {['Explain this concept simply', 'Give me an example', 'Why is this important?'].map((q) => (
                      <button
                        key={q}
                        onClick={() => setInput(q)}
                        className="block w-full text-left text-xs text-slate-400 px-3 py-2 rounded-xl
                                   bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue
                                    flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm
                      ${msg.role === 'user'
                        ? 'bg-brand-500/30 text-white rounded-tr-sm border border-brand-500/40'
                        : 'bg-surface-700 text-slate-200 rounded-tl-sm border border-white/10'
                      }`}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="md-content prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue
                                  flex items-center justify-center mr-2">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-surface-700 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-brand-400 rounded-full"
                          animate={{ y: [0, -6, 0] }}
                          transition={{ repeat: Infinity, delay: i * 0.15, duration: 0.6 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  className="input flex-1 py-2.5"
                  placeholder="Ask your AI tutor..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
                />
                <button
                  onClick={send}
                  disabled={!input.trim() || isLoading}
                  className="btn-primary px-3 disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
