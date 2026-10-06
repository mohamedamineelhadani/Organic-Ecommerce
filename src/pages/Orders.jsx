import React, { useState, useEffect } from "react";
import { Package, ChevronDown, ChevronUp, ShoppingBag } from "lucide-react";
import { orderService } from "../services/orderService";
import { useAuth } from "../context/AuthContext";
import defaultImg from "../assets/images/default.png";
import "./Orders.css";

const Orders = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await orderService.getUserOrders();
        if (res.success) setOrders(res.data || []);
      } catch (err) {
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [isAuthenticated]);

  const toggleExpand = (id) =>
    setExpandedId(prev => (prev === id ? null : id));

  const statusColor = (status) => {
    const map = {
      pending: "#f59e0b",
      processing: "#3b82f6",
      shipped: "#8b5cf6",
      delivered: "#22c55e",
      cancelled: "#ef4444",
    };
    return map[status] || "#6b7280";
  };

  if (!isAuthenticated) {
    return (
      <section className="orders" id="orders">
        <div className="orders-container">
          <div className="orders-empty">
            <Package size={64} className="empty-cart-icon" />
            <h2 className="orders-empty-title">Please login to view orders</h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="orders" id="orders">
      <div className="orders-container">
        <h2 className="orders-title">My Orders</h2>

        {loading && <p className="orders-loading">Loading orders...</p>}
        {error && <p className="orders-error">Error: {error}</p>}

        {!loading && !error && orders.length === 0 && (
          <div className="orders-empty">
            <ShoppingBag size={64} className="empty-cart-icon" />
            <h3 className="orders-empty-title">No orders yet</h3>
            <p className="orders-empty-text">Start shopping to place your first order!</p>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header" onClick={() => toggleExpand(order.id)}>
                  <div className="order-header-left">
                    <div>
                      <p className="order-number">#{order.order_number}</p>
                      <p className="order-date">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="order-header-right">
                    <span
                      className="order-status"
                      style={{
                        background: `${statusColor(order.status)}20`,
                        color: statusColor(order.status),
                      }}
                    >
                      {order.status}
                    </span>
                    <span className="order-total">${parseFloat(order.total).toFixed(2)}</span>
                    {expandedId === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {expandedId === order.id && (
                  <div className="order-body">
                    <div className="order-items">
                      {(order.items || []).map((item) => (
                        <div key={item.id} className="order-item">
                          <div className="order-item-image">
                            {item.image
                              ? <img src={item.image} alt={item.product_name} />
                              : <img src={defaultImg} alt={item.product_name} />}
                          </div>
                          <div className="order-item-info">
                            <h4>{item.product_name}</h4>
                            <p>Qty: {item.quantity} × ${parseFloat(item.price).toFixed(2)} / {item.unit}</p>
                          </div>
                          <span className="order-item-subtotal">
                            ${parseFloat(item.subtotal).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="order-info">
                      <div className="order-info-block">
                        <h5>Shipping Address</h5>
                        <p>{order.full_name}</p>
                        <p>{order.shipping_address}</p>
                        <p>{order.city} {order.state} {order.zip_code}</p>
                        <p>{order.phone}</p>
                      </div>

                      <div className="order-info-block">
                        <h5>Payment</h5>
                        <p>{order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                        <p>Tax: ${parseFloat(order.tax).toFixed(2)}</p>
                        <p>Shipping: ${parseFloat(order.shipping).toFixed(2)}</p>
                        {parseFloat(order.cod_fee) > 0 && (
                          <p>COD Fee: ${parseFloat(order.cod_fee).toFixed(2)}</p>
                        )}
                        <p className="order-info-total">
                          <strong>Total: ${parseFloat(order.total).toFixed(2)}</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Orders;