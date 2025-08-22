export const createChartOptions = (chartAnimation, selectedPeriod, selectedMetric) => ({
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
})

export const createMultiMetricOptions = (chartAnimation) => ({
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
          const period = context[0].label.includes('week') ? 'Daily' : context[0].label.includes('month') ? 'Daily' : 'Monthly'
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
})
