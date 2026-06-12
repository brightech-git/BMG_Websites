// src/service/CategoryBannerService.js
import PublicUrl from "../api/publicUrl";

/**
 * Fetch category banner based on ItemName and subItemName
 * @param {Object} params - Object with ItemName and subItemName
 */
export const getCategoryBanner = ({ itemName, subItemName, pages, occasion, gender }) => {
    console.log(itemName, subItemName, pages, occasion, gender ,'breadcrumb')
    return PublicUrl.get("/category_image/get", {
        params: { itemName: itemName, pages: pages, occasion: occasion, gender: gender }
    });
};
