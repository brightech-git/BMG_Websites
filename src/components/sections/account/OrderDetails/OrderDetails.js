import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBox,
  faBoxOpen,
  faExclamationCircle,
  faSpinner,
  faImage,
  faAngleLeft,
  faReceipt,
  faCheckCircle,
  faTimesCircle,
  faTruck,
  faShoppingBag,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { formatCurrency } from '../../../../assets/utills/formatters';
import './OrderDetails.css';
import { Link } from 'react-router-dom';
import { useCancelOrder } from '../../../../hook/order/useOrderMutation';
import { useTrackOrderById } from '../../../../hook/order/useOrderTracking';
import { toast } from 'react-toastify';
import { useAdminAddress } from '../../../../hook/address/useAdminAddress';
import { useLocation } from 'react-router-dom/cjs/react-router-dom';

const OrderDetail = ({ order: initialOrder, setActiveComponent }) => {
  const location = useLocation();
  const { orderId } = location.state || {};

  const [order, setOrder] = useState(initialOrder || null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const { mutate: cancelOrder, isLoading: isCancelling } = useCancelOrder();
  const {
    data: trackData,
    refetch: fetchTrackData,
    isLoading: isTracking,
  } = useTrackOrderById(order?.orderId || orderId);

  const id = 2;
  const {
    data: adminAddress,
    isError,
    isLoading,
  } = useAdminAddress(id);

  // ✅ If only orderId is present (from PaymentSuccess), fetch full order
  useEffect(() => {
    if (!order && orderId) {
      fetchTrackData(orderId).then(() => {
        setOrder();
      });
    }
  }, [orderId, order]);

  // ✅ Track order when ID is ready
  useEffect(() => {
    if (order?.orderId || orderId) {
      fetchTrackData();
    }
  }, [order?.orderId, orderId, fetchTrackData]);

  const getStatusIcon = (status) => {
    const iconMap = {
      PLACED: faReceipt,
      IN_PROCESSING: faSpinner,
      PACKED: faBox,
      SHIPPED: faTruck,
      SHIPPING: faTruck,
      Booked: faTruck,
      OUT_FOR_DELIVERY: faTruck,
      IN_TRANSIT: faTruck,
      DELIVERED: faCheckCircle,
      DELIVERY_FAILED: faExclamationCircle,
      CANCELLED: faTimesCircle,
    };
    return iconMap[status] || faInfoCircle;
  };

  const getStatusLabel = (status) => {
    const labelMap = {
      PENDING: 'Order Pending',
      PLACED: 'Order Placed',
      IN_PROCESSING: 'Order Processing',
      PACKED: 'Order Packed',
      SHIPPED: 'Order Shipped',
      SHIPPING: 'Shipping',
      Booked: 'Booked for Delivery',
      OUT_FOR_DELIVERY: 'Out for Delivery',
      IN_TRANSIT: 'In Transit',
      DELIVERED: 'Delivered',
      DELIVERY_FAILED: 'Delivery Failed',
      CANCELLED: 'Cancelled',
    };
    return labelMap[status] || status;
  };

  const processTrackingHistory = () => {
    if (!trackData?.timeline || trackData.timeline.length === 0) {
      // Fallback to current_status if timeline is empty or undefined
      return [{
        label: getStatusLabel(trackData?.current_status || order.status),
        updated_at: order.orderTime,
        remarks: trackData?.current_status ? `Order is currently ${getStatusLabel(trackData.current_status).toLowerCase()}.` : 'No tracking details available.'
      }];
    }
    // Sort timeline by updated_at
    return trackData.timeline.sort((a, b) => new Date(a.updated_at) - new Date(b.updated_at));
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
    //console.log(trackData, 'raw-track-data');
    const currentStatus = trackData?.current_status || order.status;
    const trackingHistory = processTrackingHistory();
    const currentLabel = trackingHistory[trackingHistory.length - 1]?.label || getStatusLabel(currentStatus);
    //console.log(currentLabel, 'current-label')
    const canCancel = trackData?.canCancel ?? !['SHIPPED', 'SHIPPING', 'OUT_FOR_DELIVERY', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED', 'Booked'].includes(currentStatus);

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    };

    return (
      <div className="status-modal-overlay">
        <div className="status-modal">
          <div className="status-modal-header">
            <h3>Order    # {order.orderId}  Tracking</h3>
            <button onClick={() => setIsStatusModalOpen(false)} className="close-modal">
              &times;
            </button>
          </div>
          <div className="status-modal-body">
            {/* Current Status Banner */}
            <div className={`current-status-banner ${currentStatus === 'DELIVERED' ? 'delivered' : ''}`}>
              <div className="status-icons">
                <FontAwesomeIcon icon={(currentStatus)} />
              </div>
              <div className="status-infos">
                <h4>{currentLabel}</h4>
                <p>Order placed on {new Date(order.orderTime).toLocaleDateString('en-IN')}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="flipkart-timeline">
              {isTracking ? (
                <div className="timeline-loading">
                  <FontAwesomeIcon icon={faSpinner} spin /> Loading tracking details...
                </div>
              ) : (
                trackingHistory.map((step, index) => {
                  const isLast = index === trackingHistory.length - 1;
                  const isCurrent = index === trackingHistory.length - 1;
                  const isDelivered = currentStatus === 'DELIVERED' && isCurrent;

                  return (
                    <div key={`${step.label}-${index}`} className={`timeline-step ${isCurrent ? 'current' : 'completed'} ${isDelivered ? 'delivered' : ''}`}>
                      <div className="timeline-dot">
                        <FontAwesomeIcon
                          icon={currentStatus === 'CANCELLED' || currentStatus === 'DELIVERY_FAILED' ? getStatusIcon(currentStatus) : faCheckCircle}
                          className={`step-icon ${isCurrent ? 'pulse' : ''}`}
                        />
                      </div>
                      {!isLast && <div className="timeline-line"></div>}
                      <div className="timeline-content">
                        <div className="step-header">
                          <h5>{step.label}</h5>
                          <span className="step-time">{formatDate(step.updated_at)}</span>
                        </div>
                        {step.remarks && (
                          <div className="step-remarks-simple">
                            <p>{step.remarks}</p>
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
          <Link to="/products-page" className="order-shop-button">
            <FontAwesomeIcon icon={faShoppingBag} className="meta-icon" /> Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const currentStatus = trackData?.current_status || order.status;
  const currentLabel = trackData?.timeline?.length > 0 ? trackData.timeline[trackData.timeline.length - 1].label : getStatusLabel(currentStatus);
  const orderItems = order.orderItems || trackData?.items || [];
  //console.log(order, 'order-items')
  const admin = adminAddress

  // const formatAddress = (address) => {
  //   if (!address) return '';
  //   return [
  //     address.addressLine1,
  //     address.addressLine2,
  //     `${address.city}, ${address.state} - ${address.pincode}`,
  //     address.country
  //   ]
  //     .filter(Boolean) // remove undefined/empty parts
  //     .join(', ');
  // };




  return (
    <div className="account-container">
      <div className="order-content">
        {/* Order Header */}
        {/* <div className="order-header-simplified">
          <h1 className="order-detail-title">Order Details</h1>
          <button onClick={() => setActiveComponent('Orders')} className="back-btn-right">
            <FontAwesomeIcon icon={faAngleLeft} className="meta-icon" /> Back to Orders
          </button>
        </div> */}

        {/* Status Summary */}
        <div className={`status-summary-container ${currentStatus === 'DELIVERED' ? 'delivered' : ''}`}>
          <div className="status-summary-content">
            <div className="status-meta">
              <span className="order-id">{trackData?.order_id || order.orderId}</span>
            </div>
            <div className="status-badge-simple">{currentLabel}</div>
          </div>
          <button className="track-btn" onClick={() => setIsStatusModalOpen(true)}>
            Track Order
          </button>
        </div>

        {/* Order Sections */}
        <div className="order-sections-container">
          {/* Ordered Items */}
          <div className="order-section">
            <h3 className="order-section-title">
              <FontAwesomeIcon icon={faBox} className="section-icon" />
              Items in your order
            </h3>
            <div className="order-items-content">
              <div className={`order-items-list ${orderItems?.length > 2 ? 'scrollable-items' : ''}`}>
                {orderItems?.map((item) => (
                  <div key={item.id} className="order-item-compact">
                    <div className="item-image-compact">
                      {item.imagePath ? (
                        <img
                          src={
                            item.imagePath.startsWith('http')
                              ? item.imagePath
                              : `https://app.bmgjewellers.com${item.imagePath}`
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
                      <div className='item-info-compact'>
                        <h4 className="item-name-compact">{item.productName}</h4>
                        {item.weight && <p>Weight: {item.weight} </p> }
                      </div>
                      <p className="item-price-compact">{item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-section">
            <h3 className="order-section-title">
              <FontAwesomeIcon icon={faReceipt} className="section-icon" />
              Order Summary
            </h3>

            <div className="order-summary-content">
              <div className="order-summary-card">

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
                <div className="summary-row">
                  <span>Payment Stauts</span>
                  <span>{order.paymentStatus}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="order-section two-column-layout">
            <div className="shipping-content">
              {/* Left Side - Delivery From */}
              <div className="info-card">
                <h3 className="order-section-title">
                  <FontAwesomeIcon icon={faTruck} className="section-icon" />
                  Delivery From
                </h3>
                <div className="address-details">
                  {isLoading ? (
                    <p>Loading address details...</p>
                  ) : isError ? (
                    <p>Error loading address details.</p>
                  ) : adminAddress ? (
                    <>
                      <div className="address-name">{adminAddress.name}</div>
                      {adminAddress.addressLine1 && <p className="address-line">{adminAddress.addressLine1}</p>}
                      {adminAddress.addressLine2 && <p className="address-line">{adminAddress.addressLine2}</p>}
                      <p className="address-line">
                        {adminAddress.city}, {adminAddress.state} - {adminAddress.pincode}
                      </p>
                      <p className="address-line">{adminAddress.country}</p>
                      <div className="address-phone">
                        <strong>Phone:</strong> {adminAddress.phone}
                      </div>
                      {adminAddress.alternatePhone && (
                        <div className="address-phone">
                          <strong>Alt:</strong> {adminAddress.alternatePhone}
                        </div>
                      )}
                    </>
                  ) : (
                    <p>No address details available.</p>
                  )}
                </div>
              </div>
              {/* Right Side - Shipping To */}
              <div className="info-card">
                <h3 className="order-section-title">
                  <FontAwesomeIcon icon={faTruck} className="section-icon" />
                  Shipping To
                </h3>
                <div className="address-details">
                  <div className="address-name">{order.customerName}</div>
                  <p className="address-line">{order.address.addressLine}</p>
                  <p className="address-line">{order.address.locality}</p>
                  <p className="address-line">
                    {order.address.city}, {order.address.state} - {order.address.pincode}
                  </p>
                  {order.address.landmark && <p className="address-line">Landmark: {order.address.landmark}</p>}
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