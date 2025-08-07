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
<<<<<<< Updated upstream
//import BestDesign from './BestDesign';
import FeaturedBanners from '../../layouts/FeaturedProduct';
import ShopByRecipient from './ShopByRecipient';
import './HomeContent.css';
import JewelryShowcase from './jewelleryShowCase';
import RecentlyViewedWrapper from '../../layouts/RecentlyViewedWrapper';

class Content extends Component {
    render() {
        return (
            <Fragment>
                <Banner/>
                <Category/>
                <Category1/>
                <Condos />
                <Handpicked />
                <ShopByRecipient />
                <FeaturedBanners />
                <Cta />     
                {/* <Trending/> */}        
              
                <TrendingProducts />
                <Ourcategory/>
                <JewelryShowcase />
                {/* <BestDesign /> */}
                {/* <Handpick/> */}
                <Ourproducts/>
                 {/* <Saleproducts/> */}
                <Counter/>
                <Onsale/>
                <Video/>
                <RecentlyViewedWrapper/>
                {/* <Habout /> */}
                {/* <Blog/> */}
                
            </Fragment>
        );
    }
}
=======
>>>>>>> Stashed changes

const Content = () => {
    return (
        <Fragment>
            <Banner />
            <Category />
            <Category1 />
            <Handpicked />
            {/* <Cta />
            <Trending />
            <Condos />
            <Bestselling />
            <Ourcategory />
            <Handpick />
            <Ourproducts />
            {/* <Saleproducts /> */}
            {/* <Counter />
            <Onsale />
            <Video />
            <Latestproducts />
            {/* <Habout /> */}
            {/* <Blog /> */}
        </Fragment>
    );
};

export default Content;
