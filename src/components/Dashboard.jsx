import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react'
import SalesChart from './SalesChart'
import BarChart from './BarChart'
import DoughnutChart from './DoughnutChart'
import StatsGrid from './StatsGrid'
import PerformanceMonitor from './PerformanceMonitor'
import DrillDownModal from './DrillDownModal'
import ActivityFeed from './ActivityFeed'
import Toast from './Toast'

// Import utilities and data
import { useCountUp } from '../hooks/useCountUp'
import { useSettings } from '../contexts/SettingsContext'
import { stats, activities, salesData, barData, doughnutData } from '../data/dashboardData'
import { createChartOptions, createMultiMetricOptions } from '../utils/chartOptions'
import { createChartData, createMultiMetricData } from '../utils/chartData'

import { exportToExcel as exportExcelUtil, exportToPDF as exportPdfUtil, exportToJSON as exportJsonUtil } from '../utils/exportFunctions'



const Dashboard = () => {
  const { settings } = useSettings()
  
  // State management
  const [selectedPeriod, setSelectedPeriod] = useState(settings.general.defaultPeriod)
  const [selectedMetric, setSelectedMetric] = useState('revenue')

  const [showDrillDown, setShowDrillDown] = useState(false)
  const [selectedDataPoint, setSelectedDataPoint] = useState(null)
  const [showExportOptions, setShowExportOptions] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [showBarExportOptions, setShowBarExportOptions] = useState(false)
  const [isBarExporting, setIsBarExporting] = useState(false)
  // Performance monitoring
  const [performanceMetrics, setPerformanceMetrics] = useState({
    fps: 60,
    renderTime: 16
  })

  // Update selectedPeriod when settings change
  useEffect(() => {
    setSelectedPeriod(settings.general.defaultPeriod)
  }, [settings.general.defaultPeriod])

  // Show toast when settings change (but not on initial load)
  const [showSettingsToast, setShowSettingsToast] = useState(false)
  const settingsRef = useRef(settings)
  
  useEffect(() => {
    // Only show toast if settings actually changed (not on initial load)
    if (settingsRef.current !== settings && JSON.stringify(settingsRef.current) !== JSON.stringify(settings)) {
      setShowSettingsToast(true)
      const timer = setTimeout(() => setShowSettingsToast(false), 3000)
      return () => clearTimeout(timer)
    }
    settingsRef.current = settings
  }, [settings])











  // Memoized chart data and options - made stable to prevent chart resets
  const chartData = useMemo(() =>
    createChartData(selectedPeriod, selectedMetric, salesData, settings.appearance.chartTransparency),
    [selectedPeriod, selectedMetric, salesData, settings.appearance.chartTransparency]
  )

  const chartOptions = useMemo(() =>
    createChartOptions(false, selectedPeriod, selectedMetric, settings.appearance.showGridLines, settings.appearance.chartTransparency),
    [selectedPeriod, selectedMetric, settings.appearance.showGridLines, settings.appearance.chartTransparency]
  )

  const multiMetricData = useMemo(() =>
    createMultiMetricData(selectedPeriod, salesData, settings.appearance.chartTransparency),
    [selectedPeriod, salesData, settings.appearance.chartTransparency]
  )

  const multiMetricOptions = useMemo(() =>
    createMultiMetricOptions(false, settings.appearance.showGridLines, settings.appearance.chartTransparency),
    [settings.appearance.showGridLines, settings.appearance.chartTransparency]
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
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${settings.general.compactMode ? 'py-6' : 'py-8'}`}>
      {/* Header */}
      <div className={settings.general.compactMode ? 'mb-6' : 'mb-8'}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Dashboard
            </h1>
            <p className="text-subheading text-neutral-600 dark:text-neutral-400">
              Real-time insights and analytics overview
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-small text-neutral-500 dark:text-neutral-400">
                Refresh Rate: {settings.general.dashboardRefreshRate}s
              </p>
              <p className="text-small text-neutral-500 dark:text-neutral-400">
                Period: {selectedPeriod}
              </p>
              {settings.general.compactMode && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-small font-medium bg-primary-light text-primary">
                  Compact Mode
                </span>
              )}
            </div>
          </div>
        </div>
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
      <div className={`grid grid-cols-1 lg:grid-cols-3 ${settings.general.compactMode ? 'gap-4 mt-6' : 'gap-6 mt-8'}`}>
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

      {/* Settings Toast */}
      <Toast
        message="Settings applied successfully!"
        type="success"
        isVisible={showSettingsToast}
        onClose={() => setShowSettingsToast(false)}
        duration={3000}
      />
    </div>
  )
}

export default Dashboard
