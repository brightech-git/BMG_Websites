import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Home } from "lucide-react";

const Breadcrumb = () => {
    const location = useLocation();
    const pathParts = location.pathname.split("/").filter(Boolean);

    const crumbs = pathParts.map((part, i) => {
        const routeTo = "/" + pathParts.slice(0, i + 1).join("/");
        const name = decodeURIComponent(part)
            .replace(/-/g, " ")
            .replace(/\b\w/g, c => c.toUpperCase());
        return { name, routeTo };
    });

    return (
        <AnimatePresence mode="wait">
            <motion.nav
                key={location.pathname}
                className="flex items-center gap-1 text-xs md:text-sm py-3 px-2 bg-white/80 rounded-xl backdrop-blur-sm border-b border-gray-200 sticky top-0 z-0"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                aria-label="Breadcrumb"
            >
                {/* Home */}
                <Link
                    to="/"
                    className="flex items-center gap-2 text-[#041f60] hover:text-[#f16137] transition-colors font-medium"
                >
                    <Home className="w-4 h-4" />
                    <span className="hidden sm:inline">Home</span>
                </Link>

                {/* Separator */}
                {crumbs.length > 0 && (
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}

                {/* Dynamic Crumbs */}
                {crumbs.map((crumb, i) => (
                    <motion.div
                        key={crumb.routeTo}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.08 }}
                        className="flex items-center gap-2"
                    >
                        {i < crumbs.length - 1 ? (
                            <Link
                                to={crumb.routeTo}
                                className="text-gray-600 hover:text-[#f16137] transition-colors font-medium capitalize"
                            >
                                {crumb.name}
                            </Link>
                        ) : (
                            <span className="text-[#f16137] font-semibold capitalize">
                                {crumb.name}
                            </span>
                        )}

                        {/* Separator except last */}
                        {i < crumbs.length - 1 && (
                            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                    </motion.div>
                ))}
            </motion.nav>
        </AnimatePresence>
    );
};

export default Breadcrumb;