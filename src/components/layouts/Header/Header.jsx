import { useLayoutEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Heart, LogOut, Menu, ShoppingCart, User, Video } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import Mobilemenu from "../Mobilemenu";
import Logo from "../../../assets/icons/logo.png";
import ItemSearch from "../Search";
import { logout } from "../../../redux/slices/userSlice";
import { useFavorites } from "../../../features/wishlist/hooks/favorites/useFavoritesQuery";
import { useCart } from "../../../features/cart/hooks/cart/useCartQuery";
import { useRatesQuery } from "../../../features/catalog/hooks/rate/useRatesQuery";
import { useGetHeaderFilters } from "../../../features/catalog/hooks/product/useFilterProducts";
import PincodeModal from "../DeliveryPincodeHeader";
import RatesDropdown from "../RatesDropdown";
import { queryClient } from "../../../component/reactQuery/queryClient";
import LogoutModal from "../../../component/logout/Logout";
import { ProductFiltersNav } from "./ProductFiltersNav";
import "./Header.css";

function HeaderAction({ to, label, icon: Icon, count = 0 }) {
  return (
    <NavLink to={to} className="store-header-action" title={label}
      aria-label={count > 0 ? `${label}, ${count} items` : label}>
      <Icon size={20} aria-hidden="true" />
      {count > 0 && (
        <span className="store-header-count" aria-hidden="true">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </NavLink>
  );
}

export default function Header({ isAuthenticated }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const spacerRef = useRef(null);
  const menuButtonRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { data: ratesData } = useRatesQuery();
  const { favoritesCount } = useFavorites({ enabled: isAuthenticated });
  const { cartCount } = useCart({ enabled: isAuthenticated });
  const { data: headerFiltersResponse, isLoading } = useGetHeaderFilters();
  const headers = headerFiltersResponse?.data || [];

  useLayoutEffect(() => {
    const header = headerRef.current;
    const spacer = spacerRef.current;
    const resize = () => { spacer.style.height = `${header.offsetHeight}px`; };
    const observer = new ResizeObserver(resize);
    resize();
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => {
    setMobileMenuOpen(false);
    menuButtonRef.current?.focus();
  };

  const confirmLogout = () => {
    setIsLogoutModalOpen(false);
    dispatch(logout());
    ["user", "user_token", "userMobileNumber", "pendingUser"].forEach((key) =>
      localStorage.removeItem(key)
    );
    queryClient.clear();
    navigate("/login");
  };

  return (
    <>
      <div ref={spacerRef} aria-hidden="true" />
      <header ref={headerRef} className="store-header">
        <div className="store-header-utility">
          <div className="store-header-shell store-header-utility-inner">
            <Link to="/appointment" className="store-header-live">
              <Video size={17} aria-hidden="true" /> BMG Live
            </Link>
            <RatesDropdown ratesData={ratesData} />
          </div>
        </div>
        <div className="store-header-shell store-header-main">
          <Link to="/" className="store-header-logo">
            <img src={Logo} alt="BMG Jewellers home" />
          </Link>
          <div className="store-header-search"><ItemSearch /></div>
          <div className="store-header-delivery"><PincodeModal /></div>
          <div className="store-header-actions">
            <HeaderAction to={isAuthenticated ? "/account" : "/login"}
              label={isAuthenticated ? "Account" : "Log in"} icon={User} />
            <HeaderAction to="/wishlist" label="Wishlist" icon={Heart} count={isAuthenticated ? favoritesCount : 0} />
            <HeaderAction to="/cart" label="Cart" icon={ShoppingCart} count={isAuthenticated ? cartCount : 0} />
            {isAuthenticated && (
              <button type="button" className="store-header-action store-header-logout" aria-label="Log out"
                title="Log out" onClick={() => setIsLogoutModalOpen(true)}>
                <LogOut size={19} aria-hidden="true" />
              </button>
            )}
            <button type="button" ref={menuButtonRef} className="store-header-action store-header-menu"
              aria-label="Open menu" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen(true)}>
              <Menu size={22} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="store-header-categories">
          <div className="store-header-shell">
            <ProductFiltersNav headers={headers} isLoading={isLoading} />
          </div>
        </div>
      </header>

      {isAuthenticated && (
        <LogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={confirmLogout} title="Log out?" message="You can log back in to access your account."
          confirmText="Log out" cancelText="Stay logged in" size="md"
          confirmButtonClass="bg-orange-700 hover:bg-orange-800" icon={<LogOut className="text-3xl text-orange-700" />} />
      )}

      <AnimatePresence>
        {mobileMenuOpen && (
          <Mobilemenu onClose={closeMenu}
            onLogout={isAuthenticated ? () => { closeMenu(); setIsLogoutModalOpen(true); } : undefined}
            cartCount={isAuthenticated ? cartCount : 0} wishlistCount={isAuthenticated ? favoritesCount : 0}
            ratesData={ratesData} headers={headers} />
        )}
      </AnimatePresence>
    </>
  );
}
