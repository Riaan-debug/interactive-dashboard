import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom'
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Activity,
  Monitor,
  Smartphone,
  Tablet,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  FileText,
  FileSpreadsheet,
  Moon,
  Sun
} from 'lucide-react'

// Import export libraries
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

// Security utility functions
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  // Remove potentially dangerous characters and scripts
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .trim()
}

const validateData = (data) => {
  if (!data || typeof data !== 'object') return false
  // Add more validation as needed
  return true
}

const rateLimit = (() => {
  const requests = new Map()
  const maxRequests = 100 // Max requests per minute
  const windowMs = 60000 // 1 minute window
  
  return (identifier) => {
    const now = Date.now()
    const userRequests = requests.get(identifier) || []
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => now - time < windowMs)
    
    if (validRequests.length >= maxRequests) {
      return false // Rate limited
    }
    
    validRequests.push(now)
    requests.set(identifier, validRequests)
    return true // Allowed
  }
})()



ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin
)

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [selectedMetric, setSelectedMetric] = useState('revenue') // New state for metric selection
  const [animateStats, setAnimateStats] = useState(false)
  const [chartAnimation, setChartAnimation] = useState(false)
  const [countedValues, setCountedValues] = useState({})
  const [selectedDataPoint, setSelectedDataPoint] = useState(null)
  const [showDrillDown, setShowDrillDown] = useState(false)
  const [realTimeData, setRealTimeData] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [showExportOptions, setShowExportOptions] = useState(false)
  const [performanceMetrics, setPerformanceMetrics] = useState({ fps: 60, renderTime: 0 })
  const [theme, setTheme] = useState('light')
  // Refs for chart instances and performance monitoring
  const chartRefs = useRef({})
  const performanceRef = useRef(null)

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem('dashboard-theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [])

  // Trigger animations after component mounts
  useEffect(() => {
    const timer = setTimeout(() => setAnimateStats(true), 100)
    const chartTimer = setTimeout(() => setChartAnimation(true), 300)
    return () => {
      clearTimeout(timer)
      clearTimeout(chartTimer)
    }
  }, [])

  // Theme toggle function
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('dashboard-theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }, [theme])

  // Custom hook for smooth counting animations
  const useCountUp = (endValue, duration = 2000, delay = 0) => {
    const [count, setCount] = useState(0)
    const startTime = useRef(null)
    const animationFrame = useRef(null)

    useEffect(() => {
      const timer = setTimeout(() => {
        startTime.current = Date.now()
        const animate = () => {
          const now = Date.now()
          const elapsed = now - startTime.current
          const progress = Math.min(elapsed / duration, 1)
          
          // Easing function for smooth animation
          const easeOutQuart = 1 - Math.pow(1 - progress, 4)
          const currentCount = Math.floor(easeOutQuart * endValue)
          
          setCount(currentCount)
          
          if (progress < 1) {
            animationFrame.current = requestAnimationFrame(animate)
          }
        }
        animate()
      }, delay)

      return () => {
        clearTimeout(timer)
        if (animationFrame.current) {
          cancelAnimationFrame(animationFrame.current)
        }
      }
    }, [endValue, duration, delay])

    return count
  }

  // Sample data for demonstration - in production, this would come from an API
  const salesData = {
    week: {
      revenue: [120, 190, 30, 50, 20, 30, 70],
      volume: [12, 19, 3, 5, 2, 3, 7],
      profit: [20, 35, 5, 8, 3, 5, 12],
      customers: [8, 15, 2, 4, 1, 2, 6]
    },
    month: {
      revenue: [650, 590, 800, 810, 560, 550, 400, 450, 670, 780, 890, 900, 670, 780, 890, 900, 670, 780, 890, 900, 670, 780, 890, 900, 670, 780, 890, 900, 670, 780],
      volume: [65, 59, 80, 81, 56, 55, 40, 45, 67, 78, 89, 90, 67, 78, 89, 90, 67, 78, 89, 90, 67, 78, 89, 90, 67, 78, 89, 90, 67, 78],
      profit: [110, 100, 136, 138, 95, 94, 68, 77, 114, 133, 151, 153, 114, 133, 151, 153, 114, 133, 151, 153, 114, 133, 151, 153, 114, 133, 151, 153, 114, 133],
      customers: [45, 41, 56, 57, 39, 38, 28, 32, 47, 55, 63, 64, 47, 55, 63, 64, 47, 55, 63, 64, 47, 55, 63, 64, 47, 55, 63, 64, 47, 55]
    },
    year: {
      revenue: [1200, 1900, 3000, 5000, 2000, 3000, 7000, 8000, 9000, 10000, 11000, 12000],
      volume: [120, 190, 300, 500, 200, 300, 700, 800, 900, 1000, 1100, 1200],
      profit: [204, 323, 510, 850, 340, 510, 1190, 1360, 1530, 1700, 1870, 2040],
      customers: [84, 133, 210, 350, 140, 210, 490, 560, 630, 700, 770, 840]
    }
  }

  // Performance monitoring for optimization insights
  useEffect(() => {
    let frameCount = 0
    let lastTime = performance.now()
    
    const measurePerformance = () => {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
        const renderTime = performance.now() - currentTime
        
        setPerformanceMetrics({ fps, renderTime: Math.round(renderTime) })
        frameCount = 0
        lastTime = currentTime
      }
      
      performanceRef.current = requestAnimationFrame(measurePerformance)
    }
    
    performanceRef.current = requestAnimationFrame(measurePerformance)
    
    return () => {
      if (performanceRef.current) {
        cancelAnimationFrame(performanceRef.current)
      }
    }
  }, [])



  // Close export options when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showExportOptions && !event.target.closest('.export-button')) {
        setShowExportOptions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showExportOptions])

  // Real-time data simulation for demonstration
  useEffect(() => {
    if (realTimeData) {
      const interval = setInterval(() => {
        // Simulate real-time updates for demonstration purposes
        const randomUpdate = Math.floor(Math.random() * 50) + 10
        setCountedValues(prev => ({
          ...prev,
          realTimeUpdate: randomUpdate
        }))
      }, 3000)
      
      return () => clearInterval(interval)
    }
  }, [realTimeData])

  // Enhanced period switching with smooth transitions
  const handlePeriodChange = (newPeriod) => {
    if (newPeriod !== selectedPeriod) {
      setChartAnimation(false)
      setSelectedPeriod(newPeriod)
      // Re-trigger chart animation after period change
      setTimeout(() => setChartAnimation(true), 100)
    }
  }

  // Enhanced metric switching with smooth transitions
  const handleMetricChange = useCallback((newMetric) => {
    if (newMetric !== selectedMetric) {
      setChartAnimation(false)
      setSelectedMetric(newMetric)
      // Re-trigger chart animation after metric change
      setTimeout(() => setChartAnimation(true), 100)
    }
  }, [selectedMetric])

  // Enhanced export functionality with security measures
  const exportToExcel = useCallback(async () => {
    if (isExporting) return
    
    // Rate limiting check
    if (!rateLimit('export-excel')) {
      console.warn('Export rate limit exceeded')
      return
    }
    
    setIsExporting(true)
    try {
      // Validate data before export
      if (!validateData(salesData[selectedPeriod])) {
        throw new Error('Invalid data for export')
      }
      
      // Prepare data for Excel
      const worksheetData = []
      
      // Add headers
      const headers = ['Period', 'Revenue (R)', 'Volume', 'Profit (R)', 'Customers']
      worksheetData.push(headers)
      
      // Add data rows with sanitized labels
      const labels = selectedPeriod === 'week' 
        ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        : selectedPeriod === 'month'
        ? Array.from({length: 30}, (_, i) => i + 1)
        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      
      labels.forEach((label, index) => {
        worksheetData.push([
          sanitizeInput(String(label)),
          salesData[selectedPeriod].revenue[index] || 0,
          salesData[selectedPeriod].volume[index] || 0,
          salesData[selectedPeriod].profit[index] || 0,
          salesData[selectedPeriod].customers[index] || 0
        ])
      })
      
      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
      
      // Add worksheet to workbook with sanitized name
      const sheetName = sanitizeInput(`${selectedPeriod}-${selectedMetric}`).substring(0, 31) // Excel sheet name limit
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
      
      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      
      // Download file with sanitized filename
      const filename = sanitizeInput(`${selectedPeriod}-${selectedMetric}-data.xlsx`)
      saveAs(data, filename)
      
    } catch (error) {
      console.error('Excel export failed:', error)
    } finally {
      setIsExporting(false)
      setShowExportOptions(false)
    }
  }, [selectedPeriod, selectedMetric, salesData])

  const exportToPDF = useCallback(async () => {
    if (isExporting) return
    
    // Rate limiting check
    if (!rateLimit('export-pdf')) {
      console.warn('Export rate limit exceeded')
      return
    }
    
    setIsExporting(true)
    try {
      // Validate data before export
      if (!validateData(salesData[selectedPeriod])) {
        throw new Error('Invalid data for export')
      }
      
      // Create PDF document
      const doc = new jsPDF()
      
      // Add title with sanitized text
      doc.setFontSize(20)
      doc.text(sanitizeInput('Analytics Dashboard Report'), 20, 20)
      
      // Add subtitle with sanitized text
      doc.setFontSize(14)
      const periodText = sanitizeInput(selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1))
      const metricText = sanitizeInput(selectedMetric)
      doc.text(`Period: ${periodText} | Metric: ${metricText}`, 20, 35)
      
      // Add summary stats
      doc.setFontSize(12)
      doc.text('Summary Statistics:', 20, 50)
      
      const totalRevenue = salesData[selectedPeriod].revenue.reduce((a, b) => a + b, 0)
      const totalVolume = salesData[selectedPeriod].volume.reduce((a, b) => a + b, 0)
      const totalProfit = salesData[selectedPeriod].profit.reduce((a, b) => a + b, 0)
      const totalCustomers = salesData[selectedPeriod].customers.reduce((a, b) => a + b, 0)
      
      doc.text(`Total Revenue: R${totalRevenue.toLocaleString()}`, 20, 65)
      doc.text(`Total Volume: ${totalVolume.toLocaleString()} units`, 20, 75)
      doc.text(`Total Profit: R${totalProfit.toLocaleString()}`, 20, 85)
      doc.text(`Total Customers: ${totalCustomers.toLocaleString()}`, 20, 95)
      
      // Add data table
      const tableData = []
      const labels = selectedPeriod === 'week' 
        ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        : selectedPeriod === 'month'
        ? Array.from({length: 30}, (_, i) => i + 1)
        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      
      labels.forEach((label, index) => {
        tableData.push([
          label,
          `R${(salesData[selectedPeriod].revenue[index] || 0).toLocaleString()}`,
          (salesData[selectedPeriod].volume[index] || 0).toLocaleString(),
          `R${(salesData[selectedPeriod].profit[index] || 0).toLocaleString()}`,
          (salesData[selectedPeriod].customers[index] || 0).toLocaleString()
        ])
      })
      
      autoTable(doc, {
        head: [['Period', 'Revenue (R)', 'Volume', 'Profit (R)', 'Customers']],
        body: tableData,
        startY: 110,
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
      })
      
      // Download PDF
      doc.save(`${selectedPeriod}-${selectedMetric}-report.pdf`)
      
    } catch (error) {
      console.error('PDF export failed:', error)
    } finally {
      setIsExporting(false)
      setShowExportOptions(false)
    }
  }, [selectedPeriod, selectedMetric, salesData])

  const exportToJSON = useCallback(async () => {
    if (isExporting) return
    
    // Rate limiting check
    if (!rateLimit('export-json')) {
      console.warn('Export rate limit exceeded')
      return
    }
    
    setIsExporting(true)
    try {
      // Validate data before export
      if (!validateData(salesData[selectedPeriod])) {
        throw new Error('Invalid data for export')
      }
      
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Create a download link for the chart data
      const dataStr = JSON.stringify(salesData[selectedPeriod], null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      
      // Sanitize filename
      const filename = sanitizeInput(`${selectedPeriod}-${selectedMetric}-data.json`)
      link.download = filename
      
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('JSON export failed:', error)
    } finally {
      setIsExporting(false)
      setShowExportOptions(false)
    }
  }, [selectedPeriod, selectedMetric, salesData])

  // Chart zoom controls using Chart.js zoom plugin
  const handleZoomIn = useCallback(() => {
    const chartElement = chartRefs.current.mainChart
    
    // Try to get the chart instance from the react-chartjs-2 wrapper
    if (chartElement && chartElement.chartInstance) {
      const chart = chartElement.chartInstance
      if (chart.zoom) {
        chart.zoom(1.2)
        chart.update()
        return
      }
    }
    
    // Alternative: try to access the chart directly from the wrapper
    if (chartElement && chartElement.chart) {
      const chart = chartElement.chart
      if (chart.zoom) {
        chart.zoom(1.2)
        chart.update()
        return
      }
    }
    
    // Last resort: try to access the Chart.js instance directly
    if (chartElement && typeof chartElement.zoom === 'function') {
      chartElement.zoom(1.2)
      chartElement.update()
      return
    }
  }, [])

  const handleZoomOut = useCallback(() => {
    const chartElement = chartRefs.current.mainChart
    
    if (chartElement && chartElement.chartInstance) {
      const chart = chartElement.chartInstance
      if (chart.zoom) {
        chart.zoom(0.8)
        chart.update()
        return
      }
    }
    
    if (chartElement && chartElement.chart) {
      const chart = chartElement.chart
      if (chart.zoom) {
        chart.zoom(0.8)
        chart.update()
        return
      }
    }
    
    if (chartElement && typeof chartElement.zoom === 'function') {
      chartElement.zoom(0.8)
      chartElement.update()
      return
    }
  }, [])

  const handleResetZoom = useCallback(() => {
    const chartElement = chartRefs.current.mainChart
    
    if (chartElement && chartElement.chartInstance) {
      const chart = chartElement.chartInstance
      if (chart.resetZoom) {
        chart.resetZoom()
        chart.update()
        return
      }
    }
    
    if (chartElement && chartElement.chart) {
      const chart = chartElement.chart
      if (chart.resetZoom) {
        chart.resetZoom()
        chart.update()
        return
      }
    }
    
    if (chartElement && typeof chartElement.resetZoom === 'function') {
      chartElement.resetZoom()
      chartElement.update()
      return
    }
  }, [])

  // Optimized chart data using useMemo
  const chartData = useMemo(() => ({
    labels: selectedPeriod === 'week' 
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      : selectedPeriod === 'month'
      ? Array.from({length: 30}, (_, i) => i + 1)
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: selectedMetric === 'revenue' ? 'Revenue (R)' : 'Sales Volume',
        data: salesData[selectedPeriod][selectedMetric],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  }), [selectedPeriod, selectedMetric, salesData])

  // Multi-metric chart data for advanced visualization
  const multiMetricData = useMemo(() => ({
    labels: selectedPeriod === 'week' 
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      : selectedPeriod === 'month'
      ? Array.from({length: 30}, (_, i) => i + 1)
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue (R)',
        data: salesData[selectedPeriod].revenue,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y',
      },
      {
        label: 'Profit (R)',
        data: salesData[selectedPeriod].profit,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y1',
      },
      {
        label: 'Customers',
        data: salesData[selectedPeriod].customers,
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        fill: false,
        yAxisID: 'y2',
      }
    ],
  }), [selectedPeriod, salesData])

  const barData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Revenue',
        data: [65, 59, 80, 81],
        backgroundColor: [
          'rgba(59, 130, 246, 0.9)',
          'rgba(34, 197, 94, 0.9)',
          'rgba(245, 158, 11, 0.9)',
          'rgba(239, 68, 68, 0.9)',
        ],
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  }

  const doughnutData = {
    labels: ['Desktop', 'Mobile', 'Tablet'],
    datasets: [
      {
        data: [300, 150, 100],
        backgroundColor: [
          'rgba(59, 130, 246, 0.9)',
          'rgba(34, 197, 94, 0.9)',
          'rgba(245, 158, 11, 0.9)',
        ],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  }

  // Enhanced chart options with zoom and pan capabilities
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: chartAnimation ? 1500 : 0,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.98)',
        titleColor: '#ffffff',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(59, 130, 246, 0.4)',
        borderWidth: 2,
        cornerRadius: 12,
        displayColors: true,
        padding: 16,
        titleFont: {
          size: 14,
          weight: '600',
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          title: (context) => {
            const period = selectedPeriod === 'week' ? 'Daily' : selectedPeriod === 'month' ? 'Daily' : 'Monthly'
            return `${period} ${context[0].label}`
          },
          label: (context) => {
            const value = context.parsed.y || context.parsed
            const currency = selectedMetric === 'revenue' ? 'R' : ''
            const unit = selectedMetric === 'volume' ? ' units' : ''
            return `${context.dataset.label}: ${currency}${value.toLocaleString()}${unit}`
          }
        }
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'xy',
          speed: 0.1,
        },
        pan: {
          enabled: true,
          mode: 'xy',
          speed: 20,
        },
        limits: {
          x: {min: 'original', max: 'original'},
          y: {min: 'original', max: 'original'}
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.04)',
          drawBorder: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 12,
          },
          callback: (value) => {
            if (selectedMetric === 'revenue') {
              return `R${value.toLocaleString()}`
            }
            return value.toLocaleString()
          }
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 12,
          },
        },
      },
    },
    elements: {
      line: {
        borderWidth: 3,
        tension: 0.4,
      },
      point: {
        hoverRadius: 8,
        radius: chartAnimation ? 0 : 4,
        animation: {
          radius: {
            duration: 1000,
            easing: 'easeOutQuart',
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  }), [chartAnimation, selectedPeriod, selectedMetric])

  // Enhanced multi-metric chart options with multiple Y-axes
  const multiMetricOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: chartAnimation ? 1500 : 0,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '500',
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.98)',
        titleColor: '#ffffff',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(59, 130, 246, 0.4)',
        borderWidth: 2,
        cornerRadius: 12,
        displayColors: true,
        padding: 16,
        titleFont: {
          size: 14,
          weight: '600',
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          title: (context) => {
            const period = selectedPeriod === 'week' ? 'Daily' : selectedPeriod === 'month' ? 'Daily' : 'Monthly'
            return `${period} ${context[0].label}`
          },
          label: (context) => {
            const value = context.parsed.y || context.parsed
            const dataset = context.dataset
            if (dataset.label.includes('Revenue') || dataset.label.includes('Profit')) {
              return `${dataset.label}: R${value.toLocaleString()}`
            }
            return `${dataset.label}: ${value.toLocaleString()}`
          }
        }
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'xy',
          speed: 0.1,
        },
        pan: {
          enabled: true,
          mode: 'xy',
          speed: 20,
        },
        limits: {
          x: {min: 'original', max: 'original'},
          y: {min: 'original', max: 'original'}
        }
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.04)',
          drawBorder: false,
        },
        ticks: {
          color: '#64748b',
          font: { size: 12 },
          callback: (value) => `R${value.toLocaleString()}`
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: '#22c55e',
          font: { size: 12 },
          callback: (value) => `R${value.toLocaleString()}`
        },
      },
      y2: {
        type: 'linear',
        display: true,
        position: 'right',
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: '#f59e0b',
          font: { size: 12 },
          callback: (value) => value.toLocaleString()
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b',
          font: { size: 12 },
        },
      },
    },
    elements: {
      line: {
        borderWidth: 3,
        tension: 0.4,
      },
      point: {
        hoverRadius: 8,
        radius: chartAnimation ? 0 : 4,
        animation: {
          radius: {
            duration: 1000,
            easing: 'easeOutQuart',
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  }

  const stats = [
    {
      title: 'Total Sales',
      value: 'R24,780',
      numericValue: 24780,
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
      iconClass: 'metric-icon-sales',
      description: 'vs. last period',
      prefix: 'R',
    },
    {
      title: 'Total Users',
      value: '1,234',
      numericValue: 1234,
      change: '+8.2%',
      changeType: 'positive',
      icon: Users,
      iconClass: 'metric-icon-users',
      description: 'vs. last period',
      prefix: '',
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      numericValue: 3.24,
      change: '-1.2%',
      changeType: 'negative',
      icon: TrendingUp,
      iconClass: 'metric-icon-conversion',
      description: 'vs. last period',
      prefix: '',
      suffix: '%',
    },
    {
      title: 'Orders',
      value: '456',
      numericValue: 456,
      change: '+15.3%',
      changeType: 'positive',
      icon: ShoppingBag,
      iconClass: 'metric-icon-orders',
      description: 'vs. last period',
      prefix: '',
    },
  ]

  const deviceData = [
    { name: 'Desktop', value: 300, icon: Monitor, color: 'text-accent-600' },
    { name: 'Mobile', value: 150, icon: Smartphone, color: 'text-success-600' },
    { name: 'Tablet', value: 100, icon: Tablet, color: 'text-warning-600' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100/50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-accent-600" />
              </div>
                             <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">Analytics Dashboard</h1>
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
                     <p className="text-neutral-600 dark:text-neutral-400 text-lg">Comprehensive business intelligence and performance analytics dashboard</p>
        </div>

        {/* Period Selector */}
        <div className="mb-8 animate-slide-up">
          <div className="period-selector w-fit">
            {['week', 'month', 'year'].map((period) => (
              <button
                key={period}
                onClick={() => handlePeriodChange(period)}
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
                             <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">View by:</span>
              <div className="metric-selector w-fit">
                {[
                  { key: 'revenue', label: 'Revenue (R)' },
                  { key: 'volume', label: 'Volume' }
                ].map((metric) => (
                  <button
                    key={metric.key}
                    onClick={() => handleMetricChange(metric.key)}
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
                onClick={() => setRealTimeData(!realTimeData)}
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
                onClick={() => setShowDrillDown(!showDrillDown)}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-accent-100 text-accent-700 hover:bg-accent-200 transition-all duration-300"
              >
                                 📊 Multi-Metric View
              </button>
            </div>
          </div>
        </div>

                        {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon
                    const CountUpValue = useCountUp(stat.numericValue, 2000, index * 200)
                    
                    return (
                      <div 
                        key={index} 
                        className={`metric-card animate-slide-up hover:scale-105 transition-transform duration-300`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex-1">
                            <p className="stat-label">{stat.title}</p>
                            <p className="stat-value mt-2">
                              {stat.prefix}{CountUpValue.toLocaleString()}{stat.suffix}
                            </p>
                          </div>
                          <div className={`metric-icon ${stat.iconClass} transition-transform duration-300 hover:scale-110`}>
                            <Icon className="h-6 w-6" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {stat.changeType === 'positive' ? (
                            <ArrowUpRight className="h-4 w-4 text-success-600 animate-pulse" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-danger-600 animate-pulse" />
                          )}
                          <span className={`trend-indicator ${
                            stat.changeType === 'positive' ? 'trend-positive' : 'trend-negative'
                          }`}>
                            {stat.change}
                          </span>
                          <span className="text-sm text-neutral-500">{stat.description}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                        {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                     {/* Sales Chart */}
                   <div className="chart-container animate-scale-in hover:shadow-enterprise-xl transition-all duration-500 group">
                     <div className="flex items-center justify-between mb-4">
                       <h3 className="chart-title group-hover:text-accent-700 transition-colors duration-300">
                         <TrendingUp className="h-5 w-5 text-accent-600 group-hover:scale-110 transition-transform duration-300" />
                                                   {showDrillDown ? 'Multi-Metric Analysis' : (selectedMetric === 'revenue' ? 'Revenue Analysis' : 'Sales Volume Analysis')}
                       </h3>
                       
                       {/* Chart Controls */}
                       <div className="flex items-center gap-2">
                         <button
                           onClick={handleZoomIn}
                           className="p-2 text-neutral-600 hover:text-accent-600 hover:bg-accent-50 rounded-lg transition-all duration-200"
                           title="Zoom In"
                           aria-label="Zoom In"
                         >
                           <ZoomIn className="h-4 w-4" />
                         </button>
                         <button
                           onClick={handleZoomOut}
                           className="p-2 text-neutral-600 hover:text-accent-600 hover:bg-accent-50 rounded-lg transition-all duration-200"
                           title="Zoom Out"
                           aria-label="Zoom Out"
                         >
                           <ZoomOut className="h-4 w-4" />
                         </button>
                         <button
                           onClick={handleResetZoom}
                           className="p-2 text-neutral-600 hover:text-accent-600 hover:bg-accent-50 rounded-lg transition-all duration-200"
                           title="Reset Zoom"
                           aria-label="Reset Zoom"
                         >
                           <RotateCcw className="h-4 w-4" />
                         </button>
                         <button
                           onClick={() => setShowExportOptions(!showExportOptions)}
                           disabled={isExporting}
                           className="export-button p-2 text-neutral-600 hover:text-success-600 hover:bg-success-50 rounded-lg transition-all duration-200 disabled:opacity-50 relative"
                           title="Export Data"
                           aria-label="Export Data"
                         >
                           {isExporting ? (
                             <div className="h-4 w-4 animate-spin rounded-full border-2 border-success-600 border-t-transparent" />
                           ) : (
                             <Download className="h-4 w-4" />
                           )}
                           
                           {/* Export Options Dropdown */}
                           {showExportOptions && (
                             <div className="export-dropdown animate-scale-in">
                               <div className="p-2 space-y-1">
                                 <button
                                   onClick={exportToExcel}
                                   className="export-option"
                                 >
                                   <FileSpreadsheet className="h-4 w-4 text-green-600" />
                                   Export to Excel
                                 </button>
                                 <button
                                   onClick={exportToPDF}
                                   className="export-option"
                                 >
                                   <FileText className="h-4 w-4 text-red-600" />
                                   Export to PDF
                                 </button>
                                 <button
                                   onClick={exportToJSON}
                                   className="export-option"
                                 >
                                   <Download className="h-4 w-4 text-blue-600" />
                                   Export to JSON
                                 </button>
                               </div>
                             </div>
                           )}
                         </button>
                       </div>
                     </div>
                     
                                                                  <div className="h-80 relative">
                         {showDrillDown ? (
                                                      <Line 
                                                            ref={(el) => { 
                                 if (el) {
                                   chartRefs.current.mainChart = el
                                 }
                               }}
                              data={multiMetricData} 
                              options={multiMetricOptions} 
                                                            onClick={(event, elements) => {
                                 if (elements.length > 0) {
                                   // Rate limiting for chart interactions
                                   if (!rateLimit('chart-interaction')) {
                                     console.warn('Chart interaction rate limit exceeded')
                                     return
                                   }
                                   
                                   const dataIndex = elements[0].index
                                   const datasetIndex = elements[0].datasetIndex
                                   const value = multiMetricData.datasets[datasetIndex].data[dataIndex]
                                   const label = multiMetricData.labels[dataIndex]
                                   const metric = multiMetricData.datasets[datasetIndex].label
                                   
                                   // Validate and sanitize data before setting state
                                   if (typeof dataIndex === 'number' && typeof datasetIndex === 'number' && 
                                       typeof value === 'number' && typeof label === 'string' && typeof metric === 'string') {
                                     setSelectedDataPoint({
                                       label: sanitizeInput(label),
                                       metric: sanitizeInput(metric),
                                       value: value,
                                       datasetIndex: datasetIndex
                                     })
                                     setShowDrillDown(true)
                                   }
                                 }
                               }}
                            />
                         ) : (
                                                      <Line 
                                                            ref={(el) => { 
                                 if (el) {
                                   chartRefs.current.mainChart = el
                                 }
                               }}
                              data={chartData} 
                              options={chartOptions} 
                            />
                         )}
                         {!chartAnimation && (
                           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-neutral-600/20 to-transparent animate-pulse" />
                         )}
                       </div>
                   </div>

                  {/* Revenue Chart */}
                  <div className="chart-container animate-scale-in hover:shadow-enterprise-xl transition-all duration-500 group" style={{ animationDelay: '100ms' }}>
                    <h3 className="chart-title group-hover:text-success-700 transition-colors duration-300">
                      <BarChart3 className="h-5 w-5 text-success-600 group-hover:scale-110 transition-transform duration-300" />
                                             Quarterly Performance
                    </h3>
                                         <div className="h-80 relative">
                       <Bar data={barData} options={chartOptions} />
                       {!chartAnimation && (
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-neutral-600/20 to-transparent animate-pulse" />
                       )}
                     </div>
                  </div>
                </div>

                        {/* Bottom Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Device Usage */}
                  <div className="chart-container animate-scale-in hover:shadow-enterprise-xl transition-all duration-500 group" style={{ animationDelay: '200ms' }}>
                    <h3 className="chart-title group-hover:text-warning-700 transition-colors duration-300">
                      <Activity className="h-5 w-5 text-warning-600 group-hover:scale-110 transition-transform duration-300" />
                                             Platform Distribution
                    </h3>
                                         <div className="h-64 mb-4 relative">
                       <Doughnut data={doughnutData} options={chartOptions} />
                       {!chartAnimation && (
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-neutral-600/20 to-transparent animate-pulse" />
                       )}
                     </div>
                    <div className="space-y-3">
                      {deviceData.map((device, index) => {
                        const Icon = device.icon
                        const CountUpValue = useCountUp(device.value, 1500, 800 + index * 200)
                        return (
                                                   <div key={index} className="flex items-center justify-between p-3 bg-neutral-50/50 dark:bg-neutral-700/50 rounded-lg hover:bg-neutral-100/50 dark:hover:bg-neutral-600/50 transition-all duration-300 hover:scale-102">
                           <div className="flex items-center gap-3">
                             <Icon className={`h-4 w-4 ${device.color} transition-transform duration-300 group-hover:scale-110`} />
                             <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{device.name}</span>
                           </div>
                           <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{CountUpValue.toLocaleString()}</span>
                         </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="chart-container lg:col-span-2 animate-scale-in hover:shadow-enterprise-xl transition-all duration-500 group" style={{ animationDelay: '300ms' }}>
                    <h3 className="chart-title group-hover:text-primary-700 transition-colors duration-300">
                      <Activity className="h-5 w-5 text-primary-600 group-hover:scale-110 transition-transform duration-300" />
                                             Activity Feed
                    </h3>
                    <div className="space-y-2">
                      {[
                        { action: 'New order received', time: '2 minutes ago', amount: 'R299.00', type: 'order' },
                        { action: 'Payment processed', time: '5 minutes ago', amount: 'R1,299.00', type: 'payment' },
                        { action: 'New user registered', time: '12 minutes ago', amount: '', type: 'user' },
                        { action: 'Product updated', time: '1 hour ago', amount: '', type: 'update' },
                        { action: 'Refund processed', time: '2 hours ago', amount: 'R99.00', type: 'refund' },
                      ].map((activity, index) => (
                                                 <div key={index} className="activity-item hover:bg-neutral-100/70 dark:hover:bg-neutral-600/70 transition-all duration-300 hover:scale-102">
                           <div className="flex-1">
                             <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{activity.action}</p>
                             <p className="text-sm text-neutral-500 dark:text-neutral-400">{activity.time}</p>
                           </div>
                           {activity.amount && (
                             <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-700 px-3 py-1 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors duration-300">
                               {activity.amount}
                             </span>
                           )}
                         </div>
                      ))}
                    </div>
                  </div>
                                 </div>
       </div>

       {/* Performance Monitor */}
               <div className="mt-8 animate-slide-up" style={{ animationDelay: '400ms' }}>
          <div className="bg-gradient-to-r from-neutral-50 to-accent-50 dark:from-neutral-800 dark:to-neutral-700 rounded-xl p-6 border border-neutral-200/60 dark:border-neutral-700/60">
                                               <div className="flex items-center justify-between mb-4">
               <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">System Performance</h3>
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
                 <span className="text-lg font-bold text-success-600">{performanceMetrics.fps}</span>
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
                 <span className="text-lg font-bold text-accent-600">{performanceMetrics.renderTime}ms</span>
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
                   {performance.memory ? `${Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)}MB` : 'N/A'}
                 </span>
               </div>
               <div className="mt-2 w-full bg-neutral-200 dark:bg-neutral-600 rounded-full h-2">
                 <div 
                   className="bg-success-500 h-2 rounded-full transition-all duration-300"
                   style={{ width: performance.memory ? `${Math.min((performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100, 100)}%` : '0%' }}
                 ></div>
               </div>
             </div>
           </div>
         </div>
       </div>

       {/* Drill-Down Modal */}
       {showDrillDown && selectedDataPoint && (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
           <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-enterprise-xl p-8 max-w-2xl w-full mx-4 animate-scale-in">
                           <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Data Analysis</h3>
               <button
                 onClick={() => setShowDrillDown(false)}
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
                   <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{selectedDataPoint.label}</p>
                 </div>
                 <div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4">
                   <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Metric</p>
                   <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{selectedDataPoint.metric}</p>
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
                   onClick={() => setShowDrillDown(false)}
                   className="flex-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 py-3 px-4 rounded-lg font-medium hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors duration-200"
                 >
                   Close
                 </button>
                 <button
                                       onClick={() => {
                      // Here you could add more detailed analysis or export functionality
                      // Export functionality can be implemented here
                    }}
                   className="flex-1 bg-accent-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-accent-700 transition-colors duration-200"
                 >
                                       Export Analysis
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}
     </div>
   )
 }

export default Dashboard
