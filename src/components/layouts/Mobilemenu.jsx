"use client";

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ChevronDown, X, Home, ShoppingBag, Info,
    Video, Mail, Grid2X2, User, Heart, ShoppingCart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './MobileMenu.css';
import Logo from "../../assets/icons/logo.png";
import RatesDropdown from './RatesDropdown';

// ─── Navigation helpers (same logic as desktop) ───────────────────────────────

const buildDirectLink = (header) => {
    const p = new URLSearchParams();
    p.set(header.linkKey, header.linkValue);
    return `/products-page?${p.toString()}`;
};

const buildMenuItemLink = (menuItem) => {
    const p = new URLSearchParams();
    if (menuItem.filterContentId) p.set("filterIds", menuItem.filterContentId.toString());
    return `/products-page?${p.toString()}`;
};

const buildCategoryAllLink = (menuItem) => {
    const p = new URLSearchParams();
    if (menuItem.menuKey && menuItem.value) p.set(menuItem.menuKey, menuItem.value);
    return `/products-page?${p.toString()}`;
};

const buildFilterLeafLink = (menuItem, filterKey, filterContentItem) => {
    const p = new URLSearchParams();
    if (menuItem.menuKey && menuItem.value) p.set(menuItem.menuKey, menuItem.value);
    if (filterContentItem.isRange) {
        p.set(`${filterKey.filterLabel}Range`, `${filterContentItem.min}-${filterContentItem.max}`);
    } else if (filterKey.isDirect) {
        p.set(`${filterKey.filterKeys}`, filterContentItem.filterValue);
    }
    else {
        p.set("filterIds", filterContentItem.id.toString());
    }
    return `/products-page?${p.toString()}`;
};


const buildItemNameLink = (menuItem, filterKey) => {

    console.log(menuItem, filterKey, 'menuItem')
    const p = new URLSearchParams();
    if (menuItem.menuKey && menuItem.value) p.set(menuItem.menuKey, menuItem.value);
    else {
        p.set("itemName", filterKey.itemName);
    }
    return `/products-page?${p.toString()}`;
}

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

// ─── Component ────────────────────────────────────────────────────────────────
const MobileMenu = ({ onClose, wishlistCount, cartCount, ratesData, headers = [] }) => {
    const navigate = useNavigate();

    // which header accordion is open (by index)
    const [activeHeaderIdx, setActiveHeaderIdx] = useState(null);
    // which menuList item accordion is open (by index, inside the active header)
    const [activeMenuIdx, setActiveMenuIdx] = useState(null);
    const [isClosing, setIsClosing] = useState(false);

    // Escape key
    useEffect(() => {
        const onEsc = (e) => { if (e.key === 'Escape') handleClose(); };
        document.addEventListener('keydown', onEsc);
        return () => document.removeEventListener('keydown', onEsc);
    }, []);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 300);
    };

    const go = (path) => {
        navigate(path);
        handleClose();
    };

    const toggleHeader = (idx) => {
        setActiveHeaderIdx(prev => prev === idx ? null : idx);
        setActiveMenuIdx(null);
    };

    const toggleMenu = (idx) => {
        setActiveMenuIdx(prev => prev === idx ? null : idx);
    };

    // ─── Static nav items (non-header items) ─────────────────────────────────
    const staticNav = [

        { id: 'shop', linkText: 'Shop', link: '/products-page', icon: <ShoppingBag size={20} />, color: 'text-amber-600' },
        { id: 'about', linkText: 'About', link: '/about', icon: <Info size={20} />, color: 'text-emerald-600' },
        { id: 'live', linkText: 'BMG Live', link: '/appointment', icon: <Video size={20} />, color: 'text-red-600' },
        { id: 'contact', linkText: 'Contact', link: '/contactStore', icon: <Mail size={20} />, color: 'text-indigo-600' },
    ];

    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-white/50 backdrop-blur-sm z-40"
                onClick={handleClose}
            />

            {/* Panel */}
            <motion.div
                initial="hidden" animate={isClosing ? 'exit' : 'visible'} exit="exit"
                variants={menuVariants}
                className="fixed top-0 left-0 h-full w-full bg-white shadow-2xl z-50 overflow-hidden"
                style={{ background: 'linear-gradient(135deg, var(--primary-color) 0%, #f8fafc 100%)' }}
            >
                {/* ── Header bar ── */}
                <div className="sticky top-0 z-10 bg-gradient-to-r from-orange-400 to-pink-600 p-2 shadow-lg">
                    <div className="flex items-center justify-between">
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.1, type: 'spring' }}
                            className="p-2 bg-white rounded-lg backdrop-blur-sm"
                        >
                            <Link to="/" className="flex items-center flex-shrink-0">
                                <img src={Logo} alt="BMG Jewellers" className="w-24 h-auto" />
                            </Link>
                        </motion.div>
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                            onClick={handleClose}
                            className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                            aria-label="Close menu"
                        >
                            <X size={20} />
                        </motion.button>
                    </div>
                </div>

                {/* ── Scrollable content ── */}
                <div className="h-[calc(90vh-100px)] overflow-y-auto pb-6">
                    <nav className="p-2">
                        <ul className="space-y-1">
                            <AnimatePresence>

                                <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}   className="px-4 py-3">
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
                                </motion.div>

                                {/* ── Dynamic headers from JSON ── */}
                                {headers.map((header, hIdx) => {
                                    const isDirect = !header.filterId && header.menuList.length === 0;
                                    const hasDropdown = header.menuList.length > 0 ;
                                    const isHeaderOpen = activeHeaderIdx === hIdx;

                                    return (
                                        <motion.li
                                            key={hIdx}
                                            variants={itemVariants}
                                            className={`relative rounded-xl overflow-hidden ${isHeaderOpen ? 'bg-gradient-to-r from-blue-50 to-indigo-50' : 'hover:bg-gray-50'}`}
                                        >
                                            <div className="px-4 py-3">
                                                {isDirect ? (
                                                    /* Scenario 1 — direct link */
                                                    <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
                                                        <button
                                                            onClick={() => go(buildDirectLink(header))}
                                                            className="font-semibold text-gray-800 group-hover:text-[var(--primary-hover-color)]"
                                                        >
                                                            <Home size={20} className="text-[var(--primary-hover-color)]" />
                                                            <span className="font-semibold text-gray-800 group-hover:text-[var(--primary-hover-color)]">
                                                                {header.name}
                                                            </span>
                                                        </button>
                                                    </motion.div>
                                                ) : (
                                                    /* Scenario 2 & 3 — accordion trigger */
                                                    <motion.button
                                                        onClick={() => toggleHeader(hIdx)}
                                                        className="flex items-center justify-between w-full group"
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <Grid2X2 size={20} className="text-purple-600" />
                                                            <span className="font-semibold text-gray-800 group-hover:text-[var(--primary-hover-color)]">
                                                                {header.name}
                                                            </span>
                                                        </div>
                                                        <motion.div
                                                            animate={{ rotate: isHeaderOpen ? 180 : 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="text-gray-400"
                                                        >
                                                            <ChevronDown size={18} />
                                                        </motion.div>
                                                    </motion.button>
                                                )}
                                            </div>

                                            {/* ── Expanded menu list ── */}
                                            <AnimatePresence>
                                                {hasDropdown && isHeaderOpen && (
                                                    <motion.div
                                                        variants={collapseVariants}
                                                        initial="hidden" animate="visible" exit="exit"
                                                        className="px-2 pb-3 overflow-hidden"
                                                    >
                                                        <div className="space-y-1">
                                                            {header.menuList.map((menuItem, mIdx) => {
                                                                const isCategory = !!menuItem.menuKey && !!menuItem.value;
                                                                const hasSubFilters = menuItem.filterKeys.length > 0 || menuItem.items.length > 0 ;
                                                                const isMenuOpen = activeMenuIdx === mIdx;

                                                                const isItemList = menuItem.isItem=== "Y" ;
                                                                const subFilterContent = isItemList ? menuItem.fitlerKeys : menuItem.items ;

                                                                return (
                                                                    <div
                                                                        key={mIdx}
                                                                        className="rounded-lg overflow-hidden border border-gray-100"
                                                                    >
                                                                        {/* Menu item row */}
                                                                        <motion.button
                                                                            onClick={() => {
                                                                                if (hasSubFilters) {
                                                                                    // toggle sub-filter panel
                                                                                    toggleMenu(mIdx);
                                                                                } else if (isCategory) {
                                                                                    // Scenario 3 leaf — no sub-filters, just navigate
                                                                                    go(buildCategoryAllLink(menuItem));
                                                                                } else if (menuItem.filterContentId) {
                                                                                    // Scenario 2 — filterContentId
                                                                                    go(buildMenuItemLink(menuItem));
                                                                                }
                                                                            }}
                                                                            className="flex items-center justify-between w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-white hover:from-amber-50 hover:to-orange-50 transition-all duration-200"
                                                                            whileTap={{ scale: 0.98 }}
                                                                        >
                                                                            <span className="font-semibold text-gray-700 text-[14px]">
                                                                                {menuItem.label}
                                                                            </span>

                                                                            <div className="flex items-center gap-2">
                                                                                {/* "All X" tap for categories */}
                                                                                {isCategory && hasSubFilters && (
                                                                                    <motion.span
                                                                                        className="text-[11px] text-amber-600 font-medium px-1"
                                                                                        whileTap={{ scale: 0.9 }}
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            go(buildCategoryAllLink(menuItem));
                                                                                        }}
                                                                                    >
                                                                                        All
                                                                                    </motion.span>
                                                                                )}
                                                                                {hasSubFilters && (
                                                                                    <motion.div
                                                                                        animate={{ rotate: isMenuOpen ? 180 : 0 }}
                                                                                        transition={{ duration: 0.2 }}
                                                                                        className="text-amber-500"
                                                                                    >
                                                                                        <ChevronDown size={15} />
                                                                                    </motion.div>
                                                                                )}
                                                                            </div>
                                                                        </motion.button>

                                                                        {/* Scenario 3: nested filterKeys → filterContent */}
                                                                        <AnimatePresence>
                                                                            {hasSubFilters && isMenuOpen && isItemList ?
                                                                                <motion.div
                                                                                    variants={collapseVariants}
                                                                                    initial="hidden" animate="visible" exit="exit"
                                                                                    className="bg-white overflow-hidden"
                                                                                >

                                                                                    <div className="px-2 py-2 flex flex-wrap gap-1.5">
                                                                                        {menuItem.items.map((item) => (
                                                                                            <div key={item.itemId} className='flex flex-wrap gap-1.5'>
                                                                                                <motion.button
                                                                                                  
                                                                                                    whileTap={{ scale: 0.95 }}
                                                                                                    onClick={() => go(buildItemNameLink(menuItem, item))}
                                                                                                    className="text-[12px] text-stone-600 bg-stone-50 hover:bg-amber-50 hover:text-amber-700 border border-stone-200 hover:border-amber-200 rounded-full px-3 py-1 transition-all duration-150"
                                                                                                >
                                                                                                    {item.itemName}
                                                                                                </motion.button>
                                                                                                {/* <div className="flex flex-wrap gap-1.5">
                                                                                                    {fk.filterContent.map((fc) => (
                                                                                                       
                                                                                                            {fc.filterTitle}
                                                                                                            {fc.isRange && (
                                                                                                                <span className="ml-1 text-[10px] text-stone-400">
                                                                                                                    ({fc.filterValue})
                                                                                                                </span>
                                                                                                            )}
                                                                                                        </motion.button>
                                                                                                    ))}
                                                                                                </div> */}
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                </motion.div>
                                                                              : 
                                                                                <motion.div
                                                                                    variants={collapseVariants}
                                                                                    initial="hidden" animate="visible" exit="exit"
                                                                                    className="bg-white overflow-hidden"
                                                                                >

                                                                                    <div className="px-3 py-2 space-y-3">
                                                                                        {menuItem.filterKeys.map((fk) => (
                                                                                            <div key={fk.id}>
                                                                                                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5 px-1">
                                                                                                    {fk.filterLabel}
                                                                                                </p>
                                                                                                <div className="flex flex-wrap gap-1.5">
                                                                                                    {fk.filterContent.map((fc) => (
                                                                                                        <motion.button
                                                                                                            key={fc.id}
                                                                                                            whileTap={{ scale: 0.95 }}
                                                                                                            onClick={() => go(buildFilterLeafLink(menuItem, fk, fc))}
                                                                                                            className="text-[12px] text-stone-600 bg-stone-50 hover:bg-amber-50 hover:text-amber-700 border border-stone-200 hover:border-amber-200 rounded-full px-3 py-1 transition-all duration-150"
                                                                                                        >
                                                                                                            {fc.filterTitle}
                                                                                                            {fc.isRange && (
                                                                                                                <span className="ml-1 text-[10px] text-stone-400">
                                                                                                                    ({fc.filterValue})
                                                                                                                </span>
                                                                                                            )}
                                                                                                        </motion.button>
                                                                                                    ))}
                                                                                                </div>
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                </motion.div>
                                                                             }
                                                                         
                                                                              
                                                                        </AnimatePresence>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
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

                        {/* Rates */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex bg-gradient-to-r items-center p-3 m-2 justify-center from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
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
                    className="fixed w-full bottom-0 bg-white p-2 shadow-lg"
                >
                    <div className="flex items-center justify-center gap-10">
                        <motion.button
                            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            className="text-gray-600 hover:text-[var(--primary-hover-color)] transition-colors"
                            onClick={() => { navigate('/account'); handleClose(); }}
                        >
                            <div className="text-center">
                                <div className="mx-auto w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full">
                                    <User size={22} />
                                </div>
                                <span className="text-xs mt-1 font-medium">Account</span>
                            </div>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            className="text-gray-600 hover:text-pink-700 transition-colors relative"
                            onClick={() => { navigate('/wishlist'); handleClose(); }}
                        >
                            <div className="text-center relative">
                                <div className="mx-auto w-10 h-10 flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-50 rounded-full">
                                    <Heart size={18} />
                                </div>
                                <span className="text-xs mt-1 font-medium">Wishlist</span>
                                {wishlistCount > 0 && (
                                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-sm"
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
                                        className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-sm"
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