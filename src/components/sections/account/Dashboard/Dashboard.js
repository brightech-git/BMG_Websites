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
import { useOrderHistory } from "../../../../hook/order/useOrderHistoryQuery";
import { useCart } from "../../../../hook/cart/useCartQuery";
import { useFavorites } from "../../../../hook/favorites/useFavoritesQuery";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Dashboard = ({ setActiveComponent, setSelectedOrder }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const history = useHistory();
  const {
    data: ordersData = [],
    isLoading: ordersLoading,
    error: ordersError,
  } = useOrderHistory({ page: 0, size: 3, status: "" });

  const {
    cartItems: cartData = { data: [] },
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

  const calculateMetrics = () => {
    const orders = Array.isArray(ordersData) ? ordersData : [];
    const totalOrders = orders.length;
    const wishlistItems = wishlistResponse?.data?.length || 0;
    const cartItems = Array.isArray(cartData?.data) ? cartData.data.length : 0;
    console.log("Cart Items:", cartData?.data);

    return [
      {
        icon: <FiShoppingBag size={24} />,
        value: totalOrders,
        label: "Total Orders",
        key: "Orders",
        color: "blue",
        description: "All your orders",
      },
      {
        icon: <FiHeart size={24} />,
        value: wishlistItems,
        label: "Wishlist",
        key: "Wishlist",
        color: "rose",
        description: "Your saved items",
      },
      {
        icon: <FiShoppingCart size={24} />,
        value: cartItems,
        label: "Cart Items",
        key: "Cart",
        color: "purple",
        description: "Items ready to checkout",
      },
    ];
  };

  const metrics = calculateMetrics();

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case "PLACED":
        return "yellow";
      case "DELIVERED":
        return "green";
      case "SHIPPED":
        return "blue";
      case "PROCESSING":
        return "amber";
      case "CANCELLED":
        return "red";
      case "REFUNDED":
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
      case "PLACED":
        return <FiPackage size={14} />;
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

  const handleOrderRowClick = (order) => {
    setSelectedOrder(order);
    setActiveComponent("OrderDetail");
  };

  const isLoading = ordersLoading || cartLoading || wishlistLoading;
  const hasError = ordersError || cartError || wishlistError;
  const orders = Array.isArray(ordersData) ? ordersData : [];

  if (isLoading) {
    return (
      <div className="dashboard">
        <main className={`dashboard__content ${isMobileMenuOpen ? "menu-open" : ""}`}>
          <div className="loading">
            <FiLoader className="loading__spinner" size={24} />
            <p className="loading__text">Loading your dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="dashboard">
        <main className={`dashboard__content ${isMobileMenuOpen ? "menu-open" : ""}`}>
          <div className="error">
            <FiAlertCircle size={24} className="error__icon" />
            <h3 className="error__title">Error Loading Dashboard</h3>
            <p className="error__message">
              We couldn't load your dashboard data. Please try again later.
            </p>
            {ordersError && (
              <p className="error__detail">Orders: {ordersError.message}</p>
            )}
            {cartError && (
              <p className="error__detail">Cart: {cartError.message}</p>
            )}
            {wishlistError && (
              <p className="error__detail">Wishlist: {wishlistError.message}</p>
            )}
            <button onClick={() => window.location.reload()} className="error__retry">
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {windowWidth <= 768 && (
        <header className="dashboard__mobile-header">
          <h1 className="dashboard__mobile-title">Dashboard</h1>
        </header>
      )}
      <main className={`dashboard__content ${isMobileMenuOpen ? "menu-open" : ""}`}>
        <div className="dashboard__container">
          <header className="dashboard__header">
            <h1 className="dashboard__title">Dashboard</h1>
            <p className="dashboard__subtitle">
              Welcome back! Here's an overview of your account activity.
            </p>
          </header>
          <section className="metrics">
            {metrics.map((metric, index) => (
              <button
                key={index}
                className={`metric-card metric-card--${metric.color}`}
                onClick={() => {
                  if (metric.key === "Orders") {
                    setActiveComponent("Orders"); // switch inside dashboard
                  } else if (metric.key === "Cart") {
                    history.push("/cart"); // go to cart page
                  } else if (metric.key === "Wishlist") {
                    history.push("/wishlist"); // go to wishlist page
                  }
                }}
                aria-label={`View ${metric.label}`}
              >
                <div className="metric-card__icon">{metric.icon}</div>
                <div className="metric-card__content">
                  <h3 className="metric-card__value">{metric.value}</h3>
                  <p className="metric-card__label">{metric.label}</p>
                  <p className="metric-card__description">{metric.description}</p>
                </div>
                <div className="metric-card__arrow">
                  <FiChevronRight size={16} />
                </div>
              </button>
            ))}
          </section>


          <section className="order-history">
            <div className="order-history__header">
              <div className="order-history__title-group">
                <h2 className="order-history__title">Recent Orders</h2>
                <p className="order-history__subtitle">Your latest order activity</p>
              </div>
              <button
                className="order-history__view-all"
                onClick={() => setActiveComponent("Orders")}
                aria-label="View all orders"
              >
                View All Orders <FiChevronRight size={14} />
              </button>
            </div>

            {orders.length > 0 ? (
              <div className="order-history__cards">
                {orders.map((order, index) => {
                  const firstItem = order.orderItems?.[0];
                  console.log("First Item:", firstItem);
                  const firstImage = firstItem ? getFirstImage(firstItem.imagePath) : null;
                  const itemsSummary = getOrderItemsSummary(order.orderItems);

                  return (
                    <div
                      className="order-history__card"
                      key={index}
                      onClick={() => handleOrderRowClick(order)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleOrderRowClick(order);
                        }
                      }}
                      aria-label={`View details for order ${order.orderId}`}
                    >
                      <div className="order-history__card-content">
                        <div className="order-history__items-info">
                          {firstImage ? (
                            <div className="order-history__item-image-container">
                              <div className="order-history__item-image">
                                <img
                                  src={getResolvedImageUrl(firstImage)}
                                  alt={firstItem?.productName || "Product"}
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                    const placeholder = e.target.parentNode.querySelector(
                                      ".order-history__item-image-placeholder"
                                    );
                                    if (placeholder) placeholder.style.display = "flex";
                                  }}
                                />
                                <div
                                  className="order-history__item-image-placeholder"
                                  style={{ display: "none" }}
                                >
                                  <FiPackage size={16} />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="order-history__item-image-container">
                              <div className="order-history__item-image-placeholder">
                                <FiPackage size={16} />
                              </div>
                            </div>
                          )}
                          <div className="order-history__items-details">
                            <span className="order-history__items-text">{itemsSummary.text}</span>
                            <span className="order-history__items-count">{itemsSummary.count}</span>
                          </div>
                        </div>
                        <div className="order-history__status">
                          <span
                            className={`order-history__status-badge order-history__status-badge--${getStatusBadge(
                              order.status
                            )}`}
                          >
                            {getStatusIcon(order.status)}
                            <span>{order.status}</span>
                          </span>
                          {order.courierTrackingId && (
                            <span className="order-history__tracking-id">
                              Track: {order.courierTrackingId}
                            </span>
                          )}
                        </div>
                        <div className="order-history__total">
                          <span className="order-history__total-amount">
                            ₹{order.totalAmount?.toFixed(2) || "0.00"}
                          </span>
                          {order.paymentMode && (
                            <span className="order-history__payment-mode">via {order.paymentMode}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="order-history__empty">
                <div className="order-history__empty-icon">
                  <FiShoppingBag size={40} />
                </div>
                <h3 className="order-history__empty-title">No Orders Yet</h3>
                <p className="order-history__empty-message">
                  You haven't placed any orders yet. Start shopping to see your orders here!
                </p>
                <Link to="/products-page" className="order-history__shop-now">
                  <FiShoppingCart size={14} /> Start Shopping
                </Link>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;