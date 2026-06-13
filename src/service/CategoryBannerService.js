// src/service/CategoryBannerService.js
import PublicUrl from "../api/publicUrl";

/**
 * Fetch category banner based on ItemName and subItemName
 * @param {Object} params - Object with ItemName and subItemName
 */
export const getCategoryBanner = ({ itemId, subItemId, filterIds, pages }) => {
    console.log(itemId, subItemId, filterIds, pages, 'breadcrumb params');

    const params = {
        ...(itemId && { itemId }),
        ...(subItemId && { subItemId }),
        ...(filterIds && { filterIds }),  // "1,3,4,5" string
        ...(pages && { pages }),
    };

    return PublicUrl.get("/category_image/get", { params });
};