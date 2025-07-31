import React, { Component, Fragment } from 'react';
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
import BestDesign from './BestDesign';
import FeaturedBanners from '../../layouts/FeaturedProduct';
import ShopByRecipient from './ShopByRecipient';
import './HomeContent.css';

class Content extends Component {
    render() {
        return (
            <Fragment>
                <Banner/>
                <Category/>
                <Category1/>
                <Handpicked />
                <ShopByRecipient />
                <FeaturedBanners />
                <Cta />     
                {/* <Trending/> */}
                <Condos/>
                <TrendingProducts />
                <Ourcategory/>
                <BestDesign />
                {/* <Handpick/> */}
                <Ourproducts/>
                 {/* <Saleproducts/> */}
                <Counter/>
                <Onsale/>
                <Video/>
                <RecentlyViewed />
                {/* <Habout /> */}
                <Blog/>
                
            </Fragment>
        );
    }
}

export default Content;