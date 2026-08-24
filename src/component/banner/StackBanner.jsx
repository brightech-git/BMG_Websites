import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getImage } from "../../utils/getProductImages";

const GridBanner = ({
    title,
    description,
    images = [],

    desktopLayout,
    mobileLayout,

    gap = true,
    centered = false,
    full = false,
    backgroundColor = "white",
}) => {

    console.log(desktopLayout ,mobileLayout ,images ,'gridbannersetting');
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const layout = isMobile ? mobileLayout : desktopLayout;
    if (!layout) return null;

    console.log(layout,'gridlayout');

    const resolveImage = (image) => {
        console.log(image,'imageingrid');
        // string support
        if (typeof image === "string") {
            return { url: image, link: null, alt: "" };
        }

        if (!image || typeof image !== "object") {
            return { url: "", link: null, alt: "" };
        }
    

        // desktop / mobile structure
        if (image.desktop || image.mobile) {
            const source = isMobile
                ? image.mobile || image.desktop
                : image.desktop || image.mobile;

            return {
                url: source?.url || "",
                link: source?.link || null,
                alt: image.alt || "",
                rowSpan: image.rowSpan ?? 1
            };
        }

        // plain object fallback
        return {
            url: image.url || "",
            link: image.link || null,
            alt: image.alt || "",
            fitlerId: image.filterId,
            rowSpan : image.rowSpan ?? 1

        };
    };
    const handleImageClick = (imageData, index) => {


        

        // if (!imageData?.link && !imageData?.filterId) return;

        const data = imageData?.isSingle
            ? imageData
            : (imageData?.desktop || imageData?.mobile || {});

        const params = new URLSearchParams();

        if (data?.link) {
            data.link.split("&").forEach(pair => {
                const [key, value] = pair.split("=");
                if (key && value) params.append(key, value);
            });
        }

        if (data?.filterId) {
            params.append("filterIds", data.filterId);
        }

        navigate(`/products-page?${params.toString()}`);
    };

    return (
        <section
            className={`
                relative w-full py-2 
                overflow-hidden ${backgroundColor === 'white' ? 'bg-white' : `bg-${backgroundColor}`}
                ${centered ? 'flex items-center justify-center' : ''}
                ${full ? 'px-0' : 'px-2 md:px-2 lg:px-2'}
            `}
            style={backgroundColor !== 'white' && !backgroundColor.startsWith('bg-') ?
                { backgroundColor } : {}}
            role="banner"
            aria-label="Hero banner"
        >
            <div className={`${full ? "w-full" : "container mx-auto"}`}>
                {title && (
                    <h2 className={`text-lg md:text-2xl font-bold mb-2 text-[var(--primary-text-color)]  ${centered ? " flex justify-center items-center" : ""}`}>
                        {title}
                    </h2>
                )}

                {description && (
                    <p className={`"text-base md:text-lg mb-4" ${centered ? " flex justify-center items-center" : ""}`}>
                        {description}
                    </p>
                )}

                {/* 🔥 GRID */}
                <div
                    className={`grid w-full ${gap ? "gap-3" : "gap-0"}`}
                    style={{
                        gridTemplateColumns: layout.columns
                            .map((c) => `${c}fr`)
                            .join(" "),
                        gridAutoRows: "1fr",
                    }}
                >
                    {images.map((image, index) => {
                        const img = resolveImage(image);

                        console.log("🚀 ~ file: StackBanner.jsx:75 ~ images.map ~ img:", img)

                        if (!img.url) return null;

                        return (
                            <div
                                key={index}
                                className={`relative overflow-hidden ${img.link ? "cursor-pointer" : ""
                                    }`}
                                style={{
                                    gridRow: image?.rowSpan
                                        ? `span ${image.rowSpan}`
                                        : "span 1",
                                }}
                                onClick={()=>handleImageClick(image)}
                            >
                                <img
                                    src={getImage(img.url)}
                                    alt={img.alt || `Image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default GridBanner;
