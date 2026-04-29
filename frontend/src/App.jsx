import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Roadmap from './pages/Roadmap'
import Lesson from './pages/Lesson'
import CodeLab from './pages/CodeLab'
import Profile from './pages/Profile'
import Store from './pages/Store'
import Visualize from './pages/Visualize'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function OnboardedRoute({ children }) {
  const { user } = useAuthStore()
  if (!user?.is_onboarded) return <Navigate to="/onboard" replace />
  return children
}

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#0f172a', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.1)' },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
        }}
      />
      <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Onboarding (auth required, but not onboarded yet) */}
        <Route path="/onboard" element={
          <ProtectedRoute><Onboarding /></ProtectedRoute>
        } />

        {/* Protected + Onboarded */}
        <Route element={
          <ProtectedRoute>
            <OnboardedRoute>
              <Layout />
            </OnboardedRoute>
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/roadmap"   element={<Roadmap />} />
          <Route path="/lesson/:id" element={<Lesson />} />
          <Route path="/code"      element={<CodeLab />} />
          <Route path="/visualize" element={<Visualize />} />
          <Route path="/store"     element={<Store />} />
          <Route path="/profile"   element={<Profile />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}
