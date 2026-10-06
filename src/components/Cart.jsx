import React, { useEffect } from "react";
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Cart.css";

const Cart = ({ display, closeCart, openCheckout }) => {
  const { cart, updateQuantity, removeItem, cartTotal, refreshCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (display && isAuthenticated) refreshCart();
  }, [display, isAuthenticated]);

  const subtotal = cartTotal;
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 4.99;
  const total = subtotal + tax + shipping;

  const handleUpdateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    await updateQuantity(productId, quantity);
  };

  const handleRemove = async (productId) => {
    await removeItem(productId);
  };

  return (
    <div className={`cart-container ${display ? "active" : ""}`}>
      <div className="cart-header">
        <div className="cart-header-left">
          <ShoppingBag size={24} className="cart-header-icon" />
          <h2 className="cart-header-title">Shopping Cart</h2>
          <span className="cart-item-count">
            {cart.length} item{cart.length !== 1 ? "s" : ""}
          </span>
        </div>
        <button onClick={closeCart} className="cart-close-btn"><X size={24} /></button>
      </div>

      <div className="cart-items">
        {!isAuthenticated ? (
          <div className="empty-cart">
            <ShoppingBag size={64} className="empty-cart-icon" />
            <p className="empty-cart-text">Please login to view your cart</p>
          </div>
        ) : cart.length === 0 ? (
          <div className="empty-cart">
            <ShoppingBag size={64} className="empty-cart-icon" />
            <p className="empty-cart-text">Your cart is empty</p>
            <button className="empty-cart-btn" onClick={closeCart}>Continue Shopping</button>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image" style={{
                background: "var(--first-color-lighten)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "2rem", overflow: 'hidden'
              }}>
                {item.image ? (
                  <img src={item.image} alt={item.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }} />
                ) : "🥬"}
              </div>

              <div className="cart-item-details">
                <h3 className="cart-item-name">{item.name}</h3>
                <span className="cart-item-category">{item.category}</span>
                <p className="cart-item-price">${item.price.toFixed(2)}/{item.unit}</p>
              </div>

              <div className="cart-item-actions">
                <div className="quantity-control">
                  <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    className="quantity-btn" disabled={item.quantity <= 1}>
                    <Minus size={20} />
                  </button>
                  <span className="cart-item-quantity">{item.quantity}</span>
                  <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    className="quantity-btn">
                    <Plus size={20} />
                  </button>
                </div>
                <p className="cart-item-total">${(item.price * item.quantity).toFixed(2)}</p>
                <button onClick={() => handleRemove(item.id)} className="cart-remove-btn">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isAuthenticated && cart.length > 0 && (
        <div className="cart-summary">
          <div className="summary-row">
            <span className="summary-label">Subtotal</span>
            <span className="summary-value">${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Tax (8%)</span>
            <span className="summary-value">${tax.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Shipping</span>
            <span className="summary-value">{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
          </div>
          {shipping > 0 && (
            <p className="free-shipping-note">Add ${(50 - subtotal).toFixed(2)} more for free shipping!</p>
          )}
          <div className="summary-divider" />
          <div className="summary-row">
            <span className="summary-total-label">Total</span>
            <span className="summary-total-value">${total.toFixed(2)}</span>
          </div>
          <button className="checkout-btn" onClick={openCheckout}>
            Proceed to Checkout <ArrowRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;