import React, { useRef, useState, useCallback, useEffect } from "react";
import { useRecentlyViewed } from "../../hook/recentlyViewed/useRecentlyViewedQuery";
import { useNavigate } from "react-router-dom";
import ProductCard from "../sections/productCard/ProductCard";
import "animate.css";

const ProductCarousel = () => {
    const navigate = useNavigate();
    const carouselRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    const { data: recentlyViewedData, isLoading, isError, error } = useRecentlyViewed();
    const products = recentlyViewedData?.data || [];

    const handleScroll = useCallback(() => {
        if (carouselRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 1);
        }
    }, []);

    useEffect(() => {
        if (carouselRef.current && products.length > 0) {
            handleScroll();
        }
    }, [products.length, handleScroll]);

    const scrollLeft = useCallback(() => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
        }
    }, []);

    const scrollRight = useCallback(() => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
    }, []);

    // Error state
    if (isError) {
        return (
            <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-16">
                <div className="container mx-auto px-6">
                    <div className="animate__animated animate__fadeIn mx-auto max-w-2xl rounded-2xl bg-white p-12 text-center shadow-lg">
                        <div className="mb-6 flex justify-center">
                            <svg className="h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-xl font-medium text-red-600">
                            {error?.message || "Failed to load recently viewed products"}
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    // Loading skeleton
    if (isLoading) {
        return (
            <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-16">
                <div className="container mx-auto px-6">
                    <div className="mb-12 flex items-center justify-between">
                        <div className="animate__animated animate__fadeInLeft">
                            <span className="font-primary mb-2 block text-sm font-semibold uppercase tracking-wider text-gray-600">
                                Recently
                            </span>
                            <h2 className="font-title bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-4xl font-black text-transparent drop-shadow-md md:text-5xl">
                                Viewed Products
                            </h2>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="flex animate-pulse gap-6 overflow-hidden">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="animate__animated animate__fadeIn flex w-[280px] flex-none flex-col"
                                    style={{ animationDelay: `${i * 0.1}s` }}
                                >
                                    <div className="h-[300px] w-full rounded-xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
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
            <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-16">
                <div className="container mx-auto px-6">
                    <div className="mb-12 flex items-center justify-between">
                        <div className="animate__animated animate__fadeInLeft">
                            <span className="font-primary mb-2 block text-sm font-semibold uppercase tracking-wider text-gray-600">
                                Recently Viewed Products
                            </span>
                           
                        </div>
                    </div>

                    <div className="animate__animated animate__fadeInUp mx-auto max-w-2xl rounded-2xl bg-white p-16 text-center shadow-xl">
                        <div className="mb-6 flex justify-center">
                            <svg className="h-20 w-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <p className="mb-8 text-xl font-medium text-gray-700">
                            No recently viewed products yet
                        </p>
                        <button
                            className="group relative inline-flex transform items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                            onClick={() => navigate("/products-page")}
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                            <span className="relative">Browse Products</span>
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    // Main carousel
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-16">
            <div className="container overflow-hidden  mx-auto px-6">
                {/* Header with navigation arrows */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
                    <div className="animate__animated animate__fadeInLeft flex-1">
                        
                        <h2 className="font-title bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-lg font-black text-transparent drop-shadow-md md:text-2xl">
                            Recently Viewed Products
                        </h2>
                    </div>

                    <div className="animate__animated animate__fadeInRight flex items-center gap-3">
                        <button
                            className={`group relative flex h-8 md:h-12 w-8 md:w-12 transform items-center justify-center rounded-full border-2 border-amber-600 bg-white shadow-md transition-all duration-300 hover:-translate-x-1 hover:bg-amber-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                                !showLeftArrow ? 'cursor-not-allowed border-gray-300 opacity-40 hover:bg-white hover:-translate-x-0' : ''
                            }`}
                            onClick={scrollLeft}
                            aria-label="Scroll left"
                            disabled={!showLeftArrow}
                        >
                            <svg 
                                width="24" 
                                height="24" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                className={`transition-all duration-300 group-hover:scale-110 ${
                                    !showLeftArrow ? 'text-gray-400' : 'text-amber-600 group-hover:text-white'
                                }`}
                            >
                                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <button
                            className={`group relative flex h-8 md:h-12 w-8 md:w-12 transform items-center justify-center rounded-full border-2 border-amber-600 bg-white shadow-md transition-all duration-300 hover:translate-x-1 hover:bg-amber-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                                !showRightArrow ? 'cursor-not-allowed border-gray-300 opacity-40 hover:bg-white hover:translate-x-0' : ''
                            }`}
                            onClick={scrollRight}
                            aria-label="Scroll right"
                            disabled={!showRightArrow}
                        >
                            <svg 
                                width="24" 
                                height="24" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                className={`transition-all duration-300 group-hover:scale-110 ${
                                    !showRightArrow ? 'text-gray-400' : 'text-amber-600 group-hover:text-white'
                                }`}
                            >
                                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Carousel container */}
                <div 
                    className="relative"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Gradient overlays */}
                    {showLeftArrow && isHovered && (
                        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-gray-50 to-transparent"></div>
                    )}
                    {showRightArrow && isHovered && (
                        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-gray-50 to-transparent"></div>
                    )}

                    {/* Carousel track */}
                    <div
                        ref={carouselRef}
                        onScroll={handleScroll}
                        className="hide-scrollbar flex gap-6 overflow-x-auto overflow-y-hidden scroll-smooth px-1 pb-2 "
                    >
                        {products.map((product, index) => (
                            <div
                                key={product.TAGKEY}
                                className="animate__animated animate__fadeInUp flex w-[220px] sm:w-[250px] flex-none transform transition-all duration-300 hover:-translate-y-1 lg:w-[280px]"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="w-full overflow-hidden rounded-xl bg-white shadow-md transition-shadow duration-300 hover:shadow-xl">
                                    <ProductCard item={product} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                
            </div>
        </section>
    );
};

export default ProductCarousel;