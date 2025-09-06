import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Firebase configuration with validation
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validate configuration
function validateFirebaseConfig(config) {
  const required = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missing = required.filter(key => !config[key] || config[key] === 'undefined');
  
  if (missing.length > 0) {
    console.error('[Firebase] Missing required configuration:', missing);
    return false;
  }
  
  return true;
}

const isBrowser = typeof window !== "undefined";
const isValidConfig = validateFirebaseConfig(firebaseConfig);

let app = null;
let auth = null;
let db = null;

if (isBrowser && isValidConfig) {
  try {
    console.log("[Firebase] Initializing with project:", firebaseConfig.projectId);
    
    // Initialize Firebase app
    app = initializeApp(firebaseConfig);
    
    // Initialize Auth
    auth = getAuth(app);
    
    // Initialize Firestore
    db = getFirestore(app);
    
    // Optional: Connect to emulators in development
    if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
      try {
        connectAuthEmulator(auth, 'http://localhost:9099');
        connectFirestoreEmulator(db, 'localhost', 8080);
        console.log("[Firebase] Connected to emulators");
      } catch (emulatorError) {
        console.warn("[Firebase] Emulator connection failed:", emulatorError.message);
      }
    }
    
    console.log("[Firebase] Initialized successfully");
  } catch (error) {
    console.error("[Firebase] Initialization failed:", error);
    app = null;
    auth = null;
    db = null;
  }
} else if (isBrowser) {
  console.error("[Firebase] Cannot initialize - invalid configuration. Please check your .env file.");
  console.log("[Firebase] Current config validation:", {
    apiKey: firebaseConfig.apiKey ? "✓" : "✗",
    authDomain: firebaseConfig.authDomain ? "✓" : "✗", 
    projectId: firebaseConfig.projectId ? "✓" : "✗",
    storageBucket: firebaseConfig.storageBucket ? "✓" : "✗",
    messagingSenderId: firebaseConfig.messagingSenderId ? "✓" : "✗",
    appId: firebaseConfig.appId ? "✓" : "✗"
  });
}

export { auth, db };
export const isFirebaseReady = Boolean(app);
export const firebaseApp = app;

// Helper function to check if Firebase is properly connected
export async function checkFirebaseConnection() {
  if (!db || !auth) {
    return { connected: false, error: "Firebase not initialized" };
  }
  
  try {
    // Try to get the current user (this doesn't require network)
    const user = auth.currentUser;
    
    // Try a simple Firestore operation (this requires network)
    // We'll just try to get the Firebase project settings
    await db._delegate._databaseId;
    
    return { 
      connected: true, 
      user: user ? user.uid : null,
      projectId: firebaseConfig.projectId 
    };
  } catch (error) {
    return { 
      connected: false, 
      error: error.message,
      code: error.code 
    };
  }
}
