import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, X } from 'lucide-react';
import headerNavByShopId from './headerNavByShopId';
import './MobileMenu.css';
import { useHistory } from 'react-router-dom';

const Mobilemenu = ({ onClose }) => {
    const history = useHistory();
    const [activeIndex, setActiveIndex] = useState(null);
    const [activeSectionIndex, setActiveSectionIndex] = useState(null);
    const headerNavData = headerNavByShopId();
    const toggleMenu = (index) => {
        setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
        setActiveSectionIndex(null);
    };
    const baseurl = "https://app.bmgjewellers.com"
    const toggleSection = (secIdx) => {
        setActiveSectionIndex((prevIndex) => (prevIndex === secIdx ? null : secIdx));
    };

    const navigationmenu = [
        { id: 1, linkText: 'Home', link: '/', icon: 'fa-home' },
        {
            id: 2,
            linkText: 'Categories',
            child: true,
            mega: true,
            submenu: headerNavData.menuSections || [],
            icon: 'fa-shopping-bag',
        },
        { id: 3, linkText: 'Shop', link: '/products-page', icon: 'fa-shopping-bag' },
        { id: 4, linkText: 'About', link: '/about', icon: 'fa-info-circle' },
        { id: 5, linkText: 'Bmg Live', link: '/appointment', icon: 'fa-video' },
        { id: 6, linkText: 'Contact', link: '/contact', icon: 'fa-envelope' },
    ];

    const handleClick = (keyName, keyValue) => {
        const queryParams = new URLSearchParams();
        queryParams.append(keyName, keyValue);
        history.push(`/products-page?${queryParams.toString()}`);
        onClose();
    };

    return (
        <div className="mobile-menu-overlay">
            <div className="mobile-menu-container">
                <div className="mobile-menu-header">
                    <h3>Menu</h3>
                    <button className="mobile-menu-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <ul className="jewelry-mobile-nav">
                    {navigationmenu.map((item, index) => {
                        const isActive = activeIndex === index;

                        return (
                            <li
                                key={index}
                                className={`nav-item ${item.child ? 'has-submenu' : ''} ${isActive ? 'active' : ''}`}
                            >
                                <div className="nav-link-wrapper" onClick={() => item.child && toggleMenu(index)}>
                                    {item.child ? (
                                        <span className="nav-toggle">
                                            <i className={`fal ${item.icon}`} />
                                            {item.linkText}
                                            <ChevronDown size={18} className={`dropdown-icon ${isActive ? 'rotate' : ''}`} />
                                        </span>
                                    ) : (
                                        <Link to={item.link} onClick={onClose}>
                                            <i className={`fal ${item.icon}`} />
                                            {item.linkText}
                                        </Link>
                                    )}
                                </div>

                                {/* Shop Mega Menu */}
                                {item.child && item.mega && isActive && (
                                    <ul className="submenu mega-menu">
                                        {item.submenu.map((section, secIdx) => (
                                            <li key={secIdx} className="nav-item mega-menu-section">
                                                <div
                                                    className="mega-section-header"
                                                    onClick={() => toggleSection(secIdx)}
                                                >
                                                    <strong className="mega-section-title">{section.label}</strong>
                                                    <ChevronDown
                                                        size={16}
                                                        className={`mega-section-icon ${activeSectionIndex === secIdx ? 'rotate' : ''}`}
                                                    />
                                                </div>

                                                {activeSectionIndex === secIdx && (
                                                    <ul className="submenu">
                                                        {section.items.map((child, idx) => (
                                                            <li key={idx} className="nav-item">
                                                                <p onClick={() => handleClick(child.keyName, child.keyValue)}>
                                                                    {child.image && <img src={`${baseurl}${child.image}`} alt={child.name || child.label} className="nav-icon" />}
                                                                    {child.name || child.label}
                                                                </p>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {/* Standard Submenu */}
                                {item.child && !item.mega && isActive && (
                                    <ul className="submenu">
                                        {item.submenu.map((subItem, j) => (
                                            <li key={j} className="nav-item">
                                                <Link to={subItem.link} onClick={onClose}>
                                                    <i className={`fal ${subItem.icon}`} />
                                                    {subItem.linkText}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default Mobilemenu;