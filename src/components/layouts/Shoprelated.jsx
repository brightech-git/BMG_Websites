import React, { useRef } from 'react';
import ProductCard from '../../features/catalog/components/productCard/ProductCard';
import { useRelatedProducts } from '../../features/catalog/hooks/product/useFilterProducts';
import { ChevronLeft, ChevronRight, AlertCircle, Loader2, Sparkles } from 'lucide-react';

const ShopRelatedUpdated = ({ itemCtrId }) => {
    const scrollRef = useRef(null);

    const { data, isLoading, isError } = useRelatedProducts(itemCtrId);

    console.log(data,'datadata')

    const relatedProducts = Array.isArray(data)
        ? data
        : [];

    const scroll = (direction) => {
        if (!scrollRef.current) return;
        const scrollAmount = 300; // Slightly increased for better experience
        scrollRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    return (
        <section className="py-2 bg-orange-50 rounded-2xl shadow-base">
            <div className="container mx-auto px-2 max-w-7xl">
                {/* Header with navigation */}
                <div className="flex items-center justify-between mb-4 bg-[var(--primary-card-color)]">
                    <div>
                         <h2 className="text-xl font-bold text-gray-800  flex items-center gap-2">
                                     <Sparkles className="w-6 h-6 text-[#f16137]" />
                                     You May Also Like
                        </h2>
                    </div>

                    {/* Navigation buttons - Only show if there are products */}
                    {relatedProducts.length > 0 && (
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => scroll('left')}
                                className="p-2 rounded-full bg-white shadow-md hover:shadow-lg 
                                         border border-orange-200 
                                         hover:bg-orange-50 
                                         transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                                         disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Scroll left"
                                disabled={isLoading}
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-700" />
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className="p-2 rounded-full bg-white shadow-md hover:shadow-lg 
                                         border border-orange-200 
                                         hover:bg-orange-50 
                                         transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                                         disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Scroll right"
                                disabled={isLoading}
                            >
                                <ChevronRight className="w-5 h-5 text-gray-700" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="flex-shrink-0 w-64 md:w-72 lg:w-80 snap-start"
                            >
                                <div className="bg-white rounded-xl shadow-md 
                                border border-orange-200 
                                overflow-hidden h-full animate-pulse">

                                    {/* Image Skeleton */}
                                    <div className="w-full h-40 md:h-48 lg:h-52 bg-gray-300"></div>

                                    {/* Text Skeleton */}
                                    <div className="p-4 space-y-3">
                                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                )}


                {/* Error State */}
                {isError && (
                    <div className="bg-red-50 border border-red-200 
                                   rounded-xl p-2 mb-2">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-red-800">
                                    Failed to load products
                                </h3>
                                <p className="text-red-700 mt-1">
                                    {typeof isError === 'string' ? isError : 'Please try again later'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !isError && relatedProducts.length === 0 && (
                    <div className="bg-gray-100 rounded-xl p-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 
                                      flex items-center justify-center">
                            <AlertCircle className="w-8 h-8 text-gray-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No related products found
                        </h3>
                        <p className="text-gray-600">
                            We couldn't find any products related to this item
                        </p>
                    </div>
                )}

                {/* Products Grid - Horizontal Scroll */}
                {!isLoading && !isError && relatedProducts.length > 0 && (
                    <div className="relative">
                        {/* Gradient overlays for better UX */}
                        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-orange-50 to-transparent z-10 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-orange-50 to-transparent z-10 pointer-events-none" />

                        {/* Scrollable container */}
                        <div
                            ref={scrollRef}
                            className="flex gap-2  overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
                            style={{
                                scrollbarWidth: 'none', // Firefox
                                msOverflowStyle: 'none', // IE/Edge
                            }}
                        >
                            {/* Hide scrollbar for Chrome/Safari */}
                            <style >{`
                                .scrollbar-hide::-webkit-scrollbar {
                                    display: none;
                                }
                            `}</style>

                            {relatedProducts.map((item, index) => (
                                <div
                                    key={`${item.id || item._id || index}-${item.name}`}
                                    className="flex-shrink-0 w-[45%] sm:w-[25%] md:w-66 lg:w-74 snap-start"
                                >
                                  
                                        <ProductCard item={item} />
                                  
                                </div>
                            ))}
                        </div>

                     
                    </div>
                )}

       
              
            </div>
        </section>
    );
};

export default ShopRelatedUpdated;