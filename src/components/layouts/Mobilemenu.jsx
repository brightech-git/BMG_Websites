import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ChevronDown,
    X,
    Home,
    ShoppingBag,
    Info,
    Video,
    Mail,
    ChevronRight,
    Grid2X2,
    Gem,
    User,
    Heart,
    ShoppingCart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import headerNavByShopId from './headerNavByShopId';
import './MobileMenu.css';
import Logo from "./logo.png";
import RatesDropdown from './RatesDropdown';

const Mobilemenu = ({ onClose, wishlistCount, cartCount, ratesData }) => {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(null);
    const [activeSectionIndex, setActiveSectionIndex] = useState(null);
    const [isClosing, setIsClosing] = useState(false);
    const headerNavData = headerNavByShopId();

    // Handle escape key
    useEffect(() => {
        const handleEscKey = (e) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => document.removeEventListener('keydown', handleEscKey);
    }, []);

    // Prevent body scroll when menu is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const toggleMenu = (index) => {
        setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
        setActiveSectionIndex(null);
    };

    const baseurl = "https://app.bmgjewellers.com";

    const toggleSection = (secIdx) => {
        setActiveSectionIndex((prevIndex) => (prevIndex === secIdx ? null : secIdx));
    };

    const navigationmenu = [
        {
            id: 1,
            linkText: 'Home',
            link: '/',
            icon: <Home size={20} />,
            color: 'text-[var(--primary-hover-color)]'
        },
        {
            id: 2,
            linkText: 'Categories',
            child: true,
            mega: true,
            submenu: headerNavData.menuSections || [],
            icon: <Grid2X2 size={20} />,
            color: 'text-purple-600'
        },
        {
            id: 3,
            linkText: 'Shop',
            link: '/products-page',
            icon: <ShoppingBag size={20} />,
            color: 'text-amber-600'
        },
        {
            id: 4,
            linkText: 'About',
            link: '/about',
            icon: <Info size={20} />,
            color: 'text-emerald-600'
        },
        {
            id: 5,
            linkText: 'BMG Live',
            link: '/appointment',
            icon: <Video size={20} />,
            color: 'text-red-600'
        },
        {
            id: 6,
            linkText: 'Contact',
            link: '/contactStore',
            icon: <Mail size={20} />,
            color: 'text-indigo-600'
        },
    ];

    const handleClick = (keyName, keyValue) => {
        const queryParams = new URLSearchParams();
        queryParams.append(keyName, keyValue);
        navigate(`/products-page?${queryParams.toString()}`);
        handleClose();
    };

    const menuVariants = {
        hidden: { x: '-100%', opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.8,
                staggerChildren: 0.05,
                delayChildren: 0.1
            }
        },
        exit: {
            x: '-100%',
            opacity: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { x: -20, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 400 }
        }
    };

    const submenuVariants = {
        hidden: { height: 0, opacity: 0 },
        visible: {
            height: "auto",
            opacity: 1,
            transition: {
                height: { duration: 0.3 },
                opacity: { duration: 0.2, delay: 0.1 }
            }
        },
        exit: {
            height: 0,
            opacity: 0,
            transition: {
                height: { duration: 0.2 },
                opacity: { duration: 0.1 }
            }
        }
    };

    const sectionVariants = {
        hidden: { height: 0, opacity: 0 },
        visible: {
            height: "auto",
            opacity: 1,
            transition: {
                height: { duration: 0.25 },
                opacity: { duration: 0.15, delay: 0.05 }
            }
        }
    };

    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-white/50 backdrop-blur-sm z-40"
                onClick={handleClose}
            />

            {/* Menu Panel */}
            <motion.div
                initial="hidden"
                animate={isClosing ? "exit" : "visible"}
                exit="exit"
                variants={menuVariants}
                className="fixed top-0 left-0 h-full w-full bg-white shadow-2xl z-50 overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, var(--primary-color) 0%, #f8fafc 100%)'
                }}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 bg-gradient-to-r from-orange-400 to-pink-600 p-2 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.1, type: "spring" }}
                                className="p-2 bg-white rounded-lg backdrop-blur-sm"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    <Link to="/" className="flex items-center flex-shrink-0">
                                        <img
                                            src={Logo}
                                            alt="BMG Jewellers"
                                            className="w-24  h-auto transition-all duration-300"
                                        />
                                    </Link>
                                </motion.div>
                            </motion.div>

                        </div>
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleClose}
                            className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                            aria-label="Close menu"
                        >
                            <X size={20} />
                        </motion.button>
                    </div>
                </div>

                {/* Menu Content */}
                <div className="h-[calc(90vh-100px)] overflow-y-auto pb-6">
                    <nav className="p-2">
                        <ul className="space-y-1">
                            <AnimatePresence>
                                {navigationmenu.map((item, index) => {
                                    const isActive = activeIndex === index;

                                    return (
                                        <motion.li
                                            key={item.id}
                                            variants={itemVariants}
                                            className={`relative rounded-xl overflow-hidden ${isActive ? 'bg-gradient-to-r from-blue-50 to-indigo-50' : 'hover:bg-gray-50'}`}
                                        >
                                            <div className="px-4 py-3">
                                                {item.child ? (
                                                    <motion.button
                                                        onClick={() => toggleMenu(index)}
                                                        className="flex items-center justify-between w-full group"
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <motion.span
                                                                className={`${item.color} transform transition-transform duration-200 group-hover:scale-110`}
                                                                animate={isActive ? { rotate: 360 } : { rotate: 0 }}
                                                                transition={{ duration: 0.3 }}
                                                            >
                                                                {item.icon}
                                                            </motion.span>
                                                            <span className="font-semibold text-gray-800 group-hover:text-[var(--primary-hover-color)]">
                                                                {item.linkText}
                                                            </span>
                                                        </div>
                                                        <motion.div
                                                            animate={{ rotate: isActive ? 180 : 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="text-gray-400"
                                                        >
                                                            <ChevronDown size={18} />
                                                        </motion.div>
                                                    </motion.button>
                                                ) : (
                                                    <motion.div
                                                        whileHover={{ x: 5 }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        <Link
                                                            to={item.link}
                                                            onClick={handleClose}
                                                            className="flex items-center gap-3 w-full group"
                                                        >
                                                            <motion.span
                                                                className={`${item.color} transform transition-transform duration-200 group-hover:scale-110`}
                                                                whileHover={{ rotate: 15 }}
                                                            >
                                                                {item.icon}
                                                            </motion.span>
                                                            <span className="font-semibold text-gray-800 group-hover:text-[var(--primary-hover-color)]">
                                                                {item.linkText}
                                                            </span>
                                                        </Link>
                                                    </motion.div>
                                                )}
                                            </div>

                                            {/* Mega Menu Content */}
                                            <AnimatePresence>
                                                {item.child && item.mega && isActive && (
                                                    <motion.div
                                                        variants={submenuVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        exit="exit"
                                                        className="px-2 pb-2"
                                                    >
                                                        <div className="space-y-2">
                                                            {item.submenu.map((section, secIdx) => (
                                                                <div
                                                                    key={secIdx}
                                                                    className="rounded-lg overflow-hidden border border-gray-100"
                                                                >
                                                                    <motion.button
                                                                        onClick={() => toggleSection(secIdx)}
                                                                        className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                                                                        whileTap={{ scale: 0.98 }}
                                                                    >
                                                                        <span className="font-semibold text-gray-700">
                                                                            {section.label}
                                                                        </span>
                                                                        <motion.div
                                                                            animate={{ rotate: activeSectionIndex === secIdx ? 180 : 0 }}
                                                                            transition={{ duration: 0.2 }}
                                                                            className="text-[var(--primary-hover-color)]"
                                                                        >
                                                                            <ChevronDown size={16} />
                                                                        </motion.div>
                                                                    </motion.button>

                                                                    <AnimatePresence>
                                                                        {activeSectionIndex === secIdx && (
                                                                            <motion.div
                                                                                variants={sectionVariants}
                                                                                initial="hidden"
                                                                                animate="visible"
                                                                                exit="hidden"
                                                                                className="bg-white"
                                                                            >
                                                                                <div className="p-2 pt-0">
                                                                                    <div className="grid grid-cols-4 gap-2">
                                                                                        {section.items.map((child, idx) => (
                                                                                            <motion.button
                                                                                                key={idx}
                                                                                                onClick={() => handleClick(child.keyName, child.keyValue)}
                                                                                                className="flex flex-col items-center p-3  transition-all duration-200 group"
                                                                                                whileHover={{ scale: 1.03, y: -2 }}
                                                                                                whileTap={{ scale: 0.95 }}
                                                                                                initial={{ opacity: 0, y: 10 }}
                                                                                                animate={{ opacity: 1, y: 0 }}
                                                                                                transition={{ delay: idx * 0.05 }}
                                                                                            >
                                                                                                {child.image && (
                                                                                                    <div className="w-12 h-12 mb-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                                                                                        <img
                                                                                                            src={`${baseurl}${child.image}`}
                                                                                                            alt={child.name || child.label}
                                                                                                            className="w-12 h-12 object-contain"
                                                                                                            onError={(e) => {
                                                                                                                e.target.onerror = null;
                                                                                                                e.target.src = "/fallback-image.jpg";
                                                                                                            }}
                                                                                                        />
                                                                                                    </div>
                                                                                                )}
                                                                                                <span className="text-xs font-medium  text-center line-clamp-2">
                                                                                                    {child.name || child.label}
                                                                                                </span>
                                                                                            </motion.button>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            </motion.div>
                                                                        )}
                                                                    </AnimatePresence>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.li>
                                    );
                                })}
                            </AnimatePresence>
                        </ul>

                        {/* Footer Section */}
                        {/* <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
                        >
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-2">Need assistance with your order?</p>
                                <div className="flex gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg font-medium text-sm"
                                        onClick={handleClose}
                                    >
                                        Call Support
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex-1 bg-white border border-blue-600 text-[var(--primary-hover-color)]-600 py-2 rounded-lg font-medium text-sm"
                                        onClick={handleClose}
                                    >
                                        Live Chat
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div> */}
                         <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex bg-gradient-to-r items-center p-3 m-2 justify-center from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
                        >

                            <RatesDropdown ratesData={ratesData} />

                        </motion.div>



                        {/* Legal Links */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-wrap justify-center gap-4 text-xs text-gray-500"
                        >
                            <Link to="/privacypolicy" onClick={handleClose} className="hover:text-[var(--primary-hover-color)] transition-colors">
                                Privacy Policy
                            </Link>
                            <Link to="/terms-conditions" onClick={handleClose} className="hover:text-[var(--primary-hover-color)] transition-colors">
                                Terms of Service
                            </Link>
                            <Link to="/cancellation-return-policy" onClick={handleClose} className="hover:text-[var(--primary-hover-color)] transition-colors">
                                Return Policy
                            </Link>
                        </motion.div>
                    </nav>
                </div>

                {/* Bottom Navigation */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="fixed w-full bottom-0  bg-white p-2 shadow-lg"
                >
                    <div className="flex items-center justify-center gap-10">
                        {/* Account */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-gray-600 hover:text-[var(--primary-hover-color)] transition-colors relative"
                            onClick={() => {
                                navigate('/account');
                                handleClose();
                            }}
                        >
                            <div className="text-center">
                                <div className="mx-auto w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full">
                                    <User size={22} />
                                </div>
                                <span className="text-xs mt-1 font-medium">Account</span>
                            </div>
                        </motion.button>

                        {/* Wishlist with Count */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-gray-600 hover:text-pink-700 transition-colors relative"
                            onClick={() => {
                                navigate('/wishlist');
                                handleClose();
                            }}
                        >
                            <div className="text-center relative">
                                <div className="mx-auto w-10 h-10 flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-50 rounded-full">
                                    <Heart size={18} />
                                </div>
                                <span className="text-xs mt-1 font-medium">Wishlist</span>

                                {/* Wishlist Count Badge */}
                                {wishlistCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-sm"
                                    >
                                        {wishlistCount}
                                    </motion.span>
                                )}
                            </div>
                        </motion.button>

                        {/* Cart with Count */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-gray-600 hover:text-amber-700 transition-colors relative"
                            onClick={() => {
                                navigate('/cart');
                                handleClose();
                            }}
                        >
                            <div className="text-center relative">
                                <div className="mx-auto w-10 h-10 flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 rounded-full">
                                    <ShoppingCart size={18} />
                                </div>
                                <span className="text-xs mt-1 font-medium">Cart</span>

                                {/* Cart Count Badge */}
                                {cartCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
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

export default Mobilemenu;