import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import headerNavByShopId from './headerNavByShopId';
import './MobileMenu.css';
import { useHistory } from 'react-router-dom';


const Mobilemenu = () => {
    const history = useHistory();
    const [activeIndex, setActiveIndex] = useState(null);
    const [activeSectionIndex, setActiveSectionIndex] = useState(null);

    const toggleMenu = (index) => {
        setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
        setActiveSectionIndex(null); // Reset section index when toggling main menu
    };

    const toggleSection = (secIdx) => {
        setActiveSectionIndex((prevIndex) => (prevIndex === secIdx ? null : secIdx));
    };

    const navigationmenu = [
        { id: 1, linkText: 'Home', link: '/', icon: 'fa-home' },
        {
            id: 2,
            linkText: 'Shop',
            child: true,
            mega: true,
            submenu: headerNavByShopId.menuSections || [],
            icon: 'fa-shopping-bag',
        },
        { id: 3, linkText: 'About', link: '/about', icon: 'fa-info-circle' },
        {
            id: 4,
            linkText: 'Pages',
            child: true,
            submenu: [
                { id: 41, link: '/blog-grid', linkText: 'Blog', icon: 'fa-blog' },
                { id: 42, link: '/faq', linkText: 'FAQ', icon: 'fa-question-circle' },
            ],
            icon: 'fa-file-alt',
        },
        { id: 5, linkText: 'Contact', link: '/contact', icon: 'fa-envelope' },
    ];

    const handleClick = (keyName, keyValue) => {
        const queryParams = new URLSearchParams();
        queryParams.append(keyName, keyValue);
        history.push(`/shop-left?${queryParams.toString()}`);
    };

    return (
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
                                <Link to={item.link}>
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
                                            className="section-title-wrapper"
                                            onClick={() => toggleSection(secIdx)}
                                        >
                                            <strong className="section-title">{section.label}</strong>
                                            <ChevronDown
                                                size={16}
                                                className={`section-dropdown-icon ${activeSectionIndex === secIdx ? 'rotate' : ''}`}
                                            />
                                        </div>
                                        {activeSectionIndex === secIdx && (
                                            <ul className="submenu">
                                                {section.items.map((child, idx) => (
                                                    <li key={idx} className="nav-item">
                                                        <p onClick={() => handleClick(child.keyName, child.keyValue)}>
                                                            {child.image && <img src={child.image} alt={child.name || child.label} />}
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
                                        <Link to={subItem.link}>
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
    );
};

export default Mobilemenu;