import React, { useState } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { Layers, AlignJustify, GripHorizontal, Plus, Minus, ArrowRight, Info, Share2, GitBranch, Table, Trash2, Search } from 'lucide-react'

// Basic DSA structures we will visualize
const STRUCTURES = [
  { id: 'stack', name: 'Stack', icon: Layers, desc: 'LIFO (Last In, First Out). Like a stack of plates.' },
  { id: 'queue', name: 'Queue', icon: AlignJustify, desc: 'FIFO (First In, First Out). Like a line at a store.' },
  { id: 'array', name: 'Array', icon: GripHorizontal, desc: 'Contiguous memory blocks. Random access in O(1).' },
  { id: 'linkedlist', name: 'Linked List', icon: Share2, desc: 'Nodes connected by pointers. Easy insertion/deletion.' },
  { id: 'binarytree', name: 'Binary Tree', icon: GitBranch, desc: 'Hierarchical structure where each node has max 2 children.' },
  { id: 'hashtable', name: 'Hash Table', icon: Table, desc: 'Key-value pairs using a hash function for O(1) average access.' }
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
  const [array, setArray] = useState([40, 10, 50, 20, 30])
  const [counter, setCounter] = useState(60)
  const [activeIndex, setActiveIndex] = useState(null)
  const [comparing, setComparing] = useState([])
  const [sorting, setSorting] = useState(false)
  const [searchingValue, setSearchingValue] = useState('')
  const [foundIndex, setFoundIndex] = useState(null)
  
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  const insert = () => {
    if (array.length >= 10 || sorting) return
    setArray(prev => [...prev, Math.floor(Math.random() * 90) + 10])
    setFoundIndex(null)
  }
  
  const removeAt = (index) => {
    if (sorting) return
    setArray(prev => prev.filter((_, i) => i !== index))
    setFoundIndex(null)
  }

  const handleSearch = () => {
    const val = parseInt(searchingValue)
    const idx = array.indexOf(val)
    setFoundIndex(idx !== -1 ? idx : -2)
    setTimeout(() => setFoundIndex(null), 2000)
  }

  const bubbleSort = async () => {
    setSorting(true)
    let arr = [...array]
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        setComparing([j, j + 1])
        await sleep(600)
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
          setArray([...arr])
          await sleep(600)
        }
      }
    }
    setComparing([])
    setSorting(false)
    toast.success('Array Sorted!')
  }

  const selectionSort = async () => {
    setSorting(true)
    let arr = [...array]
    for (let i = 0; i < arr.length; i++) {
      let minIdx = i
      for (let j = i + 1; j < arr.length; j++) {
        setComparing([i, j])
        await sleep(400)
        if (arr[j] < arr[minIdx]) {
          minIdx = j
        }
      }
      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
        setArray([...arr])
        await sleep(600)
      }
    }
    setComparing([])
    setSorting(false)
    toast.success('Array Sorted!')
  }

  const mergeSort = async () => {
    setSorting(true)
    let arr = [...array]
    
    const merge = async (l, m, r) => {
      let n1 = m - l + 1
      let n2 = r - m
      let L = new Array(n1)
      let R = new Array(n2)
      for (let i = 0; i < n1; i++) L[i] = arr[l + i]
      for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j]

      let i = 0, j = 0, k = l
      while (i < n1 && j < n2) {
        setComparing([k, m + 1 + j])
        await sleep(600)
        if (L[i] <= R[j]) {
          arr[k] = L[i]
          i++
        } else {
          arr[k] = R[j]
          j++
        }
        setArray([...arr])
        k++
        await sleep(400)
      }
      while (i < n1) {
        arr[k] = L[i]
        i++; k++
        setArray([...arr])
        await sleep(400)
      }
      while (j < n2) {
        arr[k] = R[j]
        j++; k++
        setArray([...arr])
        await sleep(400)
      }
    }

    const sort = async (l, r) => {
      if (l >= r) return
      let m = l + Math.floor((r - l) / 2)
      await sort(l, m)
      await sort(m + 1, r)
      await merge(l, m, r)
    }

    await sort(0, arr.length - 1)
    setComparing([])
    setSorting(false)
    toast.success('Array Sorted!')
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Array</h2>
          <p className="text-sm text-slate-400">Sorting & Interactive Manipulation.</p>
        </div>
        <div className="flex gap-2">
          {!sorting && (
            <>
              <div className="flex bg-surface-900 rounded-lg overflow-hidden border border-white/10 mr-2 group relative">
                <div className="absolute -top-8 left-0 bg-surface-700 text-[10px] text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">
                  Search Value
                </div>
                <input 
                  type="number" 
                  placeholder="Val"
                  className="w-12 bg-transparent px-2 text-xs text-white outline-none"
                  value={searchingValue}
                  onChange={e => setSearchingValue(e.target.value)}
                />
                <button onClick={handleSearch} className="p-2 hover:bg-white/5 text-purple-400 transition-colors" title="Search value in array">
                  <Search className="w-4 h-4" />
                </button>
              </div>
              <button onClick={bubbleSort} className="btn-ghost text-xs border border-brand-500/30 text-brand-400 hover:bg-brand-500/10">
                Bubble Sort
              </button>
              <button onClick={selectionSort} className="btn-ghost text-xs border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10">
                Selection Sort
              </button>
              <button onClick={mergeSort} className="btn-ghost text-xs border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                Merge Sort
              </button>
              <button onClick={insert} disabled={array.length >= 10} className="btn-primary flex items-center gap-2 text-xs">
                <Plus className="w-3 h-3" /> Append
              </button>
            </>
          )}
          {sorting && (
            <div className="flex items-center gap-2 text-brand-400 animate-pulse text-sm font-bold">
              Sorting in progress...
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center py-10 overflow-hidden">
        <div className="flex items-end gap-2 justify-center h-48 px-4">
          <AnimatePresence>
            {array.map((item, i) => {
              const isComparing = comparing.includes(i)
              const isFound = foundIndex === i
              return (
                <motion.div
                  key={`${item}-${i}`}
                  layout
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    height: `${(item / 100) * 160 + 40}px`,
                    backgroundColor: isFound ? '#22c55e' : isComparing ? '#a855f7' : '#1e293b',
                    borderColor: isFound ? '#22c55e' : isComparing ? '#a855f7' : '#334155'
                  }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="w-12 rounded-t-lg flex flex-col items-center justify-end pb-3 font-mono font-bold transition-all border relative shadow-xl overflow-hidden group cursor-pointer"
                >
                  <span className="text-[10px] text-white/80">{item}</span>
                  {!sorting && (
                    <button 
                      onClick={() => removeAt(i)}
                      className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="mt-auto bg-surface-700/50 p-4 rounded-xl border border-white/5 flex gap-4 items-start">
        <Info className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-slate-300">
          <strong className="text-white block mb-1 text-xs uppercase tracking-wider opacity-60">Visual sorting</strong>
          Merge Sort: <code className="text-emerald-400">O(N log N)</code> | Others: <code className="text-brand-400">O(N²)</code>
          <p className="mt-2 text-slate-400">Watch the elements swap in real-time. Highlights indicate comparisons.</p>
        </div>
      </div>
    </div>
  )
}

function LinkedListVisualizer() {
  const [nodes, setNodes] = useState([
    { id: 1, val: 10 },
    { id: 2, val: 20 },
    { id: 3, val: 30 }
  ])
  const [counter, setCounter] = useState(40)

  const addNode = () => {
    if (nodes.length >= 8) return
    const newNode = { id: Date.now(), val: counter }
    setNodes(prev => [...prev, newNode])
    setCounter(c => c + 10)
  }

  const insertAfter = (idx) => {
    if (nodes.length >= 8) return
    const newNode = { id: Date.now(), val: counter }
    const newNodes = [...nodes]
    newNodes.splice(idx + 1, 0, newNode)
    setNodes(newNodes)
    setCounter(c => c + 10)
  }

  const removeNode = (id) => {
    setNodes(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Singly Linked List</h2>
          <p className="text-sm text-slate-400">Drag nodes to reorder. Click '+' to insert in middle.</p>
        </div>
        <button onClick={addNode} disabled={nodes.length >= 8} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Append Node
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center py-10 overflow-x-auto custom-scrollbar">
        <Reorder.Group 
          axis="x" 
          values={nodes} 
          onReorder={setNodes}
          className="flex items-center gap-0 min-w-max px-8"
        >
          <AnimatePresence initial={false}>
            {nodes.map((node, i) => (
              <React.Fragment key={node.id}>
                <Reorder.Item
                  value={node}
                  initial={{ opacity: 0, scale: 0.5, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0, x: 20 }}
                  whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
                  className="relative group cursor-grab z-10"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex flex-col items-center justify-center font-mono font-bold text-white shadow-xl border border-teal-400/30 relative">
                    {node.val}
                    <div className="absolute -bottom-6 text-[10px] text-teal-400/60 font-semibold whitespace-nowrap">
                      {i === 0 ? 'Head' : i === nodes.length - 1 ? 'Tail' : `Node ${i}`}
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        removeNode(node.id)
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110"
                    >
                      <Trash2 className="w-3 h-3 text-white" />
                    </button>
                    {/* Drag Handle Overlay */}
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 rounded-lg pointer-events-none flex items-center justify-center">
                      <div className="w-4 h-6 flex flex-col justify-between opacity-30">
                        <div className="h-0.5 w-full bg-white rounded-full" />
                        <div className="h-0.5 w-full bg-white rounded-full" />
                        <div className="h-0.5 w-full bg-white rounded-full" />
                      </div>
                    </div>
                  </div>
                </Reorder.Item>
                
                {i < nodes.length - 1 && (
                  <div className="h-1 bg-teal-500/30 relative flex items-center justify-center overflow-visible w-12 group/arrow mx-1">
                    <ArrowRight className="w-4 h-4 text-teal-500 absolute -right-2" />
                    {/* Insertion Button */}
                    <button 
                      onClick={() => insertAfter(i)}
                      className="absolute z-20 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover/arrow:opacity-100 transition-all hover:scale-125 shadow-lg border border-teal-300"
                      title="Insert node here"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {i === nodes.length - 1 && (
                   <div className="h-1 bg-slate-700 relative flex items-center justify-center w-10 mx-1">
                     <div className="absolute -right-2 w-2 h-2 rounded-full bg-slate-500" title="Null Pointer" />
                   </div>
                )}
              </React.Fragment>
            ))}
          </AnimatePresence>
        </Reorder.Group>
        {nodes.length === 0 && (
          <div className="text-slate-500 italic text-sm">List is empty. Add a Head node.</div>
        )}
      </div>

      <div className="mt-auto bg-surface-700/50 p-4 rounded-xl border border-white/5 flex gap-4 items-start">
        <Share2 className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-slate-300">
          <strong className="text-white block mb-1">Interactive Features:</strong>
          <p className="mb-2">Drag nodes to reorder pointers. Use the <span className="text-teal-400 font-bold">+</span> button on arrows to demonstrate middle insertion.</p>
          Complexity: Insert <code className="text-teal-400">O(1)</code> | Search <code className="text-teal-400">O(N)</code>
        </div>
      </div>
    </div>
  )
}

function BinaryTreeVisualizer() {
  const [tree, setTree] = useState({
    val: 50,
    left: { val: 30, left: { val: 20 }, right: { val: 40 } },
    right: { val: 70, left: { val: 60 }, right: { val: 80 } }
  })

  const TreeNode = ({ node, level = 0 }) => {
    if (!node) return null
    return (
      <div className="flex flex-col items-center">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }}
          className="w-12 h-12 rounded-full bg-indigo-600 border-2 border-indigo-400 flex items-center justify-center text-white font-bold text-sm shadow-lg mb-2 z-10"
        >
          {node.val}
        </motion.div>
        <div className="flex gap-4 md:gap-8 relative">
          {node.left && (
            <div className="relative">
              <div className="absolute top-[-10px] right-[-10px] w-10 h-10 border-t-2 border-l-2 border-indigo-500/30 -rotate-45" />
              <TreeNode node={node.left} level={level + 1} />
            </div>
          )}
          {node.right && (
            <div className="relative">
              <div className="absolute top-[-10px] left-[-10px] w-10 h-10 border-t-2 border-r-2 border-indigo-500/30 rotate-45" />
              <TreeNode node={node.right} level={level + 1} />
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Binary Search Tree</h2>
          <p className="text-sm text-slate-400">Hierarchical data structure.</p>
        </div>
      </div>

      <div className="flex-1 flex items-start justify-center pt-8 overflow-auto custom-scrollbar">
        <TreeNode node={tree} />
      </div>

      <div className="mt-auto bg-surface-700/50 p-4 rounded-xl border border-white/5 flex gap-4 items-start">
        <GitBranch className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-slate-300">
          <strong className="text-white block mb-1">Complexity:</strong>
          Search (Balanced): <code className="text-indigo-400">O(log N)</code> | Insertion: <code className="text-indigo-400">O(log N)</code>
          <p className="mt-2 text-slate-400">BSTs allow for fast lookup, addition and removal of items.</p>
        </div>
      </div>
    </div>
  )
}

function HashTableVisualizer() {
  const [buckets, setBuckets] = useState([
    { key: 'name', val: 'Alice' },
    null,
    { key: 'city', val: 'NY' },
    null,
    { key: 'role', val: 'Admin' },
    null,
    null,
    { key: 'age', val: '25' }
  ])

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Hash Table</h2>
          <p className="text-sm text-slate-400">Key-Value mapping using a Hash Function.</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 items-center justify-center">
        {buckets.map((b, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className={`h-24 rounded-xl border-2 flex flex-col items-center justify-center p-2 relative overflow-hidden transition-all ${
              b 
                ? 'bg-orange-500/10 border-orange-500/50 text-orange-200' 
                : 'bg-surface-900/50 border-white/5 text-slate-600'
            }`}
          >
            <span className="absolute top-1 left-2 text-[10px] font-mono opacity-50">[{i}]</span>
            {b ? (
              <>
                <span className="text-[10px] uppercase font-bold text-orange-500/70">{b.key}</span>
                <span className="font-mono text-sm">{b.val}</span>
              </>
            ) : (
              <span className="text-xs italic">Empty</span>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-auto bg-surface-700/50 p-4 rounded-xl border border-white/5 flex gap-4 items-start">
        <Table className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-slate-300">
          <strong className="text-white block mb-1">Complexity:</strong>
          Access/Insert: <code className="text-orange-400">O(1) Avg</code> | Collision: <code className="text-orange-400">O(N) Worst</code>
          <p className="mt-2 text-slate-400">Hash tables use a hash function to compute an index into an array of buckets.</p>
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
          {activeTab === 'linkedlist' && <LinkedListVisualizer />}
          {activeTab === 'binarytree' && <BinaryTreeVisualizer />}
          {activeTab === 'hashtable' && <HashTableVisualizer />}
        </div>
      </div>
    </motion.div>
  )
}
