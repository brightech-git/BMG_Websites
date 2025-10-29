import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useBudgetBanners } from '../../../hook/budgetBanner/useBudgetBanners';
import './PriceUnderSection.css';

const PriceUnderSection = () => {
  const { data: budgetBanners, isLoading, isError } = useBudgetBanners();
  const baseURL = "https://app.bmgjewellers.com";
  const history = useHistory();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-out-cubic',
      once: true,
      mirror: false
    });
  }, []);

  const handleCategoryNavigation = (minPrice, maxPrice) => {
    const searchParams = new URLSearchParams();
    if (minPrice) searchParams.append('minGrandTotal', minPrice);
    if (maxPrice) searchParams.append('maxGrandTotal', maxPrice);
    const formattedQuery = searchParams.toString().replace(/\+/g, '%20');
    history.push(`/products-page?${formattedQuery}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Loading state
  if (isLoading) return (
    <section className="pus-budget-section">
      <div className="container">
        <div className="pus-loading">
          <div>Loading budget categories...</div>
        </div>
      </div>
    </section>
  );

  // Error state
  if (isError) return (
    <section className="pus-budget-section">
      <div className="container">
        <div className="pus-error">
          <div>Unable to load budget categories. Please try again later.</div>
        </div>
      </div>
    </section>
  );

  // No data state
  if (!Array.isArray(budgetBanners) || budgetBanners.length === 0) return (
    <section className="pus-budget-section">
      <div className="container">
        <div className="pus-error">
          <div>No budget categories available at the moment.</div>
        </div>
      </div>
    </section>
  );

  return (
    <section className="pus-budget-section">
      <div className="pus-container">
        <h2 className="pus-section-title">
          <span className="title-part-1">Explore by Budget</span>
        </h2>

        <p className="pus-section-subtitle">
          Discover curated collections tailored to your budget for every style and occasion
        </p>

        <div className="pus-card-container">
          <div className="pus-budget-cards-grid">
            {budgetBanners.map((category, index) => (
              <div
                key={category.id || index}
                className="pus-budget-card-wrapper"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div
                  className="pus-budget-card"
                  onClick={() => handleCategoryNavigation(category.min_price, category.max_price)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Shop ${category.title} products under ${formatPrice(category.max_price)}`}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleCategoryNavigation(category.min_price, category.max_price);
                    }
                  }}
                >
                  <div className="pus-image-container">
                    <img
                      src={
                        category.image_path?.startsWith('/')
                          ? `${baseURL}${category.image_path}`
                          : category.image_path
                            ? `${baseURL}/${category.image_path}`
                            : category.image || '/fallback-image.jpg'
                      }
                      alt={category.alt || `${category.title} jewelry collection`}
                      className="pus-card-image"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/fallback-image.jpg';
                      }}
                    />

                    {/* Content Overlay */}
                    <div className="pus-content-overlay">
                      <div className="pus-overlay-content">
                        <h3 className="pus-card-title">{category.title}</h3>
                        {/* {category.min_price && category.max_price && (
                          <div className="pus-card-price-range">
                            {formatPrice(category.min_price)} - {formatPrice(category.max_price)}
                          </div>
                        )} */}
                        <button
                          className="pus-category-btn"
                          aria-label={`Explore ${category.title} collection`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCategoryNavigation(category.min_price, category.max_price);
                          }}
                        >
                          Shop Now
                          <span className="pus-btn-arrow">→</span>
                        </button>
                      </div>
                    </div>

                    {/* Gradient Overlay */}
                    <div className="pus-gradient-overlay"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceUnderSection;