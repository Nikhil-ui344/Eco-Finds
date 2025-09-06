// Firebase client initialization (React Router + Vite environment)
import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const isBrowser = typeof window !== "undefined";
const hasConfig = Object.values(firebaseConfig).every(Boolean);

if (!hasConfig && isBrowser) {
  // eslint-disable-next-line no-console
  console.warn("[firebase] Missing config. Copy .env.example to .env and fill keys.");
}

let app: FirebaseApp | undefined;
if (isBrowser && hasConfig) {
  app = initializeApp(firebaseConfig);
}

export const auth = app ? getAuth(app) : (null as any);
export const isFirebaseReady = Boolean(app);
