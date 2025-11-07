import React, { Fragment } from "react";
import Banner from "./Banner";
import Category from "./Category";
import Category1 from "./Category1";
import Condos from "./Condos";
import Ourcategory from "./Ourcategory";
import Handpicked from "../homethree/Handpicked";
import ShopByRecipient from "./ShopByRecipient";
import Ourproducts from "../../layouts/Ourproducts";
import TrendingProducts from "./TrendingProducts";
import JewelryShowcase from "./jewelleryShowCase";
import FeaturedBanners from "../../layouts/FeaturedProduct";
import Onsale from "./Onsale";
import Video from "./Video";
import RecentlyViewedWrapper from "../../layouts/RecentlyViewedWrapper";
import Testimonials from "../../Testimonials/Testimonials";
import Header from "../../layouts/HeaderWithAuth";
import Footer from "../../layouts/Footerthree";
import SmoothScroll from "../../layouts/SmoothScroll";
import RevealSection from "../../animations/RevealSection";
import "./HomeContent.css";

const Content = () => {
    return (
        <SmoothScroll>
            <Fragment>
                <Header />

                {/* 🌟 Hero Section (no animation wrapper — stays full width) */}
                <Banner />

                {/* ✨ Animated Sections */}
                <RevealSection intensity={0.3}>
                    <Category />
                </RevealSection>

                <RevealSection intensity={0.25}>
                    <Ourcategory />
                </RevealSection>

                <RevealSection intensity={0.3}>
                    <Category1 />
                </RevealSection>

                <RevealSection intensity={0.25}>
                    <Condos />
                </RevealSection>

                <RevealSection intensity={0.35}>
                    <Handpicked />
                </RevealSection>

                <RevealSection intensity={0.4}>
                    <ShopByRecipient />
                </RevealSection>

                <RevealSection intensity={0.3}>
                    <Ourproducts />
                </RevealSection>

                <RevealSection intensity={0.3}>
                    <TrendingProducts />
                </RevealSection>

                <RevealSection intensity={0.3}>
                    <JewelryShowcase />
                </RevealSection>

                <RevealSection intensity={0.3}>
                    <FeaturedBanners />
                </RevealSection>

                <RevealSection intensity={0.3}>
                    <Onsale />
                </RevealSection>

                <RevealSection intensity={0.3}>
                    <Video />
                </RevealSection>

                <RevealSection intensity={0.3}>
                    <RecentlyViewedWrapper />
                </RevealSection>

                <RevealSection intensity={0.25}>
                    <Testimonials />
                </RevealSection>

                <Footer />
            </Fragment>
        </SmoothScroll>
    );
};

export default Content;
