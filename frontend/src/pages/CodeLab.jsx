import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Code2, Sparkles, ChevronDown, ChevronRight, CheckCircle, Target } from 'lucide-react'
import CodeEditor from '../components/CodeEditor'
import { useProgressStore } from '../store/progressStore'
import { markChallengeSolved } from '../api/progress'
import Mascot from '../components/Mascot'
import Markdown from '../components/Markdown'
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
      description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.', 
      xp: 50,
      testCases: [
        { input: '[2,7,11,15], 9', output: '[0, 1]' },
        { input: '[3,2,4], 6', output: '[1, 2]' },
        { input: '[3,3], 6', output: '[0, 1]' }
      ],
      starterCode: `def twoSum(nums, target):\n    # Write your logic here\n    pass\n`
    },
    { 
      id: 2, 
      title: 'Reverse String', 
      difficulty: 'Easy',
      description: 'Write a function that reverses a string.', 
      xp: 30,
      testCases: [
        { input: '"hello"', output: 'olleh' },
        { input: '"Hannah"', output: 'hannaH' },
        { input: '"CodeQuest"', output: 'tseuQedoC' }
      ],
      starterCode: `def reverseString(s):\n    # Write your logic here\n    pass\n`
    },
    { 
      id: 3, 
      title: 'FizzBuzz', 
      difficulty: 'Easy',
      description: 'Return "Fizz" if `n` is divisible by 3, "Buzz" if by 5, and "FizzBuzz" if both. Else return string of `n`.', 
      xp: 20,
      testCases: [
        { input: '15', output: 'FizzBuzz' },
        { input: '3', output: 'Fizz' },
        { input: '5', output: 'Buzz' },
        { input: '7', output: '7' }
      ],
      starterCode: `def fizzBuzz(n):\n    # Write your logic here\n    pass\n`
    },
  ],
  intermediate: [
    { 
      id: 4, 
      title: 'Valid Parentheses', 
      difficulty: 'Medium',
      description: 'Given a string containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.', 
      xp: 80,
      testCases: [
        { input: '"()"', output: 'True' },
        { input: '"()[]{}"', output: 'True' },
        { input: '"(]"', output: 'False' },
        { input: '"([)]"', output: 'False' }
      ],
      starterCode: `def isValid(s):\n    # Write your logic here\n    pass\n`
    },
    { 
      id: 5, 
      title: 'Find Minimum in Rotated Array', 
      difficulty: 'Medium',
      description: 'Find the minimum element in a sorted array that has been rotated.', 
      xp: 70,
      testCases: [
        { input: '[3,4,5,1,2]', output: '1' },
        { input: '[4,5,6,7,0,1,2]', output: '0' },
        { input: '[11,13,15,17]', output: '11' }
      ],
      starterCode: `def findMin(nums):\n    # Write your logic here\n    pass\n`
    },
  ],
  advanced: [
    { 
      id: 7, 
      title: 'Merge K Sorted Lists', 
      difficulty: 'Hard',
      description: 'Merge $k$ sorted arrays and return it as one sorted array.', 
      xp: 150,
      testCases: [
        { input: '[[1,4,5],[1,3,4],[2,6]]', output: '[1, 1, 2, 3, 4, 4, 5, 6]' },
        { input: '[]', output: '[]' },
        { input: '[[]]', output: '[]' }
      ],
      starterCode: `def mergeKLists(lists):\n    # Write your logic here\n    pass\n`
    }
  ]
}

export default function CodeLab() {
  const { roadmap, addXP, solvedChallenges, addSolvedChallenge, setProgress } = useProgressStore()
  const defaultLang = roadmap?.language || 'python'
  const currentQuestions = PRACTICE_QUESTIONS[roadmap?.skill_level] || PRACTICE_QUESTIONS.beginner

  const [selectedLang, setSelectedLang] = useState(defaultLang)
  const [expandedQ, setExpandedQ] = useState(null)
  const [sessionSolved, setSessionSolved] = useState([])
  const [isValidating, setIsValidating] = useState(false)
  const [testResults, setTestResults] = useState(null) // Array of { input, expected, actual, passed }
  
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
      setTestResults(null)
      setEditorKey(k => k + 1)
    } else {
      setExpandedQ(qId)
      setTestResults(null)
      const q = currentQuestions.find(x => x.id === qId)
      if (q) {
        setEditorCode(q.starterCode)
        setSelectedLang('python')
        setEditorKey(k => k + 1)
      }
    }
  }

  const handleValidate = async () => {
    if (!expandedQ) return
    const q = currentQuestions.find(x => x.id === expandedQ)
    if (!q) return

    setIsValidating(true)
    setTestResults(null)
    
    try {
      // 1. Prepare test runner code
      const funcName = q.starterCode.match(/def (\w+)/)?.[1] || q.title.toLowerCase().replace(/ /g, '')
      let runnerCode = editorCode + "\n\nprint('---TEST_START---')\n"
      
      q.testCases.forEach((tc, i) => {
        runnerCode += `print(${funcName}(${tc.input}))\n`
      })

      // 2. Run code
      const { runCode } = await import('../api/code')
      const res = await runCode({ code: runnerCode, language: selectedLang })
      
      if (res.data.error) {
        toast.error("Execution Error: " + res.data.error)
        setTestResults(q.testCases.map(tc => ({ ...tc, actual: 'ERROR', passed: false })))
        return
      }

      // 3. Parse output
      const stdout = res.data.stdout || ""
      const parts = stdout.split('---TEST_START---')
      if (parts.length < 2) throw new Error("Invalid output format")
      
      const outputs = parts[1].trim().split('\n').map(line => line.trim())
      
      const results = q.testCases.map((tc, i) => {
        const actual = outputs[i] || "N/A"
        // Flexible comparison: remove quotes and spaces
        const normalize = (s) => String(s).replace(/['"]/g, '').replace(/\s/g, '').toLowerCase()
        const passed = normalize(actual) === normalize(tc.output)
        return { ...tc, actual, passed }
      })

      setTestResults(results)
      const allPassed = results.every(r => r.passed)

      if (allPassed) {
        setSessionSolved(prev => [...prev, q.id])
        if (!solvedSet.has(String(q.id))) {
          addSolvedChallenge(q.id)
          toast.success(`Success! All ${results.length} test cases passed! +${q.xp} XP`)
          const resProg = await markChallengeSolved({ challenge_id: q.id, xp_reward: q.xp })
          if (resProg.data) setProgress(resProg.data)
        }
        updateMascot(editorCode, true)
      } else {
        toast.error(`${results.filter(r => !r.passed).length} test cases failed.`)
        updateMascot(editorCode, false)
      }
    } catch (error) {
      console.error(error)
      toast.error("Validation failed. Check your syntax.")
    } finally {
      setIsValidating(false)
    }
  }

  const handleRunComplete = async (outputResult) => {
    // When a question is selected, we prefer using handleValidate
    // but we'll still trigger mascot feedback for general runs.
    if (expandedQ) {
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
                        <div className="p-4 border-t border-white/5 space-y-4">
                          <Markdown content={q.description} className="text-sm text-slate-300" />
                          
                          {/* Test Cases UI */}
                          <div className="space-y-2">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                              <span>Test Cases</span>
                              <span>{testResults ? `${testResults.filter(r => r.passed).length}/${q.testCases.length} Passed` : ''}</span>
                            </div>
                            
                            <div className="space-y-1.5">
                              {(testResults || q.testCases).map((tc, i) => {
                                const result = testResults?.[i]
                                return (
                                  <div key={i} className={`p-2 rounded-lg border text-xs font-mono transition-colors ${
                                    result ? (result.passed ? 'bg-brand-500/10 border-brand-500/30' : 'bg-red-500/10 border-red-500/30') : 'bg-surface-900 border-white/5'
                                  }`}>
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-slate-400">Case {i + 1}</span>
                                      {result && (
                                        <span className={result.passed ? 'text-brand-400' : 'text-red-400'}>
                                          {result.passed ? '✓ Pass' : '✗ Fail'}
                                        </span>
                                      )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <div className="text-[9px] text-slate-500">Input</div>
                                        <div className="truncate text-slate-300">{tc.input}</div>
                                      </div>
                                      <div>
                                        <div className="text-[9px] text-slate-500">Expected</div>
                                        <div className="truncate text-slate-300">{tc.output}</div>
                                      </div>
                                    </div>
                                    {result && !result.passed && (
                                      <div className="mt-1 pt-1 border-t border-white/5">
                                        <div className="text-[9px] text-red-400/70">Actual Output</div>
                                        <div className="text-red-300 truncate">{result.actual}</div>
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                          
                          <button 
                            onClick={handleValidate}
                            disabled={isValidating || isSolved}
                            className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                              isSolved 
                                ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30 cursor-default' 
                                : 'bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/20'
                            }`}
                          >
                            {isValidating ? (
                              <><span className="animate-spin text-lg">⚙️</span> Validating...</>
                            ) : isSolved ? (
                              <><CheckCircle className="w-4 h-4" /> Solved</>
                            ) : (
                              'Submit Solution'
                            )}
                          </button>
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
