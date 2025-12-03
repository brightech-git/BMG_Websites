import { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import {
  Package,
  Truck,
  Lock,
  LogOut,
  ChevronRight,
  MapPin,
  Calendar,
  DollarSign,
  AlertCircle,
  Check,
} from "lucide-react";
import Layout from "./Layout";

export default function Profile() {
  const navigate = useHistory();
  const [activeTab, setActiveTab] = useState<
    "orders" | "tracking" | "password" | null
  >("orders");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMessage, setPasswordMessage] = useState("");

  // Mock orders data
  const orders = [
    {
      id: "ORD-001",
      date: "2024-01-15",
      total: 2499,
      status: "Delivered",
      items: "2 items",
      color: "green",
    },
    {
      id: "ORD-002",
      date: "2024-01-10",
      total: 5499,
      status: "In Transit",
      items: "1 item",
      color: "blue",
    },
    {
      id: "ORD-003",
      date: "2024-01-05",
      total: 1299,
      status: "Processing",
      items: "3 items",
      color: "yellow",
    },
  ];

  // Mock tracking data
  const trackingInfo = {
    orderId: "ORD-002",
    status: "In Transit",
    estimatedDelivery: "2024-01-18",
    currentLocation: "Distribution Center, Mumbai",
    timeline: [
      {
        status: "Order Confirmed",
        date: "2024-01-10",
        time: "10:30 AM",
        completed: true,
      },
      {
        status: "Packed",
        date: "2024-01-11",
        time: "2:45 PM",
        completed: true,
      },
      {
        status: "In Transit",
        date: "2024-01-12",
        time: "11:20 AM",
        completed: true,
      },
      {
        status: "Out for Delivery",
        date: "2024-01-18",
        time: "Expected",
        completed: false,
      },
      {
        status: "Delivered",
        date: "2024-01-18",
        time: "Expected",
        completed: false,
      },
    ],
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage("Passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordMessage("Password must be at least 6 characters");
      return;
    }
    setPasswordMessage("✓ Password changed successfully");
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => setPasswordMessage(""), 3000);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      navigate("/");
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "in transit":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-4 sticky top-20">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              My Account
            </h2>

            <div className="space-y-3">
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                  activeTab === "orders"
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package size={20} />
                  <span>My Orders</span>
                </div>
                {activeTab === "orders" && <ChevronRight size={20} />}
              </button>

              <button
                onClick={() => setActiveTab("tracking")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                  activeTab === "tracking"
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Truck size={20} />
                  <span>Order Tracking</span>
                </div>
                {activeTab === "tracking" && <ChevronRight size={20} />}
              </button>

              <button
                onClick={() => setActiveTab("password")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                  activeTab === "password"
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Lock size={20} />
                  <span>Password</span>
                </div>
                {activeTab === "password" && <ChevronRight size={20} />}
              </button>

              <div className="border-t border-gray-200 pt-3 mt-3">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <LogOut size={20} />
                    <span>Logout</span>
                  </div>
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* My Orders Section */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  My Orders
                </h2>
                <p className="text-sm text-gray-600">
                  View and manage all your orders
                </p>
              </div>

              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">
                          {order.id}
                        </h3>
                        <p className="text-xs text-gray-600 flex items-center gap-2 mt-1">
                          <Calendar size={14} />
                          {order.date}
                        </p>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3 pb-3 border-b border-gray-200">
                      <div>
                        <p className="text-xs text-gray-600">Total</p>
                        <p className="text-base font-bold text-gray-900">
                          ₹{order.total.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Items</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {order.items}
                        </p>
                      </div>
                    </div>

                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors">
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Tracking Section */}
          {activeTab === "tracking" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  Order Tracking
                </h2>
                <p className="text-sm text-gray-600">
                  Track your current order status
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
                {/* Order Header */}
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">
                        {trackingInfo.orderId}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        Estimated delivery: {trackingInfo.estimatedDelivery}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                      {trackingInfo.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 bg-blue-50 p-4 rounded-lg">
                    <MapPin size={20} className="text-blue-600" />
                    <span>
                      Current location: {trackingInfo.currentLocation}
                    </span>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  {trackingInfo.timeline.map((step, index) => (
                    <div key={index} className="relative">
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                              step.completed
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          >
                            {step.completed ? (
                              <Check size={20} />
                            ) : (
                              <span>{index + 1}</span>
                            )}
                          </div>
                          {index < trackingInfo.timeline.length - 1 && (
                            <div
                              className={`w-1 h-16 ${
                                step.completed
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            />
                          )}
                        </div>
                        <div className="flex-1 pt-1">
                          <h4 className="text-sm font-semibold text-gray-900">
                            {step.status}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {step.date} at {step.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Password Change Section */}
          {activeTab === "password" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  Change Password
                </h2>
                <p className="text-sm text-gray-600">
                  Update your account password for better security
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 max-w-md">
                {/* Security Info Alert */}
                <div className="flex gap-3 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <AlertCircle
                    size={18}
                    className="text-blue-600 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-xs font-semibold text-blue-900">
                      Security Tip
                    </p>
                    <p className="text-xs text-blue-800 mt-1">
                      Use a strong password with at least 8 characters,
                      including uppercase, lowercase, numbers, and symbols.
                    </p>
                  </div>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-900 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your current password"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-900 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your new password"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-900 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Confirm your new password"
                      required
                    />
                  </div>

                  {passwordMessage && (
                    <div
                      className={`p-2 rounded-lg text-xs font-semibold ${
                        passwordMessage.includes("✓")
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {passwordMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Default State */}
          {!activeTab && (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <Package size={40} className="mx-auto text-gray-400 mb-3" />
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                Welcome to Your Profile
              </h3>
              <p className="text-sm text-gray-600">
                Select an option from the sidebar to view your orders, track
                shipments, or manage your account.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
