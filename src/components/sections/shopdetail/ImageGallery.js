import React, { useState, useRef, useEffect, useCallback } from 'react';
import './ImageGallery.css';

const ImageGallery = ({ images }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
    const [showZoomPreview, setShowZoomPreview] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [showArrows, setShowArrows] = useState(false);
    const zoomRef = useRef(null);
    const imageRef = useRef(null);
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

    // Hover zoom functionality - Fixed
    const handleMouseMove = useCallback((e) => {
        if (!mainImageRef.current || !containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const imageRect = mainImageRef.current.getBoundingClientRect();

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
            const previewSize = 200; // Reduced size for better UX
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
        }, 200); // Reduced delay for better UX
    };

    const handleMouseLeave = () => {
        if (zoomTimeoutRef.current) {
            clearTimeout(zoomTimeoutRef.current);
        }
        setShowZoomPreview(false);
        setShowArrows(false);
    };

    // Zoom modal functions - Fixed to open smaller
    const openZoom = useCallback((imgSrc, index) => {
        setCurrentSlide(index);
        setIsZoomed(true);
        setZoomLevel(1);
        setZoomPosition({ x: 50, y: 50 });
        setImagePosition({ x: 0, y: 0 });
        document.body.style.overflow = 'hidden';
    }, []);

    const closeZoom = useCallback(() => {
        setIsZoomed(false);
        setZoomLevel(1);
        setZoomPosition({ x: 50, y: 50 });
        setImagePosition({ x: 0, y: 0 });
        setIsDragging(false);
        document.body.style.overflow = 'auto';
    }, []);

    // Zoom controls
    const zoomIn = () => {
        setZoomLevel(prev => Math.min(prev + 0.3, 3)); // Reduced max zoom
    };

    const zoomOut = () => {
        if (zoomLevel <= 1.3) {
            setZoomLevel(1);
            setImagePosition({ x: 0, y: 0 });
        } else {
            setZoomLevel(prev => Math.max(prev - 0.3, 1));
        }
    };

    const resetZoom = () => {
        setZoomLevel(1);
        setImagePosition({ x: 0, y: 0 });
        setZoomPosition({ x: 50, y: 50 });
    };

    // Mouse wheel zoom
    const handleWheelZoom = useCallback((e) => {
        e.preventDefault();
        const rect = imageRef.current?.getBoundingClientRect();
        if (!rect) return;

        const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
        const mouseY = ((e.clientY - rect.top) / rect.height) * 100;

        const delta = e.deltaY * -0.001; // Slower zoom
        const newZoomLevel = Math.min(Math.max(1, zoomLevel + delta), 3);

        if (newZoomLevel > 1) {
            setZoomPosition({ x: mouseX, y: mouseY });
        } else {
            setZoomPosition({ x: 50, y: 50 });
            setImagePosition({ x: 0, y: 0 });
        }

        setZoomLevel(newZoomLevel);
    }, [zoomLevel]);

    // Mouse drag functionality
    const handleMouseDown = (e) => {
        if (zoomLevel > 1) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y });
        }
    };

    const handleMouseMoveZoom = useCallback((e) => {
        if (isDragging && zoomLevel > 1) {
            const newX = e.clientX - dragStart.x;
            const newY = e.clientY - dragStart.y;

            // Constrain movement based on zoom level
            const maxMovement = (zoomLevel - 1) * 150;
            const constrainedX = Math.max(-maxMovement, Math.min(maxMovement, newX));
            const constrainedY = Math.max(-maxMovement, Math.min(maxMovement, newY));

            setImagePosition({ x: constrainedX, y: constrainedY });
        }
    }, [isDragging, dragStart, zoomLevel]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

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

    // Mouse events for zoom modal
    useEffect(() => {
        if (isZoomed) {
            document.addEventListener('mousemove', handleMouseMoveZoom);
            document.addEventListener('mouseup', handleMouseUp);

            return () => {
                document.removeEventListener('mousemove', handleMouseMoveZoom);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isZoomed, handleMouseMoveZoom, handleMouseUp]);

    // Zoom modal wheel event
    useEffect(() => {
        if (isZoomed && zoomRef.current) {
            const zoomElement = zoomRef.current;
            zoomElement.addEventListener('wheel', handleWheelZoom, { passive: false });

            return () => {
                zoomElement.removeEventListener('wheel', handleWheelZoom);
            };
        }
    }, [isZoomed, handleWheelZoom]);

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

                        {/* Hover Zoom Preview */}
                        {showZoomPreview && (
                            <div
                                className="zoom-preview"
                                style={{
                                    left: mousePosition.x,
                                    top: mousePosition.y,
                                }}
                            >
                                <div className="zoom-preview-inner">
                                    <img
                                        src={images[currentSlide]?.img || images[currentSlide]}
                                        alt={`Zoom preview ${currentSlide + 1}`}
                                        style={{
                                            transform: `scale(2) translate(-${zoomPosition.x}%, -${zoomPosition.y}%)`,
                                            transformOrigin: 'top left',
                                        }}
                                    />
                                </div>
                            </div>
                        )}

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

            {/* Zoom Modal - Made smaller */}
            {isZoomed && (
                <div className="zoom-modal" onClick={(e) => e.target === e.currentTarget && closeZoom()}>
                    <div className="zoom-modal-content" ref={zoomRef}>
                        {/* Close Button */}
                        <button className="zoom-close" onClick={closeZoom} aria-label="Close zoom">
                            ✕
                        </button>

                        {/* Image Counter */}
                        <div className="zoom-counter">
                            {currentSlide + 1} / {images.length}
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

                        {/* Zoomed Image Container - Made smaller */}
                        <div className="zoom-image-container">
                            <img
                                ref={imageRef}
                                src={images[currentSlide]?.img || images[currentSlide]}
                                alt={`Zoomed view ${currentSlide + 1}`}
                                className={`zoom-image ${isDragging ? 'dragging' : ''}`}
                                style={{
                                    transform: `scale(${zoomLevel}) translate(${imagePosition.x / zoomLevel}px, ${imagePosition.y / zoomLevel}px)`,
                                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                    cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
                                }}
                                onMouseDown={handleMouseDown}
                                draggable={false}
                            />
                        </div>

                        {/* Zoom Controls */}
                        <div className="zoom-controls">
                            <button
                                className="zoom-control-btn"
                                onClick={zoomOut}
                                disabled={zoomLevel <= 1}
                                aria-label="Zoom out"
                            >
                                −
                            </button>
                            <span className="zoom-level">{Math.round(zoomLevel * 100)}%</span>
                            <button
                                className="zoom-control-btn"
                                onClick={zoomIn}
                                disabled={zoomLevel >= 3}
                                aria-label="Zoom in"
                            >
                                +
                            </button>
                            <button
                                className="zoom-reset-btn"
                                onClick={resetZoom}
                                disabled={zoomLevel === 1}
                                aria-label="Reset zoom"
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