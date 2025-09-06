import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  // Initialize user data from localStorage or default values
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('ecofinds_user');
    return savedUser ? JSON.parse(savedUser) : {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      location: 'Downtown, City',
      joinDate: 'March 2024',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      bio: 'Passionate about sustainable living and finding great deals on quality second-hand items. Always looking for unique vintage finds!'
    };
  });

  // Initialize user listings from localStorage or default values
  const [userListings, setUserListings] = useState(() => {
    const savedListings = localStorage.getItem('ecofinds_user_listings');
    return savedListings ? JSON.parse(savedListings) : [
      {
        id: 1001,
        name: 'Vintage Camera',
        price: 120.00,
        originalPrice: 250.00,
        condition: 'Excellent',
        status: 'Active',
        category: 'Electronics & Appliances',
        description: 'Beautiful vintage camera in excellent condition. Perfect for photography enthusiasts.',
        images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&h=300&fit=crop'],
        views: 45,
        likes: 8,
        location: 'Downtown, City',
        datePosted: '2024-08-20',
        tags: ['camera', 'vintage', 'photography', 'electronics']
      },
      {
        id: 1002,
        name: 'Designer Handbag',
        price: 85.00,
        originalPrice: 200.00,
        condition: 'Very Good',
        status: 'Sold',
        category: 'Fashion',
        description: 'Authentic designer handbag with minor wear. Great for everyday use.',
        images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=300&fit=crop'],
        views: 32,
        likes: 12,
        location: 'Downtown, City',
        datePosted: '2024-08-15',
        tags: ['handbag', 'designer', 'fashion', 'leather']
      }
    ];
  });

  // Initialize purchase history
  const [purchaseHistory, setPurchaseHistory] = useState(() => {
    const savedPurchases = localStorage.getItem('ecofinds_user_purchases');
    return savedPurchases ? JSON.parse(savedPurchases) : [
      {
        id: 2001,
        name: 'Wireless Headphones',
        price: 45.99,
        seller: 'AudioLover92',
        purchaseDate: '2024-08-25',
        status: 'Delivered',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop'
      }
    ];
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('ecofinds_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('ecofinds_user_listings', JSON.stringify(userListings));
  }, [userListings]);

  useEffect(() => {
    localStorage.setItem('ecofinds_user_purchases', JSON.stringify(purchaseHistory));
  }, [purchaseHistory]);

  // User profile functions
  const updateUser = (userData) => {
    setUser(prevUser => ({ ...prevUser, ...userData }));
  };

  // Listing management functions
  const addListing = (listingData) => {
    const newListing = {
      ...listingData,
      id: Date.now(), // Simple ID generation
      views: 0,
      likes: 0,
      status: 'Active',
      datePosted: new Date().toISOString().split('T')[0],
      location: user.location
    };
    setUserListings(prev => [newListing, ...prev]);
    return newListing.id;
  };

  const updateListing = (listingId, updates) => {
    setUserListings(prev => 
      prev.map(listing => 
        listing.id === listingId 
          ? { ...listing, ...updates }
          : listing
      )
    );
  };

  const deleteListing = (listingId) => {
    setUserListings(prev => prev.filter(listing => listing.id !== listingId));
  };

  const toggleListingStatus = (listingId) => {
    setUserListings(prev => 
      prev.map(listing => 
        listing.id === listingId 
          ? { ...listing, status: listing.status === 'Active' ? 'Inactive' : 'Active' }
          : listing
      )
    );
  };

  const markAsSold = (listingId) => {
    setUserListings(prev => 
      prev.map(listing => 
        listing.id === listingId 
          ? { ...listing, status: 'Sold' }
          : listing
      )
    );
  };

  // Statistics calculations
  const getStats = () => {
    const activeListings = userListings.filter(l => l.status === 'Active').length;
    const soldListings = userListings.filter(l => l.status === 'Sold').length;
    const totalViews = userListings.reduce((sum, l) => sum + l.views, 0);
    const totalListings = userListings.length;
    const avgRating = 4.8; // In a real app, this would be calculated from reviews
    
    return {
      totalSales: soldListings,
      totalPurchases: purchaseHistory.length,
      activeListings,
      totalListings,
      totalViews,
      rating: avgRating,
      totalReviews: soldListings + purchaseHistory.length
    };
  };

  const value = {
    user,
    userListings,
    purchaseHistory,
    updateUser,
    addListing,
    updateListing,
    deleteListing,
    toggleListingStatus,
    markAsSold,
    getStats
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
