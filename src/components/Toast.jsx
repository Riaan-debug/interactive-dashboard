import React, { useEffect } from 'react'
import { CheckCircle, X } from 'lucide-react'

const Toast = ({ message, type = 'success', isVisible, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible) return null

  const bgColor = type === 'success' 
    ? 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800' 
    : 'bg-neutral-50 dark:bg-neutral-900/20 border-neutral-200 dark:border-neutral-800'
  
  const textColor = type === 'success' 
    ? 'text-success-800 dark:text-success-200' 
    : 'text-neutral-800 dark:text-neutral-200'
  
  const iconColor = type === 'success' ? 'text-success-600' : 'text-neutral-600'

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg border shadow-lg ${bgColor} animate-slide-in`}>
      <div className="flex items-center gap-3">
        <CheckCircle className={`h-5 w-5 ${iconColor}`} />
        <span className={`font-medium ${textColor}`}>{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default Toast

