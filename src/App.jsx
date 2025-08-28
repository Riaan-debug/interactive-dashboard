import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import AnalyticsView from './components/AnalyticsView'
import PerformanceView from './components/PerformanceView'

// Navigation Component
const Navigation = () => {
  const location = useLocation()
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/analytics', label: 'Analytics', icon: '📈' },
    { path: '/performance', label: 'Performance', icon: '⚡' },
    { path: '/export', label: 'Export', icon: '📤' },
    { path: '/settings', label: 'Settings', icon: '⚙️' }
  ]

  return (
    <nav className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-accent-600 dark:text-accent-400">
                Interactive Dashboard
              </h1>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300'
                      : 'text-neutral-600 dark:text-neutral-300 hover:text-accent-600 dark:hover:text-accent-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-neutral-600 dark:text-neutral-300 hover:text-accent-600 dark:hover:text-accent-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

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
            <Link to="/" className="text-neutral-500 dark:text-neutral-400 hover:text-accent-600 dark:hover:text-accent-400">
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
    <Router>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <Navigation />
        <Breadcrumb />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<AnalyticsView />} />
            <Route path="/performance" element={<PerformanceView />} />
            <Route path="/export" element={<ExportView />} />
            <Route path="/settings" element={<SettingsView />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

// Placeholder Route Components (we'll build these next)

const ExportView = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="text-center">
      <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
        📤 Export Tools
      </h2>
      <p className="text-neutral-600 dark:text-neutral-400">
        Advanced data export capabilities coming soon...
      </p>
    </div>
  </div>
)

const SettingsView = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="text-center">
      <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
        ⚙️ Settings
      </h2>
      <p className="text-neutral-600 dark:text-neutral-400">
        Dashboard configuration options coming soon...
      </p>
    </div>
  </div>
)

export default App
