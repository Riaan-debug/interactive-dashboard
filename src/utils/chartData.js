export const createChartData = (selectedPeriod, selectedMetric, salesData, chartTransparency = 0.8) => ({
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
      backgroundColor: `rgba(59, 130, 246, ${chartTransparency * 0.125})`,
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#3b82f6',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
})

export const createMultiMetricData = (selectedPeriod, salesData, chartTransparency = 0.8) => ({
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
      backgroundColor: `rgba(59, 130, 246, ${chartTransparency * 0.125})`,
      tension: 0.4,
      fill: true,
      yAxisID: 'y',
    },
    {
      label: 'Profit (R)',
      data: salesData[selectedPeriod].profit,
      borderColor: '#22c55e',
      backgroundColor: `rgba(34, 197, 94, ${chartTransparency * 0.125})`,
      tension: 0.4,
      fill: true,
      yAxisID: 'y1',
    },
    {
      label: 'Customers',
      data: salesData[selectedPeriod].customers,
      borderColor: '#f59e0b',
      backgroundColor: `rgba(245, 158, 11, ${chartTransparency * 0.125})`,
      tension: 0.4,
      fill: false,
      yAxisID: 'y2',
    }
  ],
})
