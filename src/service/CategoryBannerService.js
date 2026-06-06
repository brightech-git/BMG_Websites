// src/service/CategoryBannerService.js
import PublicUrl from "../api/publicUrl";

/**
 * Fetch category banner based on ItemName and subItemName
 * @param {Object} params - Object with ItemName and subItemName
 */
export const getCategoryBanner = ({ ItemName, subItemName, pages, occasion, gender }) => {
    return PublicUrl.get("/category_image/get", {
        params: { itemName: ItemName, pages: pages, occasion: occasion, gender: gender }
    });
};
