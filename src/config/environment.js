// Simple environment configuration for API endpoints
export const API_BASE_URL = '/api'

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`
}

// Environment info
export const isDevelopment = import.meta.env.MODE === 'development'
export const isProduction = import.meta.env.MODE === 'production'

console.log(`🌍 Environment: ${import.meta.env.MODE || 'development'}`)
console.log(`🔗 API Base URL: ${API_BASE_URL}`)
console.log(`🛡️ Security Level: ${isProduction ? 'production' : 'development'}`)
