// src/hooks/useCategoryBanner.js
import { useQuery } from "@tanstack/react-query";
import * as CategoryBannerService from "../../service/CategoryBannerService";

export const useCategoryBanner = ({ itemName, subItemName }) => {
    return useQuery({
        queryKey: ["categoryBanner", itemName, subItemName],
        queryFn: () => CategoryBannerService.getCategoryBanner({ itemName, subItemName }),
        enabled: !!itemName && !!subItemName, // only fetch if both exist
        select: (res) => {
            // return null if no images
            if (res) {
                return res.data;
            } else {
                return null;
            }
        },
    });
};


