import React, { useState, useRef, useEffect, useCallback } from 'react';
import './ImageGallery.css';

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
            <div className="gallery-container">
                <div className='container'>
                    {/* Main Media Display */}
                    <div className="main-image-container">
                        <div className="media-counter">
                            {currentSlide + 1} / {media.length}
                            {isCurrentVideo && <span className="video-badge">VIDEO</span>}
                        </div>

                        {/* Product Badges */}
                        {hasBadges && (
                            <div className="product-badges">
                                {badges.NewArrival && (
                                    <span className="badge new-arrival">New</span>
                                )}
                                {badges.Top_Trending && (
                                    <span className="badge trending">Trending</span>
                                )}
                                {badges.discountPercentage > 0 && (
                                    <span className="badge discount">-{badges.discountPercentage}%</span>
                                )}
                            </div>
                        )}

                        <div
                            ref={containerRef}
                            className="main-image-wrapper"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            {isCurrentImage ? (
                                <img
                                    ref={mainImageRef}
                                    src={currentMedia.src}
                                    alt={`Product view ${currentSlide + 1}`}
                                    className="main-image"
                                    onClick={() => openZoom(currentSlide)}
                                />
                            ) : (
                                <video
                                    className="main-video"
                                    controls
                                    playsInline
                                    preload="metadata"
                                >
                                    <source src={currentMedia.src} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}

                            {media.length > 1 && (
                                <>
                                    <button
                                        className={`nav-arrow nav-prev ${showArrows ? 'visible' : ''}`}
                                        onClick={goToPrev}
                                        aria-label="Previous media"
                                    >
                                        &#8249;
                                    </button>
                                    <button
                                        className={`nav-arrow nav-next ${showArrows ? 'visible' : ''}`}
                                        onClick={goToNext}
                                        aria-label="Next media"
                                    >
                                        &#8250;
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Auto-scroll toggle button */}
                        {media.length > 1 && (
                            <div className="auto-scroll-control">
                                <button
                                    className={`auto-scroll-btn ${autoScroll ? 'active' : ''}`}
                                    onClick={toggleAutoScroll}
                                    aria-label={autoScroll ? 'Stop auto-scroll' : 'Start auto-scroll'}
                                >
                                    {autoScroll ? '⏸️' : '▶️'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Thumbnail Gallery */}
                {media.length > 1 && (
                    <div className="thumbnail-container">
                        <div className="thumbnail-wrapper" ref={thumbnailContainerRef}>
                            {media.map((item, index) => (
                                <div
                                    key={index}
                                    className={`thumbnail ${index === currentSlide ? 'active' : ''} ${item.type === 'video' ? 'video-thumbnail' : ''}`}
                                    onClick={() => goToSlide(index)}
                                >
                                    {item.type === 'image' ? (
                                        <img
                                            src={item.src}
                                            alt={`Thumbnail ${index + 1}`}
                                            loading="lazy"
                                        />
                                    ) : (
                                        <>
                                            <video preload="metadata">
                                                <source src={item.src} type="video/mp4" />
                                            </video>
                                            <div className="video-play-icon">▶</div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Enhanced Fullscreen Zoom Modal (only for images) */}
            {isZoomed && (
                <div
                    className="zoom-modal fullscreen-zoom"
                    onClick={(e) => e.target === e.currentTarget && closeZoom()}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div className="zoom-modal-content fullscreen-content">
                        {/* Header with controls */}
                        <div className="zoom-header">
                            <div className="zoom-counter">
                                {currentSlide + 1} / {media.length}
                            </div>

                            {/* Product Badges in Zoom Modal */}
                            {hasBadges && (
                                <div className="zoom-badges">
                                    {badges.NewArrival && (
                                        <span className="badge new-arrival">New</span>
                                    )}
                                    {badges.Top_Trending && (
                                        <span className="badge trending">Trending</span>
                                    )}
                                    {badges.discountPercentage > 0 && (
                                        <span className="badge discount">-{badges.discountPercentage}%</span>
                                    )}
                                </div>
                            )}

                            {/* Zoom level indicator - only show for images */}
                            {isCurrentImage && (
                                <div className="zoom-level-display">
                                    {Math.round(zoomLevel * 100)}%
                                </div>
                            )}

                            <div className="zoom-header-controls">
                                {/* Reset button - only show for images when zoomed */}
                                {isCurrentImage && zoomLevel > 1 && (
                                    <button
                                        className="zoom-reset-btn header-btn"
                                        onClick={resetZoom}
                                        aria-label="Reset zoom"
                                    >
                                        Reset
                                    </button>
                                )}
                                <button className="zoom-close" onClick={closeZoom} aria-label="Close zoom">
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Navigation Arrows */}
                        {media.length > 1 && (
                            <>
                                <button
                                    className="zoom-nav zoom-nav-prev"
                                    onClick={goToPrev}
                                    aria-label="Previous image"
                                >
                                    &#8249;
                                </button>
                                <button
                                    className="zoom-nav zoom-nav-next"
                                    onClick={goToNext}
                                    aria-label="Next image"
                                >
                                    &#8250;
                                </button>
                            </>
                        )}

                        {/* Enhanced Image Container with Drag Support */}
                        <div
                            className="zoom-image-container fullscreen-image-container"
                            onMouseDown={isCurrentImage ? handleZoomMouseDown : undefined}
                        >
                            {isCurrentImage ? (
                                <img
                                    ref={zoomImageRef}
                                    src={currentMedia.src}
                                    alt={`Zoomed view ${currentSlide + 1}`}
                                    className="zoom-image"
                                    style={{
                                        transform: `scale(${zoomLevel}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                                        transformOrigin: 'center center',
                                        cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
                                    }}
                                    draggable="false"
                                />
                            ) : (
                                <video
                                    className="zoom-video"
                                    controls
                                    playsInline
                                    preload="metadata"
                                    autoPlay
                                    style={{width:'100vh', height:'100vh'}}
                                        
                                >
                                    <source src={currentMedia.src} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </div>

                        {/* Thumbnail strip in zoom modal - only show zoom controls for images */}
                        {media.length > 1 && (
                            <div className="zoom-thumbnails">
                                {/* Enhanced Control Bar - only show for images */}
                                {isCurrentImage && (
                                    <div className="zoom-controls-bar">
                                        <div className="zoom-controls">
                                            <button
                                                className="zoom-control-btn"
                                                onClick={zoomOut}
                                                disabled={zoomLevel <= 1}
                                                aria-label="Zoom out"
                                            >
                                                −
                                            </button>

                                            <div className="zoom-level-slider">
                                                <input
                                                    type="range"
                                                    min="1"
                                                    max="5"
                                                    step="0.1"
                                                    value={zoomLevel}
                                                    onChange={(e) => {
                                                        const newZoom = parseFloat(e.target.value);
                                                        setZoomLevel(newZoom);
                                                        if (newZoom === 1) resetImagePosition();
                                                    }}
                                                    className="zoom-slider"
                                                    aria-label="Zoom level"
                                                />
                                            </div>

                                            <button
                                                className="zoom-control-btn"
                                                onClick={zoomIn}
                                                disabled={zoomLevel >= 5}
                                                aria-label="Zoom in"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <div className="zoom-thumbnail-wrapper">
                                    {media.map((item, index) => (
                                        <div
                                            key={index}
                                            className={`zoom-thumbnail ${index === currentSlide ? 'active' : ''} ${item.type === 'video' ? 'video-thumbnail' : ''}`}
                                            onClick={() => goToSlide(index)}
                                        >
                                            {item.type === 'image' ? (
                                                <img
                                                    src={item.src}
                                                    alt={`Thumbnail ${index + 1}`}
                                                />
                                            ) : (
                                                <>
                                                    <video preload="metadata">
                                                        <source src={item.src} type="video/mp4" />
                                                    </video>
                                                    <div className="video-play-icon">▶</div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ImageGallery;