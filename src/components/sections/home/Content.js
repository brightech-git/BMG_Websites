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
import { useBanners } from "../../../hook/banner/useBannerQueries";
import { useVideos } from "../../../hook/video/useVideoQuery";
import { useOccasionBanners } from "../../../hook/banner/useOccasionBanners";
import { useCategoryImages } from "../../../hook/categorywithImage/useCategoryQuery";
import { useOfferBanners } from "../../../hook/banner/useOfferBanner";
import { useBudgetBanners } from "../../../hook/budgetBanner/useBudgetBanners";
import { useCategoryBanner } from "../../../hook/banner/useCategoriesBanner";

const Content = () => {

    //-----------------------------MainBanner--------------------------//

    const { data: bannerResponse = {}, isLoading:mainBannerLoading } = useBanners();
    const banners = bannerResponse?.data ?? [];


    // ------------------------------Category--------------------------------//

    const { data:occasion, isLoading:occasionLoading, error:occasionbannersError } = useOccasionBanners();
    const occasionbanners = occasion?.data || [];

    // ------------------------------Category--------------------------------//

    const { data: categories = [], isLoading: isCategoriesLoading } = useCategoryImages();
        const subcategories = categories.length ? [...categories].reverse() : [];


    // ------------------------------Category1--------------------------------//


    
        const { data:offerBanner, isLoading:offerLoading, error:offerError } = useOfferBanners();
    
        const offerBanners = offerBanner?.data || [];

    // ------------------------------BudgetBanner--------------------------------//

    const { data: budgetBanner, isLoading:budgerLoading, isError:budgetError } = useBudgetBanners();
   
console.log(budgetBanner ,'budget')
    // Ensure it's an array and take only first 4 items
    const budgetBanners = Array.isArray(budgetBanner?.categories) ? budgetBanner?.categories.reverse().slice(0, 4) : [];
    console.log(budgetBanners, 'budget')


    // ------------------------------CategoryImages--------------------------------//

     const { data:CategoryData , isLoading : categoriesLoading, error:CategoryError } = useCategoryBanner();

    
    // ------------------------------Video--------------------------------//
    // ------------------------------Video--------------------------------//
    // ------------------------------Video--------------------------------//
    // ------------------------------Video--------------------------------//


    // ------------------------------Video--------------------------------//
    const {data:videos ,isLoading:videoLoading ,isError:videoError } = useVideos();
    const videoList = videos?.data || [];
    const isVideo = videoList.lenght > 0;

    return (
        <SmoothScroll> 
            <Fragment>
                <Header />

                {/* 🌟 Hero Section (no animation wrapper — stays full width) */}
                <Banner banners={banners} isLoading={mainBannerLoading} />

                {/* ✨ Animated Sections */}
                <RevealSection intensity={0.3}>
                    <Category banners={occasionbanners} isLoading={occasionLoading} error={occasionbannersError} />
                </RevealSection>

                <RevealSection intensity={0.25}>
                    <Ourcategory subcategories={subcategories} isCategoriesLoading={isCategoriesLoading}/>
                </RevealSection>

                <RevealSection intensity={0.3}>
                    <Category1 banners={offerBanners} isLoading={offerLoading} error={offerError} />
                </RevealSection>

                <RevealSection intensity={0.25}>
                    <Condos budgetBanners={budgetBanners} isLoading={budgerLoading} isError={budgetError} />
                </RevealSection>

                <RevealSection intensity={0.35}>
                    <Handpicked data={CategoryData} isLoading ={categoriesLoading} error = {CategoryError} />
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
                {isVideo && <RevealSection intensity={0.3}>
                    <Video videoList={videoList} isLoading={videoLoading} isError={videoError} />
                </RevealSection>}
            

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
