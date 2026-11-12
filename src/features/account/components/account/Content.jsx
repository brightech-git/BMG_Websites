import { useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { logout } from "../../../../redux/slices/userSlice";
import { queryClient } from "../../../../component/reactQuery/queryClient";
import LogoutModal from "../../../../component/logout/Logout";
import AccountSidebar from "./AccountSidebar/AccountSideBar";
import "./logout.css";

export default function AccountPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showLogout, setShowLogout] = useState(false);

    function confirmLogout() {
        dispatch(logout());
        for (const key of ["user", "user_token", "userMobileNumber", "pendingUser"]) {
            localStorage.removeItem(key);
        }
        queryClient.clear();
        navigate("/login", { replace: true });
    }

    return (
        <section aria-labelledby="account-title" className="min-h-screen bg-gradient-to-b from-orange-50 to-white px-3 py-5 sm:px-6 sm:py-8">
            <div className="mx-auto max-w-7xl">
                <h1 id="account-title" className="mb-4 text-3xl font-bold tracking-tight sm:mb-6 sm:text-4xl">
                    My account
                </h1>
                <div className="grid items-start gap-4 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-6">
                    <AccountSidebar openLogoutModal={() => setShowLogout(true)} />
                    <div className="min-w-0">
                        <Outlet />
                    </div>
                </div>
            </div>

            <LogoutModal
                isOpen={showLogout}
                onClose={() => setShowLogout(false)}
                onConfirm={confirmLogout}
                title="Sign out?"
                message="You can sign back in to view your orders and saved items."
                confirmText="Sign out"
                cancelText="Stay signed in"
                size="md"
                confirmButtonClass="bg-orange-700 hover:bg-orange-800"
                icon={<LogOut className="text-3xl text-orange-700" />}
            />
        </section>
    );
}
