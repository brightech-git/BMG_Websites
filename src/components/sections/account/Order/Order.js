import React, { useState, useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom";
import classNames from "classnames";
import { useOrderHistory } from "../../../../hook/order/useOrderHistoryQuery";
import { formatCurrency } from "../../../../assets/utills/formatters";
import AccountSideBar from "../AccountSidebar/AccountSideBar";
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
  faUser,
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
      className="order-card"
      onClick={() => onClick(order)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => e.key === "Enter" && onClick(order)}
      aria-label={`View order ${order.orderId || order.id}`}
    >
      <div className="order-card-header">
        <span>
          <FontAwesomeIcon icon={faReceipt} /> #{order.orderId || order.id}
        </span>
        <span
          className={classNames(
            "status",
            order.status?.toLowerCase().replace(/\s/g, "-")
          )}
        >
          {order.status}
        </span>
      </div>
      <div className="order-card-body">
        <img src={imageUrl} alt={order.orderItems?.[0]?.productName || "Product"} />
        <div className="order-card-info">
          <div className="order-product-name">{order.orderItems?.[0]?.productName}</div>
          <div>
            <FontAwesomeIcon icon={faCalendarAlt} />{" "}
            {new Date(order.orderTime || order.createdAt).toLocaleDateString()}
          </div>
          <div>
            <FontAwesomeIcon icon={faUser} /> {order.customerName}
          </div>
          <div>
            Total: {formatCurrency(order.totalAmount || order.amount)}
          </div>
        </div>
      </div>
    </div>
  );
};

// Desktop Table Row
const DesktopOrderRow = ({ order, onClick }) => {
  const imageUrl = useMemo(() => getFirstImageUrl(order.orderItems?.[0]?.image_path), [order]);
  return (
    <tr
      key={order.orderId || order.id}
      className="order-table-row"
      onClick={() => onClick(order)}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick(order)}
      role="button"
      aria-label={`Open order ${order.orderId || order.id}`}
    >
      <td>
        <div className="order-summary">
          <img src={imageUrl} alt={order.orderItems?.[0]?.productName || "Product"} />
          <div>
            <div className="order-id">#{order.orderId || order.id}</div>
            <div>{order.orderItems?.[0]?.productName}</div>
          </div>
        </div>
      </td>
      <td>{new Date(order.orderTime || order.createdAt).toLocaleDateString()}</td>
      <td>
        <FontAwesomeIcon icon={faUser} /> {order.customerName}
      </td>
      <td
        className={classNames(
          "status",
          order.status?.toLowerCase().replace(/\s/g, "-")
        )}
      >
        {order.status}
      </td>
    </tr>
  );
};

const OrdersPage = () => {
  const history = useHistory();
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
      history.push({
        pathname: `/orderdetail/${order.orderId || order.id}`,
        state: { orderData: order },
      });
    },
    [history]
  );

  return (
    <div className="account-container">
      <AccountSideBar />
      <div className="order-content">
        <div className="order-header">
          <h1>
            <FontAwesomeIcon icon={faBox} /> Order History
          </h1>
          <p>View and manage your past orders</p>
        </div>

        {/* Conditional Rendering */}
        {isLoading ? (
          <div className="order-loading">
            <FontAwesomeIcon icon={faSpinner} spin size="3x" />
            <p>Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="order-error">
            <FontAwesomeIcon icon={faExclamationCircle} size="3x" />
            <h3>Something went wrong</h3>
            <p>{error.message || "Please try refreshing the page."}</p>
            <button onClick={() => window.location.reload()}>
              <FontAwesomeIcon icon={faUndo} /> Retry
            </button>
          </div>
        ) : !orders.length ? (
          <div className="order-empty">
            <FontAwesomeIcon icon={faBoxOpen} size="5x" />
            <h3>No orders yet</h3>
            <p>Your order history will appear here once you make a purchase.</p>
            <button onClick={() => history.push("/shop-left")}>
              <FontAwesomeIcon icon={faShoppingBag} /> Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Desktop View */}
            <div className="order-table-wrapper desktop-view">
              <table className="order-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <DesktopOrderRow key={order.orderId || order.id} order={order} onClick={handleOrderClick} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="mobile-view">
              {orders.map((order) => (
                <MobileOrderCard key={order.orderId || order.id} order={order} onClick={handleOrderClick} />
              ))}
            </div>

            {/* Pagination */}
            {data?.totalPages > 1 && (
              <div className="pagination-controls">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  aria-label="Previous Page"
                >
                  <FontAwesomeIcon icon={faAngleLeft} /> Prev
                </button>
                <span aria-live="polite">
                  Page {currentPage + 1} of {data.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= data.totalPages - 1}
                  aria-label="Next Page"
                >
                  Next <FontAwesomeIcon icon={faAngleRight} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
