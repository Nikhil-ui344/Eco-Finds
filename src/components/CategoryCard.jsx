import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './CategoryCard.module.css';

const CategoryCard = ({ category }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const categoryUrl = `/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <Link 
      to={categoryUrl}
      className={styles.categoryCard}
    >
      <div className={styles.imageContainer}>
        <img
          src={category.image}
          alt={category.name}
          className={`${styles.categoryImage} ${imageLoaded ? styles.loaded : ''}`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        <div className={styles.overlay} />
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.categoryName}>{category.name}</h3>
        <p className={styles.categoryDescription}>{category.description}</p>
        
        <div className={styles.arrow}>
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12,5 19,12 12,19"></polyline>
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
