// src/service/CategoryBannerService.js
import PublicUrl from "../api/publicUrl";

/**
 * Fetch category banner based on itemName and subItemName
 * @param {Object} params - Object with itemName and subItemName
 */
export const getCategoryBanner = ({ itemName, subItemName }) => {
    return PublicUrl.get("/category_image/get", {
        params: { itemName, subItemName }
    });
};
