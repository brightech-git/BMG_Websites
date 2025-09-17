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
  faSearch,
  faTimes,
  faChevronDown,
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
  console.log(order,'order first');
  const imageUrl = useMemo(() => getFirstImageUrl(order.orderItems?.[0]?.imagePath), [order]);
  return (
    <div
      className="order-card-mobile"
      onClick={() => onClick(order)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => e.key === "Enter" && onClick(order)}
      aria-label={`View order ${order.orderId || order.id}`}
    >
     
      <div className="order-product-info-mobile">
        <div className="order-product-image-mobile">
          <img src={imageUrl} alt={order.orderItems?.[0]?.productName || "Product"} />
        </div>
        <div className="order-product-details-mobile">
          <div className="order-product-name-mobile">{order.orderItems?.[0]?.productName}</div>
          <span
            className={classNames(
              "order-status-mobile",
              order.status?.toLowerCase().replace(/\s/g, "-")
            )}
          >
            {order.status}
          </span>
       
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
  const imageUrl = useMemo(() => getFirstImageUrl(order.orderItems?.[0]?.imagePath), [order]);
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
     
        <div className="order-total-desktop">{formatCurrency(order.totalAmount || order.amount)} </div>

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
  const { data, isLoading, error } = useOrderHistory();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('');

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
  const isWithinTimeFrame = (orderDate, days) => {
    if (!days) return true;

    const orderDateTime = new Date(orderDate).getTime();
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - orderDateTime;
    const daysDiff = timeDiff / (1000 * 3600 * 24);

    return daysDiff <= days;
  };

  const filteredOrders = orders.filter(order => {
    // Search filter
    const matchesSearch =
      searchQuery === '' ||
      (order.orderId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.items || []).some(item =>
        (item.name || '').toLowerCase().includes(searchQuery.toLowerCase())
      );


    // Status filter
    const matchesStatus = statusFilter === '' ||
      order.status.toLowerCase() === statusFilter.toLowerCase();

    // Time filter
    const matchesTime = timeFilter === '' || isWithinTimeFrame(order.orderDate, parseInt(timeFilter));

    return matchesSearch && matchesStatus && matchesTime;
  });

 

  // Helper function to get time filter label
  const getTimeFilterLabel = (value) => {
    switch (value) {
      case '7': return 'Last 7 Days';
      case '30': return 'Last 30 Days';
      case '90': return 'Last 3 Months';
      case '180': return 'Last 6 Months';
      case '365': return 'Last Year';
      default: return '';
    }
  };
  // Helper function to check if order is within time frame

  return (
    <div className="order-content">
      <div className="order-header-container">
        <h1 className="order-main-title">
          <FontAwesomeIcon icon={faBox} /> Order History
        </h1>
        <p className="order-subtitle">View and manage your past orders</p>
      </div>

      {/* Search and Filter Section */}
      <div className="order-filter-container">
        <div className="search-filter-wrapper">
          {/* Search Input */}
          <div className="search-container">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search by order ID..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="filter-dropdowns">
            {/* Status Filter */}
            <div className="filter-group">
              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Placed">Placed</option>
                <option value="in_processing">Processing</option>
                <option value="packed">Packed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="returned">Cancelled</option>
              </select>
              <FontAwesomeIcon icon={faChevronDown} className="select-arrow" />
            </div>

            {/* Time Filter
            <div className="filter-group">
              <select
                className="filter-select"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
              >
                <option value="">All Time</option>
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 3 Months</option>
                <option value="180">Last 6 Months</option>
                <option value="365">Last Year</option>
              </select>
              <FontAwesomeIcon icon={faChevronDown} className="select-arrow" />
            </div> */}

            {/* Clear Filters Button */}
            {(statusFilter || timeFilter || searchQuery) && (
              <button
                className="clear-filters-btn"
                onClick={() => {
                  setStatusFilter('');
                  setTimeFilter('');
                  setSearchQuery('');
                }}
              >
                <FontAwesomeIcon icon={faTimes} /> Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {(statusFilter || timeFilter || searchQuery) && (
          <div className="active-filters">
            <span className="active-filters-label">Active filters:</span>
            {statusFilter && (
              <span className="filter-tag">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter('')}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </span>
            )}
            {timeFilter && (
              <span className="filter-tag">
                Time: {getTimeFilterLabel(timeFilter)}
                <button onClick={() => setTimeFilter('')}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="filter-tag">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </span>
            )}
          </div>
        )}
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
      ) : !filteredOrders.length ? (
        <div className="order-empty-state">
          <FontAwesomeIcon icon={faBoxOpen} className="order-empty-illustration" size="5x" />
          <h3 className="empty-title">
            {searchQuery || statusFilter || timeFilter ? "No matching orders" : "No orders yet"}
          </h3>
          <p className="empty-message">
            {searchQuery || statusFilter || timeFilter
              ? "Try adjusting your search or filters to find what you're looking for."
              : "Your order history will appear here once you make a purchase."}
          </p>
          {(searchQuery || statusFilter || timeFilter) ? (
            <button
              className="order-shop-button"
              onClick={() => {
                setStatusFilter('');
                setTimeFilter('');
                setSearchQuery('');
              }}
            >
              <FontAwesomeIcon icon={faUndo} /> Clear Filters
            </button>
          ) : (
            <button
              className="order-shop-button"
              onClick={() => setActiveComponent("Shop")}
            >
              <FontAwesomeIcon icon={faShoppingBag} /> Start Shopping
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Results Count */}
          <div className="results-count">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>

          {/* Desktop View */}
          <div className="desktop-view">
            {filteredOrders.map((order) => (
              <DesktopOrderCard
                key={order.orderId || order.id}
                order={order}
                onClick={handleOrderClick}
              />
            ))}
          </div>

          {/* Mobile View */}
          <div className="mobile-view">
            {filteredOrders.map((order) => (
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