"use client";


const HeroBannerDownload = ({
    desktopImg,
    mobileImg,
    alt = "Hero Banner",
    handleClick,
}) => {
    return (
        <div className="w-full overflow-hidden">
            {/* Wrapper */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">

                {/* Image 1 */}
                <div className="relative w-full aspect-[16/5]">
                    <img
                        src={desktopImg ?? undefined}
                        alt={alt}
                        className="absolute inset-0 w-full h-full object-cover rounded-2xl cursor-pointer"
                        onClick={handleClick}
                    />
                </div>

                {/* Image 2 */}
                {/* <div className="relative w-full sm:w-1/2 aspect-[4/5] sm:aspect-[16/9]">
                    <img
                        src={mobileImg ?? undefined}
                        alt={alt}
                        className="absolute inset-0 w-full h-full object-cover rounded-2xl cursor-pointer"
                        onClick={handleClick}
                    />
                </div> */}

            </div>
        </div>
    );
};

export default HeroBannerDownload;
