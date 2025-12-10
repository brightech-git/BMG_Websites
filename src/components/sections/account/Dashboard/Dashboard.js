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
} from "react-icons/fi";
import { Link, useHistory } from "react-router-dom";
import { getOrderHistory } from "../../../../service/orderService";
import { useCart } from "../../../../hook/cart/useCartQuery";
import { useFavorites } from "../../../../hook/favorites/useFavoritesQuery";

const Dashboard = () => {
  const history = useHistory();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const { cartItems = { data: [] }, isLoading: cartLoading } = useCart();
  const { data: wishlistResponse = { data: [] }, isLoading: wishlistLoading } = useFavorites();

  // Fetch orders using the service directly (just like your original code)
  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const response = await getOrderHistory(); // Your service
        const orderList = Array.isArray(response.content)
          ? response.content
          : Array.isArray(response)
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
    { icon: <FiShoppingBag />, value: orders.length, label: "Orders", to: "/account/orders" },
    { icon: <FiHeart />, value: wishlistResponse.data?.length || 0, label: "Wishlist", to: "/wishlist" },
    { icon: <FiShoppingCart />, value: cartItems.data?.length || 0, label: "Cart", to: "/cart" },
  ];

  const getStatusBadge = (status) => {
    const s = (status || "").toUpperCase();
    const map = {
      DELIVERED: { color: "text-green-700 border-green-700 bg-green-50", icon: <FiCheckCircle /> },
      SHIPPED: { color: "text-blue-700 border-blue-700 bg-blue-50", icon: <FiTruck /> },
      PROCESSING: { color: "text-orange-700 border-orange-700 bg-orange-50", icon: <FiClock /> },
      PENDING: { color: "text-orange-700 border-orange-700 bg-orange-50", icon: <FiClock /> },
      CANCELLED: { color: "text-red-700 border-red-700 bg-red-50", icon: <FiXCircle /> },
    };
    return map[s] || { color: "text-gray-600 border-gray-400 bg-gray-50", icon: <FiPackage /> };
  };

  const formatDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const isLoading = loadingOrders || cartLoading || wishlistLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#eeece8] p-4">
        <div className="bg-white rounded-sm border border-gray-300 p-16 text-center">
          <FiLoader className="mx-auto text-4xl text-[#f16137] animate-spin" />
          <p className="mt-4 text-sm text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.4s ease-out forwards; }
      `}</style>

      <div className="min-h-screen bg-[#eeece8] px-3 py-3 mt-[100px] md:mt-0 font-secondary text-[#041f60] text-base leading-tight">

        {/* Header + Metrics */}
        <div className="bg-white border border-gray-300 rounded-sm p-2 mb-2  rounded-xl flex flex-row md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h2 className="text-sm md:text-lg font-bold text-[#f16137]">
              My Account
            </h2>
            <p className="text-sm text-gray-600 mt-1">Welcome back</p>
          </div>

          <div className="flex gap-2">
            {metrics.map((m, i) => (
              <button
                key={i}
                onClick={() => history.push(m.to)}
                className="flex items-center gap-2 px-2 py-1.5  border border-gray-300 rounded-full bg-[var(--primary-hover-color)] transition-all cursor-pointer"
              >
                <span className="text-[#fff] text-sm">{m.icon}</span>
                <div className="text-left">
                  <div className="text-[#fff] font-bold text-base">{m.value}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white border border-gray-300 rounded-sm overflow-hidden">
          <div className="p-2 border-b border-gray-300 flex justify-between items-center">
            <h3 className="font-bold text-[var(--primary-text-color)] text-lg">Recent Orders</h3>
            <button
              onClick={() => history.push("/account/orders")}
              className="text-sm font-semibold text-[#041f60] hover:text-[#f16137] flex items-center gap-1"
            >
              View All <FiChevronRight />
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="p-12 text-center">
              <FiPackage className="mx-auto text-6xl text-gray-300 mb-4" />
              <p className="text-gray-600 mb-3">No orders yet</p>
              <Link
                to="/products-page"
                className="inline-block px-6 py-2.5 bg-[#041f60] text-white text-sm rounded hover:bg-[#f16137] transition"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-300">
                  <tr>
                    <th className="text-left px-2 py-2 text-xs font-bold uppercase tracking-wider">Order ID</th>
                    <th className="text-left px-2 py-2 text-xs font-bold uppercase tracking-wider hidden sm:table-cell">Date</th>
                    <th className="text-left px-2 py-2 text-xs font-bold uppercase tracking-wider">Status</th>
                    <th className="text-left px-2 py-2 text-xs font-bold uppercase tracking-wider">Total</th>
                      <th className="text-left px-2 py-2 text-xs font-bold uppercase tracking-wider">Know More</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.slice(0, 5).map((order, i) => {
                    const badge = getStatusBadge(order.status);
                    return (
                      <tr
                        key={order.orderId}
                        onClick={() => history.push("/account/orderdetails", { order })}
                        className="hover:bg-orange-50 cursor-pointer animate-fadeInUp"
                        style={{ animationDelay: `${i * 80}ms` }}
                      >
                        <td className="px-2 py-2 font-semibold text-[#f16137]">#{order.orderId}</td>
                        <td className="px-2 py-2 text-gray-600 hidden sm:table-cell">
                          {formatDate(order.orderTime || order.createdAt)}
                        </td>
                        <td className="px-2 py-2">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
                            {badge.icon} {order.status || "Unknown"}
                          </span>
                        </td>
                        <td className="px-2 py-2 font-semibold">
                          ₹{(order.totalAmount || 0).toFixed(2)}
                        </td>
                        <td className="px-2 py-2 text-right">
                          <FiChevronRight className="text-gray-400 hover:text-[#f16137]" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;