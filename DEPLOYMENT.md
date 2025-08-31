# 🚀 Production Deployment Guide

## **🔒 Security Overview**

This application automatically switches between development and production security settings:

- **Development**: Relaxed CSP, Vite proxy, local backend
- **Production**: Strict CSP, proper CORS, secure headers

## **🌍 Deployment Options**

### **Option 1: Same-Origin Deployment (Recommended)**
```bash
# Deploy both frontend and backend to same domain
Frontend: https://yourdomain.com
Backend: https://yourdomain.com/api
```

**Benefits:**
- ✅ No CORS configuration needed
- ✅ Maximum security
- ✅ Simple deployment
- ✅ No CSP changes required

**Deployment:**
1. Build frontend: `npm run build`
2. Deploy backend to `/api` route
3. Serve frontend from root
4. Backend handles `/api/*` routes

### **Option 2: Separate Domains (Enterprise)**
```bash
# Deploy to separate domains
Frontend: https://dashboard.yourdomain.com
Backend: https://api.yourdomain.com
```

**Benefits:**
- ✅ Scalable architecture
- ✅ Independent deployments
- ✅ Load balancing possible

**Requirements:**
- Proper CORS configuration
- Environment variables set
- Strict CSP policies

## **⚙️ Environment Variables**

### **Frontend (.env.production)**
```bash
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_ENVIRONMENT=production
```

### **Backend (.env.production)**
```bash
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://dashboard.yourdomain.com
```

## **🔧 Production Build Commands**

```bash
# Frontend
npm run build

# Backend
NODE_ENV=production npm start
```

## **🛡️ Security Features**

### **Automatic Security Switching**
- **Development**: Relaxed CSP for local development
- **Production**: Strict CSP for production deployment

### **CORS Configuration**
- **Development**: Vite proxy (no CORS needed)
- **Production**: Proper CORS headers

### **Security Headers**
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security: max-age=31536000
- Content-Security-Policy: Strict in production

## **📊 Monitoring & Logging**

### **Backend Logging**
```javascript
// Production logging
if (process.env.NODE_ENV === 'production') {
  console.log = console.info = () => {} // Disable console in production
  // Use proper logging service (Winston, Bunyan, etc.)
}
```

### **Health Checks**
```bash
# Production health check
curl https://yourdomain.com/api/health
```

## **🚨 Security Checklist**

- [ ] HTTPS enabled
- [ ] Environment variables set
- [ ] CORS properly configured
- [ ] CSP headers set
- [ ] Rate limiting enabled
- [ ] Input validation
- [ ] SQL injection protection
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Error handling (no sensitive data exposed)

## **🔍 Testing Production Security**

```bash
# Test CSP headers
curl -I https://yourdomain.com | grep -i "content-security-policy"

# Test CORS
curl -H "Origin: https://malicious-site.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS https://yourdomain.com/api/backup/create
```

## **📚 Additional Resources**

- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CORS Best Practices](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
