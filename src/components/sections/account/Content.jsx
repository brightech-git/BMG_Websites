import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { logout } from "../../../redux/slices/userSlice";
import AccountSidebar from "./AccountSidebar/AccountSideBar";
import Header from "../../layouts/HeaderWithAuth";
import Footertwo from "../../layouts/Footer";
import "./AccountStyles.css";
import "./logout.css";

const AccountPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
    setIsModalOpen(false);
  };

  return (
    <>
      <Header />

      <section className="account-with-header">
        <div className="account-container">
          <div className="account-layout">
            <aside className="account-sidebar">
              <AccountSidebar openLogoutModal={() => setIsModalOpen(true)} />
            </aside>

            <main className="account-content">
              {/* 🔥 THIS is where child pages render */}
              <Outlet />
            </main>
          </div>
        </div>
      </section>

      <Footertwo />

      {/* Logout Modal */}
      {isModalOpen && (
        <div className="logout-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="logout-modal-header">Confirm Logout</h2>
            <p className="logout-modal-body">Are you sure you want to log out?</p>
            <div className="logout-modal-footer">
              <button onClick={() => setIsModalOpen(false)} className="cancel-btn">Cancel</button>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountPage;
