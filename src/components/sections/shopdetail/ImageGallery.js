import React, { useState, useRef, useEffect, useCallback } from 'react';
import './ImageGallery.css';

const ImageGallery = ({ images }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [showZoomPreview, setShowZoomPreview] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [showArrows, setShowArrows] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

    const mainImageRef = useRef(null);
    const zoomTimeoutRef = useRef(null);
    const containerRef = useRef(null);
    const zoomImageRef = useRef(null);
    const touchStartRef = useRef({ x: 0, y: 0 });
    const touchStartTimeRef = useRef(0);

    // Navigation functions
    const goToNext = useCallback(() => {
        setCurrentSlide(prev => (prev + 1) % images.length);
        resetImagePosition();
    }, [images.length]);

    const goToPrev = useCallback(() => {
        setCurrentSlide(prev => (prev - 1 + images.length) % images.length);
        resetImagePosition();
    }, [images.length]);

    const goToSlide = useCallback((index) => {
        setCurrentSlide(index);
        resetImagePosition();
    }, []);

    const resetImagePosition = useCallback(() => {
        setImagePosition({ x: 0, y: 0 });
    }, []);

    // Hover zoom functionality
    const handleMouseMove = useCallback((e) => {
        if (!mainImageRef.current || !containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();

        // Calculate relative position within the container
        const x = ((e.clientX - containerRect.left) / containerRect.width) * 100;
        const y = ((e.clientY - containerRect.top) / containerRect.height) * 100;

        // Check if mouse is within the main image container
        const isInside = e.clientX >= containerRect.left && e.clientX <= containerRect.right &&
            e.clientY >= containerRect.top && e.clientY <= containerRect.bottom;

        if (isInside) {
            setShowArrows(true);
            setShowZoomPreview(true);

            // Calculate zoom preview position relative to viewport
            const previewSize = 200;
            let previewX = e.clientX - previewSize / 2;
            let previewY = e.clientY - previewSize / 2;

            // Constrain zoom preview within viewport
            previewX = Math.max(10, Math.min(previewX, window.innerWidth - previewSize - 10));
            previewY = Math.max(10, Math.min(previewY, window.innerHeight - previewSize - 10));

            setMousePosition({ x: previewX, y: previewY });
            setZoomPosition({
                x: Math.max(0, Math.min(100, x)),
                y: Math.max(0, Math.min(100, y))
            });
        } else {
            setShowArrows(false);
            setShowZoomPreview(false);
        }
    }, []);

    const handleMouseEnter = () => {
        setShowArrows(true);
        zoomTimeoutRef.current = setTimeout(() => {
            setShowZoomPreview(true);
        }, 200);
    };

    const handleMouseLeave = () => {
        if (zoomTimeoutRef.current) {
            clearTimeout(zoomTimeoutRef.current);
        }
        setShowZoomPreview(false);
        setShowArrows(false);
    };

    // Enhanced Zoom Modal Functions
    const openZoom = useCallback((imgSrc, index) => {
        setCurrentSlide(index);
        setIsZoomed(true);
        setZoomLevel(1);
        resetImagePosition();
        document.body.style.overflow = 'hidden';
    }, [resetImagePosition]);

    const closeZoom = useCallback(() => {
        setIsZoomed(false);
        setZoomLevel(1);
        resetImagePosition();
        document.body.style.overflow = 'auto';
    }, [resetImagePosition]);

    // Enhanced Zoom controls with boundaries
    const zoomIn = useCallback(() => {
        setZoomLevel(prev => {
            const newZoom = Math.min(prev + 0.5, 5);
            adjustPositionForZoom(newZoom, prev);
            return newZoom;
        });
    }, []);

    const zoomOut = useCallback(() => {
        setZoomLevel(prev => {
            const newZoom = Math.max(prev - 0.5, 1);
            if (newZoom === 1) {
                resetImagePosition();
            } else {
                adjustPositionForZoom(newZoom, prev);
            }
            return newZoom;
        });
    }, [resetImagePosition]);

    const resetZoom = useCallback(() => {
        setZoomLevel(1);
        resetImagePosition();
    }, [resetImagePosition]);

    const adjustPositionForZoom = useCallback((newZoom, oldZoom) => {
        if (newZoom > oldZoom) {
            // Keep the image centered when zooming in
            setImagePosition({ x: 0, y: 0 });
        }
    }, []);

    // Enhanced Mouse Drag for Zoomed Image
    const handleZoomMouseDown = useCallback((e) => {
        if (zoomLevel <= 1) return;

        setIsDragging(true);
        setDragStart({
            x: e.clientX - imagePosition.x,
            y: e.clientY - imagePosition.y
        });

        if (zoomImageRef.current) {
            zoomImageRef.current.style.cursor = 'grabbing';
        }
    }, [zoomLevel, imagePosition]);

    const handleZoomMouseMove = useCallback((e) => {
        if (!isDragging || zoomLevel <= 1) return;

        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;

        // Calculate boundaries based on zoom level
        const zoomFactor = zoomLevel - 1;
        const maxDrag = 100 * zoomFactor;

        setImagePosition({
            x: Math.max(-maxDrag, Math.min(maxDrag, newX)),
            y: Math.max(-maxDrag, Math.min(maxDrag, newY))
        });
    }, [isDragging, dragStart, zoomLevel]);

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

        if (zoomLevel > 1) {
            setIsDragging(true);
            setDragStart({
                x: touch.clientX - imagePosition.x,
                y: touch.clientY - imagePosition.y
            });
        }
    }, [isZoomed, zoomLevel, imagePosition]);

    const handleTouchMove = useCallback((e) => {
        if (!isZoomed) return;

        const touch = e.touches[0];
        const deltaX = touch.clientX - touchStartRef.current.x;
        const deltaY = touch.clientY - touchStartRef.current.y;

        if (zoomLevel > 1) {
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
            if (Math.abs(deltaX) > 50 && images.length > 1) {
                e.preventDefault();
                if (deltaX > 0) {
                    goToPrev();
                } else {
                    goToNext();
                }
                touchStartRef.current = { x: touch.clientX, y: touch.clientY };
            }
        }
    }, [isZoomed, zoomLevel, dragStart, images.length, goToPrev, goToNext]);

    const handleTouchEnd = useCallback((e) => {
        if (!isZoomed) return;

        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - touchStartRef.current.x;
        const deltaTime = Date.now() - touchStartTimeRef.current;

        // Swipe detection for image navigation (only when not zoomed)
        if (zoomLevel === 1 && Math.abs(deltaX) > 50 && deltaTime < 300 && images.length > 1) {
            if (deltaX > 0) {
                goToPrev();
            } else {
                goToNext();
            }
        }

        setIsDragging(false);
    }, [isZoomed, zoomLevel, images.length, goToPrev, goToNext]);

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
                        zoomIn();
                        break;
                    case '-':
                        zoomOut();
                        break;
                    case '0':
                        resetZoom();
                        break;
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isZoomed, closeZoom, goToPrev, goToNext, zoomIn, zoomOut, resetZoom]);

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

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            document.body.style.overflow = 'auto';
            if (zoomTimeoutRef.current) {
                clearTimeout(zoomTimeoutRef.current);
            }
        };
    }, []);

    if (!images || images.length === 0) {
        return <div className="gallery-container">No images available</div>;
    }

    return (
        <>
            <div className="gallery-container">
                <div className='container'>
                    {/* Main Image Display */}
                    <div className="main-image-container">
                        <div className="image-counter">
                            {currentSlide + 1} / {images.length}
                        </div>

                        <div
                            ref={containerRef}
                            className="main-image-wrapper"
                            onMouseMove={handleMouseMove}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <img
                                ref={mainImageRef}
                                src={images[currentSlide]?.img || images[currentSlide]}
                                alt={`Product view ${currentSlide + 1}`}
                                className="main-image"
                                onClick={() => openZoom(images[currentSlide]?.img || images[currentSlide], currentSlide)}
                            />

                            {images.length > 1 && (
                                <>
                                    <button
                                        className={`nav-arrow nav-prev ${showArrows ? 'visible' : ''}`}
                                        onClick={goToPrev}
                                        aria-label="Previous image"
                                    >
                                        &#8249;
                                    </button>
                                    <button
                                        className={`nav-arrow nav-next ${showArrows ? 'visible' : ''}`}
                                        onClick={goToNext}
                                        aria-label="Next image"
                                    >
                                        &#8250;
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Thumbnail Gallery */}
                {images.length > 1 && (
                    <div className="thumbnail-container">
                        <div className="thumbnail-wrapper">
                            {images.map((item, index) => (
                                <div
                                    key={index}
                                    className={`thumbnail ${index === currentSlide ? 'active' : ''}`}
                                    onClick={() => goToSlide(index)}
                                >
                                    <img
                                        src={item?.img || item}
                                        alt={`Thumbnail ${index + 1}`}
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Enhanced Fullscreen Zoom Modal */}
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
                                {currentSlide + 1} / {images.length}
                            </div>

                            {/* Zoom level indicator */}
                            <div className="zoom-level-display">
                                {Math.round(zoomLevel * 100)}%
                            </div>

                            <div className="zoom-header-controls">
                                <button
                                    className="zoom-reset-btn header-btn"
                                    onClick={resetZoom}
                                    disabled={zoomLevel === 1}
                                    aria-label="Reset zoom"
                                >
                                    Reset
                                </button>
                                <button className="zoom-close" onClick={closeZoom} aria-label="Close zoom">
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Navigation Arrows */}
                        {images.length > 1 && (
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
                            onMouseDown={handleZoomMouseDown}
                        >
                            <img
                                ref={zoomImageRef}
                                src={images[currentSlide]?.img || images[currentSlide]}
                                alt={`Zoomed view ${currentSlide + 1}`}
                                className="zoom-image"
                                style={{
                                    transform: `scale(${zoomLevel}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                                    transformOrigin: 'center center',
                                    cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
                                }}
                                draggable="false"
                            />

                           
                        </div>

                      

                        {/* Thumbnail strip in zoom modal */}
                        {images.length > 1 && (
                            <div className="zoom-thumbnails">
                                {/* Enhanced Control Bar */}
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
                                <div className="zoom-thumbnail-wrapper">
                                    {images.map((item, index) => (
                                        <div
                                            key={index}
                                            className={`zoom-thumbnail ${index === currentSlide ? 'active' : ''}`}
                                            onClick={() => goToSlide(index)}
                                        >
                                            <img
                                                src={item?.img || item}
                                                alt={`Thumbnail ${index + 1}`}
                                            />
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