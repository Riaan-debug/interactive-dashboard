import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import AnalyticsView from './components/AnalyticsView'
import PerformanceView from './components/PerformanceView'
import ExportView from './components/ExportView'
import SettingsView from './components/SettingsView'
import Navigation from './components/Navigation'
import { ThemeProvider } from './contexts/ThemeContext'
import { SettingsProvider } from './contexts/SettingsContext'



// Breadcrumb Component
const Breadcrumb = () => {
  const location = useLocation()
  const pathSegments = location.pathname.split('/').filter(Boolean)
  
  if (pathSegments.length === 0) return null
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/" className="text-neutral-500 dark:text-neutral-400 hover:text-primary">
              Home
            </Link>
          </li>
          {pathSegments.map((segment, index) => (
            <li key={segment} className="flex items-center">
              <svg className="h-4 w-4 text-neutral-400 dark:text-neutral-500 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-neutral-900 dark:text-neutral-100 capitalize">
                {segment}
              </span>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}

// Main App Component
const App = () => {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <Router>
          <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
            <Navigation />
            <Breadcrumb />
            <main>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/analytics" element={<AnalyticsView />} />
                <Route path="/export" element={<ExportView />} />
                <Route path="/performance" element={<PerformanceView />} />
                <Route path="/settings" element={<SettingsView />} />
              </Routes>
            </main>
          </div>
        </Router>
      </SettingsProvider>
    </ThemeProvider>
  )
}

// Placeholder Route Components (we'll build these next)

export default App
