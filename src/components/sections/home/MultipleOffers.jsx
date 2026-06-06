import React from "react";
import "./MultipleOffers.css";
import { useNavigate } from "react-router-dom/cjs/react-router-dom.min";

const MultipleOffers = ({ offers }) => {
    const history = useNavigate();
    const baseUrl = "https://app.bmgjewellers.com";

    if (!offers || offers.length < 2) return null;


    const handleClick = (ItemName, subItemName) => {
        const queryParam = new URLSearchParams();
        if (ItemName) queryParam.append('ItemName', ItemName);
        if (subItemName) queryParam.append('subItemName', subItemName);
        const fixedQuery = queryParam.toString().replace(/\+/g, '%20');
        navigate(`/products-page?${fixedQuery}`);

    }

    return (
        <div className="multiple-offers-section">
            <h2 className="offer-section-title">Explore Offers</h2>
            <div className="multiple-offers-grid">
                {offers.slice(0, 2).map((offer, index) => (
                    <div className="offer-image-box" key={index}>
                        <img
                            src={
                                offer.image_path
                                    ? `${baseUrl}${offer.image_path}`
                                    : "/fallback-image.jpg"
                            }
                            alt={offer.title || "Offer"}
                            loading="lazy"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/fallback-image.jpg";
                            }}
                            onClick={() => handleClick(offer.title, offer.subtitle)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MultipleOffers;
