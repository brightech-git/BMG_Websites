// constants/filterConstants.js
export const SORT_OPTIONS = [
    { label: "Price – Low to High", value: "priceLowToHigh" },
    { label: "Price – High to Low", value: "priceHighToLow" },
];

export const PRICE_BRACKETS = [
    { min: 1, max: 3999, label: "Below - ₹3999" },
    { min: 4000, max: 4999, label: "₹4000 - ₹4999" },
    { min: 5000, max: 5999, label: "₹5000 - ₹5999" },
    { min: 6000, max: 100000, label: "₹6000 - Above" },
];

export const WEIGHT_BRACKETS = [
    { min: 0, max: 10, label: "Below - 10 grams" },
    { min: 10, max: 20, label: "10 - 20 grams" },
    { min: 20, max: 30, label: "20 - 30 grams" },
    { min: 30, max: 50, label: "30 - 50 grams" },
    { min: 50, max: 1000, label: "50 - Above" },
];

export const PRICE_RANGE = { min: 0, max: 100000, step: 100 };
export const WEIGHT_RANGE = { min: 0, max: 1000, step: 1 };

export const GENDER_OPTIONS = [
    { label: "Men", value: "Mens" },
    { label: "Women", value: "Ladies" },
];

export const METAL_FINISH_OPTIONS = [
    { value: "GP", label: "GOLD POLISH"},
    { value: "RG", label: "ROSE GOLD" },
    { value: "DT", label: "DUAL TONE"},
    { value: "AQ", label: "ANTIQUE"},
    { value: "GL", label: "GLOSSY"},
    { value: "OX", label: "OXIDISED"},
];