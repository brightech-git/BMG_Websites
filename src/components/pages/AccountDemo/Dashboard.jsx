import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Heart,
  ShoppingCart,
  ChevronRight,
  Loader,
  AlertCircle,
  Package,
} from "lucide-react";
import Layout from "./Layout";

// Mock data - replace with actual API calls
const mockOrders = [
  {
    id: "ORD-001",
    orderId: "ORD-001",
    date: "2024-01-15",
    orderTime: "2024-01-15T10:30:00",
    totalAmount: 2499,
    status: "Delivered",
    items: "2 items",
    orderItems: [
      {
        id: 1,
        productName: "Premium Headphones",
        imagePath: "/placeholder.svg",
        quantity: 1,
      },
    ],
  },
  {
    id: "ORD-002",
    orderId: "ORD-002",
    date: "2024-01-10",
    orderTime: "2024-01-10T14:45:00",
    totalAmount: 5499,
    status: "In Transit",
    items: "1 item",
    orderItems: [
      {
        id: 2,
        productName: "Smartwatch",
        imagePath: "/placeholder.svg",
        quantity: 1,
      },
    ],
  },
  {
    id: "ORD-003",
    orderId: "ORD-003",
    date: "2024-01-05",
    orderTime: "2024-01-05T09:15:00",
    totalAmount: 1299,
    status: "Processing",
    items: "3 items",
    orderItems: [
      {
        id: 3,
        productName: "Phone Case",
        imagePath: "/placeholder.svg",
        quantity: 3,
      },
    ],
  },
];

const mockCart = { data: Array(2) };
const mockWishlist = { data: Array(5) };

export default function Dashboard() {
  const [orders, setOrders] = useState(mockOrders);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 500);
  }, []);

  const metrics = [
    {
      icon: ShoppingBag,
      value: orders.length,
      label: "Total Orders",
      key: "Orders",
      color: "blue",
    },
    {
      icon: Heart,
      value: mockWishlist.data.length,
      label: "Wishlist",
      key: "Wishlist",
      color: "rose",
    },
    {
      icon: ShoppingCart,
      value: mockCart.data.length,
      label: "Cart Items",
      key: "Cart",
      color: "purple",
    },
  ];

  const getStatusBadgeColor = (status) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "IN TRANSIT":
        return "bg-blue-100 text-blue-800";
      case "PROCESSING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-96 gap-4">
          <Loader size={40} className="text-blue-600 animate-spin" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-96 gap-4 bg-red-50 p-8 rounded-lg">
          <AlertCircle size={40} className="text-red-600" />
          <h3 className="text-lg font-semibold text-red-900">Error</h3>
          <p className="text-red-700">We couldn't load your dashboard.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Retry
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here's an overview of your account activity.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            const colorClasses = {
              blue: "bg-blue-100 text-blue-600",
              rose: "bg-rose-100 text-rose-600",
              purple: "bg-purple-100 text-purple-600",
            };

            return (
              <Link
                key={metric.key}
                to={metric.key === "Orders" ? "/profile?tab=orders" : "#"}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all transform hover:scale-105 cursor-pointer border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">{metric.label}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {metric.value}
                    </p>
                  </div>
                  <div
                    className={`${colorClasses[metric.color]} p-3 rounded-lg`}
                  >
                    <Icon size={24} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
              <p className="text-sm text-gray-600">Your latest order activity</p>
            </div>
            <Link
              to="/dummy-orders"
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
            >
              View All <ChevronRight size={18} />
            </Link>
          </div>

          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.slice(0, 3).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package size={24} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {order.orderItems?.[0]?.productName || "Order"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.items} • {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 ml-4">
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        ₹{order.totalAmount.toLocaleString()}
                      </p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Orders Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start shopping to see your orders here!
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                <ShoppingCart size={18} />
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
