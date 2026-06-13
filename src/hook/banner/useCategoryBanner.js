// src/hooks/useCategoryBanner.js
import { useQuery } from "@tanstack/react-query";
import * as CategoryBannerService from "../../service/CategoryBannerService";

export const useCategoryBanner = ({ itemId, subItemId, filterIds, pages }) => {
    return useQuery({
        queryKey: ["categoryBanner", itemId, subItemId, filterIds, pages],
        queryFn: () => CategoryBannerService.getCategoryBanner({ itemId, subItemId, filterIds, pages }),
        enabled: !!(itemId || pages || filterIds), // only run if at least one param exists
        select: (res) => {
            if (res) return res.data;
            return null;
        },
    });
};

