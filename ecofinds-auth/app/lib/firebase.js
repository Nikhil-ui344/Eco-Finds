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
const hasConfig = Object.values(firebaseConfig).every(Boolean);
if (!hasConfig && isBrowser) {
  console.warn("[firebase] Missing config. Copy .env.example to .env and fill keys.");
}

let app;
if (isBrowser && hasConfig) {
  app = initializeApp(firebaseConfig);
}

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
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
