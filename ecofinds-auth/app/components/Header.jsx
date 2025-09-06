import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { signOut } from 'firebase/auth';
import { useAuth } from '../lib/auth';
import { useCart } from '../hooks/cart';
import { auth } from '../lib/firebase';
import { useIsClient } from '../lib/clientOnly';
import styles from './Header.module.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, loading } = useAuth();
  const { totalItems } = useCart();
  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient) return;
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isClient]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setShowUserMenu(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <img src="/ecofinds-logo.png" alt="EcoFinds" className={styles.logoImage} />
          <div className={styles.logoContent}>
            <div className={styles.logoText}>EcoFinds</div>
            <div className={styles.logoSubtext}>Second-Hand</div>
          </div>
        </Link>
        
        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>
            Home
          </Link>
          {user && (
            <Link to="/sell" className={styles.navLink}>
              Sell
            </Link>
          )}
          {user && (
            <Link to="/profile" className={styles.navLink}>
              Profile
            </Link>
          )}
        </nav>

        <div className={styles.actions}>
          {!loading && (
            <>
              {user ? (
                <div className={styles.userMenu}>
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={styles.userButton}
                  >
                    <img 
                      src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=758E48&color=fff`}
                      alt={user.displayName || 'User'}
                      className={styles.userAvatar}
                    />
                    <span className={styles.userName}>{user.displayName || user.email}</span>
                  </button>
                  {showUserMenu && (
                    <div className={styles.dropdownMenu}>
                      <Link to="/profile" className={styles.dropdownItem}>
                        Profile
                      </Link>
                      <Link to="/sell" className={styles.dropdownItem}>
                        Sell Item
                      </Link>
                      <button onClick={handleSignOut} className={styles.dropdownItem}>
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.authButtons}>
                  <Link to="/login" className={styles.loginButton}>
                    Login
                  </Link>
                  <Link to="/signup" className={styles.signupButton}>
                    Sign Up
                  </Link>
                </div>
              )}
              
              <Link to="/cart" className={styles.cartButton}>
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                {totalItems > 0 && (
                  <span className={styles.cartCounter}>{totalItems}</span>
                )}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
