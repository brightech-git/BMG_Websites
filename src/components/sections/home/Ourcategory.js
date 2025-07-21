import React, { useState, useRef } from 'react';
import { Tab } from 'react-bootstrap';
import { useCategories } from '../../../hook/category/useCategoryQuery';
import ProductCard from '../productCard/ProductCard';
import './OurCategory.css';
import { useSwipeable } from 'react-swipeable';
// Import your product images
import img1 from '../../../assets/img/shop/image-33.jpg';
import img2 from '../../../assets/img/shop/menu-gallery-2.b8300c96.jpg';
import img3 from '../../../assets/img/shop/image-4 (2).jpg';

// Product data arrays
const categoryProducts = {
    rings: [
        { img: img3, discount: 10, title: 'Silver Ring', price: 890 },
        { img: img1, discount: 15, title: 'Silver Stud Earrings', price: 580 },
        { img: img2, discount: 40, title: 'Silver Ankle Bracelet', price: 290 },
        { img: img3, discount: 10, title: 'Silver Ring', price: 890 },
    ],
    earrings: [
        { img: img1, discount: 15, title: 'Silver Ankle Bracelet', price: 390 },
        { img: img2, discount: '', title: 'Silver Stud Earrings', price: 290 },
        { img: img3, discount: 10, title: 'Silver Crumpled Ring', price: 450 },
        { img: img1, discount: 15, title: 'Silver Pendant', price: 780 },
    ],
    necklaces: [
        { img: img1, discount: 15, title: 'Silver Ankle Bracelet', price: 390 },
        { img: img3, discount: 10, title: 'Silver Crumpled Ring', price: 450 },
        { img: img1, discount: 15, title: 'Silver Pendant', price: 780 },
        { img: img2, discount: '', title: 'Silver Stud Earrings', price: 290 },
    ],
    bracelets: [
        { img: img3, discount: 10, title: 'Silver Crumpled Ring', price: 450 },
        { img: img1, discount: 15, title: 'Silver Ankle Bracelet', price: 390 },
        { img: img2, discount: '', title: 'Silver Stud Earrings', price: 290 },
        { img: img1, discount: 15, title: 'Silver Pendant', price: 780 },
    ],
    armlets: [
        { img: img2, discount: '', title: 'Silver Stud Earrings', price: 290 },
        { img: img3, discount: 10, title: 'Silver Crumpled Ring', price: 450 },
        { img: img1, discount: 15, title: 'Silver Pendant', price: 780 },
        { img: img1, discount: 15, title: 'Silver Ankle Bracelet', price: 390 },
    ],
    anklets: [
        { img: img2, discount: '', title: 'Silver Stud Earrings', price: 290 },
        { img: img1, discount: 15, title: 'Silver Ankle Bracelet', price: 390 },
        { img: img3, discount: 10, title: 'Silver Crumpled Ring', price: 450 },
        { img: img1, discount: 15, title: 'Silver Pendant', price: 780 },
    ]
};

const OurCategory = () => {
    const { data: categories = [], isLoading } = useCategories();
    const [activeTab, setActiveTab] = useState('rings');
    const productGridRefs = useRef({});

    const scrollLeft = (categoryKey) => {
        if (productGridRefs.current[categoryKey]) {
            productGridRefs.current[categoryKey].scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        }
    };

    const scrollRight = (categoryKey) => {
        if (productGridRefs.current[categoryKey]) {
            productGridRefs.current[categoryKey].scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        }
    };

    if (isLoading) {
        return (
            <section className="shop-category-section">
                <div className="container text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </section>
        );
    }

    const categoryMap = [
        { key: 'rings', apiKey: 'RINGS', displayName: 'Rings' },
        { key: 'earrings', apiKey: 'EARRINGS', displayName: 'Earrings' },
        { key: 'necklaces', apiKey: 'NECKLACES_AND_SETS', displayName: 'Necklaces' },
        { key: 'bracelets', apiKey: 'BANGLES_AND_BRACELETS', displayName: 'Bracelets' },
        { key: 'armlets', apiKey: 'MENS_JEWELLERY', displayName: 'Armlets' },
        { key: 'anklets', apiKey: 'ANKLES_AND_TOE_RINGS', displayName: 'Anklets' }
    ];

    const activeCategories = categoryMap.filter(cat =>
        categories.includes(cat.apiKey)
    );

    const ProductGridWithSwipe = ({ categoryKey }) => {
        const handlers = useSwipeable({
            onSwipedLeft: () => scrollRight(categoryKey),
            onSwipedRight: () => scrollLeft(categoryKey),
            preventDefaultTouchmoveEvent: true,
            trackMouse: true
        });

        return (
            <div className="shop-product-container" {...handlers}>
                <button
                    className="scroll-button left"
                    onClick={() => scrollLeft(categoryKey)}
                    aria-label="Scroll left"
                >
                    &lt;
                </button>
                <div
                    className="shop-product-grid"
                    ref={el => productGridRefs.current[categoryKey] = el}
                >
                    {categoryProducts[categoryKey]?.map((item, i) => (
                        <ProductCard key={i} item={item} />
                    ))}
                </div>
                <button
                    className="scroll-button right"
                    onClick={() => scrollRight(categoryKey)}
                    aria-label="Scroll right"
                >
                    &gt;
                </button>
            </div>
        );
    };

    return (
        <section className="shop-category-section">
            <div >
                <div className="shop-category-header">
                    <span className="shop-category-subtitle">Our Collections</span>
                    <h2 className="shop-category-title">Shop By Category</h2>
                </div>

                {activeCategories.length > 0 ? (
                    <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
                        <div className="shop-category-names">
                            {activeCategories.map((category) => (
                                <div
                                    key={category.key}
                                    className={`shop-category-name ${activeTab === category.key ? 'active' : ''}`}
                                    onClick={() => setActiveTab(category.key)}
                                >
                                    {category.displayName}
                                </div>
                            ))}
                        </div>

                        <Tab.Content className="shop-category-content">
                            {activeCategories.map((category) => (
                                <Tab.Pane key={category.key} eventKey={category.key}>
                                    <ProductGridWithSwipe categoryKey={category.key} />
                                </Tab.Pane>
                            ))}
                        </Tab.Content>
                    </Tab.Container>
                ) : (
                    <div className="shop-no-categories">
                        <p>No categories available at the moment</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default OurCategory;