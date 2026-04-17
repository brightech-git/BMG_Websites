export const formatNumber = (value, decimalScale = 2) => {
    const num = typeof value === "number" ? value : Number(value);

    if (!Number.isFinite(num)) return "0";

    return num.toFixed(decimalScale);
};