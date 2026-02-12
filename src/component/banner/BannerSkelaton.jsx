// ========== HERO BANNER SKELETON ==========
export const HeroBannerSkeleton = ({
    isGrid = false,
    count = 3,
    hasTitle = true,
    hasDescription = true,
    hasDots = false
}) => {
    return (
        <section className="relative w-full py-2 px-2 md:px-4 lg:px-4 bg-white animate-pulse">
            <div className="container mx-auto w-full">
                {/* Title Skeleton */}
                {hasTitle && (
                    <div className="mb-3">
                        <div className="h-6 md:h-8 bg-gradient-to-r from-[#FED7AA] to-[#FFEDD5] rounded-lg w-48 md:w-64 mx-auto md:mx-0"></div>
                    </div>
                )}

                {/* Description Skeleton */}
                {hasDescription && (
                    <div className="mb-4 space-y-2">
                        <div className="h-4 bg-gradient-to-r from-[#FED7AA]/80 to-[#FFEDD5]/80 rounded w-full max-w-md mx-auto md:mx-0"></div>
                        <div className="h-4 bg-gradient-to-r from-[#FED7AA]/80 to-[#FFEDD5]/80 rounded w-3/4 max-w-sm mx-auto md:mx-0"></div>
                    </div>
                )}

                {/* Images Grid Skeleton */}
                <div className={`grid ${isGrid ? 'grid-cols-2 md:grid-cols-3' : `grid-cols-1 md:grid-cols-${count}`} gap-4 md:gap-6`}>
                    {Array.from({ length: count }).map((_, i) => (
                        <div
                            key={i}
                            className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#FFF7ED] to-[#FFEDD5] animate-shimmer"
                            style={{
                                aspectRatio: '16/9',
                                animationDelay: `${i * 100}ms`
                            }}
                        >
                            {/* Shimmer overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>

                            {/* Placeholder icon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-[#FED7AA]/50 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 md:w-8 md:h-8 text-[#FDBA74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Dots Skeleton */}
                {hasDots && (
                    <div className="flex justify-center gap-2 mt-4 pb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div
                                key={i}
                                className={`h-2.5 rounded-full bg-[#FED7AA] ${i === 0 ? 'w-8' : 'w-2.5'}`}
                                style={{ animationDelay: `${i * 100}ms` }}
                            ></div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          position: relative;
          overflow: hidden;
        }
        .animate-shimmer::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          transform: translateX(-100%);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          animation: shimmer 2s infinite;
        }
      `}</style>
        </section>
    );
};

// ========== GRID BANNER SKELETON ==========
export const GridBannerSkeleton = ({
    columns = [1, 1, 1], // Default 3 columns
    rows = 1,
    hasTitle = true,
    hasDescription = false,
    totalImages = 6
}) => {
    // Calculate grid layout based on columns
    const gridTemplateColumns = columns.map(c => `${c}fr`).join(' ');

    return (
        <section className="relative w-full py-2 px-2 md:px-4 lg:px-4 bg-white animate-pulse">
            <div className="container mx-auto w-full">

                {/* Title Skeleton */}
                {hasTitle && (
                    <div className="mb-4 flex justify-center md:justify-start">
                        <div className="h-6 md:h-8 bg-gradient-to-r from-[#FED7AA] to-[#FFEDD5] rounded-lg w-56 md:w-72"></div>
                    </div>
                )}

                {/* Description Skeleton */}
                {hasDescription && (
                    <div className="mb-4 space-y-2 flex flex-col items-center md:items-start">
                        <div className="h-4 bg-gradient-to-r from-[#FED7AA]/80 to-[#FFEDD5]/80 rounded w-full max-w-lg"></div>
                        <div className="h-4 bg-gradient-to-r from-[#FED7AA]/80 to-[#FFEDD5]/80 rounded w-3/4 max-w-md"></div>
                    </div>
                )}

                {/* Grid Layout Skeleton */}
                <div
                    className="grid w-full gap-3"
                    style={{
                        gridTemplateColumns,
                        gridAutoRows: '1fr',
                    }}
                >
                    {Array.from({ length: totalImages }).map((_, i) => {
                        // Calculate row span (some images can be taller)
                        const rowSpan = i % 3 === 0 ? 2 : 1; // Every 3rd image is taller

                        return (
                            <div
                                key={i}
                                className="relative overflow-hidden rounded-lg bg-gradient-to-br from-[#FFF7ED] to-[#FFEDD5] animate-shimmer"
                                style={{
                                    gridRow: rowSpan > 1 ? `span ${rowSpan}` : 'span 1',
                                    aspectRatio: rowSpan > 1 ? '1/1.5' : '1/1',
                                    animationDelay: `${i * 80}ms`
                                }}
                            >
                                {/* Shimmer overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_1.8s_infinite]"></div>

                                {/* Placeholder content */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-[#FED7AA]/50 rounded-full flex items-center justify-center mb-2">
                                        <svg className="w-6 h-6 md:w-8 md:h-8 text-[#FDBA74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="w-3/4 h-3 bg-[#FED7AA]/70 rounded-full mt-2"></div>
                                    <div className="w-1/2 h-2 bg-[#FED7AA]/50 rounded-full mt-2"></div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Additional shimmer effect for grid */}
                <div className="mt-4 flex justify-center gap-2">
                    <div className="w-20 h-2 bg-gradient-to-r from-[#FED7AA] to-[#FFEDD5] rounded-full"></div>
                </div>
            </div>

            <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          position: relative;
          overflow: hidden;
        }
        .animate-shimmer::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          transform: translateX(-100%);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          animation: shimmer 2s infinite;
        }
      `}</style>
        </section>
    );
};

// ========== BUDGET BANNERS SKELETON WRAPPER ==========
export const BannerSkeleton = () => {
    // Simulate the structure of budgetBanners object
    const skeletonBanners = [
        { isGrid: false, key: 'hero1', columns: 3 },
        { isGrid: true, key: 'grid1', columns: [1, 1, 1], images: 6 },
        { isGrid: false, key: 'hero2', columns: 2 },
        { isGrid: true, key: 'grid2', columns: [1, 1], images: 4 },
    ];

    return (
        <div className="space-y-6 animate__animated animate__fadeIn">
            {skeletonBanners.map((banner, index) => (
                <div key={banner.key} className="animate__animated animate__fadeInUp" style={{ animationDelay: `${index * 150}ms` }}>
                    {banner.isGrid ? (
                        <GridBannerSkeleton
                            columns={banner.columns}
                            totalImages={banner.images}
                            hasTitle={true}
                            hasDescription={false}
                        />
                    ) : (
                        <HeroBannerSkeleton
                            count={banner.columns}
                            hasTitle={true}
                            hasDescription={true}
                            hasDots={true}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};