import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useBudgetBanners } from '../../../hook/budgetBanner/useBudgetBanners';

const PriceUnderSection = () => {
  const { data: budgetBanners, isLoading, isError } = useBudgetBanners();
  const baseURL = "https://app.bmgjewellers.com";
  console.log(budgetBanners,'budget')
  const history = useHistory();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-out',
      once: true,
    });
  }, []);

  const handleCategoryNavigation = (minPrice, maxPrice) => {
    const searchParams = new URLSearchParams();
    if (minPrice) searchParams.append('minGrandTotal', minPrice);
    if (maxPrice) searchParams.append('maxGrandTotal', maxPrice);
    const formattedQuery = searchParams.toString().replace(/\+/g, '%20');
    history.push(`/shop-left?${formattedQuery}`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;
  if (!Array.isArray(budgetBanners)) return <div>No data available</div>;

  return (
    <>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap');
        
          :root {
            --primary-font: 'Gloock', serif;
            --secondary-font: 'Montserrat', sans-serif;
            --primary-text-color: #333333;
            --primary-hover-color: #cd865c;
            --secondary-bg-color: #ffcccc;
            --grey-color: #666666;
            --white-color: #ffffff;
            --primary-card-bg: #edebe7;
            --gradient-text: linear-gradient(90deg, #cd865c, #a05f3a);
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
            font-family:'Dancing Script' ;
            font-size: clamp(1.6rem, 4vw, 2.5rem);
            font-weight: 900;
            text-align: center;
            margin-bottom: 1rem;
            letter-spacing: 0.5px;
            position: relative;
            display: flex;
            justify-content: center;
            gap: 0.3rem;
            flex-wrap: wrap;
          }

          .pus-section-title .title-part-1 {
            background: var(--gradient-text);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }

          .pus-section-title .title-part-2 {
            color: #404040;
            font-weight: 500;
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
            height: 350px;
            width: 92%;
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
          <h2 className="pus-section-title">
            <span className="title-part-1">Explore by</span>
            <span className="title-part-2"> Budget</span>
          </h2>

          <p className="pus-section-subtitle">
            Discover curated collections tailored to your budget for every style and occasion
          </p>
          <div className="pus-card-container">
            <div className="row row-cols-2 pus-row-cols-2">
              {budgetBanners.map((category, index) => (
                <div
                  key={index}
                  className="col"
                  data-aos="fade-up"
                  data-aos-delay={150 * index}
                >
                  <div
                    className="pus-budget-card"
                    onClick={() => handleCategoryNavigation(category.min_price, category.max_price)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Shop ${category.title} products`}
                  >
                    <div className="pus-image-container">
                     
                      <img
                        src={category.image_path?.startsWith('/') ? `${baseURL}${category.image_path}`: category.image_path? `${baseURL}/${category.image_path}`: category.image}
                        alt={category.alt || category.title}
                        className="pus-card-image"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Available';
                        }}
                      />
                      <button
                        className="pus-category-btn"
                        onClick={() => handleCategoryNavigation(category.min_price, category.max_price)}
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