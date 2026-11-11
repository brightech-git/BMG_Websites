import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Pause, Play } from "lucide-react";
import ProductMediaViewer from "./ProductMediaViewer";

const galleryControl = "grid h-11 w-11 place-items-center rounded-xl border border-orange-200 bg-white text-[var(--brand-hover)] shadow-sm hover:bg-orange-100";

function MediaThumbnails({ media, active, onSelect }) {
    const selected = useRef(null);

    useEffect(() => {
        const button = selected.current;
        const track = button?.parentElement;
        if (!button || !track) return;

        const left = button.offsetLeft;
        const right = left + button.offsetWidth;
        if (left < track.scrollLeft) track.scrollLeft = left;
        else if (right > track.scrollLeft + track.clientWidth) {
            track.scrollLeft = right - track.clientWidth;
        }
    }, [active]);

    return (
        <div aria-label="Product media thumbnails" className="relative flex gap-2 overflow-x-auto p-2">
            {media.map(({ src, type }, index) => (
                <button
                    key={`${type}-${src}-${index}`}
                    ref={index === active ? selected : undefined}
                    type="button"
                    aria-label={`Show ${type} ${index + 1} of ${media.length}`}
                    aria-pressed={index === active}
                    onClick={() => onSelect(index)}
                    className={`grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-lg border-2 bg-white text-[var(--brand-hover)] sm:h-16 sm:w-16 ${
                        index === active ? "border-[var(--brand-primary)]" : "border-orange-100"
                    }`}
                >
                    {type === "image" ? (
                        <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                        <Play size={18} aria-hidden="true" />
                    )}
                </button>
            ))}
        </div>
    );
}

export default function ImageGallery({ images = [], videos = [], badges = {}, label = "Product image" }) {
    const [index, setIndex] = useState(0);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [playing, setPlaying] = useState(false);
    const previewImage = useRef(null);
    const expandButton = useRef(null);
    const media = [
        ...images.map((image) => ({ type: "image", src: image?.img || image })),
        ...videos.map((video) => ({ type: "video", src: video?.video || video })),
    ].filter(({ src }) => typeof src === "string" && src);
    const active = Math.min(index, media.length - 1);
    const current = media[active];

    useEffect(() => {
        if (!playing || viewerOpen || media.length < 2 || current?.type === "video") return;
        const timer = setTimeout(() => setIndex((active + 1) % media.length), 4000);
        return () => clearTimeout(timer);
    }, [active, current?.type, media.length, playing, viewerOpen]);

    if (!current) return null;

    const badgeLabels = [
        badges.NewArrival && "New arrival",
        badges.Top_Trending && "Trending",
        badges.BestDesign && "Best design",
        badges.discountPercentage > 0 && `${badges.discountPercentage}% off`,
    ].filter(Boolean);

    function previous() {
        setIndex((active - 1 + media.length) % media.length);
    }

    function next() {
        setIndex((active + 1) % media.length);
    }

    function movePreview(event) {
        if (event.pointerType !== "mouse" || !previewImage.current) return;

        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width * 100;
        const y = (event.clientY - rect.top) / rect.height * 100;
        previewImage.current.style.transformOrigin = `${x}% ${y}%`;
        previewImage.current.style.transform = "scale(1.85)";
    }

    function resetPreview() {
        if (previewImage.current) previewImage.current.style.transform = "";
    }

    function openViewer() {
        resetPreview();
        setPlaying(false);
        setViewerOpen(true);
    }

    function closeViewer() {
        setViewerOpen(false);
        requestAnimationFrame(() => expandButton.current?.focus());
    }

    return (
        <div className="w-full min-w-0 bg-orange-50">
            <div className="relative aspect-square overflow-hidden bg-white">
                {current.type === "image" ? (
                    <button
                        type="button"
                        aria-label="Enlarge product image"
                        onClick={openViewer}
                        onPointerEnter={movePreview}
                        onPointerMove={movePreview}
                        onPointerLeave={resetPreview}
                        className="block h-full w-full cursor-zoom-in overflow-hidden"
                    >
                        <img
                            key={current.src}
                            ref={previewImage}
                            src={current.src}
                            alt={label}
                            draggable={false}
                            className="h-full w-full object-contain motion-safe:transition-transform motion-safe:duration-150"
                        />
                    </button>
                ) : (
                    <video
                        key={current.src}
                        src={current.src}
                        controls
                        playsInline
                        poster={media.find((item) => item.type === "image")?.src}
                        className="h-full w-full object-contain"
                    />
                )}

                {badgeLabels.length > 0 && (
                    <ul className="pointer-events-none absolute left-2 top-2 m-0 flex list-none flex-wrap gap-1 p-0 pr-14 sm:left-3 sm:top-3">
                        {badgeLabels.map((badge) => (
                            <li key={badge} className="rounded-full border border-orange-100 bg-orange-50 px-2 py-1 text-xs font-bold text-[var(--brand-hover)]">
                                {badge}
                            </li>
                        ))}
                    </ul>
                )}

                <button
                    ref={expandButton}
                    type="button"
                    aria-label="Open full-screen gallery"
                    aria-haspopup="dialog"
                    onClick={openViewer}
                    className={`${galleryControl} absolute right-2 top-2 sm:right-3 sm:top-3`}
                >
                    <Maximize2 size={18} aria-hidden="true" />
                </button>

                {media.length > 1 && (
                    <>
                        <button
                            type="button"
                            aria-label="Previous media"
                            onClick={previous}
                            className={`${galleryControl} absolute left-2 top-1/2 -translate-y-1/2`}
                        >
                            <ChevronLeft size={21} aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            aria-label="Next media"
                            onClick={next}
                            className={`${galleryControl} absolute right-2 top-1/2 -translate-y-1/2`}
                        >
                            <ChevronRight size={21} aria-hidden="true" />
                        </button>
                    </>
                )}
            </div>

            {media.length > 1 && (
                <div className="flex items-center gap-1 pr-2">
                    <div className="min-w-0 flex-1">
                        <MediaThumbnails
                            media={media}
                            active={active}
                            onSelect={(nextIndex) => {
                                setPlaying(false);
                                setIndex(nextIndex);
                            }}
                        />
                    </div>
                    {current.type === "image" && (
                        <button
                            type="button"
                            aria-label={playing ? "Pause slideshow" : "Play slideshow"}
                            onClick={() => setPlaying((value) => !value)}
                            className={galleryControl + " shrink-0"}
                        >
                            {playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
                        </button>
                    )}
                </div>
            )}

            {viewerOpen && (
                <ProductMediaViewer
                    media={media}
                    current={current}
                    index={active}
                    label={label}
                    onClose={closeViewer}
                    onPrevious={previous}
                    onNext={next}
                    thumbnails={<MediaThumbnails media={media} active={active} onSelect={setIndex} />}
                />
            )}
        </div>
    );
}
