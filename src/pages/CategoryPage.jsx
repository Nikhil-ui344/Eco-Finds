import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { categories, products } from '../data/mockData';
import styles from './CategoryPage.module.css';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');
  const [loading, setLoading] = useState(true);

  const category = categories.find(cat => 
    cat.name.toLowerCase().replace(/\s+/g, '-') === categoryName?.toLowerCase()
  ) || categories.find(cat => 
    cat.name.toLowerCase() === categoryName?.toLowerCase()
  );

  useEffect(() => {
    if (category) {
      let filtered = products.filter(product => 
        product.category.toLowerCase() === category.name.toLowerCase()
      );

      // Apply sorting
      filtered = filtered.sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'condition':
            const conditionOrder = { 'Like New': 1, 'Very Good': 2, 'Good': 3, 'Fair': 4 };
            return conditionOrder[a.condition] - conditionOrder[b.condition];
          case 'savings':
            const savingsA = ((a.originalPrice - a.price) / a.originalPrice) * 100;
            const savingsB = ((b.originalPrice - b.price) / b.originalPrice) * 100;
            return savingsB - savingsA;
          default:
            return a.name.localeCompare(b.name);
        }
      });

      // Apply condition filter
      if (filterBy !== 'all') {
        filtered = filtered.filter(product => 
          product.condition.toLowerCase().replace(/\s+/g, '-') === filterBy
        );
      }

      setCategoryProducts(filtered);
    }
    setLoading(false);
  }, [category, sortBy, filterBy]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className={styles.categoryPage}>
        <Header />
        <div className={styles.notFound}>
          <h1>Category Not Found</h1>
          <p>The category you're looking for doesn't exist.</p>
          <Link to="/" className={styles.backButton}>
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.categoryPage}>
      <Header />
      
      {/* Hero Section */}
      <section className={styles.categoryHero}>
        <div className={styles.heroBackground}>
          <img src={category.image} alt={category.name} />
          <div className={styles.heroOverlay}></div>
        </div>
        <div className={styles.heroContent}>
          <div className={styles.container}>
            <div className={styles.breadcrumb}>
              <Link to="/" className={styles.breadcrumbLink}>Home</Link>
              <span className={styles.breadcrumbSeparator}>›</span>
              <span className={styles.breadcrumbCurrent}>{category.name}</span>
            </div>
            <h1 className={styles.categoryTitle}>{category.name}</h1>
            <p className={styles.categoryDescription}>{category.description}</p>
            <div className={styles.categoryStats}>
              <div className={styles.stat}>
                <div className={styles.statNumber}>{categoryProducts.length}</div>
                <div className={styles.statLabel}>Items Available</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>
                  {categoryProducts.length > 0 
                    ? Math.round(categoryProducts.reduce((avg, product) => {
                        const savings = ((product.originalPrice - product.price) / product.originalPrice) * 100;
                        return avg + savings;
                      }, 0) / categoryProducts.length)
                    : 0}%
                </div>
                <div className={styles.statLabel}>Avg. Savings</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className={styles.filtersSection}>
        <div className={styles.container}>
          <div className={styles.filtersContainer}>
            <div className={styles.filterGroup}>
              <label htmlFor="sortBy">Sort by:</label>
              <select 
                id="sortBy"
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
                <option value="condition">Condition (Best First)</option>
                <option value="savings">Highest Savings</option>
              </select>
            </div>
            
            <div className={styles.filterGroup}>
              <label htmlFor="filterBy">Condition:</label>
              <select 
                id="filterBy"
                value={filterBy} 
                onChange={(e) => setFilterBy(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">All Conditions</option>
                <option value="like-new">Like New</option>
                <option value="very-good">Very Good</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
            </div>
            
            <div className={styles.resultCount}>
              {categoryProducts.length} {categoryProducts.length === 1 ? 'item' : 'items'} found
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className={styles.productsSection}>
        <div className={styles.container}>
          {categoryProducts.length > 0 ? (
            <div className={styles.productsGrid}>
              {categoryProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>No products found</h3>
              <p>Try adjusting your filters or check back later for new items.</p>
              <Link to="/" className={styles.exploreButton}>
                Explore All Categories
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2>Have items to sell?</h2>
            <p>Join thousands of sellers making money from their pre-loved items</p>
            <button className={styles.ctaButton}>Start Selling Today</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;
