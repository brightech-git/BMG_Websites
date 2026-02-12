import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiUser,
  FiShoppingBag,
  FiMapPin,
  FiLock,
  FiLogOut,
} from "react-icons/fi";
import "animate.css";

const AccountSidebar = ({ openLogoutModal }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user.user);
  const [activeItem, setActiveItem] = useState("dashboard");
  const [isHovered, setIsHovered] = useState(false);

  const menuItems = [
    {
      key: "dashboard",
      icon: <FiUser size={20} />,
      label: "Dashboard",
      path: "dashboard",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      key: "orders",
      icon: <FiShoppingBag size={20} />,
      label: "Orders",
      path: "orders",
      gradient: "from-green-500 to-emerald-600",
    },
    {
      key: "address",
      icon: <FiMapPin size={20} />,
      label: "Addresses",
      path: "address",
      gradient: "from-purple-500 to-pink-600",
    },
    {
      key: "change-password",
      icon: <FiLock size={20} />,
      label: "Password",
      path: "change-password",
      gradient: "from-orange-500 to-red-600",
    },
  ];

  useEffect(() => {
    const active = menuItems.find(item =>
      location.pathname.endsWith(`/account/${item.path}`) ||
      (item.path === "dashboard" && location.pathname === "/account")
    );
    if (active) setActiveItem(active.key);
  }, [location.pathname]);

  const getUserInitials = () => {
    const username = user?.username || user?.user?.username;
    if (!username) return "GU";
    const names = username.trim().split(" ");
    return names.length === 1
      ? names[0][0].toUpperCase()
      : `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <aside className="w-full animate__animated animate__fadeIn">

      {/* ========== MOBILE LAYOUT - Fixed ========== */}
      <div className="block md:hidden space-y-3">

        {/* Compact Profile Card - Full Width */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg p-3 border border-gray-100 mx-2">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                {getUserInitials()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-500">{greeting()}</p>
              <h4 className="font-semibold text-gray-900 text-sm truncate">
                {user?.username || user?.user?.username || "Guest User"}
              </h4>
            </div>
          </div>
        </div>

        {/* Navigation Grid - 4 Columns, Full Width */}
        <div className="grid grid-cols-4 gap-1.5 px-2">
          {menuItems.map((item, index) => (
            <button
              key={item.key}
              className={`
                group relative overflow-hidden
                ${activeItem === item.key
                  ? `bg-gradient-to-r ${item.gradient} text-white shadow-md`
                  : 'bg-white/95 backdrop-blur-xl border border-gray-100 text-gray-700 hover:border-gray-200'
                }
                rounded-xl p-2 transition-all duration-300
                hover:shadow-lg active:scale-[0.98]
                animate__animated animate__fadeInUp
                flex flex-col items-center justify-center
              `}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => handleNavigate(item.path)}
            >
              <div className={`
                absolute inset-0 bg-gradient-to-r ${item.gradient} 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300
              `}></div>

              <span className={`
                relative mb-1 transition-all duration-300
                ${activeItem === item.key ? 'text-white' : 'text-gray-600 group-hover:text-white'}
                group-hover:scale-110
              `}>
                {item.icon}
              </span>

              <span className={`
                relative text-[10px] font-medium transition-all duration-300 text-center leading-tight
                ${activeItem === item.key ? 'text-white' : 'text-gray-700 group-hover:text-white'}
              `}>
                {item.label}
              </span>

              {activeItem === item.key && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate__animated animate__pulse animate__infinite"></span>
              )}
            </button>
          ))}
        </div>

        {/* Logout Button - Full Width */}
        <div className="px-2">
          <button
            onClick={openLogoutModal}
            className="
              w-full group relative overflow-hidden
              bg-gradient-to-r from-rose-50 to-pink-50
              hover:from-rose-500 hover:to-pink-600
              rounded-xl p-2.5 transition-all duration-300
              hover:shadow-lg active:scale-[0.98]
              border border-rose-100 hover:border-transparent
              flex items-center justify-center gap-2
              animate__animated animate__fadeInUp
            "
            style={{ animationDelay: '250ms' }}
          >
            <FiLogOut className="
              text-rose-500 group-hover:text-white 
              transition-all duration-300 group-hover:translate-x-1
            " size={16} />
            <span className="
              font-medium text-rose-500 group-hover:text-white text-xs
              transition-all duration-300
            ">
              Sign Out
            </span>
          </button>
        </div>
      </div>

      {/* ========== DESKTOP LAYOUT - Fixed ========== */}
      <div className="hidden md:block sticky top-20 w-64 lg:w-72 xl:w-80 animate__animated animate__fadeInLeft">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-5 border border-gray-100 hover:shadow-2xl hover:border-gray-200 transition-all duration-300">

          {/* User Profile Card */}
          <div className="relative mb-4 group" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFF7ED] to-[#FFEDD5] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex flex-col items-center p-3">
              <div className="relative mb-3">
                <div className={`
                  w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-[#F97316] to-[#EA580C] 
                  rounded-full flex items-center justify-center text-white 
                  font-bold text-2xl lg:text-3xl shadow-lg transform transition-all duration-500
                  ${isHovered ? 'scale-110 rotate-12' : 'scale-100 rotate-0'}
                `}>
                  {getUserInitials()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 lg:w-5 lg:h-5 bg-green-500 rounded-full border-2 lg:border-4 border-white animate__animated animate__pulse animate__infinite"></div>
                <div className="absolute -top-2 -right-2 w-6 h-6 lg:w-8 lg:h-8 bg-yellow-400 rounded-full opacity-50 blur-md"></div>
              </div>

              <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-1 text-center animate__animated animate__fadeIn">
                {user?.username || user?.user?.username || "Guest User"}
              </h3>
              <p className="text-xs text-gray-500">{greeting()}</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="space-y-1">
            {menuItems.map((item, index) => (
              <button
                key={item.key}
                className={`
                  w-full group relative overflow-hidden
                  ${activeItem === item.key
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                  rounded-xl px-3 py-2.5 lg:px-4 lg:py-3 transition-all duration-300
                  transform hover:scale-[1.02] active:scale-[0.98]
                  animate__animated animate__fadeInUp
                `}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => handleNavigate(item.path)}
              >
                <div className={`
                  absolute inset-0 bg-gradient-to-r ${item.gradient} 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300
                `}></div>

                <div className="relative flex items-center">
                  <span className={`
                    mr-3 transition-all duration-300
                    ${activeItem === item.key ? 'text-white' : 'text-gray-500 group-hover:text-white'}
                    group-hover:scale-110 group-hover:rotate-3
                  `}>
                    {item.icon}
                  </span>

                  <span className={`
                    font-medium transition-all duration-300 flex-1 text-left text-sm lg:text-base
                    ${activeItem === item.key ? 'text-white' : 'text-gray-700 group-hover:text-white'}
                  `}>
                    {item.label}
                  </span>

                  {activeItem === item.key && (
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate__animated animate__pulse animate__infinite"></span>
                  )}
                </div>
              </button>
            ))}

            {/* Desktop Logout */}
            <div className="pt-3 mt-3 border-t border-gray-100">
              <button
                onClick={openLogoutModal}
                className="
                  w-full group relative overflow-hidden
                  bg-gradient-to-r from-rose-50 to-pink-50
                  hover:from-rose-500 hover:to-pink-600
                  rounded-xl px-3 py-2.5 lg:px-4 lg:py-3 transition-all duration-300
                  transform hover:scale-[1.02] active:scale-[0.98]
                  border border-rose-100 hover:border-transparent
                  animate__animated animate__fadeInUp
                "
                style={{ animationDelay: '250ms' }}
              >
                <div className="relative flex items-center justify-center">
                  <FiLogOut className="
                    mr-2 text-rose-500 group-hover:text-white 
                    transition-all duration-300 group-hover:translate-x-1
                  " size={16} />
                  <span className="
                    font-medium text-rose-500 group-hover:text-white text-sm lg:text-base
                    transition-all duration-300
                  ">
                    Sign Out
                  </span>
                </div>
              </button>
            </div>
          </nav>

          {/* Desktop Decorative Elements */}
          <div className="mt-4 pt-3 text-center">
            <p className="text-[10px] lg:text-xs text-gray-400">
              Secured by encryption
            </p>
            <div className="flex justify-center gap-2 mt-2">
              <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-blue-400 rounded-full animate__animated animate__pulse animate__infinite" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-indigo-400 rounded-full animate__animated animate__pulse animate__infinite" style={{ animationDelay: '200ms' }}></div>
              <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-purple-400 rounded-full animate__animated animate__pulse animate__infinite" style={{ animationDelay: '400ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AccountSidebar;