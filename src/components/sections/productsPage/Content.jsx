import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFilteredProducts } from "../../../hook/product/useFilterProducts";
import ProductCard from "../productCard/ProductCard";
import ProductFilterBar from "./ProductFilterBar";
import { useSelector } from "react-redux";
import Breadcrumb from "../../layouts/Breadcrumb";
import { useNotification } from "../../../context/notification/NotificationContext";
import { Loader2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import "animate.css";

const baseUrl = "https://app.bmgjewellers.com";
const PAGE_SIZE = 20;

/* ---------------------------------- */
/* Loading Components                  */
/* ---------------------------------- */

const ProductCardPlaceholder = () => (
    <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 flex flex-col h-full animate-pulse">
        <div className="relative w-full pt-[100%] bg-gray-200">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer" />
        </div>
        <div className="p-4 flex flex-col flex-grow space-y-3">
            <div className="h-5 bg-gray-200 rounded w-4/5 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-3/5 animate-pulse" />
            <div className="h-5 bg-gray-200 rounded w-2/5 animate-pulse" />
            <div className="h-10 bg-gray-200 rounded w-full mt-2 animate-pulse" />
        </div>
    </div>
);

const LoadingGrid = ({ count = 8 }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="animate__animated animate__fadeIn" style={{ animationDelay: `${i * 0.05}s` }}>
                <ProductCardPlaceholder />
            </div>
        ))}
    </div>
);

/* ---------------------------------- */
/* Error Component                     */
/* ---------------------------------- */

const ErrorState = ({ onRetry }) => (
    <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center animate__animated animate__fadeIn">
            <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Failed to load products</h3>
            <p className="text-gray-600 mb-6">Something went wrong. Please try again.</p>
            <button
                onClick={onRetry}
                className="bg-gradient-to-r from-[#f16137] to-[#d84a22] text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
                Retry
            </button>
        </div>
    </div>
);

/* ---------------------------------- */
/* No Results Component                */
/* ---------------------------------- */

const NoResults = () => (
    <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center animate__animated animate__fadeIn">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your filters or search criteria</p>
        </div>
    </div>
);

/* ---------------------------------- */
/* Content                             */
/* ---------------------------------- */
// Content.jsx - Fix the prop passing
const Content = ({ itemCtrName }) => { // Note the curly braces around itemCtrName
    const navigate = useNavigate();
    const location = useLocation();
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const { askNotification } = useNotification();

    const sentinelRef = useRef(null);
    const loadMoreRef = useRef(null);
    const [showScrollTop, setShowScrollTop] = useState(false);

    const [page, setPage] = useState(0);
    const [products, setProducts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

    const searchParams = new URLSearchParams(location.search);
    const queryFilters = Object.fromEntries(searchParams);

    

    const {
        data,
        isLoading,
        isFetching,
        isError,
        refetch,
    } = useFilteredProducts(queryFilters, page, PAGE_SIZE);

    const productsData = data?.data || [];
    const totalItems = data?.totalProducts || 0;

    /* ---------------------------------- */
    /* Notifications                      */
    /* ---------------------------------- */

    useEffect(() => {
        askNotification("Welcome to BMG Jewellers", "Stay updated with important updates.");
    }, []);


    /* ---------------------------------- */
    /* Reset when filters change          */
    /* ---------------------------------- */

    useEffect(() => {
        setPage(0);
        setProducts([]);
        setHasMore(true);
    }, [location.search]);

    /* ---------------------------------- */
    /* Append products                    */
    /* ---------------------------------- */
    useEffect(() => {
        if (!isLoading) {
            setHasLoadedOnce(true);
        }

        if (!productsData) {
            setHasMore(false);
            return;
        }

        const newItems = Array.isArray(productsData) ? productsData : [];

        // API returned no products
        if (newItems.length === 0) {
            setHasMore(false);
            return;
        }

        setProducts((prev) => {
            // If page === 0, filters changed → replace products (no flicker)
            if (page === 0) return newItems;

            // Otherwise, append unique items
            const unique = newItems.filter(
                (item) => !prev.some((p) => p.TAGKEY === item.TAGKEY)
            );
            return [...prev, ...unique];
        });

        // Stop infinite scroll if fewer than page size
        setHasMore(newItems.length === PAGE_SIZE);
    }, [productsData, isLoading]);

    /* ---------------------------------- */
    /* Infinite scroll                    */
    /* ---------------------------------- */

    useEffect(() => {
        if (!hasMore || isFetching) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isFetching && hasMore) {
                    observer.unobserve(entry.target);
                    setPage(prev => prev + 1);
                }
            },
            {
                root: null,
                rootMargin: "200px",
                threshold: 0
            }
        );

        if (sentinelRef.current) {
            observer.observe(sentinelRef.current);
        }

        return () => observer.disconnect();
    }, [hasMore, isFetching]);

    /* ---------------------------------- */
    /* Wishlist                           */
    /* ---------------------------------- */

    const handleWishlistToggle = useCallback(
        (e, itemSno, isWishlisted) => {
            e.preventDefault();
            e.stopPropagation();

            if (!isAuthenticated) {
                localStorage.setItem(
                    "redirectAfterLogin",
                    JSON.stringify({
                        path: window.location.pathname,
                        action: "wishlistToggle",
                        itemSno,
                        isWishlisted,
                    })
                );
                navigate("/login");
            }
        },
        [isAuthenticated, navigate]
    );

    /* ---------------------------------- */
    /* States                             */
    /* ---------------------------------- */

    if (isLoading && products.length === 0) {
        return (
            <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-gradient-to-b from-[#f8f6f2] to-[var(--primary-card-color)] min-h-screen">
                <div className="mb-6">
                    <Breadcrumb />
                </div>
                <div className="mb-8 animate__animated animate__fadeIn">
                    <ProductFilterBar itemCtrName={itemCtrName} />
                </div>
                <LoadingGrid count={12} />
            </section>
        );
    }

    if (isError) {
        return (
            <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-gradient-to-b from-[#f8f6f2] to-[#eeece8] min-h-screen">
                <div className="mb-6">
                    <Breadcrumb />
                </div>
                <ErrorState onRetry={refetch} />
            </section>
        );
    }

    /* ---------------------------------- */
    /* Render                            */
    /* ---------------------------------- */
    console.log(products,'products')

    return (
        <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-gradient-to-b from-[#FFF] to-[#eeece8] min-h-screen relative">
            <div className="mb-6 animate__animated animate__fadeInDown">
                <Breadcrumb />
            </div>

            <div className="mb-8">
                <ProductFilterBar itemCtrName={itemCtrName} totalResults={totalItems}/> {/* Pass the prop here */}
            </div>
            <div className="product-area">
                {/* Product Header */}
                <div className="flex flex-row justify-between items-center mb-4 gap-2 animate__animated animate__fadeIn">
                    <p className="text-sm text-gray-600 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                        Showing <span className="font-semibold text-[#f16137]">{products.length}</span> of{' '}
                        <span className="font-semibold">{totalItems.toLocaleString()}</span> results
                    </p>

                    {/* Sort/Filter indicator for mobile */}
                    {products.length > 0 && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            {hasMore ? 'Scroll for more' : 'All products loaded'}
                        </div>
                    )}
                </div>

                {/* Product Grid */}
                {products.length === 0 ? (
                    <NoResults />
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 md:gap-2 [&>*]:border [&>*]:border-[var(--secondary-card-color)] [&>*]:p-2 [&>*]:box-border">
                        {products.map((item, index) => {
                            let images = [];
                            try {
                                images = JSON.parse(item.ImagePath || "[]");
                            } catch { }

                            const image = images.length > 0
                                ? `${baseUrl}${images[0]}`
                                : "https://via.placeholder.com/300x400?text=No+Image";

                            return (
                                <div
                                    key={`${item.TAGKEY}-${index}`}
                                    className="animate__animated animate__fadeIn"
                                    style={{ animationDelay: `${Math.min(index * 0.05, 1)}s` }}
                                >
                                    <ProductCard
                                        item={item}
                                        imageSrc={image}
                                        onWishlistToggle={(e) =>
                                            handleWishlistToggle(e, item.SNO, false)
                                        }
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Infinite Scroll Sentinel */}
                {hasMore && (
                    <div
                        ref={sentinelRef}
                        id="infinite-scroll-sentinel"
                        className="h-1 w-full"
                    />
                )}

                {/* Loader UI */}
                {isFetching && (
                    <div className="flex justify-center items-center my-8 animate__animated animate__fadeIn">
                        <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
                            <Loader2 className="w-5 h-5 text-[#f16137] animate-spin" />
                            <span className="text-sm font-medium text-gray-700">Loading more products...</span>
                        </div>
                    </div>
                )}

                {/* End of Products Message */}
                {!hasMore && products.length > 0 && (
                    <div className="text-center mt-8 animate__animated animate__fadeIn">
                        <div className="inline-block bg-gray-100 px-6 py-3 rounded-full shadow-lg">
                            <p className="text-sm text-gray-600">
                                You've reached the end! 🎉
                            </p>
                        </div>
                    </div>
                )}
            </div>

        </section>
    );
};

export default Content;

