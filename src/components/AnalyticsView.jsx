import React, { useState, useMemo } from 'react'
import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react'
import SalesChart from './SalesChart'
import BarChart from './BarChart'

import { useSettings } from '../contexts/SettingsContext'
import { salesData } from '../data/dashboardData'
import { createChartOptions, createMultiMetricOptions } from '../utils/chartOptions'
import { createChartData, createMultiMetricData } from '../utils/chartData'

const AnalyticsView = () => {
  const { settings } = useSettings()
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedMetric, setSelectedMetric] = useState('revenue')
  const [chartType, setChartType] = useState('line')


  // Memoized chart data and options
  const chartData = useMemo(() =>
    createChartData(selectedPeriod, selectedMetric, salesData, settings.appearance.chartTransparency),
    [selectedPeriod, selectedMetric, salesData, settings.appearance.chartTransparency]
  )

  const multiMetricData = useMemo(() =>
    createMultiMetricData(selectedPeriod, salesData, settings.appearance.chartTransparency),
    [selectedPeriod, salesData, settings.appearance.chartTransparency]
  )

  const chartOptions = useMemo(() =>
    createChartOptions(false, selectedPeriod, selectedMetric, settings.appearance.showGridLines, settings.appearance.chartTransparency),
    [selectedPeriod, selectedMetric, settings.appearance.showGridLines, settings.appearance.chartTransparency]
  )

  const multiMetricOptions = useMemo(() =>
    createMultiMetricOptions(false, settings.appearance.showGridLines, settings.appearance.chartTransparency),
    [settings.appearance.showGridLines, settings.appearance.chartTransparency]
  )

  // Enhanced bar data for better visualization
  const enhancedBarData = useMemo(() => ({
    ...chartData,
    datasets: chartData.datasets.map(dataset => ({
      ...dataset,
      backgroundColor: 'rgba(59, 130, 246, 0.9)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 2,
      borderRadius: 6,
      hoverBackgroundColor: 'rgba(59, 130, 246, 1)',
      hoverBorderColor: 'rgba(37, 99, 235, 1)',
      hoverBorderWidth: 3,
    }))
  }), [chartData])





  // Enhanced analytics data
  const analyticsStats = [
    {
      title: 'Total Revenue',
      value: 'R' + salesData[selectedPeriod].revenue.reduce((a, b) => a + b, 0).toLocaleString(),
      change: '+15.3%',
      changeType: 'positive',
      icon: TrendingUp,
              color: 'text-primary'
    },
    {
      title: 'Average Order Value',
      value: 'R' + Math.round(salesData[selectedPeriod].revenue.reduce((a, b) => a + b, 0) / salesData[selectedPeriod].volume.reduce((a, b) => a + b, 0)).toLocaleString(),
      change: '+8.7%',
      changeType: 'positive',
      icon: BarChart3,
      color: 'text-success-600'
    },
    {
      title: 'Customer Acquisition',
      value: salesData[selectedPeriod].customers.reduce((a, b) => a + b, 0).toLocaleString(),
      change: '+12.1%',
      changeType: 'positive',
      icon: Activity,
      color: 'text-warning-600'
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      change: '+2.3%',
      changeType: 'positive',
      icon: PieChart,
      color: 'text-danger-600'
    }
  ]



  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          📈 Advanced Analytics
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Deep dive into your business metrics with advanced visualization and insights
        </p>
      </div>

      {/* Controls */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Time Period
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Primary Metric
            </label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="revenue">Revenue</option>
              <option value="volume">Volume</option>
              <option value="profit">Profit</option>
              <option value="customers">Customers</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Chart Type
            </label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
              <option value="area">Area Chart</option>
            </select>
          </div>
        </div>
      </div>

      {/* Analytics Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {analyticsStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div 
              key={index} 
              className="bg-white dark:bg-neutral-800 rounded-xl shadow-enterprise border border-neutral-200/60 dark:border-neutral-700/60 p-6 animate-slide-up hover:scale-105 transition-transform duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-neutral-100 dark:bg-neutral-700 ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-success-600' : 'text-danger-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  vs. last period
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Chart */}
      {chartType === 'line' ? (
        <SalesChart
          chartData={chartData}
          chartOptions={chartOptions}
          title={`${selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Analytics (Line)`}
          icon={TrendingUp}
          iconColor="accent"
          showControls={true}
        />
      ) : chartType === 'bar' ? (
        <BarChart
          chartData={enhancedBarData}
          chartOptions={chartOptions}
          title={`${selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Analytics (Bar)`}
          icon={TrendingUp}
          iconColor="accent"
          showControls={true}
        />
      ) : (
        <SalesChart
          chartData={chartData}
          chartOptions={{
            ...chartOptions,
            elements: {
              ...chartOptions.elements,
              line: {
                ...chartOptions.elements.line,
                fill: true
              }
            }
          }}
          title={`${selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Analytics (Area)`}
          icon={TrendingUp}
          iconColor="accent"
          showControls={true}
        />
      )}

      {/* Multi-Metric Comparison */}
      <div className="mt-8">
        <SalesChart
          chartData={multiMetricData}
          chartOptions={multiMetricOptions}
          title="Multi-Metric Comparison"
          icon={BarChart3}
          iconColor="success"
          showControls={true}
        />
      </div>

      {/* Insights Panel */}
      <div className="mt-8 bg-gradient-to-r from-primary-light to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 rounded-xl p-6 border border-primary-200/60 dark:border-primary-700/60">
        <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-4">
          💡 Key Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-primary-800 dark:text-primary-200">
                  Revenue Trend
                </p>
                <p className="text-sm text-primary-700 dark:text-primary-300">
                  {selectedPeriod === 'week' ? 'Weekly' : selectedPeriod === 'month' ? 'Monthly' : 'Yearly'} revenue shows a {selectedMetric === 'revenue' ? 'strong upward' : 'consistent'} trend
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-success-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-primary-800 dark:text-primary-200">
                  Performance
                </p>
                <p className="text-sm text-primary-700 dark:text-primary-300">
                  Your {selectedMetric} performance is above industry benchmarks
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-warning-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-primary-800 dark:text-primary-200">
                  Opportunities
                </p>
                <p className="text-sm text-primary-700 dark:text-primary-300">
                  Consider expanding into new markets based on current growth patterns
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-danger-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-primary-800 dark:text-primary-200">
                  Recommendations
                </p>
                <p className="text-sm text-primary-700 dark:text-primary-300">
                  Focus on customer retention strategies to maintain growth momentum
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsView
