"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import HeroBanner from "../../components/schemeBanners/Banner";
import { useSchemeDetails } from "../../hook/schemeDetails/useSchemeHook";
import { getLanguage, setLanguage } from "../../utils/language/language";
import HeroBannerDownload from "../../components/schemeBanners/HeroBanner";
import { FaApple } from "react-icons/fa";
import androidIcon from '../../assets/icons/android.jpeg';
import FaqPage from "../faq/FaqPage";
import { useCompanyDetails } from "../../context/clientDetails/clientDetialContext";
import { useAnimateCSSOnScroll } from "../../hook/animation/useAnimateCSSOnScroll";
import './schemeDetails.css';

const SKELETON_COUNT = 3;

function SchemePage() {
    const BASE_URL = "https://scheme.bmgjewellers.com";

    const [lang, setLang] = useState(() => getLanguage());

    const { details, loading } = useCompanyDetails();
    const playStoreLink = details?.ANDROIDLINK;
    const appStoreLink  = details?.APPSTORELINK;

    const { data, isLoading, isError } = useSchemeDetails({ language: lang });
    const { data: androidData } = useSchemeDetails({ keyvalue: "android" });
    const { data: iosData }     = useSchemeDetails({ keyvalue: "ios" });
    const { data: bannerData }  = useSchemeDetails({ keyvalue: "banner" });

    const schemeData   = useMemo(() => Array.isArray(data?.data)       ? data.data       : [], [data]);
    const singleBanner = useMemo(() => Array.isArray(bannerData?.data)  ? bannerData.data  : [], [bannerData]);
    const androidBanner = useMemo(() => Array.isArray(androidData?.data) ? androidData.data : [], [androidData]);
    const iosBanner    = useMemo(() => Array.isArray(iosData?.data)     ? iosData.data     : [], [iosData]);

    const androidQR = androidBanner[0]?.QRBanner || androidBanner[0]?.BigSchemeImage;
    const iosQR     = iosBanner[0]?.QRBanner     || iosBanner[0]?.BigSchemeImage;

    useAnimateCSSOnScroll(".hero-animate",    "animate__fadeInUp");
    useAnimateCSSOnScroll(".download-section","animate__fadeInUp");
    useAnimateCSSOnScroll(".download-text",   "animate__fadeInLeft");
    useAnimateCSSOnScroll(".download-btn",    "animate__fadeInUp");

    const handleLanguageChange = useCallback((selectedLang) => {
        setLanguage(selectedLang);
        setLang(selectedLang);
        // Full reload needed because API key is stored in a non-React store (getLanguage util)
        window.location.reload();
    }, []);

    if (isError) return (
        <div className="flex items-center justify-center min-h-[40vh]">
            <p className="text-sm text-gray-500">Unable to load schemes. Please try again later.</p>
        </div>
    );

    return (
        <div className="scheme-main-container">
            {/* Language Toggle */}
            <section className="p-2 m-2 flex items-center">
                <div className="relative flex items-center rounded-full bg-gray-100 p-0.5 animate__animated animate__zoomIn animate__delay-1s">
                    <span className={`absolute h-6 w-10 rounded-full bg-black transition-all duration-300 ${lang === "en" ? "left-0.5" : "left-[42px]"}`} />
                    {[["en", "EN"], ["tm", "TA"]].map(([value, label]) => (
                        <button
                            key={value}
                            onClick={() => handleLanguageChange(value)}
                            className={`relative z-10 w-10 text-xs font-medium transition-colors ${lang === value ? "text-white" : "text-gray-600"}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </section>

            {/* Hero Banner */}
            <section>
                {singleBanner.map(banner => (
                    <HeroBannerDownload
                        key={banner.Id}
                        desktopImg={`${BASE_URL}${banner.BigSchemeImage}`}
                        mobileImg={`${BASE_URL}${banner.SchemeImage}`}
                        alt={banner.SchemeName}
                    />
                ))}
            </section>

            {/* Download App Section */}
            <section className="download-section">
                <div className="download-glow">
                    <div className="glow-left" />
                    <div className="glow-right" />
                </div>

                <div className="download-text">
                    <h2>Experience BMG Jewellers App</h2>
                    <p>
                        Track schemes, monitor gold rates, manage payments, and stay connected —
                        all in one secure and elegantly crafted mobile experience.
                    </p>
                </div>

                <div className="download-actions">
                    <div className="qr-group">
                        {androidQR && (
                            <div className="qr-card">
                                <img src={`${BASE_URL}${androidQR}`} alt="Android QR" loading="lazy" />
                                <p>Scan for Android</p>
                            </div>
                        )}
                        {iosQR && (
                            <div className="qr-card">
                                <img src={`${BASE_URL}${iosQR}`} alt="iOS QR" loading="lazy" />
                                <p>Scan for iOS</p>
                            </div>
                        )}
                    </div>

                    <div className="store-buttons">
                        <button className="store-btn" onClick={() => window.open(playStoreLink, "_blank")}>
                            <img src={androidIcon} alt="Android" />
                            <div className="flex flex-col">
                                <span>Get it on</span>
                                <strong>Android App</strong>
                            </div>
                        </button>
                        <button className="store-btn" onClick={() => window.open(appStoreLink, "_blank")}>
                            <FaApple size={26} />
                            <div className="flex flex-col">
                                <span>Download on the</span>
                                <strong>App Store</strong>
                            </div>
                        </button>
                    </div>
                </div>
            </section>

            {/* Available Schemes */}
            <div className="mx-auto">
                <h2 className="text-base sm:text-xl font-bold mb-2">Available Schemes</h2>
            </div>

            {isLoading
                ? Array.from({ length: SKELETON_COUNT }, (_, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden shadow-lg bg-gray-200 animate-pulse h-48 sm:h-64 md:h-80" />
                ))
                : schemeData.map((scheme, index) => (
                    <div
                        key={scheme.Id ?? index}
                        className="hero-animate rounded-2xl overflow-hidden shadow-lg"
                        style={{ transformOrigin: "center bottom" }}
                    >
                        <HeroBanner
                            desktopImg={`${BASE_URL}${scheme.BigSchemeImage}`}
                            mobileImg={`${BASE_URL}${scheme.SchemeImage}`}
                            alt={scheme.SchemeName || "Scheme Banner"}
                        />
                    </div>
                ))
            }

            {/* FAQ */}
            <section className="gap-2">
                <h4 className="text-sm sm:text-lg text-[var(--color-body-text)] text-center font-bold">
                    Frequently Asked Questions
                </h4>
                <FaqPage />
            </section>
        </div>
    );
}

export default SchemePage;
