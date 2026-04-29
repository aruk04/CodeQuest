import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import AIChatPanel from './AIChatPanel'
import { getProgressSummary, getStreak } from '../api/progress'
import { useProgressStore } from '../store/progressStore'

export default function Layout() {
  const { setProgress } = useProgressStore()

  useEffect(() => {
    const load = async () => {
      try {
        const [prog, streak] = await Promise.all([getProgressSummary(), getStreak()])
        setProgress({ ...prog.data, streak: streak.data.streak, longest_streak: streak.data.longest_streak })
      } catch { /* silent */ }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-mesh bg-surface-950">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6 page-enter">
        <Outlet />
      </main>
      <AIChatPanel />
    </div>
  )
}
