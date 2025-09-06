import { doc, getDoc, setDoc, updateDoc, collection, addDoc, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

// User profile operations
export async function createUserProfile(userId, userData) {
  if (!db) {
    console.warn('[userService] Firestore not initialized, skipping user profile creation');
    return null;
  }
  try {
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
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
}

export async function getUserProfile(userId) {
  if (!db || !userId) {
    console.warn('[userService] Firestore not initialized or no userId provided');
    return null;
  }
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}

export async function updateUserProfile(userId, updates) {
  if (!db) return null;
  try {
    const userRef = doc(db, "users", userId);
    const updateData = {
      ...updates,
      updatedAt: new Date()
    };
    await updateDoc(userRef, updateData);
    return updateData;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
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
  try {
    const q = query(collection(db, "listings"), where("status", "==", "active"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting all listings:", error);
    return [];
  }
}
