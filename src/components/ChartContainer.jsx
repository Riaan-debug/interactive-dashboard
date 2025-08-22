import React from 'react'
import { ZoomIn, ZoomOut, RotateCcw, Download, FileText, FileSpreadsheet } from 'lucide-react'

const ChartContainer = ({ 
  title, 
  icon: Icon, 
  iconColor, 
  children, 
  chartAnimation,
  showExportOptions,
  isExporting,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onExportToggle,
  onExportExcel,
  onExportPDF,
  onExportJSON
}) => {
  return (
    <div className="chart-container animate-scale-in hover:shadow-enterprise-xl transition-all duration-500 group">
      <div className="flex items-center justify-between mb-4">
        <h3 className={`chart-title group-hover:text-${iconColor}-700 transition-colors duration-300`}>
          <Icon className={`h-5 w-5 text-${iconColor}-600 group-hover:scale-110 transition-transform duration-300`} />
          {title}
        </h3>
        
        {/* Chart Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onZoomIn}
            className="p-2 text-neutral-600 hover:text-accent-600 hover:bg-accent-50 rounded-lg transition-all duration-200"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={onZoomOut}
            className="p-2 text-neutral-600 hover:text-accent-600 hover:bg-accent-50 rounded-lg transition-all duration-200"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={onResetZoom}
            className="p-2 text-neutral-600 hover:text-accent-600 hover:bg-accent-50 rounded-lg transition-all duration-200"
            title="Reset Zoom"
            aria-label="Reset Zoom"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={onExportToggle}
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
                    onClick={onExportExcel}
                    className="export-option"
                  >
                    <FileSpreadsheet className="h-4 w-4 text-green-600" />
                    Export to Excel
                  </button>
                  <button
                    onClick={onExportPDF}
                    className="export-option"
                  >
                    <FileText className="h-4 w-4 text-red-600" />
                    Export to PDF
                  </button>
                  <button
                    onClick={onExportJSON}
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
      
      <div className="relative">
        {children}
        {!chartAnimation && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-neutral-600/20 to-transparent animate-pulse" />
        )}
      </div>
    </div>
  )
}

export default ChartContainer
