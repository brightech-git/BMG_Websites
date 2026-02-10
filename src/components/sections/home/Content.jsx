import React, { Fragment, useEffect, useState } from "react";
import Banner from "./Banner";
import Category from "./Category";
import Category1 from "./Category1";
import Condos from "./ShopByPrice";
import Ourcategory from "./Ourcategory";
import ShopByRecipient from "./ShopByRecipient";
import Ourproducts from "../../layouts/Ourproducts";
import JewelryShowcase from "./jewelleryShowCase";
import FeaturedBanners from "../../layouts/FeaturedProduct";
import Onsale from "./Onsale";
import Video from "./Video";
import RecentlyViewedWrapper from "../../layouts/RecentlyViewedWrapper";
import Header from "../../layouts/HeaderWithAuth";
import Footer from "../../layouts/Footer";
import SmoothScroll from "../../layouts/SmoothScroll";
import RevealSection from "../../animations/RevealSection";
import { useBanners } from "../../../hook/banner/useBannerQueries";
import { useVideos } from "../../../hook/video/useVideoQuery";
import { useOccasionBanners } from "../../../hook/banner/useOccasionBanners";
import { useCategoryImages } from "../../../hook/categorywithImage/useCategoryQuery";
import { useOfferBanners } from "../../../hook/banner/useOfferBanner";
import { useBudgetBanners } from "../../../hook/budgetBanner/useBudgetBanners";
import { useGenderBanner } from "../../../hook/genderBanner/useGender";
import { useLatestBanner } from "../../../hook/lastestCollectionBanner/useLatestCollectionBanner";
import { useBestDesignedBanners } from '../../../hook/BestDesignedBanner/useBestDesignedbanner';
import { useFeaturedBanner } from "../../../hook/featuredBanner/useFeaturedBanner";
import { useFestivalBanner } from "../../../hook/banner/useFestivalBanner";
import HeroBanner from "../../../component/banner/HeroBanner";
import GridBanner from "../../../component/banner/StackBanner";

const Content = () => {

    //-----------------------------MainBanner--------------------------//

    const { data: bannerResponse = {}, isLoading: mainBannerLoading } = useBanners();
    const banners = bannerResponse?.data ?? [];


    // ------------------------------Category--------------------------------//

    const { data: occasion, isLoading: occasionLoading, error: occasionbannersError } = useOccasionBanners();
    const occasionbanners = occasion?.data || [];

    // ------------------------------Category--------------------------------//

    const { data: categories = [], isLoading: isCategoriesLoading } = useCategoryImages();
    const subcategories = categories.length ? [...categories] : [];


    // ------------------------------Category1--------------------------------//



    const { data: offerBanner, isLoading: offerLoading, error: offerError } = useOfferBanners();

    const offerBanners = offerBanner?.data || [];

    // ------------------------------BudgetBanner--------------------------------//

    const { data: budgetBanner, isLoading: budgerLoading, isError: budgetError } = useBudgetBanners();

    // Ensure it's an array and take only first 4 items
    const budgetBanners = budgetBanner?.data;

    console.log(budgetBanners, 'budgetBanners')


    // ------------------------------CategoryImages--------------------------------//

    //  const { data:CategoryData , isLoading : categoriesLoading, error:CategoryError } = useCategoryBanner();


    // ------------------------------Shop for receipient--------------------------------//
    const { data: genderBannerResponse } = useGenderBanner();
    const recipientBanners = genderBannerResponse ?? [];

    // ------------------------------Latest Banner Images --------------------------------//
    const { data: LastestData, LatestisLoading, LatestisError } = useLatestBanner();

    const [latestBanners, setLatestBanners] = useState();

    useEffect(() => {
        if (LastestData) {
            setLatestBanners(LastestData)
        }

    }, [LastestData]);

    // ------------------------------Best Designed Products--------------------------------//
    const { data: bestData, bestIsLoading, bestIsError } = useBestDesignedBanners();

    const [bestBanners, setBestBanners] = useState();

    useEffect(() => {
        if (bestData) {
            setBestBanners(bestData)
        }

    }, [bestData]);

    // ------------------------------Featured Banners--------------------------------//
    const { data: FeaturedBanner, featureIsLoading, FeatureIsError } = useFeaturedBanner();
    const [featureBanner, setFeatureBanner] = useState();

    useEffect(() => {
        if (!FeaturedBanner)
            return;
        else {
            setFeatureBanner(FeaturedBanner);
        }
    }, [FeaturedBanner]);

    //------------------------------Festival Banners--------------------//
    const { data: festivalBannerResponse, festivalIsLoading, FestivalIsError } = useFestivalBanner();

    const festivalBanners = festivalBannerResponse?.data || [];


    // ------------------------------Video--------------------------------//
    const { data: videos, isLoading: videoLoading, isError: videoError } = useVideos();
    const videoList = videos?.data || [];
    const isVideo = videoList.lenght > 0;

    return (
        <SmoothScroll>
            <Fragment>
                <Header />

                {/* 🌟 Hero Section (no animation wrapper — stays full width) */}
                <Banner banners={banners} isLoading={mainBannerLoading} />
                {budgetBanners &&
                    Object.keys(budgetBanners).map((key) => {
                        const banner = budgetBanners[key];

                        console.log(banner,'bannerbanner')
                        // Skip invisible banners
                        if (!banner.isVisible) return null;

                        return banner.isGrid ? (
                            <GridBanner
                                key={banner.imageKey || key}
                                title={banner.title}
                                centered={banner.centered}
                                gap={banner.gap}
                                full={banner.full}
                                backgroundColor={banner.backgroundColor}
                                images={banner.images || []}
                                desktopLayout={banner.desktopLayout || { columns: [1, 1], rows: 1 }}
                                mobileLayout={banner.mobileLayout || { columns: [1, 1, 1], rows: 1 }}
                            />
                        ) : (
                            <HeroBanner
                                key={banner.imageKey || key}
                                title={banner.title}
                                description={banner.description}
                                backgroundColor={banner.backgroundColor}
                                centered={banner.centered}
                                gap={banner.gap}
                                full={banner.full}
                                images={banner.images || []}
                                desktopColumns={banner.desktopLayout?.columns?.length || 2}
                                desktopRatio={banner.defaultRatio || "16/7.3"}
                                defaultRatio={banner.defaultRatio || "16/7.3"}
                                mobileRows={banner.mobileLayout?.rows || [1]}
                                mobileRatio={banner.mobileRatio || "16/7.3"}
                            />
                        );
                    })}

                <Category banners={occasionbanners} isLoading={occasionLoading} error={occasionbannersError} />



                <Ourcategory subcategories={subcategories} isCategoriesLoading={isCategoriesLoading} />



                <Category1 banners={offerBanners} isLoading={offerLoading} error={offerError} />


                {/* <Condos budgetBanners={budgetBanners} isLoading={budgerLoading} isError={budgetError} /> */}



                {/* <Handpicked data={CategoryData} isLoading ={categoriesLoading} error = {CategoryError} /> */}



                <ShopByRecipient banners={recipientBanners} />



                <Ourproducts banners={latestBanners} isLoading={LatestisLoading} isError={LatestisError} />




                <FeaturedBanners banners={featureBanner} isLoading={featureIsLoading} isError={FeatureIsError} />



                <Onsale festivalBanners={festivalBanners} isLoading={festivalIsLoading} isError={FestivalIsError} />



                <JewelryShowcase banners={bestBanners} isLoading={bestIsLoading} isError={bestIsError} />


                {isVideo && <RevealSection intensity={0.3}>
                    <Video videoList={videoList} isLoading={videoLoading} isError={videoError} />
                </RevealSection>}



                <RecentlyViewedWrapper />

                <Footer />
            </Fragment>
        </SmoothScroll>
    );
};

export default Content;
