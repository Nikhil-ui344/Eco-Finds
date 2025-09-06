// Simple Firebase connection test
import { auth, db, isFirebaseReady } from './firebase.js';

export function testFirebaseConnection() {
  console.log('[Firebase Test] Starting connection test...');
  
  console.log('[Firebase Test] Environment variables:');
  console.log('VITE_FIREBASE_API_KEY:', import.meta.env.VITE_FIREBASE_API_KEY ? 'Set' : 'Not set');
  console.log('VITE_FIREBASE_AUTH_DOMAIN:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
  console.log('VITE_FIREBASE_PROJECT_ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID);
  
  console.log('[Firebase Test] Firebase initialization status:');
  console.log('isFirebaseReady:', isFirebaseReady);
  console.log('auth:', auth ? 'Initialized' : 'Not initialized');
  console.log('db:', db ? 'Initialized' : 'Not initialized');
  
  if (db && db.app) {
    console.log('[Firebase Test] Database app info:');
    console.log('App name:', db.app.name);
    console.log('Project ID:', db.app.options.projectId);
  }
  
  return {
    isReady: isFirebaseReady,
    hasAuth: !!auth,
    hasDb: !!db,
    projectId: db?.app?.options?.projectId
  };
}

// Auto-run test when this module is imported
if (typeof window !== 'undefined') {
  setTimeout(() => {
    testFirebaseConnection();
  }, 1000);
}
