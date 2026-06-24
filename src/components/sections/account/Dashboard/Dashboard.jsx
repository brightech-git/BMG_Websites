import React, { useState, useEffect } from "react";
import {
  FiShoppingBag,
  FiHeart,
  FiShoppingCart,
  FiChevronRight,
  FiLoader,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiUser,
  FiStar,
  FiGift,
  FiTrendingUp,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { getOrderHistory } from "../../../../service/orderService";
import { useCart } from "../../../../hook/cart/useCartQuery";
import { useFavorites } from "../../../../hook/favorites/useFavoritesQuery";


const Dashboard = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState();
  const [loadingOrders, setLoadingOrders] = useState(true);

  const { cartItems = { data: [] }, isLoading: cartLoading } = useCart();
  const { favorites: wishlistResponse = { data: [] }, isLoading: wishlistLoading } = useFavorites();

  console.log(cartItems, wishlistResponse,'wishlistResponse')

  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const response = await getOrderHistory();
        const orderList = Array.isArray(response.content)
          ? response.content
          : Array.isArray(response.data)
            ? response
            : [];
        setOrders(orderList);
      } catch (err) {
        console.error("Failed to load orders:", err);
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);
  

  const metrics = [
    {
      icon: <FiShoppingBag size={20} />,
      value: orders?.totalOrders ?? 0,
      label: "Orders",
      to: "/account/orders",
      gradient: "from-[#8B5CF6] to-[#6366F1]", // Purple to Indigo
      lightBg: "bg-[#8B5CF6]/10",
    },
    {
      icon: <FiHeart size={20} />,
      value: wishlistResponse?.length || 0,
      label: "Wishlist",
      to: "/wishlist",
      gradient: "from-[#EC4899] to-[#F43F5E]", // Pink to Rose
      lightBg: "bg-[#EC4899]/10",
    },
    {
      icon: <FiShoppingCart size={20} />,
      value: cartItems.data?.totalItems || 0,
      label: "Cart",
      to: "/cart",
      gradient: "from-[#10B981] to-[#14B8A6]", // Emerald to Teal
      lightBg: "bg-[#10B981]/10",
    },
  ];

  const getStatusBadge = (status) => {
    const s = (status || "").toUpperCase();
    const map = {
      DELIVERED: {
        color: "text-[#059669] border-[#059669] bg-[#059669]/10",
        icon: <FiCheckCircle size={14} />,
      },
      SHIPPED: {
        color: "text-[#2563EB] border-[#2563EB] bg-[#2563EB]/10",
        icon: <FiTruck size={14} />,
      },
      PROCESSING: {
        color: "text-[#D97706] border-[#D97706] bg-[#D97706]/10",
        icon: <FiClock size={14} />,
      },
      PENDING: {
        color: "text-[#D97706] border-[#D97706] bg-[#D97706]/10",
        icon: <FiClock size={14} />,
      },
      CANCELLED: {
        color: "text-[#6B7280] border-[#6B7280] bg-[#6B7280]/10",
        icon: <FiXCircle size={14} />,
      },
    };
    return map[s] || {
      color: "text-[#6B7280] border-[#6B7280] bg-[#6B7280]/10",
      icon: <FiPackage size={14} />
    };
  };

  const formatDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const isLoading = loadingOrders || cartLoading || wishlistLoading;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--primary-card-color)] p-4 md:p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center max-w-md animate__animated animate__fadeIn">
          <div className="relative">
            <FiLoader className="mx-auto text-4xl md:text-5xl text-[var(--primary-hover-color)] animate-spin" />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-hover-color)]/20 to-transparent rounded-full blur-xl"></div>
          </div>
          <p className="mt-4 md:mt-6 text-[var(--primary-text-color)] font-medium text-sm md:text-base">
            Loading your dashboard...
          </p>
          <p className="mt-2 text-xs md:text-sm text-[var(--grey-color)]">
            Just a moment please
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--primary-card-color)] px-3 sm:px-4 py-4 sm:py-6  sm:mt-0 font-[var(--secondary-font)] animate__animated animate__fadeIn">

      {/* Welcome Header */}
      <div className="max-w-7xl mx-auto space-y-2 sm:space-y-4">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-[var(--shadow-sm)] p-2 border border-gray-100 hover:shadow-[var(--shadow-md)] transition-all duration-300 animate__animated animate__fadeInDown">
          <div className="flex flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex flex-col lg:flex-row justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] rounded-xl sm:rounded-2xl flex items-center justify-center text-white transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <FiUser size={16} className="sm:hidden" />
                  <FiUser size={18} className="hidden sm:block md:hidden" />
                  <FiUser size={20} className="hidden md:block" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[var(--primary-text-color)]">
                    {greeting()}!
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--grey-color)] mt-0.5 ">
                    Here's what's happening
                  </p>
                </div>
              </div>
              {/* Metrics Cards - Responsive */}
              <div>

                <div className="flex gap-2 sm:gap-3">
                  {metrics.map((m, i) => (
                    <button
                      key={i}
                      onClick={() => navigate(m.to)}
                      className="group relative overflow-hidden bg-white border border-gray-200 rounded-lg sm:rounded-xl p-2 sm:p-2.5 md:p-3 hover:shadow-lg transition-all duration-300 animate__animated animate__fadeInRight flex-1 sm:flex-none min-w-[80px] sm:min-w-[100px]"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${m.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                      <div className="relative flex flex-row items-center sm:items-center gap-1 sm:gap-2">
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${m.lightBg} group-hover:bg-white/20 flex items-center justify-center transition-all duration-300`}>
                          <span className="text-[var(--primary-text-color)] group-hover:text-white transition-colors duration-300">
                            {React.cloneElement(m.icon, {
                              size: window.innerWidth < 640 ? 16 : window.innerWidth < 768 ? 18 : 20
                            })}
                          </span>
                        </div>
                        <div className="text-center sm:text-left">
                          <div className="text-[var(--primary-text-color)] group-hover:text-white font-bold text-sm sm:text-base md:text-lg transition-colors duration-300">
                            {m.value}
                          </div>
                          <p className="text-[10px] sm:text-xs text-[var(--grey-color)] group-hover:text-white/90 transition-colors duration-300 hidden sm:block">
                            {m.label}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          
           
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-[var(--shadow-sm)] overflow-hidden border border-gray-100 hover:shadow-[var(--shadow-lg)] transition-all duration-300 animate__animated animate__fadeInUp">
          <div className="p-3 sm:p-4 md:p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-[var(--primary-card-color)]/30 to-transparent">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-[#8B5CF6]/10 rounded-lg flex items-center justify-center">
                <FiPackage className="text-[#8B5CF6] text-sm sm:text-base md:text-lg" />
              </div>
              <h3 className="font-bold text-[var(--primary-text-color)] text-sm sm:text-base md:text-lg">
                Recent Orders
              </h3>
              <span className="hidden sm:inline-block text-xs text-[var(--grey-color)]">
                ({orders?.data?.length || 0} total)
              </span>
            </div>
            <button
              onClick={() => navigate("/account/orders")}
              className="group flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-[#8B5CF6] hover:text-[#6366F1] transition-all duration-300 rounded-lg hover:bg-[#8B5CF6]/10"
            >
              View All
              <FiChevronRight className="group-hover:translate-x-1 transition-transform duration-300 text-sm" />
            </button>
          </div>

          {orders?.data?.length === 0 ? (
            <div className="p-8 sm:p-12 md:p-16 text-center animate__animated animate__fadeIn">
              <div className="relative inline-block">
                <FiGift className="text-5xl sm:text-6xl md:text-7xl text-[#8B5CF6]/20 mb-4" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/10 to-transparent rounded-full blur-2xl"></div>
              </div>
              <p className="text-[var(--primary-text-color)] font-medium text-base sm:text-lg mb-2">
                No orders yet
              </p>
              <p className="text-[var(--grey-color)] text-xs sm:text-sm mb-4 sm:mb-6">
                Start shopping to see your orders here
              </p>
              <Link
                to="/products-page"
                className="inline-flex items-center gap-2 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <FiShoppingBag size={16} className="sm:hidden" />
                <FiShoppingBag size={18} className="hidden sm:block" />
                Shop Now
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="hidden sm:table-header-group">
                  <tr className="bg-[#8B5CF6]/10">
                    <th className="text-left px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="text-left px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-[#6B7280] uppercase tracking-wider hidden md:table-cell">
                      Date
                    </th>
                    <th className="text-left px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                      Total
                    </th>
                    <th className="text-left px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders?.data.slice(0, 5).map((order, i) => {
                    const badge = getStatusBadge(order.status);
                    return (
                      <tr
                        key={order.orderId}
                        onClick={() => navigate(`/account/orderdetails/${order.orderId}`, { order })}
                        className="group hover:bg-gradient-to-r hover:from-[#8B5CF6]/5 hover:to-transparent cursor-pointer transition-all duration-300 animate__animated animate__fadeInUp"
                        style={{ animationDelay: `${i * 80}ms` }}
                      >
                        <td className="px-2 sm:px-3 md:px-6 py-3 sm:py-4">
                          <span className="font-semibold text-[#8B5CF6] bg-[#8B5CF6]/10 px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs md:text-sm whitespace-nowrap">
                            #{order.orderId.toString()}
                          </span>
                        </td>
                        <td className="px-2 sm:px-3 md:px-6 py-3 sm:py-4 text-[var(--grey-color)] hidden md:table-cell">
                          <span className="flex items-center gap-1.5 text-xs">
                            <FiClock className="text-[#8B5CF6]/60" size={12} />
                            {formatDate(order.orderTime || order.createdAt)}
                          </span>
                        </td>
                        <td className="px-2 sm:px-3 md:px-6 py-3 sm:py-4">
                          <span className={`inline-flex items-center gap-1 px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium border ${badge.color}`}>
                            {badge.icon}
                            <span className="hidden xs:inline">
                              {order.status || "Unknown"}
                            </span>
                          </span>
                        </td>
                        <td className="px-2 sm:px-3 md:px-6 py-3 sm:py-4">
                          <span className="font-bold text-[#8B5CF6] text-xs sm:text-sm md:text-base">
                            ₹{(order.totalAmount || 0).toFixed(2)}
                          </span>
                        </td>
                        <td className="px-2 sm:px-3 md:px-6 py-3 sm:py-4">
                          <button className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg bg-[#8B5CF6]/10 group-hover:bg-[#8B5CF6] flex items-center justify-center transition-all duration-300">
                            <FiChevronRight className="text-[#8B5CF6] group-hover:text-white text-xs sm:text-sm transition-all duration-300 group-hover:translate-x-0.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Decorative Footer */}
          <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-gradient-to-r from-[#8B5CF6]/5 to-transparent border-t border-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-[10px] sm:text-xs text-[var(--grey-color)] flex items-center gap-1.5">
                <FiTrendingUp className="text-[#8B5CF6]" size={12} />
                ✦ Showing last 5 orders
              </p>
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#EC4899] animate-pulse" style={{ animationDelay: '200ms' }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" style={{ animationDelay: '400ms' }}></div>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default Dashboard;