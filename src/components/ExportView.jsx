import React, { useState, useMemo, useCallback, useRef } from 'react'
import { Download, FileText, FileSpreadsheet, Database, Calendar, Filter, Search, Eye, Trash2, RefreshCw, CheckCircle, AlertCircle, Clock, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import SalesChart from './SalesChart'
import BarChart from './BarChart'
import DoughnutChart from './DoughnutChart'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import html2canvas from 'html2canvas'

const ExportView = () => {
  // Export state
  const [selectedData, setSelectedData] = useState('sales')
  const [exportFormat, setExportFormat] = useState('excel')
  const [dateRange, setDateRange] = useState('30d')
  const [filters, setFilters] = useState({
    category: 'all',
    region: 'all',
    status: 'all'
  })
  const [isExporting, setIsExporting] = useState(false)
  const [exportHistory, setExportHistory] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  
  // Accordion state - which sections are expanded
  const [expandedSections, setExpandedSections] = useState({
    dataType: true,      // Always expanded by default
    exportFormat: false, // Collapsed by default
    filters: false       // Collapsed by default
  })
  
  // Chart ref for zoom functionality
  const chartRef = useRef(null)

  // Sample data for different export types
  const dataTypes = {
    sales: {
      name: 'Sales Data',
      description: 'Revenue, transactions, and customer analytics',
      icon: '📊',
      recordCount: 15420,
      lastUpdated: '2 hours ago'
    },
    analytics: {
      name: 'Analytics Data',
      description: 'Performance metrics and user behavior insights',
      icon: '📈',
      recordCount: 8920,
      lastUpdated: '1 hour ago'
    },
    performance: {
      name: 'Performance Data',
      description: 'System metrics and optimization data',
      icon: '⚡',
      recordCount: 5670,
      lastUpdated: '30 minutes ago'
    },
    users: {
      name: 'User Data',
      description: 'User profiles, activity, and engagement metrics',
      icon: '👥',
      recordCount: 12340,
      lastUpdated: '3 hours ago'
    }
  }

  // Export formats
  const exportFormats = [
    { id: 'excel', name: 'Excel (.xlsx)', icon: FileSpreadsheet, description: 'Professional Excel format with formatting and charts' },
    { id: 'csv', name: 'CSV (.csv)', icon: FileText, description: 'Universal format for data import and analysis' },
    { id: 'json', name: 'JSON (.json)', icon: Database, description: 'Structured data with metadata for developers' },
    { id: 'pdf', name: 'PDF Report (.pdf)', icon: FileText, description: 'Professional PDF report with charts and formatting' }
  ]

  // Date range options
  const dateRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' },
    { value: 'custom', label: 'Custom range' }
  ]

  // Filter options
  const filterOptions = {
    category: [
      { value: 'all', label: 'All Categories' },
      { value: 'electronics', label: 'Electronics' },
      { value: 'clothing', label: 'Clothing' },
      { value: 'home', label: 'Home & Garden' },
      { value: 'sports', label: 'Sports & Outdoors' }
    ],
    region: [
      { value: 'all', label: 'All Regions' },
      { value: 'north', label: 'North America' },
      { value: 'europe', label: 'Europe' },
      { value: 'asia', label: 'Asia Pacific' },
      { value: 'other', label: 'Other Regions' }
    ],
    status: [
      { value: 'all', label: 'All Statuses' },
      { value: 'active', label: 'Active' },
      { value: 'pending', label: 'Pending' },
      { value: 'completed', label: 'Completed' },
      { value: 'cancelled', label: 'Cancelled' }
    ]
  }

  // Sample chart data for preview
  const previewChartData = useMemo(() => {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    
    if (selectedData === 'sales') {
      return {
        labels,
        datasets: [
          {
            label: 'Revenue',
            data: [12000, 19000, 15000, 25000, 22000, 30000],
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            tension: 0.4
          }
        ]
      }
    } else if (selectedData === 'analytics') {
      return {
        labels,
        datasets: [
          {
            label: 'Page Views',
            data: [45000, 52000, 48000, 61000, 58000, 72000],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4
          }
        ]
      }
    } else if (selectedData === 'performance') {
      return {
        labels,
        datasets: [
          {
            label: 'Response Time (ms)',
            data: [45, 38, 42, 35, 40, 32],
            borderColor: 'rgb(168, 85, 247)',
            backgroundColor: 'rgba(168, 85, 247, 0.1)',
            tension: 0.4
          }
        ]
      }
    } else {
      return {
        labels,
        datasets: [
          {
            label: 'Active Users',
            data: [1200, 1350, 1280, 1600, 1520, 1850],
            borderColor: 'rgb(245, 158, 11)',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            tension: 0.4
          }
        ]
      }
    }
  }, [selectedData])

     const previewChartOptions = useMemo(() => ({
     responsive: true,
     maintainAspectRatio: false,
     interaction: {
       mode: 'index',
       intersect: false,
     },
     layout: {
       padding: {
         top: 30,
         bottom: 30,
         left: 30,
         right: 30
       }
     },
     scales: {
       y: {
         beginAtZero: true,
         ticks: {
           padding: 12,
           maxTicksLimit: 8
         },
         grid: {
           drawBorder: false
         }
       },
       x: {
         ticks: {
           padding: 12,
           maxTicksLimit: 6
         },
         grid: {
           drawBorder: false
         }
       }
     },
     plugins: {
       legend: {
         display: true,
         position: 'top',
         labels: {
           padding: 25,
           usePointStyle: true,
           boxWidth: 12
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

  // File generation functions
  const generateExcel = useCallback((data) => {
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()
    
    // Prepare data for Excel
    const excelData = [
      ['Export Report', '', '', ''],
      ['', '', '', ''],
      ['Data Type:', dataTypes[selectedData].name, '', ''],
      ['Date Range:', dateRanges.find(r => r.value === dateRange)?.label || dateRange, '', ''],
      ['Export Date:', new Date().toLocaleString(), '', ''],
      ['Total Records:', dataTypes[selectedData].recordCount.toLocaleString(), '', ''],
      ['', '', '', ''],
      ['Month', 'Value', 'Data Type', 'Date Range']
    ]
    
    // Add data rows
    data.labels.forEach((label, index) => {
      excelData.push([
        label,
        data.datasets[0].data[index],
        dataTypes[selectedData].name,
        dateRanges.find(r => r.value === dateRange)?.label || dateRange
      ])
    })
    
    // Add summary statistics
    const averageValue = data.datasets[0].data.reduce((sum, val) => sum + val, 0) / data.datasets[0].data.length
    const maxValue = Math.max(...data.datasets[0].data)
    const minValue = Math.min(...data.datasets[0].data)
    
    excelData.push(['', '', '', ''])
    excelData.push(['Statistics', '', '', ''])
    excelData.push(['Average Value:', averageValue.toLocaleString(), '', ''])
    excelData.push(['Maximum Value:', maxValue.toLocaleString(), '', ''])
    excelData.push(['Minimum Value:', minValue.toLocaleString(), '', ''])
    excelData.push(['Data Points:', data.labels.length, '', ''])
    
    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(excelData)
    
    // Set column widths
    ws['!cols'] = [
      { width: 15 }, // Month
      { width: 15 }, // Value
      { width: 20 }, // Data Type
      { width: 20 }  // Date Range
    ]
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Export Data')
    
    // Generate Excel file as buffer
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    return excelBuffer
  }, [selectedData, dateRange, dataTypes, dateRanges])

  const generateCSV = useCallback((data) => {
    const headers = ['Month', 'Value', 'Data Type', 'Date Range']
    const rows = data.labels.map((label, index) => [
      label,
      data.datasets[0].data[index],
      dataTypes[selectedData].name,
      dateRanges.find(r => r.value === dateRange)?.label || dateRange
    ])
    
    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')
  }, [selectedData, dateRange, dataTypes, dateRanges])

  const generateJSON = useCallback((data) => {
    const exportData = {
      metadata: {
        dataType: dataTypes[selectedData].name,
        dateRange: dateRanges.find(r => r.value === dateRange)?.label || dateRange,
        exportFormat: exportFormats.find(f => f.id === exportFormat)?.name || exportFormat,
        recordCount: dataTypes[selectedData].recordCount,
        exportDate: new Date().toISOString(),
        filters: Object.entries(filters).filter(([_, value]) => value !== 'all')
      },
      chartData: data,
      summary: {
        totalRecords: dataTypes[selectedData].recordCount,
        averageValue: data.datasets[0].data.reduce((sum, val) => sum + val, 0) / data.datasets[0].data.length,
        maxValue: Math.max(...data.datasets[0].data),
        minValue: Math.min(...data.datasets[0].data)
      }
    }
    
    return JSON.stringify(exportData, null, 2)
  }, [selectedData, dateRange, exportFormat, filters, dataTypes, dateRanges, exportFormats])

  const generatePDF = useCallback(async (data) => {
    // Create PDF document
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    // Set font and colors
    pdf.setFont('helvetica')
    pdf.setFontSize(20)
    pdf.setTextColor(59, 130, 246) // Blue color
    
    // Title
    pdf.text('Export Report', 20, 30)
    
    // Reset font size and color
    pdf.setFontSize(12)
    pdf.setTextColor(0, 0, 0)
    
    // Metadata
    pdf.text(`Data Type: ${dataTypes[selectedData].name}`, 20, 50)
    pdf.text(`Date Range: ${dateRanges.find(r => r.value === dateRange)?.label || dateRange}`, 20, 60)
    pdf.text(`Export Date: ${new Date().toLocaleString()}`, 20, 70)
    pdf.text(`Total Records: ${dataTypes[selectedData].recordCount.toLocaleString()}`, 20, 80)
    
    // Data table header
    pdf.setFontSize(14)
    pdf.setTextColor(59, 130, 246)
    pdf.text('Data Summary', 20, 100)
    
    // Reset font size and color
    pdf.setFontSize(10)
    pdf.setTextColor(0, 0, 0)
    
    // Create data table
    const tableData = [['Month', 'Value']]
    data.labels.forEach((label, index) => {
      tableData.push([label, data.datasets[0].data[index].toLocaleString()])
    })
    
         // Add table to PDF
     autoTable(pdf, {
       startY: 110,
       head: [tableData[0]],
       body: tableData.slice(1),
       theme: 'grid',
       headStyles: { fillColor: [59, 130, 246] },
       margin: { top: 20 }
     })
    
    // Statistics
    const averageValue = data.datasets[0].data.reduce((sum, val) => sum + val, 0) / data.datasets[0].data.length
    const maxValue = Math.max(...data.datasets[0].data)
    const minValue = Math.min(...data.datasets[0].data)
    
         // Get the final Y position after the table (approximate)
     const finalY = 110 + (tableData.length * 8) + 20
    
    pdf.setFontSize(14)
    pdf.setTextColor(59, 130, 246)
    pdf.text('Statistics', 20, finalY)
    
    pdf.setFontSize(10)
    pdf.setTextColor(0, 0, 0)
    pdf.text(`• Average Value: ${averageValue.toLocaleString()}`, 20, finalY + 15)
    pdf.text(`• Maximum Value: ${maxValue.toLocaleString()}`, 20, finalY + 25)
    pdf.text(`• Minimum Value: ${minValue.toLocaleString()}`, 20, finalY + 35)
    pdf.text(`• Data Points: ${data.labels.length}`, 20, finalY + 45)
    
    // Footer
    pdf.setFontSize(8)
    pdf.setTextColor(128, 128, 128)
    pdf.text('Report generated by ExportView', 20, 280)
    
    return pdf
  }, [selectedData, dateRange, dataTypes, dateRanges])



  // Download function
  const downloadFile = useCallback((content, filename, mimeType) => {
    let blob
    
    // Handle different content types
    if (content instanceof Blob) {
      blob = content
    } else if (content instanceof ArrayBuffer) {
      blob = new Blob([content], { type: mimeType })
    } else {
      blob = new Blob([content], { type: mimeType })
    }
    
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }, [])

  // Export history data
  const filteredExportHistory = useMemo(() => {
    if (!searchTerm) return exportHistory
    
    return exportHistory.filter(export_ => 
      export_.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      export_.dataType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      export_.format.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [exportHistory, searchTerm])

  // Handle export
  const handleExport = useCallback(async () => {
    setIsExporting(true)
    
    try {
      // Generate file content based on export format
      let fileContent, filename, mimeType, fileSize
      
      if (exportFormat === 'excel') {
        fileContent = generateExcel(previewChartData)
        filename = `${selectedData}_${dateRange}_${new Date().toISOString().split('T')[0]}.xlsx`
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        fileSize = fileContent.byteLength
      } else if (exportFormat === 'csv') {
        fileContent = generateCSV(previewChartData)
        filename = `${selectedData}_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`
        mimeType = 'text/csv'
        fileSize = new Blob([fileContent]).size
      } else if (exportFormat === 'json') {
        fileContent = generateJSON(previewChartData)
        filename = `${selectedData}_${dateRange}_${new Date().toISOString().split('T')[0]}.json`
        mimeType = 'application/json'
        fileSize = new Blob([fileContent]).size
      } else if (exportFormat === 'pdf') {
        const pdf = await generatePDF(previewChartData)
        fileContent = pdf.output('blob')
        filename = `${selectedData}_${dateRange}_${new Date().toISOString().split('T')[0]}.pdf`
        mimeType = 'application/pdf'
        fileSize = fileContent.size
      }
      
      // Download the file
      downloadFile(fileContent, filename, mimeType)
      
      // Create export history entry
      const newExport = {
        id: Date.now(),
        filename,
        dataType: dataTypes[selectedData].name,
        format: exportFormats.find(f => f.id === exportFormat)?.name || exportFormat,
        dateRange,
        recordCount: dataTypes[selectedData].recordCount,
        status: 'completed',
        timestamp: new Date().toISOString(),
        size: fileSize
      }
      
      setExportHistory(prev => [newExport, ...prev])
      
      // Show success message
      console.log(`✅ Export completed: ${filename}`)
      
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }, [selectedData, exportFormat, dateRange, previewChartData, generateExcel, generateCSV, generateJSON, generatePDF, downloadFile, dataTypes, exportFormats])

  // Delete export from history
  const deleteExport = useCallback((exportId) => {
    setExportHistory(prev => prev.filter(export_ => export_.id !== exportId))
  }, [])

  // Clear export history
  const clearHistory = useCallback(() => {
    setExportHistory([])
  }, [])

  // Accordion toggle function
  const toggleSection = useCallback((section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }, [])

  // Helper functions to get summary text for collapsed sections
  const getExportFormatSummary = useCallback(() => {
    const selectedFormat = exportFormats.find(f => f.id === exportFormat)
    return selectedFormat ? selectedFormat.name : 'No format selected'
  }, [exportFormat, exportFormats])

  const getFiltersSummary = useCallback(() => {
    const activeFilters = Object.entries(filters)
      .filter(([_, value]) => value !== 'all')
      .map(([key, value]) => `${key}: ${value}`)
    
    if (activeFilters.length === 0) {
      return `Date Range: ${dateRanges.find(r => r.value === dateRange)?.label || dateRange}`
    }
    
    return `Date: ${dateRanges.find(r => r.value === dateRange)?.label || dateRange} • ${activeFilters.join(' • ')}`
  }, [filters, dateRange, dateRanges])

  // Zoom handlers for chart
  const handleZoomIn = useCallback(() => {
    if (chartRef.current) {
      chartRef.current.zoom(1.2)
    }
  }, [])

  const handleZoomOut = useCallback(() => {
    if (chartRef.current) {
      chartRef.current.zoom(0.8)
    }
  }, [])

  const handleResetZoom = useCallback(() => {
    if (chartRef.current) {
      chartRef.current.resetZoom()
    }
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              📤 Export Your Data
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Export your data in multiple formats with advanced filtering and preview capabilities
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={clearHistory}
              className="px-4 py-2 bg-neutral-500 hover:bg-neutral-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear History
            </button>
            
            <button
              onClick={() => setExportHistory([])}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Export Configuration */}
        <div className="space-y-6">
          {/* Data Type Selection */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-enterprise border border-neutral-200/60 dark:border-neutral-700/60 overflow-hidden">
            <button
              onClick={() => toggleSection('dataType')}
              className="w-full p-6 text-left flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    Data Type
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {dataTypes[selectedData].name} • {dataTypes[selectedData].recordCount.toLocaleString()} records
                  </p>
                </div>
              </div>
              <div className={`transform transition-transform duration-200 ${expandedSections.dataType ? 'rotate-180' : ''}`}>
                <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            
            {expandedSections.dataType && (
              <div className="px-6 pb-6 space-y-3">
                {Object.entries(dataTypes).map(([key, data]) => (
                  <label key={key} className="flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                    <input
                      type="radio"
                      name="dataType"
                      value={key}
                      checked={selectedData === key}
                      onChange={(e) => setSelectedData(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 flex-shrink-0 ${
                      selectedData === key 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-neutral-300 dark:border-neutral-600'
                    }`}>
                      {selectedData === key && (
                        <div className="w-2 h-2 bg-white rounded-full m-auto"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{data.icon}</span>
                        <span className="font-medium text-neutral-900 dark:text-neutral-100">
                          {data.name}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {data.description}
                      </p>
                      <div className="flex items-center justify-between mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                        <span>{data.recordCount.toLocaleString()} records</span>
                        <span>{data.lastUpdated}</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Export Format Selection */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-enterprise border border-neutral-200/60 dark:border-neutral-700/60 overflow-hidden">
            <button
              onClick={() => toggleSection('exportFormat')}
              className="w-full p-6 text-left flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">📁</span>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    Export Format
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {getExportFormatSummary()}
                  </p>
                </div>
              </div>
              <div className={`transform transition-transform duration-200 ${expandedSections.exportFormat ? 'rotate-180' : ''}`}>
                <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            
            {expandedSections.exportFormat && (
              <div className="px-6 pb-6 space-y-3">
                {exportFormats.map((format) => {
                  const Icon = format.icon
                  return (
                    <label key={format.id} className="flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                      <input
                        type="radio"
                        name="exportFormat"
                        value={format.id}
                        checked={exportFormat === format.id}
                        onChange={(e) => setExportFormat(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 flex-shrink-0 ${
                        exportFormat === format.id 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-neutral-300 dark:border-neutral-600'
                      }`}>
                        {exportFormat === format.id && (
                          <div className="w-2 h-2 bg-white rounded-full m-auto"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                          <span className="font-medium text-neutral-900 dark:text-neutral-100">
                            {format.name}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {format.description}
                        </p>
                      </div>
                    </label>
                  )
                })}
              </div>
            )}
          </div>

          {/* Date Range & Filters */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-enterprise border border-neutral-200/60 dark:border-neutral-700/60 overflow-hidden">
            <button
              onClick={() => toggleSection('filters')}
              className="w-full p-6 text-left flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">📅</span>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    Date Range & Filters
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {getFiltersSummary()}
                  </p>
                </div>
              </div>
              <div className={`transform transition-transform duration-200 ${expandedSections.filters ? 'rotate-180' : ''}`}>
                <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            
            {expandedSections.filters && (
              <div className="px-6 pb-6">
                {/* Date Range */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Date Range
                  </label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  >
                    {dateRanges.map(range => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filters */}
                {Object.entries(filterOptions).map(([filterKey, options]) => (
                  <div key={filterKey} className="mb-4">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 capitalize">
                      {filterKey}
                    </label>
                    <select
                      value={filters[filterKey]}
                      onChange={(e) => setFilters(prev => ({ ...prev, [filterKey]: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                    >
                      {options.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}

                {/* Export Button */}
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className={`w-full mt-4 px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    isExporting
                      ? 'bg-neutral-400 cursor-not-allowed text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {isExporting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Export Data
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Preview and Export History */}
        <div className="space-y-6">
          {/* Data Preview */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-enterprise border border-neutral-200/60 dark:border-neutral-700/60 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                👁️ Data Preview
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <Eye className="w-4 h-4" />
                  Previewing {dataTypes[selectedData].name}
                </div>
                
                {/* Zoom Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleZoomIn}
                    className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-200"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-200"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleResetZoom}
                    className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-200"
                    title="Reset Zoom"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="h-80 w-full overflow-hidden px-2 mb-6">
              <SalesChart
                ref={chartRef}
                chartData={previewChartData}
                chartOptions={previewChartOptions}
                title=""
                showControls={false}
                showExport={false}
              />
            </div>
             
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary dark:text-primary">
                  {dataTypes[selectedData].recordCount.toLocaleString()}
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">Total Records</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {dateRange}
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">Date Range</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {exportFormat.toUpperCase()}
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">Export Format</div>
              </div>
            </div>
          </div>

          {/* Export History */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-enterprise border border-neutral-200/60 dark:border-neutral-700/60 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                📋 Export History
              </h3>
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search exports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-1 text-sm border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 w-48"
                />
              </div>
            </div>

            {filteredExportHistory.length === 0 ? (
              <div className="text-center py-8">
                <Download className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                <p className="text-neutral-600 dark:text-neutral-400">
                  {searchTerm ? 'No exports match your search.' : 'No exports yet. Start by exporting some data!'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredExportHistory.map((export_) => (
                  <div key={export_.id} className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/20">
                        <Download className="w-5 h-5 text-primary dark:text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-neutral-900 dark:text-neutral-100">
                          {export_.filename}
                        </div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                          {export_.dataType} • {export_.format} • {export_.recordCount.toLocaleString()} records
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                          {new Date(export_.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {(export_.size / 1024).toFixed(1)} KB
                        </div>
                        <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                          {export_.status === 'completed' ? (
                            <>
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              Completed
                            </>
                          ) : export_.status === 'processing' ? (
                            <>
                              <Clock className="w-3 h-3 text-yellow-500" />
                              Processing
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3 h-3 text-red-500" />
                              Failed
                            </>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => deleteExport(export_.id)}
                        className="p-2 text-neutral-400 hover:text-red-500 transition-colors duration-200"
                        title="Delete export"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExportView
