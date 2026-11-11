import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, X, ZoomIn, ZoomOut } from "lucide-react";

const FIT = { scale: 1, x: 0, y: 0 };
const MAX_SCALE = 5;
const control = "grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-orange-200 bg-white text-[var(--brand-hover)] hover:bg-orange-100 disabled:opacity-40";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function midpoint(first, second) {
    return {
        x: (first.x + second.x) / 2,
        y: (first.y + second.y) / 2,
    };
}

function distance(first, second) {
    return Math.hypot(first.x - second.x, first.y - second.y);
}

function ZoomImage({ src, label }) {
    const viewport = useRef(null);
    const image = useRef(null);
    const view = useRef(FIT);
    const pointers = useRef(new Map());
    const lastTap = useRef(null);
    const [transform, setTransform] = useState(FIT);

    function update(next) {
        const frame = viewport.current;
        const photo = image.current;
        if (!frame || !photo) return;

        const maxX = Math.max(0, (photo.offsetWidth * next.scale - frame.clientWidth) / 2);
        const maxY = Math.max(0, (photo.offsetHeight * next.scale - frame.clientHeight) / 2);

        view.current = {
            scale: next.scale,
            x: clamp(next.x, -maxX, maxX),
            y: clamp(next.y, -maxY, maxY),
        };
        setTransform(view.current);
    }

    function zoomAt(scale, start = { x: 0, y: 0 }, end = start) {
        const previous = view.current;
        const nextScale = clamp(scale, 1, MAX_SCALE);
        const ratio = nextScale / previous.scale;
        update({
            scale: nextScale,
            x: end.x - (start.x - previous.x) * ratio,
            y: end.y - (start.y - previous.y) * ratio,
        });
    }

    function pointInFrame(event) {
        const rect = viewport.current.getBoundingClientRect();
        return {
            x: event.clientX - rect.left - rect.width / 2,
            y: event.clientY - rect.top - rect.height / 2,
        };
    }

    useEffect(() => {
        const frame = viewport.current;
        const observer = new ResizeObserver(() => update(view.current));
        observer.observe(frame);
        observer.observe(image.current);

        function handleWheel(event) {
            event.preventDefault();
            const speed = event.deltaMode === 1 ? 0.045 : 0.002;
            zoomAt(view.current.scale * Math.exp(-event.deltaY * speed), pointInFrame(event));
        }

        frame.addEventListener("wheel", handleWheel, { passive: false });
        return () => {
            observer.disconnect();
            frame.removeEventListener("wheel", handleWheel);
        };
    }, []);

    function handlePointerDown(event) {
        if (event.button !== 0 || pointers.current.size >= 2) return;
        const point = pointInFrame(event);
        event.currentTarget.setPointerCapture(event.pointerId);
        if (pointers.current.size > 0) {
            lastTap.current = null;
            for (const pointer of pointers.current.values()) pointer.moved = true;
        }
        pointers.current.set(event.pointerId, {
            point,
            origin: point,
            moved: pointers.current.size > 0,
        });
    }

    function handlePointerMove(event) {
        const active = pointers.current.get(event.pointerId);
        if (!active) return;

        const next = pointInFrame(event);
        const previous = active.point;
        if (distance(next, active.origin) > 8) active.moved = true;
        active.point = next;

        if (pointers.current.size === 2) {
            const other = [...pointers.current.values()].find((pointer) => pointer !== active).point;
            const previousDistance = distance(previous, other);
            if (previousDistance > 0) {
                zoomAt(
                    view.current.scale * distance(next, other) / previousDistance,
                    midpoint(previous, other),
                    midpoint(next, other)
                );
            }
        } else if (view.current.scale > 1 && active.moved) {
            update({
                ...view.current,
                x: view.current.x + next.x - previous.x,
                y: view.current.y + next.y - previous.y,
            });
        }
    }

    function endPointer(event) {
        const active = pointers.current.get(event.pointerId);
        pointers.current.delete(event.pointerId);
        if (!active || active.moved || event.type !== "pointerup") return;

        const now = performance.now();
        const previousTap = lastTap.current;
        if (previousTap && now - previousTap.time < 320 && distance(previousTap.point, active.point) < 30) {
            zoomAt(view.current.scale > 1 ? 1 : 2.5, active.point);
            lastTap.current = null;
        } else {
            lastTap.current = { time: now, point: active.point };
        }
    }

    function handleKeys(event) {
        if (event.key === "+" || event.key === "=") zoomAt(view.current.scale + 0.5);
        else if (event.key === "-") zoomAt(view.current.scale - 0.5);
        else if (event.key === "0") update(FIT);
        else if (view.current.scale > 1 && event.key.startsWith("Arrow")) {
            const movement = {
                ArrowLeft: [50, 0],
                ArrowRight: [-50, 0],
                ArrowUp: [0, 50],
                ArrowDown: [0, -50],
            }[event.key];
            if (!movement) return;
            update({ ...view.current, x: view.current.x + movement[0], y: view.current.y + movement[1] });
        } else {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
    }

    return (
        <>
            <div className="flex shrink-0 flex-wrap items-center justify-center gap-2 px-3 pb-2">
                <button
                    type="button"
                    aria-label="Zoom out"
                    disabled={transform.scale <= 1}
                    onClick={() => zoomAt(view.current.scale - 0.5)}
                    className={control}
                >
                    <ZoomOut size={19} aria-hidden="true" />
                </button>
                <span className="min-w-12 text-center text-sm font-bold tabular-nums text-[var(--brand-hover)]">
                    {Math.round(transform.scale * 100)}%
                </span>
                <button
                    type="button"
                    aria-label="Zoom in"
                    disabled={transform.scale >= MAX_SCALE}
                    onClick={() => zoomAt(view.current.scale + 0.5)}
                    className={control}
                >
                    <ZoomIn size={19} aria-hidden="true" />
                </button>
                <button
                    type="button"
                    aria-label="Reset zoom"
                    disabled={transform.scale <= 1}
                    onClick={() => update(FIT)}
                    className={control}
                >
                    <RotateCcw size={17} aria-hidden="true" />
                </button>
            </div>
            <div
                ref={viewport}
                tabIndex={0}
                aria-label="Image zoom area. Plus and minus zoom. Arrow keys pan while zoomed. Zero resets."
                onKeyDown={handleKeys}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={endPointer}
                onPointerCancel={endPointer}
                onLostPointerCapture={endPointer}
                className={`relative min-h-0 flex-1 touch-none select-none overflow-hidden bg-white ${
                    transform.scale > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
                }`}
            >
                <img
                    ref={image}
                    src={src}
                    alt={label}
                    draggable={false}
                    className="pointer-events-none absolute inset-0 m-auto block h-auto max-h-full w-auto max-w-full object-contain [transition:none]"
                    style={{
                        transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`,
                    }}
                />
            </div>
        </>
    );
}

export default function ProductMediaViewer({ media, current, index, onClose, onPrevious, onNext, thumbnails, label }) {
    const dialog = useRef(null);

    useEffect(() => {
        const panel = dialog.current;
        const previousOverflow = document.body.style.overflow;
        panel.showModal();
        document.body.style.overflow = "hidden";
        return () => {
            panel.close();
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    function handleKeys(event) {
        if (event.key === "ArrowLeft") onPrevious();
        else if (event.key === "ArrowRight") onNext();
        else return;
        event.preventDefault();
    }

    return (
        <dialog
            ref={dialog}
            aria-label="Product media viewer"
            onKeyDown={handleKeys}
            onCancel={(event) => {
                event.preventDefault();
                onClose();
            }}
            className="fixed inset-0 m-0 h-[100dvh] max-h-none w-full max-w-none overflow-hidden border-0 bg-orange-50 p-0 [font-family:var(--primary-font)]"
        >
            <div className="flex h-full flex-col">
                <header className="flex shrink-0 items-center justify-between gap-2 px-3 py-2 sm:px-5">
                    <span className="min-w-0 truncate font-bold text-[var(--primary-text-color)]">
                        {label}
                    </span>
                    <div className="flex shrink-0 items-center gap-1.5">
                        {media.length > 1 && (
                            <>
                                <button type="button" onClick={onPrevious} aria-label="Previous media" className={control}>
                                    <ChevronLeft size={21} aria-hidden="true" />
                                </button>
                                <button type="button" onClick={onNext} aria-label="Next media" className={control}>
                                    <ChevronRight size={21} aria-hidden="true" />
                                </button>
                            </>
                        )}
                        <button type="button" onClick={onClose} aria-label="Close media viewer" className={control}>
                            <X size={21} aria-hidden="true" />
                        </button>
                    </div>
                </header>

                {current.type === "image" ? (
                    <ZoomImage key={index} src={current.src} label={label} />
                ) : (
                    <div className="relative min-h-0 flex-1 bg-white">
                        <video
                            key={index}
                            src={current.src}
                            controls
                            playsInline
                            className="absolute inset-0 m-auto max-h-full max-w-full"
                        />
                    </div>
                )}

                {media.length > 1 && (
                    <div className="shrink-0 border-t border-orange-100 px-2 pb-[env(safe-area-inset-bottom)]">
                        {thumbnails}
                    </div>
                )}
            </div>
        </dialog>
    );
}
