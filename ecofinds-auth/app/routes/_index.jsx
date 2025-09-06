import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../lib/auth";

export function meta() {
  return [
    { title: "EcoFinds" },
    { name: "description", content: "EcoFinds - Discover Amazing Second-Hand Treasures" },
  ];
}

export default function RootRedirect() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // If user is logged in, redirect to dashboard
        navigate("/dashboard", { replace: true });
      } else {
        // If user is not logged in, redirect to login
        navigate("/login", { replace: true });
      }
    }
  }, [user, loading, navigate]);

  // Show a simple loading message while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

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
            {loading ? (
              <div className={styles.loading}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading products...</p>
              </div>
            ) : noResults ? (
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
      </main>
    </div>
  );
}
