import React from 'react'

const DrillDownModal = ({ 
  isOpen, 
  selectedDataPoint, 
  onClose, 
  onExportAnalysis 
}) => {
  if (!isOpen || !selectedDataPoint) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-enterprise-xl p-8 max-w-2xl w-full mx-4 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Data Analysis
          </h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4">
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Period</p>
              <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {selectedDataPoint.label}
              </p>
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4">
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Metric</p>
              <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {selectedDataPoint.metric}
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-accent-50 to-accent-100 dark:from-accent-900/30 dark:to-accent-800/30 rounded-lg p-6">
            <p className="text-sm font-medium text-accent-600 dark:text-accent-400 mb-2">Value</p>
            <p className="text-3xl font-bold text-accent-900 dark:text-accent-100">
              {selectedDataPoint.metric.includes('Revenue') || selectedDataPoint.metric.includes('Profit') 
                ? `R${selectedDataPoint.value.toLocaleString()}` 
                : selectedDataPoint.value.toLocaleString()}
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 py-3 px-4 rounded-lg font-medium hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors duration-200"
            >
              Close
            </button>
            <button
              onClick={onExportAnalysis}
              className="flex-1 bg-accent-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-accent-700 transition-colors duration-200"
            >
              Export Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DrillDownModal
