import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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
const hasConfig = Object.values(firebaseConfig).every(val => val && val !== 'undefined' && val !== undefined);

if (!hasConfig && isBrowser) {
  console.warn("[firebase] Missing config. Firebase features will be disabled. Copy .env.example to .env and fill keys.");
  console.log("[firebase] Current config:", firebaseConfig);
}

let app;
let auth = null;
let db = null;

if (isBrowser && hasConfig) {
  try {
    console.log("[firebase] Initializing with config:", {
      apiKey: firebaseConfig.apiKey ? "***" : "missing",
      authDomain: firebaseConfig.authDomain,
      projectId: firebaseConfig.projectId,
      storageBucket: firebaseConfig.storageBucket,
      messagingSenderId: firebaseConfig.messagingSenderId ? "***" : "missing",
      appId: firebaseConfig.appId ? "***" : "missing"
    });
    
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("[firebase] Initialized successfully");
  } catch (error) {
    console.error("[firebase] Initialization failed:", error);
    // Reset to null to prevent further errors
    app = null;
    auth = null;
    db = null;
  }
} else if (isBrowser) {
  console.error("[firebase] Cannot initialize - missing configuration");
}

export { auth, db };
export const isFirebaseReady = Boolean(app);

// Optional analytics init (browser only + supported)
// export let analytics = null;
// if (app && isBrowser && import.meta.env.PROD) {
//   const { getAnalytics, isSupported } = await import("firebase/analytics");
//   try {
//     if (await isSupported()) {
//       analytics = getAnalytics(app);
//     }
//   } catch {}
// }
