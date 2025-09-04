import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBox,
  faBoxOpen,
  faExclamationCircle,
  faSpinner,
  faImage,
  faAngleLeft,
  faCalendarAlt,
  faReceipt,
  faCheckCircle,
  faTimesCircle,
  faTruck,
  faHome,
  faClock,
  faInfoCircle,
  faShoppingBag,
} from '@fortawesome/free-solid-svg-icons';
import { formatCurrency } from '../../../../assets/utills/formatters';
import './OrderDetails.css';
import { Link } from 'react-router-dom';
import { useCancelOrder } from '../../../../hook/order/useOrderMutation';
import { useTrackOrderById } from '../../../../hook/order/useOrderTracking';
import { toast } from 'react-toastify';

const OrderDetail = ({ order, setActiveComponent }) => {
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const { mutate: cancelOrder, isLoading: isCancelling } = useCancelOrder();

  const { data: trackData, refetch: fetchTrackData, isLoading: isTracking } = useTrackOrderById(order?.orderId);

  // Trigger tracking API when order exists
  useEffect(() => {
    if (order?.orderId) {
      fetchTrackData();
    }
  }, [order?.orderId, fetchTrackData]);

  const getStatusIcon = (status) => {
    const iconMap = {
      'PENDING': faReceipt,
      'PLACED': faReceipt,
      'IN_PROCESSING': faSpinner,
      'PACKED': faBox,
      'SHIPPED': faTruck,
      'SHIPPING': faTruck,
      'Booked': faTruck,
      'OUT_FOR_DELIVERY': faTruck,
      'IN_TRANSIT': faTruck,
      'DELIVERED': faCheckCircle,
      'DELIVERY_FAILED': faExclamationCircle,
      'CANCELLED': faTimesCircle,
    };
    return iconMap[status] || faInfoCircle;
  };

  const getStatusLabel = (status) => {
    const labelMap = {
      'PENDING': 'Order Pending',
      'PLACED': 'Order Placed',
      'IN_PROCESSING': 'Order Processing',
      'PACKED': 'Order Packed',
      'SHIPPED': 'Order Shipped',
      'SHIPPING': 'Shipping',
      'Booked': 'Booked for Delivery',
      'OUT_FOR_DELIVERY': 'Out for Delivery',
      'IN_TRANSIT': 'In Transit',
      'DELIVERED': 'Delivered',
      'DELIVERY_FAILED': 'Delivery Failed',
      'CANCELLED': 'Cancelled',
    };
    return labelMap[status] || status;
  };

  const processTrackingHistory = () => {
    if (!trackData?.history) return [];

    // Group by status to remove duplicates but keep all meaningful remarks
    const statusGroups = {};

    trackData.history.forEach(entry => {
      const status = entry.status;
      if (!statusGroups[status]) {
        statusGroups[status] = {
          ...entry,
          remarks: []
        };
      }

      // Add meaningful remarks
      if (entry.remarks && entry.remarks.trim()) {
        let remark = entry.remarks.trim();

        // Clean up DTDC remarks
        if (remark.includes('DTDC update:')) {
          remark = remark.replace('DTDC update:', '').trim();
        }

        // Only add if it's meaningful (not empty)
        if (remark && !statusGroups[status].remarks.includes(remark)) {
          statusGroups[status].remarks.push(remark);
        }
      }
    });

    // Convert back to array and sort by timestamp
    return Object.values(statusGroups)
      .sort((a, b) => new Date(a.updated_at) - new Date(b.updated_at));
  };

  const handleCancelOrder = () => {
    const reason = window.prompt('Why do you want to cancel this order?');
    if (reason !== null) {
      const remarks = reason ? `Cancelled by user: ${reason}` : 'Cancelled by user';
      if (window.confirm(`Are you sure you want to cancel this order? Reason: ${remarks}`)) {
        cancelOrder(
          {
            orderId: order.orderId,
            newStatus: 'CANCELLED',
            remarks: remarks,
            paymentMode: order.paymentMode,
            paymentStatus: order.paymentStatus,
          },
          {
            onSuccess: () => {
              toast.success('Order cancelled successfully!');
              setIsStatusModalOpen(false);
              setActiveComponent('Orders');
            },
            onError: (error) => {
              toast.error(error.message || 'Failed to cancel order');
            },
          }
        );
      }
    }
  };

  const renderStatusModal = () => {
    const currentStatus = trackData?.current_status || order.status;
    const trackingHistory = processTrackingHistory();

    const canCancel = !['SHIPPED', 'SHIPPING', 'OUT_FOR_DELIVERY', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED', 'Booked'].includes(currentStatus);

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    };

    return (
      <div className="status-modal-overlay">
        <div className="status-modal">
          <div className="status-modal-header">
            <h3>Order #{order.orderId} Tracking</h3>
            <button onClick={() => setIsStatusModalOpen(false)} className="close-modal">
              &times;
            </button>
          </div>
          <div className="status-modal-body">

            {/* Current Status Banner */}
            <div className="current-status-banner">
              <div className="status-icon">
                <FontAwesomeIcon icon={getStatusIcon(currentStatus)} />
              </div>
              <div className="status-info">
                <h4>{getStatusLabel(currentStatus)}</h4>
                <p>Order placed on {new Date(order.orderTime).toLocaleDateString('en-IN')}</p>
              </div>
            </div>

            {/* Timeline - Only show completed statuses */}
            <div className="flipkart-timeline">
              {isTracking ? (
                <div className="timeline-loading">
                  <FontAwesomeIcon icon={faSpinner} spin /> Loading tracking details...
                </div>
              ) : (
                trackingHistory.map((step, index) => {
                  const isLast = index === trackingHistory.length - 1;
                  const isCurrent = step.status === currentStatus;

                  return (
                    <div key={`${step.status}-${index}`} className={`timeline-step ${isCurrent ? 'current' : 'completed'}`}>
                      <div className="timeline-dot">
                        <FontAwesomeIcon
                          icon={step.status === 'CANCELLED' || step.status === 'DELIVERY_FAILED' ? getStatusIcon(step.status) : faCheckCircle}
                          className={`step-icon ${isCurrent ? 'pulse' : ''}`}
                        />
                      </div>

                      {!isLast && <div className="timeline-line"></div>}

                      <div className="timeline-content">
                        <div className="step-header">
                          <h5>{getStatusLabel(step.status)}</h5>
                          <span className="step-time">{formatDate(step.updated_at)}</span>
                        </div>

                        {step.remarks && step.remarks.length > 0 && (
                          <div className="step-remarks-simple">
                            {step.remarks.map((remark, idx) => (
                              <p key={idx}>{remark}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {canCancel && (
              <div className="cancel-section">
                <button
                  className="cancel-btn"
                  onClick={handleCancelOrder}
                  disabled={isCancelling}
                >
                  {isCancelling ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin />
                      Cancelling...
                    </>
                  ) : (
                    'Cancel Order'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!order) {
    return (
      <div className="order-content">
        <div className="order-empty-state">
          <FontAwesomeIcon icon={faBoxOpen} size="5x" className="empty-icon" />
          <h3 className="empty-title">Order not found</h3>
          <p className="empty-message">We couldn't find details for this order.</p>
          <Link to="/shop-left" className="order-shop-button">
            <FontAwesomeIcon icon={faShoppingBag} className="meta-icon" /> Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const currentStatus = trackData?.current_status || order.status;
  const orderItems = trackData?.items || order.orderItems || [];

  return (
    <div className="account-container">
      <div className="order-content">
        {/* Order Header */}
        <div className="order-header-simplified">
          <h1 className="order-title">Order Details</h1>
          <button onClick={() => setActiveComponent('Orders')} className="back-btn-right">
            <FontAwesomeIcon icon={faAngleLeft} className="meta-icon" /> Back to Orders
          </button>
        </div>

        {/* Status Summary */}
        <div className="status-summary-container">
          <div className="status-summary-content">
            <div className="status-meta">
              <span className="order-id">{trackData?.order_id || order.orderId}</span>
            </div>
            <div className="status-badge-simple">
              {getStatusLabel(currentStatus)}
            </div>
          </div>
          <button className="track-btn" onClick={() => setIsStatusModalOpen(true)}>
            Track Order
          </button>
        </div>

        {/* Order Sections */}
        <div className="order-sections-container">
          {/* Ordered Items */}
          <div className="order-section">
            <h3 className="section-title">
              <FontAwesomeIcon icon={faBox} className="section-icon" />
              Items in your order
            </h3>
            <div className="order-items-content">
              <div className={`order-items-list ${orderItems?.length > 2 ? 'scrollable-items' : ''}`}>
                {orderItems?.map((item) => (
                  <div key={item.id} className="order-item-compact">
                    <div className="item-image-compact">
                      {item.image_path ? (
                        <img
                          src={
                            item.image_path.startsWith('http')
                              ? item.image_path
                              : `https://app.bmgjewellers.com${item.image_path}`
                          }
                          alt={item.productName}
                          className="item-img"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="image-placeholder">
                        <FontAwesomeIcon icon={faImage} size="2x" className="meta-icon" />
                      </div>
                    </div>
                    <div className="item-details-compact">
                      <h4 className="item-name-compact">{item.productName}</h4>
                      <p className="item-price-compact">{formatCurrency(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-section">
            <h3 className="section-title">
              <FontAwesomeIcon icon={faReceipt} className="section-icon" />
              Order Summary
            </h3>
            <div className="order-summary-content">
              <div className="order-summary-card">
                <div className="summary-header">
                  <span>Order Summary</span>
                  <span className="product-count">{orderItems?.length || 0} items</span>
                </div>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{order.shippingFee ? formatCurrency(order.shippingFee) : 'Free'}</span>
                </div>
                <div className="summary-row discount">
                  <span>Paid by</span>
                  <span>{order.paymentMode}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="order-section">
            <h3 className="section-title">
              <FontAwesomeIcon icon={faTruck} className="section-icon" />
              Shipping Information
            </h3>
            <div className="shipping-content">
              <div className="info-card">
                <div className="address-details">
                  <div className="address-name">{order.customerName}</div>
                  <p className="address-line">{order.address}</p>
                  <div className="address-phone">
                    <strong>Phone:</strong> {order.contact}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button onClick={() => setActiveComponent('Shop')} className="continue-shopping-btn">
          <FontAwesomeIcon icon={faShoppingBag} className="meta-icon" /> Continue Shopping
        </button>

        {isStatusModalOpen && renderStatusModal()}
      </div>
    </div>
  );
};

export default OrderDetail;