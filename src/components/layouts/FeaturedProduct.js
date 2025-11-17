import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import img1 from './feature.jpg';
import img2 from './feature2.jpg';
import img3 from './feature3.jpg';
import img4 from './feature4.jpg';
import './FeaturedBanners.css';
import { getProductImages } from '../../utils/getProductImages';
import { useFeaturedBanner } from '../../hook/featuredBanner/useFeaturedBanner';

const FeaturedBanners = () => {
  const history = useHistory();
  const [banner, setBanner] =useState();


   const { data ,isLoading ,isError } = useFeaturedBanner();

  useEffect(() => {
    if (data) {
      setBanner(data);
    }
  }, [data]);

  // Banner data with unique images
  const banners =banner ||  [];
  console.log(banner ,'featured');
  console.log(banners, 'featured');

  const handleBannerClick = (link) => {
    history.push(link);
  };
  if (isLoading) return <p>Loading Banner</p>;
  if (isError) return <p>Loading Banner Error</p>;
  if (!banners?.length) return <p>No banners available</p>;
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
                className="feature-explore-btn btn"
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
                onClick={() => handleBannerClick('/products-page?featured_products=true')}
              >
                <div className="position-relative w-100 h-100 overflow-hidden">
                  <img
                    src={getProductImages(banners[0].Image)}
                    alt={banners[0].Name}
                    className="fb-banner-image"
                    loading="lazy"
                  />
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
                      onClick={() => handleBannerClick('/products-page?featured_products=true')}
                    >
                      <div className="position-relative w-100 h-100 overflow-hidden">
                        <img
                          src={getProductImages(banner.Image)}
                          alt={banner.title}
                          className="fb-banner-image"
                          loading="lazy"
                        />
                     
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="row">
                <div className="col-12">
                  <div
                    className="fb-banner-item fb-bottom-banner"
                    onClick={() => handleBannerClick('/products-page?featured_products=true')}
                  >
                    <div className="position-relative w-100 h-100 overflow-hidden">
                      <img
                        src={getProductImages(banners[3].Image)}
                        alt={banners[3].Name}
                        className="fb-banner-image"
                        loading="lazy"
                      />
                     
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