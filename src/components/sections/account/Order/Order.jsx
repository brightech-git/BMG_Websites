import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox, faBoxOpen, faExclamationCircle, faSpinner,
  faSearch, faTimes, faChevronDown, faCheckCircle,
  faTruck, faClock, faAngleLeft, faAngleRight
} from "@fortawesome/free-solid-svg-icons";
import { getOrderHistory } from "../../../../service/orderService";
import { formatCurrency } from "../../../../utils/formatters";
import { useNavigate } from "react-router-dom";
import SmartButton from "../../../ui/SmartButton";
import "animate.css";

const Orders = () => {
  const [ordersData, setOrdersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  const orderPayload = {
    page: currentPage,
    size: pageSize,
    status: statusFilter
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getOrderHistory(orderPayload);
        setOrdersData(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [currentPage, pageSize, statusFilter]);

  const orders = useMemo(() => {
    if (!ordersData) return [];
    return Array.isArray(ordersData.data) ? ordersData.data : [];
  }, [ordersData]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q ||
        String(order.orderId || "").toLowerCase().includes(q) ||
        (order.items || []).some(item => String(item.name || "").toLowerCase().includes(q));
      const matchesStatus = !statusFilter || (order.status || "").toLowerCase() === statusFilter.toLowerCase();
      const matchesTime = !timeFilter || (
        Date.now() - new Date(order.orderTime || order.createdAt).getTime() <= parseInt(timeFilter) * 86400000
      );
      return matchesSearch && matchesStatus && matchesTime;
    });
  }, [orders, searchQuery, statusFilter, timeFilter]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(0);
  };

  const getTimeFilterLabel = (value) => {
    const labels = { "7": "Last 7 Days", "30": "Last 30 Days", "90": "Last 3 Months", "180": "Last 6 Months", "365": "Last Year" };
    return labels[value] || "";
  };

  const getStatusBadge = (status) => {
    const s = (status || "").toUpperCase();
    const map = {
      DELIVERED: { type: "success", icon: faCheckCircle, text: "Delivered" },
      SHIPPED: { type: "info", icon: faTruck, text: "Shipped" },
      PROCESSING: { type: "warning", icon: faClock, text: "Processing" },
      PENDING: { type: "warning", icon: faClock, text: "Pending" },
      CANCELLED: { type: "danger", icon: faTimes, text: "Cancelled" },
    };
    return map[s] || { type: "default", icon: faBox, text: s || "Order" };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Placed", value: "placed" },
    { label: "Processing", value: "in_processing" },
    { label: "Packed", value: "packed" },
    { label: "Shipped", value: "shipped" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const timeOptions = [
    { label: "Last 7 Days", value: "7" },
    { label: "Last 30 Days", value: "30" },
    { label: "Last 3 Months", value: "90" },
    { label: "Last 6 Months", value: "180" },
    { label: "Last Year", value: "365" },
  ];

  return (
    <div className="font-primary  md:mt-0 text-[#2D1B4E] px-2 sm:px-3 py-3 sm:py-4 text-xs sm:text-sm leading-tight bg-gradient-to-br from-[#FFF7ED] via-[#FFEDD5] to-[#FFF3E6] text-[#7C2D12] min-h-screen animate__animated animate__fadeIn">


      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border border-[#E2D9FF] rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-3 sm:mb-4 flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 shadow-lg shadow-[#8B5CF6]/5 animate__animated animate__fadeInDown hover:border-[#C4B5FF] transition-all duration-300">
        <h1 className="text-sm sm:text-base md:text-lg font-bold text-[#7C3AED] flex items-center gap-1.5 sm:gap-2">
          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] rounded-lg flex items-center justify-center text-white shadow-md">
            <FontAwesomeIcon icon={faBox} className="text-xs sm:text-sm" />
          </div>
          <span>Order History</span>
        </h1>
        <p className="text-[10px] sm:text-xs text-[#6B5B95] bg-white/60 px-3 py-1 rounded-full border border-[#E2D9FF]">✨ Manage your past orders</p>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-md border border-[#E2D9FF] rounded-xl sm:rounded-2xl p-2 sm:p-3 mb-3 sm:mb-4 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between shadow-lg shadow-[#8B5CF6]/5 animate__animated animate__fadeInUp hover:border-[#C4B5FF] transition-all duration-300">
        <div className="relative w-full md:max-w-xs">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5CF6] text-xs sm:text-sm" />
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full pl-8 sm:pl-9 pr-8 py-2 sm:py-2.5 h-9 sm:h-10 bg-white/90 text-xs sm:text-sm border border-[#E2D9FF] rounded-full focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6] transition-all duration-200 placeholder:text-[#A78BFA]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A78BFA] hover:text-[#7C3AED] transition-colors">
              <FontAwesomeIcon icon={faTimes} className="text-xs sm:text-sm" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* STATUS */}
          <div className="relative flex-1 md:flex-none min-w-[140px] sm:min-w-[160px]">
            <select
              className="appearance-none bg-white/90 w-full h-8 sm:h-9 border border-[#E2D9FF] rounded-full pl-3 pr-7 sm:pl-4 sm:pr-8 text-[10px] sm:text-xs text-[#2D1B4E] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6] cursor-pointer transition-all hover:border-[#8B5CF6]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <FontAwesomeIcon icon={faChevronDown} className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-[10px] sm:text-xs text-[#8B5CF6] pointer-events-none" />
          </div>

          {/* TIME */}
          <div className="relative flex-1 md:flex-none min-w-[140px] sm:min-w-[160px]">
            <select
              className="appearance-none bg-white/90 w-full h-8 sm:h-9 border border-[#E2D9FF] rounded-full pl-3 pr-7 sm:pl-4 sm:pr-8 text-[10px] sm:text-xs text-[#2D1B4E] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6] cursor-pointer transition-all hover:border-[#8B5CF6]"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
            >
              <option value="">All Time</option>
              {timeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <FontAwesomeIcon icon={faChevronDown} className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-[10px] sm:text-xs text-[#8B5CF6] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {(statusFilter || timeFilter || searchQuery) && (
        <div className="bg-white/80 backdrop-blur-md border border-[#E2D9FF] rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 flex flex-wrap items-center justify-between gap-2 animate__animated animate__fadeIn shadow-lg shadow-[#8B5CF6]/5">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-[10px] sm:text-xs font-medium text-[#6B5B95]">Active:</span>
            {statusFilter && (
              <span className="inline-flex items-center gap-1 bg-[#F5F0FF] px-2 py-1 rounded-full text-[10px] sm:text-xs border border-[#D8CDFF] text-[#6D28D9]">
                {statusOptions.find(o => o.value === statusFilter)?.label || statusFilter}
                <button onClick={() => setStatusFilter("")} className="hover:text-[#7C3AED] ml-0.5">
                  <FontAwesomeIcon icon={faTimes} className="text-[8px] sm:text-[10px]" />
                </button>
              </span>
            )}
            {timeFilter && (
              <span className="inline-flex items-center gap-1 bg-[#F5F0FF] px-2 py-1 rounded-full text-[10px] sm:text-xs border border-[#D8CDFF] text-[#6D28D9]">
                {getTimeFilterLabel(timeFilter)}
                <button onClick={() => setTimeFilter("")} className="hover:text-[#7C3AED] ml-0.5">
                  <FontAwesomeIcon icon={faTimes} className="text-[8px] sm:text-[10px]" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 bg-[#F5F0FF] px-2 py-1 rounded-full text-[10px] sm:text-xs border border-[#D8CDFF] text-[#6D28D9]">
                "{searchQuery}"
                <button onClick={() => setSearchQuery("")} className="hover:text-[#7C3AED] ml-0.5">
                  <FontAwesomeIcon icon={faTimes} className="text-[8px] sm:text-[10px]" />
                </button>
              </span>
            )}
          </div>
          <SmartButton onClick={() => { setStatusFilter(""); setTimeFilter(""); setSearchQuery(""); }} size="sm" hover className="text-[10px] sm:text-xs px-3 py-1.5 bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white rounded-full hover:shadow-lg hover:shadow-[#8B5CF6]/30">
            Clear all
          </SmartButton>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="bg-white/80 backdrop-blur-md border border-[#E2D9FF] rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center animate__animated animate__fadeIn shadow-lg shadow-[#8B5CF6]/5">
          <div className="relative inline-block">
            <FontAwesomeIcon icon={faSpinner} spin className="text-2xl sm:text-3xl text-[#8B5CF6] mb-3" />
            <div className="absolute inset-0 bg-[#8B5CF6]/20 rounded-full blur-xl"></div>
          </div>
          <p className="text-xs sm:text-sm text-[#6B5B95]">Loading your orders...</p>
        </div>
      ) : error ? (
        <div className="bg-white/80 backdrop-blur-md border border-red-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center animate__animated animate__shakeX shadow-lg">
          <FontAwesomeIcon icon={faExclamationCircle} className="text-3xl sm:text-4xl text-red-400 mb-3" />
          <p className="text-xs sm:text-sm text-red-600 mb-3">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 sm:px-5 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white text-xs sm:text-sm rounded-lg hover:shadow-lg hover:shadow-[#8B5CF6]/30 transition-all duration-300">
            Retry
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-md border border-[#E2D9FF] rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center animate__animated animate__fadeIn shadow-lg shadow-[#8B5CF6]/5">
          <div className="relative inline-block">
            <FontAwesomeIcon icon={faBoxOpen} className="text-5xl sm:text-6xl text-[#C4B5FF] mb-4" />
            <div className="absolute inset-0 bg-[#8B5CF6]/10 rounded-full blur-2xl"></div>
          </div>
          <p className="text-sm sm:text-base font-medium text-[#2D1B4E] mb-2">
            {orders.length === 0 ? "No orders yet" : "No matches found"}
          </p>
          <p className="text-xs sm:text-sm text-[#6B5B95] mb-4">
            {orders.length === 0 ? "Start shopping to see your orders here" : "Try adjusting your filters"}
          </p>
          {(statusFilter || timeFilter || searchQuery) && (
            <button onClick={() => { setSearchQuery(""); setStatusFilter(""); setTimeFilter(""); }}
              className="px-4 sm:px-5 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white text-xs sm:text-sm rounded-lg hover:shadow-lg hover:shadow-[#8B5CF6]/30 transition-all duration-300">
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="bg-white/80 backdrop-blur-md border border-[#E2D9FF] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg shadow-[#8B5CF6]/5 animate__animated animate__fadeInUp hover:border-[#C4B5FF] transition-all duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-[#F5F0FF] to-[#F0E7FF] border-b border-[#E2D9FF]">
                    <th className="text-left px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 text-[10px] sm:text-xs font-bold text-[#6D28D9] uppercase tracking-wider">Order ID</th>
                    <th className="text-left px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 text-[10px] sm:text-xs font-bold text-[#6D28D9] uppercase tracking-wider hidden md:table-cell">Date</th>
                    <th className="text-left px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 text-[10px] sm:text-xs font-bold text-[#6D28D9] uppercase tracking-wider">Status</th>
                    <th className="text-left px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 text-[10px] sm:text-xs font-bold text-[#6D28D9] uppercase tracking-wider">Total</th>
                    <th className="text-center px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 text-[10px] sm:text-xs font-bold text-[#6D28D9] uppercase tracking-wider">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E7FF]">
                  {filteredOrders.map((order, i) => {
                    const badge = getStatusBadge(order.status);
                    return (
                      <tr
                        key={order.orderId || order.id}
                        onClick={() => navigate(`/account/orderdetails/${order.orderId}`, { order })}
                        className="group hover:bg-gradient-to-r hover:from-[#F5F0FF] hover:to-[#F0E7FF] cursor-pointer transition-all duration-200 animate__animated animate__fadeInUp"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <td className="px-2 sm:px-3 md:px-4 py-2.5 sm:py-3">
                          <span className="font-semibold text-[#7C3AED] bg-[#EDE9FE] px-2 py-1 rounded-lg text-[10px] sm:text-xs whitespace-nowrap border border-[#D8CDFF] group-hover:bg-[#8B5CF6] group-hover:text-white group-hover:border-[#8B5CF6] transition-all duration-300">
                            #{order.orderId || order.id}
                          </span>
                        </td>
                        <td className="px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 text-[#6B5B95] hidden md:table-cell">
                          <span className="flex items-center gap-1.5 text-[10px] sm:text-xs">
                            <FontAwesomeIcon icon={faClock} className="text-[#8B5CF6]/60" size="sm" />
                            {formatDate(order.orderTime || order.createdAt)}
                          </span>
                        </td>
                        <td className="px-2 sm:px-3 md:px-4 py-2.5 sm:py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[8px] sm:text-[10px] md:text-xs font-medium border
                            ${badge.type === "success" ? "text-[#059669] border-[#059669] bg-[#059669]/10" : ""}
                            ${badge.type === "info" ? "text-[#2563EB] border-[#2563EB] bg-[#2563EB]/10" : ""}
                            ${badge.type === "warning" ? "text-[#D97706] border-[#D97706] bg-[#D97706]/10" : ""}
                            ${badge.type === "danger" ? "text-[#DC2626] border-[#DC2626] bg-[#DC2626]/10" : ""}
                            ${badge.type === "default" ? "text-[#6B5B95] border-[#C4B5FF] bg-[#F5F0FF]" : ""}
                          `}>
                            <FontAwesomeIcon icon={badge.icon} className="text-[8px] sm:text-[10px]" />
                            <span className="hidden xs:inline">{badge.text}</span>
                          </span>
                        </td>
                        <td className="px-2 sm:px-3 md:px-4 py-2.5 sm:py-3">
                          <span className="font-bold text-[#2D1B4E] text-xs sm:text-sm">
                            {formatCurrency(order.totalAmount || order.amount)}
                          </span>
                        </td>
                        <td className="px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 text-center">
                          <button className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg bg-[#EDE9FE] group-hover:bg-gradient-to-r group-hover:from-[#8B5CF6] group-hover:to-[#6D28D9] flex items-center justify-center mx-auto transition-all duration-300 border border-[#D8CDFF] group-hover:border-transparent">
                            <FontAwesomeIcon icon={faAngleRight} className="text-[#7C3AED] group-hover:text-white text-xs sm:text-sm transition-all duration-300 group-hover:translate-x-0.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {ordersData && (
            <div className="bg-white/80 backdrop-blur-md border border-[#E2D9FF] rounded-xl p-3 sm:p-4 mt-3 sm:mt-4 flex flex-row  justify-between items-center gap-3 shadow-lg shadow-[#8B5CF6]/5 animate__animated animate__fadeInUp">
              <div className="text-[10px] sm:text-xs text-[#6B5B95] order-2 sm:order-1">
                Total Orders: <span className="font-semibold text-[#7C3AED]">{ordersData?.totalOrders || 0}</span>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 order-1 sm:order-2">
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={currentPage === 0}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border border-[#E2D9FF] rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F5F0FF] hover:border-[#8B5CF6] transition-all text-[#8B5CF6]"
                  >
                    <FontAwesomeIcon icon={faAngleLeft} className="text-xs sm:text-sm" />
                  </button>

                  <span className="text-[10px] sm:text-xs px-3 py-1.5 bg-gradient-to-r from-[#F5F0FF] to-[#F0E7FF] rounded-lg text-[#6D28D9] font-medium border border-[#D8CDFF]">
                    {currentPage + 1} / {ordersData.totalPages}
                  </span>

                  <button
                    disabled={currentPage >= ordersData.totalPages - 1}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border border-[#E2D9FF] rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F5F0FF] hover:border-[#8B5CF6] transition-all text-[#8B5CF6]"
                  >
                    <FontAwesomeIcon icon={faAngleRight} className="text-xs sm:text-sm" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] sm:text-xs text-[#6B5B95]">Show:</span>
                  <select
                          style={{ border:'1px solid #E2D9FF'}}
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    className="h-7 sm:h-8 border border-[#E2D9FF] rounded-lg px-2 text-[10px] sm:text-xs bg-white/90 text-[#2D1B4E] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6] cursor-pointer hover:border-[#8B5CF6] transition-all"
                  >
                    {[5, 10, 20, 50].map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;