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
import './logout.css';

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
        <div className="logout-modal-overlay" onClick={closeLogoutModal}>
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="logout-modal-header">
              <h2>Confirm Logout</h2>
            </div>
            <div className="logout-modal-body">
              <p>Are you sure you want to log out of your account?</p>
            </div>
            <div className="logout-modal-footer">
              <button className="cancel-btn" onClick={closeLogoutModal}>
                Cancel
              </button>
              <button className="logout-btn" onClick={handleLogout}>
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