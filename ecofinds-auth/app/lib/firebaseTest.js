import { app, auth, db } from './firebase.js';

export const testFirebaseConnection = async () => {
  console.log('Testing Firebase connection...');
  
  try {
    // Test app initialization
    if (!app) {
      throw new Error('Firebase app not initialized');
    }
    console.log('✅ Firebase app initialized');
    
    // Test auth service
    if (!auth) {
      throw new Error('Firebase auth not initialized');
    }
    console.log('✅ Firebase auth service available');
    
    // Test firestore
    if (!db) {
      throw new Error('Firestore not initialized');
    }
    console.log('✅ Firestore database available');
    
    // Test basic auth state
    return new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        console.log('✅ Auth state listener working, user:', user ? 'logged in' : 'not logged in');
        unsubscribe();
        resolve(true);
      });
    });
    
  } catch (error) {
    console.error('❌ Firebase connection test failed:', error);
    throw error;
  }
};

export const debugFirebaseConfig = () => {
  console.log('Firebase Configuration Debug:');
  console.log('API Key:', import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing');
  console.log('Auth Domain:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing');
  console.log('Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing');
  console.log('Storage Bucket:', import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ? '✅ Set' : '❌ Missing');
  console.log('Messaging Sender ID:', import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ? '✅ Set' : '❌ Missing');
  console.log('App ID:', import.meta.env.VITE_FIREBASE_APP_ID ? '✅ Set' : '❌ Missing');
};
