import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useCart } from '../hooks/cart';
import Header from '../components/Header';
import styles from './Cart.module.css';

export function meta() {
  return [
    { title: "Cart | EcoFinds" },
    { name: "description", content: "Shopping cart" },
  ];
}

export default function Cart() {
  const navigate = useNavigate();
  const { items, totalItems, removeFromCart, clearCart, getTotalPrice } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const subtotal = getTotalPrice();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax - discount;

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === 'save10') {
      setDiscount(subtotal * 0.1);
      alert('Coupon applied! 10% discount added.');
    } else if (couponCode.toLowerCase() === 'welcome5') {
      setDiscount(5);
      alert('Coupon applied! $5 discount added.');
    } else {
      alert('Invalid coupon code');
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }
    setShowCheckout(true);
  };

  const processOrder = () => {
    // In a real app, this would integrate with a payment processor
    alert('Order placed successfully! You will receive a confirmation email shortly.');
    clearCart();
    navigate('/home');
  };

  if (items.length === 0) {
    return (
      <div className={styles.cartPage}>
        <Header />
        <div className={styles.emptyCart}>
          <div className={styles.container}>
            <div className={styles.emptyCartContent}>
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.emptyCartIcon}>
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <h1>Your cart is empty</h1>
              <p>Discover amazing second-hand finds and start adding items to your cart</p>
              <Link to="/home" className={styles.shopButton}>
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cartPage}>
      <Header />
      <div className={styles.container}>
        <div className={styles.cartHeader}>
          <h1>Shopping Cart ({totalItems} items)</h1>
          <button onClick={clearCart} className={styles.clearButton}>
            Clear Cart
          </button>
        </div>

        <div className={styles.cartContent}>
          <div className={styles.cartItems}>
            {items.map(item => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemImage}>
                  <img src={item.images[0]} alt={item.name} />
                </div>
                
                <div className={styles.itemDetails}>
                  <h3>{item.name}</h3>
                  <p className={styles.itemCondition}>Condition: {item.condition}</p>
                  <p className={styles.itemSeller}>Sold by: {item.seller}</p>
                  <p className={styles.itemLocation}>📍 {item.location}</p>
                </div>

                <div className={styles.itemPrice}>
                  <div className={styles.priceSection}>
                    <span className={styles.currentPrice}>${item.price}</span>
                    {item.originalPrice && (
                      <span className={styles.originalPrice}>${item.originalPrice}</span>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => removeFromCart(item.id)}
                  className={styles.removeButton}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3,6 5,6 21,6"></polyline>
                    <path d="M19,6L17,20C17,21 16,22 15,22H9C8,22 7,21 7,20L5,6M10,11V17M14,11V17"></path>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className={styles.cartSummary}>
            <div className={styles.summaryCard}>
              <h2>Order Summary</h2>
              
              <div className={styles.summaryLine}>
                <span>Subtotal ({totalItems} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className={styles.summaryLine}>
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              
              <div className={styles.summaryLine}>
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              
              {discount > 0 && (
                <div className={styles.summaryLine}>
                  <span>Discount</span>
                  <span className={styles.discount}>-${discount.toFixed(2)}</span>
                </div>
              )}
              
              <div className={styles.couponSection}>
                <div className={styles.couponInput}>
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button onClick={applyCoupon}>Apply</button>
                </div>
                <p className={styles.couponHint}>Try: SAVE10 or WELCOME5</p>
              </div>
              
              <div className={styles.totalLine}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              {subtotal < 50 && (
                <p className={styles.shippingNote}>
                  Add ${(50 - subtotal).toFixed(2)} more for FREE shipping!
                </p>
              )}
              
              <button onClick={handleCheckout} className={styles.checkoutButton}>
                Proceed to Checkout
              </button>
              
              <Link to="/home" className={styles.continueShoppingLink}>
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {showCheckout && (
          <div className={styles.checkoutModal}>
            <div className={styles.modalContent}>
              <h2>Checkout</h2>
              <div className={styles.checkoutSummary}>
                <p>Total: <strong>${total.toFixed(2)}</strong></p>
                <p>Items: {totalItems}</p>
              </div>
              <div className={styles.checkoutActions}>
                <button onClick={processOrder} className={styles.confirmButton}>
                  Confirm Order
                </button>
                <button onClick={() => setShowCheckout(false)} className={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
