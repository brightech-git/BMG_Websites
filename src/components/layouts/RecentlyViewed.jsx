import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, History } from "lucide-react";
import { Link } from "react-router-dom";
import { useRecentlyViewed } from "../../features/catalog/hooks/recentlyViewed/useRecentlyViewedQuery";
import ProductCard from "../../features/catalog/components/productCard/ProductCard";
import "./recently-viewed.css";

export default function RecentlyViewed() {
  const headingId = useId();
  const trackId = useId();
  const trackRef = useRef(null);
  const [scroll, setScroll] = useState({ previous: false, next: false });
  const { data, isLoading, isError } = useRecentlyViewed();
  const products = data?.data ?? [];
  const hasProducts = !isLoading && !isError && products.length > 0;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const update = () => {
      const previous = track.scrollLeft > 1;
      const next = track.scrollWidth - track.clientWidth - track.scrollLeft > 1;
      setScroll((current) => current.previous === previous && current.next === next
        ? current : { previous, next });
    };
    const observer = new ResizeObserver(update);
    observer.observe(track);
    track.addEventListener("scroll", update, { passive: true });
    update();

    return () => {
      observer.disconnect();
      track.removeEventListener("scroll", update);
    };
  }, [hasProducts, products.length]);

  const page = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const step = track.children.length > 1
      ? track.children[1].offsetLeft - track.children[0].offsetLeft
      : track.clientWidth;
    const distance = step * Math.max(1, Math.floor(track.clientWidth / step));
    track.scrollBy({ left: direction * distance });
  };

  return (
    <section className="viewed-section" aria-labelledby={headingId} aria-busy={isLoading}>
      <div className="viewed-shell">
        <div className="viewed-heading">
          <div className="viewed-title">
            <span className="viewed-icon"><History size={22} aria-hidden="true" /></span>
            <h2 id={headingId}>Recently viewed</h2>
          </div>
          {hasProducts && (scroll.previous || scroll.next) && (
            <div className="viewed-controls">
              <button type="button" aria-controls={trackId} aria-label="Previous products"
                disabled={!scroll.previous} onClick={() => page(-1)}>
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
              <button type="button" aria-controls={trackId} aria-label="Next products"
                disabled={!scroll.next} onClick={() => page(1)}>
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
        {isLoading ? (
          <div className="viewed-track viewed-loading" aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => <div className="viewed-skeleton" key={index} />)}
          </div>
        ) : hasProducts ? (
          <ul className="viewed-track" id={trackId} ref={trackRef} tabIndex={0} aria-label="Recently viewed products">
            {products.map((product) => (
              <li className="viewed-item" key={product.TAGKEY}>
                <ProductCard item={product} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="viewed-message">
            <p role="status">{isError ? "Recently viewed products are temporarily unavailable." : "Products you view will appear here."}</p>
            <Link to="/products-page">Browse jewellery <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        )}
      </div>
    </section>
  );
}
