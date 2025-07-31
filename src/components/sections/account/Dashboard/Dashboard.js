import React, { useState, useEffect } from "react";
import {
  FiShoppingBag,
  FiClock,
  FiTruck,
  FiCheckCircle,
  FiHeart,
  FiShoppingCart,
  FiChevronRight,
  FiLoader,
  FiAlertCircle,
  FiPackage,
  FiCalendar,
  FiUser,
} from "react-icons/fi";
import "./Dashboard.css";
import AccountSideBar from "../AccountSidebar/AccountSideBar";
import { useOrderHistory } from "../../../../hook/order/useOrderHistoryQuery";
import { useCart } from "../../../../hook/cart/useCartQuery";
import { useFavorites } from "../../../../hook/favorites/useFavoritesQuery";
import { Link, useHistory } from "react-router-dom";

const Dashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const history = useHistory();

  const {
    data: ordersData,
    isLoading: ordersLoading,
    error: ordersError,
  } = useOrderHistory({ page: 0, size: 3, status: "" });

  const {
    cartItems: cartData,
    isLoading: cartLoading,
    error: cartError,
  } = useCart();

  const {
    data: wishlistResponse = { data: [] },
    isLoading: wishlistLoading,
    error: wishlistError,
  } = useFavorites();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getFirstImage = (imagePath) => {
    if (!imagePath) return null;
    return imagePath.trim();
  };

  const getResolvedImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    if (url.startsWith("/")) return `https://app.bmgjewellers.com${url}`;
    return null;
  };

  const calculateStats = () => {
    const orders = Array.isArray(ordersData) ? ordersData : [];
    const totalOrders = orders.length;
    const wishlistItems = wishlistResponse?.data?.length || 0;
    const cartItems = cartData?.data?.length || 0;

    return [
      {
        icon: <FiShoppingBag size={28} />,
        value: totalOrders,
        label: "Total Orders",
        link: "/orders",
        color: "blue",
        description: "All time orders",
      },
      {
        icon: <FiHeart size={28} />,
        value: wishlistItems,
        label: "Wishlist",
        link: "/wishlist",
        color: "rose",
        description: "Saved items",
      },
      {
        icon: <FiShoppingCart size={28} />,
        value: cartItems,
        label: "Cart Items",
        link: "/cart",
        color: "purple",
        description: "Ready to checkout",
      },
    ];
  };

  const stats = calculateStats();

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
        return "green";
      case "SHIPPED":
        return "blue";
      case "PENDING":
      case "PROCESSING":
        return "amber";
      case "CANCELLED":
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
        return <FiCheckCircle size={14} />;
      case "SHIPPED":
        return <FiTruck size={14} />;
      case "PENDING":
      case "PROCESSING":
        return <FiClock size={14} />;
      default:
        return <FiPackage size={14} />;
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getTotalItems = (orderItems) => {
    if (!Array.isArray(orderItems)) return 0;
    return orderItems.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  const getOrderItemsSummary = (orderItems) => {
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return { text: "No items", count: "0 items" };
    }

    const itemNames = orderItems
      .slice(0, 2)
      .map((item) => item.productName || "Unknown Item");
    const totalQuantity = getTotalItems(orderItems);

    let text = itemNames.join(", ");
    if (orderItems.length > 2) {
      text += `, +${orderItems.length - 2} more`;
    }

    return {
      text,
      count: `${totalQuantity} item${totalQuantity !== 1 ? "s" : ""}`,
    };
  };

  const isLoading = ordersLoading || cartLoading || wishlistLoading;
  const hasError = ordersError || cartError || wishlistError;
  const orders = Array.isArray(ordersData) ? ordersData : [];

  if (isLoading) {
    return (
      <div className="dashboard-layout">
        <AccountSideBar
          isMobileMenuOpen={isMobileMenuOpen}
          toggleMobileMenu={toggleMobileMenu}
        />
        <main
          className={`dashboard-main ${isMobileMenuOpen ? "menu-open" : ""}`}
        >
          <div className="loading-container">
            <FiLoader className="loading-spinner" size={32} />
            <p>Loading your dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="dashboard-layout">
        <AccountSideBar
          isMobileMenuOpen={isMobileMenuOpen}
          toggleMobileMenu={toggleMobileMenu}
        />
        <main
          className={`dashboard-main ${isMobileMenuOpen ? "menu-open" : ""}`}
        >
          <div className="error-container">
            <FiAlertCircle size={24} className="error-icon" />
            <h3>Error Loading Dashboard</h3>
            <p>We couldn't load your dashboard data. Please try again later.</p>
            {ordersError && (
              <p className="error-detail">Orders: {ordersError.message}</p>
            )}
            {cartError && (
              <p className="error-detail">Cart: {cartError.message}</p>
            )}
            {wishlistError && (
              <p className="error-detail">Wishlist: {wishlistError.message}</p>
            )}
            <button
              onClick={() => window.location.reload()}
              className="retry-button"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {windowWidth <= 768 && <div className="mobile-header"></div>}

      <AccountSideBar
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
      />

      <main className={`dashboard-main ${isMobileMenuOpen ? "menu-open" : ""}`}>
        <div className="dashboard-container">
          <div className="dashboard-header">
            <p className="dashboard-subtitle">
              Welcome back! Here's what's happening with your account.
            </p>
          </div>

          <div className="stats-grid">
            {stats.map((stat, index) => (
              <Link
                to={stat.link}
                key={index}
                className={`stat-card stat-${stat.color}`}
              >
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-content">
                  <h3 className="stat-value">{stat.value}</h3>
                  <p className="stat-label">{stat.label}</p>
                  <p className="stat-description">{stat.description}</p>
                </div>
                <div className="stat-arrow">
                  <FiChevronRight size={18} />
                </div>
              </Link>
            ))}
          </div>

          <div className="recent-orders-section">
            <div className="section-header">
              <div className="section-title-group">
                <h2 className="section-title">Recent Orders</h2>
                <p className="section-subtitle">Your latest order activity</p>
              </div>
              <Link to="/orders" className="view-all-link">
                View All Orders <FiChevronRight size={16} />
              </Link>
            </div>

            {orders.length > 0 ? (
              <div className="orders-table-container">
                <div className="orders-table">
                  <div className="table-header">
                    <div className="header-cell">Order Details</div>
                    <div className="header-cell">Customer</div>
                    <div className="header-cell">Items</div>
                    <div className="header-cell">Total</div>
                    <div className="header-cell">Status</div>
                    <div className="header-cell">Actions</div>
                  </div>

                  <div className="table-body">
                    {orders.map((order, index) => {
                      const firstItem = order.orderItems?.[0];
                      const firstImage = firstItem
                        ? getFirstImage(firstItem.image_path)
                        : null;
                      const itemsSummary = getOrderItemsSummary(
                        order.orderItems
                      );

                      return (
                        <div key={order.orderId || index} className="table-row">
                          <div className="table-cell order-details">
                            <div className="order-info">
                              <div className="order-id-group">
                                <span className="order-id">
                                  #{order.orderId}
                                </span>
                                <div className="order-meta">
                                  <FiCalendar size={12} />
                                  <span className="order-date">
                                    {formatDate(order.orderTime)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="table-cell customer-info">
                            <div className="customer-details">
                              <div className="customer-name">
                                <FiUser size={14} />
                                <span>{order.customerName}</span>
                              </div>
                              <div className="customer-contact">
                                {order.contact}
                              </div>
                            </div>
                          </div>

                          <div className="table-cell order-items">
                            <div className="items-info">
                              {firstImage ? (
                                <div className="item-image-container">
                                  <div className="item-image">
                                    <img
                                      src={getResolvedImageUrl(firstImage)}
                                      alt={firstItem?.productName || "Product"}
                                      onError={(e) => {
                                        e.target.style.display = "none";
                                        const placeholder =
                                          e.target.parentNode.querySelector(
                                            ".item-image-placeholder"
                                          );
                                        if (placeholder)
                                          placeholder.style.display = "flex";
                                      }}
                                    />
                                    <div
                                      className="item-image-placeholder"
                                      style={{ display: "none" }}
                                    >
                                      <FiPackage size={20} />
                                    </div>
                                  </div>
                                  {/* <div className="item-details">
                                    <div className="item-name">
                                      {firstItem?.productName || "Unknown Item"}
                                    </div>
                                    <div className="item-count">
                                      {itemsSummary.count}
                                    </div>
                                  </div> */}
                                </div>
                              ) : (
                                <div className="item-image-container">
                                  <div className="item-image-placeholder">
                                    <FiPackage size={20} />
                                  </div>
                                  {/* <div className="item-details">
                                    <div className="item-name">
                                      {firstItem?.productName || "Unknown Item"}
                                    </div>
                                    <div className="item-count">
                                      {itemsSummary.count}
                                    </div>
                                  </div> */}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="table-cell order-total">
                            <span className="total-amount">
                              ₹{order.totalAmount?.toFixed(2) || "0.00"}
                            </span>
                            {order.paymentMode && (
                              <span className="payment-mode">
                                via {order.paymentMode}
                              </span>
                            )}
                          </div>

                          <div className="table-cell order-status">
                            <span
                              className={`status-badge status-${getStatusBadge(
                                order.status
                              )}`}
                            >
                              {getStatusIcon(order.status)}
                              <span>{order.status}</span>
                            </span>
                            {order.courierTrackingId && (
                              <span className="tracking-id">
                                Track: {order.courierTrackingId}
                              </span>
                            )}
                          </div>

                          <div className="table-cell order-actions">
                            <button
                              onClick={() => {
                                history.push({
                                  pathname: `/orderdetail/${order.orderId}`,
                                  state: {
                                    orderData: order,
                                    fromDashboard: true,
                                  },
                                });
                              }}
                              className="view-order-button"
                              title="View Order Details"
                              aria-label={`View details for order ${order.orderId}`}
                            >
                              <FiChevronRight size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-orders-message">
                <div className="no-orders-icon">
                  <FiShoppingBag size={48} />
                </div>
                <h3>No Orders Yet</h3>
                <p>
                  You haven't placed any orders yet. Start shopping to see your
                  orders here!
                </p>
                <Link to="/shop-left" className="shop-now-button">
                  <FiShoppingCart size={16} /> Start Shopping
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
