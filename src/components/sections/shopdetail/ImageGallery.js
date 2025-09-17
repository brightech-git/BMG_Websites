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
    const mainImageRef = useRef(null);
    const zoomTimeoutRef = useRef(null);
    const containerRef = useRef(null);

    // Navigation functions
    const goToNext = () => {
        setCurrentSlide(prev => (prev + 1) % images.length);
    };

    const goToPrev = () => {
        setCurrentSlide(prev => (prev - 1 + images.length) % images.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

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

    // Zoom modal functions - Professional and clean
    const openZoom = useCallback((imgSrc, index) => {
        setCurrentSlide(index);
        setIsZoomed(true);
        setZoomLevel(1);
        document.body.style.overflow = 'hidden';
    }, []);

    const closeZoom = useCallback(() => {
        setIsZoomed(false);
        setZoomLevel(1);
        document.body.style.overflow = 'auto';
    }, []);

    // Zoom controls - Simplified and professional
    const zoomIn = () => {
        setZoomLevel(prev => Math.min(prev + 0.5, 3));
    };

    const zoomOut = () => {
        setZoomLevel(prev => Math.max(prev - 0.5, 1));
    };

    const resetZoom = () => {
        setZoomLevel(1);
    };

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
    }, [isZoomed, closeZoom]);

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

            {/* Professional Zoom Modal */}
            {isZoomed && (
                <div className="zoom-modal" onClick={(e) => e.target === e.currentTarget && closeZoom()}>
                    <div className="zoom-modal-content">
                        {/* Header with controls */}
                        <div className="zoom-header">
                            <div className="zoom-counter">
                                {currentSlide + 1} / {images.length}
                            </div>

                            {/* Zoom level indicator */}
                            <div className="zoom-level-display">
                                {Math.round(zoomLevel * 100)}%
                            </div>

                            <button className="zoom-close" onClick={closeZoom} aria-label="Close zoom">
                                ✕
                            </button>
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

                        {/* Professional Image Container */}
                        <div className="zoom-image-container">
                            <img
                                src={images[currentSlide]?.img || images[currentSlide]}
                                alt={`Zoomed view ${currentSlide + 1}`}
                                className="zoom-image"
                                style={{
                                    transform: `scale(${zoomLevel})`,
                                    transformOrigin: 'center center'
                                }}
                            />
                        </div>

                        {/* Professional Control Bar */}
                        <div className="zoom-controls-bar">
                            <div className="zoom-controls">
                                <button
                                    className="zoom-control-btn"
                                    onClick={zoomOut}
                                    disabled={zoomLevel <= 1}
                                    aria-label="Zoom out"
                                    title="Zoom Out"
                                >
                                    −
                                </button>

                                <div className="zoom-level-slider">
                                    <input
                                        type="range"
                                        min="1"
                                        max="3"
                                        step="0.1"
                                        value={zoomLevel}
                                        onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                                        className="zoom-slider"
                                        aria-label="Zoom level"
                                    />
                                </div>

                                <button
                                    className="zoom-control-btn"
                                    onClick={zoomIn}
                                    disabled={zoomLevel >= 3}
                                    aria-label="Zoom in"
                                    title="Zoom In"
                                >
                                    +
                                </button>
                            </div>

                            <button
                                className="zoom-reset-btn"
                                onClick={resetZoom}
                                disabled={zoomLevel === 1}
                                aria-label="Reset zoom"
                                title="Reset to 100%"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ImageGallery;