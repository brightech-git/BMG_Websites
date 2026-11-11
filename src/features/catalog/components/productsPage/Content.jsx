import { useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertCircle, Loader2, Search } from "lucide-react";
import { useFilteredProducts } from "../../hooks/product/useFilterProducts";
import { useNotification } from "../../../../context/notification/NotificationContext";
import { formatNumber } from "../../../../utils/index.js";
import ProductCard from "../productCard/ProductCard";
import ProductFilterBar from "./ProductFilterBar";

const PAGE_SIZE = 20;
const gridClass = "grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4";

function LoadingGrid() {
    return (
        <div className={gridClass} aria-label="Loading products">
            {Array.from({ length: 8 }, (_, index) => (
                <div
                    key={index}
                    aria-hidden="true"
                    className="overflow-hidden rounded-xl border border-orange-100 bg-white motion-safe:animate-pulse"
                >
                    <div className="aspect-square bg-orange-100" />
                    <div className="space-y-3 p-3">
                        <div className="h-4 w-3/4 rounded bg-orange-100" />
                        <div className="h-4 w-1/2 rounded bg-orange-50" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function ResultsMessage({ onRetry }) {
    const Icon = onRetry ? AlertCircle : Search;
    return (
        <div className="rounded-2xl border border-orange-100 bg-white px-4 py-12 text-center">
            <Icon
                size={30}
                className="mx-auto mb-3 text-[var(--brand-primary)]"
                aria-hidden="true"
            />
            <h2 className="mb-2 text-xl font-bold">
                {onRetry ? "Couldn’t load products" : "No products found"}
            </h2>
            <p className="text-sm !text-stone-600">
                {onRetry ? "Please try again." : "Try adjusting your filters or search."}
            </p>
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-4 rounded-xl bg-[var(--brand-primary)] px-5 py-3 font-bold text-white"
                >
                    Try again
                </button>
            )}
        </div>
    );
}

export default function Content({ ItemName }) {
    const [searchParams] = useSearchParams();
    const queryFilters = useMemo(
        () => Object.fromEntries(searchParams),
        [searchParams]
    );
    const { askNotification } = useNotification();
    const sentinelRef = useRef(null);
    const {
        data,
        isPending,
        isError,
        isFetching,
        isFetchNextPageError,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        refetch,
    } = useFilteredProducts(queryFilters, PAGE_SIZE);

    const products = useMemo(() => {
        const seen = new Set();
        return (data?.pages ?? []).flatMap((page) => page.data).filter((item) => {
            if (seen.has(item.TAGKEY)) return false;
            seen.add(item.TAGKEY);
            return true;
        });
    }, [data]);

    const totalItems = data?.pages[0]?.totalProducts ?? products.length;

    useEffect(() => {
        askNotification("Welcome to BMG Jewellers", "Stay updated with important updates.");
    }, []);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel || !hasNextPage || isFetching || isFetchNextPageError) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                observer.unobserve(sentinel);
                void fetchNextPage({ cancelRefetch: false });
            },
            { rootMargin: "200px" }
        );
        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchNextPageError,
    ]);

    return (
        <section className="min-h-screen bg-[var(--orange-50)] px-3 pb-24 pt-5 sm:px-6 lg:pb-8">
            <div className="mx-auto max-w-8xl">
                <div className="mb-5">
                    <ProductFilterBar
                        ItemName={ItemName}
                        totalResults={totalItems}
                        resultsLoading={isPending}
                    />
                </div>

                <div aria-busy={isPending}>
                    {isPending ? (
                        <LoadingGrid />
                    ) : products.length === 0 ? (
                        <ResultsMessage onRetry={isError ? refetch : undefined} />
                    ) : (
                        <>
                            <p className="mb-3 text-sm !text-stone-600" role="status">
                                Showing {formatNumber(products.length, 0)} of{" "}
                                {formatNumber(totalItems, 0)} results
                            </p>
                            <div className={gridClass}>
                                {products.map((item) => (
                                    <ProductCard key={item.TAGKEY} item={item} />
                                ))}
                            </div>
                            {hasNextPage && <div ref={sentinelRef} className="h-px" aria-hidden="true" />}
                            {isFetchingNextPage && (
                                <p className="mt-5 flex items-center justify-center gap-2 text-sm" role="status">
                                    <Loader2 className="animate-spin" size={18} aria-hidden="true" />
                                    Loading more products…
                                </p>
                            )}
                            {hasNextPage && !isFetchingNextPage && (
                                <button
                                    type="button"
                                    disabled={isFetching}
                                    onClick={() => fetchNextPage({ cancelRefetch: false })}
                                    className="mx-auto mt-5 block rounded-xl border border-orange-200 bg-white px-4 py-3 font-bold text-[var(--brand-hover)]"
                                >
                                    {isFetchNextPageError ? "Retry loading more products" : "Load more products"}
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
