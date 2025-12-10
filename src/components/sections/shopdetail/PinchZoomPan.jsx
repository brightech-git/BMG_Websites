// src/components/sections/shopdetail/PinchZoomPan.jsx
import { motion, useMotionValue } from "framer-motion";
import { useState, useRef, useEffect } from "react";

export default function PinchZoomPan({
  children,
  minScale = 1,
  maxScale = 6,
  initialScale = 1,
  onScaleChange,
  onTap,
  className = "",
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [scale, setScale] = useState(initialScale);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const lastTapRef = useRef(0);
  const lastScaleRef = useRef(initialScale);

  // Handle double tap/click
  const handleDoubleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap detected
      const nextScale = scale < 1.5 ? 3 : scale < 3.5 ? 5 : 1;
      setScale(nextScale);
      onScaleChange?.(nextScale);
      lastScaleRef.current = nextScale;

      if (nextScale === 1) {
        x.set(0);
        y.set(0);
      }
    }

    lastTapRef.current = now;
  };

  // Handle pinch zoom with wheel (for desktop)
  const handleWheel = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.2 : 0.2;
      const newScale = Math.max(minScale, Math.min(maxScale, scale + delta));
      setScale(newScale);
      onScaleChange?.(newScale);
      lastScaleRef.current = newScale;
    }
  };

  // Handle touch gestures for mobile
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let initialDistance = 0;
    let initialScale = scale;

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        // Pinch start
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialDistance = Math.sqrt(dx * dx + dy * dy);
        initialScale = scale;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2 && e.cancelable) {
        e.preventDefault();

        // Calculate pinch distance
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDistance = Math.sqrt(dx * dx + dy * dy);

        if (initialDistance > 0) {
          // Calculate scale based on pinch distance
          const pinchScale = (currentDistance / initialDistance) * initialScale;
          const newScale = Math.max(minScale, Math.min(maxScale, pinchScale));
          setScale(newScale);
          onScaleChange?.(newScale);
          lastScaleRef.current = newScale;
        }
      }
    };

    const handleTouchEnd = () => {
      initialDistance = 0;
    };

    // Add touch event listeners
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scale, minScale, maxScale, onScaleChange]);

  // Handle single tap for controls
  const handleContainerClick = (e) => {
    // Only call onTap if it's a single tap (not part of double tap)
    const now = Date.now();
    if (now - lastTapRef.current > 300) {
      onTap?.();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        touchAction: "none",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={handleContainerClick}
      onWheel={handleWheel}
      onDoubleClick={handleDoubleClick}
    >
      <motion.div
        ref={contentRef}
        style={{
          x,
          y,
          scale,
          cursor: isDragging ? "grabbing" : (scale > 1 ? "grab" : "default"),
        }}
        drag={scale > 1}
        dragConstraints={{
          left: -500,
          right: 500,
          top: -500,
          bottom: 500,
        }}
        dragElastic={0.1}
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        whileDrag={{ cursor: "grabbing" }}
        animate={{ scale }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}