import { useState } from 'react';
import { useUser } from '../hooks/useUser';
import styles from './EditListing.module.css';

const EditListing = ({ listing, onClose, onSave }) => {
  const { updateListing } = useUser();
  const [formData, setFormData] = useState({
    name: listing.name,
    category: listing.category,
    condition: listing.condition,
    description: listing.description,
    price: listing.price,
    originalPrice: listing.originalPrice || '',
    tags: listing.tags?.join(', ') || '',
    images: listing.images || []
  });
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    'Vehicles',
    'Electronics & Appliances',
    'Mobiles',
    'Furniture',
    'Fashion',
    'Pets',
    'Books, Sports & Hobbies',
    'Services'
  ];

  const conditions = [
    'Brand New',
    'Like New',
    'Excellent',
    'Very Good',
    'Good',
    'Fair',
    'Poor'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls].slice(0, 5)
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      updateListing(listing.id, updatedData);
      onSave?.();
      onClose();
    } catch (error) {
      console.error('Error updating listing:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Edit Listing</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Product Title *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="condition">Condition *</label>
              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                required
              >
                {conditions.map(cond => (
                  <option key={cond} value={cond}>{cond}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="price">Price ($) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="originalPrice">Original Price ($)</label>
              <input
                type="number"
                id="originalPrice"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleInputChange}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tags">Tags (comma separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="e.g., vintage, leather, designer"
            />
          </div>

          <div className={styles.imageSection}>
            <label>Images</label>
            <div className={styles.imageGrid}>
              {formData.images.map((image, index) => (
                <div key={index} className={styles.imagePreview}>
                  <img src={image} alt={`Preview ${index + 1}`} />
                  <button
                    type="button"
                    className={styles.removeImageBtn}
                    onClick={() => removeImage(index)}
                  >
                    ×
                  </button>
                  {index === 0 && <span className={styles.mainImageBadge}>Main</span>}
                </div>
              ))}
              
              {formData.images.length < 5 && (
                <label className={styles.uploadBtn}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21,15 16,10 5,21"></polyline>
                  </svg>
                  Add Photos
                </label>
              )}
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className={styles.saveBtn}>
              {isLoading ? 'Updating...' : 'Update Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditListing;
