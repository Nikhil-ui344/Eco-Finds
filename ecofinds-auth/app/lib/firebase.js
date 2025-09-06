import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, initializeFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const isBrowser = typeof window !== "undefined";

let app = null;
let auth = null;
let db = null;

if (isBrowser) {
  try {
    // Initialize Firebase app
    app = initializeApp(firebaseConfig);
    
    // Initialize Auth
    auth = getAuth(app);
    
    // Initialize Firestore with settings that prevent 400 errors
    db = initializeFirestore(app, {
      localCache: {
        kind: 'memory'
      },
      experimentalForceLongPolling: true,  // Force long polling instead of WebSocket
    });
    
    console.log("[Firebase] Initialized with long polling to prevent 400 errors");
  } catch (error) {
    console.error("[Firebase] Initialization failed:", error);
    // Try fallback initialization
    try {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);
      console.log("[Firebase] Fallback initialization successful");
    } catch (fallbackError) {
      console.error("[Firebase] Fallback initialization also failed:", fallbackError);
      app = null;
      auth = null;
      db = null;
    }
  }
}

export { auth, db };
export const isFirebaseReady = Boolean(app);
export const firebaseApp = app;
