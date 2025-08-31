import React, { createContext, useContext, useState, useEffect } from 'react'

// Default settings
const defaultSettings = {
  general: {
    dashboardRefreshRate: 30,
    defaultPeriod: 'week',
    showAnimations: true,
    compactMode: false
  },
  appearance: {
    primaryColor: '#3B82F6', // Default to blue hex value
    fontSize: 'medium',
    showGridLines: true,
    chartTransparency: 0.8
  },
  notifications: {
    emailAlerts: true,
    pushNotifications: false,
    weeklyReports: true,
    performanceAlerts: true
  },
  security: {
    twoFactorAuth: false,
    sessionTimeout: 60,
    requirePasswordChange: false,
    loginAttempts: 3
  },
  data: {
    autoBackup: true,
    backupFrequency: 'daily',
    dataRetention: 365,
    exportFormat: 'excel'
  }
}

const SettingsContext = createContext()

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('dashboardSettings')
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings
  })

  // Listen for settings changes from the settings page
  useEffect(() => {
    const handleSettingsChange = (event) => {
      setSettings(event.detail)
    }

    window.addEventListener('dashboardSettingsChanged', handleSettingsChange)
    
    return () => {
      window.removeEventListener('dashboardSettingsChanged', handleSettingsChange)
    }
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('dashboardSettings', JSON.stringify(settings))
  }, [settings])

  // Update CSS custom properties when primary color changes
  useEffect(() => {
    const updateCSSVariables = (primaryColor) => {
      // Generate color variations based on the primary color
      const root = document.documentElement
      
      // Convert hex to RGB for transparency calculations
      const hex = primaryColor.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16)
      const g = parseInt(hex.substr(2, 2), 16)
      const b = parseInt(hex.substr(4, 2), 16)
      
      // Set the base primary color
      root.style.setProperty('--primary-color', primaryColor)
      
      // Generate lighter shades (50-400)
      root.style.setProperty('--primary-color-50', `rgba(${r}, ${g}, ${b}, 0.05)`)
      root.style.setProperty('--primary-color-100', `rgba(${r}, ${g}, ${b}, 0.1)`)
      root.style.setProperty('--primary-color-200', `rgba(${r}, ${g}, ${b}, 0.2)`)
      root.style.setProperty('--primary-color-300', `rgba(${r}, ${g}, ${b}, 0.3)`)
      root.style.setProperty('--primary-color-400', `rgba(${r}, ${g}, ${b}, 0.4)`)
      root.style.setProperty('--primary-color-500', primaryColor)
      
      // Generate darker shades (600-900)
      const darken = (amount) => {
        const factor = 1 - amount
        return `rgb(${Math.round(r * factor)}, ${Math.round(g * factor)}, ${Math.round(b * factor)})`
      }
      
      root.style.setProperty('--primary-color-600', darken(0.2))
      root.style.setProperty('--primary-color-700', darken(0.3))
      root.style.setProperty('--primary-color-800', darken(0.4))
      root.style.setProperty('--primary-color-900', darken(0.5))
    }

    if (settings.appearance.primaryColor) {
      updateCSSVariables(settings.appearance.primaryColor)
    }
  }, [settings.appearance.primaryColor])

  // Update font size when it changes or on initial load
  useEffect(() => {
    const updateFontSize = (fontSize) => {
      const root = document.documentElement
      
      // Define font size scales
      const fontSizes = {
        small: {
          '--base-font-size': '14px',
          '--heading-font-size': '18px',
          '--subheading-font-size': '16px',
          '--body-font-size': '14px',
          '--small-font-size': '12px'
        },
        medium: {
          '--base-font-size': '16px',
          '--heading-font-size': '20px',
          '--subheading-font-size': '18px',
          '--body-font-size': '16px',
          '--small-font-size': '14px'
        },
        large: {
          '--base-font-size': '18px',
          '--heading-font-size': '24px',
          '--subheading-font-size': '20px',
          '--body-font-size': '18px',
          '--small-font-size': '16px'
        }
      }
      
      // Apply the selected font size
      const selectedSize = fontSizes[fontSize] || fontSizes.medium
      Object.entries(selectedSize).forEach(([property, value]) => {
        root.style.setProperty(property, value)
      })
    }

    // Apply font size on initial load and when it changes
    updateFontSize(settings.appearance.fontSize)
  }, [settings.appearance.fontSize])

  const updateSettings = (newSettings) => {
    setSettings(newSettings)
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
  }

  const value = {
    settings,
    updateSettings,
    resetSettings,
    defaultSettings
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}
