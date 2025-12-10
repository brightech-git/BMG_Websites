import React ,{useRef, useState} from 'react';
import { useHistory } from 'react-router-dom';
import './OurCategory.css';
import SmartButton from '../../ui/SmartButton';
import { FaArrowAltCircleRight } from 'react-icons/fa';
import { ChevronLeft ,ChevronRight } from 'lucide-react';
const OurCategory = ({subcategories ,isCategoriesLoading}) => {

const scrollRef = React.useRef(null);

    const history = useHistory();
    const baseUrl = "https://app.bmgjewellers.com";

    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);
    React.useEffect(() => {
        const ref = scrollRef.current;
        if (!ref) return;

        ref.addEventListener('scroll', handleScroll);

        // cleanup
        return () => ref.removeEventListener('scroll', handleScroll);
    }, []);

    const handleScroll = () => {
        if (!scrollRef.current) return;

        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

        // Start reached?
        setIsAtStart(scrollLeft === 0);

        // End reached?
        setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
    };

    const handleItemClick = (itemCtrName) => {
        history.push(`/products-page?itemCtrName=${encodeURIComponent(itemCtrName)}`);
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
        setTimeout(handleScroll, 300);
    };

    if (isCategoriesLoading) {
        return (
            <section className="elegant-category-section">
                <div className="elegant-container">
                    <div className="elegant-header">
                        <h2 className="cat-content-title">Bmg World</h2>
                    </div>
                    <div className="elegant-scroll-container">
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className="elegant-card">
                                <div className="elegant-image-container placeholder-glow">
                                    <div className="placeholder w-100 h-100"></div>
                                </div>
                                <div className="elegant-details">
                                    <h3 className="elegant-title placeholder-glow">
                                        <span className="placeholder col-6"></span>
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="elegant-category-sections">
            <div className="elegant-containers">
                <div className="elegant-header">
                    <h2 className="cat-content-title">Bmg World</h2>
                    <div className='flex gap-2'>
                        <SmartButton variant="arrow" isDisabled = {isAtStart} onClick={() => scroll('left')} className='rounded-full w-2'> <ChevronLeft className="w-4 h-4 group-hover:translate-x-1 transition" /> </SmartButton>
                        <SmartButton variant="arrow" isDisabled = {isAtEnd} onClick={() => scroll('right')} className='rounded-full w-2' > <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" /> </SmartButton>
                     
                    </div>
                </div>

                <div className="relative">
                    <div
                        ref={scrollRef}
                        className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >

                        {[...subcategories].reverse().map((category) => (
                        <div
                            key={category.id}
                            className="elegant-cards"
                            onClick={() => handleItemClick(category.item_name)}
                        >
                            <div className="elegant-image-containers">
                                <img
                                    src={`${baseUrl}${category.image_path}`}
                                    alt={formatItemName(category.item_name)}
                                    className="elegant-images"
                                    loading="lazy"
                                />
                            </div>
                       
                        </div>
                    ))}
                    </div>
                    </div>

         
            </div>
        </section>
    );
};

export default OurCategory;