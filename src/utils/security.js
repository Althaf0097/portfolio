// Security utility for protection against common web attacks

// Rate limiting for form submissions
const rateLimiter = {
  attempts: new Map(),
  maxAttempts: 3,
  windowMs: 60000, // 1 minute

  isAllowed(key) {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Clean old attempts
    const validAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    return true;
  },

  getRemainingTime(key) {
    const attempts = this.attempts.get(key) || [];
    if (attempts.length === 0) return 0;
    
    const oldestAttempt = Math.min(...attempts);
    const remaining = this.windowMs - (Date.now() - oldestAttempt);
    return Math.max(0, Math.ceil(remaining / 1000));
  }
};

// Sanitize user input to prevent XSS
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/`/g, '&#96;')
    .trim();
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 254;
};

// Check for suspicious patterns (spam/injection attempts)
export const isSuspiciousContent = (content) => {
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // onclick=, onerror=, etc.
    /data:/i,
    /vbscript:/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /<form/i,
    /eval\s*\(/i,
    /expression\s*\(/i,
    /url\s*\(/i,
    /(union|select|insert|update|delete|drop|create|alter|exec|execute)\s/i, // SQL injection
    /--/,
    /[<>{}]/,
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(content));
};

// Rate limit check for form submissions
export const checkRateLimit = (identifier = 'form') => {
  if (!rateLimiter.isAllowed(identifier)) {
    const remaining = rateLimiter.getRemainingTime(identifier);
    return {
      allowed: false,
      message: `Too many attempts. Please wait ${remaining} seconds.`,
      remainingSeconds: remaining
    };
  }
  return { allowed: true };
};

// Honeypot field check (bot detection)
export const isBot = (honeypotValue) => {
  // If honeypot field has a value, it's likely a bot
  return honeypotValue && honeypotValue.length > 0;
};

// Generate a simple CSRF-like token
export const generateToken = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Validate form data comprehensively
export const validateFormData = (data) => {
  const errors = [];
  
  // Name validation
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  if (data.name && data.name.length > 100) {
    errors.push('Name is too long');
  }
  if (data.name && isSuspiciousContent(data.name)) {
    errors.push('Invalid characters in name');
  }
  
  // Email validation
  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Please enter a valid email address');
  }
  
  // Message validation
  if (!data.message || data.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters');
  }
  if (data.message && data.message.length > 5000) {
    errors.push('Message is too long');
  }
  if (data.message && isSuspiciousContent(data.message)) {
    errors.push('Message contains invalid content');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Log security events (for monitoring)
export const logSecurityEvent = (event, details = {}) => {
  const timestamp = new Date().toISOString();
  console.warn(`[SECURITY] ${timestamp} - ${event}`, details);
  
  // In production, you would send this to a logging service
  // Example: sendToLoggingService({ event, details, timestamp });
};

// Initialize security measures
export const initSecurity = () => {
  // Prevent clickjacking by checking if in iframe
  if (window.self !== window.top) {
    logSecurityEvent('Clickjacking attempt detected');
    // Optionally break out of frame
    window.top.location = window.self.location;
  }
  
  // Disable eval and Function constructor (where possible)
  try {
    // This helps prevent some XSS attacks
    window.eval = () => {
      logSecurityEvent('Eval blocked');
      throw new Error('eval() is disabled for security');
    };
  } catch (e) {
    // eval cannot be overwritten in strict mode
  }
  
  // Monitor for suspicious activity
  let suspiciousActivityCount = 0;
  const originalConsoleError = console.error;
  console.error = (...args) => {
    const message = args.join(' ');
    if (message.includes('XSS') || message.includes('injection')) {
      suspiciousActivityCount++;
      logSecurityEvent('Potential attack detected', { message });
    }
    originalConsoleError.apply(console, args);
  };
  
  // Add security headers warning
  console.log('%c🔒 Security Active', 'color: #22c55e; font-size: 16px; font-weight: bold;');
  console.log('%cForm validation, rate limiting, and XSS protection enabled.', 'color: #94a3b8; font-size: 12px;');
};
