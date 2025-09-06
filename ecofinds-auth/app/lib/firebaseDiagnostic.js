// Firebase diagnostic utility
import { auth, db, isFirebaseReady } from './firebase.js';
import { doc, getDoc, collection, getDocs, limit, query } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export class FirebaseDiagnostic {
  constructor() {
    this.results = {
      initialization: null,
      authentication: null,
      firestoreRead: null,
      firestoreCollection: null,
      networkConnectivity: null
    };
  }

  async runFullDiagnostic() {
    console.log('[Firebase Diagnostic] Starting comprehensive diagnostic...');
    
    // Test 1: Initialization
    await this.testInitialization();
    
    // Test 2: Authentication state
    await this.testAuthentication();
    
    // Test 3: Basic Firestore read
    await this.testFirestoreRead();
    
    // Test 4: Collection access
    await this.testFirestoreCollection();
    
    // Test 5: Network connectivity
    await this.testNetworkConnectivity();
    
    this.displayResults();
    return this.results;
  }

  async testInitialization() {
    console.log('[Diagnostic] Testing Firebase initialization...');
    
    try {
      this.results.initialization = {
        status: 'success',
        isReady: isFirebaseReady,
        hasAuth: !!auth,
        hasDb: !!db,
        projectId: db?.app?.options?.projectId,
        config: {
          apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? 'Set' : 'Missing',
          authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'Missing',
          projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'Missing'
        }
      };
      
      if (!isFirebaseReady) {
        this.results.initialization.status = 'failed';
        this.results.initialization.error = 'Firebase not ready';
      }
      
    } catch (error) {
      this.results.initialization = {
        status: 'failed',
        error: error.message
      };
    }
  }

  async testAuthentication() {
    console.log('[Diagnostic] Testing authentication state...');
    
    return new Promise((resolve) => {
      try {
        if (!auth) {
          this.results.authentication = {
            status: 'failed',
            error: 'Auth not initialized'
          };
          resolve();
          return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
          this.results.authentication = {
            status: 'success',
            isSignedIn: !!user,
            userId: user?.uid || null,
            email: user?.email || null
          };
          unsubscribe();
          resolve();
        }, (error) => {
          this.results.authentication = {
            status: 'failed',
            error: error.message
          };
          unsubscribe();
          resolve();
        });

        // Timeout after 5 seconds
        setTimeout(() => {
          unsubscribe();
          if (!this.results.authentication) {
            this.results.authentication = {
              status: 'timeout',
              error: 'Authentication check timed out'
            };
          }
          resolve();
        }, 5000);

      } catch (error) {
        this.results.authentication = {
          status: 'failed',
          error: error.message
        };
        resolve();
      }
    });
  }

  async testFirestoreRead() {
    console.log('[Diagnostic] Testing basic Firestore read...');
    
    try {
      if (!db) {
        this.results.firestoreRead = {
          status: 'failed',
          error: 'Firestore not initialized'
        };
        return;
      }

      // Try to read a non-existent document (should not fail due to security rules)
      const testRef = doc(db, 'test', 'diagnostic-test');
      const startTime = Date.now();
      
      const docSnap = await getDoc(testRef);
      const duration = Date.now() - startTime;
      
      this.results.firestoreRead = {
        status: 'success',
        exists: docSnap.exists(),
        duration: `${duration}ms`,
        metadata: {
          fromCache: docSnap.metadata.fromCache,
          hasPendingWrites: docSnap.metadata.hasPendingWrites
        }
      };

    } catch (error) {
      this.results.firestoreRead = {
        status: 'failed',
        error: error.message,
        code: error.code
      };
    }
  }

  async testFirestoreCollection() {
    console.log('[Diagnostic] Testing Firestore collection access...');
    
    try {
      if (!db) {
        this.results.firestoreCollection = {
          status: 'failed',
          error: 'Firestore not initialized'
        };
        return;
      }

      // Try to read from the users collection
      const usersRef = collection(db, 'users');
      const q = query(usersRef, limit(1));
      const startTime = Date.now();
      
      const querySnapshot = await getDocs(q);
      const duration = Date.now() - startTime;
      
      this.results.firestoreCollection = {
        status: 'success',
        docCount: querySnapshot.size,
        duration: `${duration}ms`,
        metadata: {
          fromCache: querySnapshot.metadata.fromCache,
          hasPendingWrites: querySnapshot.metadata.hasPendingWrites
        }
      };

    } catch (error) {
      this.results.firestoreCollection = {
        status: 'failed',
        error: error.message,
        code: error.code
      };
    }
  }

  async testNetworkConnectivity() {
    console.log('[Diagnostic] Testing network connectivity...');
    
    try {
      // Test basic internet connectivity
      const response = await fetch('https://www.google.com/favicon.ico', { 
        mode: 'no-cors',
        cache: 'no-cache'
      });
      
      this.results.networkConnectivity = {
        status: 'success',
        online: navigator.onLine,
        googleReachable: true
      };

    } catch (error) {
      this.results.networkConnectivity = {
        status: 'failed',
        online: navigator.onLine,
        googleReachable: false,
        error: error.message
      };
    }
  }

  displayResults() {
    console.log('\n[Firebase Diagnostic] Results Summary:');
    console.log('=====================================');
    
    Object.entries(this.results).forEach(([test, result]) => {
      const status = result?.status || 'unknown';
      const emoji = status === 'success' ? '✅' : status === 'failed' ? '❌' : '⚠️';
      
      console.log(`${emoji} ${test}: ${status}`);
      
      if (result?.error) {
        console.log(`   Error: ${result.error}`);
      }
      
      if (result && typeof result === 'object') {
        Object.entries(result).forEach(([key, value]) => {
          if (key !== 'status' && key !== 'error') {
            console.log(`   ${key}: ${JSON.stringify(value)}`);
          }
        });
      }
      
      console.log('');
    });
    
    // Summary recommendations
    console.log('[Firebase Diagnostic] Recommendations:');
    
    if (this.results.initialization?.status !== 'success') {
      console.log('- Check Firebase configuration in .env file');
    }
    
    if (this.results.firestoreRead?.status === 'failed' && this.results.firestoreRead?.code === 'permission-denied') {
      console.log('- Check Firestore security rules');
      console.log('- Ensure user is authenticated for protected operations');
    }
    
    if (this.results.networkConnectivity?.status !== 'success') {
      console.log('- Check internet connection');
      console.log('- Check if firewall is blocking Firebase domains');
    }
  }
}

// Auto-run diagnostic if this is imported in the browser
export async function runFirebaseDiagnostic() {
  if (typeof window !== 'undefined') {
    const diagnostic = new FirebaseDiagnostic();
    return await diagnostic.runFullDiagnostic();
  }
}

// Export for manual use
export default FirebaseDiagnostic;
