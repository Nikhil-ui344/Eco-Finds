import { getAllListings } from './userService';
import { products as mockProducts } from '../data/mockData';

// Combine Firebase listings with mock data for marketplace
export async function getMarketplaceProducts() {
  try {
    const firebaseListings = await getAllListings();
    
    // Convert Firebase listings to marketplace format
    const userListings = firebaseListings.map((listing, index) => {
      // Use deterministic values based on listing ID or index to avoid hydration mismatches
      const seed = listing.id ? listing.id.length : index;
      const rating = 4.0 + (seed % 10) / 10; // Deterministic rating between 4-5
      const reviews = (seed % 50) + 5; // Deterministic reviews 5-55
      const yearsUsed = (seed % 30) / 10 + 0.5; // Deterministic years used
      
      return {
        ...listing,
        rating: parseFloat(rating.toFixed(1)),
        reviews,
        inStock: listing.status === 'active',
        seller: listing.userId?.slice(0, 8) || 'Anonymous', // Use first 8 chars of userId as seller name
        location: 'Local Seller',
        yearsUsed: parseFloat(yearsUsed.toFixed(1))
      };
    });
    
    // Combine with mock data
    return [...userListings, ...mockProducts];
  } catch (error) {
    console.error('Error fetching marketplace products:', error);
    // Fallback to mock data if Firebase fails
    return mockProducts;
  }
}

export function getProductById(id) {
  // For simplicity, we'll search in mock data first
  // In a real app, you'd have a proper product lookup service
  return mockProducts.find(p => p.id === parseInt(id)) || null;
}
