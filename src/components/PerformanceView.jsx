import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { TrendingUp, Activity, Cpu, HardDrive, Zap, AlertTriangle, CheckCircle, Clock, Gauge } from 'lucide-react'
import SalesChart from './SalesChart'
import BarChart from './BarChart'
import { useSettings } from '../contexts/SettingsContext'

const PerformanceView = () => {
  const { settings } = useSettings()
  // Performance state
  const [performanceMetrics, setPerformanceMetrics] = useState({
    fps: 60,
    renderTime: 16,
    memory: {
      used: 0,
      total: 0,
      limit: 0
    },
    cpu: 0,
    network: {
      requests: 0,
      errors: 0,
      latency: 0
    }
  })

  const [isMonitoring, setIsMonitoring] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h')
  const [performanceHistory, setPerformanceHistory] = useState([])

  // Simulate real-time performance data
  useEffect(() => {
    if (!isMonitoring) return

    const interval = setInterval(() => {
      // Generate data points that align better with grid lines
      const fpsGridValues = [0, 20, 40, 50, 60, 70, 80];
      const renderTimeGridValues = [0, 5, 10, 12, 15, 18, 20, 22, 25, 30];
      
      // Add some randomness but keep values close to grid lines
      const baseFps = fpsGridValues[Math.floor(Math.random() * fpsGridValues.length)];
      const baseRenderTime = renderTimeGridValues[Math.floor(Math.random() * renderTimeGridValues.length)];
      
      // Add small variation (±2 for FPS, ±1 for render time) to make it look natural
      const fps = Math.max(0, Math.min(80, baseFps + (Math.random() * 4 - 2)));
      const renderTime = Math.max(0, Math.min(30, baseRenderTime + (Math.random() * 2 - 1)));
      
      const newMetrics = {
        fps: fps,
        renderTime: renderTime,
        memory: {
          used: Math.floor(Math.random() * 200) + 100, // 100-300MB
          total: 512, // 512MB limit
          limit: 1024 // 1GB limit
        },
        cpu: Math.floor(Math.random() * 30) + 20, // 20-50%
        network: {
          requests: Math.floor(Math.random() * 10) + 5,
          errors: Math.floor(Math.random() * 3),
          latency: Math.floor(Math.random() * 100) + 20 // 20-120ms
        }
      }

      setPerformanceMetrics(newMetrics)
      
      // Add to history
      setPerformanceHistory(prev => {
        const newEntry = {
          timestamp: Date.now(),
          ...newMetrics
        }
        const updated = [...prev, newEntry].slice(-100) // Keep last 100 entries
        return updated
      })
    }, 3000) // Changed from 1000ms to 3000ms for better grid alignment

    return () => clearInterval(interval)
  }, [isMonitoring])

  // Filter performance history based on selected timeframe
  const filteredPerformanceHistory = useMemo(() => {
    if (!performanceHistory.length) return []
    
    const now = Date.now()
    const timeframeMs = {
      '5m': 5 * 60 * 1000,
      '15m': 15 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000
    }
    
    const cutoff = now - timeframeMs[selectedTimeframe]
    return performanceHistory.filter(entry => entry.timestamp >= cutoff)
  }, [performanceHistory, selectedTimeframe])

  // Performance data for charts
  const performanceChartData = useMemo(() => {
    const labels = filteredPerformanceHistory.map(entry => 
      new Date(entry.timestamp).toLocaleTimeString()
    )
    
    return {
      labels,
      datasets: [
        {
          label: 'FPS',
          data: filteredPerformanceHistory.map(entry => entry.fps),
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.4,
          yAxisID: 'y'
        },
        {
          label: 'Render Time (ms)',
          data: filteredPerformanceHistory.map(entry => entry.renderTime),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          yAxisID: 'y1'
        }
      ]
    }
  }, [filteredPerformanceHistory])

  const performanceChartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    layout: {
      padding: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20
      }
    },
    // Add subtle background for visual structure without grid lines
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'FPS'
        },
        min: 0,
        max: 80,
        grid: {
          display: false, // Disabled grid lines for clean appearance
        },
        ticks: {
          padding: 8
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Render Time (ms)'
        },
        min: 0,
        max: 30,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          padding: 8
        }
      },
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time'
        },
        grid: {
          display: false, // Disabled grid lines for clean appearance
        },
        ticks: {
          padding: 8
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          padding: 20,
          usePointStyle: true
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy'
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true
          },
          mode: 'xy',
        }
      }
    }
  }), [])

  // Memory usage chart data
  const memoryChartData = useMemo(() => ({
    labels: ['Used', 'Available', 'Reserved'],
    datasets: [{
      data: [
        performanceMetrics.memory.used,
        performanceMetrics.memory.total - performanceMetrics.memory.used,
        performanceMetrics.memory.limit - performanceMetrics.memory.total
      ],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(156, 163, 175, 0.8)'
      ],
      borderColor: [
        'rgb(59, 130, 246)',
        'rgb(34, 197, 94)',
        'rgb(156, 163, 175)'
      ],
      borderWidth: 2
    }]
  }), [performanceMetrics.memory])

  const memoryChartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 20,
        bottom: 40,
        left: 20,
        right: 20
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return `${context.label}: ${value}MB (${percentage}%)`
          }
        }
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy'
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true
          },
          mode: 'xy',
        }
      }
    }
  }), [])

  // Performance insights
  const performanceInsights = useMemo(() => {
    const insights = []
    
    if (performanceMetrics.fps < 55) {
      insights.push({
        type: 'warning',
        message: 'FPS is below optimal threshold. Consider reducing chart complexity.',
        icon: AlertTriangle,
        color: 'text-warning-600'
      })
    }
    
    if (performanceMetrics.renderTime > 20) {
      insights.push({
        type: 'warning',
        message: 'Render time is high. Check for heavy computations or DOM updates.',
        icon: Clock,
        color: 'text-warning-600'
      })
    }
    
    if (performanceMetrics.memory.used > performanceMetrics.memory.total * 0.8) {
      insights.push({
        type: 'error',
        message: 'Memory usage is high. Consider implementing cleanup strategies.',
        icon: HardDrive,
        color: 'text-red-600'
      })
    }
    
    if (performanceMetrics.cpu > 40) {
      insights.push({
        type: 'info',
        message: 'CPU usage is elevated. Monitor for performance bottlenecks.',
        icon: Cpu,
        color: 'text-primary'
      })
    }
    
    if (insights.length === 0) {
      insights.push({
        type: 'success',
        message: 'All performance metrics are within optimal ranges.',
        icon: CheckCircle,
        color: 'text-success-600'
      })
    }
    
    return insights
  }, [performanceMetrics])

  const toggleMonitoring = useCallback(() => {
    setIsMonitoring(prev => !prev)
  }, [])

  const clearHistory = useCallback(() => {
    setPerformanceHistory([])
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Performance Monitoring
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Real-time system performance metrics and optimization insights
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Timeframe:
              </label>
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-3 py-1 text-sm border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
              >
                <option value="5m">Last 5 minutes</option>
                <option value="15m">Last 15 minutes</option>
                <option value="1h">Last hour</option>
                <option value="6h">Last 6 hours</option>
                <option value="24h">Last 24 hours</option>
              </select>
            </div>
            
            <button
              onClick={toggleMonitoring}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isMonitoring
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
            </button>
            
            <button
              onClick={clearHistory}
              className="px-4 py-2 bg-neutral-500 hover:bg-neutral-600 text-white rounded-lg font-medium transition-all duration-200"
            >
              Clear History
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* FPS */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-enterprise border border-neutral-200/60 dark:border-neutral-700/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${
              performanceMetrics.fps >= 55 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
              performanceMetrics.fps >= 45 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {performanceMetrics.fps >= 55 ? 'Optimal' : performanceMetrics.fps >= 45 ? 'Good' : 'Poor'}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            {performanceMetrics.fps.toFixed(2)}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">Frames Per Second</p>
          <div className="w-full bg-neutral-200 dark:bg-neutral-600 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((performanceMetrics.fps / 60) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Render Time */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-enterprise border border-neutral-200/60 dark:border-neutral-700/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900/20">
              <Clock className="w-6 h-6 text-primary dark:text-primary" />
            </div>
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${
              performanceMetrics.renderTime <= 16 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
              performanceMetrics.renderTime <= 20 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {performanceMetrics.renderTime <= 16 ? 'Optimal' : performanceMetrics.renderTime <= 20 ? 'Good' : 'Poor'}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            {performanceMetrics.renderTime.toFixed(2)}ms
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">Render Time</p>
          <div className="w-full bg-neutral-200 dark:bg-neutral-600 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((performanceMetrics.renderTime / 16) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Memory Usage */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-enterprise border border-neutral-200/60 dark:border-neutral-700/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
              <HardDrive className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${
              performanceMetrics.memory.used < performanceMetrics.memory.total * 0.7 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
              performanceMetrics.memory.used < performanceMetrics.memory.total * 0.85 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {performanceMetrics.memory.used < performanceMetrics.memory.total * 0.7 ? 'Optimal' : 
               performanceMetrics.memory.used < performanceMetrics.memory.total * 0.85 ? 'Good' : 'High'}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            {performanceMetrics.memory.used}MB
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">Memory Used</p>
          <div className="w-full bg-neutral-200 dark:bg-neutral-600 rounded-full h-2">
            <div 
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((performanceMetrics.memory.used / performanceMetrics.memory.total) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* CPU Usage */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-enterprise border border-neutral-200/60 dark:border-neutral-700/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/20">
              <Cpu className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${
              performanceMetrics.cpu <= 30 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
              performanceMetrics.cpu <= 50 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {performanceMetrics.cpu <= 30 ? 'Optimal' : performanceMetrics.cpu <= 50 ? 'Good' : 'High'}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            {performanceMetrics.cpu}%
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">CPU Usage</p>
          <div className="w-full bg-neutral-200 dark:bg-neutral-600 rounded-full h-2">
            <div 
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${performanceMetrics.cpu}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl p-6 border border-primary-200/60 dark:border-primary-700/60 mb-8">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary-900 dark:text-white">
            Performance Summary
          </h3>
          <div className="text-sm text-primary-700 dark:text-gray-200">
            {filteredPerformanceHistory.length} data points • {selectedTimeframe} timeframe
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary dark:text-primary">
              {filteredPerformanceHistory.length > 0 ? Math.round(filteredPerformanceHistory.reduce((sum, entry) => sum + entry.fps, 0) / filteredPerformanceHistory.length) : 0}
            </div>
            <div className="text-sm text-primary-700 dark:text-gray-200">Avg FPS</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary dark:text-primary">
              {filteredPerformanceHistory.length > 0 ? Math.round(filteredPerformanceHistory.reduce((sum, entry) => sum + entry.renderTime, 0) / filteredPerformanceHistory.length) : 0}ms
            </div>
            <div className="text-sm text-primary-700 dark:text-gray-200">Avg Render Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary dark:text-primary">
              {filteredPerformanceHistory.length > 0 ? Math.round(filteredPerformanceHistory.reduce((sum, entry) => sum + entry.cpu, 0) / filteredPerformanceHistory.length) : 0}%
            </div>
            <div className="text-sm text-primary-700 dark:text-gray-200">Avg CPU Usage</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary dark:text-primary">
              {filteredPerformanceHistory.length > 0 ? Math.round(filteredPerformanceHistory.reduce((sum, entry) => sum + entry.memory.used, 0) / filteredPerformanceHistory.length) : 0}MB
            </div>
            <div className="text-sm text-primary-700 dark:text-gray-200">Avg Memory</div>
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Performance Trends */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-enterprise border border-neutral-200/60 dark:border-neutral-700/60 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
            Performance Trends
          </h3>
          <div className="h-96 w-full overflow-hidden px-2">
            <SalesChart
              chartData={performanceChartData}
              chartOptions={performanceChartOptions}
              title=""
              showControls={true}
              showExport={false}
            />
          </div>
        </div>

        {/* Memory Usage */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-enterprise border border-neutral-200/60 dark:border-neutral-700/60 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
            Memory Distribution
          </h3>
          <div className="h-96 w-full overflow-hidden px-2">
            <BarChart
              chartData={memoryChartData}
              chartOptions={memoryChartOptions}
              title=""
              showControls={true}
              showExport={false}
            />
          </div>
        </div>
      </div>

      {/* Network Metrics */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-enterprise border border-neutral-200/60 dark:border-neutral-700/60 p-6 mb-8">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          Network Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900/20 inline-block mb-3">
              <Activity className="w-6 h-6 text-primary dark:text-primary" />
            </div>
            <h4 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {performanceMetrics.network.requests}
            </h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Requests/min</p>
          </div>
          
          <div className="text-center">
            <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20 inline-block mb-3">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h4 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {performanceMetrics.network.errors}
            </h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Errors/min</p>
          </div>
          
          <div className="text-center">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20 inline-block mb-3">
              <Gauge className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {performanceMetrics.network.latency}ms
            </h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Avg Latency</p>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-gradient-to-r from-primary-light to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 rounded-xl p-6 border border-primary-200/60 dark:border-primary-700/60">
        <h3 className="text-lg font-semibold text-primary-900 dark:text-white mb-4">
          Performance Insights
        </h3>
        <div className="space-y-3">
          {performanceInsights.map((insight, index) => {
            const Icon = insight.icon
            return (
              <div key={index} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${insight.color.replace('text-', 'bg-')}`}></div>
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-6 ${insight.color}`} />
                  <p className="text-sm text-primary-800 dark:text-white">
                    {insight.message}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default PerformanceView
