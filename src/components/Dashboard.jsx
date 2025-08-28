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
  // Performance monitoring
  const [performanceMetrics, setPerformanceMetrics] = useState({
    fps: 60,
    renderTime: 16
  })











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
