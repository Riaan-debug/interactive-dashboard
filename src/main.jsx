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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
