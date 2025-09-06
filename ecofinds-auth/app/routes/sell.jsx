import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useUser } from '../hooks/user';
import Header from '../components/Header';
import styles from './SellProduct.module.css';

export function meta() {
  return [
    { title: "Sell | EcoFinds" },
    { name: "description", content: "Sell a product" },
  ];
}

export default function Sell() {
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
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const MAX_IMAGES = 5;
  const MAX_MB = 5;
  const DRAFT_KEY = 'ecofinds_sell_draft_v1';

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

  // Load draft once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw);
        setFormData((prev) => ({ ...prev, ...draft }));
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist draft
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    } catch {}
  }, [formData]);

  const validate = (data) => {
    const e = {};
    if (!data.name || data.name.trim().length < 3) e.name = 'Title must be at least 3 characters.';
    if (!data.category) e.category = 'Select a category.';
    if (!data.condition) e.condition = 'Select a condition.';
    if (!data.description || data.description.trim().length < 20) e.description = 'Description must be at least 20 characters.';
    if (currentStep >= 2) {
      const price = parseFloat(data.price);
      if (!(price > 0)) e.price = 'Enter a valid price (> 0).';
      if (data.originalPrice) {
        const op = parseFloat(data.originalPrice);
        if (isNaN(op) || op < 0) e.originalPrice = 'Original price must be 0 or more.';
      }
    }
    if (currentStep >= 3) {
      if (!data.images || data.images.length === 0) e.images = 'At least one photo is required.';
    }
    return e;
  };

  const isStepValid = useMemo(() => {
    const e = validate(formData);
    // For step-scoped validation, ignore errors for future steps
    if (currentStep === 1) {
      delete e.price;
      delete e.originalPrice;
      delete e.images;
    } else if (currentStep === 2) {
      delete e.images;
    }
    return Object.keys(e).length === 0;
  }, [formData, currentStep]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // live-validate changed field
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const accepted = [];
    const issues = [];
    files.forEach((file) => {
      const isImage = file.type.startsWith('image/');
      const tooBig = file.size > MAX_MB * 1024 * 1024;
      if (!isImage) issues.push(`${file.name}: not an image`);
      else if (tooBig) issues.push(`${file.name}: exceeds ${MAX_MB}MB`);
      else accepted.push(file);
    });
    const urls = accepted.map((file) => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...urls].slice(0, MAX_IMAGES)
    }));
    if (issues.length) {
      setErrors((prev) => ({ ...prev, images: issues.join(', ') }));
    } else {
      setErrors((prev) => ({ ...prev, images: undefined }));
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const moveImage = (index, dir) => {
    setFormData((prev) => {
      const imgs = [...prev.images];
      const target = index + dir;
      if (target < 0 || target >= imgs.length) return prev;
      const tmp = imgs[index];
      imgs[index] = imgs[target];
      imgs[target] = tmp;
      return { ...prev, images: imgs };
    });
  };

  const nextStep = () => {
    const e = validate(formData);
    setErrors(e);
    if (Object.keys(e).length) return;
    if (currentStep < 3) setCurrentStep((s) => s + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eMap = validate({ ...formData, images: formData.images });
    setErrors(eMap);
    if (Object.keys(eMap).length) return;
    setSubmitting(true);
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
        tags: (formData.tags && formData.tags.length
          ? formData.tags
          : formData.name
        )
          .split(',')
          .flatMap((s) => s.split(/\s+/))
          .map((tag) => tag.trim().toLowerCase())
          .filter((tag) => tag)
          .slice(0, 10),
        negotiable: formData.negotiable,
        delivery: formData.delivery
      };

      // Add the listing
      const listingId = addListing(listingData);
      // Clear draft
      try { localStorage.removeItem(DRAFT_KEY); } catch {}
      navigate('/profile' + (listingId ? `?new=${listingId}` : ''));
    } catch (error) {
      console.error('Error listing product:', error);
      setErrors((prev) => ({ ...prev, submit: 'Error listing product. Please try again.' }));
    }
    setSubmitting(false);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className={styles.stepContent}>
            <h2>Basic Information</h2>
            <div className={`${styles.formGroup} ${errors.name ? styles.invalid : ''}`}>
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
              {errors.name && <div className={styles.errorText}>{errors.name}</div>}
            </div>

            <div className={styles.formRow}>
              <div className={`${styles.formGroup} ${errors.category ? styles.invalid : ''}`}>
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
                {errors.category && <div className={styles.errorText}>{errors.category}</div>}
              </div>

              <div className={`${styles.formGroup} ${errors.condition ? styles.invalid : ''}`}>
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
                {errors.condition && <div className={styles.errorText}>{errors.condition}</div>}
              </div>
            </div>

            <div className={`${styles.formGroup} ${errors.description ? styles.invalid : ''}`}>
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
              {errors.description && <div className={styles.errorText}>{errors.description}</div>}
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
              <div className={`${styles.formGroup} ${errors.price ? styles.invalid : ''}`}>
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
                {errors.price && <div className={styles.errorText}>{errors.price}</div>}
              </div>

              <div className={`${styles.formGroup} ${errors.originalPrice ? styles.invalid : ''}`}>
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
                {errors.originalPrice && <div className={styles.errorText}>{errors.originalPrice}</div>}
              </div>
            </div>

            {formData.originalPrice && formData.price && parseFloat(formData.originalPrice) > parseFloat(formData.price) && (
              <div className={styles.savingsNote}>
                You save {Math.round(((parseFloat(formData.originalPrice) - parseFloat(formData.price)) / parseFloat(formData.originalPrice)) * 100)}%
              </div>
            )}

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
            {errors.images && <div className={styles.requirementAlert} role="alert">{errors.images}</div>}
            {formData.images.length === 0 && !errors.images && (
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
                    <div className={styles.imageControls}>
                      <button type="button" aria-label="Move left" onClick={() => moveImage(index, -1)} disabled={index === 0}>
                        ←
                      </button>
                      <button type="button" aria-label="Move right" onClick={() => moveImage(index, 1)} disabled={index === formData.images.length - 1}>
                        →
                      </button>
                    </div>
                    {index === 0 && <span className={styles.mainImageBadge}>Main</span>}
                  </div>
                ))}
                
                {formData.images.length < MAX_IMAGES && (
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
      <Header />
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
              <>
                <button type="button" onClick={nextStep} className={styles.nextBtn} disabled={!isStepValid}>
                  Next Step
                </button>
                {!isStepValid && currentStep === 1 && (
                  <div className={styles.helperText}>
                    Fill Title, Category, Condition, and a description of at least 20 characters to continue.
                  </div>
                )}
                {!isStepValid && currentStep === 2 && (
                  <div className={styles.helperText}>Enter a price greater than 0 to continue.</div>
                )}
              </>
            ) : (
              <button 
                type="submit" 
                className={`${styles.submitBtn} ${(formData.images.length === 0 || submitting) ? styles.disabled : ''}`}
                disabled={formData.images.length === 0 || submitting}
              >
                {submitting ? 'Listing…' : (formData.images.length === 0 ? 'Add Photos First' : 'List Item')}
              </button>
            )}
          </div>
          {errors.submit && <div className={styles.requirementAlert} role="alert">{errors.submit}</div>}
        </form>
      </div>
    </div>
  );
}
