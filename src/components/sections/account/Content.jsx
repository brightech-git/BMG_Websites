import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { logout } from "../../../redux/slices/userSlice";
import AccountSidebar from "./AccountSidebar/AccountSideBar";
import "./AccountStyles.css";
import "./logout.css";
import { queryClient } from "../../../component/reactQuery/queryClient";

const AccountPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('user');
    localStorage.removeItem('user_token');
    localStorage.removeItem('userMobileNumber');
    localStorage.removeItem('pendingUser');
    queryClient.clear();
    navigate("/login", { replace: true });
    setIsModalOpen(false);
  };

  return (
    <>
      <section className="account-with-header">
        <div className="account-container">
          <div className="account-layout">
            {/* Fixed: Removed margin-bottom on mobile */}
            <aside className="w-full md:w-auto">
              <AccountSidebar openLogoutModal={() => setIsModalOpen(true)} />
            </aside>

            <main className="account-content flex-1 min-w-0">
              <Outlet />
            </main>
          </div>
        </div>
      </section>

      {/* Logout Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate__animated animate__fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl animate__animated animate__fadeInUp" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountPage;