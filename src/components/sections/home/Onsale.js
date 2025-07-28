import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useFestivalBanner } from '../../../hook/banner/useFestivalBanner';

const Onsale = () => {
    const history = useHistory();
    const { data: festivalBannerResponse, isLoading, isError } = useFestivalBanner();
    const baseUrl = "https://bmgjewellers.com";

    // Ensure we always have an array, even if the data structure changes
    const festivalBanners = festivalBannerResponse?.data || [];

    const handleProductClick = (itemName, subItemName) => {
        const queryParams = new URLSearchParams();
        if (itemName) queryParams.append('itemName', itemName);
        if (subItemName) queryParams.append('subItemName', subItemName);
        history.push(`/shop-left?${queryParams.toString()}`);
    };

    if (isLoading) return <div className="text-center py-5">Loading products...</div>;
    if (isError) return <div className="text-center py-5">Error loading products</div>;
    if (!Array.isArray(festivalBanners) || festivalBanners.length === 0) {
        return <div className="text-center py-5">No products available</div>;
    }

    // Safely get first 3 banners
    const mainBanner = festivalBanners[0] || null;
    const secondaryBanners = festivalBanners.slice(1, 3);

    if (!mainBanner) return <div className="text-center py-5">No products available</div>;

    return (
        <section className="pt-55 pb-55 room-type-section style-2">
            <div className='container'>
                <div className="section-title text-center mb-50">
                    <span className="title-tag">May Be You Have Earned It</span>
                    <h2>On Sale Products</h2>
                </div>
                <div className="row room-items">
                    {/* Main Banner (Left Column) */}
                    <div className="col-lg-6">
                        <div className="room-box extra-height">
                            <img
                                src={`${baseUrl}${mainBanner.image_path}`}
                                alt={mainBanner.title}
                                className="room-bg"
                                onClick={() => handleProductClick(mainBanner.item_name, mainBanner.sub_item_name)}
                            />
                            <div className="room-content">
                                <h3>
                                    <Link to="#" onClick={(e) => {
                                        e.preventDefault();
                                        handleProductClick(mainBanner.item_name, mainBanner.sub_item_name);
                                    }}>
                                        {mainBanner.title}
                                    </Link>
                                </h3>
                                <p>{mainBanner.subtitle}</p>
                            </div>
                            <Link
                                to="#"
                                className="room-link"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleProductClick(mainBanner.item_name, mainBanner.sub_item_name);
                                }}
                            >
                                <i className="fal fa-arrow-right" />
                            </Link>
                        </div>
                    </div>

                    {/* Secondary Banners (Right Column) */}
                    <div className="col-lg-6">
                        <div className="row">
                            {secondaryBanners.map((banner) => (
                                banner && (
                                    <div className="col-lg-12 col-md-6" key={banner.id}>
                                        <div className="room-box">
                                            <img
                                                src={`${baseUrl}${banner.image_path}`}
                                                alt={banner.title}
                                                className="room-bg"
                                                onClick={() => handleProductClick(banner.item_name, banner.sub_item_name)}
                                            />
                                            <div className="room-content">
                                                <h3>
                                                    <Link to="#" onClick={(e) => {
                                                        e.preventDefault();
                                                        handleProductClick(banner.item_name, banner.sub_item_name);
                                                    }}>
                                                        {banner.title}
                                                    </Link>
                                                </h3>
                                                <p>{banner.subtitle}</p>
                                            </div>
                                            <Link
                                                to="#"
                                                className="room-link"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleProductClick(banner.item_name, banner.sub_item_name);
                                                }}
                                            >
                                                <i className="fal fa-arrow-right" />
                                            </Link>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Onsale;