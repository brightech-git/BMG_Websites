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
import img1 from '../../../assets/images/Her_10_1_Desktop.webp';
import img2 from '../../../assets/images/Him_12_Desktop.webp';
import img3 from '../../../assets/images/2.allyours_desktop_1.webp';
import img4 from '../../../assets/images/Couple_Bands_1_2.webp';
import img5 from '../../../assets/images/px_2.webp';

import image1 from '../../../assets/images/grid_1.1.jpeg';
import image6 from '../../../assets/images/grid_1.2.jpeg';
import image2 from '../../../assets/images/grid_2.1.jpeg';
import image3 from '../../../assets/images/grid_2.2.jpeg';
import image4 from '../../../assets/images/grid_2.3.jpeg';
import image5 from '../../../assets/images/grid_2.4.jpeg';

import images1 from '../../../assets/images/img1.jpeg';
import images2 from '../../../assets/images/img2.jpeg';
import images3 from '../../../assets/images/img3.jpeg';
import images4 from '../../../assets/images/img4.jpeg';



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
    const budgetBanners = budgetBanner?.data?.budget_banner;

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

                {budgetBanners && (
                    <HeroBanner
                        title={budgetBanners.title}
                        description={budgetBanners.description}
                        backgroundColor={budgetBanners.backgroundColor}
                        centered={budgetBanners.centered}
                        gap={budgetBanners.gap}
                        full={budgetBanners.full}

                        images={(budgetBanners?.images) ? budgetBanners.images : []}

                        desktopColumns={Number(budgetBanners.desktopColumns) || 2}
                        desktopRatio="16 / 7.3"
                        defaultRatio="16/7.3" // All images use this ratio
                        mobileRows={budgetBanners.mobileRows || [1]}
                        mobileRatio="16 / 7.3"
                    />
                )}
               
                <GridBanner
                    title="Hero Banner"
                    centered
                    gap={false}

                    images={[
                        { url: image1 }, // 👈 BIG image
                        { url: image2 },
                        { url: image3 },
                        { url: image6 },
                        { url: image4 },
                        { url: image5 },
                       
                    ]}
                    desktopLayout={{
                        columns: [2, 1, 1], // 3 columns
                        rows: 2,            // 2 rows
                    }}
                    mobileLayout={{
                        columns: [2, 1, 1], // 3 columns
                        rows: 2,            // 2 rows
                    }}
                />

                <GridBanner
                    title="Hero Banner"
                    centered
                    gap={false}

                    images={[
                        { url: images1 }, // 👈 BIG image
                        { url: images2 },
                        { url: images3 },
                        { url: images4 },

                    ]}
                    desktopLayout={{
                        columns: [15, 11], // 3 columns
                        rows: 1,            // 2 rows
                    }}
                    mobileLayout={{
                        columns: [2, 1, 1], // 3 columns
                        rows: 2,            // 2 rows
                    }}
                />

              
                <Category banners={occasionbanners} isLoading={occasionLoading} error={occasionbannersError} />



                <Ourcategory subcategories={subcategories} isCategoriesLoading={isCategoriesLoading} />



                <Category1 banners={offerBanners} isLoading={offerLoading} error={offerError} />


                <Condos budgetBanners={budgetBanners} isLoading={budgerLoading} isError={budgetError} />



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
