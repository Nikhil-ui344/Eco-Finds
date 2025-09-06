import { doc, getDoc, setDoc, updateDoc, collection, addDoc, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

// Enhanced safe operation wrapper that prevents 400 errors
async function safeFirestoreOp(operation, fallback = null) {
  if (!db) {
    console.warn('[userService] Firestore not initialized');
    return fallback;
  }
  
  try {
    // Add timeout to prevent hanging requests
    const result = await Promise.race([
      operation(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Operation timeout')), 5000)
      )
    ]);
    return result;
  } catch (error) {
    console.error('[userService] Operation failed:', error.code || error.message);
    return fallback;
  }
}

// User profile operations
export async function createUserProfile(userId, userData) {
  return safeFirestoreOp(async () => {
    const userRef = doc(db, "users", userId);
    const profile = {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
      listings: [],
      purchases: []
    };
    await setDoc(userRef, profile);
    return profile;
  }, null);
}

export async function getUserProfile(userId) {
  if (!userId) {
    console.warn('[userService] No userId provided');
    return null;
  }
  
  return safeFirestoreOp(async () => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
  }, null);
}

export async function updateUserProfile(userId, updates) {
  return safeFirestoreOp(async () => {
    const userRef = doc(db, "users", userId);
    const updateData = {
      ...updates,
      updatedAt: new Date()
    };
    await updateDoc(userRef, updateData);
    return updateData;
  }, null);
}

// Listing operations
export async function createListing(userId, listingData) {
  if (!db) return null;
  try {
    const listing = {
      ...listingData,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "active",
      views: 0,
      likes: 0
    };
    
    const docRef = await addDoc(collection(db, "listings"), listing);
    
    // Update user's listings array
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const currentListings = userSnap.data().listings || [];
      await updateDoc(userRef, {
        listings: [...currentListings, docRef.id]
      });
    }
    
    return { id: docRef.id, ...listing };
  } catch (error) {
    console.error("Error creating listing:", error);
    throw error;
  }
}

export async function getUserListings(userId) {
  if (!db) return [];
  try {
    const q = query(collection(db, "listings"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting user listings:", error);
    return [];
  }
}

export async function updateListing(listingId, updates) {
  if (!db) return null;
  try {
    const listingRef = doc(db, "listings", listingId);
    const updateData = {
      ...updates,
      updatedAt: new Date()
    };
    await updateDoc(listingRef, updateData);
    return updateData;
  } catch (error) {
    console.error("Error updating listing:", error);
    throw error;
  }
}

export async function deleteListing(listingId, userId) {
  if (!db) return;
  try {
    // Delete the listing
    await deleteDoc(doc(db, "listings", listingId));
    
    // Remove from user's listings array
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const currentListings = userSnap.data().listings || [];
      await updateDoc(userRef, {
        listings: currentListings.filter(id => id !== listingId)
      });
    }
  } catch (error) {
    console.error("Error deleting listing:", error);
    throw error;
  }
}

// Get all listings for browsing
export async function getAllListings() {
  if (!db) {
    console.warn('[userService] Firestore not initialized, returning empty listings');
    return [];
  }
  
  return safeFirebaseOperation(async () => {
    const q = query(collection(db, "listings"), where("status", "==", "active"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }, 'getAllListings', []);
}
