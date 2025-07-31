import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useOrderHistory } from "../../../../hook/order/useOrderHistoryQuery";
import { formatCurrency } from "../../../../assets/utills/formatters";
import AccountSideBar from "../AccountSidebar/AccountSideBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faBoxOpen,
  faExclamationCircle,
  faSpinner,
  faImage,
  faAngleLeft,
  faChevronDown,
  faChevronUp,
  faShoppingBag,
  faUndo,
  faCalendarAlt,
  faReceipt,
  faCheckCircle,
  faTimesCircle,
  faTruck,
  faHome,
  faClock,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
import "./OrderDetails.css";

const getFirstImageUrl = (imagePath) => {
  if (!imagePath) return null;
  let cleaned = imagePath.trim();
  cleaned = cleaned.replace(/^\[+|]+$/g, "");
  const paths = cleaned.split(/["',]+/).filter((p) => p.startsWith("/uploads"));
  if (paths.length === 0) return null;
  return `https://app.bmgjewellers.com${paths[0]}`;
};

const OrderDetailsPage = () => {
  const history = useHistory();
  const { orderId } = useParams();
  const {
    data: orderHistory,
    isLoading,
    error,
  } = useOrderHistory({ page: 1, size: 100 });
  const [order, setOrder] = useState(null);
  const [isStatusExpanded, setIsStatusExpanded] = useState(false);

  useEffect(() => {
    if (orderHistory && Array.isArray(orderHistory)) {
      setOrder(orderHistory.find((order) => order.orderId === orderId));
    }
  }, [orderHistory, orderId]);

  const toggleStatus = () => setIsStatusExpanded((v) => !v);

  const getStatusSteps = () => {
    const allSteps = [
      {
        id: "PLACED",
        label: "Order Placed",
        icon: faReceipt,
        description: "Your order was received",
        color: "#3498db",
      },
      {
        id: "PROCESSING",
        label: "Processing",
        icon: faSpinner,
        description: "Preparing your items",
        color: "#3498db",
      },
      {
        id: "PACKED",
        label: "Packed",
        icon: faBox,
        description: "Order packed and ready",
        color: "#3498db",
      },
      {
        id: "SHIPPED",
        label: "Shipped",
        icon: faTruck,
        description: "Shipped by seller/courier",
        color: "#3498db",
      },
      {
        id: "OUT_FOR_DELIVERY",
        label: "Out for Delivery",
        icon: faTruck,
        description: "Courier is almost there",
        color: "#3498db",
      },
      {
        id: "DELIVERED",
        label: "Delivered",
        icon: faHome,
        description: "Order delivered",
        color: "#2ecc71",
      },
      {
        id: "CANCELLED",
        label: "Cancelled",
        icon: faTimesCircle,
        description: "Order was cancelled",
        color: "#e74c3c",
      },
    ];

    if (!order) return allSteps;

    const curStatusIdx = allSteps.findIndex((st) => st.id === order.status);

    if (order.status === "CANCELLED") {
      return allSteps.map((step) => ({
        ...step,
        active: step.id === "CANCELLED",
        completed: false,
        isCancelled: step.id === "CANCELLED",
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
      .filter(
        (step) => step.id !== "CANCELLED" || order.status === "CANCELLED"
      );
  };

  if (isLoading) {
    return (
      <div className="account-container">
        <AccountSideBar />
        <div className="order-content">
          <div className="loading-container">
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              size="2x"
              className="text-primary"
            />
            <p>Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="account-container">
        <AccountSideBar />
        <div className="order-content">
          <div className="error-container">
            <FontAwesomeIcon
              icon={faExclamationCircle}
              size="3x"
              className="text-danger"
            />
            <h3>Order not found</h3>
            <p>
              We couldn't find details for this order. Please check your order
              ID.
            </p>
            <div className="button-group">
              <button
                onClick={() => history.push("/orders")}
                className="btn-back"
              >
                <FontAwesomeIcon icon={faAngleLeft} /> Back to Orders
              </button>
              <button
                onClick={() => window.location.reload()}
                className="btn-retry"
              >
                <FontAwesomeIcon icon={faUndo} /> Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="account-container">
        <AccountSideBar />
        <div className="order-content">
          <div className="order-empty-state">
            <FontAwesomeIcon
              icon={faBoxOpen}
              size="5x"
              className="text-muted mb-3"
            />
            <h3 className="empty-title">Order not found</h3>
            <p className="empty-message">
              We couldn't find details for this order.
            </p>
            <button
              className="order-shop-button"
              onClick={() => history.push("/products")}
            >
              <FontAwesomeIcon icon={faShoppingBag} className="mr-2" /> Continue
              Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusSteps = getStatusSteps();
  const curStatus = statusSteps.find(
    (step) => step.active || step.id === order.status
  );

  return (
    <div className="account-container">
      <AccountSideBar />
      <div className="order-content">
        {/* Order Header */}
        <div className="order-header">
          <button onClick={() => history.push("/orders")} className="back-btn">
            <FontAwesomeIcon icon={faAngleLeft} /> Back to Orders
          </button>
          <h1 className="order-title">Order Details</h1>
          <div className="order-meta">
            <span className="meta-item">
              <strong>Order #</strong>
              {order.orderId}
            </span>
            <span className="meta-item">
              <FontAwesomeIcon icon={faCalendarAlt} className="meta-icon" />
              {new Date(order.orderTime).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="meta-item">
              <FontAwesomeIcon icon={faCreditCard} className="meta-icon" />
              {order.paymentMethod || "Credit/Debit Card"}
            </span>
            <span className="meta-item total-amount">
              <strong>Total: </strong>
              {formatCurrency(order.totalAmount)}
            </span>
          </div>
        </div>

        {/* Status Tracker */}
        <div className={`status-tracker-container ${isStatusExpanded ? "expanded" : ""}`}>
          <div className="status-tracker-header" onClick={toggleStatus}>
            <div className="status-summary">
              <div
                className={`status-badge ${order.status.toLowerCase().replace(/\s/g, "-")}`}
                style={{ backgroundColor: curStatus?.color }}
              >
                {curStatus?.label || order.status}
              </div>
              {curStatus?.description && (
                <p className="status-description">{curStatus.description}</p>
              )}
            </div>
            <FontAwesomeIcon
              icon={isStatusExpanded ? faChevronUp : faChevronDown}
              className="status-toggle-icon"
            />
          </div>

          {isStatusExpanded && (
            <div className="status-steps">
              {statusSteps.map((step) => (
                <div
                  key={step.id}
                  className={`
                    status-step 
                    ${step.active ? "active" : ""} 
                    ${step.completed ? "completed" : ""} 
                    ${step.future ? "future" : ""} 
                    ${step.isCancelled ? "cancelled" : ""}
                  `}
                >
                  <div className="step-icon-container">
                    {step.completed ? (
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="step-icon completed-icon"
                      />
                    ) : step.isCancelled ? (
                      <FontAwesomeIcon
                        icon={faTimesCircle}
                        className="step-icon cancelled-icon"
                      />
                    ) : step.active ? (
                      <FontAwesomeIcon
                        icon={step.icon}
                        className="step-icon active-icon"
                        spin={step.id === "PROCESSING"}
                      />
                    ) : (
                      <FontAwesomeIcon icon={step.icon} className="step-icon" />
                    )}
                  </div>
                  <div className="step-content">
                    <h4 className="step-title">{step.label}</h4>
                    <p className="step-description">{step.description}</p>
                    {step.active && order.statusUpdatedAt && (
                      <div className="step-updated">
                        <FontAwesomeIcon icon={faClock} className="mr-2" />
                        Updated on{" "}
                        {new Date(order.statusUpdatedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Sections */}
        <div className="order-sections-container">
          {/* Ordered Items */}
          <div className="order-section">
            <h3 className="section-title">
              <FontAwesomeIcon icon={faBox} className="section-icon" />
              Items in your order
            </h3>
            <div className="order-items-list">
              {order.orderItems?.map((item) => (
                <div key={item.sno} className="order-item-detail">
                  <div className="item-image">
                    {item.image_path ? (
                      <img
                        src={getFirstImageUrl(item.image_path)}
                        alt={item.productName}
                        className="item-img"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextElementSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div className="image-placeholder">
                      <FontAwesomeIcon
                        icon={faImage}
                        size="2x"
                        className="placeholder-icon"
                      />
                    </div>
                  </div>
                  <div className="item-details">
                    <h4 className="item-name">{item.productName}</h4>
                    <div className="item-meta">
                      <span className="item-price">
                        {formatCurrency(item.price)}
                      </span>
                      <span className="item-quantity">Qty: {item.quantity}</span>
                      <span className="item-subtotal">
                        Subtotal: {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                    {item.color && (
                      <div className="item-attribute">
                        <strong>Color:</strong> {item.color}
                      </div>
                    )}
                    {item.size && (
                      <div className="item-attribute">
                        <strong>Size:</strong> {item.size}
                      </div>
                    )}
                    {item.seller && (
                      <div className="item-attribute">
                        <strong>Seller:</strong> {item.seller}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-section">
            <h3 className="section-title">
              <FontAwesomeIcon icon={faReceipt} className="section-icon" />
              Order Summary
            </h3>
            <div className="order-summary-card">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subTotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="summary-row discount">
                  <span>Discount</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Shipping</span>
                <span>
                  {order.shippingFee ? formatCurrency(order.shippingFee) : "FREE"}
                </span>
              </div>
              {order.tax ? (
                <div className="summary-row">
                  <span>Tax</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
              ) : null}
              <div className="summary-row total">
                <span>Total</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="order-section">
            <h3 className="section-title">
              <FontAwesomeIcon icon={faTruck} className="section-icon" />
              Shipping Information
            </h3>
            <div className="info-card">
              <div className="address-details">
                <div className="address-name">
                  <strong>{order.shippingAddress?.name}</strong>
                </div>
                <div className="address-street">{order.shippingAddress?.street}</div>
                <div className="address-city">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                  {order.shippingAddress?.zipCode}
                </div>
                <div className="address-country">{order.shippingAddress?.country}</div>
                <div className="address-phone">
                  <strong>Phone:</strong> {order.shippingAddress?.phone}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="order-section">
            <h3 className="section-title">
              <FontAwesomeIcon icon={faCreditCard} className="section-icon" />
              Payment Method
            </h3>
            <div className="info-card">
              <div className="payment-method">
                <FontAwesomeIcon icon={faCreditCard} className="payment-icon" />
                <span>{order.paymentMethod || "Credit/Debit Card"}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => history.push("/shop-left")}
          className="continue-shopping-btn"
        >
          <FontAwesomeIcon icon={faShoppingBag} /> Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderDetailsPage;