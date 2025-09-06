import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import EditProfile from '../components/EditProfile';
import EditListing from '../components/EditListing';
import styles from './Profile.module.css';

const Profile = () => {
  const { user, userListings, purchaseHistory, deleteListing, markAsSold, getStats } = useUser();
  const [activeTab, setActiveTab] = useState('profile');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const stats = getStats();

  const handleDeleteListing = (listingId) => {
    deleteListing(listingId);
    setShowDeleteConfirm(null);
  };

  const handleMarkAsSold = (listingId) => {
    markAsSold(listingId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={styles.profilePage}>
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
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit Profile
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className={styles.tabNavigation}>
          <button 
            className={`${styles.tab} ${activeTab === 'profile' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile Details
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'listings' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('listings')}
          >
            My Listings ({userListings.length})
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'purchases' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('purchases')}
          >
            Purchase History ({purchaseHistory.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {activeTab === 'profile' && (
            <div className={styles.profileDetails}>
              <div className={styles.detailsGrid}>
                <div className={styles.detailCard}>
                  <h3>Contact Information</h3>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Email:</span>
                    <span className={styles.value}>{user.email}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Phone:</span>
                    <span className={styles.value}>{user.phone}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Location:</span>
                    <span className={styles.value}>{user.location}</span>
                  </div>
                </div>

                <div className={styles.detailCard}>
                  <h3>Account Statistics</h3>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Member Since:</span>
                    <span className={styles.value}>{user.joinDate}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Total Transactions:</span>
                    <span className={styles.value}>{stats.totalSales + stats.totalPurchases}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Success Rate:</span>
                    <span className={styles.value}>98%</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Total Views:</span>
                    <span className={styles.value}>{stats.totalViews}</span>
                  </div>
                </div>
              </div>

              <div className={styles.bioSection}>
                <h3>About Me</h3>
                <p className={styles.bio}>{user.bio}</p>
              </div>
            </div>
          )}

          {activeTab === 'listings' && (
            <div className={styles.listingsGrid}>
              {userListings.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>You haven't listed any items yet.</p>
                  <Link to="/sell" className={styles.sellButton}>
                    List Your First Item
                  </Link>
                </div>
              ) : (
                userListings.map(listing => (
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
                      <p className={styles.condition}>Condition: {listing.condition}</p>
                      <p className={styles.category}>{listing.category}</p>
                      <p className={styles.datePosted}>Posted: {formatDate(listing.datePosted)}</p>
                      <div className={styles.listingStats}>
                        <span>{listing.views} views</span>
                        <span>{listing.likes} likes</span>
                      </div>
                    </div>
                    <div className={styles.listingActions}>
                      <button 
                        className={styles.editListingBtn}
                        onClick={() => setEditingListing(listing)}
                      >
                        Edit
                      </button>
                      {listing.status === 'Active' && (
                        <button 
                          className={styles.markSoldBtn}
                          onClick={() => handleMarkAsSold(listing.id)}
                        >
                          Mark as Sold
                        </button>
                      )}
                      <button 
                        className={styles.deleteListingBtn}
                        onClick={() => setShowDeleteConfirm(listing.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'purchases' && (
            <div className={styles.purchaseHistory}>
              {purchaseHistory.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>You haven't made any purchases yet.</p>
                  <Link to="/" className={styles.browseButton}>
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className={styles.purchaseGrid}>
                  {purchaseHistory.map(purchase => (
                    <div key={purchase.id} className={styles.purchaseCard}>
                      <div className={styles.purchaseImage}>
                        <img src={purchase.image} alt={purchase.name} />
                      </div>
                      <div className={styles.purchaseInfo}>
                        <h4>{purchase.name}</h4>
                        <p className={styles.price}>${purchase.price}</p>
                        <p className={styles.seller}>Seller: {purchase.seller}</p>
                        <p className={styles.purchaseDate}>Purchased: {formatDate(purchase.purchaseDate)}</p>
                        <span className={`${styles.statusBadge} ${styles[purchase.status.toLowerCase()]}`}>
                          {purchase.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modals */}
        {showEditProfile && (
          <EditProfile
            onClose={() => setShowEditProfile(false)}
            onSave={() => {
              // Refresh or update UI as needed
            }}
          />
        )}

        {editingListing && (
          <EditListing
            listing={editingListing}
            onClose={() => setEditingListing(null)}
            onSave={() => {
              // Refresh or update UI as needed
            }}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className={styles.modal}>
            <div className={styles.confirmModal}>
              <h3>Delete Listing</h3>
              <p>Are you sure you want to delete this listing? This action cannot be undone.</p>
              <div className={styles.confirmActions}>
                <button 
                  className={styles.cancelBtn}
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  Cancel
                </button>
                <button 
                  className={styles.deleteBtn}
                  onClick={() => handleDeleteListing(showDeleteConfirm)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
