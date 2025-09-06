import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { 
  createUserProfile, 
  getUserProfile, 
  updateUserProfile, 
  createListing, 
  getUserListings, 
  updateListing as updateListingService, 
  deleteListing 
} from '../lib/userService';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const { user: authUser, loading: authLoading } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [userListings, setUserListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user profile and listings when auth user changes
  useEffect(() => {
    if (authLoading) return;
    
    if (!authUser) {
      setUserProfile(null);
      setUserListings([]);
      setLoading(false);
      return;
    }

    loadUserData();
  }, [authUser, authLoading]);

  const loadUserData = async () => {
    if (!authUser) return;
    
    setLoading(true);
    try {
      // Get or create user profile
      let profile = await getUserProfile(authUser.uid);
      
      if (!profile) {
        // Create new profile for first-time users
        try {
          profile = await createUserProfile(authUser.uid, {
            name: authUser.displayName || 'EcoFinds User',
            email: authUser.email,
            avatar: authUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser.displayName || authUser.email)}&background=758E48&color=fff`,
            location: '',
            bio: '',
            phone: ''
          });
        } catch (createError) {
          console.warn('Could not create user profile in Firebase, using fallback data');
          // Use fallback profile if Firebase creation fails
          profile = {
            name: authUser.displayName || 'EcoFinds User',
            email: authUser.email,
            avatar: authUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser.displayName || authUser.email)}&background=758E48&color=fff`,
            location: '',
            bio: '',
            phone: ''
          };
        }
      }
      
      setUserProfile(profile);
      
      // Load user listings
      try {
        const listings = await getUserListings(authUser.uid);
        setUserListings(listings);
      } catch (listingsError) {
        console.warn('Could not load user listings from Firebase');
        setUserListings([]);
      }
      
    } catch (error) {
      console.error('Error loading user data:', error);
      // Set fallback profile if everything fails
      setUserProfile({
        name: authUser.displayName || 'EcoFinds User',
        email: authUser.email,
        avatar: authUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser.displayName || authUser.email)}&background=758E48&color=fff`,
        location: '',
        bio: '',
        phone: ''
      });
      setUserListings([]);
    }
    setLoading(false);
  };

  // User profile functions
  const updateUser = async (userData) => {
    if (!authUser) return;
    
    try {
      const updates = await updateUserProfile(authUser.uid, userData);
      setUserProfile(prev => ({ ...prev, ...updates }));
      return updates;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  // Listing management functions
  const addListing = async (listingData) => {
    if (!authUser) throw new Error('Must be logged in to create listings');
    
    try {
      const newListing = await createListing(authUser.uid, listingData);
      setUserListings(prev => [newListing, ...prev]);
      return newListing.id;
    } catch (error) {
      console.error('Error creating listing:', error);
      throw error;
    }
  };

  const updateListing = async (listingId, updates) => {
    try {
      await updateListingService(listingId, updates);
      setUserListings(prev => 
        prev.map(listing => 
          listing.id === listingId 
            ? { ...listing, ...updates, updatedAt: new Date() }
            : listing
        )
      );
    } catch (error) {
      console.error('Error updating listing:', error);
      throw error;
    }
  };

  const removeListing = async (listingId) => {
    if (!authUser) return;
    
    try {
      await deleteListing(listingId, authUser.uid);
      setUserListings(prev => prev.filter(listing => listing.id !== listingId));
    } catch (error) {
      console.error('Error deleting listing:', error);
      throw error;
    }
  };

  const toggleListingStatus = async (listingId) => {
    const listing = userListings.find(l => l.id === listingId);
    if (!listing) return;
    
    const newStatus = listing.status === 'active' ? 'inactive' : 'active';
    await updateListing(listingId, { status: newStatus });
  };

  const markAsSold = async (listingId) => {
    await updateListing(listingId, { status: 'sold' });
  };

  // Statistics calculations
  const getStats = () => {
    const activeListings = userListings.filter(l => l.status === 'active').length;
    const soldListings = userListings.filter(l => l.status === 'sold').length;
    const totalViews = userListings.reduce((sum, l) => sum + (l.views || 0), 0);
    const totalListings = userListings.length;
    
    return {
      totalSales: soldListings,
      totalPurchases: 0, // TODO: implement purchase tracking
      activeListings,
      totalListings,
      totalViews,
      rating: 4.8, // TODO: implement rating system
      totalReviews: soldListings
    };
  };

  // Provide fallback user data for non-authenticated users
  const user = userProfile || (authUser ? {
    id: authUser.uid,
    name: authUser.displayName || 'EcoFinds User',
    email: authUser.email,
    avatar: authUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser.displayName || authUser.email)}&background=758E48&color=fff`,
    location: '',
    bio: '',
    phone: ''
  } : null);

  const value = {
    user,
    userListings,
    loading,
    updateUser,
    addListing,
    updateListing,
    deleteListing: removeListing,
    toggleListingStatus,
    markAsSold,
    getStats,
    refreshData: loadUserData
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
