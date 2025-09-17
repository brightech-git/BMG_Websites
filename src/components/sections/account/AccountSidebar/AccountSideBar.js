import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { logout } from "../../../../redux/slices/userSlice";
import {
  FiUser,
  FiShoppingBag,
  FiMapPin,
  FiLock,
  FiLogOut,
  FiMenu,
  FiX,
  FiHome,
} from "react-icons/fi";
import "./AccountSideBarStyles.css";

const AccountSidebar = ({ activeComponent, setActiveComponent, openLogoutModal }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const history = useHistory();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true);

  const menuItems = [
    { key: "Dashboard", icon: <FiUser size={18} />, label: "Dashboard" },
    { key: "Orders", icon: <FiShoppingBag size={18} />, label: "Orders" },
    { key: "Addresses", icon: <FiMapPin size={18} />, label: "Addresses" },
    { key: "Change Password", icon: <FiLock size={18} />, label: "Change Password" },
  ];

  const getUserInitials = () => {
    if (!user?.username) return "GU"; // Guest User
    const names = user.username.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
  };

 

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(true);
  };

  const handleMenuClick = (key) => {
    if (key === "Home") {
      history.push("/");
    } else {
      setActiveComponent(key);
    }
  };

  return (
    <section>
      <div className="account-navigation-panel">
        
        <div className={`sidebar-content mobile-open`}>
          <div className="user-profile-card">
            <div className="profile-avatar-container">
              <div className="profile-avatar">{getUserInitials()}</div>
            </div>
            <div className="profile-info">
              <h3 className="profile-name">{user?.username || "Guest User"}</h3>
            </div>
          </div>

          <nav className="account-navigation">
            <ul className="navigation-list">
              {menuItems.map((item) => (
                <li key={item.key} className="navigation-item">
                  <button
                    className={`navigation-link ${activeComponent === item.key ? "current-route" : ""}`}
                    onClick={() => handleMenuClick(item.key)}
                  >
                    <span className="link-icon">{item.icon}</span>
                    <span className="link-text">{item.label}</span>
                  </button>
                </li>
              ))}
              <li className="navigation-item">
                <button
                  className="navigation-link sign-out-btn"
                  onClick={() => openLogoutModal()}
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
      </div>
    </section>
  );
};

export default AccountSidebar;