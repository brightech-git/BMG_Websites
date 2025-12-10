import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Pause  , Play } from 'lucide-react';
import { motion } from 'framer-motion';
import PinchZoomPan from './PinchZoomPan';

const ImageGallery = ({ images, videos = [], badges = {} }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [showZoomPreview, setShowZoomPreview] = useState(false);
    const [showArrows, setShowArrows] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
    const [autoScroll, setAutoScroll] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const mainImageRef = useRef(null);
    const zoomTimeoutRef = useRef(null);
    const containerRef = useRef(null);
    const zoomImageRef = useRef(null);
    const touchStartRef = useRef({ x: 0, y: 0 });
    const touchStartTimeRef = useRef(0);
    const autoScrollRef = useRef(null);
    const thumbnailContainerRef = useRef(null);

    // Combine images and videos into a single media array
    const media = [
        ...images.map((img, index) => ({
            type: 'image',
            src: img?.img || img,
            data: img,
            index
        })),
        ...videos.map((video, index) => ({
            type: 'video',
            src: video?.video || video,
            data: video?.video || video,
            index: images.length + index
        }))
    ];

    // Navigation functions
    const goToNext = useCallback(() => {
        setCurrentSlide(prev => (prev + 1) % media.length);
        resetImagePosition();
    }, [media.length]);

    const goToPrev = useCallback(() => {
        setCurrentSlide(prev => (prev - 1 + media.length) % media.length);
        resetImagePosition();
    }, [media.length]);

    const goToSlide = useCallback((index) => {
        setCurrentSlide(index);
        resetImagePosition();
    }, []);

    const resetImagePosition = useCallback(() => {
        setImagePosition({ x: 0, y: 0 });
    }, []);

    // Auto-scroll functionality
    const startAutoScroll = useCallback(() => {
        if (autoScrollRef.current) {
            clearInterval(autoScrollRef.current);
        }
        autoScrollRef.current = setInterval(goToNext, 5000);
    }, [goToNext]);

    const stopAutoScroll = useCallback(() => {
        if (autoScrollRef.current) {
            clearInterval(autoScrollRef.current);
            autoScrollRef.current = null;
        }
    }, []);

    const toggleAutoScroll = useCallback(() => {
        if (autoScroll) {
            stopAutoScroll();
            setAutoScroll(false);
        } else {
            startAutoScroll();
            setAutoScroll(true);
        }
    }, [autoScroll, startAutoScroll, stopAutoScroll]);

    // Auto-scroll to current thumbnail
    const scrollToCurrentThumbnail = useCallback(() => {
        if (thumbnailContainerRef.current && media.length > 1) {
            const thumbnailContainer = thumbnailContainerRef.current;
            const thumbnails = thumbnailContainer.querySelectorAll('.thumbnail');

            if (thumbnails[currentSlide]) {
                const thumbnail = thumbnails[currentSlide];
                const containerRect = thumbnailContainer.getBoundingClientRect();
                const thumbnailRect = thumbnail.getBoundingClientRect();

                const scrollLeft = thumbnail.offsetLeft - (containerRect.width / 2) + (thumbnailRect.width / 2);
                thumbnailContainer.scrollTo({
                    left: scrollLeft,
                    behavior: 'smooth'
                });
            }
        }
    }, [currentSlide, media.length]);

    const handleMouseEnter = () => {
        setShowArrows(true);
        if (media[currentSlide]?.type === 'image') {
            zoomTimeoutRef.current = setTimeout(() => {
                setShowZoomPreview(true);
            }, 200);
        }
    };

    const handleMouseLeave = () => {
        if (zoomTimeoutRef.current) {
            clearTimeout(zoomTimeoutRef.current);
        }
        setShowZoomPreview(false);
        setShowArrows(false);
    };

    // Enhanced Zoom Modal Functions (only for images)
    const openZoom = useCallback((index) => {
        // Only open zoom for images, not videos
        // if (media[index]?.type === 'video') return;

        setCurrentSlide(index);
        setIsZoomed(true);
        setZoomLevel(1);
        resetImagePosition();
        document.body.style.overflow = 'hidden';
    }, [media, resetImagePosition]);

    const closeZoom = useCallback(() => {
        setIsZoomed(false);
        setZoomLevel(1);
        resetImagePosition();
        document.body.style.overflow = 'auto';
    }, [resetImagePosition]);

    // Enhanced Zoom controls with boundaries (only for images)
    const zoomIn = useCallback(() => {
        // Only allow zoom for images
        if (media[currentSlide]?.type === 'video') return;

        setZoomLevel(prev => {
            const newZoom = Math.min(prev + 0.5, 5);
            adjustPositionForZoom(newZoom, prev);
            return newZoom;
        });
    }, [currentSlide, media]);

    const zoomOut = useCallback(() => {
        // Only allow zoom for images
        // if (media[currentSlide]?.type === 'video') return;

        setZoomLevel(prev => {
            const newZoom = Math.max(prev - 0.5, 1);
            if (newZoom === 1) {
                resetImagePosition();
            } else {
                adjustPositionForZoom(newZoom, prev);
            }
            return newZoom;
        });
    }, [currentSlide, media, resetImagePosition]);

    const resetZoom = useCallback(() => {
        // Only allow zoom for images
        // if (media[currentSlide]?.type === 'video') return;

        setZoomLevel(1);
        resetImagePosition();
    }, [currentSlide, media, resetImagePosition]);

    const adjustPositionForZoom = useCallback((newZoom, oldZoom) => {
        if (newZoom > oldZoom) {
            // Keep the image centered when zooming in
            setImagePosition({ x: 0, y: 0 });
        }
    }, []);

    // Enhanced Mouse Drag for Zoomed Image (only for images)
    const handleZoomMouseDown = useCallback((e) => {
        if (zoomLevel <= 1 || media[currentSlide]?.type === 'video') return;

        setIsDragging(true);
        setDragStart({
            x: e.clientX - imagePosition.x,
            y: e.clientY - imagePosition.y
        });

        if (zoomImageRef.current) {
            zoomImageRef.current.style.cursor = 'grabbing';
        }
    }, [zoomLevel, imagePosition, currentSlide, media]);

    const handleZoomMouseMove = useCallback((e) => {
        if (!isDragging || zoomLevel <= 1 || media[currentSlide]?.type === 'video') return;

        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;

        // Calculate boundaries based on zoom level
        const zoomFactor = zoomLevel - 1;
        const maxDrag = 100 * zoomFactor;

        setImagePosition({
            x: Math.max(-maxDrag, Math.min(maxDrag, newX)),
            y: Math.max(-maxDrag, Math.min(maxDrag, newY))
        });
    }, [isDragging, dragStart, zoomLevel, currentSlide, media]);

    const handleZoomMouseUp = useCallback(() => {
        setIsDragging(false);
        if (zoomImageRef.current) {
            zoomImageRef.current.style.cursor = zoomLevel > 1 ? 'grab' : 'default';
        }
    }, [zoomLevel]);

    // Enhanced Touch Events for Mobile Swipe
    const handleTouchStart = useCallback((e) => {
        if (!isZoomed) return;

        const touch = e.touches[0];
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
        touchStartTimeRef.current = Date.now();

        if (zoomLevel > 1 && media[currentSlide]?.type === 'image') {
            setIsDragging(true);
            setDragStart({
                x: touch.clientX - imagePosition.x,
                y: touch.clientY - imagePosition.y
            });
        }
    }, [isZoomed, zoomLevel, imagePosition, currentSlide, media]);

    const handleTouchMove = useCallback((e) => {
        if (!isZoomed) return;

        const touch = e.touches[0];
        const deltaX = touch.clientX - touchStartRef.current.x;
        const deltaY = touch.clientY - touchStartRef.current.y;

        if (zoomLevel > 1 && media[currentSlide]?.type === 'image') {
            // Dragging zoomed image
            e.preventDefault();
            const newX = touch.clientX - dragStart.x;
            const newY = touch.clientY - dragStart.y;

            const zoomFactor = zoomLevel - 1;
            const maxDrag = 150 * zoomFactor;

            setImagePosition({
                x: Math.max(-maxDrag, Math.min(maxDrag, newX)),
                y: Math.max(-maxDrag, Math.min(maxDrag, newY))
            });
        } else {
            // Swipe navigation for non-zoomed state
            if (Math.abs(deltaX) > 50 && media.length > 1) {
                e.preventDefault();
                if (deltaX > 0) {
                    goToPrev();
                } else {
                    goToNext();
                }
                touchStartRef.current = { x: touch.clientX, y: touch.clientY };
            }
        }
    }, [isZoomed, zoomLevel, dragStart, media, currentSlide, goToPrev, goToNext]);

    const handleTouchEnd = useCallback((e) => {
        if (!isZoomed) return;

        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - touchStartRef.current.x;
        const deltaTime = Date.now() - touchStartTimeRef.current;

        // Swipe detection for image navigation (only when not zoomed)
        if (zoomLevel === 1 && Math.abs(deltaX) > 50 && deltaTime < 300 && media.length > 1) {
            if (deltaX > 0) {
                goToPrev();
            } else {
                goToNext();
            }
        }

        setIsDragging(false);
    }, [isZoomed, zoomLevel, media.length, goToPrev, goToNext]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isZoomed) {
                switch (e.key) {
                    case 'Escape':
                        closeZoom();
                        break;
                    case 'ArrowLeft':
                        goToPrev();
                        break;
                    case 'ArrowRight':
                        goToNext();
                        break;
                    case '+':
                    case '=':
                        if (media[currentSlide]?.type === 'image') zoomIn();
                        break;
                    case '-':
                        if (media[currentSlide]?.type === 'image') zoomOut();
                        break;
                    case '0':
                        if (media[currentSlide]?.type === 'image') resetZoom();
                        break;
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isZoomed, closeZoom, goToPrev, goToNext, zoomIn, zoomOut, resetZoom, currentSlide, media]);

    // Mouse event listeners for dragging
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleZoomMouseMove);
            document.addEventListener('mouseup', handleZoomMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleZoomMouseMove);
            document.removeEventListener('mouseup', handleZoomMouseUp);
        };
    }, [isDragging, handleZoomMouseMove, handleZoomMouseUp]);

    // Auto-scroll and thumbnail scrolling effects
    useEffect(() => {
        if (autoScroll) {
            startAutoScroll();
        } else {
            stopAutoScroll();
        }

        return () => {
            stopAutoScroll();
        };
    }, [autoScroll, startAutoScroll, stopAutoScroll]);

    useEffect(() => {
        scrollToCurrentThumbnail();
    }, [currentSlide, scrollToCurrentThumbnail]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            document.body.style.overflow = 'auto';
            if (zoomTimeoutRef.current) {
                clearTimeout(zoomTimeoutRef.current);
            }
            stopAutoScroll();
        };
    }, [stopAutoScroll]);

    if (!media || media.length === 0) {
        return <div className="gallery-container">No media available</div>;
    }

    const currentMedia = media[currentSlide];
    const hasBadges = badges && Object.keys(badges).length > 0;
    const isCurrentImage = currentMedia?.type === 'image';
    const isCurrentVideo = currentMedia?.type === 'video';

    return (
        <>
            {/* Gallery Container */}
            <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="container mx-auto">
                    {/* Main Media Display */}
                    <div className="relative bg-gray-100">
                        {/* Media Counter */}
                        <div className="absolute top-4 right-4 bg-black/70 text-white p-1.5 py-1.5 rounded text-xs font-medium z-10 backdrop-blur-sm flex items-center gap-2">
                            {currentSlide + 1} / {media.length}
                            {isCurrentVideo && <span className="bg-red-500 px-2 py-1 rounded text-xs font-bold">VIDEO</span>}
                        </div>

                        {/* Product Badges */}
                        {hasBadges && (
                            <div className="absolute top-4 left-4 flex gap-2 z-10">
                                {badges.NewArrival && <span className="bg-green-500 text-white px-3 py-1 rounded text-xs font-bold">New</span>}
                                {badges.Top_Trending && <span className="bg-orange-500 text-white px-3 py-1 rounded text-xs font-bold">Trending</span>}
                                {badges.discountPercentage > 0 && (
                                    <span className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold">-{badges.discountPercentage}%</span>
                                )}
                            </div>
                        )}

                        {/* Main Media Wrapper */}
                        <div
                            ref={containerRef}
                            className="relative w-full aspect-square overflow-hidden bg-white cursor-crosshair"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            {isCurrentImage ? (
                                <img
                                    ref={mainImageRef}
                                    src={currentMedia.src}
                                    alt={`Product view ${currentSlide + 1}`}
                                    className="w-full h-full object-contain select-none transition-transform duration-300"
                                    onClick={() => openZoom(currentSlide)}
                                />
                            ) : (
                                <video className="w-full h-full object-contain" controls playsInline preload="metadata">
                                    <source src={currentMedia.src} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}

                            {/* Navigation Arrows */}
                            {media.length > 1 && (
                                <>
                                    <button
                                        className={`absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-gray-800 flex items-center justify-center text-xl font-bold shadow-lg transition-all hover:scale-110 hover:bg-white ${showArrows ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                                        onClick={goToPrev}
                                        aria-label="Previous media"
                                    >
                                        ‹
                                    </button>
                                    <button
                                        className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-gray-800 flex items-center justify-center text-xl font-bold shadow-lg transition-all hover:scale-110 hover:bg-white ${showArrows ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                                        onClick={goToNext}
                                        aria-label="Next media"
                                    >
                                        ›
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Auto-scroll Toggle */}
                        {media.length > 1 && (
                            <div className="absolute bottom-3 right-3 z-10">
                                <button
                                    className={`w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center text-lg transition-all hover:bg-black/80 ${autoScroll ? 'bg-orange-500' : ''}`}
                                    onClick={toggleAutoScroll}
                                    aria-label={autoScroll ? 'Stop auto-scroll' : 'Start auto-scroll'}
                                >
                                    {autoScroll ? <Pause className='w-3 h-3' /> : <Play className='w-3 h-3' />}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Thumbnail Gallery */}
                {media.length > 1 && (
                    <div className="bg-white py-2 border-t border-gray-200">
                        <div className="flex justify-center gap-2 overflow-x-auto p-1.5 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                            {media.map((item, index) => (
                                <div
                                    key={index}
                                    className={`relative flex-shrink-0 w-10  sm:w-16 h-10 sm:h-16 border-2 rounded cursor-pointer transition-all ${index === currentSlide
                                            ? 'border-blue-500 shadow-md scale-105'
                                            : 'border-transparent hover:scale-105'
                                        } ${item.type === 'video' ? 'video-thumbnail' : ''}`}
                                    onClick={() => goToSlide(index)}
                                >
                                    {item.type === 'image' ? (
                                        <img
                                            src={item.src}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover rounded"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <>
                                            <video className="w-full h-full object-cover rounded" preload="metadata">
                                                <source src={item.src} type="video/mp4" />
                                            </video>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm"><Play className='w-3 h-3' /> </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Fullscreen Zoom Modal */}
            {isZoomed && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="fixed inset-0 z-[9999] bg-black overflow-hidden"
                    onClick={(e) => e.target === e.currentTarget && closeZoom()}
                >
                    {/* Ultra-smooth animated backdrop */}
                    <motion.div
                        initial={{ backdropFilter: "blur(0px)" }}
                        animate={{ backdropFilter: "blur(32px)" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="absolute inset-0 bg-black/90"
                    />

                    {/* Entire content */}
                    <div className="relative w-full h-full">
                        {/* Top bar - ALWAYS VISIBLE NOW */}
                        <motion.div
                            initial={{ y: 0 }}
                            className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center px-safe-or-6 py-safe-or-6 pointer-events-none"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-white/10 backdrop-blur-2xl px-5 py-2.5 rounded-full text-white/90 text-sm font-medium border border-white/10">
                                    {currentSlide + 1} / {media.length}
                                </div>

                                {/* Optional badges - super minimal */}
                                {hasBadges && (
                                    <div className="flex gap-2">
                                        {badges.NewArrival && <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs px-3 py-1.5 rounded-full font-semibold">New</span>}
                                        {badges.Top_Trending && <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold">Trending</span>}
                                        {badges.discountPercentage > 0 && (
                                            <span className="bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs px-3 py-1.5 rounded-full font-bold">
                                                -{badges.discountPercentage}%
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={closeZoom}
                                className="pointer-events-auto size-11 bg-white/10 backdrop-blur-2xl rounded-full flex items-center justify-center hover:bg-white/20 border border-white/10 transition-all duration-300"
                            >
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </motion.div>

                        {/* Navigation Arrows - ALWAYS VISIBLE NOW */}
                        {media.length > 1 && (
                            <>
                                <button
                                    onClick={goToPrev}
                                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 opacity-100 transition-opacity duration-300 group"
                                >
                                    <div className="size-8 md:size-10 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
                                        <svg className="w-3 h-3 md:w-4 md:h-4 text-white -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </div>
                                </button>

                                <button
                                    onClick={goToNext}
                                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 opacity-100 transition-opacity duration-300 group"
                                >
                                    <div className="size-8 md:size-10 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
                                        <svg className="w-3 h-3 md:w-4 md:h-4 text-white ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </button>
                            </>
                        )}

                        {/* MAIN ZOOM CONTAINER - SIMPLIFIED DRAG */}
                        <div className="h-full w-full flex items-center justify-center">
                            <PinchZoomPan
                                key={currentMedia.src}
                                minScale={1}
                                maxScale={6}
                                initialScale={zoomLevel}
                                onScaleChange={(scale) => {
                                    setZoomLevel(scale);
                                }}
                                onTap={() => setShowControls((prev) => !prev)}
                                className="w-full h-full"
                            >
                                {isCurrentImage ? (
                                    <motion.img
                                        src={currentMedia.src}
                                        alt="Zoomed media"
                                        className="select-none shadow-2xl rounded-xl"
                                        style={{
                                            willChange: "transform",
                                            maxWidth: "90vw",
                                            maxHeight: "90vh",
                                            width: "auto",
                                            height: "auto",
                                            display: "block",
                                        }}
                                    />
                                ) : (
                                    <video
                                        className="rounded-2xl shadow-2xl"
                                        style={{
                                            maxWidth: "90vw",
                                            maxHeight: "90vh",
                                            width: "auto",
                                            height: "auto",
                                            display: "block",
                                        }}
                                        controls={showControls}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                    >
                                        <source src={currentMedia.src} type="video/mp4" />
                                    </video>
                                )}
                            </PinchZoomPan>
                        </div>

                        {/* Bottom Thumbnail Strip - ALWAYS VISIBLE NOW */}
                        {media.length > 1 && (
                            <motion.div
                                initial={{ y: 0 }}
                                className="absolute bottom-0 left-0 right-0 pb-safe-or-8 px-4 md:px-6 pointer-events-none"
                            >
                                <div className="flex justify-center gap-2 md:gap-3 max-w-5xl mx-auto overflow-x-auto py-2 pointer-events-auto">
                                    {media.map((item, index) => (
                                        <motion.button
                                            key={index}
                                            whileTap={{ scale: 0.92 }}
                                            onClick={() => goToSlide(index)}
                                            className={`relative flex-shrink-0 size-16 md:size-20 rounded-2xl overflow-hidden border-2 transition-all ${index === currentSlide
                                                ? "border-white/70 shadow-2xl scale-110"
                                                : "border-white/10 opacity-60 hover:opacity-90"
                                                }`}
                                        >
                                            {item.type === "image" ? (
                                                <img src={item.src} className="w-full h-full object-cover" alt={`Thumbnail ${index + 1}`} />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                                                    <div className="size-8 md:size-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                                                        <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M8 5v14l11-7z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Double-tap hint - appears only when zoomed out */}
                        
                    </div>
                </motion.div>
            )}
            
        </>
    );
};

export default ImageGallery;