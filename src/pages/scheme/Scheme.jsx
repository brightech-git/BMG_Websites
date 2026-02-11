"use client";

import React, { useEffect, useState } from "react";
import HeroBanner from "../../components/banner/Banner";
import { useSchemeDetails } from "../../hook/schemeDetails/useSchemeHook";
import { getLanguage, setLanguage } from "../../utils/language/language";
import HeroBannerDownload from "../../components/banner/HeroBanner";
import { FaGooglePlay, FaApple, FaAndroid } from "react-icons/fa";
import androidIcon from '../../assets/icons/android.jpeg';
import FaqPage from "../faq/FaqPage";
import { useCompanyDetails } from "../../context/clientDetails/clientDetialContext";
import { useAnimateCSSOnScroll } from "../../hook/animation/useAnimateCSSOnScroll";
import './schemeDetails.css'

function SchemePage() {
    const BASE_URL = "https://scheme.bmgjewellers.com";

    const [language, setLanguages] = useState("en");
    const [lang, setLang] = useState("en");

    const { details, loading } = useCompanyDetails();
    const companyFullDetails = details;
    const playStoreLink = companyFullDetails?.ANDROIDLINK;

    console.log(lang, 'language');


    const appStoreLink = companyFullDetails?.APPSTORELINK;

    useEffect(() => {
        setLanguages(getLanguage());
    }, []);

    useEffect(() => {
        setLang(getLanguage());
    }, []);

    const { data, isLoading, isError } = useSchemeDetails({ language });
    const schemeData = Array.isArray(data?.data) ? data.data : [];

    console.log(schemeData,'schemeData')
    const banner = "banner";
    const android = "android";
    const ios = "ios";

    const { data: androidData, isLoading: androidLoading, isError: androidError } = useSchemeDetails({ keyvalue: android });
    const { data: iosData, isLoading: iosLoading, isError: iosError } = useSchemeDetails({ keyvalue: ios });
    const { data: bannerData, isLoading: bannerLoading, isError: bannerError } = useSchemeDetails({ keyvalue: banner });



    const singleBanner = Array.isArray(bannerData?.data) ? bannerData.data : [];
    const androidBanner = Array.isArray(androidData?.data) ? androidData.data : [];
    const iosBanner = Array.isArray(iosData?.data) ? iosData.data : [];
    console.log(androidBanner, iosBanner, 'bannerdata');

    const androidQR = androidBanner?.[0]?.QRBanner || androidBanner?.[0]?.BigSchemeImage;
    const iosQR = iosBanner?.[0]?.QRBanner || iosBanner?.[0]?.BigSchemeImage;

    useAnimateCSSOnScroll(".hero-animate", "animate__fadeInUp");
    useAnimateCSSOnScroll(".download-section", "animate__fadeInUp");
    useAnimateCSSOnScroll(".download-text", "animate__fadeInLeft");
    useAnimateCSSOnScroll(".download-btn", "animate__fadeInUp");



    if (isError) return <p>Error loading schemes</p>;



    const handleLanguageChange = (lang) => {
        setLang(lang);
        setLanguage(lang);
        window.location.reload();
    };

    return (
        <>
           

            <div className="scheme-main-container">
                <section className="p-2 m-2 flex items-right">
                    <div
                        className="
                            relative flex items-center
                            rounded-full bg-gray-100 p-0.5
                            animate__animated animate__zoomIn
                            animate__delay-1s
                        "
                    >
                        {/* Active Indicator */}
                        <span
                            className={`absolute h-6 w-10 rounded-full bg-black
                                transition-all duration-300
                                ${lang === "en" ? "left-0.5" : "left-[42px]"}
                            `}
                        />

                        <button
                            onClick={() => handleLanguageChange("en")}
                            className={`relative z-10 w-10 text-xs font-medium transition-colors
                                ${lang === "en" ? "text-white" : "text-gray-600"}
                            `}
                        >
                            EN
                        </button>

                        <button
                            onClick={() => handleLanguageChange("tm")}
                            className={`relative z-10 w-10 text-xs font-medium transition-colors
                                ${lang === "tm" ? "text-white" : "text-gray-600"}
                            `}
                        >
                            TA
                        </button>
                    </div>
                </section>

                <section>
                    {singleBanner.map((banner) => (
                        <HeroBannerDownload
                            key={banner.Id}
                            desktopImg={`${BASE_URL}${banner.BigSchemeImage}`}
                            mobileImg={`${BASE_URL}${banner.SchemeImage}`}
                            alt={banner.SchemeName}

                        />
                    ))}

                </section>
                <section>
                {/* <BannerCarousel
                    banners={schemeData.map((scheme) => ({
                        desktopImg: `${BASE_URL}${scheme.BigSchemeImage}`,
                        mobileImg: `${BASE_URL}${scheme.SchemeImage}`,
                        alt: scheme.SchemeName,
                        onClick: () => {
                            console.log("Clicked scheme:", scheme.SchemeName);
                        },
                    }))}
                /> */}
                </section>

                {/* Download App Section */}
                <section className="download-section">
                    {/* Ambient glow */}
                    <div className="download-glow">
                        <div className="glow-left" />
                        <div className="glow-right" />
                    </div>

                    {/* Left text */}
                    <div className="download-text">
                        <h2>Experience BMG Jewellers App</h2>
                        <p>
                            Track schemes, monitor gold rates, manage payments, and stay connected —
                            all in one secure and elegantly crafted mobile experience.
                        </p>
                    </div>

                    {/* Right content */}
                    <div className="download-actions">
                        <div className="qr-group">
                            {androidQR && (
                                <div className="qr-card">
                                    <img src={`${BASE_URL}${androidQR}`} alt="Android QR" />
                                    <p>Scan for Android</p>
                                </div>
                            )}

                            {iosQR && (
                                <div className="qr-card">
                                    <img src={`${BASE_URL}${iosQR}`} alt="iOS QR" />
                                    <p>Scan for iOS</p>
                                </div>
                            )}
                        </div>

                        <div className="store-buttons">
                            <button
                                className="store-btn"
                                onClick={() => window.open(playStoreLink, "_blank")}
                            >
                                <img src={androidIcon} alt="Android" />
                                <div className="flex flex-col">
                                    <span>Get it on</span>
                                    <strong>Android App</strong>
                                </div>
                            </button>

                            <button
                                className="store-btn"
                                onClick={() => window.open(appStoreLink, "_blank")}
                            >
                                <FaApple size={26} />
                                <div className="flex flex-col">
                                    <span>Download on the</span>
                                    <strong>App Store</strong>
                                </div>
                            </button>
                        </div>
                    </div>
                </section>




                {/* Available Schemes Header */}
                <div className="mx-auto">
                    <h2 className="text-base sm:text-xl  font-bold mb-2">Available Schemes</h2>
                </div>

                {/* Schemes List */}
                {isLoading
                    ? Array.from({ length: 3 }).map((_, index) => (
                        <div
                            key={index}
                            className="rounded-2xl overflow-hidden shadow-lg bg-gray-200 animate-pulse h-48 sm:h-64 md:h-80"
                        />
                    ))
                    : schemeData.map((scheme, index) => (
                        <div
                            key={index}
                            className="hero-animate rounded-2xl overflow-hidden shadow-lg"
                            style={{ transformOrigin: "center bottom" }}
                        >
                            <HeroBanner
                                desktopImg={`${BASE_URL}${scheme.BigSchemeImage}`}
                                mobileImg={`${BASE_URL}${scheme.SchemeImage}`}
                                alt={scheme.SchemeName || "Scheme Banner"}

                            />

                        </div>
                    ))}


                <section className="gap-2">
                    <h4 className=" text-sm sm:text-lg text-[var(--color-body-text)] text-center font-bold"> Frequently Asked Questions </h4>

                    <FaqPage />

                </section>
            </div>
         
        </>
    );
}

export default SchemePage;
