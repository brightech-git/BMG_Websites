import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
import useFilterProducts from '../../../hook/product/useFilterProducts';
import './handpicked.css';
import { getProductImages } from '../../../utils/getProductImages';


// ------------------------------
// PRODUCT CARD
// ------------------------------
const NoBlurProductCard = ({ product }) => {
    const baseUrl = "https://app.bmgjewellers.com";

    const handleProductClick = (e, sno) => {
        e.preventDefault();
        e.stopPropagation();
        if (sno) window.location.href = `/products-page/${sno}`;
    };

    const getFirstImage = () => {
        if (!product?.ImagePath) return null;

        let first = null;

        // If array
        if (Array.isArray(product.ImagePath)) {
            first = product.ImagePath[0] ?? null;
        }
        // If comma-separated string
        else if (typeof product.ImagePath === "string") {
            first = product.ImagePath.split(",")[0]?.trim() ?? null;
        }

        if (!first) return null;

        // remove [" "] wrappers
        first = first.replace(/[\[\]"]/g, "").trim();

        if (first.startsWith("http://") || first.startsWith("https://")) {
            return first;
        }

        return `${baseUrl}${first.startsWith("/") ? "" : "/"}${first}`;
    };

    const firstImage = getFirstImage();

    return (
        <div className="noblur-product-card">
            <div className="noblur-product-img-container" onClick={(e) => handleProductClick(e, product?.SNO)}>
                {firstImage ? (
                    <img
                        src={firstImage}
                        alt={product?.itemCtrName || "Product"}
                    />
                ) : (
                    <div className="noblur-no-image">No Image</div>
                )}
            </div>
        </div>
    );
};


// ------------------------------
// HIGHLIGHTED PRODUCTS
// ------------------------------
const NoBlurHighlightedProducts = React.memo(({ itemCtrName }) => {
    const { data, loading, error } = useFilterProducts(
        { itemCtrName },
        0,
        3
    );

    const highlightProducts = useMemo(
        () => (data && Array.isArray(data?.data?.data) ? data?.data?.data : []),
        [data]
    );

    if (loading) return <div className="noblur-text-center">Loading products...</div>;
    if (error) return <div className="noblur-text-center noblur-text-danger">Error loading products</div>;
    if (highlightProducts.length === 0) return <div className="noblur-text-center">No highlighted products</div>;

    return (
        <div className="noblur-products-grid">
            {highlightProducts.map((product) => (
                <NoBlurProductCard key={product?.SNO} product={product} />
            ))}
        </div>
    );
});


// ------------------------------
// MAIN HANDPICKED SECTION
// ------------------------------
const NoBlurHandpicked = ({ data, isLoading, error }) => {
    const history = useHistory();

    const handleShopNow = (itemName, subItemName) => {
        const q = new URLSearchParams();
        if (itemName) q.append('itemCtrName', itemName);
        if (subItemName) q.append('subItemName', subItemName);
        history.push(`/products-page?${q.toString()}`);
    };

    if (isLoading) return <div className="noblur-loading">Loading banners...</div>;
    if (error) return <div className="noblur-error">Error loading banners</div>;

    const banners = Array.isArray(data?.data) ? data.data : [];

    if (banners.length === 0) {
        return <div className="noblur-no-products">No handpicked banners available</div>;
    }

    return (
        <section className="noblur-display">
            <div className="container-fluid">

                {/* HEADER */}
                <div className="noblur-header">
                    <h2 className="noblur-title">
                        <span className="noblur-gradient-text">Exclusive Collection</span>
                    </h2>
                </div>

                {/* SWIPER SLIDER */}
                <div className="noblur-swiper-wrapper">
                    <Swiper
                        modules={[Autoplay, Navigation, EffectCoverflow]}
                        effect="coverflow"
                        coverflowEffect={{
                            rotate: 0,
                            stretch: 0,
                            depth: 100,
                            modifier: 1,
                            slideShadows: false,
                        }}
                        centeredSlides={true}
                        slidesPerView="auto"
                        spaceBetween={30}
                        loop={true}
                        speed={800}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true
                        }}
                        navigation={{
                            nextEl: '.noblur-swiper-next',
                            prevEl: '.noblur-swiper-prev',
                        }}
                        grabCursor={true}
                        className="noblur-swiper"
                        watchSlidesProgress={true}
                        slideToClickedSlide={true}
                        breakpoints={{
                            320: {
                                slidesPerView: 'auto',
                                spaceBetween: 20,
                            },
                            576: {
                                slidesPerView: 'auto',
                                spaceBetween: 20,
                            },
                            768: {
                                slidesPerView: 'auto',
                                spaceBetween: 25,
                            },
                            992: {
                                slidesPerView: 'auto',
                                spaceBetween: 30,
                            },
                        }}
                        onInit={(swiper) => {
                            setTimeout(() => {
                                swiper.update();
                            }, 100);
                        }}
                    >
                        {banners.map((banner, index) => (
                            <SwiperSlide key={`banner-${index}`} className="noblur-swiper-slide">
                                <div className="noblur-slide">
                                    <div className="noblur-main-product">

                                        {/* MAIN BANNER IMAGE */}
                                        <div
                                            className="noblur-main-img"
                                            onClick={() => handleShopNow(banner?.itemName)}
                                            role="button"
                                            tabIndex={0}
                                            aria-label={`View ${banner?.itemName || ""} collection`}
                                        >
                                            <img
                                                src={getProductImages(banner?.image_path)}
                                                alt={banner?.title || "Image"}
                                                loading="lazy"
                                            />
                                        </div>

                                        {/* SUB PRODUCTS */}
                                        <NoBlurHighlightedProducts
                                            itemCtrName={banner?.itemName}
                                        />

                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* CUSTOM NAVIGATION BUTTONS */}
                    <button className="noblur-swiper-prev noblur-nav-btn prev-btn" aria-label="Previous slide">
                        <i className="fal fa-arrow-left" />
                    </button>
                    <button className="noblur-swiper-next noblur-nav-btn next-btn" aria-label="Next slide">
                        <i className="fal fa-arrow-right" />
                    </button>
                </div>

            </div>
        </section>
    );
};

export default NoBlurHandpicked;