import React, { useState, useCallback, useMemo } from "react";
import classNames from "classnames";
import { useOrderHistory } from "../../../../hook/order/useOrderHistoryQuery";
import { formatCurrency } from "../../../../assets/utills/formatters";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faBoxOpen,
  faExclamationCircle,
  faSpinner,
  faAngleLeft,
  faAngleRight,
  faShoppingBag,
  faUndo,
  faCalendarAlt,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import "./OrderStyles.css";

// Util to get the image URL from different formats
const getFirstImageUrl = (imagePath) => {
  if (!imagePath) return "https://via.placeholder.com/150";
  if (imagePath.startsWith("http")) return imagePath;

  try {
    const parsed = JSON.parse(imagePath);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return `https://app.bmgjewellers.com${parsed[0]}`;
    }
  } catch (e) {
    const cleaned = imagePath.replace(/\[|\]/g, "");
    const parts = cleaned.split(/["',\s]+/).filter((p) => p.startsWith("/uploads"));
    if (parts.length > 0) {
      return `https://app.bmgjewellers.com${parts[0]}`;
    }
  }

  return "https://via.placeholder.com/150";
};

// Mobile Order Card
const MobileOrderCard = ({ order, onClick }) => {
  const imageUrl = useMemo(() => getFirstImageUrl(order.orderItems?.[0]?.image_path), [order]);
  return (
    <div
      className="order-card-mobile"
      onClick={() => onClick(order)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => e.key === "Enter" && onClick(order)}
      aria-label={`View order ${order.orderId || order.id}`}
    >
      <div className="order-card-header">
        <span className="order-id-mobile">
          <FontAwesomeIcon icon={faReceipt} /> #{order.orderId || order.id}
        </span>
        <span
          className={classNames(
            "order-status-mobile",
            order.status?.toLowerCase().replace(/\s/g, "-")
          )}
        >
          {order.status}
        </span>
      </div>
      <div className="order-product-info-mobile">
        <div className="order-product-image-mobile">
          <img src={imageUrl} alt={order.orderItems?.[0]?.productName || "Product"} />
        </div>
        <div className="order-product-details-mobile">
          <div className="order-product-name-mobile">{order.orderItems?.[0]?.productName}</div>
          <div className="order-date-mobile">
            <FontAwesomeIcon icon={faCalendarAlt} />{" "}
            {new Date(order.orderTime || order.createdAt).toLocaleDateString()}
          </div>
          <div className="order-total-mobile">
            Total: {formatCurrency(order.totalAmount || order.amount)}
          </div>
        </div>
      </div>
    </div>
  );
};

// Desktop Order Card
const DesktopOrderCard = ({ order, onClick }) => {
  const imageUrl = useMemo(() => getFirstImageUrl(order.orderItems?.[0]?.image_path), [order]);
  return (
    <div
      className="order-card-desktop"
      onClick={() => onClick(order)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => e.key === "Enter" && onClick(order)}
      aria-label={`View order ${order.orderId || order.id}`}
    >
      <div className="order-card-content-desktop">
        <div className="order-product-image-desktop">
          <img src={imageUrl} alt={order.orderItems?.[0]?.productName || "Product"} />
        </div>
        <div className="order-product-details-desktop">
          <div className="order-product-name-desktop">{order.orderItems?.[0]?.productName}</div>
        </div>
        <div className="order-meta-desktop">
          <div className="order-id-desktop">
            <FontAwesomeIcon icon={faReceipt} /> #{order.orderId || order.id}
          </div>
          <div className="order-date-desktop">
            <FontAwesomeIcon icon={faCalendarAlt} />{" "}
            {new Date(order.orderTime || order.createdAt).toLocaleDateString()}
          </div>
        </div>
        <div className="order-total-desktop">{formatCurrency(order.totalAmount || order.amount)}</div>
        <div
          className={classNames(
            "order-status-desktop",
            order.status?.toLowerCase().replace(/\s/g, "-")
          )}
        >
          {order.status}
        </div>
      </div>
    </div>
  );
};

const Orders = ({ setActiveComponent, setSelectedOrder }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const { data, isLoading, error } = useOrderHistory({ page: currentPage, size: 10 });

  const orders = useMemo(() => {
    if (Array.isArray(data?.content)) return data.content;
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);

  const handlePageChange = useCallback(
    (page) => {
      if (page >= 0 && page < (data?.totalPages || 1)) {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [data?.totalPages]
  );

  const handleOrderClick = useCallback(
    (order) => {
      setSelectedOrder(order);
      setActiveComponent("OrderDetail");
    },
    [setSelectedOrder, setActiveComponent]
  );

  return (
    <div className="order-content">
      <div className="order-header-container">
        <h1 className="order-main-title">
          <FontAwesomeIcon icon={faBox} /> Order History
        </h1>
        <p className="order-subtitle">View and manage your past orders</p>
      </div>

      {/* Conditional Rendering */}
      {isLoading ? (
        <div className="order-loading-screen">
          <FontAwesomeIcon icon={faSpinner} className="order-loading-spinner" size="3x" />
          <p className="loading-text">Loading your orders...</p>
        </div>
      ) : error ? (
        <div className="order-error-container">
          <div className="order-error-card">
            <FontAwesomeIcon icon={faExclamationCircle} className="order-error-icon" size="3x" />
            <h3 className="error-title">Something went wrong</h3>
            <p className="error-message">{error.message || "Please try refreshing the page."}</p>
            <button className="order-retry-button" onClick={() => window.location.reload()}>
              <FontAwesomeIcon icon={faUndo} /> Retry
            </button>
          </div>
        </div>
      ) : !orders.length ? (
        <div className="order-empty-state">
          <FontAwesomeIcon icon={faBoxOpen} className="order-empty-illustration" size="5x" />
          <h3 className="empty-title">No orders yet</h3>
          <p className="empty-message">
            Your order history will appear here once you make a purchase.
          </p>
          <button
            className="order-shop-button"
            onClick={() => setActiveComponent("Shop")}
          >
            <FontAwesomeIcon icon={faShoppingBag} /> Start Shopping
          </button>
        </div>
      ) : (
        <>
          {/* Desktop View */}
          <div className="desktop-view">
            {orders.map((order) => (
              <DesktopOrderCard
                key={order.orderId || order.id}
                order={order}
                onClick={handleOrderClick}
              />
            ))}
          </div>

          {/* Mobile View */}
          <div className="mobile-view">
            {orders.map((order) => (
              <MobileOrderCard
                key={order.orderId || order.id}
                order={order}
                onClick={handleOrderClick}
              />
            ))}
          </div>

          {/* Pagination */}
          {data?.totalPages > 1 && (
            <div className="order-pagination">
              <div className="pagination-controls">
                <button
                  className={classNames("pagination-btn", { disabled: currentPage === 0 })}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  aria-label="Previous Page"
                >
                  <FontAwesomeIcon icon={faAngleLeft} /> Prev
                </button>
                <span className="page-info" aria-live="polite">
                  Page {currentPage + 1} of {data.totalPages}
                </span>
                <button
                  className={classNames("pagination-btn", {
                    disabled: currentPage >= data.totalPages - 1,
                  })}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= data.totalPages - 1}
                  aria-label="Next Page"
                >
                  Next <FontAwesomeIcon icon={faAngleRight} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;