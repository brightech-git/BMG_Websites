import { useState, useEffect, useRef, memo } from "react";
import { useNavigate } from "react-router-dom";
import { getProductImages } from "../../../utils/getProductImages";

/* ---------------------------------- */
/* Skeleton Loader                    */
/* ---------------------------------- */

const BannerSkeleton = () => (
    <div className="flex justify-center items-center gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6 md:px-8 lg:px-12">
        {["left", "center", "right"].map((pos) => {
            const isMain = pos === "center";
            return (
                <div
                    key={pos}
                    className={`flex-shrink-0 flex items-center ${isMain
                            ? "w-full md:w-[78%] lg:w-[66%]"
                            : "w-full md:w-[58%] lg:w-[50%]"
                        }`}
                >
                    <div className="relative w-full rounded-2xl overflow-hidden bg-gray-200 animate-pulse">
                        <div className="w-full h-0 pb-[56.25%]" />
                    </div>
                </div>
            );
        })}
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

    const dragStartRef = useRef(0);
    const dragCurrentRef = useRef(0);
    const autoplayRef = useRef(null);

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
    /* Drag Handlers (NO RERENDER)        */
    /* ---------------------------------- */

    const handleMouseDown = (e) => {
        setIsDragging(true);
        dragStartRef.current = e.clientX;
        dragCurrentRef.current = e.clientX;
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        dragCurrentRef.current = e.clientX;
    };

    const handleMouseUp = () => {
        if (!isDragging) return;
        setIsDragging(false);
        const distance = dragStartRef.current - dragCurrentRef.current;
        if (Math.abs(distance) > 50) {
            distance > 0 ? nextSlide() : prevSlide();
        }
    };

    const handleTouchStart = (e) => {
        setIsDragging(true);
        dragStartRef.current = e.touches[0].clientX;
        dragCurrentRef.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        dragCurrentRef.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        const distance = dragStartRef.current - dragCurrentRef.current;
        if (Math.abs(distance) > 30) {
            distance > 0 ? nextSlide() : prevSlide();
        }
    };

    /* ---------------------------------- */
    /* Click Handler                      */
    /* ---------------------------------- */

    const handleBannerClick = (itemCtrName) => {
        if (!itemCtrName) return;
        const params = new URLSearchParams({ itemCtrName });
        navigate(`/products-page?${params.toString()}`);
    };

    /* ---------------------------------- */
    /* Render                            */
    /* ---------------------------------- */

    return (
        <div className="w-full bg-white mt-[130px]">
            <div
                className="relative w-full overflow-hidden transform-gpu"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div className="py-4 sm:py-6 md:py-8">
                    <div className="flex justify-center items-center gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6 md:px-8 lg:px-12">
                        {["left", "center", "right"].map((position) => {
                            const index =
                                position === "left"
                                    ? (currentIndex - 1 + slideCount) % slideCount
                                    : position === "right"
                                        ? (currentIndex + 1) % slideCount
                                        : currentIndex;

                            const banner = banners[index];
                            const isMain = position === "center";

                            return (
                                <div
                                    key={position}
                                    className={`flex-shrink-0 flex items-center transition-transform duration-700 ease-out ${isMain
                                            ? "w-full md:w-[78%] lg:w-[66%] scale-100 z-10"
                                            : "w-full md:w-[58%] lg:w-[50%] scale-95 opacity-80"
                                        }`}
                                >
                                    <div
                                        className="relative w-full overflow-hidden rounded-2xl shadow-md cursor-pointer will-change-transform"
                                        onClick={() =>
                                            handleBannerClick(banner?.itemname)
                                        }
                                    >
                                        <div className="relative w-full h-0 pb-[56.25%]">
                                            <img
                                                src={getProductImages(banner?.image_path)}
                                                alt={banner?.alt || "Banner"}
                                                className="absolute inset-0 w-full h-full object-cover"
                                                loading={isMain ? "eager" : "lazy"}
                                                decoding="async"
                                                fetchpriority={isMain ? "high" : "low"}
                                                draggable={false}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Arrows */}
                {slideCount > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 shadow hover:bg-white"
                        >
                            ‹
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 shadow hover:bg-white"
                        >
                            ›
                        </button>
                    </>
                )}

                {/* Dots */}
                {slideCount > 1 && (
                    <div className="flex justify-center gap-3 pb-4">
                        {banners.map((_, i) => (
                            <button key={i} onClick={() => goToSlide(i)}>
                                <div
                                    className={`h-2.5 rounded-full transition-all duration-300 ${i === currentIndex
                                            ? "w-10 bg-amber-600"
                                            : "w-2.5 bg-gray-400"
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
