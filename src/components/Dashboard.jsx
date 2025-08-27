import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react'
import SalesChart from './SalesChart'
import BarChart from './BarChart'
import DoughnutChart from './DoughnutChart'
import StatsGrid from './StatsGrid'
import PerformanceMonitor from './PerformanceMonitor'
import DrillDownModal from './DrillDownModal'
import ActivityFeed from './ActivityFeed'

// Import utilities and data
import { useCountUp } from '../hooks/useCountUp'
import { stats, activities, salesData, barData, doughnutData } from '../data/dashboardData'
import { createChartOptions, createMultiMetricOptions } from '../utils/chartOptions'
import { createChartData, createMultiMetricData } from '../utils/chartData'

import { exportToExcel as exportExcelUtil, exportToPDF as exportPdfUtil, exportToJSON as exportJsonUtil } from '../utils/exportFunctions'



const Dashboard = () => {
  // State management
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [selectedMetric, setSelectedMetric] = useState('revenue')

  const [showDrillDown, setShowDrillDown] = useState(false)
  const [selectedDataPoint, setSelectedDataPoint] = useState(null)
  const [showExportOptions, setShowExportOptions] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [showBarExportOptions, setShowBarExportOptions] = useState(false)
  const [isBarExporting, setIsBarExporting] = useState(false)
  const [theme, setTheme] = useState('light')

  // Performance monitoring
  const [performanceMetrics, setPerformanceMetrics] = useState({
    fps: 60,
    renderTime: 16
  })



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











  // Memoized chart data and options - made stable to prevent chart resets
  const chartData = useMemo(() =>
    createChartData(selectedPeriod, selectedMetric, salesData),
    [selectedPeriod, selectedMetric]
  )

  const chartOptions = useMemo(() =>
    createChartOptions(false, selectedPeriod, selectedMetric),
    [selectedPeriod, selectedMetric]
  )

  const multiMetricData = useMemo(() =>
    createMultiMetricData(selectedPeriod, salesData),
    [selectedPeriod]
  )

  const multiMetricOptions = useMemo(() =>
    createMultiMetricOptions(false),
    []
  )

  // Export handlers - moved here after chartData is declared
  const handleExportExcel = useCallback(async () => {
    setIsExporting(true)
    try {
      await exportExcelUtil(selectedPeriod, selectedMetric, salesData, { current: setIsExporting }, { current: setShowExportOptions })
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
      setShowExportOptions(false)
    }
  }, [selectedPeriod, selectedMetric, salesData])

  const handleExportPDF = useCallback(async () => {
    setIsExporting(true)
    try {
      await exportPdfUtil(selectedPeriod, selectedMetric, salesData, { current: setIsExporting }, { current: setShowExportOptions })
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
      setShowExportOptions(false)
    }
  }, [selectedPeriod, selectedMetric, salesData])

  const handleExportJSON = useCallback(async () => {
    setIsExporting(true)
    try {
      await exportJsonUtil(selectedPeriod, selectedMetric, salesData, { current: setIsExporting }, { current: setShowExportOptions })
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
      setShowExportOptions(false)
    }
  }, [selectedPeriod, selectedMetric, salesData])



  const handleBarExportExcel = useCallback(async () => {
    setIsBarExporting(true)
    try {
      await exportExcelUtil(selectedPeriod, selectedMetric, salesData, { current: setIsBarExporting }, { current: setShowBarExportOptions })
    } catch (error) {
      console.error('Bar chart export failed:', error)
    } finally {
      setIsBarExporting(false)
      setShowBarExportOptions(false)
    }
  }, [selectedPeriod, selectedMetric, salesData])

  const handleBarExportPDF = useCallback(async () => {
    setIsBarExporting(true)
    try {
      await exportPdfUtil(selectedPeriod, selectedMetric, salesData, { current: setIsBarExporting }, { current: setShowBarExportOptions })
    } catch (error) {
      console.error('Bar chart export failed:', error)
    } finally {
      setIsBarExporting(false)
      setShowBarExportOptions(false)
    }
  }, [selectedPeriod, selectedMetric, salesData])

  const handleBarExportJSON = useCallback(async () => {
    setIsBarExporting(true)
    try {
      await exportJsonUtil(selectedPeriod, selectedMetric, salesData, { current: setIsBarExporting }, { current: setShowBarExportOptions })
    } catch (error) {
      console.error('Bar chart export failed:', error)
    } finally {
      setIsBarExporting(false)
      setShowBarExportOptions(false)
    }
  }, [selectedPeriod, selectedMetric, salesData])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Theme Toggle */}
      <div className="flex justify-end mb-6">
        <button
          onClick={toggleTheme}
          className="p-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-lg transition-all duration-300 hover:scale-105"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <svg className="h-5 w-5 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            <svg className="h-5 w-5 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </button>
      </div>



      {/* Stats Grid */}
      <StatsGrid stats={stats} useCountUp={useCountUp} />

      {/* Main Chart */}
      {showDrillDown ? (
        <SalesChart
          chartData={multiMetricData}
          chartOptions={multiMetricOptions}
          title="Sales Analytics (Drill Down)"
          icon={TrendingUp}
          iconColor="accent"
          showControls={true}
          showExport={true}
          onExportExcel={handleExportExcel}
          onExportPDF={handleExportPDF}
          onExportJSON={handleExportJSON}
        />
      ) : (
        <SalesChart
          chartData={chartData}
          chartOptions={chartOptions}
          title="Sales Analytics"
          icon={TrendingUp}
          iconColor="accent"
          showControls={true}
          showExport={true}
          onExportExcel={handleExportExcel}
          onExportPDF={handleExportPDF}
          onExportJSON={handleExportJSON}
        />
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Bar Chart */}
        <BarChart
          chartData={barData}
          chartOptions={chartOptions}
          title="Quarterly Performance"
          icon={BarChart3}
          iconColor="success"
          showControls={true}
          showExport={true}
          onExportExcel={handleBarExportExcel}
          onExportPDF={handleBarExportPDF}
          onExportJSON={handleBarExportJSON}
        />

        {/* Device Usage */}
        <DoughnutChart
          chartData={doughnutData}
          chartOptions={chartOptions}
          title="Device Usage"
          icon={PieChart}
          iconColor="info"
          showControls={true}
          showExport={true}
          onExportExcel={handleExportExcel}
          onExportPDF={handleExportPDF}
          onExportJSON={handleExportJSON}
        />

        {/* Activity Feed */}
        <ActivityFeed activities={activities} />
      </div>

      {/* Performance Monitor */}
      <PerformanceMonitor
        performanceMetrics={performanceMetrics}
      />

      {/* Drill Down Modal */}
      <DrillDownModal
        isOpen={showDrillDown}
        selectedDataPoint={selectedDataPoint}
        onClose={() => {
          setShowDrillDown(false)
          setSelectedDataPoint(null)
        }}
        onExportAnalysis={() => {
          if (selectedDataPoint) {
            handleExportExcel()
          }
        }}
      />
    </div>
  )
}

export default Dashboard
