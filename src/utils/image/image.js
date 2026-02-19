/* =========================================================
   IMAGEKIT UNIVERSAL HELPER
   Works for product, banner, category, gallery, thumbnails
   ========================================================= */

/* ---------------- CONFIG ---------------- */

const PRODUCT_BASE = "https://ik.imagekit.io/productsAccount";
const HOME_BASE = "https://ik.imagekit.io/homeAccount";

const FALLBACK = "/fallback.png";

/* ---------------- INTERNAL HELPERS ---------------- */

/** Detect which ImageKit account to use */
const detectType = (path) => {
    if (!path) return "home";
    if (path.includes("/products/")) return "product";
    return "home";
};

/** Normalize DB value into array */
const parseImages = (imageData) => {
    if (!imageData) return [];

    try {
        // JSON string
        if (typeof imageData === "string" && imageData.trim().startsWith("[")) {
            return JSON.parse(imageData);
        }

        // Already array
        if (Array.isArray(imageData)) return imageData;

        // Single string
        return [imageData];
    } catch {
        return [];
    }
};

/** Build ImageKit URL */
const buildIKUrl = (
    path,
    width = 600,
    quality = 75,
    blur = false
) => {
    if (!path) return FALLBACK;

    const type = detectType(path);
    const base = type === "product" ? PRODUCT_BASE : HOME_BASE;

    const blurPart = blur ? ",bl-30" : "";

    return `${base}${path}?tr=w-${width},q-${quality},f-auto${blurPart}`;
};

/* ---------------- PUBLIC API ---------------- */

/** Single image */
export const getImage = (imageData, fallback = FALLBACK) => {
    const images = parseImages(imageData);
    if (!images.length) return fallback;

    return buildIKUrl(images[0]);
};

/** Thumbnail (small cards / lists) */
export const getThumbnail = (imageData) => {
    const images = parseImages(imageData);
    if (!images.length) return FALLBACK;

    return buildIKUrl(images[0], 300, 70);
};

/** High quality image (zoom / modal / details page) */
export const getLargeImage = (imageData) => {
    const images = parseImages(imageData);
    if (!images.length) return FALLBACK;

    return buildIKUrl(images[0], 1200, 85);
};

/** Product gallery array */
export const getProductImages = (imageData) => {
    const images = parseImages(imageData);
    if (!images.length) return [FALLBACK];

    return images.map(img => buildIKUrl(img, 800, 80));
};

/** Responsive srcSet */
export const getSrcSet = (imageData) => {
    const images = parseImages(imageData);
    if (!images.length) return "";

    const path = images[0];
    const type = detectType(path);
    const base = type === "product" ? PRODUCT_BASE : HOME_BASE;

    const widths = [300, 500, 700, 900, 1200, 1500];

    return widths
        .map(w => `${base}${path}?tr=w-${w},q-70,f-auto ${w}w`)
        .join(", ");
};

/** Blur placeholder (LQIP) */
export const getBlurImage = (imageData) => {
    const images = parseImages(imageData);
    if (!images.length) return FALLBACK;

    return buildIKUrl(images[0], 40, 40, true);
};

/** Complete responsive props (BEST WAY) */
export const getResponsiveImageProps = (imageData) => ({
    src: getImage(imageData),
    srcSet: getSrcSet(imageData),
    placeholder: getBlurImage(imageData),
});
