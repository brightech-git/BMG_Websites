import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiUser,
  FiShoppingBag,
  FiMapPin,
  FiLock,
  FiLogOut,
} from "react-icons/fi";
import "./AccountSideBarStyles.css";

const AccountSidebar = ({ openLogoutModal }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user.user);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true);

  const menuItems = [
    {
      key: "dashboard",
      icon: <FiUser size={18} />,
      label: "Dashboard",
      path: "dashboard",
    },
    {
      key: "orders",
      icon: <FiShoppingBag size={18} />,
      label: "Orders",
      path: "orders",
    },
    {
      key: "address",
      icon: <FiMapPin size={18} />,
      label: "Addresses",
      path: "address",
    },
    {
      key: "change-password",
      icon: <FiLock size={18} />,
      label: "Change Password",
      path: "change-password",
    },
  ];

  const getUserInitials = () => {
    const username = user?.username || user?.user?.username;
    if (!username) return "GU";

    const names = username.trim().split(" ");
    return names.length === 1
      ? names[0][0].toUpperCase()
      : `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  };

  const isActiveRoute = (path) =>
    location.pathname.endsWith(`/account/${path}`) ||
    (path === "dashboard" && location.pathname === "/account");

  const handleNavigate = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <aside className="account-navigation-panel">
      <div className={`sidebar-content ${isMobileMenuOpen ? "mobile-open" : ""}`}>
        {/* User Profile */}
        <div className="user-profile-card">
          <div className="profile-avatar-container">
            <div className="profile-avatar">{getUserInitials()}</div>
          </div>
          <div className="profile-info">
            <h3 className="profile-name">
              {user?.username || user?.user?.username || "Guest User"}
            </h3>
          </div>
        </div>

        {/* Navigation */}
        <nav className="account-navigation">
          <ul className="navigation-list">
            {menuItems.map((item) => (
              <li key={item.key} className="navigation-item">
                <button
                  className={`navigation-link ${isActiveRoute(item.path) ? "current-route" : ""
                    }`}
                  onClick={() => handleNavigate(item.path)}
                >
                  <span className="link-icon">{item.icon}</span>
                  <span className="link-text">{item.label}</span>
                </button>
              </li>
            ))}

            {/* Logout */}
            <li className="navigation-item">
              <button
                className="navigation-link sign-out-btn"
                onClick={openLogoutModal}
              >
                <span className="link-icon">
                  <FiLogOut size={18} />
                </span>
                <span className="link-text">Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default AccountSidebar;
