import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Pagination from '../../layouts/Pagination';
import Sidebar from '../../layouts/Shopsidebar';
import { useProductsQuery } from '../../../hook/product/useProductsQuery';
import { useAddFavorite, useRemoveFavorite, useFavorites } from '../../../hook/favorites/useFavoritesQuery';
import { useAuth } from '../../../context/authContext/UserAuthContext';
import './ShopContent.css';
import ProductCard from '../productCard/ProductCard';

const baseUrl = "https://app.bmgjewellers.com";

const Content = () => {
    const { data, isLoading, isError } = useProductsQuery('', 1, 10);
    const history = useHistory();
    const { user } = useAuth();
    const [animateHeart, setAnimateHeart] = useState(false);

    const { data: favoritesData } = useFavorites();
    const addFavorite = useAddFavorite();
    const removeFavorite = useRemoveFavorite();

    const handleWishlistToggle = (e, itemSno, isWishlisted) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            localStorage.setItem(
                "redirectAfterLogin",
                JSON.stringify({
                    path: window.location.pathname,
                    action: "wishlistToggle",
                    itemSno: itemSno,
                    isWishlisted: isWishlisted,
                })
            );
            history.push("/login");
            return;
        }

        setAnimateHeart(true);
        if (isWishlisted) {
            removeFavorite.mutate(itemSno);
        } else {
            addFavorite.mutate(itemSno);
        }
        setTimeout(() => setAnimateHeart(false), 800);
    };

    if (isLoading) return <div className="loading-spinner"></div>;
    if (isError) return <p className="error-message">Failed to load products. Please try again.</p>;

    const products = data || [];
    const favorites = Array.isArray(favoritesData?.data) ? favoritesData.data :
        Array.isArray(favoritesData) ? favoritesData : [];
    const favoriteItemIds = new Set(favorites.map(fav => fav.itemSno));

    return (
        <section className="shop-container">
            <div className="shop-layout">
                <div className="sidebar-area">
                    <Sidebar />
                </div>

                <div className="product-area">
                    <div className="product-header">
                        <p>Showing 1 To {products.length} of {products.length} results</p>
                        {/* <div className="sorting-box">
                            <select>
                                <option>DEFAULT Sorting</option>
                                <option>Sort By Popularity</option>
                                <option>Sort By Latest</option>
                                <option>Sort By Rating</option>
                                <option>Sort By Price: Low to High</option>
                                <option>Sort By Price: High to Low</option>
                            </select>
                        </div> */}
                    </div>

                    <div className="product-grid">
                        {products.map((item, i) => {
                            let images = [];
                            try {
                                images = JSON.parse(item.ImagePath || '[]');
                            } catch (error) {
                                console.warn('Invalid image JSON for item', item.ITEMID);
                            }
                            const firstImage = images.length > 0 ? `${baseUrl}${images[0]}` : 'https://via.placeholder.com/245x331';
                            const isWishlisted = favoriteItemIds.has(item.SNO);

                            return (
                                <ProductCard key={item.SNO || i} item={item} />

                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Content;