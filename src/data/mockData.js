export const categories = [
  {
    id: 1,
    name: 'Vehicles',
    image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop',
    description: 'Cars, bikes, and other vehicles'
  },
  {
    id: 2,
    name: 'Electronics & Appliances',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
    description: 'Pre-loved tech gadgets and home appliances'
  },
  {
    id: 3,
    name: 'Mobiles',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
    description: 'Used smartphones and mobile accessories'
  },
  {
    id: 4,
    name: 'Furniture',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    description: 'Pre-owned furniture & home essentials'
  },
  {
    id: 5,
    name: 'Fashion',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    description: 'Vintage & second-hand clothing'
  },
  {
    id: 6,
    name: 'Pets',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop',
    description: 'Pet supplies and accessories'
  },
  {
    id: 7,
    name: 'Books, Sports & Hobbies',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    description: 'Pre-loved books, sports equipment & hobby items'
  },
  {
    id: 8,
    name: 'Services',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
    description: 'Professional and personal services'
  }
];

export const products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    originalName: 'Sony Wireless Headphones (Used)',
    tags: ['headphones', 'wireless', 'sony', 'audio', 'music', 'bluetooth', 'noise cancelling'],
    price: 45.99,
    originalPrice: 99.99,
    category: 'Electronics & Appliances',
    condition: 'Very Good',
    description: 'Gently used Sony wireless headphones with noise cancellation. Minor wear on headband but excellent sound quality. All original accessories included. Perfect for music lovers looking for premium audio at a fraction of the cost.',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop'
    ],
    rating: 4.3,
    reviews: 28,
    inStock: true,
    featured: true,
    seller: 'AudioLover92',
    location: 'Downtown',
    yearsUsed: 1
  },
  {
    id: 2,
    name: 'Vintage Watch',
    originalName: 'Vintage Leather Watch',
    tags: ['watch', 'vintage', 'leather', 'timepiece', 'fashion', 'accessories', 'classic'],
    price: 85.00,
    originalPrice: 180.00,
    category: 'Fashion',
    condition: 'Good',
    description: 'Beautiful vintage leather watch with character. Shows normal wear but keeps perfect time. The patina adds charm and authenticity. A timeless piece that tells a story.',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop'
    ],
    rating: 4.7,
    reviews: 15,
    inStock: true,
    featured: true,
    seller: 'VintageFinds',
    location: 'Uptown',
    yearsUsed: 3
  },
  {
    id: 3,
    name: 'Smart Speaker',
    originalName: 'Amazon Echo (2nd Gen) - Refurbished',
    tags: ['smart speaker', 'echo', 'amazon', 'alexa', 'voice assistant', 'smart home', 'speaker'],
    price: 25.99,
    originalPrice: 79.99,
    category: 'Electronics & Appliances',
    condition: 'Good',
    description: 'Fully functional Amazon Echo smart speaker. Some minor scuffs but works perfectly. Great way to start your smart home journey without breaking the bank.',
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1572949645841-094f3f0c0c8c?w=600&h=600&fit=crop'
    ],
    rating: 4.1,
    reviews: 42,
    inStock: true,
    featured: false,
    seller: 'TechRecycle',
    location: 'Midtown',
    yearsUsed: 2
  },
  {
    id: 4,
    name: 'Sunglasses',
    originalName: 'Designer Sunglasses (Pre-owned)',
    tags: ['sunglasses', 'designer', 'fashion', 'accessories', 'eyewear', 'luxury', 'style'],
    price: 120.00,
    originalPrice: 250.00,
    category: 'Fashion',
    condition: 'Excellent',
    description: 'Barely used designer sunglasses in excellent condition. No scratches on lenses, minor wear on frame. Comes with original case. Authentic and verified.',
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop'
    ],
    rating: 4.8,
    reviews: 12,
    inStock: true,
    featured: true,
    seller: 'LuxurySecond',
    location: 'Fashion District',
    yearsUsed: 0.5
  },
  {
    id: 5,
    name: 'Yoga Mat',
    originalName: 'Yoga Mat (Gently Used)',
    tags: ['yoga mat', 'fitness', 'exercise', 'yoga', 'workout', 'pilates', 'gym', 'sports'],
    price: 15.99,
    originalPrice: 39.99,
    category: 'Books, Sports & Hobbies',
    condition: 'Very Good',
    description: 'High-quality yoga mat with minimal use. Cleaned and sanitized. No tears or damage. Perfect for someone starting their yoga journey or as a backup mat.',
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506629905877-c19d2dc2fab5?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&h=600&fit=crop'
    ],
    rating: 4.4,
    reviews: 23,
    inStock: true,
    featured: false,
    seller: 'YogaLife',
    location: 'Wellness Center',
    yearsUsed: 0.8
  },
  {
    id: 6,
    name: 'Coffee Maker',
    originalName: 'Vintage Coffee Maker',
    tags: ['coffee maker', 'vintage', 'kitchen', 'appliance', 'brewing', 'home', 'coffee'],
    price: 65.00,
    originalPrice: 129.99,
    category: 'Furniture',
    condition: 'Good',
    description: 'Charming vintage coffee maker that still brews excellent coffee. Shows some age but adds character to any kitchen. Fully functional with original carafe.',
    images: [
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1580933073521-dc49ac0d4e6a?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1542359649-31e03cd4d909?w=600&h=600&fit=crop'
    ],
    rating: 4.2,
    reviews: 18,
    inStock: true,
    featured: false,
    seller: 'RetroKitchen',
    location: 'Suburbs',
    yearsUsed: 4
  }
];

export const bannerImages = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop',
    title: 'Second Chance Sale',
    subtitle: 'Give pre-loved items a new home - up to 70% off retail',
    cta: 'Shop Sustainable'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=400&fit=crop',
    title: 'Refurbished Tech',
    subtitle: 'Quality electronics at unbeatable prices',
    cta: 'Browse Tech'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=400&fit=crop',
    title: 'Vintage Treasures',
    subtitle: 'Discover unique items with character and history',
    cta: 'Find Gems'
  }
];

// Additional products for different categories
export const additionalProducts = [
  {
    id: 7,
    name: 'Leather Jacket',
    originalName: 'Vintage Leather Jacket',
    tags: ['jacket', 'leather', 'vintage', 'fashion', 'outerwear', 'clothing', 'style'],
    price: 89.99,
    originalPrice: 249.99,
    category: 'Fashion',
    condition: 'Very Good',
    description: 'Classic vintage leather jacket in excellent condition. Timeless style that never goes out of fashion.',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop',
    ],
    rating: 4.8,
    reviews: 23,
    inStock: true,
    featured: false,
    seller: 'VintageFinds',
    location: 'Downtown',
    yearsUsed: 2
  },
  {
    id: 8,
    name: 'Books',
    originalName: 'Classic Literature Collection',
    tags: ['books', 'literature', 'classics', 'reading', 'collection', 'novels', 'education'],
    price: 45.00,
    originalPrice: 120.00,
    category: 'Books, Sports & Hobbies',
    condition: 'Good',
    description: 'Beautiful collection of classic literature books. Some shelf wear but pages are in great condition.',
    images: [
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=600&fit=crop',
    ],
    rating: 4.5,
    reviews: 15,
    inStock: true,
    featured: false,
    seller: 'BookLover',
    location: 'Suburbs',
    yearsUsed: 5
  },
  {
    id: 9,
    name: 'Coffee Table',
    originalName: 'Reclaimed Wood Coffee Table',
    tags: ['coffee table', 'furniture', 'wood', 'reclaimed', 'home', 'living room', 'table'],
    price: 180.00,
    originalPrice: 450.00,
    category: 'Furniture',
    condition: 'Very Good',
    description: 'Beautiful reclaimed wood coffee table with unique character marks. Perfect centerpiece for any living room.',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop',
    ],
    rating: 4.9,
    reviews: 8,
    inStock: true,
    featured: false,
    seller: 'WoodWorks',
    location: 'Midtown',
    yearsUsed: 1
  },
  {
    id: 10,
    name: 'Tennis Racket',
    originalName: 'Tennis Racket Set',
    tags: ['tennis racket', 'sports', 'tennis', 'racket', 'fitness', 'game', 'equipment'],
    price: 65.00,
    originalPrice: 150.00,
    category: 'Books, Sports & Hobbies',
    condition: 'Good',
    description: 'Complete tennis set with two rackets and balls. Perfect for getting back into the sport.',
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop',
    ],
    rating: 4.3,
    reviews: 12,
    inStock: true,
    featured: false,
    seller: 'SportySecondHand',
    location: 'Westside',
    yearsUsed: 2
  }
];

// Combine all products
products.push(...additionalProducts);
