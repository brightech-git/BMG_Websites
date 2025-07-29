import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  FiChevronLeft, FiPackage, FiTruck, FiCheckCircle, 
  FiClock, FiX, FiPrinter, FiMessageSquare, FiRotateCw
} from 'react-icons/fi';
import './OrderDetails.css';

const OrderDetails = () => {
  const { orderId } = useParams();
  
  // Mock order data - in a real app, you'd fetch this based on orderId
  const order = {
    id: orderId || '#3258',
    date: '12 Jun 2023',
    status: 'Delivered',
    items: [
      { id: 'P1001', name: 'Wireless Earbuds', price: 89.99, quantity: 1, image: 'https://via.placeholder.com/80' },
      { id: 'P1002', name: 'Phone Case', price: 19.99, quantity: 2, image: 'https://via.placeholder.com/80' }
    ],
    shippingAddress: {
      name: 'John Benjamin',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States',
      phone: '(123) 456-7890'
    },
    paymentMethod: 'Visa ending in 4242',
    subtotal: 129.97,
    shipping: 5.99,
    tax: 13.50,
    total: 149.46,
    trackingNumber: 'UPS-1Z9999999999999999',
    trackingHistory: [
      { status: 'Order Placed', date: 'Jun 12, 2023 10:30 AM', completed: true },
      { status: 'Processing', date: 'Jun 12, 2023 2:45 PM', completed: true },
      { status: 'Shipped', date: 'Jun 13, 2023 9:15 AM', completed: true },
      { status: 'Out for Delivery', date: 'Jun 15, 2023 8:00 AM', completed: true },
      { status: 'Delivered', date: 'Jun 15, 2023 3:30 PM', completed: true }
    ]
  };

  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'delivered': return <FiCheckCircle className="text-green-500" />;
      case 'shipped': return <FiTruck className="text-blue-500" />;
      case 'processing': return <FiClock className="text-amber-500" />;
      case 'cancelled': return <FiX className="text-red-500" />;
      default: return <FiPackage className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-amber-100 text-amber-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="order-details-container">
      <div className="order-header">
        <Link to="/account/orders" className="back-link">
          <FiChevronLeft className="mr-1" />
          Back to Orders
        </Link>
        <h1>Order Details</h1>
      </div>

      <div className="order-summary">
        <div className="order-meta">
          <div className="meta-item">
            <span className="meta-label">Order Number:</span>
            <span className="meta-value">{order.id}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Order Date:</span>
            <span className="meta-value">{order.date}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Status:</span>
            <span className={`status-badge ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              {order.status}
            </span>
          </div>
        </div>

        <div className="order-actions">
          <button className="action-btn print">
            <FiPrinter className="mr-2" />
            Print Invoice
          </button>
          <button className="action-btn support">
            <FiMessageSquare className="mr-2" />
            Contact Support
          </button>
        </div>
      </div>

      <div className="order-content">
        <div className="order-section">
          <h2 className="section-title">
            <FiPackage className="mr-2" />
            Order Items
          </h2>
          
          <div className="order-items">
            {order.items.map(item => (
              <div key={item.id} className="order-item">
                <img src={item.image} alt={item.name} className="item-image" />
                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-price">${item.price.toFixed(2)} x {item.quantity}</p>
                </div>
                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="order-section">
          <h2 className="section-title">
            <FiTruck className="mr-2" />
            Shipping Information
          </h2>
          
          <div className="shipping-info">
            <div className="shipping-address">
              <h3 className="address-title">Shipping Address</h3>
              <p>{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
              <p>{order.shippingAddress.country}</p>
              <p>Phone: {order.shippingAddress.phone}</p>
            </div>
            
            {order.trackingNumber && (
              <div className="tracking-info">
                <h3 className="tracking-title">Tracking Information</h3>
                <p className="tracking-number">
                  <span>Tracking Number:</span>
                  <strong>{order.trackingNumber}</strong>
                </p>
                <button className="track-btn">
                  <FiTruck className="mr-2" />
                  Track Package
                </button>
              </div>
            )}
          </div>
        </div>

        {order.trackingNumber && (
          <div className="order-section">
            <h2 className="section-title">Order Tracking</h2>
            
            <div className="tracking-progress">
              {order.trackingHistory.map((step, index) => (
                <div key={index} className={`tracking-step ${step.completed ? 'completed' : ''}`}>
                  <div className="step-icon">
                    {step.completed ? (
                      <FiCheckCircle className="text-green-500" />
                    ) : (
                      <div className="step-number">{index + 1}</div>
                    )}
                  </div>
                  <div className="step-details">
                    <h3 className="step-status">{step.status}</h3>
                    {step.date ? (
                      <p className="step-date">{step.date}</p>
                    ) : (
                      <p className="step-pending">Pending</p>
                    )}
                  </div>
                  {index < order.trackingHistory.length - 1 && (
                    <div className="step-connector"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="order-section">
          <h2 className="section-title">Payment Information</h2>
          
          <div className="payment-info">
            <div className="payment-method">
              <h3>Payment Method</h3>
              <p>{order.paymentMethod}</p>
            </div>
            
            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal ({order.items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping</span>
                <span>${order.shipping.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="total-row grand-total">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="order-footer">
        <button className="reorder-btn">
          <FiRotateCw className="mr-2" />
          Reorder All Items
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;