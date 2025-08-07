import React from 'react';
import { useHistory } from 'react-router-dom';
import img1 from './feature.jpg';
import img2 from './feature2.jpg';
import img3 from './feature3.jpg';
import img4 from './feature4.jpg';

const FeaturedBanners = () => {
    const history = useHistory();

    // Banner data with unique images
    const banners = [
        {
            id: 1,
            image: img1,
            title: 'Spring Collection',
            subtitle: 'New Arrivals',
            link: '/shop-left?featured_products=true',
        },
        {
            id: 2,
            image: img2,
            title: 'Luxury Edition',
            subtitle: 'Premium Selection',
            link: '/shop-left?featured_products=true',
        },
        {
            id: 3,
            image: img3,
            title: 'Minimalist Style',
            subtitle: 'Clean & Simple',
            link: '/shop-left?featured_products=true',
        },
        {
            id: 4,
            image: img4,
            title: 'Vintage Finds',
            subtitle: 'Timeless Pieces',
            link: '/shop-left?featured_products=true',
        },
    ];

    const handleBannerClick = (link) => {
        history.push(link);
    };

    return (
        <>
            <style>
                {`
                 @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap');
          .fb-banner-container {
            font-family: 'Montserrat', sans-serif;
            background-color: #f6f5f0;
            max-width: 1440px;
            margin: 0 auto;
            padding: 2rem 0;
          }
          .fb-main-title {
  font-family: 'Dancing Script';
   font-size: clamp(2.5rem, 4vw,3rem);
  font-weight: bolder;
  position: relative;
  padding-bottom: 0.5rem;

 background: linear-gradient(to right, #cd865c, #a05ccdff);

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}

          .fb-main-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 2px;
  background: linear-gradient(to right, #ff6a00, #ee0979);

}

          .fb-explore-btn {
            padding: 10px 20px;
            font-size: 14px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #ffffff;
            background-color: #cd865c;
            border: 1px solid #cd865c;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            z-index: 1;
          }
          .fb-explore-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 0;
            height: 100%;
            background-color: #ffffff;
            transition: width 0.3s ease;
            z-index: -1;
          }
          .fb-explore-btn:hover::before {
            width: 100%;
          }
          .fb-explore-btn:hover {
            color: #cd865c;
          }
          .fb-banner-item {
            position: relative;
            cursor: pointer;
            overflow: hidden;
            background-color: #edebe7;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .fb-banner-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }
          .fb-banner-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
          }
          .fb-banner-item:hover .fb-banner-image {
            transform: scale(1.05);
          }
          .fb-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 100%);
          }
          .fb-banner-content {
            position: absolute;
            bottom: 1rem;
            left: 1rem;
            color: #333333;
            z-index: 2;
            max-width: 80%;
          }
          .fb-subtitle {
            font-size: clamp(0.8rem, 1.5vw, 1.1rem);
            text-transform: uppercase;
            margin-bottom: 0.5rem;
            color: #333333;
            opacity: 0.9;
            
          }
          .fb-title {
            font-size: clamp(1rem, 2vw, 1.5rem);
            font-weight: 500;
            margin-bottom: 1rem;
            line-height: 1.2;
             background: linear-gradient(to right, #8f520cff, #d44107ff);

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
            font-family:'Dancing Script';
          }
          .fb-cta-btn {
            padding: 8px 16px;
            font-size: 13px;
            font-weight: 500;
            text-transform: uppercase;
            color: #333333;
            background-color: rgba(255, 255, 255, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.4);
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
          }
          .fb-cta-btn:hover {
            background-color: rgba(255, 255, 255, 0.9);
            border-color: rgba(255, 255, 255, 0.9);
          }
          .fb-btn-arrow {
            transition: transform 0.3s ease;
          }
          .fb-cta-btn:hover .fb-btn-arrow,
          .fb-explore-btn:hover .fb-btn-arrow {
            transform: translateX(5px);
          }
          .fb-featured-banner {
            height: 500px;
          }
          .fb-small-banner {
            height: 220px;
          }
          .fb-bottom-banner {
            height: 260px;
          }
          @media (max-width: 768px) {
            .fb-banner-content {
              bottom: 0.5rem;
              left: 0.5rem;
            }
            .fb-subtitle {
              font-size: 0.75rem;
            }
            .fb-title {
              font-size: 0.8rem;
            }
            .fb-cta-btn {
              padding: 6px 12px;
              font-size: 12px;
            }
            .fb-small-banner {
              height: 160px;
            }
            .fb-featured-banner {
              height: 300px;
            }
            .fb-bottom-banner {
              height: 200px;
            }
          }
          @media (max-width: 576px) {
            .fb-banner-container {
              padding: 1rem 0;
            }
            .fb-small-banner,
            .fb-featured-banner,
            .fb-bottom-banner {
              height: 150px;
              margin-bottom: 0.5rem;
            }
            .fb-main-title {
              font-size: 1.2rem;
            }
            .fb-explore-btn {
              font-size: 12px;
              padding: 8px 16px;
            }
          }
        `}
            </style>
            <section className="fb-banner-container">
                <div className="container-fluid px-4">
                    {/* Header Section */}
                    <div className="row align-items-center justify-content-between mb-4">
                        <div className="col-auto">
                                    <h2 className="fb-main-title">Curated Just for You</h2>
                        </div>
                        <div className="col-auto">
                            <button
                                className="fb-explore-btn btn"
                                onClick={() => handleBannerClick('/shop-left?featured_products=true')}
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
                                    {/* <span className="fb-subtitle">{banners[0].subtitle}</span> */}
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
                                                {/* <span className="fb-subtitle">{banner.subtitle}</span> */}
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
                                            {/* <span className="fb-subtitle">{banners[3].subtitle}</span> */}
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
            </section>
        </>
    );
};

export default FeaturedBanners;