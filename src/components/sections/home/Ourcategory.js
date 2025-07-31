import React, { useState, useRef } from 'react';
import { Tab } from 'react-bootstrap';
import { useCategories, useItemFilter } from '../../../hook/category/useCategoryQuery';
import ProductCard from '../productCard/ProductCard';
import './OurCategory.css';
import { useSwipeable } from 'react-swipeable';

const OurCategory = () => {
    const { data: categories = [], isLoading: isCategoriesLoading } = useCategories();
    const [activeTab, setActiveTab] = useState(null);
    const productGridRefs = useRef({});

    console.log(categories,'categories');

    // Category mapping for display and API
    const categoryMap = categories.map((cat) => ({
        key: cat.toLowerCase().replace(/_/g, '-'), // e.g., "NECKLACES_AND_SETS" → "necklaces-and-sets"
        apiKey: cat,                               // original key from API
        displayName: formatDisplayName(cat),      // prettified display name
    }));
    function formatDisplayName(cat) {
        return cat
            .replace(/_/g, ' ')              // Replace underscores with spaces
            .toLowerCase()
            .replace(/\b\w/g, (l) => l.toUpperCase()); // Capitalize each word
    }

    // Filter active categories based on API response
    const activeCategories = categoryMap.filter(cat => categories.includes(cat.apiKey));

    // Set initial active tab when categories load
    React.useEffect(() => {
        if (activeCategories.length > 0 && !activeTab) {
            setActiveTab(activeCategories[0].key);
        }
    }, [activeCategories]);

    // Scroll handlers
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

    // Component for rendering product grid with swipe functionality
    const ProductGridWithSwipe = ({ categoryKey, apiKey }) => {
        const { data: products = [], isLoading: isProductsLoading } = useItemFilter({
            itemName: apiKey
        });
        console.log('API Key:', apiKey, 'Products:', products);

        const handlers = useSwipeable({
            onSwipedLeft: () => scrollRight(categoryKey),
            onSwipedRight: () => scrollLeft(categoryKey),
            preventDefaultTouchmoveEvent: true,
            trackMouse: true
        });

        if (isProductsLoading) {
            return (
                <div className="shop-product-container">
                    <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading products...</span>
                        </div>
                    </div>
                </div>
            );
        }

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
                    ref={(el) => (productGridRefs.current[categoryKey] = el)}
                >
                    {products.length > 0 ? (
                        products.map((item, i) => (
                            <ProductCard key={item.id || i} item={item} />
                        ))
                    ) : (
                        <div className="text-center w-100 py-4">
                            <p className="no-products-text">No products available</p>
                        </div>
                    )}
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

    if (isCategoriesLoading) {
        return (
            <section className="shop-category-section">
                <div className="container text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading categories...</span>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="shop-category-section">
            <div className="cat-container">
                <div className="shop-category-header">
                    
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
                                    <ProductGridWithSwipe
                                        categoryKey={category.key}
                                        apiKey={category.apiKey}
                                    />
                                </Tab.Pane>
                            ))}
                        </Tab.Content>
                    </Tab.Container>
                ) : (
                    <div className="shop-no-categories">
                        <p>No categories available</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default OurCategory;