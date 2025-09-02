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
import { useTrackOrder } from '../../../../hook/order/useOrderTracking';
import { toast } from 'react-toastify';

const OrderDetail = ({ order, setActiveComponent }) => {
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const { mutate: cancelOrder, isLoading: isCancelling } = useCancelOrder();

  console.log(order?.dtdcRefNumber,'orders')
  const { data: trackData, refetch: fetchTrackData, isLoading: isTracking } = useTrackOrder(order?.dtdcRefNumber || '');

  // Trigger DTDC API when status is SHIPPED or beyond
  useEffect(() => {
    if (['SHIPPED', 'IN_TRANSIT', 'DELIVERED'].includes(order?.status) && order?.dtdcRefNumber) {
      fetchTrackData();
    }
  }, [order?.status, order?.dtdcRefNumber, fetchTrackData]);

  const mapDtdcStatusToComponentStatus = (dtdcAction) => {
    const action = dtdcAction.toLowerCase();
    if (action.includes('delivered')) return 'DELIVERED';
    if (action.includes('in transit') || action.includes('out for delivery')) return 'IN_TRANSIT';
    return 'SHIPPED'; // Default for pickup-related statuses
  };

  const getStatusSteps = () => {
    const allSteps = [
      { id: 'PENDING', label: 'Pending', icon: faReceipt, description: 'Your order has been confirmed within 10 minutes', color: '#3498db' },
      { id: 'PLACED', label: 'Placed', icon: faReceipt, description: 'Your order has been confirmed', color: '#3498db' },
      { id: 'IN_PROCESSING', label: 'Processing', icon: faSpinner, description: 'Preparing your items', color: '#9b59b6' },
      { id: 'PACKED', label: 'Packed', icon: faTruck, description: 'Order has been packed', color: '#f39c12' },
      { id: 'SHIPPED', label: 'Shipped', icon: faHome, description: 'Order has been dispatched successfully', color: '#1abc9c' },
      { id: 'IN_TRANSIT', label: 'Out For Delivery', icon: faTruck, description: 'Order is out for delivery', color: '#e67e22' },
      { id: 'DELIVERED', label: 'Delivered', icon: faCheckCircle, description: 'Order has been delivered successfully', color: '#27ae60' },
      { id: 'CANCELLED', label: 'Cancelled', icon: faTimesCircle, description: 'Order was cancelled', color: '#e74c3c' },
    ];

    if (!order) return allSteps;

    const curStatusIdx = allSteps.findIndex((st) => st.id === order.status);

    if (order.status === 'CANCELLED') {
      return allSteps.map((step) => ({
        ...step,
        active: step.id === 'CANCELLED',
        completed: false,
        isCancelled: step.id === 'CANCELLED',
      }));
    }

    return allSteps
      .map((step, idx) => ({
        ...step,
        completed: idx < curStatusIdx,
        active: idx === curStatusIdx,
        future: idx > curStatusIdx,
        isCancelled: false,
      }))
      .filter((step) => step.id !== 'CANCELLED' || order.status === 'CANCELLED');
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
    const statusSteps = getStatusSteps();
    const currentStatus = statusSteps.find((step) => step.id === order.status);

    const statusColors = {
      PENDING: '#3498db',
      PLACED: '#3498db',
      IN_PROCESSING: '#9b59b6',
      PACKED: '#f39c12',
      SHIPPED: '#1abc9c',
      IN_TRANSIT: '#e67e22',
      DELIVERED: '#27ae60',
      CANCELLED: '#e74c3c',
    };

    const canCancel = !['SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'].includes(order.status);

    // Process DTDC tracking details
    const trackingDetails = trackData?.trackDetails?.map((detail) => ({
      ...detail,
      mappedStatus: mapDtdcStatusToComponentStatus(detail.strAction),
      formattedDate: `${detail.strActionDate.slice(0, 2)}-${detail.strActionDate.slice(2, 4)}-${detail.strActionDate.slice(4)} ${detail.strActionTime.slice(0, 2)}:${detail.strActionTime.slice(2)}`,
    })) || [];

    return (
      <div className="status-modal-overlay">
        <div className="status-modal">
          <div className="status-modal-header">
            <h3>Order #{order.orderId} Status</h3>
            <button onClick={() => setIsStatusModalOpen(false)} className="close-modal">
              &times;
            </button>
          </div>
          <div className="status-modal-body">
            <div className="current-status-summary">
              <div
                className="status-badge-large"
                style={{
                  backgroundColor: statusColors[order.status] || currentStatus?.color,
                  boxShadow: `0 0 10px ${statusColors[order.status] || currentStatus?.color}33`,
                }}
              >
                {currentStatus?.label || order.status}
              </div>
              <div className="status-details">
                <p className="status-description">
                  <FontAwesomeIcon icon={faInfoCircle} className="meta-icon" />
                  {currentStatus?.description}
                </p>
                <div className="status-meta">
                  <span>
                    <FontAwesomeIcon icon={faCalendarAlt} className="meta-icon" />
                    Ordered on: {new Date(order.orderTime).toLocaleDateString()}
                  </span>
                  {order.status === 'DELIVERED' && (
                    <span>
                      <FontAwesomeIcon icon={faCheckCircle} className="meta-icon" />
                      Delivered on: {trackData?.trackDetails?.find((d) => d.strAction.toLowerCase().includes('delivered'))?.strActionDate
                        ? `${trackData.trackDetails.find((d) => d.strAction.toLowerCase().includes('delivered')).strActionDate.slice(0, 2)}-${trackData.trackDetails.find((d) => d.strAction.toLowerCase().includes('delivered')).strActionDate.slice(2, 4)}-${trackData.trackDetails.find((d) => d.strAction.toLowerCase().includes('delivered')).strActionDate.slice(4)}`
                        : new Date().toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="status-timeline" data-current-status={order.status}>
              <div className="timeline-connector"></div>
              {statusSteps.map((step) => {
                const isCurrent = step.id === order.status;
                const isShippedOrBeyond = ['SHIPPED', 'IN_TRANSIT', 'DELIVERED'].includes(step.id) && ['SHIPPED', 'IN_TRANSIT', 'DELIVERED'].includes(order.status);
                return (
                  <React.Fragment key={step.id}>
                    <div
                      className={`status-step 
                      ${isCurrent ? 'current' : ''} 
                      ${step.completed ? 'completed' : ''} 
                      ${step.future ? 'future' : ''} 
                      ${step.isCancelled ? 'cancelled' : ''}`}
                    >
                      <div
                        className="step-icon-container"
                        style={{
                          borderColor: statusColors[step.id],
                          boxShadow: isCurrent ? `0 0 0 3px ${statusColors[step.id]}33` : 'none',
                        }}
                      >
                        {step.completed ? (
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="section-icon"
                            style={{ color: statusColors[step.id] }}
                          />
                        ) : step.isCancelled ? (
                          <FontAwesomeIcon
                            icon={faTimesCircle}
                            className="section-icon"
                            style={{ color: statusColors[step.id] }}
                          />
                        ) : isCurrent ? (
                          <FontAwesomeIcon
                            icon={step.icon}
                            className="section-icon"
                            spin={step.id === 'IN_PROCESSING'}
                            style={{ color: statusColors[step.id] }}
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={step.icon}
                            className="section-icon"
                            style={{
                              color: step.future ? '#ccc' : statusColors[step.id],
                            }}
                          />
                        )}
                      </div>
                      <div className="step-content">
                        <h4
                          className="step-title"
                          style={{
                            color: isCurrent ? statusColors[step.id] : 'inherit',
                          }}
                        >
                          {step.label}
                          {isCurrent && <span className="current-indicator">Current Status</span>}
                        </h4>
                        <p className="step-description">{step.description}</p>
                        {(isCurrent || step.completed) && (
                          <div className="step-updated">
                            <FontAwesomeIcon icon={faClock} className="meta-icon" />
                            {isCurrent ? 'Last updated: ' : 'Completed on: '}
                            {new Date().toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Insert DTDC tracking details after SHIPPED step */}
                    {step.id === 'SHIPPED' && isShippedOrBeyond && (
                      <div className="dtdc-tracking-details">
                        {isTracking ? (
                          <div className="tracking-loading">
                            <FontAwesomeIcon icon={faSpinner} spin className="meta-icon" />
                            Loading tracking details...
                          </div>
                        ) : trackingDetails.length > 0 ? (
                          trackingDetails.map((detail, idx) => (
                            <div key={idx} className="status-step tracking-substep">
                              <div
                                className="step-icon-container"
                                style={{
                                  borderColor: statusColors[detail.mappedStatus],
                                  boxShadow: detail.mappedStatus === order.status ? `0 0 0 3px ${statusColors[detail.mappedStatus]}33` : 'none',
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={detail.mappedStatus === 'DELIVERED' ? faCheckCircle : faTruck}
                                  className="section-icon"
                                  style={{ color: statusColors[detail.mappedStatus] }}
                                />
                              </div>
                              <div className="step-content">
                                <h4 className="step-title">{detail.strAction}</h4>
                                <p className="step-description">
                                  {detail.sTrRemarks || `At ${detail.strOrigin}`}
                                </p>
                                <div className="step-updated">
                                  <FontAwesomeIcon icon={faClock} className="meta-icon" />
                                  Updated on: {detail.formattedDate}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="tracking-empty">
                            <FontAwesomeIcon icon={faExclamationCircle} className="meta-icon" />
                            No tracking details available
                          </div>
                        )}
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {canCancel && (
              <div className="cancel-order-section">
                <button
                  className="cancel-order-btn"
                  onClick={handleCancelOrder}
                  disabled={isCancelling}
                >
                  {isCancelling ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin className="meta-icon" />
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

  const statusSteps = getStatusSteps();
  const currentStatus = statusSteps.find((step) => step.active || step.id === order.status);

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
              <span className="order-id"> {order.orderId}</span>
            </div>
            <div className="status-badge" style={{ backgroundColor: currentStatus?.color }}>
              {currentStatus?.label || order.status}
            </div>
          </div>
          <button className="view-status-btn" onClick={() => setIsStatusModalOpen(true)}>
            View all updates
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
              <div
                className={`order-items-list ${order.orderItems?.length > 2 ? 'scrollable-items' : ''}`}
              >
                {order.orderItems?.map((item) => (
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
          <div className="order-section">
            <h3 className="section-title">
              <FontAwesomeIcon icon={faTruck} className="section-icon" />
              Shipping Information
            </h3>
            <div className="shipping-content">
              <div className="info-card">
                <div className="address-details">
                  <div className="address-name">{order.customerName}</div>
                  <p className='address-line'>{order.address}</p>
                  <div className="address-phone">
                    <strong>Phone:</strong> {order.contact}
                  </div>
                </div>
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
                  <span className="product-count">{order.orderItems?.length || 0} items</span>
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