import React from 'react'

const ChartControls = ({ 
  selectedPeriod, 
  selectedMetric, 
  realTimeData, 
  showDrillDown,
  onPeriodChange, 
  onMetricChange, 
  onRealTimeToggle, 
  onDrillDownToggle 
}) => {
  return (
    <>
      {/* Period Selector */}
      <div className="mb-8 animate-slide-up">
        <div className="period-selector w-fit">
          {['week', 'month', 'year'].map((period) => (
            <button
              key={period}
              onClick={() => onPeriodChange(period)}
              className={`period-button transition-all duration-300 ${
                selectedPeriod === period
                  ? 'period-button-active scale-105'
                  : 'period-button-inactive hover:scale-102'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Selector & Controls */}
      <div className="mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              View by:
            </span>
            <div className="metric-selector w-fit">
              {[
                { key: 'revenue', label: 'Revenue (R)' },
                { key: 'volume', label: 'Volume' }
              ].map((metric) => (
                <button
                  key={metric.key}
                  onClick={() => onMetricChange(metric.key)}
                  className={`period-button transition-all duration-300 ${
                    selectedMetric === metric.key
                      ? 'period-button-active scale-105'
                      : 'period-button-inactive hover:scale-102'
                  }`}
                >
                  {metric.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Advanced Controls */}
          <div className="flex items-center gap-4">
            {/* Real-time Toggle */}
            <button
              onClick={onRealTimeToggle}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                realTimeData
                  ? 'bg-success-600 text-white shadow-md'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {realTimeData ? '🟢 Live Data' : '⚪ Static Data'}
            </button>
            
            {/* Chart Type Toggle */}
            <button
              onClick={onDrillDownToggle}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-accent-100 text-accent-700 hover:bg-accent-200 transition-all duration-300"
            >
              📊 Multi-Metric View
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChartControls
