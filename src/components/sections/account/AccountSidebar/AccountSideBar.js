import React, { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../../redux/slices/userSlice";
import {
  FiUser,
  FiShoppingBag,
  FiMapPin,
  FiHeart,
  FiShoppingCart,
  FiLock,
  FiLogOut,
  FiMenu,
  FiX
} from "react-icons/fi";
import "./AccountSideBarStyles.css";

const AccountSidebar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const history = useHistory();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { path: "/dashboard", icon: <FiUser size={18} />, label: "Dashboard" },
    { path: "/orders", icon: <FiShoppingBag size={18} />, label: "Orders" },
    { path: "/AddressManager", icon: <FiMapPin size={18} />, label: "Addresses" },
    // { path: "/wishlist", icon: <FiHeart size={18} />, label: "Wishlist" },
    // { path: "/cart", icon: <FiShoppingCart size={18} />, label: "Cart" },
    // { path: "/change-password", icon: <FiLock size={18} />, label: "Security" },
  ];

  // Function to generate user initials
  const getUserInitials = () => {
    if (!user?.username) return "GU"; // Guest User
    const names = user.username.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
  };

  const handleLogout = () => {
    dispatch(logout());
    history.push("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="account-navigation-panel">
      {/* Mobile menu header */}
      <div className="mobile-menu-header" onClick={toggleMobileMenu}>
        <div className="mobile-menu-toggle">
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </div>
        <div className="mobile-profile-info">
          <h3 className="profile-name">{user?.username || "Guest User"}</h3>
          <p className="user-email">{user?.email || "No email provided"}</p>
        </div>
      </div>

      {/* Content that will be collapsible on mobile */}
      <div className={`sidebar-content ${isMobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="user-profile-card">
          <div className="profile-avatar-container">
            <div className="profile-avatar">
              {getUserInitials()}
            </div>
          </div>
          <div className="profile-info">
            <h3 className="profile-name">{user?.username || "Guest User"}</h3>
            <p className="user-email">{user?.email || "No email provided"}</p>
          </div>
        </div>

        <nav className="account-navigation">
          <ul className="navigation-list">
            {menuItems.map((item) => (
              <li key={item.path} className="navigation-item">
                <NavLink
                  to={item.path}
                  exact={item.path === "/dashboard"}
                  activeClassName="current-route"
                  className="navigation-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="link-icon">{item.icon}</span>
                  <span className="link-text">{item.label}</span>
                </NavLink>
              </li>
            ))}
            <li className="navigation-item">
              <button className="navigation-link sign-out-btn" onClick={handleLogout}>
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
  );
};

export default AccountSidebar;