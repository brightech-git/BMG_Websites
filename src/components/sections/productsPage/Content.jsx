import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFilteredProducts } from "../../../hook/product/useFilterProducts";
import ProductCard from "../productCard/ProductCard";
import ProductFilterBar from "./ProductFilterBar";
import "./ShopContent.css";
import { useSelector } from "react-redux";
import Breadcrumb from "../../layouts/Breadcrumb";
import { useNotification } from "../../../context/notification/NotificationContext";

const baseUrl = "https://app.bmgjewellers.com";
const PAGE_SIZE = 20;

/* ---------------------------------- */
/* Loading Components                  */
/* ---------------------------------- */

const ProductCardPlaceholder = () => (
    <div className="product-card-placeholder">
        <div className="placeholder-glow">
            <div className="product-thumb">
                <div className="placeholder bg-secondary w-100 h-100"></div>
            </div>
            <div className="product-desc">
                <div className="placeholder bg-secondary mb-2" style={{ height: 20, width: "80%" }} />
                <div className="placeholder bg-secondary mb-2" style={{ height: 16, width: "60%" }} />
                <div className="placeholder bg-secondary mb-2" style={{ height: 18, width: "40%" }} />
            </div>
        </div>
    </div>
);

const LoadingGrid = ({ count = 8 }) => (
    <div className="product-grid">
        {Array.from({ length: count }).map((_, i) => (
            <ProductCardPlaceholder key={i} />
        ))}
    </div>
);

/* ---------------------------------- */
/* Content                             */
/* ---------------------------------- */

const Content = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const { askNotification } = useNotification();

    const sentinelRef = useRef(null);
    const loadMoreRef = useRef(null);


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

   const productsData = data?.data?.data || [];

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
            const unique = newItems.filter(
                (item) => !prev.some((p) => p.SNO === item.SNO)
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
                    observer.unobserve(entry.target); // 🔑 stop loop
                    setPage(prev => prev + 1);
                }
            },
            {
                root: null,
                rootMargin: "200px", // preload before footer
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
            <section className="shop-container">
                <div className="product-area">
                    <LoadingGrid count={10} />
                </div>
            </section>
        );
    }

    if (isError) {
        return (
            <p className="error-message">
                Failed to load products.
                <button onClick={refetch}>Retry</button>
            </p>
        );
    }

    /* ---------------------------------- */
    /* Render                            */
    /* ---------------------------------- */

    return (
        <section className="shop-container">
            <Breadcrumb />

           
            <ProductFilterBar />
      

            <div className="product-area">
                <div className="product-header">
                    <p>
                        Showing {products.length} of {data?.data?.totalItems ?? "many"} results
                    </p>
                </div>

                <div className="product-grid">
                    {products.map((item) => {
                        let images = [];
                        try {
                            images = JSON.parse(item.ImagePath || "[]");
                        } catch { }

                        const image =
                            images.length > 0
                                ? `${baseUrl}${images[0]}`
                                : "https://via.placeholder.com/245x331";

                        return (
                            <ProductCard
                                key={item.SNO}
                                item={item}
                                imageSrc={image}
                                onWishlistToggle={(e) =>
                                    handleWishlistToggle(e, item.SNO, false)
                                }
                            />
                        );
                    })}
                </div>

                {hasMore && (
                    <div
                        ref={sentinelRef}
                        id="infinite-scroll-sentinel"
                        style={{ height: '1px' }}
                    />
                )}

                {/* Loader UI */}
                {isFetching && (
                    <div className="d-flex justify-content-center align-items-center my-4">
                        <div className="spinner-border text-secondary" />
                    </div>
                )}

                {!hasMore && (
                    <p className="text-center mt-3">No more products</p>
                )}
            </div>
        </section>
    );
};

export default Content; 
