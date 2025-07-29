import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiUser,
  FiShoppingBag,
  FiMapPin,
  FiHeart,
  FiShoppingCart,
  FiLock,
  FiLogOut,
} from "react-icons/fi";
import "./AccountSideBarStyles.css";

const AccountSidebar = () => {
  const menuItems = [
    { path: "/dashboard", icon: <FiUser size={18} />, label: "Dashboard" },
    { path: "/orders", icon: <FiShoppingBag size={18} />, label: "Orders" },
    {
      path: "/AddressManager",
      icon: <FiMapPin size={18} />,
      label: "Addresses",
    },
    { path: "/wishlist", icon: <FiHeart size={18} />, label: "Wishlist" },
    { path: "/cartsection", icon: <FiShoppingCart size={18} />, label: "Cart" },
    { path: "/change-password", icon: <FiLock size={18} />, label: "Security" },
  ];

  const handleLogout = () => {
    // Add your logout logic here
    console.log("User logged out");
    // Example: history.push('/login');
  };

  return (
    <aside className="account-sidebar">
      <div className="user-profile">
        <div className="avatar">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="User profile"
          />
        </div>
        <div className="user-details">
          <h3>John Benjamin</h3>
          <p className="badge">Gold Member</p>
        </div>
      </div>

      <nav className="sidebar-menu">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                exact={item.path === "/account/dashboard"}
                activeClassName="active"
                className="menu-item"
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </NavLink>
            </li>
          ))}
          <li>
            <button className="menu-item logout" onClick={handleLogout}>
              <span className="icon">
                <FiLogOut size={18} />
              </span>
              <span className="label">Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AccountSidebar;
