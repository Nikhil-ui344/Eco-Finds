import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import styles from './SellProduct.module.css';

const SellProduct = () => {
  const navigate = useNavigate();
  const { addListing } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    condition: '',
    description: '',
    price: '',
    originalPrice: '',
    images: [],
    negotiable: false,
    delivery: false,
    tags: ''
  });

  const categories = [
    'Vehicles',
    'Electronics & Appliances',
    'Furniture',
    'Pets',
    'Sports',
    'Hobbies',
    'Books',
    'Fashion'
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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // In a real app, you'd upload these to a server
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls].slice(0, 5) // Max 5 images
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    // Validate current step before proceeding
    if (currentStep === 1) {
      if (!formData.name.trim() || !formData.category || !formData.condition || !formData.description.trim()) {
        alert('Please fill in all required fields (Title, Category, Condition, Description)');
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.price || parseFloat(formData.price) <= 0) {
        alert('Please enter a valid selling price');
        return;
      }
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that at least one photo is uploaded
    if (formData.images.length === 0) {
      alert('Please add at least one photo of your item');
      return;
    }
    
    try {
      // Prepare listing data
      const listingData = {
        name: formData.name,
        category: formData.category,
        condition: formData.condition,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        images: formData.images,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        negotiable: formData.negotiable,
        delivery: formData.delivery
      };

      // Add the listing
      const listingId = addListing(listingData);
      
      alert('Product listed successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Error listing product:', error);
      alert('Error listing product. Please try again.');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className={styles.stepContent}>
            <h2>Basic Information</h2>
            <div className={styles.formGroup}>
              <label htmlFor="name">Product Title *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="What are you selling?"
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
                  <option value="">Select a category</option>
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
                  <option value="">Select condition</option>
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
                placeholder="Describe your item (condition, features, reason for selling, etc.)"
                rows="5"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="tags">Tags (comma separated)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g., vintage, leather, designer, wireless"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className={styles.stepContent}>
            <h2>Pricing & Location</h2>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="price">Selling Price *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="originalPrice">Original Price</label>
                <input
                  type="number"
                  id="originalPrice"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="negotiable"
                  checked={formData.negotiable}
                  onChange={handleInputChange}
                />
                <span className={styles.checkmark}></span>
                Price is negotiable
              </label>

              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="delivery"
                  checked={formData.delivery}
                  onChange={handleInputChange}
                />
                <span className={styles.checkmark}></span>
                Delivery available
              </label>
            </div>
          </div>
        );

      case 3:
        return (
          <div className={styles.stepContent}>
            <h2>Photos *</h2>
            <p className={styles.photoInstructions}>
              <strong>At least 1 photo is required.</strong> Add up to 5 photos. The first photo will be your main image.
              <br />
              <span className={styles.photoCounter}>
                Photos uploaded: {formData.images.length}/5 
                {formData.images.length === 0 && <span className={styles.required}> (Minimum: 1)</span>}
              </span>
            </p>
            
            {formData.images.length === 0 && (
              <div className={styles.requirementAlert}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                Please add at least one photo to continue
              </div>
            )}
            
            <div className={styles.imageUploadSection}>
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
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21,15 16,10 5,21"></polyline>
                    </svg>
                    {formData.images.length === 0 ? 'Add Photos *' : 'Add More Photos'}
                  </label>
                )}
              </div>
            </div>

            <div className={styles.listingPreview}>
              <h3>Preview</h3>
              <div className={styles.previewCard}>
                <div className={styles.previewImage}>
                  {formData.images[0] ? (
                    <img src={formData.images[0]} alt="Main preview" />
                  ) : (
                    <div className={styles.noImagePlaceholder}>No image</div>
                  )}
                </div>
                <div className={styles.previewInfo}>
                  <h4>{formData.name || 'Product Title'}</h4>
                  <p className={styles.previewPrice}>${formData.price || '0.00'}</p>
                  <p className={styles.previewCondition}>{formData.condition || 'Condition'}</p>
                  <p className={styles.previewCategory}>{formData.category || 'Category'}</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.sellPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link to="/profile" className={styles.backBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
            Back to Profile
          </Link>
          <h1>Sell Your Item</h1>
          <p>List your item in just a few simple steps</p>
        </div>

        <div className={styles.progressBar}>
          <div className={styles.progressSteps}>
            {[1, 2, 3].map(step => (
              <div
                key={step}
                className={`${styles.progressStep} ${step <= currentStep ? styles.activeStep : ''}`}
              >
                <div className={styles.stepNumber}>{step}</div>
                <div className={styles.stepLabel}>
                  {step === 1 ? 'Details' : step === 2 ? 'Pricing' : 'Photos'}
                </div>
              </div>
            ))}
          </div>
          <div className={styles.progressLine}>
            <div 
              className={styles.progressFill}
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.sellForm}>
          {renderStep()}

          <div className={styles.formActions}>
            {currentStep > 1 && (
              <button type="button" onClick={prevStep} className={styles.prevBtn}>
                Previous
              </button>
            )}
            
            {currentStep < 3 ? (
              <button type="button" onClick={nextStep} className={styles.nextBtn}>
                Next Step
              </button>
            ) : (
              <button 
                type="submit" 
                className={`${styles.submitBtn} ${formData.images.length === 0 ? styles.disabled : ''}`}
                disabled={formData.images.length === 0}
              >
                {formData.images.length === 0 ? 'Add Photos First' : 'List Item'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellProduct;
