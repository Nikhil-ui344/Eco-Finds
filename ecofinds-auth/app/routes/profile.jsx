import { useState } from 'react';
import { Link } from 'react-router';
import { useUser } from '../hooks/user';
import { ProtectedRoute } from '../components/ProtectedRoute';
import EditProfile from '../components/EditProfile';
import EditListing from '../components/EditListing';
import Header from '../components/Header';
import styles from './Profile.module.css';

export function meta() {
  return [
    { title: "Profile | EcoFinds" },
    { name: "description", content: "Your EcoFinds profile and dashboard" },
  ];
}

function ProfileContent() {
  const { user, userListings, loading, deleteListing, markAsSold, getStats } = useUser();
  const [activeTab, setActiveTab] = useState('profile');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  if (loading) {
    return (
      <div className={styles.profilePage}>
        <Header />
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  const stats = getStats();

  const handleDeleteListing = (listingId) => {
    deleteListing(listingId);
    setShowDeleteConfirm(null);
  };

  const handleMarkAsSold = (listingId) => {
    markAsSold(listingId);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    try {
      const date = dateString.seconds ? new Date(dateString.seconds * 1000) : new Date(dateString);
      // Use ISO string formatting to avoid locale-based hydration mismatches
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC' // Use UTC to ensure consistent formatting
      });
    } catch (error) {
      console.warn('Error formatting date:', error);
      return 'Recently';
    }
  };

  return (
    <div className={styles.profilePage}>
      <Header />
      
      <div className={styles.container}>
        {/* Profile Header */}
        <div className={styles.profileHeader}>
          <div className={styles.avatarSection}>
            <img src={user.avatar} alt={user.name} className={styles.avatar} />
            <div className={styles.userInfo}>
              <h1 className={styles.userName}>{user.name}</h1>
              <p className={styles.userLocation}>{user.location}</p>
              <p className={styles.memberSince}>Member since {user.joinDate}</p>
              <div className={styles.rating}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(stats.rating) ? styles.starFilled : styles.starEmpty}>
                      ★
                    </span>
                  ))}
                </div>
                <span className={styles.ratingText}>{stats.rating} ({stats.totalReviews} reviews)</span>
              </div>
            </div>
          </div>
          
          <div className={styles.statsSection}>
            <div className={styles.stat}>
              <div className={styles.statNumber}>{stats.totalSales}</div>
              <div className={styles.statLabel}>Items Sold</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>{stats.totalPurchases}</div>
              <div className={styles.statLabel}>Items Bought</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>{stats.rating}</div>
              <div className={styles.statLabel}>Rating</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <Link to="/home" className={styles.homeButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9,22 9,12 15,12 15,22"></polyline>
            </svg>
            Back to Home
          </Link>
          <Link to="/sell" className={styles.sellButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            Sell New Item
          </Link>
          <button 
            className={styles.editButton}
            onClick={() => setShowEditProfile(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit Profile
          </button>
        </div>

        {/* Bio Section */}
        <div className={styles.bioSection}>
          <h3>About</h3>
          <p>{user.bio}</p>
        </div>

        {/* Tab Navigation */}
        <div className={styles.tabNav}>
          <button 
            className={`${styles.tab} ${activeTab === 'listings' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('listings')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="9" cy="9" r="2"></circle>
              <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
            </svg>
            My Listings ({userListings.length})
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'purchases' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('purchases')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            Purchase History ({purchaseHistory.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {activeTab === 'listings' && (
            <div className={styles.listingsGrid}>
              {userListings.length === 0 ? (
                <div className={styles.emptyState}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="9" cy="9" r="2"></circle>
                    <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                  </svg>
                  <h3>No listings yet</h3>
                  <p>Start selling by creating your first listing</p>
                  <Link to="/sell" className={styles.createListingBtn}>
                    Create Your First Listing
                  </Link>
                </div>
              ) : (
                userListings.map((listing) => (
                  <div key={listing.id} className={styles.listingCard}>
                    <div className={styles.listingImage}>
                      <img src={listing.images[0]} alt={listing.name} />
                      <div className={`${styles.statusBadge} ${styles[listing.status.toLowerCase()]}`}>
                        {listing.status}
                      </div>
                    </div>
                    <div className={styles.listingInfo}>
                      <h4>{listing.name}</h4>
                      <p className={styles.price}>${listing.price}</p>
                      <div className={styles.listingMeta}>
                        <span>{listing.views} views</span>
                        <span>{listing.likes} likes</span>
                        <span>Posted {formatDate(listing.datePosted)}</span>
                      </div>
                      <div className={styles.listingActions}>
                        {listing.status === 'Active' && (
                          <>
                            <button onClick={() => handleMarkAsSold(listing.id)} className={styles.markSoldBtn}>
                              Mark as Sold
                            </button>
                            <button onClick={() => setEditingListing(listing)} className={styles.editBtn}>
                              Edit
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => setShowDeleteConfirm(listing.id)} 
                          className={styles.deleteBtn}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'purchases' && (
            <div className={styles.purchasesGrid}>
              {purchaseHistory.length === 0 ? (
                <div className={styles.emptyState}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  <h3>No purchases yet</h3>
                  <p>Start shopping to see your purchase history here</p>
                  <Link to="/home" className={styles.shopNowBtn}>
                    Start Shopping
                  </Link>
                </div>
              ) : (
                purchaseHistory.map((purchase) => (
                  <div key={purchase.id} className={styles.purchaseCard}>
                    <div className={styles.purchaseImage}>
                      <img src={purchase.image} alt={purchase.name} />
                    </div>
                    <div className={styles.purchaseInfo}>
                      <h4>{purchase.name}</h4>
                      <p className={styles.seller}>Sold by {purchase.seller}</p>
                      <p className={styles.price}>${purchase.price}</p>
                      <div className={styles.purchaseMeta}>
                        <span>Purchased {formatDate(purchase.purchaseDate)}</span>
                        <span className={`${styles.statusBadge} ${styles[purchase.status.toLowerCase()]}`}>
                          {purchase.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showEditProfile && (
        <EditProfile 
          onClose={() => setShowEditProfile(false)}
          onSave={() => setShowEditProfile(false)}
        />
      )}

      {editingListing && (
        <EditListing
          listing={editingListing}
          onClose={() => setEditingListing(null)}
          onSave={() => setEditingListing(null)}
        />
      )}

      {showDeleteConfirm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Delete Listing</h3>
            <p>Are you sure you want to delete this listing? This action cannot be undone.</p>
            <div className={styles.modalActions}>
              <button 
                onClick={() => setShowDeleteConfirm(null)}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDeleteListing(showDeleteConfirm)}
                className={styles.deleteBtn}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Profile() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
