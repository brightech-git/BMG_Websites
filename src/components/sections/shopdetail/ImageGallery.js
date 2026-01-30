import React, { useState, useCallback, useEffect, useRef } from "react";
import {
    Play,
    Pause,
    X,
    ZoomIn,
    ZoomOut,
    RotateCcw,
    Move
} from "lucide-react";

const ImageGallery = ({ images = [], videos = [] }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [autoScroll, setAutoScroll] = useState(false);
    const [isZoomOpen, setIsZoomOpen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const imageRef = useRef(null);
    const containerRef = useRef(null);

    const media = [
        ...images.map(img => ({ type: "image", src: img?.img || img })),
        ...videos.map(video => ({ type: "video", src: video?.video || video }))
    ];

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
            const maxX = Math.max(0, (imageRect.width - containerRect.width) / 2);
            const maxY = Math.max(0, (imageRect.height - containerRect.height) / 2);

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
    }, [currentSlide, isZoomOpen]);

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

    if (!media.length) return null;
    const current = media[currentSlide];

    return (
        <>
            {/* MAIN VIEW */}
            <div className="w-full max-w-md mx-auto">
                <div
                    className="relative bg-gray-50 aspect-square rounded-xl overflow-hidden shadow-lg cursor-zoom-in"
                    onClick={() => setIsZoomOpen(true)}
                >
                    {current.type === "image" ? (
                        <img
                            src={current.src}
                            className="w-full h-full object-contain"
                            alt=""
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
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 px-3 py-1 rounded-full hover:bg-white transition-all"
                            >
                                ‹
                            </button>
                            <button
                                onClick={e => {
                                    e.stopPropagation();
                                    goNext();
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 px-3 py-1 rounded-full hover:bg-white transition-all"
                            >
                                ›
                            </button>
                        </>
                    )}

                    {/* Auto scroll */}
                    <button
                        onClick={e => {
                            e.stopPropagation();
                            setAutoScroll(p => !p);
                        }}
                        className="absolute bottom-2 right-2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-all"
                    >
                        {autoScroll ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                </div>

                {/* Thumbnails */}
                <div className="flex gap-2 mt-3 overflow-x-auto">
                    {media.map((m, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentSlide(i)}
                            className={`w-16 h-16 rounded-lg border-2 transition-all ${i === currentSlide ? "border-blue-500" : "border-transparent hover:border-gray-300"
                                }`}
                        >
                            {m.type === "image" ? (
                                <img src={m.src} className="w-full h-full object-cover" />
                            ) : (
                                <div className="bg-gray-800 w-full h-full flex items-center justify-center rounded-lg">
                                    <Play size={12} className="text-white" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* 🔥 PREMIUM FULLSCREEN ZOOM MODAL WITH DRAG */}
            {isZoomOpen && (
                <div
                    className="fixed inset-0 z-[9999] bg-black"
                    ref={containerRef}
                >
                    {/* Close */}
                    <button
                        onClick={() => {
                            setIsZoomOpen(false);
                            setZoomLevel(1);
                            setPosition({ x: 0, y: 0 });
                        }}
                        className="absolute z-[9999] top-4 right-4 text-white hover:bg-white/10 p-2 rounded-full transition-all"
                    >
                        <X size={28} />
                    </button>

                    {/* Zoom controls */}
                    {current.type === "image" && (
                        <div className="absolute top-4 z-[9999] left-4 flex gap-2">
                            <button
                                onClick={() => setZoomLevel(z => Math.min(z + 0.5, 4))}
                                className="bg-white/10 text-white p-2 rounded hover:bg-white/20 transition-all"
                            >
                                <ZoomIn />
                            </button>
                            <button
                                onClick={() => setZoomLevel(z => Math.max(z - 0.5, 1))}
                                className="bg-white/10 text-white p-2 rounded hover:bg-white/20 transition-all"
                            >
                                <ZoomOut />
                            </button>
                            <button
                                onClick={() => {
                                    setZoomLevel(1);
                                    setPosition({ x: 0, y: 0 });
                                }}
                                className="bg-white/10 text-white p-2 rounded hover:bg-white/20 transition-all"
                            >
                                <RotateCcw />
                            </button>
                            {zoomLevel > 1 && (
                                <div className="flex items-center gap-2 ml-2 text-white/80 text-sm">
                                    <Move size={16} />
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
                                    className={`max-w-[90vw] max-h-[90vh] object-contain transition-transform duration-300 ${zoomLevel > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
                                    style={{
                                        transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
                                        transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                                    }}
                                    onMouseDown={handleDragStart}
                                    onTouchStart={handleDragStart}
                                    alt="Zoomed view"
                                    draggable="false"
                                />

                                {/* Zoom level indicator */}
                                {zoomLevel > 1 && (
                                    <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                                        {zoomLevel.toFixed(1)}x
                                    </div>
                                )}
                            </div>
                        ) : (
                            <video
                                src={current.src}
                                controls
                                autoPlay
                                className="max-w-[90vw] max-h-[90vh]"
                            />
                        )}
                    </div>

                    {/* Arrows */}
                    {media.length > 1 && (
                        <>
                            <button
                                onClick={goPrev}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:bg-white/10 p-4 rounded-full transition-all"
                            >
                                ‹
                            </button>
                            <button
                                onClick={goNext}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:bg-white/10 p-4 rounded-full transition-all"
                            >
                                ›
                            </button>
                        </>
                    )}

                    {/* Thumbnails inside zoom */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                        {media.map((m, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setCurrentSlide(i);
                                    setZoomLevel(1);
                                    setPosition({ x: 0, y: 0 });
                                }}
                                className={`w-14 h-14 border-2 transition-all ${i === currentSlide ? "border-white" : "border-transparent hover:border-white/50"
                                    }`}
                            >
                                {m.type === "image" ? (
                                    <img src={m.src} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="bg-gray-700 w-full h-full flex items-center justify-center">
                                        <Play size={10} className="text-white" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default ImageGallery;