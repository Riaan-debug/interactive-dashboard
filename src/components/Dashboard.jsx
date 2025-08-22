import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import zoomPlugin from 'chartjs-plugin-zoom'
import ChartJS from 'chart.js/auto'
import { TrendingUp, BarChart3 } from 'lucide-react'

// Import our modular components
import DashboardHeader from './DashboardHeader'
import ChartControls from './ChartControls'
import StatsGrid from './StatsGrid'
import ChartContainer from './ChartContainer'
import PerformanceMonitor from './PerformanceMonitor'
import DrillDownModal from './DrillDownModal'
import ActivityFeed from './ActivityFeed'
import DeviceUsage from './DeviceUsage'

// Import utilities and data
import { useCountUp } from '../hooks/useCountUp'
import { stats, deviceData, activities, salesData, barData, doughnutData } from '../data/dashboardData'
import { createChartOptions, createMultiMetricOptions } from '../utils/chartOptions'
import { createChartData, createMultiMetricData } from '../utils/chartData'
import { handleZoomIn, handleZoomOut, handleResetZoom } from '../utils/zoomControls'
import { exportToExcel, exportToPDF, exportToJSON } from '../utils/exportFunctions'
import { sanitizeInput, rateLimit } from '../utils/security'

// Register Chart.js plugins
ChartJS.register(zoomPlugin)

const Dashboard = () => {
  // State management
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [selectedMetric, setSelectedMetric] = useState('revenue')
  const [realTimeData, setRealTimeData] = useState(false)
  const [showDrillDown, setShowDrillDown] = useState(false)
  const [selectedDataPoint, setSelectedDataPoint] = useState(null)
  const [showExportOptions, setShowExportOptions] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [theme, setTheme] = useState('light')
  
  // Performance monitoring
  const [performanceMetrics, setPerformanceMetrics] = useState({
    fps: 60,
    renderTime: 16
  })
  
  // Refs
  const chartRefs = useRef({})
  const performanceRef = useRef(null)
  const setIsExportingRef = useRef(setIsExporting)
  const setShowExportOptionsRef = useRef(setShowExportOptions)

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem('dashboard-theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [])

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('dashboard-theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }, [theme])

  // Real-time data simulation
  useEffect(() => {
    if (!realTimeData) return
    
    const interval = setInterval(() => {
      setPerformanceMetrics(prev => ({
        fps: Math.floor(Math.random() * 20) + 50,
        renderTime: Math.floor(Math.random() * 10) + 12
      }))
    }, 2000)
    
    return () => clearInterval(interval)
  }, [realTimeData])

  // Performance monitoring
  useEffect(() => {
    let frameCount = 0
    let lastTime = performance.now()
    
    const measurePerformance = () => {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
        const renderTime = performance.now() - currentTime
        
        setPerformanceMetrics({
          fps: Math.max(1, fps),
          renderTime: Math.round(renderTime)
        })
        
        frameCount = 0
        lastTime = currentTime
      }
      
      requestAnimationFrame(measurePerformance)
    }
    
    requestAnimationFrame(measurePerformance)
  }, [])

  // Event handlers
  const handlePeriodChange = useCallback((period) => {
    setSelectedPeriod(period)
  }, [])

  const handleMetricChange = useCallback((metric) => {
    setSelectedMetric(metric)
  }, [])

  const handleRealTimeToggle = useCallback(() => {
    setRealTimeData(prev => !prev)
  }, [])

  const handleDrillDownToggle = useCallback(() => {
    setShowDrillDown(prev => !prev)
  }, [])

  const handleExportToggle = useCallback(() => {
    setShowExportOptions(prev => !prev)
  }, [])

  const handleCloseModal = useCallback(() => {
    setShowDrillDown(false)
    setSelectedDataPoint(null)
  }, [])

  const handleExportAnalysis = useCallback(() => {
    if (selectedDataPoint) {
      exportToExcel(selectedPeriod, selectedMetric, salesData, setIsExportingRef, setShowExportOptionsRef)
    }
  }, [selectedDataPoint, selectedPeriod, selectedMetric])

  // Chart click handler
  const handleChartClick = useCallback((event, elements) => {
    if (!rateLimit('chart-click')) return
    
    if (elements.length > 0) {
      const element = elements[0]
      const dataIndex = element.index
      const datasetIndex = element.datasetIndex
      const dataset = element.chart.data.datasets[datasetIndex]
      
      const sanitizedLabel = sanitizeInput(element.chart.data.labels[dataIndex])
      const sanitizedMetric = sanitizeInput(dataset.label)
      
      setSelectedDataPoint({
        label: sanitizedLabel,
        metric: sanitizedMetric,
        value: dataset.data[dataIndex]
      })
      setShowDrillDown(true)
    }
  }, [])

  // Memoized chart data and options
  const chartData = useMemo(() => 
    createChartData(selectedPeriod, selectedMetric, salesData),
    [selectedPeriod, selectedMetric, salesData]
  )

  const chartOptions = useMemo(() => 
    createChartOptions(realTimeData, selectedPeriod, selectedMetric),
    [realTimeData, selectedPeriod, selectedMetric]
  )

  const multiMetricData = useMemo(() => 
    createMultiMetricData(selectedPeriod, salesData),
    [selectedPeriod, salesData]
  )

  const multiMetricOptions = useMemo(() => 
    createMultiMetricOptions(realTimeData),
    [realTimeData]
  )

  // Export handlers
  const handleExportExcel = useCallback(() => {
    exportToExcel(selectedPeriod, selectedMetric, salesData, setIsExportingRef, setShowExportOptionsRef)
  }, [selectedPeriod, selectedMetric])

  const handleExportPDF = useCallback(() => {
    exportToPDF(selectedPeriod, selectedMetric, salesData, setIsExportingRef, setShowExportOptionsRef)
  }, [selectedPeriod, selectedMetric])

  const handleExportJSON = useCallback(() => {
    exportToJSON(selectedPeriod, selectedMetric, salesData, setIsExportingRef, setShowExportOptionsRef)
  }, [selectedPeriod, selectedMetric])

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    handleZoomIn(chartRefs)
  }, [])

  const handleZoomOut = useCallback(() => {
    handleZoomOut(chartRefs)
  }, [])

  const handleResetZoom = useCallback(() => {
    handleResetZoom(chartRefs)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100/50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <DashboardHeader theme={theme} toggleTheme={toggleTheme} />
        
        {/* Chart Controls */}
        <ChartControls
          selectedPeriod={selectedPeriod}
          selectedMetric={selectedMetric}
          realTimeData={realTimeData}
          showDrillDown={showDrillDown}
          onPeriodChange={handlePeriodChange}
          onMetricChange={handleMetricChange}
          onRealTimeToggle={handleRealTimeToggle}
          onDrillDownToggle={handleDrillDownToggle}
        />
        
        {/* Stats Grid */}
        <StatsGrid stats={stats} useCountUp={useCountUp} />
        
        {/* Main Chart */}
        <ChartContainer
          title="Sales Analytics"
          icon={TrendingUp}
          iconColor="accent"
          chartAnimation={realTimeData}
          showExportOptions={showExportOptions}
          isExporting={isExporting}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetZoom={handleResetZoom}
          onExportToggle={handleExportToggle}
          onExportExcel={handleExportExcel}
          onExportPDF={handleExportPDF}
          onExportJSON={handleExportJSON}
        >
          <div className="h-80">
            {showDrillDown ? (
              <Line
                ref={(el) => { chartRefs.current.mainChart = el }}
                data={multiMetricData}
                options={multiMetricOptions}
                onClick={handleChartClick}
              />
            ) : (
              <Line
                ref={(el) => { chartRefs.current.mainChart = el }}
                data={chartData}
                options={chartOptions}
              />
            )}
          </div>
        </ChartContainer>
        
        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                     {/* Bar Chart */}
           <ChartContainer
             title="Quarterly Performance"
             icon={BarChart3}
             iconColor="success"
             chartAnimation={realTimeData}
             showExportOptions={false}
             isExporting={false}
             onZoomIn={() => {}}
             onZoomOut={() => {}}
             onResetZoom={() => {}}
             onExportToggle={() => {}}
             onExportExcel={() => {}}
             onExportPDF={() => {}}
             onExportJSON={() => {}}
           >
            <div className="h-64">
              <Bar data={barData} options={chartOptions} />
            </div>
          </ChartContainer>
          
          {/* Device Usage */}
          <DeviceUsage
            deviceData={deviceData}
            doughnutData={doughnutData}
            chartOptions={chartOptions}
            chartAnimation={realTimeData}
            useCountUp={useCountUp}
          />
          
          {/* Activity Feed */}
          <ActivityFeed activities={activities} />
        </div>
        
        {/* Performance Monitor */}
        <PerformanceMonitor
          performanceMetrics={performanceMetrics}
          performance={performance}
        />
        
        {/* Drill Down Modal */}
        <DrillDownModal
          isOpen={showDrillDown}
          selectedDataPoint={selectedDataPoint}
          onClose={handleCloseModal}
          onExportAnalysis={handleExportAnalysis}
        />
      </div>
    </div>
  )
}

export default Dashboard
