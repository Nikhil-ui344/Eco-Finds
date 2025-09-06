import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { products } from '../data/mockData';
import Header from '../components/Header';
import styles from './ProductPage.module.css';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const foundProduct = products.find(p => p.id === parseInt(id));
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      navigate('/');
    }
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!product || !product.inStock) return;
    
    setIsAddingToCart(true);
    
    // Add the specified quantity to cart
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 600);
  };

  const nextImage = () => {
    if (product) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
      setIsImageLoaded(false);
    }
  };

  const prevImage = () => {
    if (product) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
      setIsImageLoaded(false);
    }
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
    setIsImageLoaded(false);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
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
        <svg key={`empty-${i}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      );
    }

    return stars;
  };

  if (!product) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading product...</p>
      </div>
    );
  }

  return (
    <div className={styles.productPage}>
      <Header />
      
      <div className={styles.breadcrumb}>
        <div className={styles.container}>
          <Link to="/" className={styles.breadcrumbLink}>Home</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{product.name}</span>
        </div>
      </div>

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.productLayout}>
            {/* Product Images */}
            <div className={styles.imageSection}>
              <div className={styles.mainImageContainer}>
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className={`${styles.mainImage} ${isImageLoaded ? styles.loaded : ''}`}
                  onLoad={() => setIsImageLoaded(true)}
                />
                
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className={`${styles.imageNavButton} ${styles.prevButton}`}
                      aria-label="Previous image"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15,18 9,12 15,6"></polyline>
                      </svg>
                    </button>

                    <button
                      onClick={nextImage}
                      className={`${styles.imageNavButton} ${styles.nextButton}`}
                      aria-label="Next image"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9,18 15,12 9,6"></polyline>
                      </svg>
                    </button>
                  </>
                )}
                
                {!product.inStock && (
                  <div className={styles.outOfStockOverlay}>
                    <span>Out of Stock</span>
                  </div>
                )}
              </div>

              {product.images.length > 1 && (
                <div className={styles.thumbnails}>
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`${styles.thumbnail} ${index === currentImageIndex ? styles.activeThumbnail : ''}`}
                    >
                      <img src={image} alt={`${product.name} ${index + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className={styles.detailsSection}>
              <div className={styles.topInfo}>
                <div className={styles.category}>{product.category}</div>
                <div className={styles.condition}>{product.condition}</div>
              </div>
              
              <h1 className={styles.productTitle}>{product.name}</h1>
              
              <div className={styles.rating}>
                <div className={styles.stars}>
                  {renderStars(product.rating)}
                </div>
                <span className={styles.ratingText}>
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <div className={styles.priceSection}>
                <div className={styles.currentPrice}>${product.price}</div>
                {product.originalPrice && (
                  <div className={styles.priceComparison}>
                    <span className={styles.originalPrice}>Originally ${product.originalPrice}</span>
                    <span className={styles.savings}>
                      Save ${(product.originalPrice - product.price).toFixed(2)} ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off)
                    </span>
                  </div>
                )}
              </div>

              <div className={styles.sellerSection}>
                <h3>Seller Information</h3>
                <div className={styles.sellerDetails}>
                  <div className={styles.sellerInfo}>
                    <span className={styles.sellerName}>{product.seller}</span>
                    <span className={styles.location}>{product.location}</span>
                  </div>
                  <div className={styles.itemAge}>
                    Used for {product.yearsUsed < 1 ? `${Math.round(product.yearsUsed * 12)} months` : `${product.yearsUsed} ${product.yearsUsed === 1 ? 'year' : 'years'}`}
                  </div>
                </div>
              </div>

              <div className={styles.description}>
                <h3>Description</h3>
                <p>{product.description}</p>
              </div>

              <div className={styles.actions}>
                <div className={styles.quantitySelector}>
                  <label htmlFor="quantity">Quantity:</label>
                  <div className={styles.quantityInput}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className={styles.quantityButton}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className={styles.quantityValue}
                      min="1"
                      max="10"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                      className={styles.quantityButton}
                      disabled={quantity >= 10}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isAddingToCart}
                  className={`${styles.addToCartButton} ${isAddingToCart ? styles.adding : ''} ${!product.inStock ? styles.disabled : ''}`}
                >
                  {isAddingToCart ? (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      Added to Cart!
                    </>
                  ) : !product.inStock ? (
                    'Out of Stock'
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                      </svg>
                      Add to Cart
                    </>
                  )}
                </button>
              </div>

              <div className={styles.backLink}>
                <Link to="/" className={styles.backButton}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15,18 9,12 15,6"></polyline>
                  </svg>
                  Back to Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductPage;
