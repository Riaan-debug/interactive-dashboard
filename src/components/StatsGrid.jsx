import React from 'react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

const StatsGrid = ({ stats, useCountUp }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        const CountUpValue = useCountUp(stat.numericValue, 2000, index * 200)
        
        return (
          <div 
            key={index} 
            className={`metric-card animate-slide-up hover:scale-105 transition-transform duration-300`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <p className="stat-label">{stat.title}</p>
                <p className="stat-value mt-2">
                  {stat.prefix}{CountUpValue.toLocaleString()}{stat.suffix}
                </p>
              </div>
              <div className={`metric-icon ${stat.iconClass} transition-transform duration-300 hover:scale-110`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {stat.changeType === 'positive' ? (
                <ArrowUpRight className="h-4 w-4 text-success-600 animate-pulse" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-danger-600 animate-pulse" />
              )}
              <span className={`trend-indicator ${
                stat.changeType === 'positive' ? 'trend-positive' : 'trend-negative'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-neutral-500">{stat.description}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StatsGrid
