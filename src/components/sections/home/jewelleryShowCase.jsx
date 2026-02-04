import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './JewelleryShowCAse.css';
import { FiArrowRight, FiShield, FiTruck, FiRefreshCw, FiAward } from 'react-icons/fi';
import { useBestDesignedBanners } from '../../../hook/BestDesignedBanner/useBestDesignedbanner';
import { getProductImages } from '../../../utils/getProductImages';

const JewelryShowcase = ({banners , isLoading ,isError}) => {

    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const bannerContainerRef = useRef(null);

    // const [banners ,setBanners] = useState()
    // const {data , isLoading , isError} = useBestDesignedBanners();

    // useEffect(()=>{
    //     if(data){
    //         setBanners(data)
    //     }
    // },[])
    console.log(banners ,'banner for data ')
    const bannerImages = banners?.flatMap((b) => getProductImages(b.Image)) || [];

    bannerImages.map((img) => console.log(img, "imagesss"));
    console.log(bannerImages, "latestbanner");


    bannerImages.map((img)=>console.log(img,'imagesss'))
   
    console.log(bannerImages ,'latestbanner')

    // Handle mouse movement for parallax effect
    const handleMouseMove = (e) => {
        if (bannerContainerRef.current) {
            const rect = bannerContainerRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            setMousePosition({ x, y });
        }
    };

    // Reset mouse position when leaving container
    const handleMouseLeave = () => {
        setMousePosition({ x: 0.5, y: 0.5 });
    };

    useEffect(() => {
        AOS.init({
            duration: 1000,
            easing: 'ease-out',
            once: true,
            mirror: false
        });

        const timer = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % bannerImages.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [bannerImages.length]);

    const handleSeeAll = () => {
        const queryParams =new URLSearchParams();
        queryParams.append('itemCtrName', 'BEST_DESIGNED');
        navigate(`/products-page?${queryParams.toString()}`);
    }

    if(isLoading) return <p>Loading Banner</p>
    if(isError) return <p>Error to get Banner</p>
    return (
        <section className="jewelry-showcase" data-aos="fade-up">
            <div className="bestdesign-container py-2">
                <div className="bs-row  ">
                    <div className="col-lg-6 mb-1 mb-lg-0 ">
                        <div
                            className="jewelry-banner-container position-relative"
                            ref={bannerContainerRef}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className="shimmer-overlay"></div>
                            <div className="jewelry-banner-wrapper">
                                {bannerImages.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`Jewelry Banner ${index + 1}`}
                                        className={`jewelry-banner-img ${index === currentImageIndex ? 'active' : ''}`}
                                        style={{
                                            transform: index === currentImageIndex
                                                ? `scale(1.05) translate(${(mousePosition.x - 0.5) * 15}px, ${(mousePosition.y - 0.5) * 15}px)`
                                                : 'none',
                                            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 1s ease-in-out'
                                        }}
                                    />
                                ))}
                            </div>
                            {/* <div className="carousel-overlay-best" onClick={handleSeeAll}>
                                <div className="view-collection-best">
                                    <span>View Collection</span>
                                    <FiArrowRight className="arrow-icon" />
                                </div>
                            </div> */}


                        </div>
                    </div>
                    <div className="col-lg-6 ps-lg-5">
                        <div className="jewelry-content">
                            <h2 className="jewelry-title mb-2">
                                <span className="gradient-text">Our Best Designed Jewels</span> 
                            </h2>
                            <p className="jewelry-desc mb-4">
                                Discover exquisite craftsmanship with our handcrafted jewelry, blending tradition and modernity. Each piece is meticulously designed to reflect elegance and timeless beauty.
                            </p>

                            <div className="feature-highlights mb-4">
                                <div className="feature-item">
                                    <FiShield className="feature-icon" />
                                    <span>Lifetime Warranty</span>
                                </div>
                                <div className="feature-item">
                                    <FiAward className="feature-icon" />
                                    <span>Artisan Crafted</span>
                                </div>
                                <div className="feature-item">
                                    <FiTruck className="feature-icon" />
                                    <span>Free Shipping</span>
                                </div>
                                <div className="feature-item">
                                    <FiRefreshCw className="feature-icon" />
                                    <span>30-Day Returns</span>
                                </div>
                            </div>

                            <button
                                className="btn-main main-filled"
                                onClick={handleSeeAll}
                                aria-label="Shop Now for best designed jewels"
                            >
                                <span >Shop Now</span>

                                <div className="hover-effect"></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default JewelryShowcase;