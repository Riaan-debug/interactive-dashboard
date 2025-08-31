import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { Chart, registerables } from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom'

// Register all Chart.js components and the zoom plugin
Chart.register(...registerables, zoomPlugin)

// Configure Chart.js defaults for tooltips and interactions
Chart.defaults.plugins.tooltip.enabled = true
Chart.defaults.plugins.tooltip.mode = 'index'
Chart.defaults.plugins.tooltip.intersect = false
Chart.defaults.plugins.tooltip.position = 'nearest'

// Configure interaction defaults
Chart.defaults.interaction.mode = 'index'
Chart.defaults.interaction.intersect = false

// Configure hover defaults
Chart.defaults.hover.mode = 'index'
Chart.defaults.hover.intersect = false

// Configure global grid defaults for consistent spacing
Chart.defaults.scales.linear.grid = {
  ...Chart.defaults.scales.linear.grid,
  drawTicks: true,
  drawOnChartArea: true,
  color: 'rgba(0, 0, 0, 0.08)',
  lineWidth: 1
}



Chart.defaults.scales.category.grid = {
  ...Chart.defaults.scales.category.grid,
  drawTicks: true,
  drawOnChartArea: true,
  color: 'rgba(0, 0, 0, 0.08)',
  lineWidth: 1,
  // Force consistent grid line spacing
  ticks: {
    maxTicksLimit: 12,
    maxRotation: 45,
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
