import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SmartButton from '../../ui/SmartButton';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'animate.css';

const OurCategory = ({ subcategories, isCategoriesLoading }) => {
    const scrollRef = useRef(null);
    const navigate = useNavigate();
    const baseUrl = "https://app.bmgjewellers.com";

    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);

    useEffect(() => {
        const ref = scrollRef.current;
        if (!ref) return;

        const handleScroll = () => {
            if (!scrollRef.current) return;

            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

            setIsAtStart(scrollLeft === 0);
            setIsAtEnd(Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 1);
        };

        ref.addEventListener('scroll', handleScroll);
        handleScroll(); // Check initial state

      
     

        return () => {
            ref.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleItemClick = (itemCtrName) => {
        navigate(`/products-page?itemCtrName=${encodeURIComponent(itemCtrName)}`);
    };

    const formatItemName = (name) => {
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const scroll = (direction) => {
        if (!scrollRef.current) return;
        const scrollAmount = 200;
        scrollRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });

        // Update button states after scroll
        setTimeout(() => {
            if (!scrollRef.current) return;
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setIsAtStart(scrollLeft === 0);
            setIsAtEnd(Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 1);
        }, 300);
    };

    if (isCategoriesLoading) {
        return (
            <section className="py-4 relative animate__animated animate__fadeIn">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                            Bmg World
                        </h2>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4">
                        {[...Array(5)].map((_, index) => (
                            <div
                                key={index}
                                className="flex-none w-[180px] md:w-[160px] sm:w-[140px] xs:w-[100px] animate-pulse"
                            >
                                <div className="w-full h-[180px] md:h-[160px] sm:h-[140px] xs:h-[100px] bg-gray-200 rounded-xl"></div>
                                <div className="mt-2 h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-4 relative animate__animated animate__fadeIn">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-title bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-lg font-black text-transparent drop-shadow-md md:text-2xl">
                        Bmg World
                    </h2>

                    {/* Navigation Buttons - Hide in grid view */}
                
                        <div className="flex gap-2">
                            <SmartButton
                                variant="arrow"
                                isDisabled={isAtStart}
                                onClick={() => scroll('left')}
                                className="rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-100 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                <ChevronLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                            </SmartButton>
                            <SmartButton
                                variant="arrow"
                                isDisabled={isAtEnd}
                                onClick={() => scroll('right')}
                                className="rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-100 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </SmartButton>
                        </div>
                 
                </div>

                {/* Categories Container */}
                <div className="relative">
                    <div
                        ref={scrollRef}
                        className={`flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory
                            pb-2
                        `}
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            WebkitOverflowScrolling: 'touch'
                        }}
                    >
                        {[...subcategories].map((category, index) => (
                            <div
                                key={category.id}
                                className={`flex-none w-[100px] sm:w-[120px] lg:w-[140px] xl:w-[160px] snap-start
                                    group cursor-pointer transition-all duration-300 hover:-translate-y-1
                                    animate__animated animate__fadeInUp
                                `}
                                style={{ animationDelay: `${index * 100}ms` }}
                                onClick={() => handleItemClick(category.item_name)}
                                onKeyDown={(e) => e.key === 'Enter' && handleItemClick(category.item_name)}
                                role="button"
                                tabIndex={0}
                            >
                                {/* Image Container */}
                                <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                                    <img
                                        src={`${baseUrl}${category.image_path}`}
                                        alt={formatItemName(category.item_name)}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                    {/* Optional overlay on hover */}
                                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                </div>

                                {/* Category Name */}
                                <p className="mt-2 text-center text-sm md:text-base font-semibold text-gray-800 group-hover:text-amber-600 transition-colors duration-300">
                                    {category.item_name}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OurCategory;