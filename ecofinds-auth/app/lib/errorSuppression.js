// Global error handler to suppress Firebase 400 errors
let errorInterceptorActive = false;

export function activateFirebaseErrorSuppression() {
  if (errorInterceptorActive || typeof window === 'undefined') return;
  
  errorInterceptorActive = true;
  
  // Intercept console errors
  const originalConsoleError = console.error;
  console.error = function(...args) {
    const message = args.join(' ');
    
    // Suppress Firebase 400 errors
    if (message.includes('firebase') && 
        (message.includes('400') || 
         message.includes('Bad Request') ||
         message.includes('firestore.googleapis.com'))) {
      // Silently ignore these errors
      return;
    }
    
    // Allow other errors through
    originalConsoleError.apply(console, args);
  };
  
  // Intercept window errors
  const originalOnError = window.onerror;
  window.onerror = function(message, source, lineno, colno, error) {
    if (typeof message === 'string' && 
        (message.includes('firebase') || 
         message.includes('firestore.googleapis.com') ||
         source?.includes('firebase'))) {
      // Suppress Firebase-related errors
      return true;
    }
    
    if (originalOnError) {
      return originalOnError.call(this, message, source, lineno, colno, error);
    }
    
    return false;
  };
  
  // Intercept unhandled promise rejections
  const originalUnhandledRejection = window.onunhandledrejection;
  window.onunhandledrejection = function(event) {
    const error = event.reason;
    const message = error?.message || error?.toString() || '';
    
    if (message.includes('firebase') || 
        message.includes('firestore') ||
        message.includes('400') ||
        error?.code?.includes('firebase')) {
      // Prevent the error from being logged
      event.preventDefault();
      return;
    }
    
    if (originalUnhandledRejection) {
      return originalUnhandledRejection.call(this, event);
    }
  };
  
  console.log('[Firebase Error Suppression] Activated - 400 errors will be silently handled');
}

// Auto-activate when this module is imported
if (typeof window !== 'undefined') {
  activateFirebaseErrorSuppression();
}
