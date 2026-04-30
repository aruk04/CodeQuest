import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function Markdown({ content, className = '' }) {
  return (
    <div className={`md-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <div className="my-4 rounded-xl overflow-hidden border border-white/5 shadow-2xl">
                <div className="bg-surface-800 px-4 py-1.5 flex items-center justify-between border-b border-white/5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{match[1]}</span>
                </div>
                <SyntaxHighlighter
                  {...props}
                  style={atomDark}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    borderRadius: 0,
                    padding: '1.25rem',
                    fontSize: '0.85rem',
                    background: 'transparent'
                  }}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className={`${className} bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono text-brand-300`} {...props}>
                {children}
              </code>
            )
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
