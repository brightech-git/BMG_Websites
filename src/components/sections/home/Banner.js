import { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { getProductImages } from '../../../utils/getProductImages';

// Skeleton Loader
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
                    <div className="relative w-full rounded-2xl overflow-hidden shadow-xl bg-gray-200 animate-pulse">
                        <div className="w-full h-0 pb-[56.25%]" />
                    </div>
                </div>
            );
        })}
    </div>
);

export default function BannerCarousel({ banners = [], isLoading = false, itemName = '' }) {
    const history = useHistory();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState(0);
    const [dragCurrent, setDragCurrent] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const autoplayRef = useRef(null);
    const slideCount = banners.length;

    // Auto-scroll functionality
    useEffect(() => {
        if (isHovered || isDragging || isLoading || slideCount <= 1 || isTransitioning) {
            if (autoplayRef.current) {
                clearInterval(autoplayRef.current);
                autoplayRef.current = null;
            }
            return;
        }

        autoplayRef.current = setInterval(() => {
            setIsTransitioning(true);
            setCurrentIndex((i) => (i + 1) % slideCount);

            // Reset transition state after animation
            setTimeout(() => {
                setIsTransitioning(false);
            }, 700);
        }, 4000);

        return () => {
            if (autoplayRef.current) {
                clearInterval(autoplayRef.current);
                autoplayRef.current = null;
            }
        };
    }, [isHovered, isDragging, isLoading, slideCount, isTransitioning]);

    // EARLY RETURNS
    if (isLoading) {
        return (
            <div className="w-full bg-white mt-[130px] py-8">
                <BannerSkeleton />
            </div>
        );
    }

    if (slideCount === 0) return null;

    // Navigation helpers
    const goToSlide = (index) => {
        if (!isTransitioning) {
            setIsTransitioning(true);
            setCurrentIndex(index % slideCount);
            setTimeout(() => setIsTransitioning(false), 700);
        }
    };

    const nextSlide = () => {
        if (!isTransitioning) {
            setIsTransitioning(true);
            setCurrentIndex((i) => (i + 1) % slideCount);
            setTimeout(() => setIsTransitioning(false), 700);
        }
    };

    const prevSlide = () => {
        if (!isTransitioning) {
            setIsTransitioning(true);
            setCurrentIndex((i) => (i - 1 + slideCount) % slideCount);
            setTimeout(() => setIsTransitioning(false), 700);
        }
    };

    // Drag & Touch Handlers
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart(e.clientX);
        setDragCurrent(e.clientX);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setDragCurrent(e.clientX);
    };

    const handleMouseUp = () => {
        if (!isDragging) return;
        setIsDragging(false);
        const distance = dragStart - dragCurrent;
        if (Math.abs(distance) > 50) {
            distance > 0 ? nextSlide() : prevSlide();
        }
    };

    const handleTouchStart = (e) => {
        setIsDragging(true);
        setDragStart(e.touches[0].clientX);
        setDragCurrent(e.touches[0].clientX);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        setDragCurrent(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        const distance = dragStart - dragCurrent;
        if (Math.abs(distance) > 30) {
            distance > 0 ? nextSlide() : prevSlide();
        }
    };

    // Navigate with itemName as query param
    const handleBannerClick = (itemCtrName) => {
        if (!itemCtrName) return;
        const queryParams = new URLSearchParams();
        queryParams.append('itemCtrName', itemCtrName);
        const fixedQuery = queryParams.toString().replace(/\+/g, '%20');
        history.push(`/products-page?${fixedQuery.toString()}`);
    };

    return (
        <div className="w-full bg-white mt-[130px]">
            <div
                className="relative w-full overflow-hidden"
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
                            const slideIndex =
                                position === "left"
                                    ? (currentIndex - 1 + slideCount) % slideCount
                                    : position === "right"
                                        ? (currentIndex + 1) % slideCount
                                        : currentIndex;

                            const banner = banners[slideIndex];
                            const isMain = position === "center";

                            return (
                                <div
                                    key={`${currentIndex}-${position}`}
                                    className={`flex-shrink-0 flex items-center transition-all duration-700 ease-out ${isMain
                                        ? "w-full md:w-[78%] lg:w-[66%] scale-100 z-10"
                                        : "w-full md:w-[58%] lg:w-[50%] scale-95 opacity-75 hover:opacity-90"
                                        }`}
                                >
                                    <div
                                        className={`relative w-full overflow-hidden rounded-2xl shadow-xl cursor-pointer transition-all duration-300 hover:shadow-2xl 
                                            }`}
                                        onClick={() => handleBannerClick(banner?.itemname)}
                                    >
                                        <div className="relative w-full h-0 pb-[56.25%]">
                                            <img
                                                src={getProductImages(banner?.image_path)}
                                                alt={banner?.alt || "Banner"}
                                                className="absolute inset-0 w-full h-full object-cover"
                                                loading={isMain ? "eager" : "lazy"}
                                                draggable={false}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Navigation Arrows */}
                {slideCount > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            disabled={isTransitioning}
                            className="absolute left-4 top-[45%] -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 shadow-lg hover:bg-white flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50"
                            aria-label="Previous slide"
                        >
                            <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={nextSlide}
                            disabled={isTransitioning}
                            className="absolute right-4 top-[45%] -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 shadow-lg hover:bg-white flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50"
                            aria-label="Next slide"
                        >
                            <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}

                {/* Dots Navigation */}
                {slideCount > 1 && (
                    <div className="flex justify-center gap-3 pb-4 ">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className="transition-all duration-500 focus:outline-none"
                                aria-label={`Go to slide ${index + 1}`}
                                disabled={isTransitioning}
                            >
                                <div
                                    className={`h-2.5 rounded-full transition-all duration-500 ${index === currentIndex
                                        ? "w-10 bg-amber-600 shadow-lg shadow-amber-600/50"
                                        : "w-2.5 bg-gray-400 hover:bg-gray-500"
                                        } ${isTransitioning ? 'opacity-70' : ''}`}
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}