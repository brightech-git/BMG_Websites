"use client"


const HeroBanner = ({
    desktopImg,
    mobileImg,
    alt = "Hero Banner",
    handleClick,
}) => {
    return (
        <div className="relative w-full gap-2 overflow-hidden">
            {/* Desktop & Tablet */}
            <div className="relative gap-2 hidden sm:block w-full aspect-[16/5]">
                <img
                    src={desktopImg ?? undefined}
                    alt={alt}
                    className="absolute gap-2 inset-0 w-full h-full object-cover rounded-2xl"
                    onClick={()=>handleClick()}
                />
            </div>

            {/* Mobile */}
            <div className="relative block sm:hidden w-full aspect-[4/5]">
                <img
                    src={mobileImg ?? undefined}
                    alt={alt}
                    className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                    onClick={() => handleClick()}
                />
            </div>
        </div>
    );
};

export default HeroBanner;