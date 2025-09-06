import React from 'react';
import { Link } from 'react-router';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.textContent}>
            <h1 className={styles.title}>
              <span className={styles.highlight}>Discover</span> Pre-Loved Treasures
            </h1>
            <p className={styles.subtitle}>
              Give items a second life while saving money and the planet. 
              Find unique, quality products at unbeatable prices.
            </p>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <div className={styles.statNumber}>10K+</div>
                <div className={styles.statLabel}>Happy Customers</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>50K+</div>
                <div className={styles.statLabel}>Items Sold</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>90%</div>
                <div className={styles.statLabel}>Satisfaction Rate</div>
              </div>
            </div>
            <div className={styles.actions}>
              <Link to="/home" className={styles.primaryButton}>
                <span>Start Shopping</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <button className={styles.secondaryButton}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <polygon points="10,8 16,12 10,16" fill="currentColor"/>
                </svg>
                <span>Watch How It Works</span>
              </button>
            </div>
          </div>
          <div className={styles.imageContent}>
            <div className={styles.imageGrid}>
              <Link to="/category/furniture" className={`${styles.imageCard} ${styles.card1}`}>
                <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&crop=center" alt="Vintage furniture" />
                <div className={styles.cardBadge}>Furniture</div>
              </Link>
              <Link to="/category/fashion" className={`${styles.imageCard} ${styles.card2}`}>
                <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop&crop=center" alt="Fashion items" />
                <div className={styles.cardBadge}>Fashion</div>
              </Link>
              <Link to="/category/electronics" className={`${styles.imageCard} ${styles.card3}`}>
                <img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop&crop=center" alt="Electronics" />
                <div className={styles.cardBadge}>Electronics</div>
              </Link>
              <Link to="/category/books" className={`${styles.imageCard} ${styles.card4}`}>
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=center" alt="Books" />
                <div className={styles.cardBadge}>Books</div>
              </Link>
            </div>
            <div className={styles.floatingElements}>
              <div className={styles.floatingCard}>
                <div className={styles.savingsBadge}>
                  <span className={styles.savingsText}>Save up to</span>
                  <span className={styles.savingsAmount}>70%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.backgroundElements}>
        <div className={styles.bgShape1}></div>
        <div className={styles.bgShape2}></div>
        <div className={styles.bgShape3}></div>
      </div>
    </section>
  );
};

export default Hero;
