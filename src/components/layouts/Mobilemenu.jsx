"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ChevronDown, X, Home, ShoppingBag, Info,
    Video, Mail, Grid2X2, User, Heart, ShoppingCart, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './MobileMenu.css';
import Logo from "../../assets/icons/logo.png";
import RatesDropdown from './RatesDropdown';

// ─── Navigation helpers ───────────────────────────────────────────────────────

const buildLink = (link) => {
    if (!link) return "/";
    return link.startsWith("/") ? link : `/${link}`;
};

// ─── Animation variants ───────────────────────────────────────────────────────
const menuVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: {
        x: 0, opacity: 1,
        transition: { type: 'spring', stiffness: 300, damping: 30, mass: 0.8, staggerChildren: 0.05, delayChildren: 0.1 }
    },
    exit: { x: '-100%', opacity: 0, transition: { type: 'spring', stiffness: 300, damping: 30, duration: 0.3 } },
};

const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 400 } },
};

const collapseVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
        height: 'auto', opacity: 1,
        transition: { height: { duration: 0.3 }, opacity: { duration: 0.2, delay: 0.05 } }
    },
    exit: {
        height: 0, opacity: 0,
        transition: { height: { duration: 0.2 }, opacity: { duration: 0.1 } }
    },
};

// ─── Recursive nested menu accordion ──────────────────────────────────────────
const MenuAccordion = ({ items, go, depth = 0 }) => {
    const [openIdx, setOpenIdx] = useState(null);

    return (
        <div className={depth > 0 ? "pl-3 pt-1 space-y-1.5" : "space-y-1"}>
            {items.map((item, idx) => {
                const hasChildren = item.subLayers?.length > 0;
                const isOpen = openIdx === idx;

                return (
                    <div
                        key={item.id}
                        className={depth > 0
                            ? "rounded-lg overflow-hidden bg-stone-50 border border-stone-100"
                            : "rounded-lg overflow-hidden border border-gray-100"}
                    >
                        <motion.button
                            onClick={() => hasChildren ? setOpenIdx(isOpen ? null : idx) : go(buildLink(item.link))}
                            className={`flex items-center justify-between w-full px-4 py-3 transition-all duration-200 ${
                                depth > 0
                                    ? "bg-transparent hover:text-amber-700"
                                    : "bg-gradient-to-r from-gray-50 to-white hover:from-amber-50 hover:to-orange-50"
                            }`}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className={`font-semibold text-[14px] ${depth > 0 ? "text-stone-600" : "text-gray-700"}`}>
                                {item.label}
                            </span>
                            <div className="flex items-center gap-2">
                                {hasChildren && (
                                    <motion.span
                                        className="text-[11px] text-amber-600 font-medium px-1"
                                        whileTap={{ scale: 0.9 }}
                                        onClick={(e) => { e.stopPropagation(); go(buildLink(item.link)); }}
                                    >
                                        All
                                    </motion.span>
                                )}
                                {hasChildren && (
                                    <motion.div
                                        animate={{ rotate: isOpen ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-amber-500"
                                    >
                                        <ChevronDown size={15} />
                                    </motion.div>
                                )}
                            </div>
                        </motion.button>

                        <AnimatePresence>
                            {hasChildren && isOpen && (
                                <motion.div
                                    variants={collapseVariants}
                                    initial="hidden" animate="visible" exit="exit"
                                    className="bg-white overflow-hidden px-2 pb-2"
                                >
                                    <MenuAccordion items={item.subLayers} go={go} depth={depth + 1} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
};

// ─── Component ────────────────────────────────────────────────────────────────
const MobileMenu = ({ onClose, onLogout, wishlistCount, cartCount, ratesData, headers = [] }) => {
    const navigate = useNavigate();

    const [activeHeaderIdx, setActiveHeaderIdx] = useState(null);
    const closeRef = useRef(null);

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        closeRef.current?.focus();
        return () => { document.body.style.overflow = previousOverflow; };
    }, []);

    const handleClose = onClose;

    const go = (path) => {
        navigate(path);
        handleClose();
    };

    const toggleHeader = (idx) => {
        setActiveHeaderIdx(prev => prev === idx ? null : idx);
    };

    const staticNav = [
        { id: 'shop', linkText: 'Shop', link: '/products-page', icon: <ShoppingBag size={20} />, color: 'text-orange-700' },
        { id: 'about', linkText: 'About', link: '/about', icon: <Info size={20} />, color: 'text-orange-700' },
        { id: 'live', linkText: 'BMG Live', link: '/appointment', icon: <Video size={20} />, color: 'text-orange-700' },
        { id: 'contact', linkText: 'Contact', link: '/contact', icon: <Mail size={20} />, color: 'text-orange-700' },
    ];

    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-orange-950/40 backdrop-blur-sm z-40"
                onClick={handleClose}
            />

            {/* Panel */}
            <motion.div
                initial="hidden" animate="visible" exit="exit"
                variants={menuVariants}
                role="dialog"
                aria-modal="true"
                aria-label="Store menu"
                onKeyDown={(event) => {
                    if (event.key === 'Escape') handleClose();
                    if (event.key !== 'Tab') return;
                    const controls = [...event.currentTarget.querySelectorAll('a[href], button:not([disabled])')]
                        .filter((control) => control.getClientRects().length);
                    const boundary = event.shiftKey ? controls[0] : controls.at(-1);
                    if (document.activeElement === boundary) {
                        event.preventDefault();
                        (event.shiftKey ? controls.at(-1) : controls[0])?.focus();
                    }
                }}
                className="store-menu-panel fixed top-0 left-0 bg-white shadow-2xl overflow-hidden"
            >
                {/* ── Header bar ── */}
                <div className="store-menu-heading">
                    <div className="flex items-center justify-between">
                        <motion.div
                            className="p-1"
                        >
                            <Link to="/" onClick={handleClose} className="flex items-center flex-shrink-0">
                                <img src={Logo} alt="BMG Jewellers" className="w-24 h-auto" />
                            </Link>
                        </motion.div>
                        <motion.button
                            ref={closeRef}
                            type="button"
                            onClick={handleClose}
                            className="store-header-action"
                            aria-label="Close menu"
                        >
                            <X size={20} />
                        </motion.button>
                    </div>
                </div>

                {/* ── Scrollable content ── */}
                <div className="store-menu-content">
                    <nav className="p-2" aria-label="Shop navigation">
                      
                        <ul className="space-y-1">
                            <AnimatePresence>

                                {/* <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }} className="px-4 py-3">
                                    <Link
                                        to={'/'}
                                        onClick={handleClose}
                                        className="flex items-center gap-3 w-full group"
                                    >
                                        <Home size={20} className="text-[var(--primary-hover-color)]" />
                                        <span className="font-semibold text-gray-800 group-hover:text-[var(--primary-hover-color)]">
                                            Home
                                        </span>
                                    </Link>
                                </motion.div> */}

                                {/* ── Dynamic headers from API ── */}
                                {headers.map((header, hIdx) => {
                                    const hasDropdown = header.subLayers?.length > 0;
                                    const isHeaderOpen = activeHeaderIdx === hIdx;

                                    return (
                                        <motion.li
                                            key={header.id}
                                            variants={itemVariants}
                                            className={`relative rounded-xl overflow-hidden ${isHeaderOpen ? 'bg-gradient-to-r from-orange-50 to-orange-100' : 'hover:bg-gray-50'}`}
                                        >
                                            <div className="px-4 py-3">
                                                <motion.button
                                                    onClick={() => hasDropdown ? toggleHeader(hIdx) : go(buildLink(header.link))}
                                                    className="flex items-center justify-between w-full group"
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Grid2X2 size={20} className="text-purple-600" />
                                                        <span className="font-semibold text-gray-800 group-hover:text-[var(--primary-hover-color)]">
                                                            {header.label}
                                                        </span>
                                                    </div>
                                                    {hasDropdown && (
                                                        <motion.div
                                                            animate={{ rotate: isHeaderOpen ? 180 : 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="text-gray-400"
                                                        >
                                                            <ChevronDown size={18} />
                                                        </motion.div>
                                                    )}
                                                </motion.button>
                                            </div>

                                            {/* ── Expanded menu list ── */}
                                            <AnimatePresence>
                                                {hasDropdown && isHeaderOpen && (
                                                    <motion.div
                                                        variants={collapseVariants}
                                                        initial="hidden" animate="visible" exit="exit"
                                                        className="px-2 pb-3 overflow-hidden"
                                                    >
                                                        <MenuAccordion items={header.subLayers} go={go} />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.li>
                                    );
                                })}

                                {/* ── Static nav items ── */}
                                {staticNav.map((item) => (
                                    <motion.li
                                        key={item.id}
                                        variants={itemVariants}
                                        className="relative rounded-xl overflow-hidden hover:bg-gray-50"
                                    >
                                        <div className="px-4 py-3">
                                            <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
                                                <Link
                                                    to={item.link}
                                                    onClick={handleClose}
                                                    className="flex items-center gap-3 w-full group"
                                                >
                                                    <span className={item.color}>{item.icon}</span>
                                                    <span className="font-semibold text-gray-800 group-hover:text-[var(--primary-hover-color)]">
                                                        {item.linkText}
                                                    </span>
                                                </Link>
                                            </motion.div>
                                        </div>
                                    </motion.li>
                                ))}
                            </AnimatePresence>
                        </ul>
  {onLogout && (
                            <button type="button" onClick={onLogout}
                                className="flex items-center gap-3 ml-2 px-2 py-2 text-orange-800 font-semibold">
                                <LogOut size={19} aria-hidden="true" /> Log out
                            </button>
                        )}
                        {/* Rates */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex bg-gradient-to-r items-center p-3 m-2 justify-center from-orange-50 to-orange-100 rounded-xl border border-orange-100"
                        >
                            <RatesDropdown ratesData={ratesData} />
                        </motion.div>

                        {/* Legal */}
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-wrap justify-center gap-4 text-xs text-gray-500"
                        >
                            <Link to="/privacypolicy" onClick={handleClose} className="hover:text-[var(--primary-hover-color)] transition-colors">Privacy Policy</Link>
                            <Link to="/terms-conditions" onClick={handleClose} className="hover:text-[var(--primary-hover-color)] transition-colors">Terms of Service</Link>
                            <Link to="/cancellation-return-policy" onClick={handleClose} className="hover:text-[var(--primary-hover-color)] transition-colors">Return Policy</Link>
                        </motion.div>
                    </nav>
                </div>

                {/* ── Bottom Navigation ── */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="store-menu-footer"
                >
                    <div className="flex items-center justify-around gap-2">
                        <motion.button
                            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            className="text-gray-600 hover:text-[var(--primary-hover-color)] transition-colors"
                            onClick={() => { navigate('/account'); handleClose(); }}
                        >
                            <div className="text-center">
                                <div className="mx-auto w-10 h-10 flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 rounded-full">
                                    <User size={22} />
                                </div>
                                <span className="text-xs mt-1 font-medium">Account</span>
                            </div>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            className="text-gray-600 hover:text-orange-800 transition-colors relative"
                            onClick={() => { navigate('/wishlist'); handleClose(); }}
                        >
                            <div className="text-center relative">
                                <div className="mx-auto w-10 h-10 flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 rounded-full">
                                    <Heart size={18} />
                                </div>
                                <span className="text-xs mt-1 font-medium">Wishlist</span>
                                {wishlistCount > 0 && (
                                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-700 to-orange-800 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-sm"
                                    >
                                        {wishlistCount}
                                    </motion.span>
                                )}
                            </div>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            className="text-gray-600 hover:text-amber-700 transition-colors relative"
                            onClick={() => { navigate('/cart'); handleClose(); }}
                        >
                            <div className="text-center relative">
                                <div className="mx-auto w-10 h-10 flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 rounded-full">
                                    <ShoppingCart size={18} />
                                </div>
                                <span className="text-xs mt-1 font-medium">Cart</span>
                                {cartCount > 0 && (
                                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-700 to-orange-800 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-sm"
                                    >
                                        {cartCount}
                                    </motion.span>
                                )}
                            </div>
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
};

export default MobileMenu;
