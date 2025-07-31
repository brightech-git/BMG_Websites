import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import AOS from 'aos';
import 'aos/dist/aos.css';

const PriceUnderSection = () => {
    const history = useHistory();

    useEffect(() => {
        AOS.init({
            duration: 1000,
            easing: 'ease-out',
            once: true,
        });
    }, []);

    const budgetCategories = [
        {
            img: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop',
            title: 'Under 999',
            subtext: 'Casual Comfort',
            alt: 'Everyday wear collection',
            min: 0,
            max: 999,
            isPremium: false,
        },
        {
            img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop',
            title: 'Under 1999',
            subtext: 'Glamorous Outfits',
            alt: 'Party wear collection',
            min: 1000,
            max: 1999,
            isPremium: true,
        },
        {
            img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
            title: 'Under 2999',
            subtext: 'Relaxed Styles',
            alt: 'Casual comfort collection',
            min: 2000,
            max: 2999,
            isPremium: false,
        },
        {
            img: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop',
            title: 'Above 2999',
            subtext: 'Premium Charm',
            alt: 'Glamorous outfits collection',
            min: 3000,
            max: 10000000,
            isPremium: false,
        },
    ];

    const handleCategoryNavigation = (minPrice, maxPrice) => {
        const searchParams = new URLSearchParams();
        if (minPrice) searchParams.append('minGrandTotal', minPrice);
        if (maxPrice) searchParams.append('maxGrandTotal', maxPrice);
        const formattedQuery = searchParams.toString().replace(/\+/g, '%20');
        history.push(`/shop-left?${formattedQuery}`);
    };

    return (
        <>
            <style>
                {`
          :root {
            --primary-font: 'Gloock', serif;
            --secondary-font: 'Montserrat', sans-serif;
            --primary-text-color: #333333;
            --primary-hover-color: #cd865c;
            --secondary-bg-color: #ffcccc;
            --grey-color: #666666;
            --white-color: #ffffff;
            --primary-card-bg: #edebe7;
          }

          .pus-budget-section {
            font-family: var(--secondary-font);
            padding: 4rem 1rem;
            max-width: 1400px;
            margin: 0 auto;
            background-color: var(--primary-card-bg);
            border-radius: 20px;
            padding: 4rem 2rem;
          }

          .pus-card-container {
            padding: 0;
          }

          .pus-section-title {
            font-family: var(--primary-font);
            font-size: clamp(1.6rem, 3.5vw, 2.2rem);
            font-weight: 400;
            color: var(--primary-text-color);
            text-align: center;
            margin-bottom: 1rem;
            letter-spacing: 0.5px;
            position: relative;
          }

          .pus-section-title::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 3px;
            background: var(--primary-hover-color);
          }

          .pus-section-subtitle {
            font-size: clamp(0.9rem, 1.5vw, 1rem);
            color: var(--grey-color);
            text-align: center;
            margin-bottom: 3rem;
            font-weight: 400;
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
            font-family: var(--secondary-font);
            line-height: 1.7;
          }

          .pus-budget-card {
            background: transparent;
            border-radius: 25px;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            height: 400px;
            width: 90%;
            display: flex;
            flex-direction: column;
          }

          .pus-budget-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
          }

          .pus-image-container {
            height: 100%;
            overflow: hidden;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--primary-card-bg);
          }

          .pus-card-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .pus-budget-card:hover .pus-card-image {
            transform: scale(1.05);
          }

          .pus-text-container {
            padding: 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            background: transparent;
            flex-grow: 1;
            justify-content: space-between;
          }

          .pus-card-title {
            font-size: clamp(0.9rem, 1.8vw, 1.1rem);
            font-weight: 600;
            color: var(--primary-text-color);
            margin: 0 0 0.3rem 0;
            letter-spacing: 0.2px;
            text-transform: uppercase;
            font-family: var(--secondary-font);
          }

          .pus-card-subtext {
            font-size: clamp(0.7rem, 1.2vw, 0.8rem);
            color: var(--grey-color);
            margin-bottom: 0.5rem;
            font-family: var(--secondary-font);
          }

          .pus-category-btn {
            position: absolute;
            bottom: 15px;
            left: 50%;
            transform: translateX(-50%);
            display: inline-flex;
            align-items: center;
            padding: 0.6rem 1.8rem;
            background: linear-gradient(90deg, #ffe3ccff, #ffcf99ff);
            color: var(--primary-text-color);
            border: none;
            border-radius: 25px;
            font-size: clamp(0.8rem, 1.1vw, 0.9rem);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            transition: all 0.3s ease;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
            z-index: 3;
            cursor: pointer;
          }

          .pus-category-btn:hover {
            background: linear-gradient(90deg, #ffca99ff, #ffb866ff);
            color: var(--white-color);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
          }

          .pus-category-btn .pus-btn-arrow {
            margin-left: 6px;
            transition: transform 0.3s ease;
            font-size: 0.9em;
          }

          .pus-category-btn:hover .pus-btn-arrow {
            transform: translateX(4px);
          }

          .pus-explore-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.6rem 1.8rem;
            background: transparent;
            border: 1px solid var(--primary-hover-color);
            color: var(--primary-hover-color);
            border-radius: 30px;
            font-size: clamp(0.7rem, 1vw, 0.8rem);
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.4s ease;
            cursor: pointer;
            font-family: var(--secondary-font);
            position: relative;
            overflow: hidden;
            z-index: 1;
          }

          .pus-explore-btn::before {
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

          .pus-explore-btn:hover {
            color: var(--white-color);
            border-color: var(--primary-hover-color);
          }

          .pus-explore-btn:hover::before {
            width: 100%;
          }

          .pus-explore-btn .pus-arrow-icon {
            margin-left: 6px;
            transition: transform 0.3s ease;
          }

          .pus-explore-btn:hover .pus-arrow-icon {
            transform: translateX(4px);
          }

          .pus-row-cols-2 .col {
            margin-bottom: 1.5rem;
            padding: 0 0.5rem;
          }

          @media (max-width: 992px) {
            .pus-image-container {
              height: 100%;
            }
            .pus-budget-card {
              height: 280px;
            }
            .pus-card-title {
              font-size: 0.9rem;
            }
            .pus-explore-btn {
              padding: 0.5rem 1.5rem;
              font-size: 0.7rem;
            }
            .pus-category-btn {
              padding: 0.5rem 1.5rem;
              font-size: 0.75rem;
            }
          }

          @media (max-width: 768px) {
            .pus-budget-section {
              padding: 3rem 1rem;
            }
            .pus-image-container {
              height: 100%;
            }
            .pus-budget-card {
              height: 260px;
            }
            .pus-section-title {
              font-size: 1.4rem;
              margin-bottom: 0.8rem;
            }
            .pus-section-subtitle {
              font-size: 0.85rem;
              margin-bottom: 2rem;
            }
            .pus-category-btn {
              bottom: 12px;
              padding: 0.4rem 1.2rem;
              font-size: 0.7rem;
            }
          }

          @media (max-width: 576px) {
            .pus-budget-section {
              padding: 2rem 0.5rem;
            }
            .pus-image-container {
              height: 100%;
            }
            .pus-budget-card {
              height: 240px;
            }
            .pus-card-title {
              font-size: 0.85rem;
            }
            .pus-card-subtext {
              font-size: 0.7rem;
            }
            .pus-explore-btn {
              padding: 0.4rem 1.2rem;
              font-size: 0.65rem;
            }
            .pus-category-btn {
              bottom: 10px;
              padding: 0.3rem 1rem;
              font-size: 0.65rem;
            }
            .pus-row-cols-2 .col {
              padding: 0 0.3rem;
            }
          }
        `}
            </style>
            <section className="pus-budget-section">
                <div className="container">
                    <h2 className="pus-section-title">Explore by Budget</h2>
                    <p className="pus-section-subtitle">
                        Discover curated collections tailored to your budget for every style and occasion
                    </p>
                    <div className="pus-card-container">
                        <div className="row row-cols-2 pus-row-cols-2">
                            {budgetCategories.map((category, index) => (
                                <div
                                    key={index}
                                    className="col"
                                    data-aos="fade-up"
                                    data-aos-delay={150 * index}
                                >
                                    <div
                                        className="pus-budget-card"
                                        onClick={() => handleCategoryNavigation(category.min, category.max)}
                                        role="button"
                                        tabIndex={0}
                                        aria-label={`Shop ${category.title} products`}
                                    >
                                        <div className="pus-image-container">
                                            <img
                                                src={category.img}
                                                alt={category.alt}
                                                className="pus-card-image"
                                                loading="lazy"
                                            />
                                            <button
                                                className="pus-category-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCategoryNavigation(category.min, category.max);
                                                }}
                                                aria-label={`Explore ${category.title} collection`}
                                            >
                                                {category.title}
                                                <span className="pus-btn-arrow">›</span>
                                            </button>
                                        </div>
                                       
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default PriceUnderSection;