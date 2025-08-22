// Security utility functions
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  // Remove potentially dangerous characters and scripts
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .trim()
}

export const validateData = (data) => {
  if (!data || typeof data !== 'object') return false
  // Add more validation as needed
  return true
}

export const rateLimit = (() => {
  const requests = new Map()
  const maxRequests = 100 // Max requests per minute
  const windowMs = 60000 // 1 minute window
  
  return (identifier) => {
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
})()
