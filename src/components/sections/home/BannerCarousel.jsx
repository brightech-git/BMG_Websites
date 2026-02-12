import { useState, useEffect, useRef, memo } from "react";
import { useNavigate } from "react-router-dom";
import { getProductImages } from "../../../utils/getProductImages";

/* ---------------------------------- */
/* Skeleton Loader                    */
/* ---------------------------------- */

const BannerSkeleton = () => (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="relative w-full rounded-2xl overflow-hidden bg-gray-200 animate-pulse">
            <div className="w-full h-0 pb-[31.578%]"> {/* 19:6 = 6/19*100 = 31.578% */}
            </div>
        </div>
    </div>
);

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

function BannerCarousel({ banners = [], isLoading = false }) {
    const navigate = useNavigate();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragDistance, setDragDistance] = useState(0);

    const dragStartRef = useRef(0);
    const dragCurrentRef = useRef(0);
    const autoplayRef = useRef(null);
    const containerRef = useRef(null);

    const slideCount = banners.length;

    /* ---------------------------------- */
    /* Autoplay (SAFE VERSION)            */
    /* ---------------------------------- */

    useEffect(() => {
        if (isHovered || isDragging || slideCount <= 1) return;

        autoplayRef.current = setTimeout(() => {
            setCurrentIndex((i) => (i + 1) % slideCount);
        }, 4000);

        return () => clearTimeout(autoplayRef.current);
    }, [currentIndex, isHovered, isDragging, slideCount]);

    /* ---------------------------------- */
    /* Early returns                      */
    /* ---------------------------------- */

    if (isLoading) {
        return (
            <div className="w-full bg-white mt-[130px] py-8">
                <BannerSkeleton />
            </div>
        );
    }

    if (!slideCount) {
        return (
            <div className="w-full bg-white mt-[130px] py-8 text-center">
                No Banners Found
            </div>
        );
    }

    /* ---------------------------------- */
    /* Navigation                         */
    /* ---------------------------------- */

    const nextSlide = () =>
        setCurrentIndex((i) => (i + 1) % slideCount);

    const prevSlide = () =>
        setCurrentIndex((i) => (i - 1 + slideCount) % slideCount);

    const goToSlide = (index) => setCurrentIndex(index);

    /* ---------------------------------- */
    /* Drag Handlers (WITH VISUAL FEEDBACK) */
    /* ---------------------------------- */

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragDistance(0);
        dragStartRef.current = e.clientX;
        dragCurrentRef.current = e.clientX;
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        dragCurrentRef.current = e.clientX;
        const distance = dragCurrentRef.current - dragStartRef.current;
        setDragDistance(distance);
    };

    const handleMouseUp = () => {
        if (!isDragging) return;
        setIsDragging(false);
        const distance = dragStartRef.current - dragCurrentRef.current;
        setDragDistance(0);

        if (Math.abs(distance) > 50) {
            distance > 0 ? nextSlide() : prevSlide();
        }
    };

    const handleMouseLeave = () => {
        if (isDragging) {
            setIsDragging(false);
            setDragDistance(0);
        }
        setIsHovered(false);
    };

    const handleTouchStart = (e) => {
        setIsDragging(true);
        setDragDistance(0);
        dragStartRef.current = e.touches[0].clientX;
        dragCurrentRef.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        dragCurrentRef.current = e.touches[0].clientX;
        const distance = dragCurrentRef.current - dragStartRef.current;
        setDragDistance(distance);
    };

    const handleTouchEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        const distance = dragStartRef.current - dragCurrentRef.current;
        setDragDistance(0);

        if (Math.abs(distance) > 30) {
            distance > 0 ? nextSlide() : prevSlide();
        }
    };

    /* ---------------------------------- */
    /* Click Handler                      */
    /* ---------------------------------- */

    const handleBannerClick = (itemCtrName) => {
        if (!itemCtrName || Math.abs(dragDistance) > 10) return;
        const params = new URLSearchParams({ itemCtrName });
        navigate(`/products-page?${params.toString()}`);
    };

    /* ---------------------------------- */
    /* Render                            */
    /* ---------------------------------- */

    const currentBanner = banners[currentIndex];
    const translateX = isDragging ? dragDistance : 0;

    return (
        <div className="w-full bg-white ">
            <div
                className="relative w-full overflow-hidden transform-gpu"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
            >
                <div className="py-2 sm:py-3 md:py-4">
                    <div
                        ref={containerRef}
                        className="flex justify-center px-2 sm:px-2 md:px-4 lg:px-6"
                    >
                        <div
                            className="relative w-full  transition-transform duration-300 ease-out cursor-pointer"
                            style={{
                                transform: `translateX(${translateX}px)`,
                            }}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            onClick={() => handleBannerClick(currentBanner?.itemname)}
                        >
                            <div className="relative w-full  overflow-hidden rounded-2xl shadow-md will-change-transform">
                                {/* 19:6 Aspect Ratio Container */}
                                <div className="relative w-full  h-0 pb-[31.578%]"> {/* 6/19 = 0.31578 = 31.578% */}
                                    <img
                                        src={getProductImages(currentBanner?.image_path)}
                                        alt={currentBanner?.alt || "Banner"}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        loading="eager"
                                        decoding="async"
                                        fetchpriority="high"
                                        draggable={false}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Arrows - Now positioned relative to the banner */}
                {slideCount > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/80 shadow hover:bg-white flex items-center justify-center text-xl md:text-2xl"
                            aria-label="Previous banner"
                        >
                            ‹
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/80 shadow hover:bg-white flex items-center justify-center text-xl md:text-2xl"
                            aria-label="Next banner"
                        >
                            ›
                        </button>
                    </>
                )}

                {/* Dots */}
                {slideCount > 1 && (
                    <div className="flex justify-center gap-3 pb-4 mt-2">
                        {banners.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goToSlide(i)}
                                className="focus:outline-none"
                                aria-label={`Go to banner ${i + 1}`}
                            >
                                <div
                                    className={`h-2.5 rounded-full transition-all duration-300 ${i === currentIndex
                                            ? "w-10 bg-amber-600"
                                            : "w-2.5 bg-gray-400 hover:bg-gray-500"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default memo(BannerCarousel);