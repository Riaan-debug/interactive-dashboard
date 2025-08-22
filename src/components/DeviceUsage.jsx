import React from 'react'
import { Activity } from 'lucide-react'
import { Doughnut } from 'react-chartjs-2'

const DeviceUsage = ({ deviceData, doughnutData, chartOptions, chartAnimation, useCountUp }) => {
  return (
    <div className="chart-container animate-scale-in hover:shadow-enterprise-xl transition-all duration-500 group" style={{ animationDelay: '200ms' }}>
      <h3 className="chart-title group-hover:text-warning-700 transition-colors duration-300">
        <Activity className="h-5 w-5 text-warning-600 group-hover:scale-110 transition-transform duration-300" />
        Platform Distribution
      </h3>
      <div className="h-64 mb-4 relative">
        <Doughnut data={doughnutData} options={chartOptions} />
        {!chartAnimation && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-neutral-600/20 to-transparent animate-pulse" />
        )}
      </div>
      <div className="space-y-3">
        {deviceData.map((device, index) => {
          const Icon = device.icon
          const CountUpValue = useCountUp(device.value, 1500, 800 + index * 200)
          return (
            <div key={index} className="flex items-center justify-between p-3 bg-neutral-50/50 dark:bg-neutral-700/50 rounded-lg hover:bg-neutral-100/50 dark:hover:bg-neutral-600/50 transition-all duration-300 hover:scale-102">
              <div className="flex items-center gap-3">
                <Icon className={`h-4 w-4 ${device.color} transition-transform duration-300 group-hover:scale-110`} />
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {device.name}
                </span>
              </div>
              <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {CountUpValue.toLocaleString()}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DeviceUsage
