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

        let image = imageData;

        // JSON string array
        if (typeof image === "string" && image.trim().startsWith("[")) {
            const parsed = JSON.parse(image);
            image = Array.isArray(parsed) ? parsed[0] : null;
        }

        // Array
        if (Array.isArray(image)) {
            image = image[0];
        }

        if (!image || typeof image !== "string") return fallbackImage;

        // ✅ Backend-relative images ONLY
        if (image.startsWith("/uploads") || image.startsWith("/images")) {
            return `https://app.bmgjewellers.com${image}`;
        }

        // ✅ Everything else (Vite imports, CDN, assets)
        return image;
    } catch (e) {
        console.error("getImage error:", e);
        return fallbackImage;
    }
};
