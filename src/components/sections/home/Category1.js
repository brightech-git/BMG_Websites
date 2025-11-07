import React from 'react';
import { useHistory } from 'react-router-dom';
import { useOfferBanners } from '../../../hook/banner/useOfferBanner';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Category1.css';
const CategoryCard = ({ item }) => {
    const history = useHistory();
    const baseUrl = "https://app.bmgjewellers.com";

    const handleShopNow = (itemCtrName, subItemName) => {
        const queryParams = new URLSearchParams();
        if (itemCtrName) queryParams.append('itemCtrName', itemCtrName);
        if (subItemName) queryParams.append('subItemName', subItemName);
        const fixedQuery = queryParams.toString().replace(/\+/g, '%20');
        history.push(`/products-page?${fixedQuery}`);
    };

    if (!item) {
        return (
            <div className="offer-card shimmer">
                <div className="offer-content">
                    <h2 className="offer-title shimmer" style={{ width: '80%', height: '2rem' }}></h2>
                    <p className="offer-subtitle shimmer" style={{ width: '60%', height: '1.2rem' }}></p>
                    <button className="offer-shop-btn offer-shop-filled shimmer" style={{ width: '100px', height: '2.5rem' }} disabled></button>
                </div>
            </div>
        );
    }

    const imgSrc = item?.image_path
        ? item.image_path.startsWith('http')
            ? item.image_path
            : `${baseUrl}${item.image_path.startsWith('/') ? '' : '/'}${item.image_path}`
        : '/fallback-image.jpg';

    //console.log(imgSrc, 'images')

    return (
        <div className="offer-card" onClick={() => handleShopNow(item.item_name, item.sub_item_name)} >
            <img
                src={imgSrc}
                alt={`${item.item_name} ${item.sub_item_name}`}
                className="offer-image"
                onError={(e) => {
                    e.target.src = '/fallback-image.jpg';
                }}
            />
            {/* <div className="offer-content">
                <h2 className="offer-title text-truncate" title={item.item_name}>
                    {item.item_name}
                </h2>
                <p className="offer-subtitle text-truncate" title={item.sub_item_name}>
                    {item.sub_item_name}
                </p>
                <button
                    className="offer-shop-btn offer-shop-filled mt-2"
                    onClick={() => handleShopNow(item.item_name, item.sub_item_name)}
                    aria-label={`Shop ${item.item_name} collection`}
                >
                    Shop Now
                </button>
            </div> */}
        </div>
    );
};

const Category1 = () => {
    const { data, isLoading, error } = useOfferBanners();

    const banners = data?.data || [];
    //console.log(banners, 'banner');

    if (isLoading) {
        return (
            <div className="offer-container">
                <div className="offer-grid">
                    {[...Array(2)].map((_, i) => (
                        <CategoryCard key={i} />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="offer-error" aria-live="assertive">
                Error loading offers: {error.message}
            </div>
        );
    }

    return (
        <div className="offer-container">
            <div className='offer-title-container'>
                <h4 className='cat-offer-title'> Exclusive Offers </h4>
                <span className='offer-sub-title'>Unwrap timeless elegance with special savings on our finest collections. </span>
            </div>
            <div className="offer-grid" >
                {banners.map((item, i) => (
                    <CategoryCard key={item.id || i} item={item} />
                ))}
            </div>
        </div>
    );
};

export default Category1;