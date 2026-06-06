import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getImage } from '../../utils/getProductImages';

const HeroBanner = ({
    title,
    description,
    images,
    defaultRatio = '16/9',
    mobileRatio = '5/4',
    gap = true,
    mobileGap = null,
    centered = false,
    full = false,
    backgroundColor = 'white',
    mobileRows = null,
    desktopColumns = 'auto',
    onImageClick,

    autoScroll = false,
    scrollable = false,
    visibleCount = { desktop: 3, tablet: 2, mobile: 2 },
    scrollInterval = 3000,
    infinite = false,
    dots = false,

    // NEW: when true → shows prev/next arrows beside the title (desktop only)
    // on mobile the items scroll natively via overflow-x
    showArrows = false,
}) => {
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragDistance, setDragDistance] = useState(0);

    const navigate = useNavigate();
    const dragStartRef = useRef(0);
    const dragCurrentRef = useRef(0);
    const autoplayRef = useRef(null);
    const carouselRef = useRef(null);
    // Ref for the mobile horizontal scroll container
    const mobileScrollRef = useRef(null);

    const parsedMobileRows = useMemo(() => {
        if (!mobileRows) return null;
        if (Array.isArray(mobileRows)) return mobileRows;
        try { return JSON.parse(mobileRows); } catch { return null; }
    }, [mobileRows]);

    useEffect(() => {
        const checkScreenSize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);
            setIsTablet(width >= 768 && width < 1024);
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const getCurrentVisibleCount = () => {
        if (isMobile) return visibleCount.mobile || 1;
        if (isTablet) return visibleCount.tablet || visibleCount.desktop || 2;
        return visibleCount.desktop || 3;
    };

    const currentVisibleCount = getCurrentVisibleCount();
    const totalSlides = images.length;
    const maxIndex = infinite
        ? totalSlides - 1
        : Math.max(0, totalSlides - currentVisibleCount);

    /* ── Autoplay ────────────────────────────────────────────────────────── */
    useEffect(() => {
        if (!autoScroll || !scrollable || isHovered || isDragging || totalSlides <= currentVisibleCount) return;
        autoplayRef.current = setTimeout(() => {
            setCurrentIndex((prev) => {
                if (infinite) return (prev + 1) % totalSlides;
                const next = prev + 1;
                return next > maxIndex ? 0 : next;
            });
        }, scrollInterval);
        return () => clearTimeout(autoplayRef.current);
    }, [currentIndex, isHovered, isDragging, autoScroll, scrollable, maxIndex, totalSlides, currentVisibleCount, scrollInterval, infinite]);

    /* ── Navigation ──────────────────────────────────────────────────────── */
    const nextSlide = () => {
        setCurrentIndex((prev) => {
            if (infinite) return (prev + 1) % totalSlides;
            const next = prev + 1;
            return next > maxIndex ? 0 : next;
        });
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => {
            if (infinite) return (prev - 1 + totalSlides) % totalSlides;
            const prevIndex = prev - 1;
            return prevIndex < 0 ? maxIndex : prevIndex;
        });
    };

    const goToSlide = (index) => {
        if (infinite) setCurrentIndex(index % totalSlides);
        else setCurrentIndex(Math.min(index, maxIndex));
    };

    /* ── Drag ────────────────────────────────────────────────────────────── */
    const handleMouseDown = (e) => {
        if (!scrollable) return;
        setIsDragging(true); setDragDistance(0);
        dragStartRef.current = e.clientX; dragCurrentRef.current = e.clientX;
    };
    const handleMouseMove = (e) => {
        if (!isDragging || !scrollable) return;
        dragCurrentRef.current = e.clientX;
        setDragDistance(dragCurrentRef.current - dragStartRef.current);
    };
    const handleMouseUp = () => {
        if (!isDragging || !scrollable) return;
        setIsDragging(false);
        const distance = dragStartRef.current - dragCurrentRef.current;
        setDragDistance(0);
        if (Math.abs(distance) > 50) distance > 0 ? nextSlide() : prevSlide();
    };
    const handleMouseLeave = () => {
        if (isDragging) { setIsDragging(false); setDragDistance(0); }
        setIsHovered(false);
    };
    const handleTouchStart = (e) => {
        if (!scrollable) return;
        setIsDragging(true); setDragDistance(0);
        dragStartRef.current = e.touches[0].clientX; dragCurrentRef.current = e.touches[0].clientX;
    };
    const handleTouchMove = (e) => {
        if (!isDragging || !scrollable) return;
        dragCurrentRef.current = e.touches[0].clientX;
        setDragDistance(dragCurrentRef.current - dragStartRef.current);
    };
    const handleTouchEnd = () => {
        if (!isDragging || !scrollable) return;
        setIsDragging(false);
        const distance = dragStartRef.current - dragCurrentRef.current;
        setDragDistance(0);
        if (Math.abs(distance) > 30) distance > 0 ? nextSlide() : prevSlide();
    };

    /* ── Click ───────────────────────────────────────────────────────────── */
    const handleImageClick = (imageData, index) => {
        if (isDragging && Math.abs(dragDistance) > 10) return;
        if (onImageClick) { onImageClick(imageData, index); return; }
        if (!imageData?.link && !imageData?.filterId) return;
        if (imageData.filterId && imageData.link)
            navigate(`/products-page?${imageData.link}&filterIds=${imageData.filterId}`);
        else if (imageData.filterId)
            navigate(`/products-page?filterIds=${imageData.filterId}`);
        else
            navigate(`/products-page?${imageData.link}`);
    };

    /* ── Image helpers ───────────────────────────────────────────────────── */
    const getImageData = (image, index) => {
        if (typeof image === 'string') {
            return { url: image, ratio: isMobile ? mobileRatio : defaultRatio, alt: `Image ${index + 1}`, link: null };
        }
        if (image && typeof image === 'object') {
            if (image.desktop) {
                if (isMobile) return {
                    url: image.mobile?.url || image.desktop.url,
                    ratio: image.mobile?.ratio || mobileRatio,
                    alt: image.alt || `Image ${index + 1}`,
                    link: image.mobile?.link || image.desktop?.link || null,
                };
                return {
                    url: image.desktop.url,
                    ratio: image.desktop.ratio || defaultRatio,
                    alt: image.alt || `Image ${index + 1}`,
                    link: image.desktop?.link || null,
                };
            }
            return {
                url: image.url || '',
                ratio: image.ratio || (isMobile ? mobileRatio : defaultRatio),
                alt: image.alt || `Image ${index + 1}`,
                link: image.link || null,
            };
        }
        return { url: '', ratio: isMobile ? mobileRatio : defaultRatio, alt: 'Missing image', link: null };
    };

    const parseRatio = (ratio) => {
        const [width, height] = ratio.split('/').map(Number);
        return (height / width) * 100;
    };

    /* ── Grid layout (unchanged for non-showArrows path) ────────────────── */
    const getGridLayout = () => {
        if (scrollable) return `repeat(${currentVisibleCount}, 1fr)`;
        if (isMobile && parsedMobileRows) {
            let result = '';
            parsedMobileRows.forEach((rowCols, i) => {
                if (i > 0) result += ' ';
                result += `repeat(${rowCols}, 1fr)`;
            });
            return result;
        }
        if (desktopColumns === 'auto') {
            const allHaveRatios = images.every(img => {
                const d = typeof img === 'string' ? null : img;
                return d && (d.ratio || d.desktop?.ratio);
            });
            if (allHaveRatios) {
                return images.map((img) => {
                    const d = getImageData(img, 0);
                    if (d.ratio) { const [w] = d.ratio.split('/').map(Number); return `${w}fr`; }
                    return '1fr';
                }).join(' ');
            }
            return `repeat(${images.length <= 3 ? images.length : 3}, 1fr)`;
        }
        return `repeat(${desktopColumns}, 1fr)`;
    };

    const getVisibleImages = () => {
        if (!scrollable) return images;
        if (infinite) {
            return Array.from({ length: currentVisibleCount }, (_, i) => images[(currentIndex + i) % totalSlides]);
        }
        return images.slice(currentIndex, currentIndex + currentVisibleCount);
    };

    const getRows = () => {
        if (scrollable) return [getVisibleImages()];
        if (!isMobile || !parsedMobileRows) return [images];
        const rows = [];
        let idx = 0;
        parsedMobileRows.forEach(rowCols => {
            const slice = images.slice(idx, idx + rowCols);
            if (slice.length > 0) { rows.push(slice); idx += slice.length; }
        });
        if (idx < images.length && rows.length > 0)
            rows[rows.length - 1] = [...rows[rows.length - 1], ...images.slice(idx)];
        return rows;
    };

    const rows = getRows();
    const visibleImages = scrollable ? getVisibleImages() : images;
    const gridTemplateStyle = getGridLayout();

    const getGapClass = () => {
        if (isMobile && mobileGap !== null) return 'gap-0';
        return gap ? 'gap-4 md:gap-6' : 'gap-0';
    };
    const getRowGapClass = () => {
        if (isMobile && mobileGap !== null) return mobileGap ? 'space-y-4' : 'space-y-0';
        return gap ? 'space-y-4 md:space-y-6' : 'space-y-0';
    };

    const gapClass = getGapClass();
    const rowGapClass = getRowGapClass();
    const translateX = isDragging ? dragDistance : 0;
    const totalPages = infinite ? totalSlides : maxIndex + 1;

    /* ── Arrow button style ──────────────────────────────────────────────── */
    const ArrowBtn = ({ onClick, disabled, children, label }) => (
        <button
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            className={`
                w-8 h-8 rounded-full flex items-center justify-center text-base
                border border-gray-300 transition-colors duration-150
                ${disabled
                    ? 'bg-gray-100 text-gray-800 cursor-not-allowed border-gray-200'
                    : 'bg-[var(--primary-hover-color)] text-white hover:opacity-90 border-transparent'}
            `}
        >
            {children}
        </button>
    );

    /* ════════════════════════════════════════════════════════════════════════
       showArrows mode
       - Desktop: renders all images in a scrollable carousel with prev/next
                  arrows placed in the title row (top-right)
       - Mobile:  renders all images in a native horizontal scroll strip,
                  no arrows shown
    ════════════════════════════════════════════════════════════════════════ */
    if (showArrows) {
        const atStart = currentIndex === 0;
        const atEnd = currentIndex >= maxIndex;

        /* Each item width as a percentage of the container */
        const itemWidthPct = 100 / currentVisibleCount;

        return (
            <section
                className={`
                    relative w-full py-2 overflow-hidden
                    ${backgroundColor === 'white' ? 'bg-white' : `bg-${backgroundColor}`}
                    ${centered ? 'flex flex-col items-center' : ''}
                    ${full ? 'px-0' : 'px-1 md:px-2 lg:px-2'}
                `}
                style={backgroundColor !== 'white' && !backgroundColor.startsWith('bg-') ? { backgroundColor } : {}}
                role="banner"
                aria-label="Hero banner"
            >
                <div className={`${full ? 'w-full' : 'container mx-auto w-full'}`}>

                    {/* ── Title row with arrows ── */}
                    {(title || description) && (
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                {title && (
                                    <h2 className="text-base sm:text-xl font-bold text-[var(--primary-text-color)] leading-tight">
                                        {title}
                                    </h2>
                                )}
                                {description && (
                                    <p className="text-sm text-[var(--primary-text-color)] mt-0.5">{description}</p>
                                )}
                            </div>

                            {/* Arrows — desktop only */}
                            <div className="hidden md:flex items-center gap-2">
                                <ArrowBtn
                                    onClick={prevSlide}
                                    disabled={!infinite && atStart}
                                    label="Previous"
                                >
                                    ‹
                                </ArrowBtn>
                                <ArrowBtn
                                    onClick={nextSlide}
                                    disabled={!infinite && atEnd}
                                    label="Next"
                                    
                                >
                                    ›
                                </ArrowBtn>
                            </div>
                        </div>
                    )}

                    {images.length > 0 && (
                        <>
                            {/* ── Desktop: clipped carousel ── */}
                            <div className="hidden md:block overflow-hidden w-full">
                                <div
                                    className="flex transition-transform duration-300 ease-out"
                                    style={{
                                        transform: `translateX(-${currentIndex * itemWidthPct}%)`,
                                        // width: `${(totalSlides / currentVisibleCount) * 100}%`,
                                    }}
                                >
                                    {images.map((image, imgIndex) => {
                                        const imageData = getImageData(image, imgIndex);
                                        const itemStyle = {
                                            width: `${( 100 / currentVisibleCount)}%`,
                                            paddingRight: gap ? '1rem' : '0',
                                            flexShrink: 0,
                                        };
                                        return (
                                            <div key={imgIndex} style={itemStyle}>
                                                <div
                                                    className={`
                                                        relative overflow-hidden rounded-lg
                                                        ${imageData.link ? 'cursor-pointer' : ''}
                                                    `}
                                                    style={{ paddingBottom: `${parseRatio(imageData.ratio)}%` }}
                                                    onClick={() => handleImageClick(image, imgIndex)}
                                                    role={imageData.link ? 'button' : 'presentation'}
                                                    tabIndex={imageData.link ? 0 : -1}
                                                    onKeyPress={(e) => { if (imageData.link && e.key === 'Enter') handleImageClick(image, imgIndex); }}
                                                >
                                                    <div className="absolute inset-0">
                                                        <img
                                                            src={getImage(imageData.url)}
                                                            alt={imageData.alt}
                                                            className="w-full h-full object-cover"
                                                            loading="lazy"
                                                            decoding="async"
                                                            draggable={false}
                                                        />
                                                    </div>
                                                </div>
                                                {/* label below image (alt text used as caption if it's a real label) */}
                                                {imageData.alt && imageData.alt !== `Image ${imgIndex + 1}` && (
                                                    <p className="text-center text-xs mt-1.5 font-medium text-[var(--primary-text-color)] uppercase tracking-wide">
                                                        {imageData.alt}
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* ── Mobile: native horizontal scroll ── */}
                            <div
                                ref={mobileScrollRef}
                                className="md:hidden flex overflow-x-auto gap-3 pb-1 scroll-smooth"
                                style={{
                                    scrollbarWidth: 'none',
                                    WebkitOverflowScrolling: 'touch',
                                    msOverflowStyle: 'none',
                                }}
                            >
                                {images.map((image, imgIndex) => {
                                    const imageData = getImageData(image, imgIndex);
                                    // Each item takes roughly visibleCount.mobile items across the viewport
                                    const mobileVisible = visibleCount.mobile || 2;
                                    const itemW = `calc(${100 / mobileVisible}% - 0.5rem)`;
                                    return (
                                        <div
                                            key={imgIndex}
                                            style={{ minWidth: itemW, flexShrink: 0 }}
                                        >
                                            <div
                                                className={`
                                                    relative overflow-hidden rounded-lg
                                                    ${imageData.link ? 'cursor-pointer' : ''}
                                                `}
                                                style={{ paddingBottom: `${parseRatio(imageData.ratio)}%` }}
                                                onClick={() => handleImageClick(image, imgIndex)}
                                                role={imageData.link ? 'button' : 'presentation'}
                                                tabIndex={imageData.link ? 0 : -1}
                                            >
                                                <div className="absolute inset-0">
                                                    <img
                                                        src={getImage(imageData.url)}
                                                        alt={imageData.alt}
                                                        className="w-full h-full object-cover"
                                                        loading="lazy"
                                                        decoding="async"
                                                        draggable={false}
                                                    />
                                                </div>
                                            </div>
                                            {imageData.alt && imageData.alt !== `Image ${imgIndex + 1}` && (
                                                <p className="text-center text-xs mt-1.5 font-medium text-[var(--primary-text-color)] uppercase tracking-wide">
                                                    {imageData.alt}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    
                </div>
            </section>
        );
    }

    /* ════════════════════════════════════════════════════════════════════════
       Original render path (showArrows = false)  — untouched
    ════════════════════════════════════════════════════════════════════════ */
    return (
        <section
            className={`
                relative w-full py-2
                overflow-hidden ${backgroundColor === 'white' ? 'bg-white' : `bg-${backgroundColor}`}
                ${centered ? 'flex items-center justify-center' : ''}
                ${full ? 'px-0' : 'px-1 md:px-2 lg:px-2'}
            `}
            style={backgroundColor !== 'white' && !backgroundColor.startsWith('bg-') ? { backgroundColor } : {}}
            role="banner"
            aria-label="Hero banner"
            onMouseEnter={() => { if (autoScroll || scrollable) setIsHovered(true); }}
            onMouseLeave={handleMouseLeave}
        >
            <div className={`${full ? 'w-full' : 'container mx-auto w-full'} ${centered ? 'text-center' : ''}`}>
                {title && (
                    <h1 className="text-lg md:text-2xl font-bold mb-2 text-[var(--primary-text-color)]" style={{ animationDelay: '100ms' }}>
                        {title}
                    </h1>
                )}
                {description && (
                    <p className={`text-lg md:text-xl text-[var(--primary-text-color)] mb-4 max-w-3xl ${centered ? 'mx-auto' : ''}`} style={{ animationDelay: '300ms' }}>
                        {description}
                    </p>
                )}

                {images.length > 0 && (
                    <div className={`w-full ${centered ? 'flex justify-center' : ''} ${scrollable ? 'relative' : ''}`} style={{ animationDelay: '500ms' }}>
                        <div
                            ref={carouselRef}
                            className={`${rowGapClass} w-full ${scrollable ? 'overflow-hidden' : ''}`}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            {rows.map((row, rowIndex) => (
                                <div
                                    key={rowIndex}
                                    className={`grid ${gapClass} w-full ${scrollable ? 'transition-transform duration-300 ease-out' : ''}`}
                                    style={{
                                        gridTemplateColumns: !scrollable && isMobile && parsedMobileRows
                                            ? `repeat(${row.length}, 1fr)` : gridTemplateStyle,
                                        transform: scrollable && isDragging ? `translateX(${translateX}px)` : 'none',
                                    }}
                                >
                                    {(scrollable ? visibleImages : row).map((image, imgIndex) => {
                                        const globalIndex = scrollable
                                            ? (currentIndex + imgIndex) % totalSlides
                                            : rows.slice(0, rowIndex).reduce((acc, r) => acc + r.length, 0) + imgIndex;
                                        const imageData = getImageData(image, globalIndex);
                                        return (
                                            <div
                                                key={`${globalIndex}-${imgIndex}`}
                                                className={`relative overflow-hidden group ${imageData.link ? 'cursor-pointer' : ''} ${scrollable ? 'flex-shrink-0' : ''}`}
                                                style={{ paddingBottom: `${parseRatio(imageData.ratio)}%`, animationDelay: `${600 + globalIndex * 100}ms` }}
                                                onClick={() => handleImageClick(image, globalIndex)}
                                                role={imageData.link ? 'button' : 'presentation'}
                                                tabIndex={imageData.link ? 0 : -1}
                                                onKeyPress={(e) => { if (imageData.link && e.key === 'Enter') handleImageClick(image, globalIndex); }}
                                            >
                                                <div className="absolute inset-0">
                                                    <picture>
                                                        {imageData.url && <source type="image/webp" />}
                                                        <img
                                                            src={getImage(imageData.url)}
                                                            alt={imageData.alt}
                                                            className="w-full h-full object-cover"
                                                            loading="lazy"
                                                            decoding="async"
                                                            draggable={false}
                                                            sizes={full ? '100vw' : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
                                                        />
                                                    </picture>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>

                        {scrollable && totalSlides > currentVisibleCount && (
                            <>
                                <button onClick={prevSlide} className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/80 shadow hover:bg-white flex items-center justify-center text-xl md:text-2xl" aria-label="Previous slide">‹</button>
                                <button onClick={nextSlide} className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/80 shadow hover:bg-white flex items-center justify-center text-xl md:text-2xl" aria-label="Next slide">›</button>
                            </>
                        )}
                    </div>
                )}

                {scrollable && dots && images.length > 0 && totalSlides > currentVisibleCount && (
                    <div className="flex justify-center gap-2 mt-4 pb-2">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button key={i} onClick={() => goToSlide(i)} className="focus:outline-none" aria-label={`Go to slide ${i + 1}`}>
                                <div className={`h-2.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 bg-amber-600' : 'w-2.5 bg-gray-400 hover:bg-gray-500'}`} />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default HeroBanner;