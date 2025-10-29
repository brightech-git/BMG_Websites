import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./Breadcrumb.css";

const Breadcrumb = () => {
    const location = useLocation();
    const { pathname } = location;

    // Split the path into parts (remove empty values)
    const pathParts = pathname.split("/").filter((part) => part);

    // Create breadcrumb items
    const crumbs = pathParts.map((part, index) => {
        const routeTo = "/" + pathParts.slice(0, index + 1).join("/");
        const name = decodeURIComponent(part)
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
        return { name, routeTo };
    });

    return (
        <AnimatePresence mode="wait">
            <motion.nav
                key={pathname}
                className="breadcrumb-container"
                aria-label="breadcrumb"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <ul className="breadcrumb-list">
                    <li>
                        <Link to="/" className="breadcrumb-link">
                            Home
                        </Link>
                    </li>
                    {crumbs.map((crumb, index) => (
                        <motion.li
                            key={crumb.routeTo}
                            className="breadcrumb-item"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.25, delay: index * 0.05 }}
                        >
                            
                                <span className="breadcrumb-active">{crumb.name}</span>
                            
                        </motion.li>
                    ))}
                </ul>
            </motion.nav>
        </AnimatePresence>
    );
};

export default Breadcrumb;
