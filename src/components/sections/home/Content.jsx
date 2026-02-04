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
import img1 from '../../../assets/images/Her_10_1_Desktop.webp';
import img2 from '../../../assets/images/Him_12_Desktop.webp';
import img3 from '../../../assets/images/2.allyours_desktop_1.webp';
import img4 from '../../../assets/images/Couple_Bands_1_2.webp';
import img5 from '../../../assets/images/px_2.webp';
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
    const budgetBanners = Array.isArray(budgetBanner?.categories) ? budgetBanner?.categories.reverse().slice(0, 4) : [];


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
                {/* <HeroBanner
                    title="Hero Banner With 2 Images"
                    backgroundColor="bg-red"
                    description="Dual image"
                    gap={true}
                    centered={true}
                    mobileRows={[2, 2]}
                    images={[
                        {
                            url: img2,
                            ratio: "2/3",
                            alt: "First image"
                        },
                        {
                            url: img1,
                            ratio: "2/3",
                            alt: "Second image"
                        },
                        {
                            url: img2,
                            ratio: "2/3",
                            alt: "First image"
                        },
                        {
                            url: img2,
                            ratio: "2/3",
                            alt: "First image"
                        },
                    ]}
                    defaultRatio="2/8" 
                    
                />
                <HeroBanner
                    title="Hero Banner With 3 Images"
                    gap={false}
                    full={true}
                    centered={true}
                    mobileRows={[1,2]}
                    mobileGap={true}
                    desktopColumns="auto"
                    images={[
                        {
                            url: img3,
                            ratio: "16/4",
                            alt: "Wide image"
                        },
                        {
                            url: img2,
                            ratio: "5/4",
                            alt: "Medium image"
                        },
                        {
                            url: img1,
                            ratio: "5/4",
                            alt: "Medium image"
                        }
                    ]}
                    defaultRatio="16/4" // Fallback for images without ratio
                />
                <HeroBanner
                    title="Hero Banner With 2 Images"
                    description=""
                    gap={true}
                    centered={true}
                    images={[
                        {
                            url: img4,
                            // No ratio - will use defaultRatio
                            alt: "Image 4"
                        },
                        {
                            url: img5,
                            // No ratio - will use defaultRatio  
                            alt: "Image 5"
                        }
                    ]}
                    defaultRatio="16/7.3" // All images use this ratio
                /> */}

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
