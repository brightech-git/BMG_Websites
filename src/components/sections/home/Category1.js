import React from 'react';
import { useHistory } from 'react-router-dom';
import { useOfferBanners } from '../../../hook/banner/useOfferBanner';
import '../../../assets/css/Category1.css';

const Category1 = () => {
    const history = useHistory();
    const { data, isLoading, error } = useOfferBanners();
    const baseUrl = "https://app.bmgjewellers.com";
    const banners = data?.data || [];

    const handleShopNow = (itemName, subItemName) => {
        const queryParams = new URLSearchParams();
        if (itemName) queryParams.append('itemName', itemName);
        if (subItemName) queryParams.append('subItemName', subItemName);

        const fixedQuery = queryParams.toString().replace(/\+/g, '%20');
        history.push(`/shop-left?${fixedQuery}`);
    };

    if (isLoading) return <div>Loading Offer Banners...</div>;
    if (error) return <div>Error loading offers: {error.message}</div>;

    return (
        <div className="category1-container">
            {banners.map((item, i) => {
                const imgSrc = item?.image_path ? `${baseUrl}${item.image_path}` : '';
                return (
                    <section className="category1-card" key={item.id}>
                        <img src={imgSrc} alt={item.title} className="category1-img" onClick={()=>handleShopNow(item.item_name, item.sub_item_name)} />
                        {/* <div className="category1-content">
                            <h2 className="category1-title">{item.title}</h2>
                            <p className="category1-subtitle">{item.subtitle}</p>
                            <button
                                className="cat-shop-btn cat-shop-filled"
                                onClick={() => handleShopNow(item.item_name, item.sub_item_name)}
                            >
                                Shop Now
                            </button>
                        </div> */}
                    </section>
                );
            })}
        </div>
    );
};

export default Category1;
