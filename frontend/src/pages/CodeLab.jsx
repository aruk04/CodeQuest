import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Code2, Sparkles, ChevronDown, ChevronRight, CheckCircle, Target } from 'lucide-react'
import CodeEditor from '../components/CodeEditor'
import { useProgressStore } from '../store/progressStore'
import { markChallengeSolved } from '../api/progress'
import Mascot from '../components/Mascot'
import { getMascotFeedback } from '../api/ai'
import toast from 'react-hot-toast'

const LANG_STARTERS = {
  python: '# CodeQuest Code Lab 🐍\n# Write your Python code here\n\nprint("Hello, CodeQuest!")\n',
  javascript: '// CodeQuest Code Lab ⚡\n// Write your JavaScript code here\n\nconsole.log("Hello, CodeQuest!");\n',
  cpp: '// CodeQuest Code Lab ⚙️\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, CodeQuest!" << endl;\n    return 0;\n}\n',
  java: '// CodeQuest Code Lab ☕\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, CodeQuest!");\n    }\n}\n',
}

const LANG_LABELS = {
  python: { emoji: '🐍', label: 'Python' },
  javascript: { emoji: '⚡', label: 'JavaScript' },
  cpp: { emoji: '⚙️', label: 'C++' },
  java: { emoji: '☕', label: 'Java' },
}

const PRACTICE_QUESTIONS = {
  beginner: [
    { 
      id: 1, 
      title: 'Two Sum', 
      difficulty: 'Easy',
      description: 'Return indices of the two numbers such that they add up to target.', 
      input: 'nums = [2,7,11,15], target = 9', 
      output: '[0, 1]', 
      xp: 50,
      starterCode: `def twoSum(nums, target):\n    # write your logic here\n    pass\n\n# Test case (Do not modify)\nprint(twoSum([2,7,11,15], 9))\n`
    },
    { 
      id: 2, 
      title: 'Reverse String', 
      difficulty: 'Easy',
      description: 'Write a function that reverses a string.', 
      input: 's = "hello"', 
      output: 'olleh', 
      xp: 30,
      starterCode: `def reverseString(s):\n    # write your logic here\n    pass\n\n# Test case (Do not modify)\nprint(reverseString("hello"))\n`
    },
    { 
      id: 3, 
      title: 'FizzBuzz', 
      difficulty: 'Easy',
      description: 'Return "Fizz" if n is divisible by 3, "Buzz" if by 5, and "FizzBuzz" if both. Else return string of n.', 
      input: 'n = 15', 
      output: 'FizzBuzz', 
      xp: 20,
      starterCode: `def fizzBuzz(n):\n    # write your logic here\n    pass\n\n# Test case (Do not modify)\nprint(fizzBuzz(15))\n`
    },
  ],
  intermediate: [
    { 
      id: 4, 
      title: 'Container With Most Water', 
      difficulty: 'Medium',
      description: 'Find two lines that together with the x-axis form a container, such that the container contains the most water.', 
      input: 'height = [1,8,6,2,5,4,8,3,7]', 
      output: '49', 
      xp: 80,
      starterCode: `def maxArea(height):\n    # write your logic here\n    pass\n\n# Test case (Do not modify)\nprint(maxArea([1,8,6,2,5,4,8,3,7]))\n`
    },
    { 
      id: 5, 
      title: 'Valid Parentheses', 
      difficulty: 'Medium',
      description: 'Given a string containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input is valid.', 
      input: 's = "()[]{}"', 
      output: 'True', 
      xp: 60,
      starterCode: `def isValid(s):\n    # write your logic here\n    pass\n\n# Test case (Do not modify)\nprint(isValid("()[]{}"))\n`
    },
    { 
      id: 6, 
      title: 'Find Minimum in Rotated Array', 
      difficulty: 'Medium',
      description: 'Find the minimum element in a sorted array that has been rotated.', 
      input: 'nums = [3,4,5,1,2]', 
      output: '1', 
      xp: 70,
      starterCode: `def findMin(nums):\n    # write your logic here\n    pass\n\n# Test case (Do not modify)\nprint(findMin([3,4,5,1,2]))\n`
    },
  ],
  advanced: [
    { 
      id: 7, 
      title: 'Trapping Rain Water', 
      difficulty: 'Hard',
      description: 'Given an elevation map where the width of each bar is 1, compute how much water it can trap after raining.', 
      input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', 
      output: '6', 
      xp: 150,
      starterCode: `def trap(height):\n    # write your logic here\n    pass\n\n# Test case (Do not modify)\nprint(trap([0,1,0,2,1,0,1,3,2,1,2,1]))\n`
    },
    { 
      id: 8, 
      title: 'Merge K Sorted Lists', 
      difficulty: 'Hard',
      description: 'Merge k sorted arrays and return it as one sorted array.', 
      input: 'lists = [[1,4,5],[1,3,4],[2,6]]', 
      output: '[1, 1, 2, 3, 4, 4, 5, 6]', 
      xp: 140,
      starterCode: `def mergeKLists(lists):\n    # write your logic here\n    pass\n\n# Test case (Do not modify)\nprint(mergeKLists([[1,4,5],[1,3,4],[2,6]]))\n`
    },
    { 
      id: 9, 
      title: 'Median of Two Sorted Arrays', 
      difficulty: 'Hard',
      description: 'Given two sorted arrays nums1 and nums2, return the median of the two sorted arrays.', 
      input: 'nums1 = [1,3], nums2 = [2]', 
      output: '2.0', 
      xp: 180,
      starterCode: `def findMedianSortedArrays(nums1, nums2):\n    # write your logic here\n    pass\n\n# Test case (Do not modify)\nprint(findMedianSortedArrays([1,3], [2]))\n`
    },
  ]
}

export default function CodeLab() {
  const { roadmap, addXP, solvedChallenges, addSolvedChallenge, setProgress } = useProgressStore()
  const defaultLang = roadmap?.language || 'python'
  const currentQuestions = PRACTICE_QUESTIONS[roadmap?.skill_level] || PRACTICE_QUESTIONS.beginner

  const [selectedLang, setSelectedLang] = useState(defaultLang)
  const [expandedQ, setExpandedQ] = useState(null)
  const [sessionSolved, setSessionSolved] = useState([]) // Local cache for instant visual feedback
  
  // Convert array of solved challenges to a Set of strings for robust checking
  const solvedSet = new Set(solvedChallenges.map(id => String(id)))
  
  console.log('--- CODELAB DIAGNOSTICS ---')
  console.log('Solved Challenges (raw):', solvedChallenges)
  console.log('Solved Set (strings):', Array.from(solvedSet))
  console.log('Current Questions IDs:', currentQuestions.map(q => q.id))
  console.log('Expanded Q ID:', expandedQ)
  
  // Uncontrolled editor state with forced remounts
  const [editorCode, setEditorCode] = useState(LANG_STARTERS[defaultLang])
  const [editorKey, setEditorKey] = useState(0)

  // Mascot State
  const [mascotState, setMascotState] = useState({
    message: "Hi! I'm Codey. Select a challenge or start coding and I'll help you out!",
    emotion: 'idle',
    direction: 'neutral'
  })
  const mascotTimerRef = useRef(null)
  const lastAnalyzedCodeRef = useRef('')

  const updateMascot = async (code, solved = false) => {
    try {
      setMascotState(prev => ({ ...prev, emotion: 'thinking' }))
      const q = currentQuestions.find(x => x.id === expandedQ)
      const res = await getMascotFeedback({
        code,
        language: selectedLang,
        question: q?.title,
        solved
      })
      setMascotState({
        message: res.data.message,
        emotion: res.data.emotion,
        direction: res.data.direction
      })
      lastAnalyzedCodeRef.current = code
    } catch (error) {
      console.error("Mascot feedback failed", error)
      setMascotState(prev => ({ ...prev, emotion: 'idle' }))
    }
  }

  // Optimized mascot feedback while typing
  useEffect(() => {
    if (!expandedQ) return
    
    // Calculate difference from last analyzed code
    const diff = Math.abs(editorCode.length - lastAnalyzedCodeRef.current.length)
    
    if (mascotTimerRef.current) clearTimeout(mascotTimerRef.current)
    
    // Only set timer if change is significant (> 15 chars) or it's the first time
    if (diff > 15 || lastAnalyzedCodeRef.current === '') {
      mascotTimerRef.current = setTimeout(() => {
        const q = currentQuestions.find(x => x.id === expandedQ)
        // Avoid re-analyzing starter code
        if (editorCode !== q?.starterCode) {
          updateMascot(editorCode)
        }
      }, 10000) // 10s debounce
    }

    return () => clearTimeout(mascotTimerRef.current)
  }, [editorCode, expandedQ])

  const handleExpandQuestion = (qId) => {
    if (expandedQ === qId) {
      setExpandedQ(null)
      setEditorCode(LANG_STARTERS[selectedLang])
      setEditorKey(k => k + 1)
    } else {
      setExpandedQ(qId)
      const q = currentQuestions.find(x => x.id === qId)
      if (q) {
        setEditorCode(q.starterCode)
        setSelectedLang('python')
        setEditorKey(k => k + 1)
      }
    }
  }

  const handleRunComplete = async (outputResult) => {
    if (!expandedQ) return // Only verify if a question is actively selected
    
    const currentQ = currentQuestions.find(x => x.id === expandedQ)
    if (!currentQ) return

    // Verify output
    if (outputResult?.stdout) {
      const outText = outputResult.stdout.replace(/\r/g, '').trim().toLowerCase()
      const expectedOutput = currentQ.output.replace(/\r/g, '').trim().toLowerCase()
      
      console.log('--- COMPARISON DEBUG ---')
      console.log('Out:', outText)
      console.log('Expected:', expectedOutput)
      console.log('Match:', outText === expectedOutput)

      if (outText === expectedOutput) {
        // Solved!
        const qId = currentQ.id
        setSessionSolved(prev => [...prev, qId]) // Immediate visual feedback
        
        if (!solvedSet.has(String(qId))) {
          addSolvedChallenge(qId)
          toast.success(`Correct! +${currentQ.xp} XP Claimed!`)
          try {
            const res = await markChallengeSolved({ challenge_id: currentQ.id, xp_reward: currentQ.xp })
            if (res.data) setProgress(res.data)
          } catch (error) {
            console.error("Failed to save progress", error)
          }
        }
        updateMascot(editorCode, true)
      } else {
        toast.error('Incorrect output. Try again!')
        updateMascot(editorCode, false)
      }
    } else if (outputResult?.error) {
      updateMascot(editorCode, false)
    }
  }

  return (
    <div className="space-y-5 page-enter h-full flex flex-col">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Code2 className="w-6 h-6 text-brand-400" /> Code Lab
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Write, run, and debug code with AI assistance
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-accent-purple/10 border border-accent-purple/20 px-3 py-2 rounded-xl">
          <Sparkles className="w-3.5 h-3.5 text-accent-purple" />
          AI Debug powered by Claude
        </div>
      </motion.div>

      {/* Language Selector */}
      <div className="flex gap-2 flex-wrap flex-shrink-0">
        {Object.entries(LANG_LABELS).map(([lang, { emoji, label }]) => (
          <button key={lang} onClick={() => {
              setSelectedLang(lang)
              setEditorCode(LANG_STARTERS[lang])
              setExpandedQ(null) // deselect practice question if language changes
              setEditorKey(k => k + 1)
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all
              ${selectedLang === lang
                ? 'border-brand-500 bg-brand-500/20 text-brand-300'
                : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/25 hover:text-white'
              }`}>
            <span className="text-base">{emoji}</span> {label}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Sidebar */}
        <div className="lg:w-1/3 space-y-4 overflow-y-auto pr-2 custom-scrollbar flex flex-col">
          {/* Mascot Section */}
          <div className="mb-2">
            <Mascot {...mascotState} />
          </div>

          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-brand-400" /> Practice Challenges
          </h2>
          
          <div className="space-y-3">
            {currentQuestions.map(q => {
              const isExpanded = expandedQ === q.id
              const isSolved = solvedSet.has(String(q.id)) || sessionSolved.includes(q.id)
              return (
                <div key={q.id} className="glass rounded-xl border border-white/10 overflow-hidden">
                  <button 
                    onClick={() => handleExpandQuestion(q.id)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3 text-left">
                      {isSolved ? (
                        <CheckCircle className="w-5 h-5 text-brand-400" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-600" />
                      )}
                      <div>
                        <div className="font-semibold text-white text-sm">{q.title}</div>
                        <div className={`text-xs ${q.difficulty === 'Easy' ? 'text-brand-400' : 'text-amber-400'}`}>
                          {q.difficulty} • {q.xp} XP
                        </div>
                      </div>
                    </div>
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0 }} 
                        animate={{ height: 'auto' }} 
                        exit={{ height: 0 }}
                        className="overflow-hidden bg-black/20"
                      >
                        <div className="p-4 border-t border-white/5 space-y-3">
                          <p className="text-sm text-slate-300">{q.description}</p>
                          <div className="bg-surface-900 rounded p-2 text-xs font-mono text-slate-400 border border-white/5">
                            <span className="text-brand-400">Input:</span> {q.input}
                            <br />
                            <span className="text-accent-purple">Expected Output:</span> {q.output}
                          </div>
                          
                          <div className="w-full py-2 rounded-lg text-xs font-medium text-center border border-white/5 bg-surface-800 text-slate-400">
                            {isSolved ? '✅ Challenge Solved!' : '✏️ Write code & click "Run" to verify'}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>

        {/* Editor */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="lg:w-2/3 h-[60vh] lg:h-full">
          <CodeEditor
            key={editorKey}
            language={selectedLang}
            initialCode={editorCode}
            onCodeChange={setEditorCode}
            onRunComplete={handleRunComplete}
          />
        </motion.div>
      </div>
    </div>
  )
}
