export const getProductImages = (imageData, fallbackImage = "/fallback.png") => {
    try {
        if (!imageData) return [fallbackImage];

        const parsedImages = typeof imageData === "string" && imageData.startsWith("[")
            ? JSON.parse(imageData)
            : Array.isArray(imageData) ? imageData : [imageData];

        return parsedImages.length
            ? parsedImages.map(img => img.startsWith("http") ? img : `https://app.bmgjewellers.com${img}`)
            : [fallbackImage];
    } catch (error) {
        console.error("Error parsing product images:", error);
        return [fallbackImage];
    }
};

export const getImage = (imageData, fallbackImage = "/fallback.png") => {
    try {
        if (!imageData) return fallbackImage;

        // If backend accidentally sends JSON array as string
        const parsedImage =
            typeof imageData === "string" && imageData.startsWith("[")
                ? JSON.parse(imageData)[0]
                : Array.isArray(imageData)
                    ? imageData[0]
                    : imageData;

        if (!parsedImage) return fallbackImage;

        return parsedImage.startsWith("http")
            ? parsedImage
            : `https://app.bmgjewellers.com${parsedImage}`;
    } catch (error) {
        console.error("Error parsing image:", error);
        return fallbackImage;
    }
};