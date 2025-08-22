import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { sanitizeInput, validateData, rateLimit } from './security.js'

export const exportToExcel = async (selectedPeriod, selectedMetric, salesData, setIsExporting, setShowExportOptions) => {
  if (setIsExporting.current) return
  
  // Rate limiting check
  if (!rateLimit('export-excel')) {
    console.warn('Export rate limit exceeded')
    return
  }
  
  setIsExporting.current(true)
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
    setIsExporting.current(false)
    setShowExportOptions.current(false)
  }
}

export const exportToPDF = async (selectedPeriod, selectedMetric, salesData, setIsExporting, setShowExportOptions) => {
  if (setIsExporting.current) return
  
  // Rate limiting check
  if (!rateLimit('export-pdf')) {
    console.warn('Export rate limit exceeded')
    return
  }
  
  setIsExporting.current(true)
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
    setIsExporting.current(false)
    setShowExportOptions.current(false)
  }
}

export const exportToJSON = async (selectedPeriod, selectedMetric, salesData, setIsExporting, setShowExportOptions) => {
  if (setIsExporting.current) return
  
  // Rate limiting check
  if (!rateLimit('export-json')) {
    console.warn('Export rate limit exceeded')
    return
  }
  
  setIsExporting.current(true)
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
    setIsExporting.current(false)
    setShowExportOptions.current(false)
  }
}
