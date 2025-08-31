export const createChartOptions = (chartAnimation, selectedPeriod, selectedMetric, showGridLines = true, chartTransparency = 0.8) => ({
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
      enabled: true,
      mode: 'index',
      intersect: false,
      position: 'nearest',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      titleColor: 'white',
      bodyColor: 'white',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderWidth: 1,
      cornerRadius: 6,
      padding: 10,
      displayColors: true,
      titleFont: { size: 14, weight: 'bold' },
      bodyFont: { size: 12 },
      // Enhanced callbacks for formatting
      callbacks: {
        title: (context) => {
          return `Period: ${context[0].label}`
        },
        label: (context) => {
          const value = context.parsed.y
          if (selectedMetric === 'revenue') {
            return `${context.dataset.label}: R${value.toLocaleString()}`
          }
          return `${context.dataset.label}: ${value.toLocaleString()}`
        },
        afterLabel: (context) => {
          return ''
        }
      }
    },
    zoom: {
      pan: {
        enabled: true,
        mode: 'xy',
        speed: 20,
      },
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
        display: showGridLines,
        color: 'rgba(0, 0, 0, 0.08)',
        drawBorder: false,
        lineWidth: 1,
        drawTicks: true,
        drawOnChartArea: true,
        // Force consistent grid line spacing with higher density
        ticks: {
          stepSize: undefined, // Let Chart.js calculate optimal step size
          maxTicksLimit: 20, // Increased from 10 to 20 for better alignment
        }
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
      border: {
        color: 'rgba(0, 0, 0, 0.1)',
        width: 1,
      }
    },
    x: {
      grid: {
        display: showGridLines,
        color: 'rgba(0, 0, 0, 0.08)',
        drawBorder: false,
        lineWidth: 1,
        drawTicks: true,
        drawOnChartArea: true,
        // Force consistent grid line spacing
        ticks: {
          maxTicksLimit: 12, // Limit number of x-axis grid lines
          maxRotation: 45, // Prevent label overlap
        }
      },
      ticks: {
        color: '#64748b',
        font: {
          size: 12,
        },
      },
      border: {
        color: 'rgba(0, 0, 0, 0.1)',
        width: 1,
      }
    },
  },
  elements: {
    line: {
      borderWidth: 3,
      tension: 0.4,
      backgroundColor: `rgba(59, 130, 246, ${chartTransparency})`,
      borderColor: `rgba(59, 130, 246, ${chartTransparency})`,
    },
    point: {
      hoverRadius: 8,
      radius: chartAnimation ? 0 : 4,
      backgroundColor: `rgba(59, 130, 246, ${chartTransparency})`,
      borderColor: `rgba(59, 130, 246, ${chartTransparency})`,
      animation: {
        radius: {
          duration: 1000,
          easing: 'easeOutQuart',
        }
      }
    },
    bar: {
      backgroundColor: `rgba(59, 130, 246, ${chartTransparency})`,
      borderColor: `rgba(59, 130, 246, ${chartTransparency})`,
      borderWidth: 2,
      borderRadius: 6,
      borderSkipped: false,
      hoverBackgroundColor: `rgba(59, 130, 246, ${chartTransparency})`,
      hoverBorderColor: `rgba(37, 99, 235, ${chartTransparency})`,
      hoverBorderWidth: 3,
    }
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
  // Enhanced hover settings
  hover: {
    mode: 'index',
    intersect: false,
    axis: 'xy'
  },
})

export const createMultiMetricOptions = (chartAnimation, showGridLines = true, chartTransparency = 0.8) => ({
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
      enabled: true,
      mode: 'index',
      intersect: false,
      position: 'nearest',
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
      // Enhanced callbacks for formatting
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
        },
        afterLabel: (context) => {
          return ''
        }
      }
    },
    zoom: {
      pan: {
        enabled: true,
        mode: 'xy',
        speed: 20,
      },
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
      limits: {
        x: {min: 'original', max: 'original'},
        y: {min: 'original', max: 'original'}
      }
    },
  },
  scales: {
    y: {
      display: true,
      position: 'left',
      beginAtZero: true,
      grid: {
        display: showGridLines,
        color: 'rgba(0, 0, 0, 0.08)',
        drawBorder: false,
        lineWidth: 1,
        drawTicks: true,
        drawOnChartArea: true,
        // Force consistent grid line spacing with higher density
        ticks: {
          stepSize: undefined, // Let Chart.js calculate optimal step size
          maxTicksLimit: 20, // Increased from 10 to 20 for better alignment
        }
      },
      ticks: {
        color: '#64748b',
        font: { size: 12 },
        callback: (value) => `R${value.toLocaleString()}`
      },
      border: {
        color: 'rgba(0, 0, 0, 0.1)',
        width: 1,
      }
    },
    y1: {
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
        display: showGridLines,
        color: 'rgba(0, 0, 0, 0.08)',
        drawBorder: false,
        lineWidth: 1,
        drawTicks: true,
        drawOnChartArea: true,
        // Force consistent grid line spacing
        ticks: {
          maxTicksLimit: 12, // Limit number of x-axis grid lines
          maxRotation: 45, // Prevent label overlap
        }
      },
      ticks: {
        color: '#64748b',
        font: { size: 12 },
      },
      border: {
        color: 'rgba(0, 0, 0, 0.1)',
        width: 1,
      }
    },
  },
  elements: {
    line: {
      borderWidth: 3,
      tension: 0.4,
      backgroundColor: `rgba(59, 130, 246, ${chartTransparency})`,
      borderColor: `rgba(59, 130, 246, ${chartTransparency})`,
    },
    point: {
      hoverRadius: 8,
      radius: chartAnimation ? 0 : 4,
      backgroundColor: `rgba(59, 130, 246, ${chartTransparency})`,
      borderColor: `rgba(59, 130, 246, ${chartTransparency})`,
      animation: {
        radius: {
          duration: 1000,
          easing: 'easeOutQuart',
        }
      }
    },
    bar: {
      backgroundColor: `rgba(59, 130, 246, ${chartTransparency})`,
      borderColor: `rgba(59, 130, 246, ${chartTransparency})`,
      borderWidth: 2,
      borderRadius: 6,
      borderSkipped: false,
      hoverBackgroundColor: `rgba(59, 130, 246, ${chartTransparency})`,
      hoverBorderColor: `rgba(37, 99, 235, ${chartTransparency})`,
      hoverBorderWidth: 3,
    }
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
  // Enhanced hover settings
  hover: {
    mode: 'index',
    intersect: false,
    axis: 'xy'
  },
})
