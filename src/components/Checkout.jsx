import React, { useState } from 'react';
import { CreditCard, MapPin, User, Banknote, Lock, CheckCircle2, X } from 'lucide-react';
import "./Checkout.css";
import { orderService } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const CheckoutPage = ({ display, closeCheckout }) => {
  const { isAuthenticated, user } = useAuth();
  const { cart, cartTotal, clearCart } = useCart();

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  const subtotal = cartTotal;
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 4.99;
  const codFee = paymentMethod === 'cod' ? 2.99 : 0;
  const total = subtotal + tax + shipping + codFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    if (paymentMethod === 'cod') return true;
    const newErrors = {};
    if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
    if (!formData.cardName.trim()) newErrors.cardName = 'Cardholder name is required';
    if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
    if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = () => {
    if (validateStep1()) setStep(2);
  };

  const handlePlaceOrder = async () => {
    if (!validateStep2()) return;
    setIsSubmitting(true);
    setErrors({});

    try {
      const orderData = {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        shipping_address: formData.address,
        city: formData.city,
        state: formData.state || null,
        zip_code: formData.zipCode,
        payment_method: paymentMethod,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          unit: item.unit || 'lb'
        }))
      };

      const response = await orderService.createOrder(orderData);
      if (response.success) {
        setOrderResult(response.data);
        await clearCart();
        setStep(3);
      } else {
        setErrors({ submit: response.message || 'Failed to place order' });
      }
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to place order. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    setStep(1);
    setOrderResult(null);
    setFormData({
      fullName: user?.full_name || '', email: user?.email || '', phone: user?.phone || '',
      address: '', city: '', state: '', zipCode: '',
      cardNumber: '', cardName: '', expiryDate: '', cvv: ''
    });
    closeCheckout();
  };

  if (step === 3) {
    return (
      <div className={`checkout-page ${display ? "active" : ""}`}>
        <button className="close-checkout" onClick={handleFinish}><X /></button>
        <div className="checkout-container">
          <div className="checkout-success">
            <div className="success-icon"><CheckCircle2 size={80} /></div>
            <h1 className="success-title">Order Placed Successfully!</h1>
            <p className="success-message">Thank you for your order. We'll send you a confirmation email shortly.</p>
            {orderResult && (
              <div className="success-details">
                <p><strong>Order Number:</strong> {orderResult.order_number}</p>
                <p><strong>Payment Method:</strong> {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                <p><strong>Total Amount:</strong> ${(orderResult.total || total).toFixed(2)}</p>
              </div>
            )}
            <button className="success-btn" onClick={handleFinish}>Continue Shopping</button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || cart.length === 0) {
    return (
      <div className={`checkout-page ${display ? "active" : ""}`}>
        <button className="close-checkout" onClick={closeCheckout}><X /></button>
        <div className="checkout-container">
          <div className="checkout-success">
            <h1 className="success-title">Nothing to checkout</h1>
            <p className="success-message">
              {!isAuthenticated ? 'Please login to checkout.' : 'Your cart is empty.'}
            </p>
            <button className="success-btn" onClick={closeCheckout}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`checkout-page ${display ? "active" : ""}`}>
      <button className="close-checkout" onClick={closeCheckout}><X /></button>
      <div className="checkout-container">
        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div><span>Shipping Info</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div><span>Payment</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div><span>Complete</span>
          </div>
        </div>

        <div className="checkout-content">
          <div className="checkout-form-section">
            {step === 1 && (
              <>
                <h2 className="section-title"><User size={24} /> Personal Information</h2>

                <div className="form-group">
                  <label>Full Name *</label>
                  <input type="text" name="fullName" value={formData.fullName}
                    onChange={handleInputChange} placeholder="John Doe"
                    className={errors.fullName ? 'error' : ''} />
                  {errors.fullName && <span className="error-msg">{errors.fullName}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input type="email" name="email" value={formData.email}
                      onChange={handleInputChange} placeholder="you@example.com"
                      className={errors.email ? 'error' : ''} />
                    {errors.email && <span className="error-msg">{errors.email}</span>}
                  </div>
                  <div className="form-group">
                    <label>Phone *</label>
                    <input type="tel" name="phone" value={formData.phone}
                      onChange={handleInputChange} placeholder="+212 6XX XXX XXX"
                      className={errors.phone ? 'error' : ''} />
                    {errors.phone && <span className="error-msg">{errors.phone}</span>}
                  </div>
                </div>

                <h2 className="section-title"><MapPin size={24} /> Shipping Address</h2>

                <div className="form-group">
                  <label>Street Address *</label>
                  <input type="text" name="address" value={formData.address}
                    onChange={handleInputChange} placeholder="123 Main St"
                    className={errors.address ? 'error' : ''} />
                  {errors.address && <span className="error-msg">{errors.address}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input type="text" name="city" value={formData.city}
                      onChange={handleInputChange} placeholder="Casablanca"
                      className={errors.city ? 'error' : ''} />
                    {errors.city && <span className="error-msg">{errors.city}</span>}
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input type="text" name="state" value={formData.state}
                      onChange={handleInputChange} placeholder="MA" />
                  </div>
                  <div className="form-group">
                    <label>ZIP Code *</label>
                    <input type="text" name="zipCode" value={formData.zipCode}
                      onChange={handleInputChange} placeholder="20000"
                      className={errors.zipCode ? 'error' : ''} />
                    {errors.zipCode && <span className="error-msg">{errors.zipCode}</span>}
                  </div>
                </div>

                <button className="continue-btn" onClick={handleContinueToPayment}>
                  Continue to Payment
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="section-title"><CreditCard size={24} /> Payment Method</h2>

                <div className="payment-methods">
                  <div className={`payment-option ${paymentMethod === 'online' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('online')}>
                    <CreditCard size={24} />
                    <div>
                      <h3>Online Payment</h3>
                      <p>Pay securely with credit/debit card</p>
                    </div>
                  </div>
                  <div className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('cod')}>
                    <Banknote size={24} />
                    <div>
                      <h3>Cash on Delivery</h3>
                      <p>Pay when you receive (+$2.99 fee)</p>
                    </div>
                  </div>
                </div>

                {paymentMethod === 'online' && (
                  <div className="card-details">
                    <div className="form-group">
                      <label>Card Number *</label>
                      <input type="text" name="cardNumber" value={formData.cardNumber}
                        onChange={handleInputChange} placeholder="1234 5678 9012 3456"
                        maxLength="19" className={errors.cardNumber ? 'error' : ''} />
                      {errors.cardNumber && <span className="error-msg">{errors.cardNumber}</span>}
                    </div>
                    <div className="form-group">
                      <label>Cardholder Name *</label>
                      <input type="text" name="cardName" value={formData.cardName}
                        onChange={handleInputChange} placeholder="John Doe"
                        className={errors.cardName ? 'error' : ''} />
                      {errors.cardName && <span className="error-msg">{errors.cardName}</span>}
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Expiry Date *</label>
                        <input type="text" name="expiryDate" value={formData.expiryDate}
                          onChange={handleInputChange} placeholder="MM/YY"
                          maxLength="5" className={errors.expiryDate ? 'error' : ''} />
                        {errors.expiryDate && <span className="error-msg">{errors.expiryDate}</span>}
                      </div>
                      <div className="form-group">
                        <label>CVV *</label>
                        <input type="text" name="cvv" value={formData.cvv}
                          onChange={handleInputChange} placeholder="123"
                          maxLength="4" className={errors.cvv ? 'error' : ''} />
                        {errors.cvv && <span className="error-msg">{errors.cvv}</span>}
                      </div>
                    </div>
                    <div className="secure-note">
                      <Lock size={16} />
                      <span>Your payment information is secure and encrypted</span>
                    </div>
                  </div>
                )}

                {errors.submit && (
                  <div className="error-message" style={{ color: 'red', marginTop: '1rem' }}>
                    {errors.submit}
                  </div>
                )}

                <div className="checkout-actions">
                  <button className="back-btn" onClick={() => setStep(1)} disabled={isSubmitting}>
                    Back to Shipping
                  </button>
                  <button className="place-order-btn" onClick={handlePlaceOrder} disabled={isSubmitting}>
                    {isSubmitting ? 'Placing Order...' : `Place Order - $${total.toFixed(2)}`}
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="order-summary">
            <h3 className="summary-title">Order Summary</h3>
            <div className="summary-items">
              {cart.map(item => (
                <div key={item.id} className="summary-item">
                  <div style={{ width: 60, height: 60, borderRadius: 8, background: 'var(--first-color-lighten)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem', overflow: 'hidden' }}>
                    {item.image
                      ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : '🥬'}
                  </div>
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="summary-calculations">
              <div className="calc-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="calc-row"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
              <div className="calc-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              {codFee > 0 && (
                <div className="calc-row cod-fee"><span>COD Fee</span><span>${codFee.toFixed(2)}</span></div>
              )}
              <div className="calc-divider"></div>
              <div className="calc-row total"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;