// Security Middleware for Development Server
// This provides additional security layers during development

import { securityConfig, securityUtils } from './security.config.js'

// DDoS Protection Middleware
export const ddosProtection = (() => {
  const connections = new Map()
  const blockedIPs = new Map()
  
  return (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress
    const now = Date.now()
    
    // Check if IP is blocked
    if (blockedIPs.has(clientIP)) {
      const blockUntil = blockedIPs.get(clientIP)
      if (now < blockUntil) {
        securityUtils.logSecurityEvent('DDoS_BLOCKED', { ip: clientIP, reason: 'Rate limit exceeded' })
        return res.status(429).json({ error: 'Too many requests' })
      } else {
        blockedIPs.delete(clientIP)
      }
    }
    
    // Track connections
    if (!connections.has(clientIP)) {
      connections.set(clientIP, [])
    }
    
    const userConnections = connections.get(clientIP)
    userConnections.push(now)
    
    // Remove old connections
    const validConnections = userConnections.filter(time => now - time < 60000) // 1 minute window
    connections.set(clientIP, validConnections)
    
    // Check limits
    if (validConnections.length > securityConfig.ddos.maxConnections) {
      blockedIPs.set(clientIP, now + securityConfig.ddos.blockDuration)
      securityUtils.logSecurityEvent('DDoS_BLOCKED', { ip: clientIP, connections: validConnections.length })
      return res.status(429).json({ error: 'Too many connections' })
    }
    
    next()
  }
})()

// Security Headers Middleware
export const securityHeaders = (req, res, next) => {
  // Apply all security headers
  Object.entries(securityConfig.headers).forEach(([header, value]) => {
    if (value !== null) {
      res.setHeader(header, value)
    }
  })
  
  // Additional security headers
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  
  next()
}

// Input Validation Middleware
export const inputValidation = (req, res, next) => {
  // Validate request body size
  const contentLength = parseInt(req.headers['content-length'] || '0')
  if (contentLength > securityConfig.validation.data.maxSize) {
    securityUtils.logSecurityEvent('INPUT_VALIDATION_FAILED', { 
      reason: 'Request too large', 
      size: contentLength 
    })
    return res.status(413).json({ error: 'Request too large' })
  }
  
  // Validate content type for POST requests
  if (req.method === 'POST') {
    const contentType = req.headers['content-type'] || ''
    if (!contentType.includes('application/json') && !contentType.includes('multipart/form-data')) {
      securityUtils.logSecurityEvent('INPUT_VALIDATION_FAILED', { 
        reason: 'Invalid content type', 
        contentType 
      })
      return res.status(400).json({ error: 'Invalid content type' })
    }
  }
  
  next()
}

// Rate Limiting Middleware
export const rateLimiting = (identifier, maxRequests = 100, windowMs = 60000) => {
  const requests = new Map()
  
  return (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress
    const key = `${identifier}:${clientIP}`
    const now = Date.now()
    
    if (!requests.has(key)) {
      requests.set(key, [])
    }
    
    const userRequests = requests.get(key)
    const validRequests = userRequests.filter(time => now - time < windowMs)
    
    if (validRequests.length >= maxRequests) {
      securityUtils.logSecurityEvent('RATE_LIMIT_EXCEEDED', { 
        identifier, 
        ip: clientIP, 
        requests: validRequests.length 
      })
      return res.status(429).json({ error: 'Rate limit exceeded' })
    }
    
    validRequests.push(now)
    requests.set(key, validRequests)
    
    next()
  }
}

// SQL Injection Protection (for future backend integration)
export const sqlInjectionProtection = (req, res, next) => {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
    /(\b(OR|AND)\s+['"]?\w+['"]?\s*=\s*['"]?\w+['"]?)/i,
    /(--|\/\*|\*\/|xp_|sp_)/i
  ]
  
  const checkString = JSON.stringify(req.body) + JSON.stringify(req.query) + JSON.stringify(req.params)
  
  for (const pattern of sqlPatterns) {
    if (pattern.test(checkString)) {
      securityUtils.logSecurityEvent('SQL_INJECTION_ATTEMPT', { 
        pattern: pattern.source, 
        ip: req.ip || req.connection.remoteAddress 
      })
      return res.status(400).json({ error: 'Invalid input detected' })
    }
  }
  
  next()
}

// XSS Protection Middleware
export const xssProtection = (req, res, next) => {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /vbscript:/gi,
    /data:text\/html/gi
  ]
  
  const checkString = JSON.stringify(req.body) + JSON.stringify(req.query) + JSON.stringify(req.params)
  
  for (const pattern of xssPatterns) {
    if (pattern.test(checkString)) {
      securityUtils.logSecurityEvent('XSS_ATTEMPT', { 
        pattern: pattern.source, 
        ip: req.ip || req.connection.remoteAddress 
      })
      return res.status(400).json({ error: 'Invalid input detected' })
    }
  }
  
  next()
}

// Security Monitoring Middleware
export const securityMonitoring = (req, res, next) => {
  const startTime = Date.now()
  
  // Log request
  securityUtils.logSecurityEvent('REQUEST_START', {
    method: req.method,
    url: req.url,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.headers['user-agent']
  })
  
  // Monitor response
  res.on('finish', () => {
    const duration = Date.now() - startTime
    
    securityUtils.logSecurityEvent('REQUEST_END', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      ip: req.ip || req.connection.remoteAddress
    })
    
    // Alert on suspicious patterns
    if (res.statusCode === 404 && req.url.includes('..')) {
      securityUtils.logSecurityEvent('PATH_TRAVERSAL_ATTEMPT', {
        url: req.url,
        ip: req.ip || req.connection.remoteAddress
      })
    }
  })
  
  next()
}

// Export all middleware
export const securityMiddleware = {
  ddosProtection,
  securityHeaders,
  inputValidation,
  rateLimiting,
  sqlInjectionProtection,
  xssProtection,
  securityMonitoring
}

export default securityMiddleware
