import React from 'react';
import { useHistory } from 'react-router-dom';
import img1 from '../../assets/img/banner/Tritiya_Slider_1.webp';
import img2 from '../../assets/img/banner/Tritiya_Slider_3.webp';
import img3 from '../../assets/img/banner/Tritiya_Slider_2.webp';
import img4 from '../../assets/img/banner/Tritiya_Slider_3.webp';
const FeaturedBanners = () => {
    const history = useHistory();

    // Local banner images data
    const banners = [
        {
            id: 1,
            image: img1,
            title: "Spring Collection",
            subtitle: "New Arrivals",
            link: "/shop-left?featured_products=true"
        },
        {
            id: 2,
            image: img2,
            title: "Luxury Edition",
            subtitle: "Premium Selection",
            link: "/shop-left?featured_products=true"
        },
        {
            id: 3,
            image: img3,
            title: "Minimalist Style",
            subtitle: "Clean & Simple",
            link: "/shop-left?featured_products=true"
        },
        {
            id: 4,
            image: img4,
            title: "Vintage Finds",
            subtitle: "Timeless Pieces",
            link: "/shop-left?featured_products=true"
        }
    ];

    const handleBannerClick = (link) => {
        history.push(link);
    };

    const styles = {
        bannerShowcase: {
            padding: '0',
            backgroundColor: '#f6f5f0',
            fontFamily: "'Montserrat', sans-serif",
            width: '1440px',
            margin: '0 auto',
        },
        sectionHeader: {
            marginBottom: '2rem'
        },
        mainTitle: {
            fontSize: 'clamp(1.2rem, 3vw, 1.7rem)',
            fontWeight: '400',
            color: '#404040',
            fontFamily: "'Gloock', serif",
            position: 'relative',
            paddingBottom: '1rem',
            marginBottom: '0'
        },

        exploreBtn: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '400',
            textTransform: 'capitalize',
            letterSpacing: '1px',
            color: '#ffffff',
            backgroundColor: '#cd865c',
            border: '1px solid #cd865c',
            borderRadius: '0',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            zIndex: '1',
            cursor: 'pointer'
        },
        bannerItem: {
            position: 'relative',
            cursor: 'pointer',
            overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            backgroundColor: '#edebe7',
            borderRadius: '0',
            marginBottom: '1.5rem'
        },
        featuredBanner: {
            height: '500px'
        },
        smallBanner: {
            height: '200px'
        },
        bottomBanner: {
            height: '260px'
        },
        imageContainer: {
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden'
        },
        bannerImage: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
        },
        overlay: {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            // background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)'
        },
        content: {
            position: 'absolute',
            bottom: '0rem',
            left: '0rem',
            color: '#404040',
            zIndex: '2',
            maxWidth: '80%'
        },
        subtitle: {
            display: 'block',
            fontSize: 'clamp(0.7rem, 1.5vw, 1.2rem)',
            textTransform: 'capitalize',
            marginBottom: '0.5rem',
            color: '#404040',
            opacity: '0.9'
        },
        title: {

            fontWeight: '500',
            marginBottom: '1rem',
            lineHeight: '1.2',
            color: '#404040'
        },
        ctaBtn: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '5px 10px',
            fontSize: '12px',
            fontWeight: '400',
            textTransform: 'capitalize',
            color: '#404040',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '0',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            cursor: 'pointer'
        }
    };

    // Custom CSS for hover effects and responsive behavior
    const customCSS = `
      
      
      
        .explore-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 0;
            height: 100%;
            background-color: #f6f5f0fff;
            transition: width 0.3s ease;
            z-index: -1;
        }
        
        .explore-btn:hover {
            color: #cd865c !important;
        }
        
        .explore-btn:hover::before {
            width: 100%;
        }
        
        .cta-btn:hover {
            background-color: rgba(255, 255, 255, 0.9);
            color: #404040;
            border-color: rgba(255, 255, 255, 0.9);
        }
        
        .btn-arrow {
            transition: transform 0.3s ease;
        }
        
        .explore-btn:hover .btn-arrow,
        .cta-btn:hover .btn-arrow {
            transform: translateX(5px);
        }
        
        @media (max-width: 768px) {
            .banner-content {
                bottom: 0rem !important;
                left: 0.5rem !important;
            }
             subtitle{
             font-size:0.5rem !important;
                }
            
            .small-banner {
                height: 160px !important;
            }
            
            .featured-banner {
                height: 180px !important;
            }
            
            .bottom-banner {
                height: 250px !important;
            }
                .ctaBtn{
                padding:5px 10px;
                }
        }
        
        @media (max-width: 576px) {
            .banner-showcase {
                padding: 2rem 0 !important;
            }
            
            .small-banner,
            .featured-banner,
            .bottom-banner {
                height: 150px !important;
                margin-bottom: 0.5rem !important;
            }
        }
    `;

    return (
        <>
            <style>{customCSS}</style>
            <section style={styles.bannerShowcase} className="banner-showcase">
                <div className="container-fluid px-4">
                    {/* Header Section */}
                    <div className="row align-items-center justify-content-between" style={styles.sectionHeader}>
                        <div className="col-auto">
                            <h2 style={styles.mainTitle} className="position-relative">
                                Our Featured Collections
                                <div style={styles.titleUnderline}></div>
                            </h2>
                        </div>
                        <div className="col-auto">
                            <button
                                style={styles.exploreBtn}
                                className="explore-btn"
                                onClick={() => handleBannerClick('/shop-left?featured_products=true')}
                            >
                                Explore All
                                <span className="btn-arrow">→</span>
                            </button>
                        </div>
                    </div>

                    {/* Banner Grid */}
                    <div className="row g-4">
                        {/* Left Column - Large Featured Banner */}
                        <div className="col-lg-6">
                            <div
                                style={{ ...styles.bannerItem, ...styles.featuredBanner }}
                                className="banner-item featured-banner"
                                onClick={() => handleBannerClick(banners[0].link)}
                            >
                                <div style={styles.imageContainer}>
                                    <img
                                        src={banners[0].image}
                                        alt={banners[0].title}
                                        style={styles.bannerImage}
                                        className="banner-image"
                                        loading="lazy"
                                    />
                                    <div style={styles.overlay}></div>
                                </div>
                                <div style={styles.content} className="banner-content">
                                    <span style={styles.subtitle}>{banners[0].subtitle}</span>
                                    {/* <h3 style={styles.title}>{banners[0].title}</h3> */}
                                    <button style={styles.ctaBtn} className="cta-btn">
                                        View
                                        <span className="btn-arrow">→</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Three Smaller Banners */}
                        <div className="col-lg-6">
                            {/* Top Row - Two Small Banners */}
                            <div className="row g-3 mb-3">
                                <div className="col-6">
                                    <div
                                        style={{ ...styles.bannerItem, ...styles.smallBanner }}
                                        className="banner-item small-banner"
                                        onClick={() => handleBannerClick(banners[1].link)}
                                    >
                                        <div style={styles.imageContainer}>
                                            <img
                                                src={banners[1].image}
                                                alt={banners[1].title}
                                                style={styles.bannerImage}
                                                className="banner-image"
                                                loading="lazy"
                                            />
                                            <div style={styles.overlay}></div>
                                        </div>
                                        <div style={styles.content} className="banner-content">
                                            <span style={styles.subtitle}>{banners[1].subtitle}</span>
                                            {/* <h3 style={styles.title}>{banners[1].title}</h3> */}
                                            <button style={styles.ctaBtn} className="cta-btn">
                                                View
                                                <span className="btn-arrow">→</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div
                                        style={{ ...styles.bannerItem, ...styles.smallBanner }}
                                        className="banner-item small-banner"
                                        onClick={() => handleBannerClick(banners[2].link)}
                                    >
                                        <div style={styles.imageContainer}>
                                            <img
                                                src={banners[2].image}
                                                alt={banners[2].title}
                                                style={styles.bannerImage}
                                                className="banner-image"
                                                loading="lazy"
                                            />
                                            <div style={styles.overlay}></div>
                                        </div>
                                        <div style={styles.content} className="banner-content">
                                            <span style={styles.subtitle}>{banners[2].subtitle}</span>
                                            {/* <h3 style={styles.title}>{banners[2].title}</h3> */}
                                            <button style={styles.ctaBtn} className="cta-btn">
                                                View
                                                <span className="btn-arrow">→</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Row - One Large Banner */}
                            <div className="row">
                                <div className="col-12">
                                    <div
                                        style={{ ...styles.bannerItem, ...styles.bottomBanner }}
                                        className="banner-item bottom-banner"
                                        onClick={() => handleBannerClick(banners[3].link)}
                                    >
                                        <div style={styles.imageContainer}>
                                            <img
                                                src={banners[3].image}
                                                alt={banners[3].title}
                                                style={styles.bannerImage}
                                                className="banner-image"
                                                loading="lazy"
                                            />
                                            <div style={styles.overlay}></div>
                                        </div>
                                        <div style={styles.content} className="banner-content">
                                            <span style={styles.subtitle}>{banners[3].subtitle}</span>
                                            {/* <h3 style={styles.title}>{banners[3].title}</h3> */}
                                            <button style={styles.ctaBtn} className="cta-btn">
                                                View
                                                <span className="btn-arrow">→</span>
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