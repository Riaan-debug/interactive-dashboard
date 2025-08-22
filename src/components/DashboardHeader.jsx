import React from 'react'
import { BarChart3, Moon, Sun } from 'lucide-react'

const DashboardHeader = ({ theme, toggleTheme }) => {
  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent-100 rounded-lg">
            <BarChart3 className="h-6 w-6 text-accent-600" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
            Analytics Dashboard
          </h1>
        </div>
        
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-lg transition-all duration-300 hover:scale-105"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
          ) : (
            <Sun className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
          )}
        </button>
      </div>
      <p className="text-neutral-600 dark:text-neutral-400 text-lg">
        Comprehensive business intelligence and performance analytics dashboard
      </p>
    </div>
  )
}

export default DashboardHeader
