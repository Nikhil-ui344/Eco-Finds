import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart, items } = useCart();
  
  const isInCart = items.some(item => item.id === product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInCart) return;
    
    setIsAddingToCart(true);
    addToCart(product);
    
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 300);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <defs>
            <linearGradient id="halfStarGradient">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <polygon 
            points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
            fill="url(#halfStarGradient)"
          />
        </svg>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      );
    }

    return stars;
  };

  return (
    <Link to={`/product/${product.id}`} className={styles.productCard}>
      <div className={styles.imageContainer}>
        <img
          src={product.images[0]}
          alt={product.name}
          className={`${styles.productImage} ${imageLoaded ? styles.loaded : ''}`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        {product.featured && (
          <div className={styles.featuredBadge}>Featured</div>
        )}
        {!product.inStock && (
          <div className={styles.outOfStockOverlay}>
            <span>Out of Stock</span>
          </div>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.topRow}>
          <div className={styles.category}>{product.category}</div>
          <div className={styles.condition}>{product.condition}</div>
        </div>
        <h3 className={styles.productName}>{product.name}</h3>
        
        <div className={styles.priceContainer}>
          <div className={styles.currentPrice}>${product.price}</div>
          {product.originalPrice && (
            <div className={styles.originalPrice}>${product.originalPrice}</div>
          )}
          {product.originalPrice && (
            <div className={styles.savings}>
              Save ${(product.originalPrice - product.price).toFixed(2)}
            </div>
          )}
        </div>
        
        <div className={styles.rating}>
          <div className={styles.stars}>
            {renderStars(product.rating)}
          </div>
          <span className={styles.reviewCount}>({product.reviews})</span>
        </div>

        <div className={styles.sellerInfo}>
          <span className={styles.sellerLabel}>Seller:</span>
          <span className={styles.sellerName}>{product.seller}</span>
        </div>

        <div className={styles.footer}>
          <div className={styles.location}>{product.location}</div>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || isAddingToCart || isInCart}
            className={`${styles.addToCartButton} ${isAddingToCart ? styles.adding : ''} ${!product.inStock ? styles.disabled : ''} ${isInCart ? styles.inCart : ''}`}
            title={isInCart ? 'Already in cart' : 'Add to cart'}
          >
            {isInCart ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            ) : isAddingToCart ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
