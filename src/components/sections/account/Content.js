import React, { useState,useEffect } from "react";
import { useDispatch,  } from "react-redux";
import { logout } from '../../../redux/slices/userSlice'
import AccountSidebar from "./AccountSidebar/AccountSideBar";
import Dashboard from "./Dashboard/Dashboard";
import Orders from "./Order/Order";
import AddressManager from "./Address/AddressManager";
import ChangePassword from "./ChangePassword/ChangePassword";
import OrderDetail from "./OrderDetails/OrderDetails";
import "./AccountStyles.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useLocation } from "react-router-dom";

const AccountPage = () => {
  const location = useLocation();
  const [activeComponent, setActiveComponent] = useState("Dashboard");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    if (location.state?.activeComponent) {
      setActiveComponent(location.state.activeComponent);
    }
  }, [location.state]);

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "Dashboard":
        return (
          <Dashboard
            setActiveComponent={setActiveComponent}
            setSelectedOrder={setSelectedOrder}
          />
        );
      case "Orders":
        return (
          <Orders
            setActiveComponent={setActiveComponent}
            setSelectedOrder={setSelectedOrder}
          />
        );
      case "Addresses":
        return <AddressManager />;
      case "Security":
        return <ChangePassword />;
      case "OrderDetail":
        return (
          <OrderDetail
            order={selectedOrder}
            setActiveComponent={setActiveComponent}
          />
        );
      default:
        return <Dashboard />;
    }
  };

  const openLogoutModal = () => {
    setIsModalOpen(true);
  };

  const closeLogoutModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    history.push("/login");
    window.location.reload();
    closeLogoutModal();
  };

  return (
    <section className="account-with-header">
      <div className="account-container">
        <div className="account-layout">
          <div className="account-sidebar">
            <AccountSidebar
              activeComponent={activeComponent}
              setActiveComponent={setActiveComponent}
              openLogoutModal={openLogoutModal}
            />
          </div>
          <main className="account-content">{renderActiveComponent()}</main>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeLogoutModal}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
            style={{ borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow)' }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to log out of your account?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                style={{
                  borderRadius: 'var(--radius-sm)',
                  transition: 'var(--transition)',
                }}
                onClick={closeLogoutModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-white rounded transition-colors"
                style={{
                  backgroundColor: 'var(--danger-color)',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'var(--transition)',
                }}
                onClick={handleLogout}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-hover-color)')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--danger-color)')}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AccountPage;