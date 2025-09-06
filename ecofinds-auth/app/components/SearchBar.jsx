import { useState, useEffect } from 'react';
import { products } from '../data/mockData';
import styles from './SearchBar.module.css';

const SearchBar = ({ onSearch, onSort, onFilter, onGroupBy, searchQuery, setSearchQuery }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');
  const [groupBy, setGroupBy] = useState('none');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Generate search suggestions based on product data
  useEffect(() => {
    if (searchQuery && searchQuery.length > 0) {
      const query = searchQuery.toLowerCase();
      const suggestionSet = new Set();
      
      products.forEach(product => {
        // Add product names
        if (product.name.toLowerCase().includes(query)) {
          suggestionSet.add(product.name);
        }
        
        // Add tags that match
        product.tags?.forEach(tag => {
          if (tag.toLowerCase().includes(query) || query.includes(tag.toLowerCase())) {
            suggestionSet.add(tag);
          }
        });
        
        // Add categories
        if (product.category.toLowerCase().includes(query)) {
          suggestionSet.add(product.category);
        }
      });
      
      setSuggestions(Array.from(suggestionSet).slice(0, 8)); // Limit to 8 suggestions
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    onSort(value);
  };

  const handleFilterChange = (value) => {
    setFilterBy(value);
    onFilter(value);
  };

  const handleGroupChange = (value) => {
    setGroupBy(value);
    onGroupBy(value);
  };

  return (
    <div className={styles.searchSection}>
      <div className={styles.container}>
        <div className={`${styles.searchBar} ${isFocused ? styles.focused : ''}`}>
          <div className={styles.searchIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.35-4.35"></path>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search for second-hand treasures..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => {
              setIsFocused(true);
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            onBlur={() => {
              setIsFocused(false);
              // Delay hiding suggestions to allow clicking
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                onSearch('');
                setShowSuggestions(false);
              }}
              className={styles.clearButton}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
          
          {/* Search Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className={styles.suggestionsDropdown}>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className={styles.suggestionItem}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="M21 21l-4.35-4.35"></path>
                  </svg>
                  <span>{suggestion}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className={styles.pillButton}
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="condition">Best Condition</option>
              <option value="rating">Rating</option>
              <option value="newest">Recently Listed</option>
            </select>
          </div>

          <div className={styles.controlGroup}>
            <select
              value={filterBy}
              onChange={(e) => handleFilterChange(e.target.value)}
              className={styles.pillButton}
            >
              <option value="all">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home & Garden">Home & Garden</option>
              <option value="Sports">Sports</option>
              <option value="Books">Books</option>
              <option value="Collectibles">Collectibles</option>
            </select>
          </div>

          <div className={styles.controlGroup}>
            <select
              value={groupBy}
              onChange={(e) => handleGroupChange(e.target.value)}
              className={styles.pillButton}
            >
              <option value="none">No Grouping</option>
              <option value="category">Group by Category</option>
              <option value="condition">Group by Condition</option>
              <option value="price">Group by Price Range</option>
              <option value="rating">Group by Rating</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
