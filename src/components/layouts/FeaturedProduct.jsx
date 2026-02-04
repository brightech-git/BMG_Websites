import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FeaturedBanners.css';
import { getProductImages } from '../../utils/getProductImages';


const FeaturedBanners = ({banners ,isLoading ,isError}) => {
  const navigate = useNavigate();
 

  

  const handleBannerClick = () => {

    const queryParams = new URLSearchParams();
    const itemCtrName = "FEATURED";
    queryParams.append("itemCtrName", itemCtrName);
    navigate(`products-page?${queryParams.toString()}`);
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
        
          </div>

          {/* Banner Grid */}
          <div className="row g-4">
            {/* Left Column - Large Featured Banner */}
            <div className="main-banner col-lg-6">
              <div
                className="fb-banner-item fb-featured-banner"
                onClick={() => handleBannerClick()}
              >
                <div className="position-relative w-100 h-100 overflow-hidden">
                  {banners[0] && (
                    <img
                      src={getProductImages(banners[0]?.Image)}
                      alt={banners[0]?.Name}
                      className="fb-banner-image"
                      loading="lazy"
                    />
                  )}

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
                      onClick={() => handleBannerClick()}
                    >
                      <div className="position-relative w-100 h-100 overflow-hidden">
                        <img
                          src={getProductImages(banner?.Image)}
                          alt={banner?.title}
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
                    onClick={() => handleBannerClick()}
                  >
                    <div className="position-relative w-100 h-100 overflow-hidden">
                      {banners[3] && (
                        <img
                          src={getProductImages(banners[3]?.Image)}
                          alt={banners[3]?.Name}
                          className="fb-banner-image"
                          loading="lazy"
                        />
                      )}

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