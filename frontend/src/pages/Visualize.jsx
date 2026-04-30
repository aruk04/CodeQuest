import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { Layers, AlignJustify, GripHorizontal, Plus, Minus, ArrowRight, Info, Share2, GitBranch, Table, Trash2, Search, Play, RefreshCcw, Edit3, MoveRight } from 'lucide-react'

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
        await sleep(1200) // Slower comparison
        if (L[i] <= R[j]) {
          arr[k] = L[i]
          i++
        } else {
          arr[k] = R[j]
          j++
        }
        setArray([...arr])
        k++
        await sleep(800) // Slower insertion
      }
      while (i < n1) {
        arr[k] = L[i]
        i++; k++
        setArray([...arr])
        await sleep(800)
      }
      while (j < n2) {
        arr[k] = R[j]
        j++; k++
        setArray([...arr])
        await sleep(800)
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
  const [activeIndex, setActiveIndex] = useState(null)
  const [animating, setAnimating] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [updateIndex, setUpdateIndex] = useState(0)
  const [updateValue, setUpdateValue] = useState('')
  const [insertPos, setInsertPos] = useState(0)
  const [deletePos, setDeletePos] = useState(0)
  const [scale, setScale] = useState(1)
  const [prevIdx, setPrevIdx] = useState(-1)
  const [currIdx, setCurrIdx] = useState(-1)
  const [nextIdx, setNextIdx] = useState(-1)
  const [reversedLinks, setReversedLinks] = useState(new Set())

  const zoomIn = () => setScale(s => Math.min(s + 0.1, 1.5))
  const zoomOut = () => setScale(s => Math.max(s - 0.1, 0.5))
  const resetZoom = () => setScale(1)

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  const traverse = async () => {
    if (animating) return
    setAnimating(true)
    for (let i = 0; i < nodes.length; i++) {
      setActiveIndex(i)
      await sleep(600)
    }
    setActiveIndex(null)
    setAnimating(false)
    toast.success("Traversal complete!")
  }

  const searchNode = async () => {
    if (animating || !searchValue) return
    setAnimating(true)
    const target = parseInt(searchValue)
    let found = false
    for (let i = 0; i < nodes.length; i++) {
      setActiveIndex(i)
      await sleep(600)
      if (nodes[i].val === target) {
        toast.success(`Value ${target} found at index ${i}!`)
        found = true
        break
      }
    }
    if (!found) toast.error("Value not found")
    setActiveIndex(null)
    setAnimating(false)
  }

  const insertAt = async (pos) => {
    if (animating || nodes.length >= 8) return
    setAnimating(true)
    const idx = Math.min(Math.max(0, pos), nodes.length)

    // Animate reaching the position
    for (let i = 0; i < idx; i++) {
      setActiveIndex(i)
      await sleep(300)
    }

    const newNode = { id: Date.now(), val: counter }
    const newNodes = [...nodes]
    newNodes.splice(idx, 0, newNode)
    setNodes(newNodes)
    setCounter(c => c + 10)

    await sleep(500)
    setActiveIndex(null)
    setAnimating(false)
    toast.success(`Inserted at index ${idx}`)
  }

  const deleteAt = async (pos) => {
    if (animating || nodes.length === 0) return
    setAnimating(true)
    const idx = Math.min(Math.max(0, pos), nodes.length - 1)

    for (let i = 0; i <= idx; i++) {
      setActiveIndex(i)
      await sleep(300)
    }

    const newNodes = nodes.filter((_, i) => i !== idx)
    setNodes(newNodes)

    await sleep(500)
    setActiveIndex(null)
    setAnimating(false)
    toast.success(`Deleted from index ${idx}`)
  }

  const updateNode = () => {
    if (animating || !updateValue) return
    const idx = Math.min(Math.max(0, updateIndex), nodes.length - 1)
    const newNodes = [...nodes]
    newNodes[idx].val = parseInt(updateValue)
    setNodes(newNodes)
    toast.success(`Updated index ${idx}`)
  }

  const reverseList = async () => {
    if (animating || nodes.length < 2) return
    setAnimating(true)
    setReversedLinks(new Set())

    let p = -1, c = 0, n = 1

    toast.loading("Starting 3-Pointer Reversal...", { id: 'reverse' })

    while (c < nodes.length && c !== -1) {
      setPrevIdx(p)
      setCurrIdx(c)
      setNextIdx(n)
      await sleep(1500)

      // Flip the link visually
      setReversedLinks(prev => new Set(prev).add(c))
      toast.success(`Flipping link at Node ${c}`, { id: 'reverse' })
      await sleep(1500)

      // Move pointers
      p = c
      c = n
      n = (c !== -1 && c + 1 < nodes.length) ? c + 1 : -1

      setPrevIdx(p)
      setCurrIdx(c)
      setNextIdx(n)
      await sleep(1000)
    }

    toast.success("Finalizing physical reversal...", { id: 'reverse' })
    await sleep(1000)

    const reversed = [...nodes].reverse()
    setNodes(reversed)
    setReversedLinks(new Set())
    setPrevIdx(-1)
    setCurrIdx(-1)
    setNextIdx(-1)

    setAnimating(false)
    toast.success("List Fully Reversed!", { id: 'reverse' })
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Interactive Singly Linked List</h2>
          <p className="text-sm text-slate-400">Step-by-step algorithms & link visualization.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={traverse} disabled={animating} className="btn-ghost text-xs flex items-center gap-1 bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Play className="w-3 h-3" /> Traverse
          </button>
          <button onClick={reverseList} disabled={animating} className="btn-ghost text-xs flex items-center gap-1 bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <RefreshCcw className="w-3 h-3" /> Reverse
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        {/* Visualizer Area */}
        <div className="flex-1 bg-surface-900/50 rounded-2xl border border-white/5 flex flex-col items-center justify-center relative overflow-hidden px-4 min-h-[300px]">
          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 flex gap-2 z-20 bg-surface-950/50 backdrop-blur-sm p-1.5 rounded-xl border border-white/10 shadow-xl">
            <button onClick={zoomOut} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 transition-colors" title="Zoom Out">
              <Minus className="w-4 h-4" />
            </button>
            <button onClick={resetZoom} className="px-2 py-1 text-[10px] font-bold text-slate-300 hover:text-white transition-colors" title="Reset Zoom">
              {Math.round(scale * 100)}%
            </button>
            <button onClick={zoomIn} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 transition-colors" title="Zoom In">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <motion.div
            animate={{ scale }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="flex items-center justify-center min-w-full"
          >
            <Reorder.Group
              axis="x"
              values={nodes}
              onReorder={setNodes}
              className="flex items-center gap-0 min-w-max"
            >
              <AnimatePresence initial={false}>
                {nodes.map((node, i) => {
                  const isActive = activeIndex === i
                  const isPrev = prevIdx === i
                  const isCurr = currIdx === i
                  const isNext = nextIdx === i
                  const isLinkFlipped = reversedLinks.has(i)

                  return (
                    <React.Fragment key={node.id}>
                      <Reorder.Item
                        value={node}
                        drag={!animating}
                        initial={{ opacity: 0, scale: 0.5, x: -50 }}
                        animate={{
                          opacity: 1,
                          scale: (isActive || isCurr) ? 1.15 : 1,
                          x: 0,
                          borderColor: isCurr ? '#2dd4bf' : isPrev ? '#a855f7' : isNext ? '#3b82f6' : 'rgba(45, 212, 191, 0.3)',
                          boxShadow: isCurr ? '0 0 20px rgba(45, 212, 191, 0.4)' : 'none'
                        }}
                        exit={{ opacity: 0, scale: 0, x: 50 }}
                        whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
                        className={`relative group cursor-grab z-10 transition-colors duration-300`}
                      >
                        <div className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center font-mono font-bold text-white border-2 relative transition-all duration-300
                        ${isCurr ? 'bg-teal-500 border-teal-300' : isPrev ? 'bg-purple-500 border-purple-300' : isNext ? 'bg-blue-500 border-blue-300' : 'bg-gradient-to-br from-teal-500 to-emerald-600 border-teal-400/30'}
                      `}>
                          {node.val}
                          <div className="absolute -bottom-6 text-[10px] text-teal-400/60 font-semibold whitespace-nowrap">
                            {i === 0 ? 'Head' : i === nodes.length - 1 ? 'Tail' : `Idx ${i}`}
                          </div>

                          {/* Pointers Labels */}
                          <div className="absolute -top-12 flex flex-col items-center gap-1">
                            {isPrev && <span className="text-[9px] bg-purple-500 text-white px-1 rounded font-bold uppercase">Prev</span>}
                            {isCurr && <span className="text-[9px] bg-teal-500 text-white px-1 rounded font-bold uppercase">Curr</span>}
                            {isNext && <span className="text-[9px] bg-blue-500 text-white px-1 rounded font-bold uppercase">Next</span>}
                            {(isPrev || isCurr || isNext) && <div className={`w-1.5 h-1.5 rotate-45 -mt-0.5 ${isCurr ? 'bg-teal-500' : isPrev ? 'bg-purple-500' : 'bg-blue-500'}`} />}
                          </div>
                        </div>
                      </Reorder.Item>

                      {i < nodes.length - 1 && (
                        <div className="h-1 relative flex items-center justify-center overflow-visible w-10 mx-1">
                          <motion.div
                            animate={{
                              rotateY: isLinkFlipped ? 180 : 0,
                              backgroundColor: isLinkFlipped ? '#a855f7' : '#2dd4bf',
                              opacity: (isCurr || isPrev) ? 1 : 0.3
                            }}
                            className="w-full h-full rounded-full relative"
                          >
                            <ArrowRight className={`w-4 h-4 absolute ${isLinkFlipped ? '-left-2 rotate-180' : '-right-2'} -top-1.5 transition-colors ${isLinkFlipped ? 'text-purple-400' : 'text-teal-500'}`} />
                          </motion.div>
                        </div>
                      )}

                      {i === nodes.length - 1 && (
                        <div className="h-1 bg-slate-700 relative flex items-center justify-center w-10 mx-1">
                          <div className="absolute -right-2 w-2 h-2 rounded-full bg-slate-500" title="Null Pointer" />
                        </div>
                      )}
                    </React.Fragment>
                  )
                })}
              </AnimatePresence>
            </Reorder.Group>
          </motion.div>
          {nodes.length === 0 && (
            <div className="text-slate-500 italic text-sm">List is empty. Add a Head node.</div>
          )}
        </div>

        {/* Control Panel */}
        <div className="w-full lg:w-80 space-y-4 flex-shrink-0 bg-surface-900/40 p-5 rounded-3xl border border-white/10 shadow-inner overflow-y-auto custom-scrollbar max-h-[500px] lg:max-h-none">
          {/* Insertion */}
          <div className="bg-surface-800/50 p-4 rounded-2xl border border-white/5 space-y-3">
            <h3 className="text-[10px] font-bold text-teal-400 uppercase tracking-widest flex items-center gap-2 mb-2">
              <Plus className="w-3.5 h-3.5" /> Insertion
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => insertAt(0)} disabled={animating || nodes.length >= 8} className="btn-ghost py-2 text-[11px] rounded-xl border-white/10 hover:border-teal-500/50 hover:bg-teal-500/10 transition-all">
                At Beginning
              </button>
              <button onClick={() => insertAt(nodes.length)} disabled={animating || nodes.length >= 8} className="btn-ghost py-2 text-[11px] rounded-xl border-white/10 hover:border-teal-500/50 hover:bg-teal-500/10 transition-all">
                At End
              </button>
            </div>
            <div className="flex gap-2 pt-1">
              <input
                type="number"
                placeholder="Pos"
                className="w-16 bg-surface-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-teal-500/50 transition-all"
                value={insertPos}
                onChange={e => setInsertPos(parseInt(e.target.value))}
              />
              <button onClick={() => insertAt(insertPos)} disabled={animating || nodes.length >= 8} className="flex-1 btn-primary py-2 text-xs rounded-xl shadow-lg shadow-teal-500/20">
                Insert at Index
              </button>
            </div>
          </div>

          {/* Deletion */}
          <div className="bg-surface-800/50 p-4 rounded-2xl border border-white/5 space-y-3">
            <h3 className="text-[10px] font-bold text-red-400 uppercase tracking-widest flex items-center gap-2 mb-2">
              <Trash2 className="w-3.5 h-3.5" /> Deletion
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => deleteAt(0)} disabled={animating || nodes.length === 0} className="btn-ghost py-2 text-[11px] rounded-xl border-white/10 hover:border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all">
                From Beginning
              </button>
              <button onClick={() => deleteAt(nodes.length - 1)} disabled={animating || nodes.length === 0} className="btn-ghost py-2 text-[11px] rounded-xl border-white/10 hover:border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all">
                From End
              </button>
            </div>
            <div className="flex gap-2 pt-1">
              <input
                type="number"
                placeholder="Pos"
                className="w-16 bg-surface-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-red-500/50 transition-all"
                value={deletePos}
                onChange={e => setDeletePos(parseInt(e.target.value))}
              />
              <button onClick={() => deleteAt(deletePos)} disabled={animating || nodes.length === 0} className="flex-1 btn-ghost py-2 text-xs rounded-xl border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all">
                Delete at Index
              </button>
            </div>
          </div>

          {/* Search & Update */}
          <div className="bg-surface-800/50 p-4 rounded-2xl border border-white/5 space-y-4">
            <h3 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2 mb-2">
              <Search className="w-3.5 h-3.5" /> Search & Update
            </h3>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Value to find..."
                className="flex-1 bg-surface-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500/50 transition-all"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
              />
              <button onClick={searchNode} disabled={animating || !searchValue} className="btn-primary py-2 px-4 text-xs rounded-xl bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20">
                Find
              </button>
            </div>
            <div className="h-px bg-white/5 mx-2" />
            <div className="grid grid-cols-1 gap-3">
              <div className="flex gap-2">
                <div className="flex-1 space-y-1">
                  <label className="text-[9px] text-slate-500 ml-1 uppercase">Index</label>
                  <input
                    type="number"
                    placeholder="Idx"
                    className="w-full bg-surface-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500/50 transition-all"
                    value={updateIndex}
                    onChange={e => setUpdateIndex(parseInt(e.target.value))}
                  />
                </div>
                <div className="flex-[2] space-y-1">
                  <label className="text-[9px] text-slate-500 ml-1 uppercase">New Value</label>
                  <input
                    type="number"
                    placeholder="New Val"
                    className="w-full bg-surface-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500/50 transition-all"
                    value={updateValue}
                    onChange={e => setUpdateValue(e.target.value)}
                  />
                </div>
              </div>
              <button onClick={updateNode} disabled={animating || !updateValue} className="w-full btn-primary py-2 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20">
                Apply Update
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-surface-700/50 p-3 rounded-xl border border-white/5 flex gap-4 items-start flex-shrink-0">
        <Share2 className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 grid grid-cols-2 md:grid-cols-3 gap-y-1 gap-x-4 w-full">
          <div><span className="text-white font-bold">Traversal:</span> <code className="text-teal-400 ml-1">O(N)</code></div>
          <div><span className="text-white font-bold">Search:</span> <code className="text-teal-400 ml-1">O(N)</code></div>
          <div><span className="text-white font-bold">Insert (Head):</span> <code className="text-teal-400 ml-1">O(1)</code></div>
          <div><span className="text-white font-bold">Insert (Tail):</span> <code className="text-teal-400 ml-1">O(1)*</code></div>
          <div><span className="text-white font-bold">Delete (Mid):</span> <code className="text-teal-400 ml-1">O(N)</code></div>
          <div><span className="text-white font-bold">Reverse:</span> <code className="text-teal-400 ml-1">O(N)</code></div>
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
            className={`h-24 rounded-xl border-2 flex flex-col items-center justify-center p-2 relative overflow-hidden transition-all ${b
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
      className="max-w-8xl mx-auto space-y-8 pt-8 pb-12 px-2 relative"
    >
      {/* Background Mesh */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,#3b82f615_0,transparent_50%),radial-gradient(circle_at_80%_70%,#a855f715_0,transparent_50%)]" />
      </div>

      <div className="relative z-10">
        <h1 className="text-4xl font-black text-white tracking-tight">Algorithm <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-blue">Visualizer</span></h1>
        <p className="text-slate-400 mt-3 text-lg max-w-2xl">Interactive, step-by-step simulations of fundamental Data Structures and Algorithms.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 relative z-10">
        {/* Sidebar */}
        <div className="w-full md:w-72 space-y-3 flex-shrink-0">
          {STRUCTURES.map(s => {
            const isActive = activeTab === s.id
            const Icon = s.icon
            return (
              <button
                key={s.id}
                onClick={() => setActiveTab(s.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group
                  ${isActive
                    ? 'bg-brand-500/10 border-2 border-brand-500/50 text-brand-300 shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                    : 'bg-surface-800/40 border-2 border-white/5 text-slate-500 hover:bg-surface-700/60 hover:text-slate-200 hover:border-white/10'
                  }`}
              >
                <Icon className={`w-6 h-6 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-brand-400' : 'text-slate-600'}`} />
                <span className="font-bold tracking-wide">{s.name}</span>
                {isActive && <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-400" />}
              </button>
            )
          })}
        </div>

        {/* Main Area */}
        <div className="flex-1 bg-surface-800/30 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 min-h-[600px] flex flex-col relative overflow-hidden shadow-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col"
            >
              {activeTab === 'stack' && <StackVisualizer />}
              {activeTab === 'queue' && <QueueVisualizer />}
              {activeTab === 'array' && <ArrayVisualizer />}
              {activeTab === 'linkedlist' && <LinkedListVisualizer />}
              {activeTab === 'binarytree' && <BinaryTreeVisualizer />}
              {activeTab === 'hashtable' && <HashTableVisualizer />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
