import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import SearchBar from '../components/SearchBar';
import Banner from '../components/Banner';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import { categories, products } from '../data/mockData';
import styles from './LandingPage.module.css';

const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');
  const [groupBy, setGroupBy] = useState('none');
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    let filtered = [...products];

    // Enhanced search filter with tags and fuzzy matching
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product => {
        // Search in product name
        const nameMatch = product.name.toLowerCase().includes(query);
        
        // Search in original name
        const originalNameMatch = product.originalName?.toLowerCase().includes(query);
        
        // Search in tags
        const tagMatch = product.tags?.some(tag => 
          tag.toLowerCase().includes(query) || query.includes(tag.toLowerCase())
        );
        
        // Search in description
        const descriptionMatch = product.description.toLowerCase().includes(query);
        
        // Search in category
        const categoryMatch = product.category.toLowerCase().includes(query);
        
        // Return true if any match is found
        return nameMatch || originalNameMatch || tagMatch || descriptionMatch || categoryMatch;
      });
    }

    // Apply category filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(product => product.category === filterBy);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'condition':
        const conditionOrder = { 'Excellent': 4, 'Very Good': 3, 'Good': 2, 'Fair': 1 };
        filtered.sort((a, b) => (conditionOrder[b.condition] || 0) - (conditionOrder[a.condition] || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(filtered);
    setNoResults(filtered.length === 0 && (searchQuery || filterBy !== 'all'));
  }, [searchQuery, sortBy, filterBy]);

  const groupProducts = () => {
    if (groupBy === 'none') {
      return { 'All Products': filteredProducts };
    }

    const grouped = {};
    
    filteredProducts.forEach(product => {
      let key;
      switch (groupBy) {
        case 'category':
          key = product.category;
          break;
        case 'condition':
          key = product.condition;
          break;
        case 'price':
          if (product.price < 30) key = 'Under $30';
          else if (product.price < 60) key = '$30 - $60';
          else if (product.price < 100) key = '$60 - $100';
          else key = 'Over $100';
          break;
        case 'rating':
          if (product.rating >= 4.5) key = '4.5+ Stars';
          else if (product.rating >= 4) key = '4+ Stars';
          else if (product.rating >= 3.5) key = '3.5+ Stars';
          else key = 'Under 3.5 Stars';
          break;
        default:
          key = 'All Products';
      }
      
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(product);
    });

    return grouped;
  };

  const groupedProducts = groupProducts();

  return (
    <div className={styles.landingPage}>
      <Header />
      
      <Hero />
      
      <SearchBar
        onSearch={setSearchQuery}
        onSort={setSortBy}
        onFilter={setFilterBy}
        onGroupBy={setGroupBy}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <Banner />

      <main className={styles.main}>
        {/* Categories Section */}
        <section className={styles.categoriesSection}>
          <div className={styles.container}>
                            <h2 className={styles.sectionTitle}>Browse by Category</h2>
            <div className={styles.categoriesGrid}>
              {categories.map((category, index) => (
                <div
                  key={category.id}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CategoryCard
                    category={category}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className={styles.productsSection}>
          <div className={styles.container}>
            {noResults ? (
              <div className={styles.noResults}>
                <div className={styles.noResultsIcon}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="M21 21l-4.35-4.35"></path>
                  </svg>
                </div>
                <h3>No results found</h3>
                <p>Try adjusting your search or filter to find what you're looking for.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterBy('all');
                  }}
                  className={styles.clearFiltersButton}
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              Object.entries(groupedProducts).map(([groupName, products]) => (
                <div key={groupName} className={styles.productGroup}>
                  {groupBy !== 'none' && (
                    <h3 className={styles.groupTitle}>{groupName}</h3>
                  )}
                  <div className={styles.productsGrid}>
                    {products.map((product, index) => (
                      <div
                        key={product.id}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* User Profile/Dashboard Link */}
        <section className={styles.profileSection}>
          <div className={styles.container}>
            <Link to="/profile" className={styles.profileLink}>
              <span>Go to Dashboard</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12,5 19,12 12,19"></polyline>
              </svg>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
