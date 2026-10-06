import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      setCart([]);
    }
  }, [isAuthenticated]);

  const refreshCart = async () => {
    try {
      setLoading(true);
      const res = await cartService.getCart();
      if (res.success) setCart(res.data || []);
    } catch {
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (productId, quantity = 1) => {
    const res = await cartService.addToCart(productId, quantity);
    if (res.success) setCart(res.data || []);
    return res;
  };

  const updateQuantity = async (productId, quantity) => {
    const res = await cartService.updateCartItem(productId, quantity);
    if (res.success) setCart(res.data || []);
    return res;
  };

  const removeItem = async (productId) => {
    const res = await cartService.removeFromCart(productId);
    if (res.success) setCart(res.data || []);
    return res;
  };

  const clearCart = async () => {
    const res = await cartService.clearCart();
    if (res.success) setCart([]);
    return res;
  };

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartCount,
        cartTotal,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};