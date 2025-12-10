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
import { useLocation } from "react-router-dom";

const AccountSidebar = ({ openLogoutModal }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => state.user.user);


  console.log('user in sidebar', user)
  //console.log('user in sidebar', user);
  const history = useHistory();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true);

  const menuItems = [
    { key: "Dashboard", icon: <FiUser size={18} />, label: "Dashboard", path: "/account/dashboard" },
    { key: "Orders", icon: <FiShoppingBag size={18} />, label: "Orders", path: "/account/orders" },
    { key: "Addresses", icon: <FiMapPin size={18} />, label: "Addresses", path: "/account/address" },
    { key: "Change Password", icon: <FiLock size={18} />, label: "Change Password", path: "/account/change-password" },
  ];


  const getUserInitials = () => {
    if (user?.username) {
      const names = user.username.trim().split(" ");
      if (names.length === 1) return names[0].charAt(0).toUpperCase();
      return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
    } else if (user?.user?.username) {
      const names = user.user.username.trim().split(" ");
      if (names.length === 1) return names[0].charAt(0).toUpperCase();
      return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
    }
    return "GU"; // Guest User
  };
console.log(location.pathname ,'pathname') 



  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(true);
  };

  const handleMenuClick = (key) => {
    switch (key) {
      case "Dashboard":
        history.push("/account/dashboard");
        break;
      case "Orders":
        history.push("/account/orders");
        break;
      case "Addresses":
        history.push("/account/address");
        break;
      case "Change Password":
        history.push("/account/change-password");
        break;
      case "Home":
        history.push("/");
        break;
      default:
        history.push("/account/dashboard");
    }
  };


  return (
    <section>
      <div className="account-navigation-panel">

        <div className='sidebar-content mobile-open'>
          <div className="user-profile-card">
            <div className="profile-avatar-container">
              <div className="profile-avatar">{getUserInitials()}</div>
            </div>
            <div className="profile-info">
              <h3 className="profile-name">{user?.username || user?.user.username || "Guest User"}</h3>
            </div>
          </div>

          <nav className="account-navigation">
            <ul className="navigation-list">
              {menuItems.map((item) => (
                console.log(location.pathname.toUpperCase().includes(item.label.toLowerCase()), 'location.pathname.includes(item.label)'),
                console.log(item.label.toLowerCase(), 'item.label'),
               
                <li key={item.key} className="navigation-item">
                  <button
                      className={`navigation-link ${location.pathname === item.path ? "current-route" : ""}`}
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