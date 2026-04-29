import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Layers, AlignJustify, GripHorizontal, Plus, Minus, ArrowRight, Info } from 'lucide-react'

// Basic DSA structures we will visualize
const STRUCTURES = [
  { id: 'stack', name: 'Stack', icon: Layers, desc: 'LIFO (Last In, First Out). Like a stack of plates.' },
  { id: 'queue', name: 'Queue', icon: AlignJustify, desc: 'FIFO (First In, First Out). Like a line at a store.' },
  { id: 'array', name: 'Array', icon: GripHorizontal, desc: 'Contiguous memory blocks. Random access in O(1).' }
]

function StackVisualizer() {
  const [stack, setStack] = useState([10, 20, 30])
  const [counter, setCounter] = useState(40)
  
  const push = () => {
    if (stack.length >= 8) return
    setStack(prev => [...prev, counter])
    setCounter(c => c + 10)
  }
  
  const pop = () => {
    if (stack.length === 0) return
    setStack(prev => prev.slice(0, -1))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Stack (LIFO)</h2>
          <p className="text-sm text-slate-400">Last-In, First-Out data structure.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={push} disabled={stack.length >= 8} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Push
          </button>
          <button onClick={pop} disabled={stack.length === 0} className="btn-ghost flex items-center gap-2 text-red-400 hover:bg-red-500/10 border border-red-500/30">
            <Minus className="w-4 h-4" /> Pop
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-end justify-center pb-10 overflow-hidden pt-10">
        <div className="w-48 border-b-4 border-x-4 border-surface-600 rounded-b-xl flex flex-col-reverse p-2 gap-2 min-h-[320px] relative bg-surface-900/50">
          <AnimatePresence>
            {stack.map((item, i) => (
              <motion.div
                key={`${i}-${item}`}
                layout
                initial={{ opacity: 0, y: -150, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.8 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                className="w-full h-12 bg-gradient-to-r from-brand-500 to-brand-600 rounded-lg flex items-center justify-center font-mono font-bold text-white shadow-lg border border-brand-400/50"
              >
                {item}
                {i === stack.length - 1 && (
                  <motion.span 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                    className="absolute -right-16 text-xs text-brand-400 font-semibold flex items-center gap-1"
                  >
                    <ArrowRight className="w-3 h-3 rotate-180" /> Top
                  </motion.span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {stack.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-500 italic text-sm">
              Stack is empty
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-auto bg-surface-700/50 p-4 rounded-xl border border-white/5 flex gap-4 items-start">
        <Info className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-slate-300">
          <strong className="text-white block mb-1">Time Complexity:</strong>
          Push: <code className="text-brand-400">O(1)</code> | Pop: <code className="text-brand-400">O(1)</code> | Peek: <code className="text-brand-400">O(1)</code>
          <p className="mt-2 text-slate-400">Common uses: Undo mechanisms, function call stacks, syntax parsing.</p>
        </div>
      </div>
    </div>
  )
}

function QueueVisualizer() {
  const [queue, setQueue] = useState([10, 20, 30])
  const [counter, setCounter] = useState(40)
  
  const enqueue = () => {
    if (queue.length >= 8) return
    setQueue(prev => [...prev, counter])
    setCounter(c => c + 10)
  }
  
  const dequeue = () => {
    if (queue.length === 0) return
    setQueue(prev => prev.slice(1))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Queue (FIFO)</h2>
          <p className="text-sm text-slate-400">First-In, First-Out data structure.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={enqueue} disabled={queue.length >= 8} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Enqueue
          </button>
          <button onClick={dequeue} disabled={queue.length === 0} className="btn-ghost flex items-center gap-2 text-red-400 hover:bg-red-500/10 border border-red-500/30">
            <Minus className="w-4 h-4" /> Dequeue
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center py-10 overflow-hidden px-4">
        <div className="w-full max-w-2xl border-y-4 border-surface-600 flex p-2 gap-2 min-h-[80px] relative bg-surface-900/50 items-center overflow-hidden">
          <AnimatePresence>
            {queue.map((item, i) => (
              <motion.div
                key={`${item}`}
                layout
                initial={{ opacity: 0, x: 100, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -100, scale: 0.8 }}
                transition={{ type: 'spring', bounce: 0.3 }}
                className="w-16 h-16 flex-shrink-0 bg-gradient-to-br from-accent-blue to-blue-600 rounded-lg flex flex-col items-center justify-center font-mono font-bold text-white shadow-lg border border-blue-400/50 relative"
              >
                {item}
                {i === 0 && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -bottom-6 text-[10px] text-blue-400 font-semibold whitespace-nowrap">
                    Front
                  </motion.span>
                )}
                {i === queue.length - 1 && queue.length > 1 && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -bottom-6 text-[10px] text-slate-400 font-semibold whitespace-nowrap">
                    Back
                  </motion.span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {queue.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-500 italic text-sm">
              Queue is empty
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-auto bg-surface-700/50 p-4 rounded-xl border border-white/5 flex gap-4 items-start">
        <Info className="w-5 h-5 text-accent-blue flex-shrink-0 mt-0.5" />
        <div className="text-sm text-slate-300">
          <strong className="text-white block mb-1">Time Complexity:</strong>
          Enqueue: <code className="text-accent-blue">O(1)</code> | Dequeue: <code className="text-accent-blue">O(1)</code>
          <p className="mt-2 text-slate-400">Common uses: Task scheduling, Breadth-First Search (BFS), printing queues.</p>
        </div>
      </div>
    </div>
  )
}

function ArrayVisualizer() {
  const [array, setArray] = useState([10, 20, 30, 40, 50])
  const [counter, setCounter] = useState(60)
  const [activeIndex, setActiveIndex] = useState(null)
  
  const insert = () => {
    if (array.length >= 10) return
    setArray(prev => [...prev, counter])
    setCounter(c => c + 10)
  }
  
  const remove = () => {
    if (array.length === 0) return
    setArray(prev => prev.slice(0, -1))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Array</h2>
          <p className="text-sm text-slate-400">Contiguous memory allocation.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={insert} disabled={array.length >= 10} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Append
          </button>
          <button onClick={remove} disabled={array.length === 0} className="btn-ghost flex items-center gap-2 text-red-400 hover:bg-red-500/10 border border-red-500/30">
            <Minus className="w-4 h-4" /> Remove Last
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center py-10 overflow-hidden">
        <div className="flex flex-wrap gap-2 justify-center max-w-2xl px-4">
          <AnimatePresence>
            {array.map((item, i) => (
              <motion.div
                key={`${item}`}
                layout
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                whileHover={{ y: -5 }}
                onHoverStart={() => setActiveIndex(i)}
                onHoverEnd={() => setActiveIndex(null)}
                className={`w-14 h-14 rounded flex flex-col items-center justify-center font-mono font-bold transition-colors cursor-pointer border relative ${
                  activeIndex === i 
                    ? 'bg-purple-500/20 border-purple-400 text-purple-300' 
                    : 'bg-surface-700 border-surface-600 text-white'
                }`}
              >
                <span className="text-[10px] text-slate-500 absolute top-1 font-sans">{i}</span>
                <span className="mt-2">{item}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          {array.length === 0 && (
            <div className="text-slate-500 italic text-sm w-full text-center py-8">
              Array is empty
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-auto bg-surface-700/50 p-4 rounded-xl border border-white/5 flex gap-4 items-start">
        <Info className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-slate-300">
          <strong className="text-white block mb-1">Time Complexity:</strong>
          Access: <code className="text-purple-400">O(1)</code> | Search: <code className="text-purple-400">O(N)</code> | Insertion (end): <code className="text-purple-400">O(1)</code>
          <p className="mt-2 text-slate-400">Common uses: Storing sequential data, implementing other data structures (Hash Tables, Heaps).</p>
        </div>
      </div>
    </div>
  )
}

export default function Visualize() {
  const [activeTab, setActiveTab] = useState('stack')

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-6 pt-4"
    >
      <div>
        <h1 className="text-3xl font-extrabold text-white">Algorithm <span className="text-brand-400">Visualizer</span></h1>
        <p className="text-slate-400 mt-2">Interactive, visual explanations of popular Data Structures.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-2 flex-shrink-0">
          {STRUCTURES.map(s => {
            const isActive = activeTab === s.id
            const Icon = s.icon
            return (
              <button
                key={s.id}
                onClick={() => setActiveTab(s.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-brand-500/10 border border-brand-500/50 text-brand-400' 
                    : 'bg-surface-800 border border-white/5 text-slate-400 hover:bg-surface-700 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-brand-400' : 'text-slate-500'}`} />
                <span className="font-semibold">{s.name}</span>
              </button>
            )
          })}
        </div>

        {/* Main Area */}
        <div className="flex-1 bg-surface-800 border border-white/10 rounded-2xl p-6 min-h-[500px] flex flex-col relative overflow-hidden shadow-2xl">
          {activeTab === 'stack' && <StackVisualizer />}
          {activeTab === 'queue' && <QueueVisualizer />}
          {activeTab === 'array' && <ArrayVisualizer />}
        </div>
      </div>
    </motion.div>
  )
}
