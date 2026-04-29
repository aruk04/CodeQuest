import React, { useState, useEffect } from 'react'
import Editor, { useMonaco } from '@monaco-editor/react'
import { Play, RotateCcw, Bug, Loader2, Palette } from 'lucide-react'
import { runCode } from '../api/code'
import { debugCode } from '../api/ai'
import { setTheme } from '../api/store'
import { getMe } from '../api/auth'
import { THEMES } from '../pages/Store'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import { defineMonacoThemes } from '../utils/monacoThemes'

const LANG_CONFIG = {
  python:     { monacoLang: 'python',  icon: '🐍', boilerplate: '# Write your Python code here\nprint("Hello, World!")\n' },
  javascript: { monacoLang: 'javascript', icon: '⚡', boilerplate: '// Write your JavaScript code here\nconsole.log("Hello, World!");\n' },
  cpp:        { monacoLang: 'cpp',     icon: '⚙️', boilerplate: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}\n' },
  java:       { monacoLang: 'java',    icon: '☕', boilerplate: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n' },
}

export default function CodeEditor({ language = 'python', initialCode = '', onCodeChange, onRunComplete }) {
  const config = LANG_CONFIG[language] || LANG_CONFIG.python
  const { user, updateUser } = useAuthStore()
  const activeTheme = user?.profile?.active_theme || 'vs-dark'
  const unlockedThemes = user?.profile?.unlocked_themes || ['vs-dark']
  const monaco = useMonaco()

  useEffect(() => {
    if (monaco && activeTheme) {
      defineMonacoThemes(monaco)
      monaco.editor.setTheme(activeTheme)
    }
  }, [monaco, activeTheme])
  
  const [code, setCode] = useState(initialCode || config.boilerplate)

  const [stdin, setStdin] = useState('')
  const [output, setOutput] = useState(null)
  const [debugResult, setDebugResult] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isDebugging, setIsDebugging] = useState(false)
  const [tab, setTab] = useState('output')

  const handleEditorWillMount = (monaco) => {
    defineMonacoThemes(monaco)
  }

  const handleRun = async () => {
    setIsRunning(true)
    setOutput(null)
    setDebugResult(null)
    try {
      const res = await runCode({ code, language, stdin })
      setOutput(res.data)
      setTab('output')
      onRunComplete?.(res.data)
    } catch {
      toast.error('Code execution failed')
    } finally {
      setIsRunning(false)
    }
  }

  const handleDebug = async () => {
    setIsDebugging(true)
    try {
      const res = await debugCode({
        code,
        language,
        error_message: output?.error || '',
      })
      setDebugResult(res.data)
      setTab('debug')
      
      const resProfile = await getMe()
      updateUser(resProfile.data)
    } catch (err) {
      console.error(err)
      if (err.response?.status === 403) {
        toast.error(err.response.data.detail, { duration: 5000 })
      } else {
        toast.error('Debug failed')
      }
    } finally {
      setIsDebugging(false)
    }
  }

  const handleChange = (val) => {
    const newVal = val || ''
    setCode(newVal)
    onCodeChange?.(newVal)
  }

  const handleThemeChange = async (e) => {
    const newTheme = e.target.value
    try {
      await setTheme(newTheme)
      const res = await getMe()
      updateUser(res.data)
      toast.success('Theme applied!')
    } catch (err) {
      toast.error('Failed to apply theme')
    }
  }

  return (
    <div className="flex flex-col h-full bg-surface-900 rounded-xl border border-white/10 overflow-hidden relative shadow-2xl">
      {/* Top Bar */}
      <div className="h-12 bg-surface-800 border-b border-white/5 flex items-center justify-between px-4 select-none">
        <div className="flex items-center gap-2">
          <span className="text-lg">{config.icon}</span>
          <span className="font-semibold text-white/90 text-sm">main.{config.monacoLang === 'python' ? 'py' : config.monacoLang === 'javascript' ? 'js' : config.monacoLang}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <Palette className="w-3.5 h-3.5 text-slate-400" />
            <select 
              value={activeTheme} 
              onChange={handleThemeChange}
              className="bg-surface-700 text-xs text-white border border-white/10 rounded px-2 py-1 outline-none"
            >
              {THEMES.filter(t => unlockedThemes.includes(t.id) || t.cost === 0).map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setCode(config.boilerplate)}
            className="btn-ghost text-xs px-2.5 py-1.5 flex items-center gap-1"
            title="Reset code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          
          {(() => {
            const used = user?.profile?.ai_hints_used_today || 0
            const bonus = user?.profile?.bonus_hints || 0
            const freeLeft = Math.max(0, 3 - used)
            
            let badgeText = `${freeLeft}/3 Free`
            if (freeLeft === 0) {
              badgeText = bonus > 0 ? `${bonus} Bonus` : '0 Left'
            }

            return (
              <button
                onClick={handleDebug}
                disabled={isDebugging}
                className="btn-ghost text-xs px-2.5 py-1.5 flex items-center gap-1 text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
                title="Use AI to debug your code"
              >
                {isDebugging ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Bug className="w-3.5 h-3.5" />}
                Debug <span className="text-[10px] bg-amber-400/20 px-1.5 py-0.5 rounded ml-1">{badgeText}</span>
              </button>
            )
          })()}

          <button
            onClick={handleRun}
            disabled={isRunning}
            className="btn-primary text-xs px-4 py-1.5 flex items-center gap-1.5"
          >
            {isRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            Run
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-[300px]">
        <Editor
          height="100%"
          language={config.monacoLang}
          value={code}
          onChange={handleChange}
          beforeMount={handleEditorWillMount}
          theme={activeTheme}
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontLigatures: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            renderLineHighlight: 'line',
            cursorBlinking: 'smooth',
            smoothScrolling: true,
            padding: { top: 12 },
            tabSize: 4,
          }}
        />
      </div>

      {/* Stdin */}
      <div className="px-4 py-2 bg-surface-800 border-t border-white/10">
        <input
          className="input py-1.5 text-xs"
          placeholder="Standard input (stdin)..."
          value={stdin}
          onChange={(e) => setStdin(e.target.value)}
        />
      </div>

      {/* Output Tabs */}
      <div className="border-t border-white/10">
        <div className="flex border-b border-white/10">
          {['output', 'debug'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-xs font-semibold capitalize transition-colors
                ${tab === t ? 'text-brand-400 border-b-2 border-brand-400 -mb-px' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="p-3 min-h-[120px] max-h-[200px] overflow-y-auto bg-black/30 font-mono text-xs">
          <AnimatePresence mode="wait">
            {tab === 'output' && output && (
              <motion.div key="out" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className={`text-xs font-semibold mb-2 ${
                  output.status_id === 3 ? 'text-brand-400' : 'text-red-400'
                }`}>
                  ● {output.status}
                  {output.time && <span className="text-slate-500 ml-2">({output.time}s)</span>}
                </div>
                {output.stdout && <pre className="text-slate-200 whitespace-pre-wrap">{output.stdout}</pre>}
                {output.error && <pre className="text-red-400 whitespace-pre-wrap">{output.error}</pre>}
              </motion.div>
            )}
            {tab === 'debug' && debugResult && (
              <motion.div key="dbg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <div>
                  <div className="text-amber-400 font-semibold mb-1">🐛 Issues Found:</div>
                  {debugResult.issues?.map((issue, i) => (
                    <p key={i} className="text-red-300">• {issue}</p>
                  ))}
                </div>
                <div>
                  <div className="text-brand-400 font-semibold mb-1">✅ Fixed Code:</div>
                  <pre className="text-slate-200 bg-black/20 rounded p-2 overflow-x-auto">{debugResult.fixed_code}</pre>
                </div>
                {debugResult.tips?.length > 0 && (
                  <div>
                    <div className="text-blue-400 font-semibold mb-1">💡 Tips:</div>
                    {debugResult.tips.map((tip, i) => (
                      <p key={i} className="text-slate-300">• {tip}</p>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
            {!output && !debugResult && (
              <p className="text-slate-600 italic">Run your code to see output here...</p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
