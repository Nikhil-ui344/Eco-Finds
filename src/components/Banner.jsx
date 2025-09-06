import { useState, useEffect } from 'react';
import { bannerImages } from '../data/mockData';
import styles from './Banner.module.css';

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
      setIsTransitioning(false);
    }, 150);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
      setIsTransitioning(false);
    }, 150);
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 150);
  };

  return (
    <section className={styles.banner}>
      <div className={styles.slideContainer}>
        {bannerImages.map((banner, index) => (
          <div
            key={banner.id}
            className={`${styles.slide} ${
              index === currentSlide ? styles.active : ''
            } ${isTransitioning ? styles.transitioning : ''}`}
          >
            <div
              className={styles.slideBackground}
              style={{ backgroundImage: `url(${banner.image})` }}
            />
            <div className={styles.slideOverlay} />
            <div className={styles.slideContent}>
              <h1 className={styles.slideTitle}>{banner.title}</h1>
              <p className={styles.slideSubtitle}>{banner.subtitle}</p>
              <button className={styles.ctaButton}>
                {banner.cta}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12,5 19,12 12,19"></polyline>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className={`${styles.navButton} ${styles.prevButton}`}
        aria-label="Previous slide"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15,18 9,12 15,6"></polyline>
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className={`${styles.navButton} ${styles.nextButton}`}
        aria-label="Next slide"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9,18 15,12 9,6"></polyline>
        </svg>
      </button>

      <div className={styles.dots}>
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ''}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Banner;
