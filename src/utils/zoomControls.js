export const handleZoomIn = (chartRefs) => {
  const chartElement = chartRefs.current.mainChart
  if (chartElement && chartElement.chart) {
    const chart = chartElement.chart
    if (chart.zoom) {
      chart.zoom(1.2)
      chart.update()
      return
    }
  }
  // Alternative: try to access the chart directly
  if (chartElement && typeof chartElement.zoom === 'function') {
    chartElement.zoom(1.2)
    chartElement.update()
    return
  }
}

export const handleZoomOut = (chartRefs) => {
  const chartElement = chartRefs.current.mainChart
  if (chartElement && chartElement.chart) {
    const chart = chartElement.chart
    if (chart.zoom) {
      chart.zoom(0.8)
      chart.update()
      return
    }
  }
  // Alternative: try to access the chart directly
  if (chartElement && typeof chartElement.zoom === 'function') {
    chartElement.zoom(0.8)
    chartElement.update()
    return
  }
}

export const handleResetZoom = (chartRefs) => {
  const chartElement = chartRefs.current.mainChart
  if (chartElement && chartElement.chart) {
    const chart = chartElement.chart
    if (chart.resetZoom) {
      chart.resetZoom()
      chart.update()
      return
    }
  }
  // Alternative: try to access the chart directly
  if (chartElement && typeof chartElement.resetZoom === 'function') {
    chartElement.resetZoom()
    chartElement.update()
    return
  }
}
