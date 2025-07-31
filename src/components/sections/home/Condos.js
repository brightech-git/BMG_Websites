import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import AOS from 'aos';
import 'aos/dist/aos.css';

const PriceUnderSection = () => {
    const history = useHistory();

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: true,
        });
    }, []);

    const budgetCategories = [
        {
            img: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop",
            title: 'Under 999',
            subtext: 'Casual comfort',
            alt: 'Everyday wear collection',
            min: 0,
            max: 999,
            isPremium: false
        },
        {
            img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop",
            title: 'Under 1999',
            subtext: 'Glamorous outfits',
            alt: 'Party wear collection',
            min: 1000,
            max: 1999,
            isPremium: true
        },
        {
            img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
            title: 'Under 2999',
            subtext: 'Relaxed styles',
            alt: 'Casual comfort collection',
            min: 2000,
            max: 2999,
            isPremium: false
        },
        {
            img: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop",
            title: 'Above 2999',
            subtext: 'Premium charm',
            alt: 'Glamorous outfits collection',
            min: 3000,
            max: 10000000,
            isPremium: false
        }
    ];

    const handleCategoryNavigation = (minPrice, maxPrice) => {
        const searchParams = new URLSearchParams();
        if (minPrice) searchParams.append('minGrandTotal', minPrice);
        if (maxPrice) searchParams.append('maxGrandTotal', maxPrice);
        const formattedQuery = searchParams.toString().replace(/\+/g, '%20');
        history.push(`/shop-left?${formattedQuery}`);
    };

    const enhancedStyles = `
        @import url('https://fonts.googleapis.com/css2?family=Gloock&family=Montserrat:wght@100;300;400;600;700&display=swap');
        
        .pw-price-under-section {
            background: var(--primary-color);
            padding: 4rem 1rem;
            font-family: var(--secondary-font);
        }

        .pw-section-title {
            font-size: clamp(1.4rem, 3vw, 2rem);
            font-weight: 400;
            color: var(--primary-text-color);
            text-align: center;
            margin-bottom: 1.5rem;
            letter-spacing: 0.5px;
            font-family: var(--primary-font);
            position: relative;
        }

        .pw-section-title::after {
            content: '';
            position: absolute;
            bottom: -12px;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 2px;
            background: var(--primary-hover-color);
        }

        .pw-section-subtitle {
            font-size: 1rem;
            color: var(--grey-color);
            text-align: center;
            margin-bottom: 3rem;
            font-weight: 300;
            max-width: 700px;
            margin-left: auto;
            margin-right: auto;
            font-family: var(--secondary-font);
            line-height: 1.6;
        }

        .pw-price-card {
            background: var(--white-color);
            border-radius: 20px;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            height: 100%;
            display: flex;
            flex-direction: column;
            border: 1px solid rgba(0,0,0,0.05);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
        }

        .pw-price-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }

        .pw-image-container {
            height: 320px;
            overflow: hidden;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--primary-card-color);
        }

        .pw-card-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .pw-price-card:hover .pw-card-image {
            transform: scale(1.05);
        }

        .pw-text-container {
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            background: var(--white-color);
        }

        .pw-card-title {
            font-size: 1.1rem;
            font-weight: 500;
            color: var(--primary-text-color);
            margin: 0 0 1rem 0;
            letter-spacing: 0.3px;
            text-transform: capitalize;
            font-family: var(--secondary-font);
            font-weight: 600;
        }

        .pw-explore-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.7rem 2rem;
            background: transparent;
            border: 1px solid var(--primary-hover-color);
            color: var(--primary-hover-color);
            border-radius: 30px;
            font-size: 0.75rem;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            transition: all 0.4s ease;
            cursor: pointer;
            text-decoration: none;
            font-family: var(--secondary-font);
            position: relative;
            overflow: hidden;
            z-index: 1;
        }

        .pw-explore-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 0;
            height: 100%;
            background: var(--primary-hover-color);
            transition: width 0.4s ease;
            z-index: -1;
        }

        .pw-explore-btn:hover {
            color: var(--white-color);
            border-color: var(--primary-hover-color);
        }

        .pw-explore-btn:hover::before {
            width: 100%;
        }

        .pw-explore-btn .pw-arrow-icon {
            margin-left: 8px;
            transition: transform 0.3s ease;
        }

        .pw-explore-btn:hover .pw-arrow-icon {
            transform: translateX(3px);
        }

        /* Grid layout */
        .pw-row-cols-2 .col-6 {
            margin-bottom: 2rem;
            padding: 0 1rem;
        }

        /* Responsive adjustments */
        @media (max-width: 992px) {
            .pw-image-container {
                height: 260px;
            }
            
            .pw-text-container {
                padding: 1.25rem;
            }
            
            .pw-card-title {
                font-size: 1rem;
            }
            
            .pw-explore-btn {
                padding: 0.6rem 1.8rem;
                font-size: 0.65rem;
            }
        }

        @media (max-width: 768px) {
            .pw-price-under-section {
                padding: 3rem 1rem;
            }
            
            .pw-image-container {
                height: 220px;
            }

            .pw-section-title {
                margin-bottom: 1.2rem;
            }

            .pw-section-subtitle {
                font-size: 0.7rem;
                margin-bottom: 2.5rem;
            }
        }

        @media (max-width: 576px) {
            .pw-image-container {
                height: 180px;
            }
            
            .pw-card-title {
                font-size: 0.8rem;
                margin-bottom: 0.8rem;
            }
            
            .pw-explore-btn {
                padding: 0.5rem 1.5rem;
                font-size: 0.6rem;
                letter-spacing: 1px;
            }
            
            .pw-row-cols-2 .col-6 {
                padding: 0 0.75rem;
                margin-bottom: 1.5rem;
            }

            .pw-price-under-section {
                padding: 2.5rem 1rem;
            }
        }
    `;

    return (
        <>
            <style>{enhancedStyles}</style>
            <section className="pw-price-under-section">
                <div className="container">
                    <h2 className="pw-section-title">Budget Corner</h2>
                    <p className="pw-section-subtitle">Discover thoughtfully curated styles for every occasion and mood</p>
                    <div className="row pw-row-cols-2">
                        {budgetCategories.map((category, index) => (
                            <div
                                key={index}
                                className="col-6 col-md-6 col-lg-6"
                                data-aos="fade-up"
                                data-aos-delay={100 * index}
                            >
                                <div
                                    className="pw-price-card"
                                    onClick={() => handleCategoryNavigation(category.min, category.max)}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`Shop ${category.title} products`}
                                >
                                    <div className="pw-image-container">
                                        <img
                                            src={category.img}
                                            alt={category.alt}
                                            className="pw-card-image"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="pw-text-container">
                                        <h3 className="pw-card-title">{category.title}</h3>
                                        <button
                                            className="pw-explore-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCategoryNavigation(category.min, category.max);
                                            }}
                                            aria-label={`Explore ${category.title} collection`}
                                        >
                                            Explore
                                            <span className="pw-arrow-icon">→</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default PriceUnderSection;