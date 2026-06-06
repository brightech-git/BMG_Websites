import React, { Fragment, useEffect, useState } from "react";

import RecentlyViewedWrapper from "../../layouts/RecentlyViewedWrapper";
import HeroBanner from "../../../component/banner/HeroBanner";
import GridBanner from "../../../component/banner/StackBanner";
import { BannerSkeleton } from "../../../component/banner/BannerSkelaton";
import Ourcategory from "./Ourcategory";


import { useBudgetBanners } from "../../../hook/budgetBanner/useBudgetBanners";
import { useCategoryImages } from "../../../hook/categorywithImage/useCategoryQuery";
import classNames from "classnames";



// import BannerCarousel from "./BannerCarousel";
// import Category from "./Category";
// import Category1 from "./Category1";
// import Condos from "./ShopByPrice";

// import ShopByRecipient from "./ShopByRecipient";
// import Ourproducts from "../../layouts/Ourproducts";
// import JewelryShowcase from "./jewelleryShowCase";
// import FeaturedBanners from "../../layouts/FeaturedProduct";
// import Onsale from "./Onsale";
// import Video from "./Video";


// import { useBanners } from "../../../hook/banner/useBannerQueries";
// import { useVideos } from "../../../hook/video/useVideoQuery";
// import { useOccasionBanners } from "../../../hook/banner/useOccasionBanners";

// import { useOfferBanners } from "../../../hook/banner/useOfferBanner";
// import { useGenderBanner } from "../../../hook/genderBanner/useGender";
// import { useLatestBanner } from "../../../hook/lastestCollectionBanner/useLatestCollectionBanner";
// import { useBestDesignedBanners } from '../../../hook/BestDesignedBanner/useBestDesignedbanner';
// import { useFeaturedBanner } from "../../../hook/featuredBanner/useFeaturedBanner";
// import { useFestivalBanner } from "../../../hook/banner/useFestivalBanner";

const Content = () => {

    //-----------------------------MainBanner--------------------------//

    // const { data: bannerResponse = {}, isLoading: mainBannerLoading } = useBanners();
    // const banners = bannerResponse?.data ?? [];


    // ------------------------------Category--------------------------------//

    // const { data: occasion, isLoading: occasionLoading, error: occasionbannersError } = useOccasionBanners();
    // const occasionbanners = occasion?.data || [];

    // // ------------------------------Category--------------------------------//

    const { data: categories = [], isLoading: isCategoriesLoading } = useCategoryImages();
    const subcategories = categories.length ? [...categories] : [];


    // ------------------------------Category1--------------------------------//



    // const { data: offerBanner, isLoading: offerLoading, error: offerError } = useOfferBanners();

    // const offerBanners = offerBanner?.data || [];




    // ------------------------------CategoryImages--------------------------------//

    //  const { data:CategoryData , isLoading : categoriesLoading, error:CategoryError } = useCategoryBanner();


    // ------------------------------Shop for receipient--------------------------------//
    // const { data: genderBannerResponse } = useGenderBanner();
    // const recipientBanners = genderBannerResponse ?? [];

    // ------------------------------Latest Banner Images --------------------------------//
    // const { data: LastestData, LatestisLoading, LatestisError } = useLatestBanner();

    // const [latestBanners, setLatestBanners] = useState();

    // useEffect(() => {
    //     if (LastestData) {
    //         setLatestBanners(LastestData)
    //     }

    // }, [LastestData]);

    // ------------------------------Best Designed Products--------------------------------//
    // const { data: bestData, bestIsLoading, bestIsError } = useBestDesignedBanners();

    // const [bestBanners, setBestBanners] = useState();

    // useEffect(() => {
    //     if (bestData) {
    //         setBestBanners(bestData)
    //     }

    // }, [bestData]);

    // ------------------------------Featured Banners--------------------------------//
    // const { data: FeaturedBanner, featureIsLoading, FeatureIsError } = useFeaturedBanner();
    // const [featureBanner, setFeatureBanner] = useState();

    // useEffect(() => {
    //     if (!FeaturedBanner)
    //         return;
    //     else {
    //         setFeatureBanner(FeaturedBanner);
    //     }
    // }, [FeaturedBanner]);

    //------------------------------Festival Banners--------------------//
    // const { data: festivalBannerResponse, festivalIsLoading, FestivalIsError } = useFestivalBanner();

    // const festivalBanners = festivalBannerResponse?.data || [];


    // ------------------------------Video--------------------------------//
    // const { data: videos, isLoading: videoLoading, isError: videoError } = useVideos();
    // const videoList = videos?.data || [];
    // const isVideo = videoList.lenght > 0;



    // ------------------------------ ALL  BANNERS --------------------------------//

    const { data: budgetBanner, isLoading: budgetLoading, isError: budgetError } = useBudgetBanners();

    // Ensure it's an array and take only first 4 items
    const budgetBanners = budgetBanner?.data;

    console.log(budgetBanner,'budgetBanners');


    return (

            <Fragment>
                {/* ✅ SHOW SKELETON WHILE LOADING */}
            <div className="p-1 sm:p-2">

                {budgetLoading ? (
                    <BannerSkeleton />
                ) : (
                    /* ✅ SHOW ACTUAL BANNERS WHEN LOADED */
                    budgetBanners && Object.keys(budgetBanners).map((key) => {
                        const banner = budgetBanners[key];
                        if (!banner.isVisible) return null;

                        const parsedVisibleCount =
                            typeof banner.visibleCount === "string"
                                ? JSON.parse(banner.visibleCount)
                                : banner.visibleCount;

                        console.log(banner ,'bannersDatainHome');

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
                                desktopColumns={banner.desktopColumns || 3}
                                desktopRatio={banner.defaultRatio || "16/7.3"}
                                defaultRatio={banner.defaultRatio || "16/7.3"}
                                mobileRows={banner.mobileRows || [1]}
                                mobileRatio={banner.mobileRatio || "16/7.3"}
                                autoScroll={banner.autoscroll || false}
                                scrollable={banner.scrollable}
                                visibleCount={parsedVisibleCount || { desktop: 3, tablet: 2, mobile: 2 }}
                                scrollInterval={banner.scrollInterval}
                                infinite={banner.infinite || false}
                                dots={banner.dots || false}
                                showArrows = {banner.isCategory}

                            />
                        );
                    })
                )}


                {/* <Ourcategory subcategories={subcategories} isCategoriesLoading={isCategoriesLoading} /> */}


                <RecentlyViewedWrapper />
            </div>
                {/* <BannerCarousel banners={banners} isLoading={mainBannerLoading} /> */}


                {/* 🌟 Hero Section (no animation wrapper — stays full width) */}
               
{/* 
                <Category banners={occasionbanners} isLoading={occasionLoading} error={occasionbannersError} />






                <Category1 banners={offerBanners} isLoading={offerLoading} error={offerError} /> */}


                {/* <Condos budgetBanners={budgetBanners} isLoading={budgerLoading} isError={budgetError} /> */}



                {/* <Handpicked data={CategoryData} isLoading ={categoriesLoading} error = {CategoryError} /> */}


{/* 
                <ShopByRecipient banners={recipientBanners} />



                <Ourproducts banners={latestBanners} isLoading={LatestisLoading} isError={LatestisError} />




                <FeaturedBanners banners={featureBanner} isLoading={featureIsLoading} isError={FeatureIsError} />



                <Onsale festivalBanners={festivalBanners} isLoading={festivalIsLoading} isError={FestivalIsError} />



                <JewelryShowcase banners={bestBanners} isLoading={bestIsLoading} isError={bestIsError} /> */}


                {/* {isVideo &&
                    <Video videoList={videoList} isLoading={videoLoading} isError={videoError} />
                } */}




            </Fragment >
    
    );
};

export default Content;
