import React from 'react';
import { useHistory } from 'react-router-dom';
import img1 from './feature.jpg';
import img2 from './feature2.jpg';
import img3 from './feature3.jpg';
import img4 from './feature4.jpg';
import './FeaturedBanners.css';

const FeaturedBanners = () => {
  const history = useHistory();

  // Banner data with unique images
  const banners = [
    {
      id: 1,
      image: img1,
      title: 'Spring Collection',
      subtitle: 'New Arrivals',
      link: '/products-page?featured_products=true',
    },
    {
      id: 2,
      image: img2,
      title: 'Luxury Edition',
      subtitle: 'Premium Selection',
      link: '/products-page?featured_products=true',
    },
    {
      id: 3,
      image: img3,
      title: 'Minimalist Style',
      subtitle: 'Clean & Simple',
      link: '/products-page?featured_products=true',
    },
    {
      id: 4,
      image: img4,
      title: 'Vintage Finds',
      subtitle: 'Timeless Pieces',
      link: '/products-page?featured_products=true',
    },
  ];

  const handleBannerClick = (link) => {
    history.push(link);
  };

  return (
    <section className='fb-container'>
      <div className="fb-banner-container">
        <div className="container-fluid px-4">
          {/* Header Section */}
          <div className="row align-items-center justify-content-between mb-4">
            <div className="col-auto">
              <h2 className="fb-main-title">Curated Just for You</h2>
            </div>
            <div className="col-auto">
              <button
                className="fb-explore-btn btn"
                onClick={() => handleBannerClick('/products-page?featured_products=true')}
              >
                Explore All
                <span className="fb-btn-arrow ms-1">→</span>
              </button>
            </div>
          </div>

          {/* Banner Grid */}
          <div className="row g-4">
            {/* Left Column - Large Featured Banner */}
            <div className="col-lg-6">
              <div
                className="fb-banner-item fb-featured-banner"
                onClick={() => handleBannerClick(banners[0].link)}
              >
                <div className="position-relative w-100 h-100 overflow-hidden">
                  <img
                    src={banners[0].image}
                    alt={banners[0].title}
                    className="fb-banner-image"
                    loading="lazy"
                  />
                  <div className="fb-overlay"></div>
                </div>
                <div className="fb-banner-content">
                  <h3 className="fb-title">{banners[0].title}</h3>
                  <button className="fb-cta-btn btn">
                    View
                    <span className="fb-btn-arrow ms-1">→</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Three Smaller Banners */}
            <div className="col-lg-6">
              {/* Top Row - Two Small Banners */}
              <div className="row g-3 mb-3">
                {banners.slice(1, 3).map((banner) => (
                  <div className="col-6" key={banner.id}>
                    <div
                      className="fb-banner-item fb-small-banner"
                      onClick={() => handleBannerClick(banner.link)}
                    >
                      <div className="position-relative w-100 h-100 overflow-hidden">
                        <img
                          src={banner.image}
                          alt={banner.title}
                          className="fb-banner-image"
                          loading="lazy"
                        />
                        <div className="fb-overlay"></div>
                      </div>
                      <div className="fb-banner-content">
                        <h3 className="fb-title">{banner.title}</h3>
                        <button className="fb-cta-btn btn">
                          View
                          <span className="fb-btn-arrow ms-1">→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Row - One Large Banner */}
              <div className="row">
                <div className="col-12">
                  <div
                    className="fb-banner-item fb-bottom-banner"
                    onClick={() => handleBannerClick(banners[3].link)}
                  >
                    <div className="position-relative w-100 h-100 overflow-hidden">
                      <img
                        src={banners[3].image}
                        alt={banners[3].title}
                        className="fb-banner-image"
                        loading="lazy"
                      />
                      <div className="fb-overlay"></div>
                    </div>
                    <div className="fb-banner-content">
                      <h3 className="fb-title">{banners[3].title}</h3>
                      <button className="fb-cta-btn btn">
                        View
                        <span className="fb-btn-arrow ms-1">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBanners;