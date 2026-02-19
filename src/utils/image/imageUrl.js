const PRODUCT_BASE = "https://ik.imagekit.io/productsAccount";
const HOME_BASE = "https://ik.imagekit.io/homeAccount";

export const getSrcSet = (type, path) => {
    const base = type === "product" ? PRODUCT_BASE : HOME_BASE;

    const widths = [300, 500, 700, 900, 1200, 1500];

    return widths
        .map((w) => `${base}/${path}?tr=w-${w},q-70,f-auto ${w}w`)
        .join(", ");
};

export const getDefaultSrc = (type, path) => {
    const base = type === "product" ? PRODUCT_BASE : HOME_BASE;
    return `${base}/${path}?tr=w-600,q-75,f-auto`;
};
