// Security Configuration for Interactive Dashboard
// This file contains all security policies and configurations

export const securityConfig = {
  // Content Security Policy
  csp: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    'font-src': ["'self'", "https://fonts.gstatic.com"],
    'img-src': ["'self'", "data:", "blob:"],
    'connect-src': ["'self'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': []
  },

  // Security Headers
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Permitted-Cross-Domain-Policies': 'none',
    'X-Download-Options': 'noopen',
    'X-Powered-By': null // Remove server signature
  },

  // Rate Limiting Configuration
  rateLimit: {
    'export-excel': { maxRequests: 10, windowMs: 60000 },
    'export-pdf': { maxRequests: 10, windowMs: 60000 },
    'export-json': { maxRequests: 20, windowMs: 60000 },
    'chart-interaction': { maxRequests: 100, windowMs: 60000 },
    'general': { maxRequests: 200, windowMs: 60000 }
  },

  // Input Validation Rules
  validation: {
    filename: {
      maxLength: 100,
      allowedChars: /^[a-zA-Z0-9\-\_\.]+$/,
      blockedPatterns: [/\.\./, /\/\//, /\\/, /script/i, /javascript/i]
    },
    data: {
      maxSize: 10485760, // 10MB
      allowedTypes: ['object', 'array'],
      requiredFields: ['revenue', 'volume', 'profit', 'customers']
    }
  },

  // Build Security Options
  build: {
    sourcemap: false,
    minify: 'terser',
    dropConsole: true,
    dropDebugger: true,
    obfuscate: true
  },

  // DDoS Protection
  ddos: {
    enabled: true,
    maxConnections: 1000,
    maxRequestsPerMinute: 1000,
    blockDuration: 300000, // 5 minutes
    whitelist: ['127.0.0.1', '::1'] // Local development
  }
}

// Security utility functions
export const securityUtils = {
  // Sanitize input strings
  sanitizeInput: (input) => {
    if (typeof input !== 'string') return input
    
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/data:/gi, '')
      .trim()
  },

  // Validate data structure
  validateData: (data) => {
    if (!data || typeof data !== 'object') return false
    
    // Check for required fields
    const requiredFields = securityConfig.validation.data.requiredFields
    for (const field of requiredFields) {
      if (!(field in data)) return false
    }
    
    return true
  },

  // Rate limiting implementation
  rateLimit: (() => {
    const requests = new Map()
    
    return (identifier, maxRequests = 100, windowMs = 60000) => {
      const now = Date.now()
      const userRequests = requests.get(identifier) || []
      
      // Remove old requests outside the window
      const validRequests = userRequests.filter(time => now - time < windowMs)
      
      if (validRequests.length >= maxRequests) {
        return false // Rate limited
      }
      
      validRequests.push(now)
      requests.set(identifier, validRequests)
      return true // Allowed
    }
  })(),

  // Validate filename security
  validateFilename: (filename) => {
    if (!filename || typeof filename !== 'string') return false
    
    const config = securityConfig.validation.filename
    
    if (filename.length > config.maxLength) return false
    if (!config.allowedChars.test(filename)) return false
    
    // Check for blocked patterns
    for (const pattern of config.blockedPatterns) {
      if (pattern.test(filename)) return false
    }
    
    return true
  },

  // Log security events
  logSecurityEvent: (event, details) => {
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      event,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href
    }
    
    // In production, this would be sent to a security monitoring service
    console.warn('Security Event:', logEntry)
    
    // Store in localStorage for development (remove in production)
    try {
      const securityLog = JSON.parse(localStorage.getItem('securityLog') || '[]')
      securityLog.push(logEntry)
      if (securityLog.length > 100) securityLog.shift() // Keep only last 100 events
      localStorage.setItem('securityLog', JSON.stringify(securityLog))
    } catch (error) {
      console.error('Failed to log security event:', error)
    }
  }
}

// Export default configuration
export default securityConfig
