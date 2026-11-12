import { LayoutGrid, LockKeyhole, LogOut, MapPin, ShoppingBag } from "lucide-react";
import { useSelector } from "react-redux";
import { NavLink, useMatch } from "react-router-dom";

const links = [
    { label: "Overview", to: "/account/dashboard", icon: LayoutGrid },
    { label: "Orders", to: "/account/orders", icon: ShoppingBag },
    { label: "Addresses", to: "/account/address", icon: MapPin },
    { label: "Password", to: "/account/change-password", icon: LockKeyhole },
];

export default function AccountSidebar({ openLogoutModal }) {
    const isAccountIndex = Boolean(useMatch({ path: "/account", end: true }));
    const user = useSelector((state) => state.user.user);
    const name = (user?.username || user?.user?.username || "").trim() || "BMG shopper";
    const initials = name.split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase();

    return (
        <aside className="min-w-0 rounded-2xl border border-orange-100 bg-white p-3 shadow-sm sm:p-4">
            <div className="mb-3 flex items-center gap-3 px-1 py-2">
                <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-orange-100 font-bold text-[var(--brand-hover)]">
                    {initials}
                </span>
                <p className="min-w-0 break-words font-bold">{name}</p>
            </div>

            <nav aria-label="Account navigation" className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-1">
                {links.map(({ label, to, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={isAccountIndex && label === "Overview" ? "/account" : to}
                        className={({ isActive }) => `flex min-h-11 min-w-0 items-center gap-2 rounded-xl border px-2.5 text-sm font-bold ${
                            isActive
                                ? "border-orange-200 bg-orange-100 text-[var(--brand-hover)]"
                                : "border-orange-100 bg-white text-stone-700 hover:bg-orange-50"
                        }`}
                    >
                        <Icon size={17} className="shrink-0" aria-hidden="true" />
                        {label}
                    </NavLink>
                ))}
            </nav>

            <button
                type="button"
                onClick={openLogoutModal}
                className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl px-2.5 text-sm font-bold text-[var(--brand-hover)] hover:bg-orange-50"
            >
                <LogOut size={17} aria-hidden="true" />
                Sign out
            </button>
        </aside>
    );
}
