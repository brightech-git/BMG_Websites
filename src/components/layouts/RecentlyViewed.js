import React, { useRef, useState, useCallback, useEffect } from "react";
import { useRecentlyViewed } from "../../hook/recentlyViewed/useRecentlyViewedQuery";
import { useQueries } from "@tanstack/react-query";
import { getProductBySno } from "../../service/ProductService";
import { useHistory } from "react-router-dom";
import ProductCard from "../sections/productCard/ProductCard";
import "./recently-viewed.css";

const ProductCarousel = () => {
    const navigate = useHistory();
    const carouselRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    // Get SNOs
    const { data: recentlyViewedData, isLoading, isError, error } = useRecentlyViewed();
    const snoArray = recentlyViewedData?.data || [];

    // Fetch all product details by SNO
    const productQueries = useQueries({
        queries: snoArray.map((sno) => ({
            queryKey: ["singleProduct", sno],
            queryFn: () => getProductBySno(sno),
            enabled: Boolean(sno),
            staleTime: 1000 * 60 * 5,
        })),
    });

    // Check if any products are still loading
    const productsLoading = productQueries.some(query => query.isLoading);

    // Extract final product list
    const products = productQueries
        .filter((q) => q.isSuccess && q.data)
        .map((q) => q.data);

    // Handle scroll to update arrow visibility
    const handleScroll = useCallback(() => {
        if (carouselRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 1); // Small buffer for rounding errors
        }
    }, []);

    // Initial check for arrow visibility
    useEffect(() => {
        if (carouselRef.current && products.length > 0) {
            handleScroll();
        }
    }, [products.length, handleScroll]);

    // Scroll handlers
    const scrollLeft = useCallback(() => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: -400, behavior: "smooth" });
        }
    }, []);

    const scrollRight = useCallback(() => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: 400, behavior: "smooth" });
        }
    }, []);

    // Error state
    if (isError) {
        return (
            <section className="jewel-carousel">
                <div className="jewel-carousel__container">
                    <p className="jewel-carousel__error">
                        {error?.message || "Failed to load recently viewed products"}
                    </p>
                </div>
            </section>
        );
    }

    // Loading skeleton
    if (isLoading || productsLoading) {
        return (
            <section className="jewel-carousel">
                <div className="jewel-carousel__container">
                    <div className="jewel-carousel__header">
                        <div className="header-left">
                            <span className="jewel-carousel__subtitle">Recently</span>
                            <h2 className="jewel-carousel__title">Viewed Products</h2>
                        </div>
                    </div>

                    <div className="carousel-skeleton-wrapper">
                        <div className="carousel-skeleton-row">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="carousel-skeleton-item">
                                    <div className="jewel-carousel__skeleton" style={{ height: "300px" }}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // If no data
    if (products.length === 0) {
        return (
            <section className="jewel-carousel">
                <div className="jewel-carousel__container">
                    <div className="jewel-carousel__header">
                        <div className="header-left">
                            <span className="jewel-carousel__subtitle">Recently</span>
                            <h2 className="jewel-carousel__title">Viewed Products</h2>
                        </div>
                    </div>

                    <div className="jewel-carousel__empty">
                        <p>No recently viewed products.</p>
                        <button
                            className="jewel-carousel__cta"
                            onClick={() => navigate.push("/products-page")}
                        >
                            Browse Products
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    // Final single row carousel
    return (
        <section className="jewel-carousel">
            <div className="jewel-carousel__container">
                <div className="jewel-carousel__header">
                    <div className="header-left">
                       
                        <h2 className="jewel-carousel__title">Recently Viewed Products</h2>
                    </div>

                    <div className="header-right">
                        <div className="carousel-nav-group">
                            <button
                                className={`carousel-nav ${!showLeftArrow ? 'disabled' : ''}`}
                                onClick={scrollLeft}
                                aria-label="Scroll left"
                                disabled={!showLeftArrow}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <button
                                className={`carousel-nav ${!showRightArrow ? 'disabled' : ''}`}
                                onClick={scrollRight}
                                aria-label="Scroll right"
                                disabled={!showRightArrow}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className="single-row-carousel"
                    ref={carouselRef}
                    onScroll={handleScroll}
                >
                    {products.map((product) => (
                        <div key={product.SNO} className="carousel-card-wrapper">
                            <ProductCard item={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductCarousel;