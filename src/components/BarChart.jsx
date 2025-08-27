import React, { useRef, useCallback, useState } from "react"
import { Bar } from "react-chartjs-2"
import { Download, FileText, FileSpreadsheet, Database } from "lucide-react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import zoomPlugin from "chartjs-plugin-zoom"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
)

export default function BarChart({ chartData, chartOptions, title, icon, iconColor, showControls = true, showExport = true, onExportExcel, onExportPDF, onExportJSON }) {
  const chartRef = useRef(null)
  const [showExportOptions, setShowExportOptions] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // Zoom controls
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

  // Export handlers
  const handleExportToggle = useCallback(() => {
    setShowExportOptions(prev => !prev)
  }, [])

  const handleExportExcel = useCallback(async () => {
    if (onExportExcel) {
      setIsExporting(true)
      try {
        await onExportExcel()
      } finally {
        setIsExporting(false)
        setShowExportOptions(false)
      }
    }
  }, [onExportExcel])

  const handleExportPDF = useCallback(async () => {
    if (onExportPDF) {
      setIsExporting(true)
      try {
        await onExportPDF()
      } finally {
        setIsExporting(false)
        setShowExportOptions(false)
      }
    }
  }, [onExportPDF])

  const handleExportJSON = useCallback(async () => {
    if (onExportJSON) {
      setIsExporting(true)
      try {
        await onExportJSON()
      } finally {
        setIsExporting(false)
        setShowExportOptions(false)
      }
    }
  }, [onExportJSON])

  // Enhanced options with proper tooltip configuration
  const options = {
    ...chartOptions,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      ...chartOptions.plugins,
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        position: 'nearest',
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        titleColor: "#fff",
        bodyColor: "#e2e8f0",
        borderColor: "rgba(59, 130, 246, 0.4)",
        borderWidth: 2,
        cornerRadius: 8,
        padding: 12,
        displayColors: true,
        titleFont: { size: 14, weight: '600' },
        bodyFont: { size: 13 },
        callbacks: {
          title: (context) => {
            return `Category: ${context[0].label}`
          },
          label: (context) => {
            const value = context.parsed.y
            return `${context.dataset.label}: R${value.toLocaleString()}`
          },
          afterLabel: (context) => {
            return ''
          }
        },
      },
      zoom: {
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: "xy",
        },
        pan: {
          enabled: true,
          mode: "xy",
        },
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
    hover: {
      mode: "index",
      intersect: false,
    },
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className={`p-2 rounded-lg bg-${iconColor}-100 dark:bg-${iconColor}-900/20`}>
                {React.createElement(icon, { className: `w-5 h-5 text-${iconColor}-600 dark:text-${iconColor}-400` })}
              </div>
            )}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          </div>
          
          {showExport && (
            <div className="relative">
              <button
                onClick={handleExportToggle}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                disabled={isExporting}
              >
                <Download className="w-5 h-5" />
              </button>
              
              {showExportOptions && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                  <div className="py-2">
                    <button
                      onClick={handleExportExcel}
                      disabled={isExporting}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 disabled:opacity-50"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      Export to Excel
                    </button>
                    <button
                      onClick={handleExportPDF}
                      disabled={isExporting}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 disabled:opacity-50"
                    >
                      <FileText className="w-4 h-4" />
                      Export to PDF
                    </button>
                    <button
                      onClick={handleExportJSON}
                      disabled={isExporting}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 disabled:opacity-50"
                    >
                      <Database className="w-4 h-4" />
                      Export to JSON
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {showControls && (
        <div className="flex gap-2 mb-4">
          <button 
            onClick={handleZoomIn}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Zoom In
          </button>
          <button 
            onClick={handleZoomOut}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Zoom Out
          </button>
          <button 
            onClick={handleResetZoom}
            className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
        </div>
      )}

      <div className="h-72">
        <Bar ref={chartRef} data={chartData} options={options} />
      </div>
    </div>
  )
}
