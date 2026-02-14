import React, { useState, useCallback, useEffect, useRef } from "react";
import {
    Play,
    Pause,
    X,
    ZoomIn,
    ZoomOut,
    RotateCcw,
    Move,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    TrendingUp,
    Award,
    Percent,
    ChevronDown,
    ChevronUp
} from "lucide-react";


const ImageGallery = ({ images = [], videos = [], badges = {} }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [autoScroll, setAutoScroll] = useState(false);
    const [isZoomOpen, setIsZoomOpen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [showThumbnails, setShowThumbnails] = useState(true);
    const [thumbnailStart, setThumbnailStart] = useState(0);

    const imageRef = useRef(null);
    const containerRef = useRef(null);
    const thumbnailContainerRef = useRef(null);

    const media = [
        ...images.map(img => ({ type: "image", src: img?.img || img })),
        ...videos.map(video => ({ type: "video", src: video?.video || video }))
    ];

    const VISIBLE_THUMBNAILS = 5;

    const goNext = useCallback(
        () => setCurrentSlide(p => (p + 1) % media.length),
        [media.length]
    );

    const goPrev = useCallback(
        () => setCurrentSlide(p => (p - 1 + media.length) % media.length),
        [media.length]
    );

    // Handle drag start
    const handleDragStart = (e) => {
        if (zoomLevel <= 1) return;

        e.preventDefault();
        setIsDragging(true);
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

        setDragStart({
            x: clientX - position.x,
            y: clientY - position.y
        });
    };

    // Handle drag move
    const handleDragMove = useCallback((e) => {
        if (!isDragging || zoomLevel <= 1) return;

        e.preventDefault();
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

        const newX = clientX - dragStart.x;
        const newY = clientY - dragStart.y;

        // Calculate boundaries based on zoom level
        const container = containerRef.current;
        const image = imageRef.current;

        if (container && image) {
            const containerRect = container.getBoundingClientRect();
            const imageRect = image.getBoundingClientRect();

            // Calculate max drag distance based on zoom level
            const maxX = Math.max(0, (imageRect.width * zoomLevel - containerRect.width) / (2 * zoomLevel));
            const maxY = Math.max(0, (imageRect.height * zoomLevel - containerRect.height) / (2 * zoomLevel));

            // Apply boundaries
            const boundedX = Math.max(-maxX, Math.min(maxX, newX));
            const boundedY = Math.max(-maxY, Math.min(maxY, newY));

            setPosition({ x: boundedX, y: boundedY });
        }
    }, [isDragging, dragStart, zoomLevel]);

    // Handle drag end
    const handleDragEnd = () => {
        setIsDragging(false);
    };

    // Reset position on zoom change or slide change
    useEffect(() => {
        setPosition({ x: 0, y: 0 });
    }, [currentSlide, zoomLevel]);

    // Auto scroll
    useEffect(() => {
        if (!autoScroll) return;
        const i = setInterval(goNext, 4000);
        return () => clearInterval(i);
    }, [autoScroll, goNext]);

    // Lock scroll on zoom
    useEffect(() => {
        document.body.style.overflow = isZoomOpen ? "hidden" : "auto";
        return () => (document.body.style.overflow = "auto");
    }, [isZoomOpen]);

    // Event listeners for dragging
    useEffect(() => {
        if (!isZoomOpen || zoomLevel <= 1) return;

        const handleMouseMove = (e) => handleDragMove(e);
        const handleTouchMove = (e) => handleDragMove(e);
        const handleMouseUp = () => handleDragEnd();
        const handleTouchEnd = () => handleDragEnd();

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchend', handleTouchEnd);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isZoomOpen, zoomLevel, handleDragMove]);

    // Handle thumbnail navigation
    const scrollThumbnails = (direction) => {
        if (direction === 'next') {
            setThumbnailStart(prev => Math.min(prev + 1, media.length - VISIBLE_THUMBNAILS));
        } else {
            setThumbnailStart(prev => Math.max(prev - 1, 0));
        }
    };

    // Reset thumbnail start when media changes
    useEffect(() => {
        setThumbnailStart(0);
    }, [media.length]);

    if (!media.length) return null;

    const current = media[currentSlide];

    // Badge renderer
    const renderBadges = () => {
        const badgeList = [];

        if (badges.NewArrival) {
            badgeList.push({
                icon: <Sparkles className="w-3 h-3" />,
                label: "New Arrival",
                color: "from-purple-500 to-pink-500"
            });
        }

        if (badges.Top_Trending) {
            badgeList.push({
                icon: <TrendingUp className="w-3 h-3" />,
                label: "Top Trending",
                color: "from-blue-500 to-cyan-500"
            });
        }

        if (badges.BestDesign) {
            badgeList.push({
                icon: <Award className="w-3 h-3" />,
                label: "Best Design",
                color: "from-amber-500 to-orange-500"
            });
        }

        if (badges.discountPercentage && badges.discountPercentage > 0) {
            badgeList.push({
                icon: <Percent className="w-3 h-3" />,
                label: `${badges.discountPercentage}% OFF`,
                color: "from-red-500 to-rose-500"
            });
        }

        return badgeList;
    };

    const badgesToShow = renderBadges();

    return (
        <>
            {/* MAIN VIEW */}
            <div className="w-full max-w-md mx-auto relative group">
                {/* Badges */}
                {badgesToShow.length > 0 && (
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 animate__animated animate__fadeInLeft">
                        {badgesToShow.map((badge, index) => (
                            <div
                                key={index}
                                className={`bg-gradient-to-r ${badge.color} text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg transform hover:scale-105 transition-transform duration-300 animate__animated animate__fadeIn`}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {badge.icon}
                                {badge.label}
                            </div>
                        ))}
                    </div>
                )}

                <div
                    className="relative bg-gradient-to-br from-gray-50 to-gray-100 aspect-square rounded-2xl overflow-hidden shadow-xl cursor-zoom-in border border-gray-200/50"
                    onClick={() => setIsZoomOpen(true)}
                >
                    {current.type === "image" ? (
                        <img
                            src={current.src}
                            className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
                            alt="Product"
                        />
                    ) : (
                        <video
                            className="w-full h-full object-contain"
                            controls
                            poster={images[0]?.img || images[0]}
                        >
                            <source src={current.src} type="video/mp4" />
                        </video>
                    )}

                    {/* Arrows */}
                    {media.length > 1 && (
                        <>
                            <button
                                onClick={e => {
                                    e.stopPropagation();
                                    goPrev();
                                }}
                                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100 animate__animated animate__fadeIn"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={e => {
                                    e.stopPropagation();
                                    goNext();
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100 animate__animated animate__fadeIn"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </>
                    )}

                    {/* Auto scroll */}
                    <button
                        onClick={e => {
                            e.stopPropagation();
                            setAutoScroll(p => !p);
                        }}
                        className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white p-2.5 rounded-full hover:bg-black/80 hover:scale-110 transition-all duration-300 shadow-lg"
                    >
                        {autoScroll ? <Pause size={16} /> : <Play size={16} />}
                    </button>

                    {/* Slide indicator */}
                    {media.length > 1 && (
                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium">
                            {currentSlide + 1} / {media.length}
                        </div>
                    )}
                </div>

                {/* Thumbnails */}
                {media.length > 1 && (
                    <div className="relative mt-4 ">
                        {/* Thumbnail navigation arrows */}
                        {media.length > VISIBLE_THUMBNAILS && (
                            <>
                                <button
                                    onClick={() => scrollThumbnails('prev')}
                                    disabled={thumbnailStart === 0}
                                    className={`absolute left-0 top-1/2 -translate-y-1/2 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 transition-all duration-300 z-10 ${thumbnailStart === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'
                                        }`}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => scrollThumbnails('next')}
                                    disabled={thumbnailStart >= media.length - VISIBLE_THUMBNAILS}
                                    className={`absolute right-0 top-1/2 -translate-y-1/2 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 transition-all duration-300 z-10 ${thumbnailStart >= media.length - VISIBLE_THUMBNAILS ? 'opacity-0 pointer-events-none' : 'opacity-100'
                                        }`}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </>
                        )}

                        <div
                            ref={thumbnailContainerRef}
                            className="flex gap-2  p-2 overflow-hidden scrollbar-hide"
                        >
                            {media.slice(thumbnailStart, thumbnailStart + VISIBLE_THUMBNAILS).map((m, idx) => {
                                const actualIndex = thumbnailStart + idx;
                                return (
                                    <button
                                        key={actualIndex}
                                        onClick={() => {
                                            setCurrentSlide(actualIndex);
                                            setAutoScroll(false);
                                        }}
                                        className={`relative flex-shrink-0 w-16 h-16 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${actualIndex === currentSlide
                                            ? "border-[#f16137] shadow-md scale-105"
                                            : "border-transparent hover:border-gray-300"
                                            } animate__animated animate__fadeIn`}
                                        style={{ animationDelay: `${idx * 0.05}s` }}
                                    >
                                        {m.type === "image" ? (
                                            <img
                                                src={m.src}
                                                className="w-full h-full object-cover rounded-lg"
                                                alt={`Thumbnail ${actualIndex + 1}`}
                                            />
                                        ) : (
                                            <div className="bg-gradient-to-br from-gray-700 to-gray-900 w-full h-full flex items-center justify-center rounded-lg">
                                                <Play size={12} className="text-white" />
                                            </div>
                                        )}
                                        {actualIndex === currentSlide && (
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#f16137] rounded-full animate-pulse" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* 🔥 PREMIUM FULLSCREEN ZOOM MODAL WITH DRAG */}
            {isZoomOpen && (
                <div
                    className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl"
                    ref={containerRef}
                >
                    {/* Close */}
                    <button
                        onClick={() => {
                            setIsZoomOpen(false);
                            setZoomLevel(1);
                            setPosition({ x: 0, y: 0 });
                        }}
                        className="absolute z-[9999] top-4 right-4 text-white hover:bg-white/20 p-3 rounded-full transition-all duration-300 hover:scale-110 animate__animated animate__fadeIn"
                    >
                        <X size={28} />
                    </button>

                    {/* Zoom controls */}
                    {current.type === "image" && (
                        <div className="absolute top-4 z-[9999] left-4 flex gap-2 animate__animated animate__fadeInLeft">
                            <button
                                onClick={() => setZoomLevel(z => Math.min(z + 0.5, 4))}
                                className="bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 hover:scale-110 transition-all duration-300"
                                title="Zoom In"
                            >
                                <ZoomIn size={20} />
                            </button>
                            <button
                                onClick={() => setZoomLevel(z => Math.max(z - 0.5, 1))}
                                className="bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 hover:scale-110 transition-all duration-300"
                                title="Zoom Out"
                            >
                                <ZoomOut size={20} />
                            </button>
                            <button
                                onClick={() => {
                                    setZoomLevel(1);
                                    setPosition({ x: 0, y: 0 });
                                }}
                                className="bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 hover:scale-110 transition-all duration-300"
                                title="Reset"
                            >
                                <RotateCcw size={20} />
                            </button>
                            {zoomLevel > 1 && (
                                <div className="flex items-center gap-2 ml-4 text-white/80 text-sm bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <Move size={18} />
                                    <span>Drag to pan</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Media Container */}
                    <div className="w-full h-full flex items-center justify-center overflow-hidden select-none">
                        {current.type === "image" ? (
                            <div className="relative">
                                <img
                                    ref={imageRef}
                                    src={current.src}
                                    className={`max-w-[95vw] max-h-[95vh] object-contain transition-transform duration-300 ${zoomLevel > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
                                        }`}
                                    style={{
                                        transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
                                        transition: isDragging ? 'none' : 'transform 0.2s ease-out'
                                    }}
                                    onMouseDown={handleDragStart}
                                    onTouchStart={handleDragStart}
                                    alt="Zoomed view"
                                    draggable="false"
                                />

                                {/* Zoom level indicator */}
                                {zoomLevel > 1 && (
                                    <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold animate__animated animate__fadeIn">
                                        {zoomLevel.toFixed(1)}x
                                    </div>
                                )}
                            </div>
                        ) : (
                            <video
                                src={current.src}
                                controls
                                autoPlay
                                className="max-w-[95vw] max-h-[95vh] rounded-xl shadow-2xl"
                            />
                        )}
                    </div>

                    {/* Arrows */}
                    {media.length > 1 && (
                        <>
                            <button
                                onClick={goPrev}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:bg-white/20 p-4 rounded-full transition-all duration-300 hover:scale-110 animate__animated animate__fadeInLeft"
                            >
                                <ChevronLeft size={32} />
                            </button>
                            <button
                                onClick={goNext}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:bg-white/20 p-4 rounded-full transition-all duration-300 hover:scale-110 animate__animated animate__fadeInRight"
                            >
                                <ChevronRight size={32} />
                            </button>
                        </>
                    )}

                    {/* Thumbnails inside zoom */}
                    {media.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 ">
                            {media.map((m, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setCurrentSlide(i);
                                        setZoomLevel(1);
                                        setPosition({ x: 0, y: 0 });
                                    }}
                                    className={`relative w-16 h-16 border-3 transition-all duration-300 transform hover:scale-110 ${i === currentSlide
                                        ? "border-[#f16137] scale-110 shadow-xl"
                                        : "border-transparent opacity-70 hover:opacity-100"
                                        } rounded-lg overflow-hidden`}
                                >
                                    {m.type === "image" ? (
                                        <img
                                            src={m.src}
                                            className="w-full h-full object-cover"
                                            alt={`Thumbnail ${i + 1}`}
                                        />
                                    ) : (
                                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 w-full h-full flex items-center justify-center">
                                            <Play size={16} className="text-white" />
                                        </div>
                                    )}
                                    {i === currentSlide && (
                                        <div className="absolute inset-0 border-2 border-[#f16137] rounded-lg" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                  
                </div>
            )}
        </>
    );
};

export default ImageGallery;