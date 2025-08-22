import React from 'react'
import { Activity } from 'lucide-react'

const ActivityFeed = ({ activities }) => {
  return (
    <div className="chart-container lg:col-span-2 animate-scale-in hover:shadow-enterprise-xl transition-all duration-500 group" style={{ animationDelay: '300ms' }}>
      <h3 className="chart-title group-hover:text-primary-700 transition-colors duration-300">
        <Activity className="h-5 w-5 text-primary-600 group-hover:scale-110 transition-transform duration-300" />
        Activity Feed
      </h3>
      <div className="space-y-2">
        {activities.map((activity, index) => (
          <div key={index} className="activity-item hover:bg-neutral-100/70 dark:hover:bg-neutral-600/70 transition-all duration-300 hover:scale-102">
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {activity.action}
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {activity.time}
              </p>
            </div>
            {activity.amount && (
              <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-700 px-3 py-1 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors duration-300">
                {activity.amount}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ActivityFeed
