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
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./OrderDetails.css";

const OrderDetailsPage = () => {
  const history = useHistory();
  const { orderId } = useParams();
  const {
    data: orderHistory,
    isLoading,
    error,
  } = useOrderHistory({ page: 1, size: 100 });
  const [order, setOrder] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  useEffect(() => {
    if (orderHistory && Array.isArray(orderHistory)) {
      const foundOrder = orderHistory.find(
        (order) => order.orderId === orderId
      );
      if (foundOrder) {
        // Use the status directly from the API response
        setOrder({
          ...foundOrder,
          subTotal: foundOrder.totalAmount,
          totalAmount: foundOrder.totalAmount,
        });
      }
    }
  }, [orderHistory, orderId]);

  const getStatusSteps = () => {
    const allSteps = [
      {
        id: "PENDING",
        label: "Pending",
        icon: faReceipt,
        description: "Your order has been confirmed",
        color: "#3498db",
      },
      {
        id: "PROCESSING",
        label: "Processing",
        icon: faSpinner,
        description: "Preparing your items",
        color: "#9b59b6", // Changed to purple for better distinction
      },
      {
        id: "SHIPPED",
        label: "Shipped",
        icon: faTruck,
        description: "Order has been shipped",
        color: "#f39c12", // Changed to orange
      },
      {
        id: "DELIVERED",
        label: "Delivered",
        icon: faHome,
        description: "Order delivered successfully",
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

 const renderStatusModal = () => {
  const statusSteps = getStatusSteps();
  const currentStatus = statusSteps.find(
    (step) => step.id === order.status // Directly compare with order.status
  );

    // Status color mapping for better visual distinction
    const statusColors = {
      PENDING: "#3498db", // Blue for pending
      PROCESSING: "#9b59b6", // Purple for processing
      SHIPPED: "#f39c12", // Orange for shipped
      DELIVERED: "#2ecc71", // Green for delivered
      CANCELLED: "#e74c3c", // Red for cancelled
    };

    return (
      <div className="status-modal-overlay">
        <div className="status-modal">
          <div className="status-modal-header">
            <h3>Order #{order.orderId} Status</h3>
            <button
              onClick={() => setIsStatusModalOpen(false)}
              className="close-modal"
            >
              &times;
            </button>
          </div>
          <div className="status-modal-body">
            <div className="current-status-summary">
              <div
                className="status-badge-large"
                style={{
                  backgroundColor:
                    statusColors[order.status] || currentStatus?.color,
                  boxShadow: `0 0 10px ${
                    statusColors[order.status] || currentStatus?.color
                  }33`,
                }}
              >
                {currentStatus?.label || order.status}
              </div>
              <div className="status-details">
                <p className="status-description">
                  <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                  {currentStatus?.description}
                </p>
                <div className="status-meta">
                  <span>
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                    Ordered on: {new Date(order.orderTime).toLocaleDateString()}
                  </span>
                  {order.status === "DELIVERED" && (
                    <span>
                      <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                      Delivered on: {new Date().toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="status-timeline">
              <div
                className="timeline-connector"
                style={{
                  background: `linear-gradient(to bottom, 
                ${statusColors.PENDING} 0%, 
                ${
                  order.status === "PROCESSING"
                    ? statusColors.PROCESSING
                    : order.status === "SHIPPED"
                    ? statusColors.SHIPPED
                    : order.status === "DELIVERED"
                    ? statusColors.DELIVERED
                    : statusColors.PENDING
                } 100%)`,
                }}
              ></div>

              {statusSteps.map((step) => {
                const isCurrent = step.id === order.status;
                return (
                  <div
                    key={step.id}
                    className={`status-step 
                    ${isCurrent ? "current" : ""} 
                    ${step.completed ? "completed" : ""} 
                    ${step.future ? "future" : ""} 
                    ${step.isCancelled ? "cancelled" : ""}`}
                  >
                    <div
                      className="step-icon-container"
                      style={{
                        borderColor: statusColors[step.id],
                        boxShadow: isCurrent
                          ? `0 0 0 3px ${statusColors[step.id]}33`
                          : "none",
                      }}
                    >
                      {step.completed ? (
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className="step-icon completed-icon"
                          style={{ color: statusColors[step.id] }}
                        />
                      ) : step.isCancelled ? (
                        <FontAwesomeIcon
                          icon={faTimesCircle}
                          className="step-icon cancelled-icon"
                          style={{ color: statusColors[step.id] }}
                        />
                      ) : isCurrent ? (
                        <FontAwesomeIcon
                          icon={step.icon}
                          className="step-icon current-icon"
                          spin={step.id === "PROCESSING"}
                          style={{ color: statusColors[step.id] }}
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={step.icon}
                          className="step-icon"
                          style={{
                            color: step.future ? "#ccc" : statusColors[step.id],
                          }}
                        />
                      )}
                    </div>
                    <div className="step-content">
                      <h4
                        className="step-title"
                        style={{
                          color: isCurrent ? statusColors[step.id] : "inherit",
                        }}
                      >
                        {step.label}
                        {isCurrent && (
                          <span className="current-indicator">
                            Current Status
                          </span>
                        )}
                      </h4>
                      <p className="step-description">{step.description}</p>
                      {(isCurrent || step.completed) && (
                        <div className="step-updated">
                          <FontAwesomeIcon icon={faClock} className="mr-2" />
                          {isCurrent ? "Last updated: " : "Completed on: "}
                          {new Date().toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
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
  const currentStatus = statusSteps.find(
    (step) => step.active || step.id === order.status
  );

  return (
    <div className="account-container">
      <AccountSideBar />
      <div className="order-content">
        {/* Order Header */}
        {/* Order Header */}
        <div className="order-header-simplified">
          <h1 className="order-title">Order Details</h1>
          <button
            onClick={() => history.push("/orders")}
            className="back-btn-right"
          >
            <FontAwesomeIcon icon={faAngleLeft} /> Back to Orders
          </button>
        </div>

        {/* Status Summary */}
        {/* Status Summary */}
        <div className="status-summary-container">
          <div className="status-summary-content">
            <div className="status-meta">
              <span className="order-id">Order #{order.orderId}</span>
              <span className="order-date">
                <FontAwesomeIcon icon={faCalendarAlt} className="meta-icon" />
                {new Date(order.orderTime).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="status-info">
              <div
                className="status-badge"
                style={{ backgroundColor: currentStatus?.color }}
              >
                {currentStatus?.label || order.status}
              </div>
            </div>
          </div>
          <button
            className="view-status-btn"
            onClick={() => setIsStatusModalOpen(true)}
          >
            View all updates
          </button>
        </div>

        {/* Order Sections */}
        <div className="order-sections-container">
          {/* Ordered Items */}
          {/* Ordered Items */}
          <div className="order-section">
            <h3 className="section-title">
              <FontAwesomeIcon icon={faBox} className="section-icon" />
              Items in your order
            </h3>
            <div
              className={`order-items-list ${
                order.orderItems?.length > 2 ? "scrollable-items" : ""
              }`}
              style={{
                maxHeight: order.orderItems?.length > 2 ? "400px" : "auto",
                overflowY: order.orderItems?.length > 2 ? "auto" : "visible",
              }}
            >
              {order.orderItems?.map((item) => (
                <div key={item.id} className="order-item-detail">
                  <div className="item-image">
                    {item.image_path ? (
                      <img
                        src={
                          item.image_path.startsWith("http")
                            ? item.image_path
                            : `https://app.bmgjewellers.com${item.image_path}`
                        }
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
                      <span className="item-quantity">
                        Qty: {item.quantity}
                      </span>
                      <span className="item-subtotal">
                        Subtotal: {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                    {item.tagno && (
                      <div className="item-attribute">
                        <strong>Tag No:</strong> {item.tagno}
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
             
              <div className="summary-row">
                <span>Shipping</span>
                <span>
                  {order.shippingFee
                    ? formatCurrency(order.shippingFee)
                    : 50}
                </span>
              </div>
               <div className="summary-row discount">
                <span>Discount</span>
                <span>-{order.shippingFee
                    ? formatCurrency(order.discount)
                    : 50}</span>
              </div>
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
                  <strong>{order.customerName}</strong>
                </div>
                <div className="address-street">
                  {order.address.split(",")[0]}
                </div>
                <div className="address-city">
                  {order.address.split(",").slice(1, -2).join(",")}
                </div>
                <div className="address-country">
                  {order.address.split(",").slice(-1)[0]}
                </div>
                <div className="address-phone">
                  <strong>Phone:</strong> {order.contact}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          {/* <div className="order-section">
            <h3 className="section-title">
              <FontAwesomeIcon icon={faCreditCard} className="section-icon" />
              Payment Method
            </h3>
            <div className="info-card">
              <div className="payment-method">
                <FontAwesomeIcon icon={faCreditCard} className="payment-icon" />
                <span>{order.paymentMode || "Online Payment"}</span>
              </div>
              <div className="payment-status">
                <strong>Status:</strong> {order.paymentStatus || "Paid"}
              </div>
            </div>
          </div> */}
        </div>

        <button
          onClick={() => history.push("/shop-left")}
          className="continue-shopping-btn"
        >
          <FontAwesomeIcon icon={faShoppingBag} /> Continue Shopping
        </button>
      </div>

      {/* Status Modal */}
      {isStatusModalOpen && renderStatusModal()}
    </div>
  );
};

export default OrderDetailsPage;
