import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, isFirebaseReady } from "./firebase";

const AuthContext = createContext({ user: null, loading: true });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseReady || !auth) {
      setLoading(false);
      return;
    }
    
    let unsub;
    let timeoutId;
    
    try {
      // Set a timeout to prevent hanging
      timeoutId = setTimeout(() => {
        console.warn('[Auth] Auth state check timeout');
        setLoading(false);
      }, 3000);
      
      unsub = onAuthStateChanged(auth, (u) => {
        clearTimeout(timeoutId);
        setUser(u);
        setLoading(false);
      }, (error) => {
        console.warn('[Auth] Auth state change error:', error);
        clearTimeout(timeoutId);
        setLoading(false);
      });
    } catch (error) {
      console.error('[Auth] Failed to set up auth listener:', error);
      clearTimeout(timeoutId);
      setLoading(false);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (unsub) {
        try {
          unsub();
        } catch (error) {
          console.warn('[Auth] Error unsubscribing:', error);
        }
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
