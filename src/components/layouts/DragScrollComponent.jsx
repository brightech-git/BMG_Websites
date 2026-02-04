import React, { useState, useRef, useEffect } from 'react';
import './DragScrollComponent.css';

const DragScrollComponent = ({ children }) => {
    const scrollContentRef = useRef(null);
    const autoScrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isAutoScrolling, setIsAutoScrolling] = useState(true);

    // Drag scroll
    const handleMouseDown = (e) => {
        if (!scrollContentRef.current) return;
        setIsDragging(true);
        scrollContentRef.current.style.cursor = 'grabbing';
        scrollContentRef.current.style.scrollBehavior = 'auto';

        const startX = e.pageX - scrollContentRef.current.offsetLeft;
        const scrollLeft = scrollContentRef.current.scrollLeft;

        const handleMouseMove = (e) => {
            if (!isDragging) return;
            const x = e.pageX - scrollContentRef.current.offsetLeft;
            scrollContentRef.current.scrollLeft = scrollLeft - (x - startX) * 2;
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            if (scrollContentRef.current) scrollContentRef.current.style.scrollBehavior = 'smooth';
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleTouchStart = (e) => {
        if (!scrollContentRef.current) return;
        setIsDragging(true);
        scrollContentRef.current.style.scrollBehavior = 'auto';

        const startX = e.touches[0].pageX - scrollContentRef.current.offsetLeft;
        const scrollLeft = scrollContentRef.current.scrollLeft;

        const handleTouchMove = (e) => {
            if (!isDragging) return;
            const x = e.touches[0].pageX - scrollContentRef.current.offsetLeft;
            scrollContentRef.current.scrollLeft = scrollLeft - (x - startX) * 2;
        };

        const handleTouchEnd = () => {
            setIsDragging(false);
            if (scrollContentRef.current) scrollContentRef.current.style.scrollBehavior = 'smooth';
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };

        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);
    };

    // Auto-scroll that stops at the end
    useEffect(() => {
        const el = scrollContentRef.current;
        if (!isAutoScrolling || !el) return;

        const scrollStep = 1; // px per interval
        const interval = 20; // ms

        autoScrollRef.current = setInterval(() => {
            const maxScroll = el.scrollWidth - el.clientWidth;

            if (el.scrollLeft < maxScroll) {
                el.scrollLeft += scrollStep;
            } else {
                // Stop auto-scroll at the end
                clearInterval(autoScrollRef.current);
            }
        }, interval);

        return () => clearInterval(autoScrollRef.current);
    }, [isAutoScrolling, children]);

    return (
        <div className="drag-scroll-container">
            <div
                ref={scrollContentRef}
                className={`scroll-content ${isDragging ? 'dragging' : ''}`}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
            >
                {children}
            </div>
        </div>
    );
};

export default DragScrollComponent;
