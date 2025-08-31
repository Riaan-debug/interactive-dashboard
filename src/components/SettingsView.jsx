import React, { useState, useEffect } from 'react'
import { 
  Settings, 
  Palette, 
  Bell, 
  Shield, 
  Database, 
  Monitor, 
  User, 
  Globe,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Download,
  Upload,
  FileText,
  FileSpreadsheet,
  List,
  X
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useSettings } from '../contexts/SettingsContext'
import { buildApiUrl } from '../config/environment'

const SettingsView = () => {
  const { isDarkMode, toggleTheme } = useTheme()
  const { settings, updateSettings, resetSettings, defaultSettings } = useSettings()
  const [activeTab, setActiveTab] = useState('general')
  const [saved, setSaved] = useState(false)
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [backupStatus, setBackupStatus] = useState(null)
  const [showBackupHistory, setShowBackupHistory] = useState(false)
  const [backups, setBackups] = useState([])
  const [isSaving, setIsSaving] = useState(false)

  // Color presets for reference
  const colorPresets = [
    { name: 'blue', hex: '#3B82F6' },
    { name: 'green', hex: '#10B981' },
    { name: 'purple', hex: '#8B5CF6' },
    { name: 'red', hex: '#EF4444' },
    { name: 'orange', hex: '#F97316' },
    { name: 'teal', hex: '#14B8A6' },
    { name: 'pink', hex: '#EC4899' },
    { name: 'indigo', hex: '#6366F1' },
    { name: 'yellow', hex: '#EAB308' },
    { name: 'rose', hex: '#F43F5E' },
    { name: 'emerald', hex: '#059669' },
    { name: 'violet', hex: '#7C3AED' }
  ]

  // Function to get closest preset color name
  const getClosestColorName = (hexColor) => {
    if (!hexColor.startsWith('#')) return 'blue'
    
    const preset = colorPresets.find(preset => preset.hex === hexColor)
    if (preset) return preset.name
    
    // If no exact match, return 'custom'
    return 'custom'
  }

  const handleSettingChange = (category, key, value) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value
      }
    }
    updateSettings(newSettings)
    setSaved(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setSaved(true)
    
    setTimeout(() => setSaved(false), 3000)
  }

  const handleReset = () => {
    resetSettings()
    setSaved(false)
  }

  // Backup and Export Functions
  const handleCreateBackup = async () => {
    setIsBackingUp(true)
    setBackupStatus(null)
    
    try {
      console.log('Attempting to connect to backend...')
      
      const response = await fetch(buildApiUrl('/backup/create'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify({
          backupType: 'manual',
          includeData: true
        })
      })
      
      console.log('Backend response:', response)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Backend data:', data)
      
      if (data.success) {
        setBackupStatus({
          type: 'success',
          message: `Backup created successfully: ${data.filename}`
        })
        // Don't automatically show backup history - let user choose when to view it
      } else {
        setBackupStatus({
          type: 'error',
          message: data.error || 'Failed to create backup'
        })
      }
    } catch (error) {
      console.error('Backup error:', error)
      setBackupStatus({
        type: 'error',
        message: `Connection error: ${error.message}`
      })
    } finally {
      setIsBackingUp(false)
    }
  }

  const handleListBackups = async () => {
    try {
      console.log('Fetching backup list...')
      
      const response = await fetch(buildApiUrl('/backup/list'), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
      })
      
      console.log('Backup list response:', response)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Backup list data:', data)
      
      if (data.success) {
        setBackups(data.backups)
        setShowBackupHistory(true)
      } else {
        setBackupStatus({
          type: 'error',
          message: data.error || 'Failed to fetch backup history'
        })
      }
    } catch (error) {
      console.error('Backup list error:', error)
      setBackupStatus({
        type: 'error',
        message: `Failed to fetch backup history: ${error.message}`
      })
    }
  }

  const handleTestConnection = async () => {
    try {
      console.log('Testing backend connection...')
      
      const response = await fetch(buildApiUrl('/health'), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
      })
      
      console.log('Health check response:', response)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Health check data:', data)
        setBackupStatus({
          type: 'success',
          message: `✅ Backend connected! Status: ${data.status}`
        })
      } else {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error('Connection test error:', error)
      setBackupStatus({
        type: 'error',
        message: `❌ Connection failed: ${error.message}`
      })
    }
  }

  const handleExportData = async (format) => {
    setIsExporting(true)
    setBackupStatus(null)
    
    try {
      console.log(`Exporting data to ${format}...`)
      
      const response = await fetch(buildApiUrl('/export/data'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify({
          format: format,
          dataType: 'dashboard',
          selectedPeriod: 'week'
        })
      })
      
      console.log('Export response:', response)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      // Get the filename from the Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition')
      const filename = contentDisposition ? 
        contentDisposition.split('filename=')[1]?.replace(/"/g, '') : 
        `dashboard-export-${format}-${new Date().toISOString().replace(/[:.]/g, '-')}.${format === 'excel' ? 'xlsx' : format}`
      
      // Get the file data as blob
      const blob = await response.blob()
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      // Show success message
      setBackupStatus({
        type: 'success',
        message: `${format.toUpperCase()} export completed and downloaded: ${filename}`
      })
      
    } catch (error) {
      console.error('Export error:', error)
      setBackupStatus({
        type: 'error',
        message: `Export error: ${error.message}`
      })
    } finally {
      setIsExporting(false)
    }
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'data', label: 'Data & Backup', icon: Database }
  ]

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          Dashboard Preferences
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Dashboard Refresh Rate (seconds)
            </label>
                         <select
               value={settings.general.dashboardRefreshRate}
               onChange={(e) => handleSettingChange('general', 'dashboardRefreshRate', parseInt(e.target.value))}
               className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary focus:border-transparent"
             >
              <option value={15}>15 seconds</option>
              <option value={30}>30 seconds</option>
              <option value={60}>1 minute</option>
              <option value={300}>5 minutes</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Default Time Period
            </label>
                         <select
               value={settings.general.defaultPeriod}
               onChange={(e) => handleSettingChange('general', 'defaultPeriod', e.target.value)}
               className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary focus:border-transparent"
             >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="quarter">Quarter</option>
              <option value="year">Year</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Show Animations
              </label>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Enable smooth transitions and animations
              </p>
            </div>
            <button
              onClick={() => handleSettingChange('general', 'showAnimations', !settings.general.showAnimations)}
                             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                 settings.general.showAnimations ? 'bg-primary' : 'bg-neutral-200 dark:bg-neutral-700'
               }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.general.showAnimations ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Compact Mode
              </label>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Reduce spacing for more content
              </p>
            </div>
            <button
              onClick={() => handleSettingChange('general', 'compactMode', !settings.general.compactMode)}
                             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                 settings.general.compactMode ? 'bg-primary' : 'bg-neutral-200 dark:bg-neutral-700'
               }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.general.compactMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          Theme & Colors
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Dark Mode
              </label>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Switch between light and dark themes
              </p>
            </div>
            <button
              onClick={toggleTheme}
                             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                 isDarkMode ? 'bg-primary' : 'bg-neutral-200 dark:bg-neutral-700'
               }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Primary Color
            </label>
            
            {/* Current Color Display */}
            <div className="mb-4 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">Current Selection</p>
              <div className="flex items-center gap-3">
                <div 
                  className="h-12 w-12 rounded-lg border-2 border-neutral-300 dark:border-neutral-600 shadow-sm"
                  style={{ backgroundColor: settings.appearance.primaryColor.startsWith('#') ? settings.appearance.primaryColor : '#3B82F6' }}
                />
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {getClosestColorName(settings.appearance.primaryColor).charAt(0).toUpperCase() + getClosestColorName(settings.appearance.primaryColor).slice(1)} 
                    {getClosestColorName(settings.appearance.primaryColor) === 'custom' && ` (${settings.appearance.primaryColor})`}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Primary accent color for your dashboard
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {/* Quick Color Presets */}
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                  Quick Presets
                </p>
                <div className="grid grid-cols-6 gap-2">
                  {colorPresets.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => handleSettingChange('appearance', 'primaryColor', color.hex)}
                                             className={`h-10 rounded-lg border-2 transition-all ${
                         settings.appearance.primaryColor === color.hex
                           ? 'border-primary scale-110'
                           : 'border-neutral-300 dark:border-neutral-600 hover:border-neutral-400'
                       }`}
                      style={{
                        backgroundColor: color.hex
                      }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
              
              {/* Custom Color Picker */}
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                  Custom Color
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.appearance.primaryColor.startsWith('#') ? settings.appearance.primaryColor : '#3B82F6'}
                    onChange={(e) => handleSettingChange('appearance', 'primaryColor', e.target.value)}
                    className="h-10 w-16 rounded-lg border-2 border-neutral-300 dark:border-neutral-600 cursor-pointer"
                    title="Choose custom color"
                    aria-label="Select custom color"
                  />
                  <input
                    type="text"
                    value={settings.appearance.primaryColor.startsWith('#') ? settings.appearance.primaryColor : '#3B82F6'}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.match(/^#[0-9A-Fa-f]{6}$/)) {
                        handleSettingChange('appearance', 'primaryColor', value);
                      }
                    }}
                    placeholder="#3B82F6"
                                         className="flex-1 px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                    aria-label="Enter hex color code"
                  />
                  <div 
                    className="h-10 w-10 rounded-lg border-2 border-neutral-300 dark:border-neutral-600"
                    style={{ backgroundColor: settings.appearance.primaryColor.startsWith('#') ? settings.appearance.primaryColor : '#3B82F6' }}
                    title="Current color preview"
                  />
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Enter a hex color code (e.g., #3B82F6) or use the color picker
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Font Size
            </label>
                         <select
               value={settings.appearance.fontSize}
               onChange={(e) => handleSettingChange('appearance', 'fontSize', e.target.value)}
               className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary focus:border-transparent"
             >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Show Grid Lines
              </label>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Display grid lines in charts
              </p>
            </div>
            <button
              onClick={() => handleSettingChange('appearance', 'showGridLines', !settings.appearance.showGridLines)}
                             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                 settings.appearance.showGridLines ? 'bg-primary' : 'bg-neutral-200 dark:bg-neutral-700'
               }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.appearance.showGridLines ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Chart Transparency: {(settings.appearance.chartTransparency * 100).toFixed(2)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={settings.appearance.chartTransparency}
              onChange={(e) => handleSettingChange('appearance', 'chartTransparency', parseFloat(e.target.value))}
              className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          Notification Preferences
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Email Alerts
              </label>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Receive important updates via email
              </p>
            </div>
            <button
              onClick={() => handleSettingChange('notifications', 'emailAlerts', !settings.notifications.emailAlerts)}
                             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                 settings.notifications.emailAlerts ? 'bg-primary' : 'bg-neutral-200 dark:bg-neutral-700'
               }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifications.emailAlerts ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Push Notifications
              </label>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Browser push notifications
              </p>
            </div>
            <button
              onClick={() => handleSettingChange('notifications', 'pushNotifications', !settings.notifications.pushNotifications)}
                             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                 settings.notifications.pushNotifications ? 'bg-primary' : 'bg-neutral-200 dark:bg-neutral-700'
               }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifications.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Weekly Reports
              </label>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Automated weekly performance summaries
              </p>
            </div>
            <button
              onClick={() => handleSettingChange('notifications', 'weeklyReports', !settings.notifications.weeklyReports)}
                             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                 settings.notifications.weeklyReports ? 'bg-primary' : 'bg-neutral-200 dark:bg-neutral-700'
               }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifications.weeklyReports ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Performance Alerts
              </label>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Notify when performance drops below threshold
              </p>
            </div>
            <button
              onClick={() => handleSettingChange('notifications', 'performanceAlerts', !settings.notifications.performanceAlerts)}
                             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                 settings.notifications.performanceAlerts ? 'bg-primary' : 'bg-neutral-700'
               }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifications.performanceAlerts ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          Security Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Two-Factor Authentication
              </label>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Add an extra layer of security
              </p>
            </div>
            <button
              onClick={() => handleSettingChange('security', 'twoFactorAuth', !settings.security.twoFactorAuth)}
                             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                 settings.security.twoFactorAuth ? 'bg-primary' : 'bg-neutral-200 dark:bg-neutral-700'
               }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.security.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Session Timeout (minutes)
            </label>
                         <select
               value={settings.security.sessionTimeout}
               onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
               className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary focus:border-transparent"
             >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
              <option value={480}>8 hours</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Require Password Change
              </label>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Force password change on next login
              </p>
            </div>
            <button
              onClick={() => handleSettingChange('security', 'requirePasswordChange', !settings.security.requirePasswordChange)}
                             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                 settings.security.requirePasswordChange ? 'bg-primary' : 'bg-neutral-200 dark:bg-neutral-700'
               }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.security.requirePasswordChange ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Maximum Login Attempts
            </label>
                         <select
               value={settings.security.loginAttempts}
               onChange={(e) => handleSettingChange('security', 'loginAttempts', parseInt(e.target.value))}
               className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary focus:border-transparent"
             >
              <option value={3}>3 attempts</option>
              <option value={5}>5 attempts</option>
              <option value={10}>10 attempts</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderDataSettings = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          Data Management
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Auto Backup
              </label>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Automatically backup dashboard data
              </p>
            </div>
            <button
              onClick={() => handleSettingChange('data', 'autoBackup', !settings.data.autoBackup)}
                             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                 settings.data.autoBackup ? 'bg-primary' : 'bg-neutral-200 dark:bg-neutral-700'
               }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.data.autoBackup ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Backup Frequency
            </label>
                         <select
               value={settings.data.backupFrequency}
               onChange={(e) => handleSettingChange('data', 'backupFrequency', e.target.value)}
               className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary focus:border-transparent"
             >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Data Retention (days)
            </label>
                         <select
               value={settings.data.dataRetention}
               onChange={(e) => handleSettingChange('data', 'dataRetention', parseInt(e.target.value))}
               className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary focus:border-transparent"
             >
              <option value={30}>30 days</option>
              <option value={90}>90 days</option>
              <option value={180}>180 days</option>
              <option value={365}>1 year</option>
              <option value={730}>2 years</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Default Export Format
            </label>
                         <select
               value={settings.data.exportFormat}
               onChange={(e) => handleSettingChange('data', 'exportFormat', e.target.value)}
               className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary focus:border-transparent"
             >
              <option value="excel">Excel (.xlsx)</option>
              <option value="csv">CSV (.csv)</option>
              <option value="pdf">PDF (.pdf)</option>
              <option value="json">JSON (.json)</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-neutral-200 dark:border-neutral-700">
            <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4">
              Quick Actions
            </h4>
            
            {/* Test Connection Button */}
            <div className="mb-4">
              <button
                onClick={handleTestConnection}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
              >
                <Database className="h-4 w-4" />
                Test Backend Connection
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Backup Section */}
              <div className="space-y-3">
                <h5 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Backup & Restore
                </h5>
                
                <button
                  onClick={handleCreateBackup}
                  disabled={isBackingUp}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isBackingUp ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {isBackingUp ? 'Creating Backup...' : 'Create Backup Now'}
                </button>

                <button
                  onClick={handleListBackups}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  <List className="h-4 w-4" />
                  View Backup History
                </button>
              </div>

              {/* Export Section */}
              <div className="space-y-3">
                <h5 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Export Data
                </h5>
                
                <button
                  onClick={() => handleExportData('excel')}
                  disabled={isExporting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isExporting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FileSpreadsheet className="h-4 w-4" />
                  )}
                  Export to Excel
                </button>

                <button
                  onClick={() => handleExportData('csv')}
                  disabled={isExporting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isExporting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                  Export to CSV
                </button>
              </div>
            </div>

            {/* Status Messages */}
            {backupStatus && (
              <div className={`mt-4 p-3 rounded-lg ${
                backupStatus.type === 'success' 
                  ? 'bg-green-200 dark:bg-success-900/20 border-2 border-green-500 dark:border-success-800' 
                  : 'bg-red-200 dark:bg-error-900/20 border-2 border-red-500 dark:border-error-800'
              }`}>
                <div className="flex items-center gap-2">
                  {backupStatus.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-700 dark:text-success-400" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-700 dark:text-error-400" />
                  )}
                  <span className={`text-sm font-semibold ${
                    backupStatus.type === 'success' 
                      ? 'text-green-900 dark:text-success-200' 
                      : 'text-red-900 dark:text-error-200'
                  }`}>
                    {backupStatus.message}
                  </span>
                </div>
              </div>
            )}

            {/* Backup History Modal */}
            {showBackupHistory && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      Backup History
                    </h3>
                    <button
                      onClick={() => setShowBackupHistory(false)}
                      className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {backups.length > 0 ? (
                    <div className="space-y-3">
                      {backups.map((backup) => (
                        <div key={backup.id} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-neutral-100">
                              {backup.filename}
                            </p>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                              {new Date(backup.created_at).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              backup.status === 'completed' 
                                ? 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400' 
                                : 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-success-400'
                            }`}>
                              {backup.status}
                            </span>
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">
                              {backup.file_size} bytes
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-neutral-600 dark:text-neutral-400 text-center py-8">
                      No backups found. Create your first backup to get started!
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings()
      case 'appearance':
        return renderAppearanceSettings()
      case 'notifications':
        return renderNotificationSettings()
      case 'security':
        return renderSecuritySettings()
      case 'data':
        return renderDataSettings()
      default:
        return renderGeneralSettings()
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Settings
          </h1>
        </div>
        <p className="text-neutral-600 dark:text-neutral-400">
          Customize your dashboard experience and manage your preferences
        </p>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="mb-6 p-4 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-success-600" />
          <span className="text-success-800 dark:text-success-200 font-medium">
            Settings saved successfully!
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                                         className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                       activeTab === tab.id
                         ? 'bg-primary-light text-primary'
                         : 'text-neutral-600 dark:text-neutral-300 hover:text-primary hover:bg-neutral-100 dark:hover:bg-neutral-700'
                     }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {renderTabContent()}

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            
            <button
              onClick={handleReset}
              className="btn-secondary flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsView
