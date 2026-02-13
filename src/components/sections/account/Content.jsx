import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { logout } from "../../../redux/slices/userSlice";
import AccountSidebar from "./AccountSidebar/AccountSideBar";
import "./AccountStyles.css";
import "./logout.css";
import { queryClient } from "../../../component/reactQuery/queryClient";
import LogoutModal from "../../../component/logout/Logout";
import { LogOut } from "lucide-react";

const AccountPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

   const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
     const handleLogout = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(logout());
        localStorage.removeItem('user');
        localStorage.removeItem('user_token');
        localStorage.removeItem('userMobileNumber');
        localStorage.removeItem('pendingUser');
        queryClient.clear();
        navigate("/login");
      };
    
      const openLogoutModal = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLogoutModalOpen(true);
      };
    
      const closeLogoutModal = () => {
        setIsLogoutModalOpen(false);
      };
    
      const confirmLogout = () => {
        handleLogout(new Event('submit')); // Pass a dummy event
      };
      
  return (
    <>
      <section className="account-with-header">
        <div className="account-container">
          <div className="account-layout">
            {/* Fixed: Removed margin-bottom on mobile */}
            <aside className="w-full md:w-auto">
              <AccountSidebar openLogoutModal={() => setIsLogoutModalOpen(true)} />
            </aside>

            <main className="account-content flex-1 min-w-0">
              <Outlet />
            </main>
          </div>
        </div>
      </section>

    
  
        <LogoutModal
          isOpen={isLogoutModalOpen}
          onClose={closeLogoutModal}
          onConfirm={confirmLogout}
          title="Ready to Leave?"
          message="Are you sure you want to logout? You'll need to login again to access your account."
          confirmText="Yes, Logout"
          cancelText="Stay Logged In"
          size="md"
          confirmButtonClass="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400"
          icon={<LogOut className="text-4xl text-red-500" />}
        />
    
    </>
  );
};

export default AccountPage;