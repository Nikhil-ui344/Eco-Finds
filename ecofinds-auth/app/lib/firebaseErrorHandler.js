// Enhanced Firebase error handling and retry utilities
import { getNetworkStatus } from './firebase.js';

// Common Firebase error codes and their meanings
const FIREBASE_ERROR_CODES = {
  'permission-denied': 'Permission denied - check Firestore security rules',
  'unauthenticated': 'User not authenticated',
  'unavailable': 'Service unavailable - network or server issue',
  'deadline-exceeded': 'Request timeout',
  'resource-exhausted': 'Quota exceeded',
  'failed-precondition': 'Operation failed precondition',
  'aborted': 'Operation aborted',
  'out-of-range': 'Invalid parameter range',
  'unimplemented': 'Operation not implemented',
  'internal': 'Internal server error',
  'unknown': 'Unknown error occurred'
};

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 5000   // 5 seconds
};

// Check if error is retryable
function isRetryableError(error) {
  const retryableCodes = [
    'unavailable',
    'deadline-exceeded',
    'aborted',
    'internal',
    'unknown'
  ];
  
  return retryableCodes.includes(error.code) || 
         error.message.includes('offline') ||
         error.message.includes('network');
}

// Sleep utility for retries
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Calculate exponential backoff delay
function calculateDelay(attempt) {
  const delay = Math.min(
    RETRY_CONFIG.baseDelay * Math.pow(2, attempt),
    RETRY_CONFIG.maxDelay
  );
  
  // Add jitter to prevent thundering herd
  return delay + Math.random() * 1000;
}

// Enhanced error logging
export function logFirebaseError(operation, error) {
  const errorInfo = {
    operation,
    code: error.code,
    message: error.message,
    description: FIREBASE_ERROR_CODES[error.code] || 'Unknown error',
    isNetworkOnline: getNetworkStatus(),
    timestamp: new Date().toISOString()
  };
  
  console.error(`[Firebase Error] ${operation}:`, errorInfo);
  
  // Log specific guidance for common errors
  if (error.code === 'permission-denied') {
    console.warn('[Firebase] Check your Firestore security rules. You may need to authenticate or adjust permissions.');
  } else if (error.code === 'unauthenticated') {
    console.warn('[Firebase] User needs to be signed in to perform this operation.');
  } else if (error.code === 'unavailable') {
    console.warn('[Firebase] Service unavailable. Check your network connection and Firebase status.');
  }
  
  return errorInfo;
}

// Retry wrapper for Firebase operations
export async function withRetry(operation, operationName = 'Firebase operation') {
  let lastError;
  
  for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    try {
      const result = await operation();
      
      // Log success if we had previous failures
      if (attempt > 0) {
        console.log(`[Firebase Retry] ${operationName} succeeded on attempt ${attempt + 1}`);
      }
      
      return result;
    } catch (error) {
      lastError = error;
      
      // Log the error
      logFirebaseError(operationName, error);
      
      // Don't retry if it's not a retryable error or we've exhausted retries
      if (!isRetryableError(error) || attempt === RETRY_CONFIG.maxRetries) {
        break;
      }
      
      // Wait before retrying
      const delay = calculateDelay(attempt);
      console.log(`[Firebase Retry] Retrying ${operationName} in ${delay}ms (attempt ${attempt + 1}/${RETRY_CONFIG.maxRetries})`);
      await sleep(delay);
    }
  }
  
  // If we get here, all retries failed
  console.error(`[Firebase Retry] ${operationName} failed after ${RETRY_CONFIG.maxRetries + 1} attempts`);
  throw lastError;
}

// Safe Firebase operation wrapper
export async function safeFirebaseOperation(operation, operationName = 'Firebase operation', fallbackValue = null) {
  try {
    return await withRetry(operation, operationName);
  } catch (error) {
    logFirebaseError(operationName, error);
    
    // Return fallback value instead of throwing
    console.warn(`[Firebase Safe] Returning fallback value for ${operationName}`);
    return fallbackValue;
  }
}

// Check if Firebase services are available
export async function checkFirebaseHealth() {
  const health = {
    timestamp: new Date().toISOString(),
    network: getNetworkStatus(),
    services: {
      auth: false,
      firestore: false
    },
    errors: []
  };
  
  try {
    // We'll implement specific health checks as needed
    console.log('[Firebase Health] Service status:', health);
    return health;
  } catch (error) {
    health.errors.push(logFirebaseError('Health Check', error));
    return health;
  }
}
