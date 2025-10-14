import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useBudgetBanners } from '../../../hook/budgetBanner/useBudgetBanners';
import './PriceUnderSection.css'; // Import the external CSS file

const PriceUnderSection = () => {
  const { data: budgetBanners, isLoading, isError } = useBudgetBanners();
  const baseURL = "https://app.bmgjewellers.com";
  console.log(budgetBanners, 'budget')
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
          <div className="row row-cols-2 row-cols-lg-4 g-3">
            {budgetBanners.map((category, index) => (
              <div
                key={index}
                className="row pus-img-container"
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
                      src={category.image_path?.startsWith('/') ? `${baseURL}${category.image_path}` : category.image_path ? `${baseURL}/${category.image_path}` : category.image}
                      alt={category.alt || category.title}
                      className="pus-card-image"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null; // ✅ Prevents infinite loop
                        e.target.src = '/fallback-image.jpg'; // ✅ Use a local 

                      }}
                    />
                    <button
                      className="pus-category-btn"
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
  );
};

export default PriceUnderSection;