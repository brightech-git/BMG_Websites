import React, { Fragment } from 'react';
import Banner from './Banner';
import Category from './Category';
import Category1 from './Category1';
import Habout from '../../layouts/Habout';
import Trending from './Trending';
import Condos from './Condos';
import Cta from './Cta';
import TrendingProducts from './TrendingProducts';
import Ourcategory from './Ourcategory';
import Handpick from './Handpick';
import Ourproducts from '../../layouts/Ourproducts';
import FeaturedProducts from '../../layouts/FeaturedProduct';
import Saleproducts from './Saleproducts';
import Counter from './Counter';
import Onsale from './Onsale';
import Video from './Video';
import RecentlyViewed from '../../layouts/RecentlyViewed';
import Blog from './Blog';
import Handpicked from '../homethree/Handpicked';
import FeaturedBanners from '../../layouts/FeaturedProduct';
import ShopByRecipient from './ShopByRecipient';
import './HomeContent.css';
import JewelryShowcase from './jewelleryShowCase';
import RecentlyViewedWrapper from '../../layouts/RecentlyViewedWrapper';
import Appointment from '../../pages/virtualShop/Appointment';
import Testimonials from '../../Testimonials/Testimonials';
import SingleOffer from './SingleOffer';
import MultipleOffers from './MultipleOffers';
import { useInstantOffer } from '../../../hook/banner/useOfferBanner';

const Content = () => {
    const { data: instantOffer, isLoading, error } = useInstantOffer() || {};

    if (!instantOffer || instantOffer.length === 0) return ;

    // Safe now
    const firstOffer = instantOffer[2];
    const otherOffers = instantOffer.slice(0,2);
   

    console.log('first', firstOffer);
    console.log('second', otherOffers);

    return (
        <Fragment>
            <Banner />
            <Category />
            <SingleOffer offer={firstOffer} />
            <Ourcategory />
            <Category1 />
            <Condos />
            <Handpicked />
            <ShopByRecipient />
            <Ourproducts />
            <MultipleOffers offers={otherOffers} />
            <TrendingProducts />
            <JewelryShowcase />
            <FeaturedBanners />
            <Onsale />
            <Video />
            <RecentlyViewedWrapper />
            {/* <Appointment /> */}
            <Testimonials />
        </Fragment>
    );
};

export default Content;