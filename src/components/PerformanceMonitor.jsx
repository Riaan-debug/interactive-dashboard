import React from 'react'

const PerformanceMonitor = ({ performanceMetrics }) => {
  return (
    <div className="mt-8 animate-slide-up" style={{ animationDelay: '400ms' }}>
      <div className="bg-gradient-to-r from-neutral-50 to-primary-50 dark:from-neutral-800 dark:to-neutral-700 rounded-xl p-6 border border-neutral-200/60 dark:border-neutral-700/60">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            System Performance
          </h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
              <span className="text-neutral-600 dark:text-neutral-400">Monitoring</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-neutral-700 rounded-lg p-4 border border-neutral-200/60 dark:border-neutral-600/60">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">FPS</span>
              <span className="text-lg font-bold text-success-600">{performanceMetrics.fps.toFixed(2)}</span>
            </div>
            <div className="mt-2 w-full bg-neutral-200 dark:bg-neutral-600 rounded-full h-2">
              <div 
                className="bg-success-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((performanceMetrics.fps / 60) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-neutral-700 rounded-lg p-4 border border-neutral-200/60 dark:border-neutral-600/60">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Render Time</span>
              <span className="text-lg font-bold text-primary">{performanceMetrics.renderTime.toFixed(2)}ms</span>
            </div>
            <div className="mt-2 w-full bg-neutral-200 dark:bg-neutral-600 rounded-full h-2">
              <div 
                className="bg-success-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((performanceMetrics.renderTime / 16) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-neutral-700 rounded-lg p-4 border border-neutral-200/60 dark:border-neutral-600/60">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Memory</span>
              <span className="text-lg font-bold text-warning-600">
                {performance.memory && performance.memory.usedJSHeapSize ? `${Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)}MB` : 'N/A'}
              </span>
            </div>
            <div className="mt-2 w-full bg-neutral-200 dark:bg-neutral-600 rounded-full h-2">
              <div 
                className="bg-success-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: performance.memory && performance.memory.usedJSHeapSize && performance.memory.jsHeapSizeLimit 
                    ? `${Math.min((performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100, 100)}%` 
                    : '0%' 
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerformanceMonitor
