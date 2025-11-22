// src/service/CategoryBannerService.js
import PublicUrl from "../api/publicUrl";

/**
 * Fetch category banner based on itemCtrName and subItemName
 * @param {Object} params - Object with itemCtrName and subItemName
 */
export const getCategoryBanner = ({ itemCtrName, subItemName, pages, occasion, gender }) => {
    return PublicUrl.get("/category_image/get", {
        params: { itemName: itemCtrName, pages: pages, occasion: occasion, gender: gender }
    });
};
