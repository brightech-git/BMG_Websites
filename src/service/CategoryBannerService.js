// src/service/CategoryBannerService.js
import PublicUrl from "../api/publicUrl";

/**
 * Fetch category banner based on itemName and subItemName
 * @param {Object} params - Object with itemName and subItemName
 */
export const getCategoryBanner = ({ itemName, subItemName ,pages ,occasion , gender}) => {
    return PublicUrl.get("/category_image/get", {
        params: { itemName:itemName, subItemName:subItemName, pages:pages, occasion:occasion, gender:gender }
    });
};
