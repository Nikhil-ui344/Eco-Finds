// Quick fix to disable Firebase real-time features that cause 400 errors
import { db } from './firebase.js';
import { disableNetwork, enableNetwork } from 'firebase/firestore';

let networkDisabled = false;

// Disable Firebase network to prevent 400 errors
export async function disableFirebaseNetwork() {
  if (db && !networkDisabled) {
    try {
      await disableNetwork(db);
      networkDisabled = true;
      console.log('[Firebase Fix] Network disabled to prevent 400 errors');
    } catch (error) {
      console.warn('[Firebase Fix] Could not disable network:', error);
    }
  }
}

// Re-enable network when needed
export async function enableFirebaseNetwork() {
  if (db && networkDisabled) {
    try {
      await enableNetwork(db);
      networkDisabled = false;
      console.log('[Firebase Fix] Network re-enabled');
    } catch (error) {
      console.warn('[Firebase Fix] Could not enable network:', error);
    }
  }
}

// Auto-disable network on import to prevent 400 errors
if (typeof window !== 'undefined') {
  setTimeout(() => {
    disableFirebaseNetwork();
  }, 100);
}

export { networkDisabled };
